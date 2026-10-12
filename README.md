# Vinted Studio Pro

Private App für dich und deine Freunde: Fotos machen, Artikel automatisch erkennen lassen, Hintergrund entfernen und den fertigen Vinted-Text kopieren. Alles läuft kostenlos.

**So funktioniert es:**
- **GitHub Pages** stellt die App kostenlos ins Internet.
- **Google Gemini** (kostenlos) erkennt Marke, Größe, Material und sortiert die Fotos.
- **remove.bg** (50 kostenlose Bilder pro Monat) entfernt den Hintergrund.
- **Cloudflare Worker** (kostenlos) versteckt deine Schlüssel, damit niemand sie kopieren kann.

```
index.html            Startseite der App (hier trägst du die Worker-Adresse ein)
app.jsx               der komplette App-Code – hier bearbeitest du alles
manifest.webmanifest  damit die App ein eigenes Icon auf dem Home-Bildschirm bekommt
icons/                App-Icons
worker/worker.js      Code für den Cloudflare Worker
```

---

## Einrichtung (einmalig, ca. 20 Minuten)

### 1. Repo auf GitHub anlegen
1. Erstelle ein Konto auf [github.com](https://github.com).
2. Klicke oben rechts auf **+ → New repository**, nenne es `vinted-studio` und wähle **Public**.
3. Klicke auf **uploading an existing file** und ziehe alle Dateien und Ordner aus diesem Paket hinein.
4. Klicke auf **Commit changes**.

### 2. GitHub Pages einschalten
1. Öffne im Repo **Settings → Pages**.
2. Wähle bei *Source* **Deploy from a branch**, dann Branch **main** und Ordner **/ (root)**.
3. Klicke auf **Save**. Nach 1–2 Minuten ist deine App erreichbar unter:
   `https://DEINNAME.github.io/vinted-studio/`

### 3. Gemini-Schlüssel holen (kostenlos)
1. Öffne [aistudio.google.com](https://aistudio.google.com) und melde dich mit Google an.
2. Klicke auf **Get API key → Create API key** und kopiere den Schlüssel.

### 4. remove.bg-Schlüssel holen (kostenlos)
1. Erstelle ein Konto auf [remove.bg](https://www.remove.bg).
2. Öffne **Dashboard → API Keys → New API Key** und kopiere den Schlüssel.

### 5. Cloudflare Worker anlegen (kostenlos)
1. Erstelle ein Konto auf [dash.cloudflare.com](https://dash.cloudflare.com).
2. Öffne **Workers & Pages → Create → Create Worker**, nenne ihn `vinted-studio` und klicke auf **Deploy**.
3. Klicke auf **Edit code**, lösche den Beispielcode, füge den Inhalt von `worker/worker.js` ein und klicke auf **Deploy**.
4. Öffne beim Worker **Settings → Variables and Secrets** und füge diese Einträge hinzu:

| Name | Typ | Wert |
|---|---|---|
| `GEMINI_API_KEY` | Secret | dein Schlüssel aus Schritt 3 |
| `REMOVEBG_API_KEY` | Secret | dein Schlüssel aus Schritt 4 |
| `ACCESS_CODE` | Secret | ein Passwort, das du dir ausdenkst, z. B. `sommer-flohmarkt-24` |
| `ALLOWED_ORIGINS` | Text | `https://DEINNAME.github.io` (ohne `/vinted-studio`) |

5. Kopiere oben die Adresse deines Workers, z. B. `https://vinted-studio.deinname.workers.dev`.

### 6. Worker-Adresse in die App eintragen
1. Öffne im GitHub-Repo die Datei `index.html` und klicke auf den **Stift** (Bearbeiten).
2. Suche die Zeile `workerUrl: ""` und trage deine Worker-Adresse zwischen die Anführungszeichen ein.
3. Klicke auf **Commit changes**. Nach etwa einer Minute ist die Änderung live.

### 7. Auf dem iPhone installieren
1. Öffne **Safari** und gib deine App-Adresse ein: `https://DEINNAME.github.io/vinted-studio/`
2. Trage beim Zahnrad den **Zugangscode** aus Schritt 5 ein.
3. Tippe auf **Teilen → Zum Home-Bildschirm → Hinzufügen**.

Fertig. Deinen Freunden schickst du einfach den Link und den Zugangscode.

---

## Grenzen der kostenlosen Version

- **Gemini:** Es gibt Tageslimits, die sich alle teilen, die deinen Worker nutzen. Wenn das Limit erreicht ist, zeigt die App eine Meldung. Am nächsten Tag geht es weiter. Im kostenlosen Tarif darf Google eingesendete Inhalte zur Verbesserung seiner Dienste verwenden. Schick also keine privaten Fotos durch die Analyse.
- **remove.bg:** 50 Freistellungen pro Monat für alle zusammen, in Vorschau-Auflösung. Die App verfeinert die Kanten danach selbst auf voller Auflösung. Jedes Foto wird nur einmal an remove.bg geschickt. Look, Hintergrund und Pinsel kannst du danach beliebig ändern, ohne dass es nochmal zählt.
- **Entwürfe** werden nur auf dem jeweiligen Gerät gespeichert. Das Home-Bildschirm-Icon und Safari haben auf dem iPhone getrennte Speicher.

## Bearbeiten

- Kleine Änderungen machst du direkt auf github.com: Datei öffnen, Stift anklicken, ändern, **Commit changes**. Nach etwa einer Minute ist alles live.
- Die wichtigsten Stellen in `app.jsx` sind oben in der Datei beschrieben (Marken-Preise, Textstile, Bild-Looks).
- Für größere Umbauten kannst du `app.jsx` auch Claude geben und sagen, was du ändern willst.

## Probleme?

| Meldung | Lösung |
|---|---|
| „Falscher Zugangscode“ | Den Code beim Zahnrad genau so eintragen wie bei `ACCESS_CODE` im Worker. |
| „Keine Verbindung zum Worker“ | Worker-Adresse prüfen. Steht bei `ALLOWED_ORIGINS` deine GitHub-Adresse ohne `/` am Ende? |
| „Im Worker fehlt ein API-Schlüssel“ | Schritt 5.4 prüfen, Namen müssen exakt stimmen. |
| „Kostenloses Limit erreicht“ | Später nochmal versuchen. |
| Weiße Seite | Seite neu laden. Hilft das nicht: In `app.jsx` ist beim Bearbeiten ein Tippfehler passiert, letzte Änderung rückgängig machen. |
