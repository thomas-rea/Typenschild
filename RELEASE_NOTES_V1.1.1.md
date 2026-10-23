# Version 1.1.1 – Anzeige und Codeformat-Prüfung

- Generator-Kopfzeile zeigt die tatsächliche Version V1.1.1 statt V1.0.2.
- Der Hauptlerntrainer zeigt V1.1.1 dezent neben der Motorart-Auswahl.
- Generator prüft vor Freigabe die geladene Code-Engine auf das Format A1-XXXX-XXXX-X / L1-XXXX-XXXX-X. Alte oder gemischte Dateien erzeugen **keine** Arbeitsblätter mehr.
- Cache-Busting für `generator.js`, `generator.css` und den eingebetteten Trainer.
- Blattcode, Motor- und Fragengenerierung bleiben unverändert. Archivordner `v1.0.0/` und `v1.1.0/` bleiben bytegleich erhalten.

**Wichtig:** ZIP vollständig in das Repository übernehmen, insbesondere `generator/index.html`, `generator/generator.js` und `v1.1.0/index.html`. Nach GitHub-Pages-Veröffentlichung die Webseite neu laden (Strg+F5). Bei neuen PDFs müssen die Codes mit `A1-` und `L1-` beginnen.
