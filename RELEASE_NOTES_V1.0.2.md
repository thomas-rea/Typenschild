# Release V1.0.2 – Stabilitätskorrekturen

## Korrigiert

1. **Blattcode-Eingabe auf der Hauptseite:** Der eingegebene oder über `?code=` verlinkte Code wird an den dafür vorgesehenen archivierten Lerntrainer unter `/v1.0.0/` weitergegeben. Damit gibt es für Nutzer:innen keine zweite, abweichende Decoder-Version mehr.
2. **Deutsche Zahlenformate:** `3.000`, `3 000`, `1.234,5` und gewöhnliche Dezimalkommas werden beim Bewerten in der Hauptseite **und** im Archiv akzeptiert. Ein alleinstehender Dezimalpunkt ist weiterhin möglich, sofern er nicht die erkennbare deutsche Tausendergruppierung bezeichnet.
3. **Lösungscode-Ansicht:** An `A-...` angehängtes `&solutions=1` schaltet nicht mehr direkt zur Lösungsseite. Lösungen werden unmittelbar nur mit dem zugehörigen `L-...` angezeigt. Diese rein clientseitige Anwendung bietet keinen Zugriffsschutz auf Lösungen.
4. **Ungültige gedruckte Codes:** Statt unbemerkt ein zufälliges Blatt zu öffnen, erscheint eine Fehleranzeige.
5. **Übungslink:** Frühere `code`, `sheet`, `items` und `solutions`-Parameter werden beim Kopieren eines neuen gewöhnlichen Übungslinks entfernt.
6. **Schwarz-Weiß-Ausgabe:** Flecken- und Kratzgruppen gealterter Schilder werden beim Drucken ausgeblendet, statt als störende graue Ringe aufzutauchen.
7. **Ableseaufgaben:** `starvoltage` und `deltavoltage` benötigen nur noch kurze Antwortzeilen statt Rechenkästchen.
8. **Generator-CSS:** In eingebettete Typenschild-SVGs werden ausschließlich die nötigen `.plate`-Regeln aufgenommen. Globale Stile des Trainers können die Generatoroberfläche nicht länger überschreiben; die SVGs werden deutlich kleiner.
9. **Kompakte Lösungen:** Rechenschritte werden bevorzugt gegenüber allgemeinen Einheitenhinweisen; Verhältnisse erscheinen als dimensionslos statt mit einer vermeintlichen Einheit „Faktor“.

## Unverändert

- Dieselben Typenschilder, Fragen, Antwortreihenfolgen und Codes wie in V1.0.1 (Regressionstest mit 35 festen Motor-/Fragenkombinationen)
- Layout und Anzahl der Aufgabenseiten sowie QR-Links
- Motorhintergrund und Originaldarstellung im Lerntrainer
- Die bisherigen Code-Algorithmen und gedruckten Codes

## Qualitätskontrolle

- Browser-Regression: 35 feste Kombinationen, fünf Motorarten, sieben Seeds, Fragen/Optionen/Codes identisch zu V1.0.1
- Zahlenparser und ungültige Eingaben in Haupttrainer und Archiv geprüft
- Direktlösung aus Aufgabenlink blockiert; Lösungscode bleibt funktionsfähig
- PDF-Vorschau: fünf Motoren, zwölf A4-Seiten, 0 eingebettete Rasterbilder, anklickbare Links
- Belastungstest: 30 Motoren / 60 Arbeitsblattseiten / 10 Lösungsseiten, ohne Überlauf oder JavaScript-Fehler

## Nicht Teil dieses Patch-Releases

Die didaktische Überarbeitung des Aufgabenpools und die Neugewichtung der Fragen werden erst in einer zukünftigen Version vorgenommen, damit die aktuellen Blattcodes gültig bleiben.
