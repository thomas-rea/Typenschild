# Motortypenschild-Trainer

Interaktive, browserbasierte Lernanwendung zur Vorbereitung auf technische Prüfungen in der Berufsausbildung, insbesondere für Mechatroniker:innen und Elektroniker:innen.

Im Mittelpunkt stehen realitätsnah gestaltete, wechselnde Motortypenschilder. Lernende lesen technische Angaben ab, interpretieren sie und verwenden sie für Verständnisfragen, Berechnungen und technische Entscheidungen. Die Aufgaben orientieren sich thematisch an der Abschlussprüfung Teil 2 (AP2), sind jedoch keine offiziellen IHK-Prüfungsaufgaben.

**Aktueller Stand: Version 18 (V18).**

## Anwendung starten

### Online mit GitHub Pages

Die Datei `index.html` im Hauptverzeichnis des Repositorys ablegen. Anschließend unter **Settings → Pages → Deploy from a branch → main → / (root)** die Veröffentlichung aktivieren. Die öffentliche Adresse wird in den Pages-Einstellungen angezeigt.

Beim Aktualisieren die bisherige `index.html` durch die Datei der neuen Version ersetzen. Die README-Datei ist für die Funktion der Anwendung nicht erforderlich.

### Lokal

Die HTML-Datei mit einem aktuellen Browser wie Firefox, Chrome oder Edge öffnen. Installation, Server und Internetverbindung sind für den eigentlichen Lerntrainer nicht erforderlich.

## Unterstützte Motorarten

Die Motorart lässt sich oberhalb des Typenschilds auswählen. Beim Start ist **„Zufall (alle)“** aktiviert, sodass sämtliche unterstützten Bauarten vorkommen können.

| Motorart | Inhalt |
| --- | --- |
| Moderner Drehstrom-Asynchronmotor | Nennspannungen, Stern-/Dreieck-Zuordnung, Strom, Leistung und weitere Bemessungsdaten |
| Historischer Drehstrom-Asynchronmotor | Frühere Spannungsreihen wie 220/380 V und 380/660 V, Baujahr und Vergleich mit heutigen Netzspannungen |
| Dahlandermotor Δ/YY | Eine polumschaltbare Statorwicklung mit zwei Drehzahl- und Leistungsstufen |
| Dahlandermotor Y/YY | Polumschaltbare Statorwicklung, insbesondere mit Blick auf Lüfteranwendungen |
| Motor mit zwei getrennten Wicklungen Y/Y | Zwei unabhängige Wicklungssysteme mit unterschiedlichen Polzahlen und Bemessungsdaten |

Die Typenschilder werden mit acht unterschiedlichen Designfamilien erzeugt. Dazu gehören moderne Metalloberflächen und historische, gealterte Ausführungen. Hersteller, Baujahre, Typbezeichnungen und technische Daten variieren.

Die Schaltungskennzeichnungen stehen, soweit vorhanden, unmittelbar bei den Spannungsangaben. Bei Standardmotoren erscheint beispielsweise `Δ/Y 230/400 V`; auf einem Teil der Schilder wird die Zuordnung bewusst nicht ausgeschrieben. Dahlander- und Zweiwicklungs-Motoren besitzen die zur Bauart passenden Kennzeichnungen.

## Prüfungsfragen

**„Prüfungsfragen“ ist die Startansicht.** Ein regulärer Durchgang enthält 15 Aufgaben zum jeweils sichtbaren Motor. Die Aufgaben stammen aus mehreren Themenbereichen und werden in Auswahl, Reihenfolge und teilweise in der Formulierung variiert.

Behandelt werden unter anderem die Interpretation von Motortypenschildern, Stern- und Dreieckschaltung, Stern-Dreieck-Anlauf, polumschaltbare Wicklungen, elektrische und mechanische Leistung, Strom, Leistungsfaktor, Wirkungsgrad, Drehmoment, Polzahl, Drehfelddrehzahl, Schlupf, Motorschutz sowie weitere Typenschildangaben.

Die Aufgaben kombinieren Multiple Choice mit freien Zahleneingaben. Bei Rechenfragen müssen die benötigten Angaben normalerweise selbst vom Typenschild abgelesen werden. Nach der Antwort erscheinen die Bewertung, eine Erläuterung und gegebenenfalls der Rechenweg. Erst danach wird zur nächsten Aufgabe gewechselt.

Ein segmentierter Fortschrittsbalken kennzeichnet richtige Antworten grün und falsche rot. Nach einem Durchgang lassen sich falsche Antworten einschließlich der ursprünglichen Antwort und der Erklärung nacharbeiten. Diese Fehlerfragen können gezielt erneut geübt werden; bei Multiple Choice wird die Reihenfolge der Optionen neu gemischt.

Mit **„Neue Fragen“** beginnt ein neuer Durchgang zum gleichen Motor. **„Neues Typenschild“** erzeugt neue Motordaten innerhalb der ausgewählten Motorart beziehungsweise des Zufallsmodus.

Auf Smartphones kann das Typenschild während der Fragen über **„Schild ansehen“** in einer größeren, seitlich verschiebbaren Ansicht geöffnet werden, ohne die Lösungen einzublenden.

## Schild verstehen

Im Lernmodus lassen sich einzelne Angaben direkt auf dem Typenschild oder über die Feldübersicht auswählen. Dazu erscheinen Erläuterungen, gegebenenfalls Formeln und Rechenbeispiele mit den Daten des dargestellten Motors.

Die Inhalte umfassen insbesondere die Motorart und den Wicklungsaufbau, Spannungs- und Stromangaben, Leistungswerte, cos φ, Wirkungsgrad, Synchrondrehzahl, Schlupf, Schaltungskennzeichnungen, Schutzart, Betriebsart, Isolierstoffklasse, Bauform und Baujahr. Bei Mehrdrehzahlmotoren werden die beiden Bemessungsstufen getrennt erläutert.

Zu den Schaltungsinhalten gehören vereinfachte Wicklungs- und Klemmbrettdarstellungen. Beim Baujahr werden auch Unterschiede zwischen historischen und heutigen Spannungsangaben erklärt. Physikalische Größengleichungen und Zahlenwertgleichungen werden unterschieden; erforderliche Einheiten sind angegeben.

## Übungslinks für den Unterricht

Die Schaltfläche **„Übungslink“** erzeugt einen Link zu einem reproduzierbaren Beispiel. Der Link enthält die Motorauswahl sowie Kennwerte zur Wiederherstellung des generierten Motors und des ursprünglichen Fragen-Durchgangs. Dadurch können Lernende denselben Ausgangsfall bearbeiten.

Für gemeinsame Unterrichtsaufgaben sollte der Link zur veröffentlichten GitHub-Pages-Seite verwendet werden. Die Wiederherstellung setzt dieselbe Anwendungsversion voraus. Ein Übungslink überträgt keine bisherigen Antworten oder individuellen Lernergebnisse.

## Didaktisches Ziel und Grenzen

Der Trainer soll das selbstständige Lesen realitätsnaher Motortypenschilder, die Auswahl geeigneter technischer Größen und die Anwendung elektrotechnischer Zusammenhänge fördern. Die Werte sind **didaktisch generierte, plausibilisierte Beispiele** und keine tatsächlich vermessenen oder vom Hersteller freigegebenen Motoren.

Die Anwendung ist eine Lernhilfe. Reale Anschlussentscheidungen, Schutzmaßnahmen und Dimensionierungen müssen anhand der konkreten Herstellerunterlagen und geltenden technischen Regeln geprüft werden. Die dargestellten Anschlussbilder sind vereinfachte Lernmodelle und keine verbindlichen Verdrahtungsanweisungen.

## Technischer Aufbau

Die Anwendung besteht aus einer eigenständigen HTML-Datei mit integriertem CSS und JavaScript. Typenschilder und Schaltungsillustrationen werden als SVG erzeugt; für mathematische Formeln kommt MathML zum Einsatz. Es werden weder ein Backend noch externe JavaScript-Bibliotheken benötigt.

Die Auswertung findet im Browser statt. Eine dauerhafte Speicherung persönlicher Lernfortschritte oder eine zentrale Ergebnisübersicht für Lehrkräfte ist nicht implementiert.

## Weiterentwicklung und Feedback

Die Anwendung wird fortlaufend fachlich und didaktisch überarbeitet. Perspektivisch sind vertiefende Aufgaben zu elektrischen Maschinen und Antrieben denkbar, beispielsweise zur Frequenzumrichter-Parametrierung, zu praxisbezogenen Anwendungsrechnungen oder zur Fehlersuche. Diese weiterführenden Module sind **noch nicht Bestandteil der V18**.

Hinweise zu unplausiblen Motorwerten, missverständlichen Erklärungen, fehlerhaften Aufgaben oder Bedienproblemen können über die **Issues** des GitHub-Repositorys gemeldet werden.
