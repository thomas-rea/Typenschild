# Motortypenschild-Trainer

Browserbasierte Lernanwendung zum Lesen, Verstehen und Auswerten von Typenschildern elektrischer Motoren. Die dargestellten Typenschilder und Motordaten sind fiktive, technisch modellierte Lernbeispiele.

## Motortypenschilder

Unterstützt werden moderne und historische Drehstrom-Asynchronmotoren, Dahlandermotoren in Δ/YY- und Y/YY-Ausführung sowie Motoren mit zwei getrennten Wicklungen. Ein kompaktes Menü erlaubt, beliebige Kombinationen dieser fünf Varianten auszuwählen. Beim ersten Aufruf sind alle Motorarten aktiviert.

Acht unterschiedlich gestaltete Typenschildvarianten, einschließlich historischer Oberflächen, zeigen wechselnde Daten zu Spannung, Strom, Leistung, Drehzahl, Wirkungsgrad, Leistungsfaktor, Schutzart, Betriebsart und weiteren Angaben. Die Schaltungskennzeichen stehen, soweit vorhanden, unmittelbar bei den Spannungsangaben.

## Lernen und üben

Der Bereich **Schild verstehen** erklärt einzelne Felder, Formeln, Wicklungs- und Anschlussdarstellungen sowie technische Hintergründe. Im interaktiven Aufgabenbereich stehen wechselnde Auswahl- und Rechenaufgaben mit Rückmeldungen, Rechenwegen und gezielter Fehlerwiederholung bereit.

Ein Übungslink kann denselben Motor und denselben Ausgangsdurchgang für mehrere Personen bereitstellen. Auf schmalen Bildschirmen lässt sich das Typenschild gesondert vergrößern.

## Arbeitsblatt-Generator

Unter `generator/` steht ein eigenständiger, öffentlich nutzbarer Arbeitsblatt-Generator bereit.

* Die Anzahl der Motoren ist frei zwischen 1 und 30 wählbar.
* Ein Motor erhält wahlweise **eine oder zwei A4-Seiten**. Die Aufgaben werden passend zum Platz zusammengestellt.
* Die Motorarten können **gleichmäßig verteilt oder mit einer genauen Anzahl je Bauart** festgelegt werden.
* Pro Motor lässt sich ein QR-Code zu **genau den gedruckten Aufgaben und Motordaten** einfügen.
* Lösungsoptionen: **ohne Lösungen**, **Kurzlösungen im Anhang**, **separates Lösungsdokument** oder **ausschließlich digitale Lösungslinks**.
* PDF-Ausgabe über den Druckdialog des Browsers: **Als PDF speichern** auswählen.

Der Generator speichert weder Namen noch Antworten. Alle Arbeitsblätter werden im Browser erzeugt; es ist kein Server zur Verarbeitung der Daten notwendig.

## Aufbau und Versionierung

* `index.html` – aktuelle Lernanwendung
* `generator/index.html` – Arbeitsblatt-Generator mit zugehörigen CSS-/JavaScript-Dateien
* `v20/index.html` – **unveränderliche Fassung des Lerntrainers für die QR-Codes dieser Arbeitsblätter**

Der versionierte Ordner `v20/` ist wichtig: Bei späteren Änderungen an Typenschildern oder Fragen sollen bereits gedruckte QR-Codes weiterhin dieselben Aufgaben öffnen. Deshalb `v20/` bei zukünftigen Updates **nicht löschen oder überschreiben**.

Die Darstellung der Typenschilder erfolgt mit SVG, der Formelsatz mit MathML. Der QR-Code-Generator verwendet eine lokal mitgelieferte JavaScript-Implementierung (Lizenzhinweis im Generatorverzeichnis). Die Anwendung benötigt keine Anmeldung, Datenbank oder externen Dienst für die Arbeitsblatt-Erstellung.

## Hinweise

Die Inhalte veranschaulichen technische Zusammenhänge und ersetzen keine Herstellerdokumentation. Für tatsächliche Anschlussentscheidungen, Schutzmaßnahmen und Dimensionierungen sind die jeweiligen technischen Unterlagen und geltenden Regeln maßgebend.
