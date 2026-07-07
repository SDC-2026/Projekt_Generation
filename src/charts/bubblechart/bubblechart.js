/* ==========================================================
   BUBBLE CHART — Frage 15 (CSV-ID: Frage 20)
   "Wann würde Gen Z einen Pflichtdienst eher akzeptieren?"
   Daten werden automatisch aus der CSV generiert
   (siehe scripts/generate-chart-data.mjs)
   ========================================================== */

import DATA from "./bubblechart-data.json";
import "./bubblechart.css";

const COLORS = [
  "#7CBA97", "#E0954B", "#8C7AE6", "#5B9BD5",
  "#D8B69C", "#A9D3BC", "#B96A52", "#DDD7CC",
  "#6B9080", "#C97B84", "#9AA7B0"
];

const GENDER_LABELS = {
  all: "Alle",
  w: "Frauen",
  m: "Männer",
  d: "Divers"
};

const SHORT_TITLES = {
  politische_repraesentation: "Politische Repräsentation",
  existenzsicherung: "Existenzsicherung",
  zukunftsperspektiven: "Zukunftsperspektiven",
  sinnhaftigkeit: "Sinnhaftigkeit",
  verguetung: "Angemessene Vergütung",
  berufliche_vorteile: "Berufliche Vorteile",
  lastengerechtigkeit: "Lastengerechtigkeit",
  aeussere_gefahr: "Akute äußere Gefahr",
  ohnehin_bereit: "Ohnehin bereit",
  lehnt_ab: "Lehnt Dienstpflicht ab",
  sonstiges: "Sonstiges"
};

const root = document.querySelector("#bubble-root");
if (!root) throw new Error("kein #bubble-root");

const maxRadius = 92;
const minRadius = 26;

let currentGroup = "all";

function radiusFor(pct, maxPct, scaleFactor) {
  const scale = Math.sqrt(pct / maxPct);
  return (minRadius + (maxRadius - minRadius) * scale) * scaleFactor;
}

// ---------- Spiral-Packing: deterministisch, ohne Überlappung ----------
// Größte Bubble in der Mitte, restliche werden entlang einer Spirale
// nach außen platziert (kein Zufall, kein "Ruckeln" zwischen Renders).
function packBubbles(items, width, height, scaleFactor) {
  const maxPct = Math.max(...items.map((d) => d.pct));
  const sorted = [...items]
    .sort((a, b) => b.pct - a.pct)
    .map((d, i) => ({ ...d, r: radiusFor(d.pct, maxPct, scaleFactor), color: COLORS[i % COLORS.length] }));

  const cx = width / 2;
  const cy = height * 0.36; // Anker im oberen Bereich statt Mitte, größte Bubbles landen dadurch oben
  const maxSearchRadius = Math.sqrt(width * width + height * height); // Diagonale, statt nur max(w,h)
  const placed = [];

  sorted.forEach((node, i) => {
    if (i === 0) {
      node.x = cx;
      node.y = cy;
      placed.push(node);
      return;
    }

    let angle = 0;
    let radius = node.r * 0.6;
    let placedOk = false;
    let lastX = cx;
    let lastY = cy;

    while (!placedOk) {
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      lastX = x;
      lastY = y;

      const overlaps = placed.some((p) => {
        const dx = p.x - x;
        const dy = p.y - y;
        return Math.sqrt(dx * dx + dy * dy) < p.r + node.r + 5;
      });

      const inBounds =
        x - node.r > 0 &&
        x + node.r < width &&
        y - node.r > 0 &&
        y + node.r < height;

      if (!overlaps && inBounds) {
        node.x = x;
        node.y = y;
        placed.push(node);
        placedOk = true;
      } else {
        angle += 0.25;
        radius += 1.4;
        if (radius > maxSearchRadius) {
          // Kein freier Platz mehr gefunden: an letzter Spiral-Position,
          // aber innerhalb der Canvas-Grenzen eingeklemmt platzieren
          // (leichte Überlappung ist das kleinere Übel als "unsichtbar").
          node.x = Math.min(Math.max(lastX, node.r), width - node.r);
          node.y = Math.min(Math.max(lastY, node.r), height - node.r);
          placed.push(node);
          placedOk = true;
        }
      }
    }
  });

  return placed;
}

function shortDisplayLabel(id, label) {
  return SHORT_TITLES[id] || (label.length > 24 ? label.slice(0, 22) + "…" : label);
}

function render() {
  const group = DATA[currentGroup];
  const containerWidth = root.clientWidth || 700;
  const width = Math.max(400, Math.min(820, containerWidth));
  const height = Math.round(width * 0.88);
  const scaleFactor = width / 700;

  const nodes = packBubbles(group.items, width, height, scaleFactor);

  const filtersHtml = Object.keys(GENDER_LABELS)
    .map(
      (g) => `
      <button class="bubblechart-filter-btn${g === currentGroup ? " active" : ""}" data-g="${g}">
        ${GENDER_LABELS[g]}
      </button>`
    )
    .join("");

  const bubblesHtml = nodes
    .map(
      (n) => `
      <div
        class="bubblechart-bubble"
        style="
          width:${n.r * 2}px;
          height:${n.r * 2}px;
          left:${n.x - n.r}px;
          top:${n.y - n.r}px;
          background:${n.color};
          font-size:${Math.max(11, n.r / 4.2)}px;
        "
        data-id="${n.id}"
        tabindex="0"
      >
        <span class="bubblechart-bubble-pct">${Math.round(n.pct)}%</span> <span class="bubblechart-bubble-label">${shortDisplayLabel(n.id, n.label)}</span>
      </div>`
    )
    .join("");

  root.innerHTML = `
    <div class="bubblechart-filters">${filtersHtml}</div>
    <div class="bubblechart-wrap">
      <div class="bubblechart-canvas" style="width:${width}px; height:${height}px;">
        ${bubblesHtml}
      </div>
    </div>
    <p class="chart-note">Bubble-Größe = Anteil der Befragten (${GENDER_LABELS[currentGroup]}), die diese Bedingung ausgewählt haben (Mehrfachauswahl möglich, n=${group.total}). Da Mehrfachnennungen möglich waren, addieren sich die Prozentwerte nicht auf 100 %.</p>
  `;



  root.querySelectorAll(".bubblechart-filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentGroup = btn.dataset.g;
      render();
    });
  });
}

render();

let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(render, 200);
});
