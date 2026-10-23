# V23 – Hinweise zur Veröffentlichung

## Änderungen

- Zweiseitige Blätter: 10 Aufgaben, vier vorn und sechs hinten; je Motor fünf Rechen- und fünf Ankreuzaufgaben, sofern die Fragenbank das zulässt.
- Gleichmäßigerer Schreibraum auf der Rückseite: drei Rechenaufgaben teilen sich die Fläche.
- „Online bearbeiten“ oberhalb des QR-Codes, blau und unterstrichen.
- Einheitliche Arial-Schrift auch beim Blattcode in der Fußzeile.
- Deutlich sichtbarer Hinweis zur PDF-Erstellung.

## GitHub Pages

Die Dateien dieses Pakets in das Wurzelverzeichnis des Repositories kopieren. `generator/` erhält den Arbeitsblatt-Generator. `v23/` ist die passende, versionierte Lerntrainer-Datei für die neuen Blattcodes. `index.html` bleibt die Startseite.

Ältere `v22/`-Codes verwenden weiterhin acht Aufgaben auf zwei Seiten. Wenn bereits verteilt, den Ordner `v22/` behalten; sonst ist keine Archivierung erforderlich.

## PDF-Links

HTML-Druck erzeugt abhängig vom Druckziel PDF-Link-Annotationen. Für funktionierende Links im PDF bei Chrome/Edge als Druckziel **„Als PDF speichern“**, nicht „Microsoft Print to PDF“, PDF24-Drucker oder einen erneut gedruckten PDF-Ausdruck wählen. Auch PDF-Betrachter können sich unterscheiden. Das direkte Aufrufen via Blattcode funktioniert unabhängig davon.

### Commit

`fix: V23 mit zehn Aufgaben und überarbeitetem PDF-Drucklayout`
