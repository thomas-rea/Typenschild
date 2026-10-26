# Motortypenschild – Lerntrainer und Arbeitsblattgenerator

Eigenständige browserbasierte Anwendung zum Lesen und Auswerten von Typenschildern elektrischer Maschinen. Arbeitsblätter mit Aufgaben, Lösungen, QR-Codes und kurzen Blattcodes können als PDF gespeichert werden.

Die Oberfläche umfasst den Lerntrainer unter `/` und den Arbeitsblattgenerator unter `/generator/`.

## Kompatibilität

Für bereits erstellte Arbeitsblätter bleibt `/v1.0.0/` unverändert. Neu erstellte Arbeitsblätter verwenden die Engine unter `/v1.1.0/` und Blattcodes wie `A1-XXXX-XXXX-X` bzw. `L1-XXXX-XXXX-X`. Die beiden Code-Versionen werden auf der Hauptseite automatisch zum passenden Archiv geleitet.

Die fachlichen Daten sind generierte Beispiele und ersetzen keine Herstellerunterlagen.

Version 1.1.1: Anzeige der Softwareversion, Prüfung des geladenen Codeformats und Cache-Aktualisierung.

## Bedienung ab V1.1.2

Der Lerntrainer und der Arbeitsblatt-Generator bieten einen optionalen Dunkelmodus. Die Auswahl wird lokal im Browser gespeichert. Arbeitsblatt-PDFs bleiben unabhängig davon hell. Die Eingabe von Blattcodes fügt Bindestriche selbstständig ein und unterstützt eingefügte Codes.

Die PDF-Ausgabe schlägt Dateien mit Dokumenttyp, Datum und einer Blattkennung vor. Für anklickbare Links im PDF beim Drucken im Browser „Als PDF speichern“ verwenden.

