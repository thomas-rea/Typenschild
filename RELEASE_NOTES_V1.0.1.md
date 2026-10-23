# V1.0.1 – PDF-Korrekturen (Arbeitsblatt-Generator)

- Druckoptimierte Motortypenschilder bleiben bei der PDF-Erzeugung SVG-Vektorgrafiken; der in V1.0.0 eingeführte CSS-Graustufenfilter wurde entfernt. Die Schwarz-Weiß-Gestaltung erfolgt weiterhin direkt im SVG.
- Kurzlösungen werden in festen Gruppen von maximal drei Motoren pro A4-Seite ausgegeben. Typografie und Zwischenräume im Lösungsteil werden kompakter gehalten.
- Der Lerntrainer und die archivierte Blattcode-Engine `v1.0.0/` bleiben unverändert. Bereits erzeugte Blattcodes behalten ihre Bedeutung.

## Veröffentlichung

Die geänderten Dateien sind ausschließlich `generator/generator.css`, `generator/generator.js` und `generator/index.html`. Für eine einfache Veröffentlichung kann das gesamte ZIP in das bestehende Repository kopiert werden. Der Ordner `v1.0.0/` darf bei bereits verteilten Arbeitsblättern nicht gelöscht werden.
