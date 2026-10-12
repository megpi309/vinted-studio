/**
 * Vinted Studio Pro – Cloudflare Worker
 * Hält deine API-Schlüssel geheim und leitet Anfragen weiter:
 *   POST /analyze   → Google Gemini (Fotos erkennen)
 *   POST /removebg  → remove.bg (Hintergrund entfernen)
 *
 * Einstellungen im Cloudflare-Dashboard (Settings → Variables and Secrets):
 *   GEMINI_API_KEY     (Secret)  Schlüssel aus Google AI Studio
 *   REMOVEBG_API_KEY   (Secret)  Schlüssel von remove.bg
 *   ACCESS_CODE        (Secret)  Zugangscode für dich und deine Freunde
 *   ALLOWED_ORIGINS    (Text)    z. B. https://deinname.github.io
 * Optional:
 *   GEMINI_MODEL, GEMINI_MODEL_QUICK   eigene Modellnamen
 *   REMOVEBG_SIZE                      "preview" (kostenlos, Standard) oder "auto" (kostet Credits)
 */
export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = String(env.ALLOWED_ORIGINS || "*").split(",").map((s) => s.trim().replace(/\/+$/, "")).filter(Boolean);
    const allowOrigin = allowed.includes("*") ? "*" : allowed.includes(origin) ? origin : allowed[0] || "";
    const cors = {
      "Access-Control-Allow-Origin": allowOrigin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Access-Code",
      "Access-Control-Max-Age": "86400",
      Vary: "Origin",
    };
    const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { ...cors, "Content-Type": "application/json" } });
    const err = (code, message, status) => json({ error: { code, message: message || code } }, status);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return err("method", "Nur POST erlaubt", 405);
    if (!env.ACCESS_CODE || request.headers.get("X-Access-Code") !== env.ACCESS_CODE) return err("unauthorized", "Falscher Zugangscode", 401);

    let body;
    try { body = await request.json(); } catch (e) { return err("bad_request", "Ungültige Anfrage", 400); }
    const path = new URL(request.url).pathname.replace(/\/+$/, "");
    try {
      if (path.endsWith("/analyze")) return await analyze(body, env, json, err);
      if (path.endsWith("/removebg")) return await removeBg(body, env, cors, err);
    } catch (e) {
      return err("worker_error", String(e && e.message || e), 500);
    }
    return err("not_found", "Unbekannter Pfad", 404);
  },
};

async function analyze(body, env, json, err) {
  if (!env.GEMINI_API_KEY) return err("config", "GEMINI_API_KEY fehlt", 500);
  const quick = body.tier === "quick";
  // Erstes verfügbares Modell gewinnt. Die "-latest"-Namen zeigen immer auf das aktuelle kostenlose Flash-Modell.
  const models = [...new Set([
    quick ? env.GEMINI_MODEL_QUICK : env.GEMINI_MODEL,
    quick ? "gemini-flash-lite-latest" : "gemini-flash-latest",
    quick ? "gemini-2.5-flash-lite" : "gemini-2.5-flash",
  ].filter(Boolean))];
  const parts = (Array.isArray(body.images) ? body.images : []).slice(0, 10)
    .map((i) => ({ inline_data: { mime_type: i.mime || "image/jpeg", data: String(i.data || "") } }));
  parts.push({ text: String(body.prompt || "") });
  let last = { status: 0, message: "" };
  for (const model of models) {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
      body: JSON.stringify({ contents: [{ role: "user", parts }], generationConfig: { temperature: 0.2, responseMimeType: "application/json" } }),
    });
    const data = await r.json().catch(() => ({}));
    if (r.ok) {
      const text = ((data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) || []).map((p) => p.text || "").join("");
      return json({ text, model });
    }
    last = { status: r.status, message: (data.error && data.error.message) || "" };
    if (r.status === 404) continue;
    if (r.status === 429) return err("rate_limited", last.message, 429);
    if (r.status === 400 && /api key/i.test(last.message)) return err("bad_key", last.message, 502);
    if (r.status === 403) return err("bad_key", last.message, 502);
    return err("gemini_error", last.message, 502);
  }
  return err("model_not_found", last.message || "Kein Gemini-Modell verfügbar", 502);
}

async function removeBg(body, env, cors, err) {
  if (!env.REMOVEBG_API_KEY) return err("config", "REMOVEBG_API_KEY fehlt", 500);
  if (!body.image) return err("bad_request", "Kein Bild", 400);
  const form = new FormData();
  form.append("image_file_b64", String(body.image));
  form.append("size", env.REMOVEBG_SIZE || "preview");
  form.append("type", "auto");
  form.append("format", "png");
  form.append("channels", "alpha");
  const r = await fetch("https://api.remove.bg/v1.0/removebg", { method: "POST", headers: { "X-Api-Key": env.REMOVEBG_API_KEY }, body: form });
  if (!r.ok) {
    const d = await r.json().catch(() => ({}));
    const m = (d.errors && d.errors[0] && (d.errors[0].title || d.errors[0].code)) || "";
    if (r.status === 402) return err("removebg_quota", m, 402);
    if (r.status === 429) return err("rate_limited", m, 429);
    if (r.status === 403) return err("removebg_key", m, 502);
    return err("removebg_failed", m, 502);
  }
  return new Response(r.body, { headers: { ...cors, "Content-Type": "image/png" } });
}
