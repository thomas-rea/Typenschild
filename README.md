# Motortypenschild-Trainer

Interaktive, browserbasierte Lernanwendung zur Vorbereitung auf technische Prüfungen in der Ausbildung, insbesondere für **Mechatroniker:innen** und **Elektroniker:innen**.

Im Mittelpunkt stehen wechselnde Typenschilder von Drehstromasynchronmotoren. Die Lernenden müssen technische Angaben selbstständig ablesen, deuten und für Verständnis- und Rechenaufgaben verwenden.

## Anwendung starten

**Online mit GitHub Pages:** Die Datei `index.html` im Hauptverzeichnis des Repositorys ablegen und unter **Settings → Pages → Deploy from a branch → main → / (root)** GitHub Pages aktivieren. Die veröffentlichte Adresse wird anschließend in den Pages-Einstellungen angezeigt.

**Lokal:** Die HTML-Datei herunterladen und direkt mit einem aktuellen Browser (z. B. Firefox, Chrome oder Edge) öffnen. Für den Trainer ist kein Server und keine Installation erforderlich.

> Bei jeder neuen Version die bisherige `index.html` durch die neue HTML-Datei ersetzen. Im Repository muss der Name `index.html` bleiben, wenn die Anwendung direkt über die Startadresse erreichbar sein soll.

## Funktionen

### Generierte Motortypenschilder

- Acht unterschiedliche Gestaltungen mit wechselnden **fiktiven Herstellern**, darunter drei gealterte Schilddesigns mit Patina.
- Variierende Bemessungsdaten für dreiphasige Asynchronmotoren, darunter Leistung, Spannung, Strom, Drehzahl, Wirkungsgrad und Leistungsfaktor.
- Wechselnde Schutzarten, Betriebsarten, Isolierstoffklassen und Bauformen.
- Unterschiedliche Spannungsfamilien, unter anderem **230/400 V** und **400/690 V**.
- Die Zuordnung von Stern und Dreieck wird auf dem Typenschild nicht vorweggenommen.

Die generierten Daten sind **didaktisch modellierte, technisch plausible Beispiele**. Sie sind keine Herstellerangaben und ersetzen keine verbindliche Motor- oder Maschinendokumentation.

### Prüfungsfragen (Startansicht)

- **15 Aufgaben je Durchgang**, zufällig aus einem Pool mit über 40 Aufgabentypen zusammengestellt.
- Variierende Aufgabenreihenfolge, Formulierungen und Antwortreihenfolge.
- Mischung aus Multiple-Choice- und Rechenaufgaben mit freier Zahleneingabe.
- Fragen zu **Stern-/Dreieckschaltung, Stern-Dreieck-Anlauf, Wicklungsspannung, Strom, Wirkungsgrad, Leistungsfaktor, Wirkleistung, Scheinleistung, Verlustleistung, Nenndrehmoment, Drehfelddrehzahl, Polpaarzahl und Schlupf** sowie zu Typenschildangaben.
- Bei Rechenaufgaben stehen die benötigten Zahlen nicht bereits im Fragetext: Sie müssen vom Schild abgelesen werden.
- Rückmeldung mit Begründung und, bei Rechenaufgaben, Rechenweg.
- Mit **„Neue Fragen“** werden für dasselbe Schild andere Aufgaben bevorzugt; **„Neues Typenschild“** erzeugt neue Motordaten.

### Schild verstehen

Im Lernmodus lassen sich einzelne Felder des Typenschilds anklicken. Erklärt werden unter anderem:

- Bedeutung der Spannungs- und Stromangaben
- Einordnung typischer Werte von Wirkungsgrad und `cos φ`
- Polzahlen und Synchrondrehzahlen bei 50 Hz
- Schutzarten (`IP`), Betriebsarten (`S`), Isolierstoffklassen und Bauformen
- Physikalische Formeln und Berechnungen anhand des angezeigten Motors

Die Formel für das Drehmoment wird sowohl allgemein als auch als **Zahlenwertgleichung** dargestellt; für die Zahlenwertgleichung sind die erforderlichen Einheiten ausdrücklich angegeben.

## Didaktisches Ziel

Die Anwendung soll nicht das Wiedererkennen fester Musterlösungen belohnen, sondern das **Lesen eines realitätsnahen Typenschilds**, die Auswahl geeigneter Größen und die Anwendung elektrotechnischer Zusammenhänge trainieren. Die Inhalte orientieren sich thematisch an typischen Aufgaben der Abschlussprüfung Teil 2; die Fragen sind neu formulierte Übungsaufgaben und **keine offiziellen IHK-Prüfungsaufgaben**.

## Technischer Aufbau

Die Anwendung besteht aus einer eigenständigen HTML-Datei mit integriertem CSS und JavaScript. Die Typenschilder werden direkt als SVG erzeugt. Der Formelsatz verwendet MathML. Es sind keine externen Bibliotheken und keine Backend-Verbindung notwendig. Der aktuelle Prüfungsdurchgang wird in der Anwendung ausgewertet; eine dauerhafte Speicherung des Lernfortschritts ist derzeit nicht vorgesehen.

## Geplante Erweiterungen

- Weitere Bauarten elektrischer Maschinen und zusätzliche Typenschildvarianten
- **Dahlandermotoren** und ihre typischen Doppel-Drehzahl- beziehungsweise Verschaltungsangaben
- Polumschaltbare Motoren mit **getrennten Wicklungen**
- Anschlussbilder und Aufgaben zur Wicklungsverschaltung
- Zusätzliche Prüfungs- und Transferaufgaben, insbesondere zur elektrischen Maschinen- und Antriebstechnik
- Fachliche Überarbeitung anhand von Rückmeldungen aus der Ausbildungspraxis

## Feedback und fachliche Prüfung

Der Trainer befindet sich in Weiterentwicklung. Hinweise zu unplausiblen Motorwerten, missverständlichen Erklärungen, fehlerhaften Fragen und sinnvollen Erweiterungen sind ausdrücklich willkommen, beispielsweise über die **Issues** dieses GitHub-Repositorys.

**Hinweis:** Die Anwendung ist eine Lernhilfe. Sicherheitstechnische Aussagen, Anschlussentscheidungen und Dimensionierungen müssen in der Praxis anhand der tatsächlichen Herstellerunterlagen und der geltenden Vorschriften geprüft werden.
