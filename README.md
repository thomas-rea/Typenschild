# Motortypenschild-Trainer

Ein interaktiver Lerntrainer zum Lesen und Verstehen von Typenschildern elektrischer Motoren. Die Anwendung zeigt wechselnde, realitätsnah gestaltete Motortypenschilder und verbindet deren technische Angaben mit Erklärungen, Verständnisfragen und Berechnungen.

**Aktueller Stand: V18**

## Motorarten und Typenschilder

Der Trainer enthält moderne und historische Drehstrom-Asynchronmotoren, Dahlandermotoren mit den Schaltungsvarianten Δ/YY und Y/YY sowie Motoren mit zwei getrennten Wicklungssystemen. Die Motorart kann gezielt ausgewählt werden. Standardmäßig wechselt die Anwendung im Zufallsmodus zwischen den unterstützten Varianten.

Acht unterschiedlich gestaltete Schilddesigns sorgen für abwechslungsreiche Darstellungen, darunter auch gealterte Metallschilder. Hersteller- und Typbezeichnungen, Baujahre und Bemessungsdaten variieren. Typische Angaben sind Spannung, Strom, Leistung, Drehzahl, Leistungsfaktor, Wirkungsgrad, Schutzart und Betriebsart.

Die Schaltungskennzeichen stehen, soweit vorhanden, unmittelbar bei den Spannungsangaben. Bei normalen Asynchronmotoren kann die Stern-/Dreieck-Kennzeichnung auch fehlen. Historische Schilder verwenden unter anderem frühere Spannungsreihen wie 220/380 V oder 380/660 V.

## Interaktive Aufgaben

Zu jedem dargestellten Motor stehen 15 wechselnde Aufgaben bereit. Sie verbinden die Interpretation technischer Angaben mit Fragen zur Motorbauart und mit Berechnungen, beispielsweise zu elektrischer und mechanischer Leistung, Drehmoment, Drehzahl, Schlupf oder Stromstärke.

Antworten erfolgen über Auswahlmöglichkeiten oder freie Zahleneingaben. Anschließend zeigt die Anwendung eine Rückmeldung und, soweit passend, einen nachvollziehbaren Rechenweg. Nach dem Durchgang können falsch beantwortete Aufgaben einschließlich der Erklärungen erneut angesehen und gezielt wiederholt werden.

Ein Fortschrittsbalken kennzeichnet richtige Antworten grün und falsche rot. Neue Aufgaben zum selben Motor oder ein neues Typenschild lassen sich jederzeit erzeugen. Auf kleinen Bildschirmen kann das Schild bei Bedarf gesondert betrachtet werden.

## Schild verstehen

Die Angaben auf dem Typenschild lassen sich direkt auswählen. Der Lernbereich erklärt ihre Bedeutung und zeigt passende Formeln, Beispiele, Tabellen und vereinfachte Schaltungsdarstellungen.

Zu den Themen zählen unter anderem Stern- und Dreieckschaltung, polumschaltbare Wicklungen, Synchrondrehzahl, Leistungsfaktor, Wirkungsgrad, Motorschutz und die Einordnung historischer Spannungsangaben. Bei Motoren mit zwei Drehzahlstufen werden die zugehörigen Bemessungsdaten getrennt betrachtet.

## Gemeinsame Übungsbeispiele

Über einen Übungslink lässt sich ein generierter Motor zusammen mit dem zugehörigen Ausgangsdurchgang teilen. So können mehrere Personen dieselben technischen Ausgangsdaten bearbeiten und vergleichen. Für eine zuverlässige Wiederherstellung sollte dieselbe Version der Anwendung verwendet werden.

## Technischer Aufbau und Hinweise

Der Trainer besteht aus einer eigenständigen HTML-Anwendung mit integriertem CSS und JavaScript. Die Typenschilder und Zeichnungen werden als SVG erzeugt, Formeln mit MathML dargestellt. Die Anwendung benötigt weder ein Backend noch externe JavaScript-Bibliotheken. Eine zentrale Speicherung persönlicher Ergebnisse ist nicht vorgesehen.

Sämtliche Hersteller- und Motordaten sind fiktive, für Lernzwecke generierte Beispiele. Die Anwendung dient der Veranschaulichung technischer Zusammenhänge und ersetzt keine Herstellerdokumentation. Tatsächliche Anschlussentscheidungen, Schutzmaßnahmen und Dimensionierungen sind anhand der konkreten technischen Unterlagen und der geltenden Regeln zu prüfen.
