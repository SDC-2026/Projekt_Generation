# Defense als Generationenfrage

Eine interaktive Storytelling-Website über die Einstellung der Generation Z zur Landesverteidigung, Wehrpflicht und zum Gesellschaftsvertrag.

> Wie steht die Jugend zur Wehrpflicht? Eine Untersuchung über staatliche Fürsorge, Bürgerpflichten und den Gesellschaftsvertrag.

Die Website verbindet die Ergebnisse einer eigenen Online-Befragung mit interaktiven Visualisierungen und macht sie so verständlich, interaktiv und visuell ansprechend zugänglich.

---

## Die Umfrage

Grundlage der Website ist eine standardisierte Online-Befragung unter Studierenden, durchgeführt über Lamapoll am 10.06.2026.

- **228 Teilnehmende** insgesamt
- **Geschlecht:** 121 Männer, 90 Frauen, 11 Divers, 6 ohne Angabe
- **Altersgruppen:** 98× 18–21 Jahre, 95× 22–25 Jahre, 34× 26–29 Jahre, 1× unter 18 Jahre
- **218 von 228** Befragten sind aktuell als Student:in eingeschrieben
- Größte vertretene Studienrichtungen: Informatik & IT-Sicherheit (47), Ingenieurwesen & Technik (40), Architektur & Bauwesen (30), Sozial- & Verhaltenswissenschaften (29), Wirtschaftswissenschaften (28)

Erfasst wurden u. a. Einstellungen zu wirtschaftlichen Zukunftsperspektiven, Vertrauen in staatliche Institutionen, die grundsätzliche Bereitschaft zu einem verpflichtenden Wehrdienst, die Bedeutung sozialer vs. militärischer Sicherheit sowie Bedingungen, unter denen ein verpflichtender Gesellschaftsdienst eher akzeptiert würde.

Ein zentrales Ergebnis: Auf die Frage nach der grundsätzlichen Bereitschaft, einen verpflichtenden Wehrdienst zu leisten, antworteten 118 der 228 Befragten mit „sehr gering“, 42 mit „eher gering“, 31 neutral/unentschieden, 20 mit „eher hoch“ und 17 mit „sehr hoch“ — die Ablehnung überwiegt also deutlich.

Die Rohdaten liegen als CSV vor (`Umfrage_GenerationsfragDefense.csv` bzw. die vollständige Fassung `Umfrage_GenerationsfrageDefense_komplett.csv`) und bilden die Datenbasis für alle Charts der Website.

---

## Inhalte der Website

- Hero
- Kontext
- Forschungsfrage / These
- Gesellschaftsvertrag
- Methode
- Zusammenhänge (Scatterplot: Wehrdienst-Bereitschaft & Gesellschaftsvertrags-Score)
- Datenvisualisierung
- Erkenntnisse
- Fazit

---

## Technologien

- HTML5
- CSS3
- JavaScript (ES6)
- Vite
- GSAP + ScrollTrigger
- Chart.js

---

## Features

- Scroll-Pinning der Methoden-Sektion
- animierte Übergänge und Reveal-Animationen
- interaktive Navigation mit aktiven Nav-Dots
- datenbasierte, interaktive Visualisierungen: Scatterplot, Bubble-Chart, Butterfly-Chart, gruppiertes Balkendiagramm, Piktogramm-Chart, Halbkreis-Chart
- filterbare Charts (z. B. Geschlechterfilter im Scatterplot)
- responsive Gestaltung

---

## Design

Das Design orientiert sich an minimalistischen Websites mit Fokus auf:

- Klarheit
- Weißraum
- Typografie
- Storytelling
- ruhige Farbpalette
- interaktive Scroll-Erlebnisse

---

## Projektstruktur

```
.
├── src/
│   ├── assets/
│   ├── charts/
│   │   ├── bubblechart/
│   │   ├── butterfly/
│   │   ├── grouped_bar_chart_2/
│   │   ├── half-circle/
│   │   ├── pictogram_chart/
│   │   └── scatterchart/
│   ├── data/
│   ├── fonts/
│   ├── main.js
│   └── style.css
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

---

## Autorinnen

- Arina Rukina
- Leila Osman
- Nadja Saleh
- Renata Figueroa

Projekt im Rahmen des Studiengangs Data Science und Visualisierung, entwickelt im Rahmen des Gruppenprojekts **Projekt_Generation**.

---

## Lizenz

Dieses Projekt dient ausschließlich Lehr- und Forschungszwecken.
