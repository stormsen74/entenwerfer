# Entenwerfer (React + Vite + PHP API)

Die App nutzt `HashRouter` und funktioniert dadurch ohne Rewrite-Regeln auf einfachem PHP-Webspace.

## Lokale Entwicklung

1. Abhängigkeiten installieren:
   ```bash
   npm install
   ```
2. PHP-API starten (Terminal 1):
   ```bash
   npm run api:dev
   ```
   Läuft standardmäßig auf `http://127.0.0.1:8000`.
3. Vite-Dev-Server starten (Terminal 2):
   ```bash
   npm run dev
   ```
   Läuft standardmäßig auf `http://127.0.0.1:3000`.

Der Vite-Server proxyt `/api/*` im Dev-Betrieb automatisch zur PHP-API.

## Optionale Konfiguration

- `VITE_DEV_API_TARGET` (nur lokal für Vite-Proxy), Beispiel:
  ```bash
  VITE_DEV_API_TARGET=http://127.0.0.1:8080
  ```
- `VITE_API_BASE_URL` (Frontend-Basis für API-Requests), Beispiel:
  ```bash
  VITE_API_BASE_URL=https://example.com
  ```

Ohne diese Variablen verwendet das Frontend standardmäßig `/api/players.php`.

## Build für Deployment

```bash
npm run build
```

Die Build-Artefakte liegen anschließend in `dist/`.

## Upload auf den Server

Für reines Datei-Deployment auf PHP-Webspace hochladen:

1. Inhalt von `dist/` (HTML/CSS/JS der React-App)
2. `api/players.php`
3. `data/players.json` (oder mindestens den Ordner `data/` mit Schreibrechten)

Hinweis: Der Webserver/PHP-Prozess braucht Schreibrechte auf `data/players.json`, damit `POST` speichern kann.
