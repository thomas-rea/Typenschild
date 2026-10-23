# V20 – Arbeitsblatt-Generator

Die bisherige V19-Lernanwendung wurde minimal um versionierte Arbeitsblattlinks ergänzt. Ein solcher Link lädt einen durch feste Zufallswerte definierten Motor und **nur die auf dem Arbeitsblatt ausgewählten Fragen** in der gedruckten Reihenfolge. Mit dem Parameter `solutions=1` werden direkt die zugehörigen Erklärungen und Rechenwege angezeigt. Der normale Lerntrainer behält ansonsten die Funktionen der V19.

Neu ist der separate Generator unter `generator/` mit genauer Anzahl der Motoren, gleichmäßiger oder manueller Verteilung, ein-/zweiseitigem A4-Layout, QR-Codes sowie vier Varianten der Lösungsdokumente. Die PDF-Ausgabe nutzt die Druckfunktion des Browsers. Der Generator verwendet den als `v20/` archivierten Lerntrainer für langlebige QR-Links.

Getestet wurden reproduzierbare Fragen und Antworten für alle fünf Bauarten, Ein- und Zweiseitenlayout, Druckausgabe, manuelle Verteilung, 30 Motoren mit 60 Aufgabenseiten sowie das Auslesen eines vektorisierten QR-Codes aus einer gerenderten PDF.
