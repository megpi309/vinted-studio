/*
 * Vinted Studio Pro – App-Code
 * Diese Datei wird beim Öffnen der Seite automatisch übersetzt (Babel), du kannst sie also direkt bearbeiten.
 * Wichtige Stellen:
 *   CATEGORIES / BRANDS        Kategorien und Marken-Preisfaktoren
 *   TEXT_STYLES, buildTitle,
 *   buildDescription           Textstile und Aufbau der Beschreibung
 *   LOOKS                      Bild-Looks (Werte von -1 bis 1)
 */
const { useState, useEffect, useRef, useMemo, useCallback, useLayoutEffect } = React;
const L = window.LucideReact || {};
const I = (n) => L[n] || (() => null);
const Camera = I("Camera"), Images = I("Images"), Sparkles = I("Sparkles"), Scissors = I("Scissors"),
  Sun = I("Sun"), Copy = I("Copy"), Check = I("Check"), Save = I("Save"), Trash2 = I("Trash2"),
  ChevronUp = I("ChevronUp"), ChevronDown = I("ChevronDown"), ChevronLeft = I("ChevronLeft"),
  ChevronRight = I("ChevronRight"), X = I("X"), Search = I("Search"), Tag = I("Tag"), Shirt = I("Shirt"),
  Footprints = I("Footprints"), ShoppingBag = I("ShoppingBag"), Package = I("Package"), Radar = I("Radar"),
  ExternalLink = I("ExternalLink"), Info = I("Info"), RefreshCw = I("RefreshCw"), Loader2 = I("Loader2"),
  Download = I("Download"), Pencil = I("Pencil"), Plus = I("Plus"), Eye = I("Eye"), Layers = I("Layers"),
  AlertTriangle = I("AlertTriangle"), ClipboardCheck = I("ClipboardCheck"), Archive = I("Archive"), Ruler = I("Ruler");

/* ---------------- Daten ---------------- */
const CATEGORIES = [
  { id: "Oberteil", icon: Shirt, base: 10 },
  { id: "Jacke", icon: Layers, base: 24 },
  { id: "Hose", icon: Ruler, base: 14 },
  { id: "Kleid", icon: Sparkles, base: 14 },
  { id: "Schuhe", icon: Footprints, base: 22 },
  { id: "Tasche", icon: ShoppingBag, base: 18 },
];
const SLOTS = [
  { id: "front", label: "Titelbild", hint: "Das ganze Teil von vorne. Flach hinlegen, glatt streichen, ruhiger Untergrund." },
  { id: "back", label: "Rückseite", hint: "Umdrehen und gleich ausrichten wie beim Titelbild." },
  { id: "label", label: "Etikett", hint: "Marken- und Größenetikett nah und scharf in den Rahmen." },
  { id: "detail", label: "Detail", hint: "Material, Muster, Logo oder eine Besonderheit ganz nah." },
];
const slotIndex = (s) => { const i = SLOTS.findIndex((x) => x.id === s); return i < 0 ? 99 : i; };
const slotLabel = (s) => SLOTS.find((x) => x.id === s)?.label || "Extra";

const CONDITIONS = ["Neu mit Etikett", "Neu ohne Etikett", "Sehr gut", "Gut", "Zufriedenstellend"];
const COND_MULT = { "Neu mit Etikett": 1.6, "Neu ohne Etikett": 1.35, "Sehr gut": 1, "Gut": 0.8, "Zufriedenstellend": 0.55 };
const COND_TEXT = {
  "Neu mit Etikett": "ungetragen, Originaletikett vorhanden",
  "Neu ohne Etikett": "ungetragen, ohne Etikett",
  "Sehr gut": "kaum getragen, gepflegt",
  "Gut": "getragen, gut erhalten",
  "Zufriedenstellend": "deutliche Gebrauchsspuren",
};
const BRANDS = {
  "Nike": 1.3, "Adidas": 1.2, "Carhartt": 1.6, "Carhartt WIP": 1.7, "Ralph Lauren": 1.7, "Polo Ralph Lauren": 1.7,
  "Tommy Hilfiger": 1.4, "Lacoste": 1.5, "Levi's": 1.3, "Zara": 0.8, "H&M": 0.5, "Mango": 0.75, "Bershka": 0.55,
  "Pull&Bear": 0.55, "Stradivarius": 0.55, "Primark": 0.35, "Shein": 0.3, "Uniqlo": 0.8, "COS": 1.1,
  "& Other Stories": 1.1, "Massimo Dutti": 1.1, "Weekday": 0.8, "Arket": 1.0, "Puma": 0.9, "New Balance": 1.3,
  "Asics": 1.1, "Converse": 1.0, "Vans": 0.95, "Dr. Martens": 1.6, "Birkenstock": 1.4, "Salomon": 1.8,
  "The North Face": 1.8, "Patagonia": 1.9, "Arc'teryx": 3.0, "Stone Island": 3.5, "Stüssy": 2.0, "Supreme": 2.5,
  "Champion": 0.9, "Fila": 0.8, "Diesel": 1.3, "Calvin Klein": 1.2, "Guess": 1.0, "Hugo Boss": 1.5,
  "Moncler": 5.0, "Burberry": 4.0, "Gucci": 6.0, "Prada": 5.5, "Michael Kors": 1.6, "Coach": 1.8, "Longchamp": 2.0,
};
const brandMult = (b) => {
  if (!b) return 1;
  const k = Object.keys(BRANDS).find((x) => x.toLowerCase() === b.trim().toLowerCase());
  return k ? BRANDS[k] : 1;
};
const brandKnown = (b) => !!b && Object.keys(BRANDS).some((x) => x.toLowerCase() === b.trim().toLowerCase());
const materialMult = (m = "") => {
  const s = m.toLowerCase();
  if (s.includes("kaschmir") || s.includes("cashmere")) return 1.4;
  if (s.includes("seide")) return 1.25;
  if (s.includes("wildleder")) return 1.2;
  if (s.includes("leder") && !s.includes("kunst")) return 1.3;
  if (s.includes("wolle") || s.includes("merino")) return 1.15;
  if (s.includes("leinen")) return 1.1;
  if (s.includes("polyester")) return 0.9;
  return 1;
};
const COLORS = ["Schwarz", "Weiß", "Grau", "Beige", "Creme", "Braun", "Blau", "Hellblau", "Navy", "Denim", "Grün", "Oliv", "Rot", "Bordeaux", "Rosa", "Lila", "Gelb", "Orange", "Mehrfarbig"];
const MATERIALS = ["Baumwolle", "Polyester", "Wolle", "Kaschmir", "Leinen", "Seide", "Viskose", "Denim", "Leder", "Kunstleder", "Wildleder", "Nylon", "Fleece", "Cord", "Mischgewebe"];
function sizesFor(cat) {
  if (cat === "Schuhe") { const a = []; for (let s = 35; s <= 47; s += 0.5) a.push(String(s).replace(".", ",")); return a; }
  if (cat === "Tasche") return ["One Size"];
  if (cat === "Hose") return ["XS", "S", "M", "L", "XL", "XXL", "W26", "W28", "W30", "W31", "W32", "W33", "W34", "W36", "W38", "34", "36", "38", "40", "42", "44", "46"];
  return ["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "34", "36", "38", "40", "42", "44", "46"];
}
const sizeText = (cat, size) => (!size ? "" : cat === "Schuhe" && !/eu/i.test(size) ? `EU ${size}` : size);

/* ---------------- Preis ---------------- */
function formulaPrice(f) {
  const base = CATEGORIES.find((c) => c.id === f.category)?.base || 14;
  return base * brandMult(f.brand) * (COND_MULT[f.condition] || 1) * materialMult(f.material);
}
const roundPrice = (v) => Math.max(3, Math.round(v));

/* ---------------- Text-Generator ---------------- */
const TEXT_STYLES = {
  standard: { label: "Standard", sub: "sachlich und klar" },
  vintage: { label: "Vintage", sub: "Retro, zeitlos" },
  y2k: { label: "Y2K", sub: "2000er, trendy" },
};
const DEFAULT_TEXT_OPTS = { bullets: true, material: true, condition: true, details: true, flaws: true, measurements: true, bundle: false, shipping: true, hashtags: true, hashtagsInText: false, emojis: false, closing: "" };
const TEXT_OPT_LABELS = [
  ["bullets", "Stichpunkte statt Fließtext"],
  ["material", "Material nennen"],
  ["condition", "Zustand nennen"],
  ["details", "Merkmale nennen"],
  ["flaws", "Hinweis auf Mängel"],
  ["measurements", "„Maße auf Anfrage“"],
  ["bundle", "Kombi-Rabatt erwähnen"],
  ["shipping", "Versandhinweis"],
  ["hashtags", "Hashtags erstellen"],
  ["hashtagsInText", "Hashtags in die Beschreibung"],
  ["emojis", "Emojis verwenden"],
];
const GARMENT_END = /(jacket|jacke|hoodie|sweater|sweatshirt|pullover|shirt|jeans|pants|hose|sneakers?|boots?|dress|kleid|bag|tasche|coat|mantel|vest|weste|parka|blazer|skirt|rock)$/i;
const typeWord = (f) => (f.model && GARMENT_END.test(f.model.trim()) ? "" : f.itemType || (f.model ? "" : f.category));
const hasWord = (f, w) => [f.brand, f.model, f.itemType, f.style].some((x) => new RegExp(w, "i").test(x || ""));

// Titel-Formel: [Stil] + Marke + Modell + Artikel + Farbe + Größe (+ NEU)
function buildTitle(f, style = "standard") {
  const size = f.size ? `Gr. ${sizeText(f.category, f.size)}` : "";
  const isNew = f.condition === "Neu mit Etikett" ? "NEU mit Etikett" : f.condition === "Neu ohne Etikett" ? "NEU" : "";
  const prefix = style === "vintage" && !hasWord(f, "vintage") ? "Vintage" : style === "y2k" && !hasWord(f, "y2k") ? "Y2K" : "";
  const core = [prefix, f.brand, f.model, typeWord(f), f.color, size].filter(Boolean);
  let t = core.join(" ");
  if (isNew && (t + " " + isNew).length <= 70) t += " " + isNew;
  return t.replace(/\s+/g, " ").trim().slice(0, 70);
}

function buildDescription(f, style = "standard", o = DEFAULT_TEXT_OPTS) {
  const E = (e) => (o.emojis ? e + " " : "");
  const name = [f.brand, f.model, typeWord(f)].filter(Boolean).join(" ") || "Artikel";
  const sz = f.size ? sizeText(f.category, f.size) : "";
  const who = f.gender ? ` (${f.gender})` : "";
  let intro;
  if (style === "vintage") intro = `${E("🕰️")}${hasWord(f, "vintage") ? "" : "Vintage "}${name}${f.color ? ` in ${f.color}` : ""}${sz ? `, Größe ${sz}${who}` : ""}. Ein zeitloses Teil mit echtem Retro-Charme.`;
  else if (style === "y2k") intro = `${E("🦋")}${name} im Y2K-Style${f.color ? `, ${f.color}` : ""}${sz ? `, Größe ${sz}${who}` : ""}. Perfekt für den 2000er-Look.`;
  else intro = `${name}${f.color ? ` in ${f.color}` : ""}${sz ? `, Größe ${sz}${who}` : ""}.`;
  const lines = [intro.replace(/\s+/g, " ").trim()];

  const facts = [];
  if (o.material && f.material) facts.push(`${E("🧵")}Material: ${f.material}`);
  if (o.condition && f.condition) {
    const hasFlaws = !!(f.flaws || "").trim();
    facts.push(`${E("✨")}Zustand: ${f.condition} – ${COND_TEXT[f.condition] || ""}${hasFlaws ? "" : ", ohne Mängel"}`);
  }
  if (o.details) (f.details || "").split("\n").map((s) => s.trim()).filter(Boolean).forEach((d) => facts.push(d));
  if (facts.length) {
    lines.push("");
    if (o.bullets) facts.forEach((x) => lines.push(`- ${x}`));
    else lines.push(facts.map((x) => x.replace(/\.$/, "")).join(". ") + ".");
  }
  const fl = (f.flaws || "").split("\n").map((s) => s.trim()).filter(Boolean);
  if (o.flaws && fl.length) { lines.push(""); lines.push(`${E("⚠️")}Hinweis: ${fl.join(", ")}. Bitte die Fotos beachten.`); }
  if ((f.notes || "").trim()) { lines.push(""); lines.push(f.notes.trim()); }

  const end = [];
  if (o.measurements) end.push(`${E("📏")}Maße gerne auf Anfrage.`);
  if (o.bundle) end.push(`${E("🛍️")}Kombi-Rabatt beim Kauf mehrerer Teile – schau gern in meinen Kleiderschrank.`);
  if (o.shipping) end.push(E("📦") + (style === "vintage" ? "Wird sorgfältig verpackt und zeitnah verschickt." : style === "y2k" ? "Schneller Versand, gut verpackt." : "Versand zeitnah und sorgfältig verpackt."));
  if ((o.closing || "").trim()) end.push(o.closing.trim());
  if (end.length) { lines.push(""); end.forEach((x) => lines.push(x)); }
  if (o.hashtags && o.hashtagsInText) { lines.push(""); lines.push(buildHashtags(f, style)); }
  return lines.join("\n");
}
const tagify = (s) => (s || "").toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z0-9]/g, "");
function buildHashtags(f, style = "standard") {
  const extra = style === "vintage" ? ["vintage", "retro"] : style === "y2k" ? ["y2k", "2000s"] : [];
  const raw = [f.brand, f.model, f.itemType, ...extra, f.category, f.color, (f.material || "").replace(/[0-9%]/g, " ").trim().split(/[ ,/]+/)[0], f.style, f.gender, "vinted", "secondhand"];
  const out = [];
  raw.forEach((r) => { const t = tagify(r); if (t && t.length > 1 && !out.includes(t)) out.push(t); });
  return out.slice(0, 10).map((t) => "#" + t).join(" ");
}

const SettingsIcon = I("Settings"), GripVertical = I("GripVertical"), Brush = I("Brush"), Eraser = I("Eraser"), Hand = I("Hand"), ArrowDownUp = I("ArrowDownUp"), SlidersH = I("SlidersHorizontal"), Share = I("Share");
const MAX_PHOTOS = 10;

/* ---------------- Bild-Werkzeuge ---------------- */
const loadImg = (src) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
function drawScaled(img, max) {
  const w0 = img.naturalWidth || img.videoWidth || img.width, h0 = img.naturalHeight || img.videoHeight || img.height;
  const s = Math.min(1, max / Math.max(w0, h0));
  const c = document.createElement("canvas");
  c.width = Math.round(w0 * s); c.height = Math.round(h0 * s);
  c.getContext("2d", { willReadFrequently: true }).drawImage(img, 0, 0, c.width, c.height);
  return c;
}
async function fileToDataURL(file, max = 1600) {
  const url = URL.createObjectURL(file);
  try { const img = await loadImg(url); return drawScaled(img, max).toDataURL("image/jpeg", 0.9); }
  finally { URL.revokeObjectURL(url); }
}
// ohne fetch(): data:-URLs sind auf veröffentlichten Seiten gesperrt
const dataURLToBlob = async (d) => {
  const comma = d.indexOf(",");
  const mime = (d.slice(0, comma).match(/data:([^;,]+)/) || [])[1] || "image/jpeg";
  const bin = atob(d.slice(comma + 1));
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: mime });
};
async function shrink(dataURL, max, keepAlpha) {
  const img = await loadImg(dataURL);
  const c = drawScaled(img, max);
  return keepAlpha ? c.toDataURL("image/png") : c.toDataURL("image/jpeg", 0.82);
}
const tick = (ms = 30) => new Promise((r) => setTimeout(r, ms));

/* Behalte nur große Vordergrund-Teile (oder solche, die sichere Vordergrund-Pixel enthalten) */
function keepBigComponents(mask, w, h, sure) {
  const N = w * h, lab = new Int32Array(N), q = new Int32Array(N); const info = [null];
  for (let s = 0; s < N; s++) {
    if (!mask[s] || lab[s]) continue;
    const id = info.length; let qh = 0, qt = 0, sz = 0, hasSure = false; q[qt++] = s; lab[s] = id;
    while (qh < qt) {
      const i = q[qh++]; sz++; if (sure && sure[i]) hasSure = true;
      const x = i % w;
      if (x > 0 && mask[i - 1] && !lab[i - 1]) { lab[i - 1] = id; q[qt++] = i - 1; }
      if (x < w - 1 && mask[i + 1] && !lab[i + 1]) { lab[i + 1] = id; q[qt++] = i + 1; }
      if (i >= w && mask[i - w] && !lab[i - w]) { lab[i - w] = id; q[qt++] = i - w; }
      if (i < N - w && mask[i + w] && !lab[i + w]) { lab[i + w] = id; q[qt++] = i + w; }
    }
    info.push({ sz, hasSure });
  }
  const largest = Math.max(0, ...info.slice(1).map((x) => x.sz));
  for (let i = 0; i < N; i++) if (mask[i]) {
    const c = info[lab[i]];
    const keep = sure ? c.hasSure || c.sz > largest * 0.25 : c.sz >= largest * 0.15 || c.sz >= N * 0.02;
    if (!keep) mask[i] = 0;
  }
}

function chamfer(P, w, h, cls) {
  const N = w * h, d = new Float32Array(N), INF = 1e9, D2 = 1.414;
  for (let i = 0; i < N; i++) d[i] = P[i] === cls ? INF : 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x; if (!d[i]) continue; let v = d[i];
    if (x > 0) v = Math.min(v, d[i - 1] + 1);
    if (y > 0) { v = Math.min(v, d[i - w] + 1); if (x > 0) v = Math.min(v, d[i - w - 1] + D2); if (x < w - 1) v = Math.min(v, d[i - w + 1] + D2); }
    d[i] = v;
  }
  for (let y = h - 1; y >= 0; y--) for (let x = w - 1; x >= 0; x--) {
    const i = y * w + x; if (!d[i]) continue; let v = d[i];
    if (x < w - 1) v = Math.min(v, d[i + 1] + 1);
    if (y < h - 1) { v = Math.min(v, d[i + w] + 1); if (x < w - 1) v = Math.min(v, d[i + w + 1] + D2); if (x > 0) v = Math.min(v, d[i + w - 1] + D2); }
    d[i] = v;
  }
  return d;
}

/* Pinsel-Masken und Zwischenspeicher pro Foto (nicht im React-State, weil groß) */
const IMG_CACHE = new Map();
const BRUSHES = new Map();
function getBrush(id) {
  const e = IMG_CACHE.get(id); if (!e?.base) return null;
  let b = BRUSHES.get(id);
  if (!b || b.width !== e.base.width || b.height !== e.base.height) {
    b = document.createElement("canvas"); b.width = e.base.width; b.height = e.base.height; BRUSHES.set(id, b);
  }
  return b;
}
function forgetPhoto(id) { IMG_CACHE.delete(id); BRUSHES.delete(id); }

function boxMean(src, w, h, r) {
  const W = w + 1, I = new Float64Array(W * (h + 1));
  for (let y = 0; y < h; y++) { let row = 0; for (let x = 0; x < w; x++) { row += src[y * w + x]; I[(y + 1) * W + x + 1] = I[y * W + x + 1] + row; } }
  const out = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    const y0 = Math.max(0, y - r), y1 = Math.min(h - 1, y + r);
    for (let x = 0; x < w; x++) {
      const x0 = Math.max(0, x - r), x1 = Math.min(w - 1, x + r);
      out[y * w + x] = (I[(y1 + 1) * W + x1 + 1] - I[y0 * W + x1 + 1] - I[(y1 + 1) * W + x0] + I[y0 * W + x0]) / ((x1 - x0 + 1) * (y1 - y0 + 1));
    }
  }
  return out;
}
function guidedFilter(I, p, w, h, r, eps) {
  const N = w * h, Ip = new Float32Array(N), II = new Float32Array(N);
  for (let i = 0; i < N; i++) { Ip[i] = I[i] * p[i]; II[i] = I[i] * I[i]; }
  const mI = boxMean(I, w, h, r), mp = boxMean(p, w, h, r), mIp = boxMean(Ip, w, h, r), mII = boxMean(II, w, h, r);
  const A = new Float32Array(N), B = new Float32Array(N);
  for (let i = 0; i < N; i++) { const v = mII[i] - mI[i] * mI[i]; A[i] = (mIp[i] - mI[i] * mp[i]) / (v + eps); B[i] = mp[i] - A[i] * mI[i]; }
  const mA = boxMean(A, w, h, r), mB = boxMean(B, w, h, r);
  const q = new Float32Array(N); for (let i = 0; i < N; i++) q[i] = mA[i] * I[i] + mB[i];
  return q;
}
// Wahrscheinlichkeitskarte → saubere, weiche Alpha-Maske an echten Bildkanten
function finalizeAlpha(base, M, tol = 1) {
  const w = base.width, h = base.height, N = w * h;
  const p = base.getContext("2d", { willReadFrequently: true }).getImageData(0, 0, w, h).data;
  const I = new Float32Array(N); for (let i = 0; i < N; i++) I[i] = (0.299 * p[i * 4] + 0.587 * p[i * 4 + 1] + 0.114 * p[i * 4 + 2]) / 255;
  const r = Math.max(3, Math.round(Math.max(w, h) / 170));
  const Ms = new Float32Array(N); for (let i = 0; i < N; i++) Ms[i] = Math.min(1, Math.max(0, (M[i] - 0.2) / 0.6));
  const q = guidedFilter(I, Ms, w, h, r, 2e-3);
  const c = 0.5 + (tol - 1) * 0.3;
  const alpha = new Uint8ClampedArray(N), bin = new Uint8Array(N);
  for (let i = 0; i < N; i++) { const a = Math.min(1, Math.max(0, (q[i] - c) * 3.2 + 0.5)); alpha[i] = Math.round(a * 255); bin[i] = a > 0.5 ? 1 : 0; }
  // Unsichere Bereiche, die weit vom sicheren Kern entfernt sind (z. B. Teppichreste am Saum), entfernen
  const core = new Uint8Array(N); for (let i = 0; i < N; i++) core[i] = M[i] > 0.85 ? 1 : 0;
  const dCore = chamfer(core, w, h, 0);
  const ro = Math.max(4, Math.round(Math.max(w, h) * 0.014));
  for (let i = 0; i < N; i++) if (bin[i] && M[i] < 0.8 && dCore[i] > ro) bin[i] = 0;
  keepBigComponents(bin, w, h, null);
  const keep = boxMean(Float32Array.from(bin), w, h, 2);
  for (let i = 0; i < N; i++) if (!bin[i] && keep[i] === 0) alpha[i] = 0; else if (!bin[i] && alpha[i] > 127) alpha[i] = 0;
  return alpha;
}

function composite(base, alpha, brush, bg) {
  const w = base.width, h = base.height, N = w * h;
  const src = base.getContext("2d", { willReadFrequently: true }).getImageData(0, 0, w, h);
  const A = new Uint8ClampedArray(alpha);
  if (brush) {
    const b = brush.getContext("2d", { willReadFrequently: true }).getImageData(0, 0, w, h).data;
    for (let i = 0; i < N; i++) if (b[i * 4 + 3] > 40) { if (b[i * 4] > 128) A[i] = 0; else if (b[i * 4 + 1] > 128) A[i] = 255; }
  }
  const out = new ImageData(new Uint8ClampedArray(src.data), w, h), o = out.data;
  // Kantenfarbe säubern: Hintergrundfarbe aus halbtransparenten Randpixeln herausrechnen
  const inv = new Float32Array(N); for (let i = 0; i < N; i++) inv[i] = 1 - A[i] / 255;
  const rr = Math.max(4, Math.round(Math.max(w, h) / 90));
  const den = boxMean(inv, w, h, rr);
  for (let k = 0; k < 3; k++) {
    const ch = new Float32Array(N); for (let i = 0; i < N; i++) ch[i] = (src.data[i * 4 + k] / 255) * inv[i];
    const num = boxMean(ch, w, h, rr);
    for (let i = 0; i < N; i++) {
      const a = A[i] / 255; if (a <= 0.02 || a >= 0.97) continue;
      const B = den[i] > 1e-4 ? num[i] / den[i] : 0;
      const F = (src.data[i * 4 + k] / 255 - (1 - a) * B) / a;
      o[i * 4 + k] = Math.round(Math.min(1, Math.max(0, F)) * 255);
    }
  }
  let fg = 0, minX = w, minY = h, maxX = 0, maxY = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x; o[i * 4 + 3] = A[i];
    if (A[i] > 12) { fg++; if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
  }
  const full = document.createElement("canvas"); full.width = w; full.height = h;
  full.getContext("2d").putImageData(out, 0, 0);
  if (!fg) return { full, cropped: full, ratio: 0 };
  const pad = Math.round(Math.max(maxX - minX, maxY - minY) * 0.04);
  minX = Math.max(0, minX - pad); minY = Math.max(0, minY - pad); maxX = Math.min(w - 1, maxX + pad); maxY = Math.min(h - 1, maxY + pad);
  const cw = maxX - minX + 1, chh = maxY - minY + 1;
  let cropped = document.createElement("canvas"); cropped.width = cw; cropped.height = chh;
  cropped.getContext("2d").drawImage(full, minX, minY, cw, chh, 0, 0, cw, chh);
  if (bg && bg !== "transparent") {
    // Vinted-fertig: 3:4, zentriert, weicher Schatten
    const H = Math.round(Math.max(chh / 0.84, ((cw / 0.84) * 4) / 3)), W = Math.round((H * 3) / 4);
    const f = document.createElement("canvas"); f.width = W; f.height = H;
    const fx = f.getContext("2d");
    fx.fillStyle = bg === "grey" ? "#f1f1f0" : "#ffffff"; fx.fillRect(0, 0, W, H);
    fx.shadowColor = "rgba(0,0,0,0.16)"; fx.shadowBlur = H * 0.03; fx.shadowOffsetY = H * 0.012;
    fx.drawImage(cropped, Math.round((W - cw) / 2), Math.round((H - chh) / 2));
    cropped = f;
  }
  return { full, cropped, ratio: fg / N };
}

/* ---------------- Bild-Looks: nur klassische Regler, wie in jeder Foto-App ---------------- */
const ADJ_SLIDERS = [
  ["exposure", "Helligkeit"],
  ["contrast", "Kontrast"],
  ["highlights", "Lichter"],
  ["shadows", "Schatten"],
  ["saturation", "Sättigung"],
  ["warmth", "Wärme"],
];
const ZERO_ADJ = { wb: 0, exposure: 0, contrast: 0, highlights: 0, shadows: 0, saturation: 0, warmth: 0, fade: 0 };
// Werte von -1 bis 1. Die Looks orientieren sich an Shop-Fotos großer Modeketten: hell, neutral, ruhig, nie knallig.
const LOOKS = [
  { id: "original", label: "Original", sub: "unbearbeitet", v: null },
  { id: "clean", label: "Clean Studio", sub: "hell, neutral, ruhig", v: { wb: 0.7, exposure: 0.35, contrast: -0.15, highlights: -0.35, shadows: 0.45, saturation: -0.2, warmth: -0.05, fade: 0 } },
  { id: "catalog", label: "Katalog", sub: "klar und frisch", v: { wb: 0.6, exposure: 0.25, contrast: 0.15, highlights: -0.25, shadows: 0.3, saturation: -0.08, warmth: 0, fade: 0 } },
  { id: "editorial", label: "Soft Editorial", sub: "warm, matt, gedämpft", v: { wb: 0.5, exposure: 0.15, contrast: -0.3, highlights: -0.4, shadows: 0.35, saturation: -0.3, warmth: 0.25, fade: 0.35 } },
  { id: "cool", label: "Kühl Minimal", sub: "hell, leicht kühl", v: { wb: 0.7, exposure: 0.3, contrast: 0.05, highlights: -0.3, shadows: 0.3, saturation: -0.25, warmth: -0.25, fade: 0.1 } },
];
function applyAdjust(canvas, v) {
  if (!v) return canvas;
  const a = { ...ZERO_ADJ, ...v };
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const { width: w, height: h } = canvas;
  const d = ctx.getImageData(0, 0, w, h), p = d.data;
  // sanfter automatischer Weißabgleich (Grauwelt), begrenzt damit nichts verfärbt
  let kr = 1, kg = 1, kb = 1;
  if (a.wb > 0) {
    let r = 0, g = 0, b = 0, n = 0;
    for (let i = 0; i < p.length; i += 32) { r += p[i]; g += p[i + 1]; b += p[i + 2]; n++; }
    r /= n; g /= n; b /= n; const avg = (r + g + b) / 3;
    const cl = (x) => Math.min(1.12, Math.max(0.9, x));
    kr = cl(1 + (avg / r - 1) * a.wb); kg = cl(1 + (avg / g - 1) * a.wb); kb = cl(1 + (avg / b - 1) * a.wb);
  }
  kr *= 1 + a.warmth * 0.08; kb *= 1 - a.warmth * 0.08;
  const lut = new Uint8ClampedArray(256);
  for (let i = 0; i < 256; i++) {
    let y = i / 255;
    const e = a.exposure * 0.6;
    y = e >= 0 ? 1 - Math.pow(1 - y, 1 + e) : Math.pow(y, 1 - e);           // Helligkeit ohne Ausfressen
    y += a.shadows * 0.55 * y * Math.pow(1 - y, 2);                          // Schatten aufhellen/abdunkeln
    y += a.highlights * 0.55 * y * y * (1 - y);                              // Lichter dämpfen/anheben
    y -= (a.contrast * 0.6 * Math.sin(2 * Math.PI * y)) / (2 * Math.PI);    // weiche S-Kurve
    y = a.fade * 0.08 + y * (1 - a.fade * 0.08);                             // matte Tiefen
    lut[i] = Math.round(Math.min(1, Math.max(0, y)) * 255);
  }
  const sat = 1 + a.saturation * 0.45;
  for (let i = 0; i < p.length; i += 4) {
    const R = lut[Math.min(255, p[i] * kr) | 0], G = lut[Math.min(255, p[i + 1] * kg) | 0], B = lut[Math.min(255, p[i + 2] * kb) | 0];
    const Y = 0.299 * R + 0.587 * G + 0.114 * B;
    p[i] = Y + (R - Y) * sat; p[i + 1] = Y + (G - Y) * sat; p[i + 2] = Y + (B - Y) * sat;
  }
  ctx.putImageData(d, 0, 0);
  return canvas;
}

/* ---------------- Verbindung zum eigenen Worker (Gemini + remove.bg) ---------------- */
function getSettings() {
  let s = {}; try { s = JSON.parse(localStorage.getItem("vsp:settings") || "{}"); } catch (e) {}
  return { workerUrl: String(s.workerUrl || window.VSP_CONFIG?.workerUrl || "").trim().replace(/\/+$/, ""), code: String(s.code || "").trim() };
}
function saveSettings(s) { try { localStorage.setItem("vsp:settings", JSON.stringify(s)); } catch (e) {} }
const fail = (code, message) => Object.assign(new Error(message || code), { code });
function blobToB64(b) {
  return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(",")[1] || ""); r.onerror = () => rej(r.error); r.readAsDataURL(b); });
}
async function callWorker(path, payload, signal) {
  const { workerUrl, code } = getSettings();
  if (!workerUrl) throw fail("no_worker");
  let r;
  try { r = await fetch(workerUrl + path, { method: "POST", headers: { "Content-Type": "application/json", "X-Access-Code": code }, body: JSON.stringify(payload), signal }); }
  catch (e) { if (e?.name === "AbortError") throw fail("cancelled"); throw fail("network", e?.message); }
  if (!r.ok) { let d = {}; try { d = await r.json(); } catch (e) {} throw fail(d?.error?.code || `http_${r.status}`, d?.error?.message); }
  return r;
}
const AI = {
  configured: () => !!getSettings().workerUrl,
  async sample(prompt, opts = {}) {
    const images = await Promise.all((opts.images || []).map(async (b) => ({ mime: b.type || "image/jpeg", data: await blobToB64(b) })));
    const r = await callWorker("/analyze", { prompt, images, tier: opts.modelTier || "default" }, opts.signal);
    return r.json();
  },
  async removeBg(blob, signal) {
    const r = await callWorker("/removebg", { image: await blobToB64(blob) }, signal);
    return r.blob();
  },
};
async function maskFromRemoveBg(base, pngBlob) {
  const url = URL.createObjectURL(pngBlob);
  try {
    const img = await loadImg(url);
    const w = base.width, h = base.height;
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    const cx = c.getContext("2d", { willReadFrequently: true });
    cx.imageSmoothingQuality = "high"; cx.drawImage(img, 0, 0, w, h);
    const d = cx.getImageData(0, 0, w, h).data;
    // remove.bg liefert je nach Einstellung eine Graustufen-Maske oder ein PNG mit Transparenz
    let hasAlpha = false; for (let i = 3; i < d.length; i += 4 * 97) if (d[i] < 250) { hasAlpha = true; break; }
    const M = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) M[i] = (hasAlpha ? d[i * 4 + 3] : d[i * 4]) / 255;
    return M;
  } finally { URL.revokeObjectURL(url); }
}

async function renderPhoto(ph, ai, onStatus, signal) {
  const img = await loadImg(ph.original);
  if (!ph.cutout) {
    const c = drawScaled(img, 1600); applyAdjust(c, ph.adj);
    return { display: c.toDataURL("image/jpeg", 0.9), full: null, warn: "" };
  }
  let e = IMG_CACHE.get(ph.id); if (!e) { e = {}; IMG_CACHE.set(ph.id, e); }
  const bsig = JSON.stringify(ph.adj || null);
  if (!e.base || e.bsig !== bsig) { e.base = drawScaled(img, 1200); applyAdjust(e.base, ph.adj); e.bsig = bsig; e.asig = null; }
  if (!e.rb) {
    if (!ai?.removeBg) throw fail("no_worker");
    onStatus?.("remove.bg stellt frei …");
    const src = drawScaled(img, 1200);
    const blob = await dataURLToBlob(src.toDataURL("image/jpeg", 0.92));
    const png = await ai.removeBg(blob, signal);
    onStatus?.("Verfeinere die Kanten …"); await tick(10);
    e.rb = await maskFromRemoveBg(e.base, png);
  }
  const asig = `${bsig}|${ph.tol || 1}`;
  if (e.asig !== asig) { e.alpha = finalizeAlpha(e.base, e.rb, ph.tol || 1); e.asig = asig; }
  const c = composite(e.base, e.alpha, BRUSHES.get(ph.id), ph.bg || "white");
  const warn = c.ratio < 0.03 || c.ratio > 0.97 ? "Das Teil wurde nicht sicher erkannt. Male mit dem Pinsel grob über das Teil (Behalten) oder den Hintergrund (Entfernen)." : "";
  const transparent = (ph.bg || "white") === "transparent";
  return { display: transparent ? c.cropped.toDataURL("image/png") : c.cropped.toDataURL("image/jpeg", 0.92), full: c.full.toDataURL("image/png"), warn };
}

/* ---------------- Helfer ---------------- */
function parseLooseJSON(text) {
  const t = String(text || "").replace(/```json|```/gi, "").trim();
  const a = t.indexOf("{"), b = t.lastIndexOf("}");
  if (a < 0 || b <= a) throw { code: "invalid_json" };
  try { return JSON.parse(t.slice(a, b + 1)); } catch (e) { throw { code: "invalid_json" }; }
}
async function askJSON(sample, prompt, opts) {
  const r = await sample(prompt, opts);
  return parseLooseJSON(r.text);
}
const pick = (o, keys) => { for (const k of keys) { const v = o?.[k]; if (v !== undefined && v !== null && v !== "") return v; } return ""; };
const asText = (v) => (Array.isArray(v) ? v.filter(Boolean).join("\n") : typeof v === "string" ? v : v ? String(v) : "");
const uid = () => Math.random().toString(36).slice(2, 10);
async function copyText(t) {
  if (window.webkit?.messageHandlers?.copy) { window.webkit.messageHandlers.copy.postMessage(String(t)); return true; }
  try { await navigator.clipboard.writeText(t); return true; } catch (e) {
    const ta = document.createElement("textarea"); ta.value = t; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select(); let ok = false;
    try { ok = document.execCommand("copy"); } catch (_) {}
    ta.remove(); return ok;
  }
}
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
};
const aiError = (e) => ({
  rate_limited: "Das kostenlose Limit ist gerade erreicht. Warte etwas und versuch es dann nochmal.",
  invalid_json: "Die KI-Antwort war unvollständig. Bitte nochmal versuchen.",
  cancelled: "Abgebrochen.",
  no_worker: "Keine Verbindung eingerichtet. Tippe oben auf das Zahnrad und trage die Worker-Adresse ein.",
  unauthorized: "Falscher Zugangscode. Bitte oben beim Zahnrad prüfen.",
  network: "Keine Verbindung zum Worker. Prüfe die Adresse beim Zahnrad und deine Internetverbindung.",
  bad_key: "Der Gemini-Schlüssel im Worker ist ungültig.",
  config: "Im Worker fehlt ein API-Schlüssel. Siehe Anleitung, Schritt 5.",
  removebg_quota: "Deine kostenlosen remove.bg-Freistellungen für diesen Monat sind aufgebraucht.",
  removebg_key: "Der remove.bg-Schlüssel im Worker ist ungültig.",
  removebg_failed: "remove.bg konnte dieses Foto nicht freistellen.",
}[e?.code] || `Das hat nicht geklappt (${e?.code || e?.message || "unbekannter Fehler"}${e?.message && e?.code ? ": " + e.message : ""}).`);

function useCaps(version) {
  return useMemo(() => {
    const on = AI.configured();
    return { ready: true, sample: on ? AI.sample : null, maxImages: on ? MAX_PHOTOS : 0, removeBg: on ? AI.removeBg : null };
  }, [version]);
}

/* ---------------- UI-Bausteine ---------------- */
const Btn = ({ children, variant = "soft", className = "", ...p }) => {
  const v = {
    primary: "bg-ink text-bg hover:opacity-85",
    dark: "bg-ink text-bg hover:opacity-85",
    soft: "bg-soft text-ink hover:bg-line",
    ghost: "text-muted hover:text-ink hover:bg-soft",
  }[variant];
  return <button {...p} className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition active:scale-[0.97] disabled:opacity-35 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${v} ${className}`}>{children}</button>;
};
const Card = ({ children, className = "", style }) => <section style={style} className={`bg-card rounded-[26px] ${className}`}>{children}</section>;
const Field = ({ label, children }) => <label className="block"><span className="block text-[12px] text-muted mb-1.5">{label}</span>{children}</label>;
const inputCls = "w-full rounded-2xl bg-soft border border-transparent px-3.5 py-2.5 text-[15px] text-ink placeholder:text-muted/60 focus:outline-none focus:bg-card focus:border-ink/80 transition-colors";
const Checker = "bg-[length:16px_16px] [background-image:conic-gradient(rgb(var(--line))_25%,rgb(var(--card))_0_50%,rgb(var(--line))_0_75%,rgb(var(--card))_0)]";

function CopyBtn({ text, label = "Kopieren", toast }) {
  const [done, setDone] = useState(false);
  return (
    <button onClick={async () => { const ok = await copyText(text); setDone(ok); toast(ok ? "Kopiert" : "Kopieren nicht möglich – Text markieren und manuell kopieren"); setTimeout(() => setDone(false), 1400); }}
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium bg-card border border-line text-ink hover:border-ink transition shrink-0">
      {done ? <Check size={14} /> : <Copy size={14} />}{done ? "Kopiert" : label}
    </button>
  );
}

function Modal({ open, onClose, children, wide }) {
  useEffect(() => {
    if (!open) return;
    const k = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-md anim-fade" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className={`bg-card w-full ${wide ? "sm:max-w-3xl" : "sm:max-w-lg"} max-h-[92%] overflow-y-auto rounded-t-[28px] sm:rounded-[28px] shadow-2xl anim-sheet pb-[env(safe-area-inset-bottom,0px)]`}>
        {children}
      </div>
    </div>
  );
}

/* Führungslinien je Kategorie (viewBox 0 0 100 130) */
const OUTLINES = {
  Oberteil: "M31 22 L42 16 Q50 24 58 16 L69 22 L88 38 L80 50 L71 44 L71 118 L29 118 L29 44 L20 50 L12 38 Z",
  Jacke: "M31 20 L42 14 Q50 22 58 14 L69 20 L85 40 L90 112 L80 114 L73 54 L73 120 L27 120 L27 54 L20 114 L10 112 L15 40 Z M50 22 L50 120",
  Hose: "M30 12 L70 12 L75 120 L56 120 L50 46 L44 120 L25 120 Z",
  Kleid: "M39 12 L44 12 Q50 20 56 12 L61 12 L63 42 L59 52 L80 120 L20 120 L41 52 L37 42 Z",
  Schuhe: "M10 98 L10 76 Q12 66 22 64 L40 61 Q48 55 50 45 L63 45 Q65 63 73 71 L88 78 Q95 84 92 96 L90 100 L12 100 Z",
  Tasche: "M24 52 L76 52 L81 116 L19 116 Z M38 52 Q38 26 50 26 Q62 26 62 52",
};
function GuideOverlay({ category, slot }) {
  const stroke = { fill: "none", stroke: "white", strokeWidth: 2.2, strokeDasharray: "5 4", vectorEffect: "non-scaling-stroke", strokeLinejoin: "round" };
  return (
    <svg viewBox="0 0 100 130" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 w-full h-full p-6 pointer-events-none [filter:drop-shadow(0_0_3px_rgb(0_0_0/0.7))]">
      {(slot === "front" || slot === "back") && <path d={OUTLINES[category] || OUTLINES.Oberteil} {...stroke} />}
      {slot === "label" && <><rect x="22" y="45" width="56" height="40" rx="4" {...stroke} /><path d="M50 58 L50 72 M43 65 L57 65" {...stroke} strokeDasharray="0" /></>}
      {slot === "detail" && <><circle cx="50" cy="65" r="28" {...stroke} /><circle cx="50" cy="65" r="1.5" fill="white" /></>}
      {["M8 8 L8 18 M8 8 L18 8", "M92 8 L92 18 M92 8 L82 8", "M8 122 L8 112 M8 122 L18 122", "M92 122 L92 112 M92 122 L82 122"].map((d) => <path key={d} d={d} fill="none" stroke="white" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />)}
    </svg>
  );
}

/* ---------------- Kamera ---------------- */
const shotFor = (idx) => SLOTS[idx] || { id: "extra", label: `Extra ${idx - SLOTS.length + 1}`, hint: "Weitere Ansichten, Details oder Mängel. Tippe auf Fertig, wenn du genug hast." };

function CameraModal({ open, onClose, category, onShot, count }) {
  const videoRef = useRef(null), streamRef = useRef(null), fileRef = useRef(null);
  const [idx, setIdx] = useState(0);
  const [taken, setTaken] = useState({});
  const [mode, setMode] = useState("loading");
  const [flash, setFlash] = useState(false);
  const shot = shotFor(idx);
  const full = count >= MAX_PHOTOS && !(idx < SLOTS.length && taken[shot.id]);

  useEffect(() => {
    if (!open) return;
    setIdx(0); setTaken({}); setMode("loading");
    let cancelled = false;
    (async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error("no cam");
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1440 } }, audio: false });
        if (cancelled) { s.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = s; setMode("live");
        requestAnimationFrame(() => { if (videoRef.current) { videoRef.current.srcObject = s; videoRef.current.play().catch(() => {}); } });
      } catch (e) { if (!cancelled) setMode("fallback"); }
    })();
    return () => { cancelled = true; streamRef.current?.getTracks().forEach((t) => t.stop()); streamRef.current = null; };
  }, [open]);

  const advance = (dataURL) => {
    onShot(dataURL, shot.id);
    setTaken((t) => ({ ...t, [shot.id]: true }));
    setIdx(idx + 1);
  };
  const shoot = () => {
    const v = videoRef.current; if (!v || !v.videoWidth || full) return;
    setFlash(true); setTimeout(() => setFlash(false), 160);
    advance(drawScaled(v, 1600).toDataURL("image/jpeg", 0.9));
  };
  const onFile = async (e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) advance(await fileToDataURL(f)); };
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]">
      <div className="flex items-center gap-2 px-3 py-3">
        <button onClick={onClose} className="p-2 rounded-full bg-white/10 shrink-0" aria-label="Schließen"><X size={20} /></button>
        <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] flex-1">
          {SLOTS.map((s, i) => (
            <button key={s.id} onClick={() => setIdx(i)} className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition ${i === idx ? "bg-white text-black" : taken[s.id] ? "bg-white/25 text-white" : "bg-white/10 text-white/70"}`}>
              {taken[s.id] && i !== idx ? <Check size={12} className="inline -mt-0.5 mr-0.5" /> : null}{s.label}
            </button>
          ))}
          <button onClick={() => setIdx(Math.max(SLOTS.length, idx))} className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold ${idx >= SLOTS.length ? "bg-white text-black" : "bg-white/10 text-white/80"}`}><Plus size={12} className="inline -mt-0.5" /> Extra</button>
        </div>
        <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1.5 text-xs font-semibold tabular-nums">{count}/{MAX_PHOTOS}</span>
      </div>
      <div className="relative flex-1 mx-3 rounded-[24px] overflow-hidden bg-neutral-900">
        {mode === "live" && <video ref={videoRef} playsInline muted autoPlay className="absolute inset-0 w-full h-full object-cover" />}
        {mode === "loading" && <div className="absolute inset-0 grid place-items-center text-white/60"><Loader2 className="animate-spin" /></div>}
        {mode === "fallback" && <div className="absolute inset-0 bg-neutral-800" />}
        {mode !== "loading" && <GuideOverlay category={category} slot={shot.id} />}
        {flash && <div className="absolute inset-0 bg-white/80" />}
        {mode === "fallback" && (
          <div className="absolute bottom-4 inset-x-4 rounded-2xl bg-black/60 backdrop-blur p-3 text-xs text-white/85 leading-relaxed">
            Die Live-Kamera ist hier nicht freigegeben. Merk dir die Linie und tippe auf den Auslöser – dann öffnet sich die Kamera deines Handys.
          </div>
        )}
        {full && <div className="absolute inset-0 grid place-items-center bg-black/60 text-sm font-semibold">10 Fotos erreicht – tippe auf Fertig.</div>}
      </div>
      <div className="px-5 pt-4 pb-5">
        <p className="text-center text-sm text-white/85 min-h-[40px] max-w-sm mx-auto"><b>{shot.label}:</b> {shot.hint}</p>
        <div className="mt-3 flex items-center justify-between max-w-xs mx-auto">
          <button disabled={idx === 0} onClick={() => setIdx(idx - 1)} className="p-3 rounded-full bg-white/10 disabled:opacity-30" aria-label="Zurück"><ChevronLeft size={20} /></button>
          <button disabled={full} onClick={() => (mode === "live" ? shoot() : fileRef.current?.click())} aria-label="Foto aufnehmen"
            className="w-[74px] h-[74px] rounded-full border-4 border-white grid place-items-center active:scale-95 transition disabled:opacity-30">
            <span className="w-[58px] h-[58px] rounded-full bg-white" />
          </button>
          <button onClick={onClose} className="px-4 py-3 rounded-full bg-white text-black text-xs font-semibold">Fertig</button>
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onFile} />
    </div>
  );
}

/* ---------------- Foto-Editor ---------------- */
function Toggle({ on, onClick, label }) {
  return (
    <button onClick={onClick} role="switch" aria-checked={on} className="w-full flex items-center justify-between gap-3 py-2.5 text-left">
      <span className="text-sm text-ink">{label}</span>
      <span className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${on ? "bg-ink" : "bg-line"}`}>
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-bg shadow transition-transform ${on ? "translate-x-[22px]" : "translate-x-0.5"}`} />
      </span>
    </button>
  );
}

function EditorModal({ photo, onClose, onChange, onApplyLookAll, onApplyAllCutout, onBrushDone, onBrushReset, cutoutOn }) {
  const [peek, setPeek] = useState(false);
  const [tool, setTool] = useState("view");
  const [size, setSize] = useState(26);
  const [tab, setTab] = useState("look");
  const [draft, setDraft] = useState(null);
  const imgRef = useRef(null), ovRef = useRef(null), drawing = useRef(null), slideT = useRef(null);
  useEffect(() => { if (!photo?.cutout) setTool("view"); }, [photo?.cutout, photo?.id]);
  useEffect(() => { setDraft(null); }, [photo?.id]);
  if (!photo) return null;

  const adj = draft || photo.adj || ZERO_ADJ;
  const brushing = photo.cutout && tool !== "view";
  const transparent = photo.cutout && (photo.bg || "white") === "transparent";
  const src = peek ? photo.original : brushing ? photo.full || photo.display : photo.display;
  const checker = photo.cutout && !peek && (brushing || transparent);
  const setSlider = (k, val) => {
    const next = { ...ZERO_ADJ, ...(photo.adj || {}), ...(draft || {}), [k]: val };
    setDraft(next);
    clearTimeout(slideT.current);
    slideT.current = setTimeout(() => onChange({ adj: next, look: "custom" }), 180);
  };

  const syncOverlay = () => { const img = imgRef.current, ov = ovRef.current; if (!img || !ov) return; ov.width = img.clientWidth; ov.height = img.clientHeight; };
  const pt = (e) => { const r = ovRef.current.getBoundingClientRect(); return { fx: (e.clientX - r.left) / r.width, fy: (e.clientY - r.top) / r.height, dx: e.clientX - r.left, dy: e.clientY - r.top, rw: r.width }; };
  const paint = (e) => {
    const p = pt(e), l = drawing.current.last;
    const ov = ovRef.current.getContext("2d");
    ov.strokeStyle = tool === "keep" ? "rgba(16,185,129,0.55)" : "rgba(225,29,72,0.55)";
    ov.lineWidth = size; ov.lineCap = "round"; ov.lineJoin = "round";
    ov.beginPath(); ov.moveTo(l.dx, l.dy); ov.lineTo(p.dx, p.dy); ov.stroke();
    const br = getBrush(photo.id);
    if (br) {
      const bc = br.getContext("2d");
      bc.strokeStyle = tool === "keep" ? "rgb(0,255,0)" : "rgb(255,0,0)";
      bc.lineWidth = (size * br.width) / p.rw; bc.lineCap = "round"; bc.lineJoin = "round";
      bc.beginPath(); bc.moveTo(l.fx * br.width, l.fy * br.height); bc.lineTo(p.fx * br.width, p.fy * br.height); bc.stroke();
    }
    drawing.current.last = p;
  };
  const down = (e) => { if (!brushing) return; e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); drawing.current = { last: pt(e) }; paint(e); };
  const moveP = (e) => { if (drawing.current) paint(e); };
  const up = () => { if (!drawing.current) return; drawing.current = null; onBrushDone(); };

  return (
    <Modal open={!!photo} onClose={onClose} wide>
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-2xl tracking-tight">Foto-Studio</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-soft" aria-label="Schließen"><X size={20} /></button>
        </div>
        <div className={`relative rounded-3xl overflow-hidden flex justify-center p-2 ${checker ? Checker : "bg-soft"}`}>
          <div className="relative inline-block">
            <img ref={imgRef} src={src} alt="Vorschau" onLoad={syncOverlay} className="block max-w-full max-h-[46vh] w-auto select-none" draggable={false} />
            <canvas ref={ovRef} onPointerDown={down} onPointerMove={moveP} onPointerUp={up} onPointerCancel={up}
              className={`absolute inset-0 w-full h-full ${brushing ? "touch-none cursor-crosshair" : "pointer-events-none"}`} />
          </div>
          {photo.processing && (
            <div className="absolute inset-0 grid place-items-center bg-card/60">
              <div className="flex flex-col items-center gap-2 text-sm text-ink"><Loader2 className="animate-spin" size={28} />{photo.processingMsg || ""}</div>
            </div>
          )}
          {!brushing && (
            <button onPointerDown={() => setPeek(true)} onPointerUp={() => setPeek(false)} onPointerLeave={() => setPeek(false)}
              className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-card/90 backdrop-blur px-3 py-1.5 text-xs font-semibold text-ink shadow select-none touch-none">
              <Eye size={14} /> Halten für Vorher
            </button>
          )}
        </div>
        {photo.warn && <p className="mt-3 text-xs text-muted flex gap-1.5"><AlertTriangle size={14} className="shrink-0 mt-0.5" />{photo.warn}</p>}

        <div className="mt-4 grid grid-cols-2 gap-1 rounded-full bg-soft p-1">
          {[["look", "Look", Sun], ["cutout", "Freistellen", Scissors]].map(([id, lbl, Ico]) => (
            <button key={id} onClick={() => setTab(id)} className={`inline-flex items-center justify-center gap-1.5 rounded-full py-2 text-sm ${tab === id ? "bg-ink text-bg" : "text-muted"}`}><Ico size={14} />{lbl}</button>
          ))}
        </div>

        {tab === "look" && (
          <div className="mt-4">
            <div className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-1 [scrollbar-width:none]">
              {LOOKS.map((l) => {
                const on = (photo.look || "original") === l.id;
                return (
                  <button key={l.id} onClick={() => { setDraft(null); onChange({ adj: l.v, look: l.id }); }}
                    className={`shrink-0 rounded-2xl px-3.5 py-2.5 text-left transition ${on ? "bg-ink text-bg" : "bg-soft text-ink hover:bg-line"}`}>
                    <div className="text-sm font-medium">{l.label}</div><div className="text-[11px] opacity-60">{l.sub}</div>
                  </button>
                );
              })}
            </div>
            <div className="mt-3 space-y-2.5">
              {ADJ_SLIDERS.map(([k, lbl]) => (
                <label key={k} className="flex items-center gap-3">
                  <span className="w-20 text-xs text-muted shrink-0">{lbl}</span>
                  <input type="range" min="-1" max="1" step="0.05" value={adj[k] || 0} onChange={(e) => setSlider(k, parseFloat(e.target.value))}
                    className="flex-1 accent-[rgb(var(--ink))]" aria-label={lbl} />
                  <span className="w-9 text-right text-xs tabular-nums text-muted">{Math.round((adj[k] || 0) * 100)}</span>
                </label>
              ))}
              <Toggle on={(adj.wb || 0) > 0} label="Automatischer Weißabgleich" onClick={() => setSlider("wb", (adj.wb || 0) > 0 ? 0 : 0.6)} />
            </div>
            <Btn variant="soft" className="w-full mt-3" onClick={() => onApplyLookAll({ adj: photo.adj, look: photo.look })}><Layers size={15} />Diesen Look für alle Fotos</Btn>
          </div>
        )}

        {tab === "cutout" && (
          <div className="mt-4">
            {!cutoutOn ? (
              <p className="text-sm text-muted">Freistellen braucht die Verbindung zu deinem Worker. Trage sie oben beim Zahnrad ein.</p>
            ) : (
              <>
                <Toggle on={!!photo.cutout} label="Hintergrund entfernen (remove.bg)" onClick={() => onChange({ cutout: !photo.cutout })} />
                <p className="text-[11px] text-muted -mt-1 mb-2">Jedes Foto zählt einmal zu deinen kostenlosen remove.bg-Freistellungen. Danach kannst du Look, Hintergrund und Pinsel beliebig ändern.</p>
                {photo.cutout && (
                  <div className="rounded-2xl bg-soft p-3.5">
                    <div className="text-xs font-semibold text-ink mb-2">Hintergrund</div>
                    <div className="grid grid-cols-3 gap-1 rounded-full bg-card p-1 mb-4">
                      {[["white", "Weiß"], ["grey", "Hellgrau"], ["transparent", "Transparent"]].map(([id, lbl]) => (
                        <button key={id} onClick={() => onChange({ bg: id })} className={`rounded-full py-2 text-xs font-medium ${(photo.bg || "white") === id ? "bg-ink text-bg" : "text-muted"}`}>{lbl}</button>
                      ))}
                    </div>
                    <div className="text-xs font-semibold text-ink mb-2">Nachbessern</div>
                    <div className="grid grid-cols-3 gap-1 rounded-full bg-card p-1">
                      {[["view", "Ansehen", Hand], ["keep", "Behalten", Brush], ["erase", "Entfernen", Eraser]].map(([id, lbl, Ico]) => (
                        <button key={id} onClick={() => setTool(id)} className={`inline-flex items-center justify-center gap-1.5 rounded-full py-2 text-xs font-semibold ${tool === id ? (id === "keep" ? "bg-emerald-600 text-white" : id === "erase" ? "bg-rose-600 text-white" : "bg-ink text-bg") : "text-muted"}`}>
                          <Ico size={14} />{lbl}
                        </button>
                      ))}
                    </div>
                    {brushing && (
                      <div className="mt-3 flex items-center gap-3">
                        <span className="text-xs text-muted shrink-0">Pinsel</span>
                        <input type="range" min="8" max="70" value={size} onChange={(e) => setSize(+e.target.value)} className="flex-1 accent-[rgb(var(--ink))]" aria-label="Pinselgröße" />
                      </div>
                    )}
                    <div className="mt-3">
                      <div className="flex justify-between text-[11px] text-muted mb-1"><span>Kante weiter</span><span>Kante enger</span></div>
                      <input type="range" min="0.5" max="1.8" step="0.1" defaultValue={photo.tol || 1} key={photo.id}
                        onPointerUp={(e) => onChange({ tol: parseFloat(e.target.value) })} onKeyUp={(e) => onChange({ tol: parseFloat(e.target.value) })}
                        className="w-full accent-[rgb(var(--ink))]" aria-label="Kante" />
                    </div>
                    <Btn variant="ghost" className="mt-1 !px-3 !py-1.5 !text-xs" onClick={onBrushReset}><RefreshCw size={13} />Pinsel zurücksetzen</Btn>
                  </div>
                )}
                <Btn variant="soft" className="w-full mt-3" onClick={onApplyAllCutout}><Scissors size={15} />Alle Ansichten freistellen</Btn>
              </>
            )}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted mr-1">Zeigt:</span>
          {[...SLOTS, { id: "extra", label: "Extra" }].map((s) => (
            <button key={s.id} onClick={() => onChange({ slot: s.id }, true)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${photo.slot === s.id ? "bg-ink text-bg border-ink" : "bg-soft border-transparent text-ink"}`}>{s.label}</button>
          ))}
        </div>
        <Btn variant="dark" className="w-full mt-5" onClick={onClose}>Fertig</Btn>
      </div>
    </Modal>
  );
}

/* ---------------- Entwürfe ---------------- */
const STATUS = ["Entwurf", "Online", "Verkauft"];
function Inventory({ drafts, setDrafts, toast, onEdit }) {
  const [open, setOpen] = useState(null);
  const [filter, setFilter] = useState("Alle");
  const list = drafts.filter((d) => filter === "Alle" || d.status === filter).sort((a, b) => b.createdAt - a.createdAt);
  const d = drafts.find((x) => x.id === open);
  const total = drafts.filter((x) => x.status === "Verkauft").reduce((s, x) => s + (x.manualPrice ?? x.price ?? 0), 0);
  const update = (id, patch) => setDrafts((ds) => ds.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  if (!drafts.length) return (
    <Card className="p-10 text-center bg-soft">
      <Archive size={30} className="mx-auto text-muted" />
      <h2 className="font-display text-xl mt-3">Noch keine Entwürfe</h2>
      <p className="text-sm text-muted mt-1">Erstelle im Studio ein Inserat und tippe auf „Als Entwurf speichern“.</p>
    </Card>
  );
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none]">
          {["Alle", ...STATUS].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold border ${filter === s ? "bg-ink text-bg border-ink" : "bg-soft border-transparent text-ink"}`}>
              {s} <span className="opacity-60">{s === "Alle" ? drafts.length : drafts.filter((x) => x.status === s).length}</span>
            </button>
          ))}
        </div>
        {total > 0 && <span className="text-xs text-muted shrink-0">Verkauft: <b className="text-ink">{total} €</b></span>}
      </div>
      <div className="columns-2 sm:columns-3 gap-3">
        {list.map((x) => {
          const hero = x.photos?.[0];
          return (
            <button key={x.id} onClick={() => setOpen(x.id)} className="tile-in mb-3 w-full break-inside-avoid text-left rounded-[22px] overflow-hidden group">
              <div className={`relative rounded-[22px] overflow-hidden transition group-hover:opacity-90 ${hero ? "" : "aspect-square grid place-items-center bg-soft"} ${hero && hero.src.startsWith("data:image/png") ? Checker : "bg-soft"}`}>
                {hero ? <img src={hero.src} alt={x.title} className="w-full h-auto block" /> : <Package size={32} className="text-muted" />}
                <span className={`absolute top-2.5 left-2.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${x.status === "Verkauft" ? "bg-ink text-bg" : x.status === "Online" ? "bg-ink text-bg" : "bg-card/85 text-ink backdrop-blur-md"}`}>{x.status}</span>
              </div>
              <div className="pt-2 px-1 pb-1">
                <div className="text-sm leading-snug text-ink line-clamp-2">{x.title || "Ohne Titel"}</div>
                <div className="font-display text-base mt-0.5 text-muted tabular-nums">{x.manualPrice ?? x.price} €</div>
              </div>
            </button>
          );
        })}
      </div>
      <Modal open={!!d} onClose={() => setOpen(null)} wide>
        {d && (
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-xl text-ink">Entwurf</h3>
              <button onClick={() => setOpen(null)} className="p-2 rounded-full hover:bg-soft" aria-label="Schließen"><X size={20} /></button>
            </div>
            {d.photos?.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                {d.photos.map((p, i) => (
                  <div key={i} className={`relative shrink-0 w-28 h-36 rounded-2xl overflow-hidden border border-line ${p.src.startsWith("data:image/png") ? Checker : "bg-soft"}`}>
                    <img src={p.src} alt={slotLabel(p.slot)} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1.5 left-1.5 rounded-full bg-card/90 px-2 py-0.5 text-[10px] font-bold">{i + 1} · {slotLabel(p.slot)}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-3 flex gap-1.5">
              {STATUS.map((s) => <button key={s} onClick={() => update(d.id, { status: s })} className={`rounded-full px-3 py-1.5 text-xs font-semibold border ${d.status === s ? "bg-ink text-bg border-ink" : "bg-soft border-transparent text-ink"}`}>{s}</button>)}
            </div>
            <div className="mt-4 space-y-2.5">
              {[["Titel", d.title], ["Preis", `${d.manualPrice ?? d.price}`], ["Beschreibung", d.description], ["Hashtags", d.hashtags]].map(([l, t]) => (
                <div key={l} className="rounded-2xl bg-soft p-3.5">
                  <div className="flex items-center justify-between mb-1.5"><span className="text-xs text-muted">{l}</span><CopyBtn text={t} label={l} toast={toast} /></div>
                  <div className="text-sm text-ink whitespace-pre-line break-words">{l === "Preis" ? `${t} €` : t}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <Btn variant="soft" onClick={async () => { await copyText(`${d.title}\n\nPreis: ${d.manualPrice ?? d.price} €\n\n${d.description}\n\n${d.hashtags}`); toast("Alles kopiert"); }}><Copy size={15} />Alles</Btn>
              <Btn variant="soft" onClick={() => { onEdit(d); setOpen(null); }}><Pencil size={15} />Bearbeiten</Btn>
              <Btn variant="ghost" onClick={() => { if (confirm("Diesen Entwurf löschen?")) { setDrafts((ds) => ds.filter((x) => x.id !== d.id)); setOpen(null); toast("Entwurf gelöscht"); } }}><Trash2 size={15} />Löschen</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ---------------- Studio ---------------- */
const EMPTY_FIELDS = { brand: "", model: "", itemType: "", category: "Oberteil", color: "", material: "", condition: "Sehr gut", size: "", gender: "", style: "", details: "", flaws: "", notes: "" };
const AI_KEYS = ["brand", "model", "itemType", "color", "material", "condition", "size", "gender", "style", "details", "flaws"];
const VALID_SLOTS = ["front", "back", "label", "detail", "extra"];
const normSlot = (s) => {
  const t = String(s || "").toLowerCase();
  if (VALID_SLOTS.includes(t)) return t;
  if (/vorn|front|titel|hero|cover/.test(t)) return "front";
  if (/rück|ruck|back|hinten/.test(t)) return "back";
  if (/etikett|label|tag|größe|groesse|size/.test(t)) return "label";
  if (/detail|nah|close|material|logo/.test(t)) return "detail";
  return "extra";
};
const normCategory = (c) => CATEGORIES.find((x) => x.id.toLowerCase() === String(c || "").toLowerCase())?.id || null;

function Shimmer({ on, children }) {
  return <div className={`relative ${on ? "pointer-events-none" : ""}`}>{children}{on && <div className="absolute inset-0 rounded-2xl shimmer" />}</div>;
}

function Studio({ caps, toast, onSaveDraft, loadDraft, clearLoad }) {
  const [category, setCategory] = useState("Oberteil");
  const [photos, setPhotos] = useState([]);
  const [camOpen, setCamOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [fields, setFields] = useState(EMPTY_FIELDS);
  const [bias, setBias] = useState(1);
  const [manualPrice, setManualPrice] = useState(null);
  const [ai, setAi] = useState({ step: "idle", msg: "" }); // idle | sort | details | done | error
  const [draftId, setDraftId] = useState(null);
  const [drag, setDrag] = useState(null);
  const [dropHover, setDropHover] = useState(false);
  const [textStyle, setTextStyleRaw] = useState(() => store.get("vsp:textStyle", "standard"));
  const [textOpts, setTextOptsRaw] = useState(() => ({ ...DEFAULT_TEXT_OPTS, ...store.get("vsp:textOpts", {}) }));
  const [optsOpen, setOptsOpen] = useState(false);
  const setTextStyle = (v) => { setTextStyleRaw(v); store.set("vsp:textStyle", v); };
  const setTextOpt = (k, v) => setTextOptsRaw((o) => { const n = { ...o, [k]: v }; store.set("vsp:textOpts", n); return n; });
  const galRef = useRef(null), ctlRef = useRef(null);
  const photosRef = useRef(photos); photosRef.current = photos;
  const fieldsRef = useRef(fields); fieldsRef.current = fields;
  const touched = useRef(new Set());
  const manualOrder = useRef(false);
  const analyzedKey = useRef("");
  const tileEls = useRef(new Map());
  const prevRects = useRef(new Map());
  const dragRef = useRef(null);
  const suppressClick = useRef(false);
  const maxAI = Math.min(MAX_PHOTOS, caps.maxImages || MAX_PHOTOS);
  const aiOn = !!caps.sample && caps.maxImages > 0;
  const busy = ai.step === "sort" || ai.step === "details";

  useEffect(() => {
    if (!loadDraft) return;
    const d = loadDraft;
    photosRef.current.forEach((p) => forgetPhoto(p.id));
    const ps = (d.photos || []).map((p) => ({ id: uid(), original: p.src, display: p.src, slot: p.slot, adj: null, look: "original", cutout: false, tol: 1, bg: "white" }));
    setDraftId(d.id); setCategory(d.fields.category); setFields({ ...EMPTY_FIELDS, ...d.fields }); setBias(d.bias || 1);
    setManualPrice(d.manualPrice ?? null); setPhotos(ps);
    touched.current = new Set(Object.keys(d.fields).filter((k) => d.fields[k]));
    manualOrder.current = true;
    analyzedKey.current = ps.map((p) => p.id).sort().join(",");
    setAi({ step: "idle", msg: "" });
    clearLoad();
  }, [loadDraft]);

  const setUserF = (patch) => { Object.keys(patch).forEach((k) => touched.current.add(k)); setFields((f) => ({ ...f, ...patch })); };
  const pickCategory = (c) => { touched.current.add("category"); setCategory(c); setFields((f) => ({ ...f, category: c })); };
  const sortPhotos = (list) => list.map((p, i) => [p, i]).sort((a, b) => slotIndex(a[0].slot) - slotIndex(b[0].slot) || a[1] - b[1]).map((x) => x[0]);
  const placeNew = (ps, items) => (manualOrder.current ? [...ps, ...items] : sortPhotos([...ps, ...items]));

  /* Fotos hinzufügen */
  const addPhoto = (dataURL, slot) => setPhotos((ps) => {
    const old = slot !== "extra" ? ps.find((p) => p.slot === slot && p.fromCam) : null;
    if (old) { forgetPhoto(old.id); return ps.map((p) => (p.id === old.id ? { ...p, id: uid(), original: dataURL, display: dataURL, full: null, adj: null, look: "original", cutout: false, outline: null, outlineId: null } : p)); }
    if (ps.length >= MAX_PHOTOS) return ps;
    return placeNew(ps, [{ id: uid(), original: dataURL, display: dataURL, slot, adj: null, look: "original", cutout: false, tol: 1, bg: "white", fromCam: true }]);
  });
  const addFiles = async (fileList) => {
    const files = Array.from(fileList || []).filter((f) => f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name));
    if (!files.length) return;
    const room = MAX_PHOTOS - photosRef.current.length;
    if (room <= 0) { toast(`Maximal ${MAX_PHOTOS} Fotos`); return; }
    const take = files.slice(0, room);
    const urls = await Promise.all(take.map((f) => fileToDataURL(f).catch(() => null)));
    setPhotos((ps) => [...ps, ...urls.filter(Boolean).map((u) => ({ id: uid(), original: u, display: u, slot: "extra", pending: true, adj: null, look: "original", cutout: false, tol: 1, bg: "white" }))].slice(0, MAX_PHOTOS));
    toast(files.length > room ? `${take.length} hinzugefügt – mehr als ${MAX_PHOTOS} Fotos gehen nicht` : `${take.length} Foto${take.length > 1 ? "s" : ""} hinzugefügt`);
  };
  const remove = (id) => { forgetPhoto(id); setPhotos((ps) => ps.filter((p) => p.id !== id)); };
  const moveTo = (id, to) => setPhotos((ps) => {
    const from = ps.findIndex((p) => p.id === id); if (from < 0 || to < 0 || to >= ps.length || from === to) return ps;
    const a = ps.slice(); const [it] = a.splice(from, 1); a.splice(to, 0, it); manualOrder.current = true; return a;
  });
  const autoSort = () => { manualOrder.current = false; setPhotos((ps) => sortPhotos(ps)); toast("Nach Inhalt sortiert"); };

  /* Sanfte Umsortier-Animation (FLIP) */
  useLayoutEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const next = new Map();
    tileEls.current.forEach((el, id) => {
      if (!el) return;
      const r = el.getBoundingClientRect(); next.set(id, r);
      const prev = prevRects.current.get(id);
      if (!reduce && prev && (prev.left !== r.left || prev.top !== r.top)) {
        const dx = prev.left - r.left, dy = prev.top - r.top;
        el.style.transition = "none"; el.style.transform = `translate(${dx}px, ${dy}px)`;
        requestAnimationFrame(() => { el.style.transition = "transform 260ms cubic-bezier(.2,.8,.2,1)"; el.style.transform = ""; });
      }
    });
    prevRects.current = next;
  }, [photos]);

  /* Drag & Drop: Maus sofort, Finger nach kurzem Halten */
  useEffect(() => {
    const activate = (x, y) => {
      const d = dragRef.current; if (!d || d.active) return;
      d.active = true; navigator.vibrate?.(12);
      setDrag({ id: d.id, x, y, ox: d.ox, oy: d.oy, w: d.w });
    };
    const targetIndex = (x, y, id) => {
      let best = -1, bd = Infinity;
      photosRef.current.forEach((p, i) => {
        const el = tileEls.current.get(p.id); if (!el) return;
        const r = el.getBoundingClientRect();
        const inside = x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
        const d = inside ? -1 : Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2));
        if (d < bd) { bd = d; best = i; }
      });
      return best;
    };
    const move = (e) => {
      const d = dragRef.current; if (!d || e.pointerId !== d.pid) return;
      const dist = Math.hypot(e.clientX - d.sx, e.clientY - d.sy);
      if (!d.active) {
        if (d.type === "mouse" && dist > 5) activate(e.clientX, e.clientY);
        else if (d.type !== "mouse" && dist > 10) { clearTimeout(d.timer); dragRef.current = null; }
        return;
      }
      setDrag((s) => s && { ...s, x: e.clientX, y: e.clientY });
      const now = performance.now(); if (now - (d.last || 0) < 60) return; d.last = now;
      const ti = targetIndex(e.clientX, e.clientY, d.id);
      if (ti >= 0) moveTo(d.id, ti);
    };
    const end = (e) => {
      const d = dragRef.current; if (!d || (e.pointerId !== undefined && e.pointerId !== d.pid)) return;
      clearTimeout(d.timer);
      if (d.active) { suppressClick.current = true; setTimeout(() => (suppressClick.current = false), 50); setDrag(null); }
      dragRef.current = null;
    };
    const noScroll = (e) => { if (dragRef.current?.active) e.preventDefault(); };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    window.addEventListener("touchmove", noScroll, { passive: false });
    dragRef.activate = activate;
    return () => {
      window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end); window.removeEventListener("touchmove", noScroll);
    };
  }, []);
  const onTileDown = (e, id) => {
    if (e.button > 0) return;
    const el = tileEls.current.get(id); if (!el) return;
    const r = el.getBoundingClientRect();
    const d = { id, pid: e.pointerId, type: e.pointerType, sx: e.clientX, sy: e.clientY, ox: e.clientX - r.left, oy: e.clientY - r.top, w: r.width, active: false };
    dragRef.current = d;
    if (e.pointerType !== "mouse") d.timer = setTimeout(() => dragRef.activate?.(d.sx, d.sy), 260);
  };
  const onTileKey = (e, i, id) => {
    if (e.key === "Enter") { setEditId(id); return; }
    if (["ArrowLeft", "ArrowUp"].includes(e.key)) { e.preventDefault(); moveTo(id, i - 1); }
    if (["ArrowRight", "ArrowDown"].includes(e.key)) { e.preventDefault(); moveTo(id, i + 1); }
  };

  /* Bearbeitung */
  const cutoutOn = !!caps.removeBg;
  const renderOne = async (id, patch = {}, noRender) => {
    const cur = photosRef.current.find((p) => p.id === id); if (!cur) return;
    const target = { ...cur, ...patch };
    setPhotos((ps) => ps.map((p) => (p.id === id ? { ...p, ...patch, processing: !noRender, processingMsg: "" } : p)));
    if (noRender) return;
    await tick();
    const status = (m) => setPhotos((ps) => ps.map((p) => (p.id === id ? { ...p, processingMsg: m } : p)));
    try {
      const { display, full, warn } = await renderPhoto(target, caps, status);
      setPhotos((ps) => ps.map((p) => (p.id === id ? { ...p, display, full, warn, processing: false, processingMsg: "" } : p)));
    } catch (e) {
      // Freistellen fehlgeschlagen: zurück zum normalen Foto
      const revert = patch.cutout ? { cutout: false } : {};
      setPhotos((ps) => ps.map((p) => (p.id === id ? { ...p, ...revert, processing: false, processingMsg: "" } : p)));
      toast(e?.code ? aiError(e) : "Bearbeitung fehlgeschlagen");
      return false;
    }
    return true;
  };
  const applyAllCutout = async () => {
    const list = photosRef.current.filter((p) => !p.cutout && p.slot !== "label" && p.slot !== "detail");
    if (!list.length) { toast("Alle passenden Fotos sind schon freigestellt"); return; }
    if (!confirm(`${list.length} Foto${list.length > 1 ? "s" : ""} freistellen? Das nutzt ${list.length} deiner kostenlosen remove.bg-Freistellungen.`)) return;
    let n = 0;
    for (const p of list) { if (await renderOne(p.id, { cutout: true })) n++; else break; }
    if (n) toast(`${n} Foto${n > 1 ? "s" : ""} freigestellt`);
  };
  const applyLookAll = async ({ adj, look }) => {
    for (const p of photosRef.current) await renderOne(p.id, { adj, look });
    toast("Look auf alle Fotos angewendet");
  };

  /* KI in zwei Schritten: 1) Art erkennen + sortieren (alle Fotos, in Paketen)  2) Etikett & Details lesen (beste Fotos) */
  const applySlots = (entries) => {
    if (!entries.length) return false;
    const best = {};
    entries.forEach((e) => { if ((e.slot === "front" || e.slot === "back") && (!best[e.slot] || e.q > best[e.slot].q)) best[e.slot] = e; });
    const map = {};
    entries.forEach((e) => { map[e.id] = (e.slot === "front" || e.slot === "back") && best[e.slot].id !== e.id ? "extra" : e.slot; });
    setPhotos((ps) => {
      const next = ps.map((p) => ({ ...p, slot: map[p.id] || (p.pending ? "extra" : p.slot), pending: false }));
      return manualOrder.current ? next : sortPhotos(next);
    });
    return true;
  };
  const sortPrompt = (n) => `Du siehst ${n} Foto${n > 1 ? "s" : ""} von EINEM Second-Hand-Artikel (Bild 1 bis ${n}, in dieser Reihenfolge).
1. Bestimme, was für ein Artikel es ist.
2. Ordne jedes Foto genau einem Typ zu:
   front = das GANZE Teil von vorne, komplett sichtbar (bei Schuhen: ganze Seitenansicht)
   back = das GANZE Teil von hinten, komplett sichtbar
   label = Marken-, Größen- oder Pflegeetikett
   detail = Nahaufnahme oder Ausschnitt (z. B. nur Kragen, Ausschnitt, Logo, Stoff, Mangel) – auch wenn es die Vorderseite zeigt
   extra = alles andere
3. quality = wie gut sich das Foto als Titelbild eignet, 1 bis 10 (ganzes Teil, scharf, gut ausgeleuchtet = hoch).
Antworte NUR mit JSON:
{"category":"Oberteil|Jacke|Hose|Kleid|Schuhe|Tasche","itemType":"genaue Art auf Deutsch, z. B. Langarmshirt, Kapuzenpullover, Strickpullover, T-Shirt, Hemd, Bluse, Jeans, Chinohose, Sneaker, Stiefel, Midikleid, Daunenjacke, Umhängetasche","photos":[{"image":1,"slot":"front","quality":8}]}`;
  const analyze = async () => {
    if (!aiOn) return;
    const all = photosRef.current.slice(0, MAX_PHOTOS);
    if (!all.length) return;
    ctlRef.current?.abort();
    const ctl = new AbortController(); ctlRef.current = ctl;
    analyzedKey.current = all.map((p) => p.id).sort().join(",");
    const per = Math.max(1, caps.maxImages || 4);
    const batches = []; for (let i = 0; i < all.length; i += per) batches.push(all.slice(i, i + per));
    const entries = [];
    try {
      let cat = null, type = "";
      for (let bi = 0; bi < batches.length; bi++) {
        const b = batches[bi];
        setAi({ step: "sort", msg: batches.length > 1 ? `Erkenne den Artikel und sortiere die Fotos (Teil ${bi + 1} von ${batches.length}) …` : `Erkenne den Artikel und sortiere ${b.length} Foto${b.length > 1 ? "s" : ""} …` });
        const imgs = await Promise.all(b.map(async (p) => dataURLToBlob(await shrink(p.original, 640, false))));
        let r1 = null;
        for (const tier of ["quick", "default"]) {
          try { r1 = await askJSON(caps.sample, sortPrompt(b.length), { images: imgs, signal: ctl.signal, modelTier: tier }); break; }
          catch (e) { if (e?.code === "cancelled" || ctl.signal.aborted) return; if (["not_granted", "rate_limited", "images_unavailable"].includes(e?.code)) throw e; }
        }
        if (ctl.signal.aborted) return;
        if (!r1) continue;
        cat = cat || normCategory(pick(r1, ["category", "kategorie"]));
        type = type || pick(r1, ["itemType", "item_type", "art", "type"]);
        (r1.photos || r1.photoSlots || r1.fotos || []).forEach((s, k) => {
          const p = b[Number(s?.image ?? s?.bild ?? k + 1) - 1];
          if (p) entries.push({ id: p.id, slot: normSlot(s?.slot ?? s?.typ ?? s?.type), q: Number(s?.quality) || 5 });
        });
      }
      const patch = {};
      if (cat && !touched.current.has("category")) { patch.category = cat; setCategory(cat); }
      if (type && !touched.current.has("itemType")) patch.itemType = String(type);
      if (Object.keys(patch).length) setFields((f) => ({ ...f, ...patch }));
      const sorted = applySlots(entries);

      // Für Details die aussagekräftigsten Fotos wählen: Etikett zuerst, dann Vorderseite, Details, Rückseite
      const slotOf = Object.fromEntries(entries.map((e) => [e.id, e.slot]));
      const prio = { label: 0, front: 1, detail: 2, back: 3, extra: 4 };
      const chosen = all.slice().sort((x, y) => (prio[slotOf[x.id]] ?? 5) - (prio[slotOf[y.id]] ?? 5)).slice(0, per);
      setAi({ step: "details", msg: "Lese Etikett, Marke, Größe und Material …" });
      const big = await Promise.all(chosen.map(async (p) => dataURLToBlob(await shrink(p.original, slotOf[p.id] === "label" ? 1400 : 1100, false))));
      const r = await askJSON(caps.sample, `Du bist Expertin für Second-Hand-Mode und Vinted-Inserate in Deutschland.
Du bekommst ${chosen.length} Fotos EINES Artikels. Artikel laut erster Einschätzung: ${fieldsRef.current.itemType || patch.itemType || fieldsRef.current.category}.
Lies Marke, Größe und Material vom Etikett, wenn es sichtbar ist. Erkenne, wenn möglich, Modell oder Serie (z. B. Air Force 1, 501, Detroit Jacket). Erfinde nichts: Was nicht erkennbar ist, bleibt "".
Bei Schuhen: Größe als EU-Zahl (z. B. "42" oder "38,5").
Antworte NUR mit JSON, ohne Erklärung:
{"brand":"","model":"","itemType":"","category":"Oberteil|Jacke|Hose|Kleid|Schuhe|Tasche","color":"Hauptfarbe auf Deutsch","material":"z. B. 100% Baumwolle","condition":"Neu mit Etikett|Neu ohne Etikett|Sehr gut|Gut|Zufriedenstellend","size":"","gender":"Damen|Herren|Unisex|Kinder","style":"1-2 Wörter oder leer","details":["2-4 kurze, sachliche Merkmale"],"flaws":["sichtbare Mängel, sonst leer"],"priceEstimate":0}
priceEstimate = realistischer Vinted-Gebrauchtpreis in Euro als Zahl.`, { images: big, signal: ctl.signal, modelTier: "default" });
      if (ctl.signal.aborted) return;
      const got = {
        brand: pick(r, ["brand", "marke"]), model: pick(r, ["model", "modell"]), itemType: pick(r, ["itemType", "art"]),
        color: pick(r, ["color", "farbe"]), material: pick(r, ["material"]),
        condition: CONDITIONS.find((c) => c.toLowerCase() === String(pick(r, ["condition", "zustand"])).toLowerCase()),
        size: String(pick(r, ["size", "groesse", "größe"])).replace(/^EU\s*/i, ""), gender: pick(r, ["gender", "fuer", "für"]),
        style: pick(r, ["style", "stil"]), details: asText(pick(r, ["details", "merkmale"])), flaws: asText(pick(r, ["flaws", "maengel", "mängel"])),
      };
      const merged = { ...fieldsRef.current };
      let filled = 0;
      AI_KEYS.forEach((k) => { const v = got[k]; if (!touched.current.has(k) && v) { merged[k] = String(v); filled++; } });
      const cat2 = normCategory(pick(r, ["category", "kategorie"]));
      if (cat2 && !touched.current.has("category")) { merged.category = cat2; setCategory(cat2); }
      setFields(merged);
      const est = Number(pick(r, ["priceEstimate", "preis", "price"]));
      if (est > 0) setBias(Math.min(2.2, Math.max(0.45, est / formulaPrice(merged))));
      if (!sorted) setPhotos((ps) => ps.map((p) => ({ ...p, pending: false })));
      setAi(filled ? { step: "done", msg: `Erkannt: ${[merged.brand, merged.model, merged.itemType, merged.size && `Gr. ${sizeText(merged.category, merged.size)}`].filter(Boolean).join(" · ")}` }
        : { step: "error", msg: "Die KI konnte auf den Fotos nichts sicher erkennen. Ein scharfes Foto vom Etikett hilft. Du kannst die Felder auch selbst ausfüllen." });
    } catch (e) {
      if (e?.code === "cancelled" || ctl.signal.aborted) return;
      setPhotos((ps) => ps.map((p) => ({ ...p, pending: false })));
      setAi({ step: "error", msg: aiError(e) });
    }
  };
  const analyzeRef = useRef(analyze); analyzeRef.current = analyze;
  const photoKey = photos.map((p) => p.id).sort().join(",");
  useEffect(() => {
    if (camOpen || !aiOn || !photoKey || photoKey === analyzedKey.current) return;
    const t = setTimeout(() => analyzeRef.current(), 700);
    return () => clearTimeout(t);
  }, [photoKey, camOpen, aiOn]);

  /* Echtzeit-Ableitungen */
  const autoPrice = roundPrice(formulaPrice(fields) * bias);
  const price = manualPrice ?? autoPrice;
  const title = useMemo(() => buildTitle(fields, textStyle), [fields, textStyle]);
  const description = useMemo(() => buildDescription(fields, textStyle, textOpts), [fields, textStyle, textOpts]);
  const hashtags = useMemo(() => (textOpts.hashtags ? buildHashtags(fields, textStyle) : ""), [fields, textStyle, textOpts]);
  const fullText = [title, `Preis: ${price} €`, description, textOpts.hashtags && !textOpts.hashtagsInText ? hashtags : ""].filter(Boolean).join("\n\n");
  const hasContent = !!(fields.brand || fields.itemType || fields.color || photos.length);

  const saveDraft = async () => {
    const thumbs = await Promise.all(photos.map(async (p) => ({ src: await shrink(p.display, 600, p.cutout && p.bg === "transparent"), slot: p.slot })));
    const id = draftId || uid();
    const ok = onSaveDraft({ id, createdAt: Date.now(), status: "Entwurf", fields, bias, manualPrice, price, title, description, hashtags, textStyle, photos: thumbs });
    setDraftId(id);
    await copyText(fullText);
    toast(ok === "nophotos" ? "Entwurf gespeichert (ohne Fotos, Speicher voll) · Text kopiert" : "Als Entwurf gespeichert · Text kopiert");
  };
  const savePhotos = async () => {
    const files = await Promise.all(photos.map(async (p, i) => {
      const png = p.cutout && p.bg === "transparent";
      const blob = await dataURLToBlob(p.display);
      return new File([blob], `${i + 1}_${slotLabel(p.slot).toLowerCase()}.${png ? "png" : "jpg"}`, { type: png ? "image/png" : "image/jpeg" });
    }));
    try {
      if (navigator.canShare?.({ files })) { await navigator.share({ files }); return; }
    } catch (e) { if (e?.name === "AbortError") return; }
    files.forEach((f, i) => setTimeout(() => {
      const a = document.createElement("a"); a.href = URL.createObjectURL(f); a.download = f.name;
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    }, i * 300));
    toast("Fotos werden heruntergeladen");
  };
  const resetAll = () => {
    ctlRef.current?.abort();
    photos.forEach((p) => forgetPhoto(p.id));
    setPhotos([]); setFields({ ...EMPTY_FIELDS, category }); setBias(1); setManualPrice(null); setDraftId(null);
    setAi({ step: "idle", msg: "" }); touched.current = new Set(); manualOrder.current = false; analyzedKey.current = "";
  };
  const editPhoto = photos.find((p) => p.id === editId);
  const sizes = sizesFor(fields.category);
  const isShoe = fields.category === "Schuhe";
  const dragPhoto = drag && photos.find((p) => p.id === drag.id);
  const waiting = (k) => busy && ai.step === "details" && !touched.current.has(k) && !fields[k];

  const field = (k, label, props = {}) => (
    <Field label={label}>
      <Shimmer on={waiting(k)}>
        <input className={inputCls} value={fields[k]} onChange={(e) => { setUserF({ [k]: e.target.value }); if (["brand", "material"].includes(k)) setManualPrice(null); }} {...props} />
      </Shimmer>
    </Field>
  );

  return (
    <div className="space-y-10">
      {/* Kopf */}
      <section className="anim-rise" style={{ "--d": "0ms" }}>
        <h2 className="font-display text-[clamp(2.2rem,8vw,3.6rem)] leading-[0.95] tracking-[-0.04em] text-ink">Fotografieren.<br /><span className="text-muted">Erkennen. Verkaufen.</span></h2>
        <div className="mt-6 flex gap-2 overflow-x-auto -mx-4 px-4 pb-1 [scrollbar-width:none]">
          {CATEGORIES.map((c) => {
            const Ico = c.icon; const on = category === c.id;
            return (
              <button key={c.id} onClick={() => pickCategory(c.id)}
                className={`shrink-0 inline-flex items-center gap-2 rounded-full pl-3 pr-4 py-2 text-sm transition ${on ? "bg-ink text-bg" : "bg-soft text-ink hover:bg-line"}`}>
                <Ico size={15} />{c.id}
              </button>
            );
          })}
        </div>
      </section>

      {/* Fotos */}
      <section className="anim-rise" style={{ "--d": "80ms" }}>
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="font-display text-xl tracking-tight">Fotos <span className="text-muted tabular-nums">{photos.length}/{MAX_PHOTOS}</span></h3>
          {photos.length > 0 && <button onClick={resetAll} className="text-sm text-muted hover:text-ink inline-flex items-center gap-1.5"><RefreshCw size={14} />Neu starten</button>}
        </div>

        {photos.length === 0 ? (
          <div onDragOver={(e) => { e.preventDefault(); setDropHover(true); }} onDragLeave={() => setDropHover(false)}
            onDrop={(e) => { e.preventDefault(); setDropHover(false); addFiles(e.dataTransfer.files); }}
            className={`rounded-[28px] border-2 border-dashed transition-colors p-6 sm:p-10 ${dropHover ? "border-ink bg-soft" : "border-line"}`}>
            <p className="text-muted text-sm max-w-xs">Mach geführte Fotos oder wähle bis zu {MAX_PHOTOS} aus deiner Galerie. Die KI erkennt den Artikel und sortiert alles für Vinted.</p>
            <div className="mt-6 grid grid-cols-2 gap-2.5 max-w-md">
              <button onClick={() => setCamOpen(true)} className="group rounded-[22px] bg-ink text-bg p-4 text-left active:scale-[0.98] transition">
                <Camera size={22} /><div className="mt-6 font-medium">Geführt fotografieren</div><div className="text-xs opacity-60">mit Umriss-Linien</div>
              </button>
              <button onClick={() => galRef.current?.click()} className="rounded-[22px] bg-soft p-4 text-left active:scale-[0.98] transition hover:bg-line">
                <Images size={22} /><div className="mt-6 font-medium">Aus Galerie</div><div className="text-xs text-muted">mehrere auf einmal</div>
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 select-none"
              onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files); }}>
              {photos.map((p, i) => {
                const dragging = drag?.id === p.id;
                return (
                  <div key={p.id} ref={(el) => (el ? tileEls.current.set(p.id, el) : tileEls.current.delete(p.id))}
                    tabIndex={0} role="button" aria-label={`Foto ${i + 1}: ${slotLabel(p.slot)}. Pfeiltasten zum Verschieben, Enter zum Bearbeiten`}
                    onPointerDown={(e) => onTileDown(e, p.id)} onKeyDown={(e) => onTileKey(e, i, p.id)} onContextMenu={(e) => e.preventDefault()}
                    onClick={() => { if (!suppressClick.current) setEditId(p.id); }}
                    className={`tile relative aspect-[3/4] rounded-[18px] overflow-hidden cursor-grab focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${dragging ? "opacity-0" : ""} ${p.cutout && p.bg === "transparent" ? Checker : "bg-soft"}`}>
                    <img src={p.display} alt="" draggable={false} className={`w-full h-full pointer-events-none ${p.cutout && p.bg === "transparent" ? "object-contain p-2" : "object-cover"}`} />
                    {(p.processing || p.pending) && <div className="absolute inset-0 shimmer" />}
                    <span className={`absolute top-1.5 left-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium backdrop-blur-md ${i === 0 ? "bg-ink text-bg" : "bg-card/80 text-ink"}`}>
                      {i === 0 ? "Titelbild" : p.pending ? `${i + 1}` : `${i + 1} · ${slotLabel(p.slot)}`}
                    </span>
                    <button onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); remove(p.id); }}
                      className="absolute top-1.5 right-1.5 rounded-full bg-card/80 backdrop-blur-md p-1.5 opacity-90 hover:opacity-100" aria-label="Foto löschen"><X size={12} /></button>
                    {(p.adj || p.cutout) && (
                      <div className="absolute bottom-1.5 left-1.5 flex gap-1">
                        {p.adj && <span className="rounded-full bg-card/80 p-1"><Sun size={10} /></span>}
                        {p.cutout && <span className="rounded-full bg-card/80 p-1"><Scissors size={10} /></span>}
                      </div>
                    )}
                  </div>
                );
              })}
              {photos.length < MAX_PHOTOS && (
                <div className="aspect-[3/4] rounded-[18px] bg-soft grid grid-rows-2 overflow-hidden">
                  <button onClick={() => setCamOpen(true)} className="grid place-items-center hover:bg-line transition" aria-label="Foto aufnehmen"><Camera size={18} /></button>
                  <button onClick={() => galRef.current?.click()} className="grid place-items-center border-t border-bg hover:bg-line transition" aria-label="Aus Galerie hinzufügen"><Plus size={18} /></button>
                </div>
              )}
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
              <span>Foto halten und ziehen zum Sortieren · Antippen zum Bearbeiten</span>
              {photos.length > 1 && <button onClick={autoSort} className="inline-flex items-center gap-1.5 hover:text-ink"><ArrowDownUp size={13} />Automatisch sortieren</button>}
            </div>
          </>
        )}
        <input ref={galRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />

        {/* KI-Status */}
        {caps.ready && !aiOn ? (
          <div className="mt-4 rounded-[22px] bg-ink text-bg p-4 flex gap-3">
            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
            <div className="text-sm">
              <div className="font-medium">KI nicht verbunden</div>
              <div className="opacity-70 mt-0.5">Tippe oben auf das Zahnrad und trage die Worker-Adresse und deinen Zugangscode ein.</div>
            </div>
          </div>
        ) : photos.length > 0 && (
          <div className="mt-4 rounded-[22px] bg-soft p-4">
            <div className="flex items-center gap-2">
              {[["sort", "Art & Reihenfolge"], ["details", "Etikett & Details"]].map(([k, l], i) => {
                const doneStep = ai.step === "done" || (k === "sort" && ai.step === "details");
                const active = ai.step === k;
                return (
                  <React.Fragment key={k}>
                    {i > 0 && <span className="h-px w-4 bg-line" />}
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] ${active ? "bg-ink text-bg" : doneStep ? "bg-card text-ink" : "bg-card text-muted"}`}>
                      {active ? <Loader2 size={11} className="animate-spin" /> : doneStep ? <Check size={11} /> : <span className="w-[11px] text-center">{i + 1}</span>}{l}
                    </span>
                  </React.Fragment>
                );
              })}
              <span className="flex-1" />
              {busy
                ? <button onClick={() => { ctlRef.current?.abort(); setPhotos((ps) => ps.map((p) => ({ ...p, pending: false }))); setAi({ step: "idle", msg: "Analyse gestoppt." }); }} className="text-xs text-muted underline">Stopp</button>
                : <button onClick={() => analyze()} className="text-xs font-medium text-ink inline-flex items-center gap-1"><Sparkles size={12} />{ai.step === "idle" && !ai.msg ? "Analysieren" : "Neu analysieren"}</button>}
            </div>
            <p className={`mt-2.5 text-sm ${ai.step === "error" ? "text-ink font-medium" : "text-ink"}`}>{ai.msg || "Die Analyse startet automatisch, sobald Fotos da sind."}</p>
          </div>
        )}
      </section>

      {/* Inserat */}
      <section className="anim-rise" style={{ "--d": "160ms" }}>
        <h3 className="font-display text-xl tracking-tight mb-1">Inserat</h3>
        <p className="text-sm text-muted mb-4">Alles änderbar. Titel, Text und Preis passen sich sofort an.</p>

        <div className="grid grid-cols-2 gap-3">
          {field("brand", "Marke", { list: "brands", placeholder: "z. B. Carhartt" })}
          {field("model", "Modell / Serie", { placeholder: "z. B. Detroit Jacket" })}
          {field("itemType", "Artikel", { placeholder: "z. B. Kapuzenpullover" })}
          {field("color", "Farbe", { list: "colors", placeholder: "z. B. Schwarz" })}
          {field("material", "Material", { list: "materials", placeholder: "z. B. Baumwolle" })}
          {field("size", isShoe ? "Schuhgröße (EU)" : "Größe", { list: "sizes", placeholder: isShoe ? "z. B. 42" : "z. B. M" })}
          <Field label="Für">
            <Shimmer on={waiting("gender")}>
              <select className={inputCls} value={fields.gender} onChange={(e) => setUserF({ gender: e.target.value })}>
                <option value="">–</option>{["Damen", "Herren", "Unisex", "Kinder"].map((g) => <option key={g}>{g}</option>)}
              </select>
            </Shimmer>
          </Field>
          {field("style", "Stil", { placeholder: "z. B. Vintage" })}
        </div>
        <div className="mt-4">
          <span className="block text-[12px] text-muted mb-1.5">Zustand</span>
          <div className="flex flex-wrap gap-1.5">
            {CONDITIONS.map((c) => (
              <button key={c} onClick={() => { setUserF({ condition: c }); setManualPrice(null); }}
                className={`rounded-full px-3 py-1.5 text-xs transition ${fields.condition === c ? "bg-ink text-bg" : "bg-soft text-ink hover:bg-line"}`}>{c}</button>
            ))}
          </div>
        </div>
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          <Field label="Merkmale (eine pro Zeile)"><Shimmer on={waiting("details")}><textarea rows={3} className={inputCls} value={fields.details} placeholder="z. B. Kängurutasche" onChange={(e) => setUserF({ details: e.target.value })} /></Shimmer></Field>
          <Field label="Mängel (eine pro Zeile, sonst leer)"><textarea rows={3} className={inputCls} value={fields.flaws} placeholder="z. B. kleiner Fleck am Ärmel" onChange={(e) => setUserF({ flaws: e.target.value })} /></Field>
        </div>
        <div className="mt-3"><Field label="Eigene Notiz (optional)"><input className={inputCls} value={fields.notes} placeholder="z. B. Fällt eher klein aus" onChange={(e) => setUserF({ notes: e.target.value })} /></Field></div>

        <datalist id="brands">{Object.keys(BRANDS).map((b) => <option key={b} value={b} />)}</datalist>
        <datalist id="colors">{COLORS.map((b) => <option key={b} value={b} />)}</datalist>
        <datalist id="materials">{MATERIALS.map((b) => <option key={b} value={b} />)}</datalist>
        <datalist id="sizes">{sizes.map((b) => <option key={b} value={b} />)}</datalist>
      </section>

      {/* Preis */}
      <section className="anim-rise" style={{ "--d": "200ms" }}>
        <div className="rounded-[28px] bg-ink text-bg p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs opacity-60">Vorgeschlagener Preis</div>
              <div className="flex items-baseline gap-1 mt-1">
                <input type="number" inputMode="numeric" value={price} min="1"
                  onChange={(e) => setManualPrice(e.target.value === "" ? null : Math.max(1, Math.round(+e.target.value)))}
                  className="w-28 bg-transparent font-display text-[56px] leading-none tracking-[-0.04em] focus:outline-none" aria-label="Preis in Euro" />
                <span className="font-display text-3xl opacity-50">€</span>
              </div>
            </div>
            <button onClick={async () => { const ok = await copyText(String(price)); toast(ok ? "Preis kopiert" : "Kopieren nicht möglich"); }} className="rounded-full bg-bg/10 hover:bg-bg/20 px-3 py-1.5 text-xs inline-flex items-center gap-1.5"><Copy size={13} />Preis</button>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5 text-[11px]">
            <span className="rounded-full bg-bg/10 px-2.5 py-1">Marke ×{brandMult(fields.brand).toFixed(1)}{fields.brand && !brandKnown(fields.brand) ? " (unbekannt)" : ""}</span>
            <span className="rounded-full bg-bg/10 px-2.5 py-1">Zustand ×{(COND_MULT[fields.condition] || 1).toFixed(2)}</span>
            {materialMult(fields.material) !== 1 && <span className="rounded-full bg-bg/10 px-2.5 py-1">Material ×{materialMult(fields.material).toFixed(2)}</span>}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <button onClick={() => setManualPrice(roundPrice(autoPrice * 0.82))} className="rounded-2xl bg-bg/10 hover:bg-bg/15 px-3 py-2.5 text-left"><span className="opacity-60 block">Schnell verkaufen</span><b className="text-sm font-medium">{roundPrice(autoPrice * 0.82)} €</b></button>
            <button onClick={() => setManualPrice(roundPrice(autoPrice * 1.18))} className="rounded-2xl bg-bg/10 hover:bg-bg/15 px-3 py-2.5 text-left"><span className="opacity-60 block">Mehr Geduld</span><b className="text-sm font-medium">{roundPrice(autoPrice * 1.18)} €</b></button>
          </div>
          {manualPrice !== null && <button onClick={() => setManualPrice(null)} className="mt-3 text-xs opacity-80 inline-flex items-center gap-1"><RefreshCw size={12} />Automatischen Preis nutzen ({autoPrice} €)</button>}
        </div>
      </section>

      {/* Texte */}
      <section className="anim-rise space-y-3" style={{ "--d": "240ms" }}>
        <div className="flex items-end justify-between gap-3">
          <h3 className="font-display text-xl tracking-tight">Text</h3>
          <button onClick={() => setOptsOpen((v) => !v)} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition ${optsOpen ? "bg-ink text-bg" : "bg-soft text-ink"}`}><SlidersH size={13} />Anpassen</button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(TEXT_STYLES).map(([id, s]) => (
            <button key={id} onClick={() => setTextStyle(id)} className={`rounded-2xl px-3 py-2.5 text-left transition ${textStyle === id ? "bg-ink text-bg" : "bg-soft text-ink hover:bg-line"}`}>
              <div className="text-sm font-medium">{s.label}</div><div className="text-[11px] opacity-60">{s.sub}</div>
            </button>
          ))}
        </div>
        {optsOpen && (
          <div className="rounded-[22px] bg-soft px-4 py-2 anim-fade">
            <div className="divide-y divide-line">
              {TEXT_OPT_LABELS.filter(([k]) => k !== "hashtagsInText" || textOpts.hashtags).map(([k, lbl]) => <Toggle key={k} on={!!textOpts[k]} label={lbl} onClick={() => setTextOpt(k, !textOpts[k])} />)}
            </div>
            <div className="py-3"><Field label="Eigener Schlusssatz (optional)"><input className={inputCls} value={textOpts.closing} placeholder="z. B. Preis verhandelbar" onChange={(e) => setTextOpt("closing", e.target.value)} /></Field></div>
          </div>
        )}
        {[["Titel", title, "font-display text-lg tracking-tight leading-snug"], ["Beschreibung", description, "whitespace-pre-line text-[14px] leading-relaxed"], ...(textOpts.hashtags && !textOpts.hashtagsInText ? [["Hashtags", hashtags, "text-[14px] text-muted"]] : [])].map(([lbl, txt, cls]) => (
          <div key={lbl} className="rounded-[22px] bg-soft p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[12px] text-muted">{lbl}{lbl === "Titel" && <span className="ml-1.5 tabular-nums">{txt.length}/70</span>}</span>
              <CopyBtn text={txt} label={lbl} toast={toast} />
            </div>
            <div className={`text-ink break-words ${cls}`}>{txt || <span className="text-muted">Wird automatisch erstellt</span>}</div>
          </div>
        ))}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Btn variant="soft" disabled={!hasContent} onClick={async () => { const ok = await copyText(fullText); toast(ok ? "Alles kopiert" : "Kopieren nicht möglich"); }}><ClipboardCheck size={16} />Alles kopieren</Btn>
          <Btn variant="soft" disabled={!photos.length} onClick={savePhotos}><Download size={16} />Fotos sichern</Btn>
        </div>
      </section>

      {/* Schwebende Aktionsleiste */}
      <div className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom,0px)+14px)] z-30 px-4 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto rounded-full bg-ink text-bg shadow-[0_18px_40px_-12px_rgb(0_0_0/0.45)] flex items-center gap-2 p-1.5 pl-5">
          <span className="font-display text-lg tabular-nums tracking-tight">{price} €</span>
          <span className="text-xs opacity-50 truncate flex-1">{title || "Noch kein Titel"}</span>
          <button disabled={!hasContent} onClick={saveDraft} className="rounded-full bg-bg text-ink px-4 py-2.5 text-sm font-medium inline-flex items-center gap-1.5 disabled:opacity-40 active:scale-95 transition"><Save size={15} />Speichern</button>
        </div>
      </div>

      {dragPhoto && (
        <div className="fixed z-[70] pointer-events-none rounded-[18px] overflow-hidden shadow-[0_24px_50px_-12px_rgb(0_0_0/0.5)] scale-105 rotate-2" style={{ left: drag.x - drag.ox, top: drag.y - drag.oy, width: drag.w, aspectRatio: "3 / 4" }}>
          <img src={dragPhoto.display} alt="" className={`w-full h-full ${dragPhoto.cutout ? "object-contain bg-card" : "object-cover"}`} />
        </div>
      )}

      <CameraModal open={camOpen} onClose={() => setCamOpen(false)} category={category} onShot={addPhoto} count={photos.length} />
      <EditorModal photo={editPhoto} cutoutOn={cutoutOn} onClose={() => setEditId(null)}
        onChange={(patch, noRender) => { renderOne(editId, patch, noRender); if (patch.slot && !manualOrder.current) setTimeout(() => setPhotos((ps) => sortPhotos(ps)), 0); }}
        onApplyLookAll={applyLookAll} onApplyAllCutout={applyAllCutout}
        onBrushDone={() => renderOne(editId)} onBrushReset={() => { BRUSHES.delete(editId); renderOne(editId); }} />
    </div>
  );
}

/* ---------------- App ---------------- */
function App() {
  const [capsVersion, setCapsVersion] = useState(0);
  const caps = useCaps(capsVersion);
  const [tab, setTab] = useState("studio");
  const [drafts, setDraftsRaw] = useState(() => store.get("vsp:drafts", []));
  const [toastMsg, setToastMsg] = useState("");
  const [loadDraft, setLoadDraft] = useState(null);
  const tRef = useRef(null);
  const toast = useCallback((m) => { setToastMsg(m); clearTimeout(tRef.current); tRef.current = setTimeout(() => setToastMsg(""), 2200); }, []);
  const setDrafts = (fn) => setDraftsRaw((ds) => { const next = typeof fn === "function" ? fn(ds) : fn; store.set("vsp:drafts", next); return next; });
  const saveDraft = (draft) => {
    let result = "ok";
    setDraftsRaw((ds) => {
      const existing = ds.find((x) => x.id === draft.id);
      const merged = existing ? { ...draft, status: existing.status, createdAt: existing.createdAt } : draft;
      let next = existing ? ds.map((x) => (x.id === draft.id ? merged : x)) : [merged, ...ds];
      if (!store.set("vsp:drafts", next)) {
        next = next.map((x) => (x.id === draft.id ? { ...x, photos: (x.photos || []).slice(0, 1) } : x));
        if (!store.set("vsp:drafts", next)) { next = next.map((x) => (x.id === draft.id ? { ...x, photos: [] } : x)); store.set("vsp:drafts", next); result = "nophotos"; }
      }
      return next;
    });
    return result;
  };
  const tabs = [["studio", "Studio"], ["drafts", "Entwürfe"]];
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [conn, setConn] = useState(getSettings);
  useEffect(() => { if (!getSettings().workerUrl || !getSettings().code) setSettingsOpen(true); }, []);
  return (
    <div className="min-h-full">
      <header className="sticky top-[env(safe-area-inset-top,0px)] z-30 bg-bg/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="font-display text-[17px] font-semibold tracking-[-0.03em] text-ink">Vinted Studio Pro</h1>
          <div className="flex items-center gap-2">
          {<button onClick={() => setSettingsOpen(true)} className="w-9 h-9 grid place-items-center rounded-full bg-soft" aria-label="Einstellungen"><SettingsIcon size={16} /></button>}
          <nav className="flex items-center gap-1 rounded-full bg-soft p-1" aria-label="Bereiche">
            {tabs.map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)} aria-current={tab === id ? "page" : undefined}
                className={`rounded-full px-3.5 py-1.5 text-[13px] transition ${tab === id ? "bg-ink text-bg" : "text-muted hover:text-ink"}`}>
                {label}{id === "drafts" && drafts.length > 0 && <span className="ml-1.5 tabular-nums opacity-60">{drafts.length}</span>}
              </button>
            ))}
          </nav>
          </div>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 pt-6 pb-32">
        <div className={tab === "studio" ? "" : "hidden"}>
          <Studio caps={caps} toast={toast} onSaveDraft={saveDraft} loadDraft={loadDraft} clearLoad={() => setLoadDraft(null)} />
        </div>
        {tab === "drafts" && <Inventory drafts={drafts} setDrafts={setDrafts} toast={toast} onEdit={(d) => { setLoadDraft(d); setTab("studio"); window.scrollTo({ top: 0 }); }} />}
      </main>
      <Modal open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display text-2xl tracking-tight">Einstellungen</h3>
            <button onClick={() => setSettingsOpen(false)} className="p-2 rounded-full hover:bg-soft" aria-label="Schließen"><X size={20} /></button>
          </div>
          <p className="text-sm text-muted">Analyse und Freistellen laufen über deinen eigenen kostenlosen Worker. Die Daten bleiben auf diesem Gerät.</p>
          <div className="mt-4 space-y-3">
            <Field label="Worker-Adresse"><input className={inputCls} inputMode="url" autoComplete="off" autoCapitalize="off" spellCheck={false} value={conn.workerUrl} placeholder="https://vinted-studio.deinname.workers.dev" onChange={(e) => setConn({ ...conn, workerUrl: e.target.value.trim() })} /></Field>
            <Field label="Zugangscode"><input className={inputCls} type="password" autoComplete="off" autoCapitalize="off" spellCheck={false} value={conn.code} placeholder="vom Admin bekommen" onChange={(e) => setConn({ ...conn, code: e.target.value.trim() })} /></Field>
          </div>
          <Btn variant="dark" className="w-full mt-4" onClick={() => { saveSettings(conn); setCapsVersion((v) => v + 1); setSettingsOpen(false); toast("Gespeichert"); }}>Speichern</Btn>
        </div>
      </Modal>
      <div aria-live="polite" className={`fixed left-1/2 -translate-x-1/2 top-[calc(env(safe-area-inset-top,0px)+64px)] z-[60] transition duration-300 ${toastMsg ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
        <div className="rounded-full bg-ink text-bg px-4 py-2.5 text-sm shadow-xl flex items-center gap-2 whitespace-nowrap"><Check size={15} />{toastMsg}</div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
