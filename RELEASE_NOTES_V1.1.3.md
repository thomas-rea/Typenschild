# Version 1.1.3 – QR-Code-Bugfix

## Fehlerbehebung
- Fehler `qrVector is not defined` beim Generieren von Arbeitsblättern korrigiert.
- Die MIT-lizenzierte QR-Engine ist nun direkt in `generator/generator.js` enthalten. Dadurch funktioniert der Generator ohne die separat geladene Datei `qr-engine.js`.
- Das Generator-Update benötigt nur die geänderte `generator.js` und `generator/index.html`.
- Verständlicher Fehlerhinweis, falls die QR-Engine trotz Update nicht verfügbar sein sollte.
- Generator- und Lerntrainer-Versionsanzeige auf V1.1.3 aktualisiert.

## Kompatibilität
- Keine Änderungen an Motorerzeugung, Fragenbank oder Blattcode-Format.
- Archive `v1.0.0/` und `v1.1.0/` unverändert.
- Druckdarstellung, Dark Mode und bisherige Einstellungen bleiben unverändert.

## Installation
- **Einfach:** ZIP-Inhalt direkt ins Repository-Hauptverzeichnis kopieren und vorhandene Dateien ersetzen.
- **Minimal:** `generator/index.html`, `generator/generator.js` sowie für konsistente Versionsanzeige `index.html` ersetzen.
- Danach die Seite mit Strg+F5 neu laden und eine Test-PDF erzeugen.
- Die bestehende Datei `generator/qr-engine.js` muss nicht gelöscht werden; sie wird von der neuen Generatorseite nicht geladen.

Hinweis: Die QR-Bibliothek steht unter der MIT-Lizenz. Lizenztext: `generator/QR_LICENSE.txt`.
