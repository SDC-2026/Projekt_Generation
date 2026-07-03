/* ==========================================================
   BUTTERFLY CHART — Frage 6 vs. Frage 9
   Echte Umfragedaten (n=248 vollständige Antworten)
   ========================================================== */

const BUTTERFLY_DATA = {
  q6: {
    label: 'Frage 6 — Wirtschaftliche Zukunft',
    short:  'Wirtschaftliche Zukunft',
    Mann:   { 5: 34.1, 4: 45.9, 3: 6.7,  2: 8.9,  1: 4.4  },
    Frau:   { 5: 29.4, 4: 48.0, 3: 10.8, 2: 10.8, 1: 1.0  },
    Divers: { 5: 45.5, 4: 45.5, 3: 0.0,  2: 0.0,  1: 9.1  },
  },
  q9: {
    label: 'Frage 9 — Politische Wahrnehmung',
    short:  'Politische Wahrnehmung',
    Mann:   { 5: 2.2,  4: 4.4,  3: 17.8, 2: 41.5, 1: 34.1 },
    Frau:   { 5: 2.0,  4: 3.9,  3: 11.8, 2: 52.9, 1: 29.4 },
    Divers: { 5: 0.0,  4: 9.1,  3: 0.0,  2: 45.5, 1: 45.5 },
  },
};

const BUTTERFLY_N = { Mann: 135, Frau: 102, Divers: 11 };

const BUTTERFLY_ANSWER_LABELS = {
  5: 'Stimme voll zu',
  4: 'Stimme eher zu',
  3: 'Neutral',
  2: 'Stimme eher nicht zu',
  1: 'Stimme gar nicht zu',
};

/* Farben passend zum Projektdesign */
const BUTTERFLY_BAR_COLORS = {
  5: '#1D9E75',  /* Teal — starke Zustimmung   */
  4: '#9FE1CB',  /* Teal hell                   */
  3: '#B4B2A9',  /* Grau — neutral              */
  2: '#F0997B',  /* Coral hell                  */
  1: '#D85A30',  /* Coral — starke Ablehnung    */
};

const BUTTERFLY_GENDER_COLORS = {
  Mann:   '#2a78d6',
  Frau:   '#9085e9',
  Divers: '#eda100',
};

/* ----------------------------------------------------------
   INIT — wird aufgerufen, sobald DOM bereit ist
   ---------------------------------------------------------- */
function initButterflyChart() {
  const root = document.getElementById('butterfly-root');
  if (!root) return;

  /* Zustand */
  let activeGenders = new Set(['Mann', 'Frau', 'Divers']);

  /* Tooltip */
  const tooltip = document.createElement('div');
  tooltip.className = 'bc-tooltip';
  document.body.appendChild(tooltip);

  document.addEventListener('mousemove', e => {
    tooltip.style.left = (e.clientX + 14) + 'px';
    tooltip.style.top  = (e.clientY - 10) + 'px';
  });

  function showTooltip(e, html) {
    tooltip.innerHTML = html;
    tooltip.style.opacity = '1';
  }
  function hideTooltip() {
    tooltip.style.opacity = '0';
  }

  /* Hilfsfunktionen */
  function maxPct(dataObj) {
    let m = 0;
    for (const g of activeGenders) {
      for (const s of [1, 2, 3, 4, 5]) {
        m = Math.max(m, dataObj[g][s]);
      }
    }
    return Math.max(m, 10);
  }

  function barWidth(pct, max) {
    return Math.round((pct / max) * 200);
  }

  /* Geschlecht-Toggle */
  function toggleGender(g) {
    if (activeGenders.has(g)) {
      if (activeGenders.size > 1) activeGenders.delete(g);
    } else {
      activeGenders.add(g);
    }
    root.querySelectorAll('.bc-gbtn').forEach(btn => {
      btn.classList.toggle('bc-gbtn--on', activeGenders.has(btn.dataset.gender));
    });
    renderRows();
  }

  /* Zeilen rendern */
  function renderRows() {
    const gList   = ['Mann', 'Frau', 'Divers'].filter(g => activeGenders.has(g));
    const maxL    = maxPct(BUTTERFLY_DATA.q6);
    const maxR    = maxPct(BUTTERFLY_DATA.q9);
    const rowsEl  = root.querySelector('.bc-rows');

    let html = '';

    for (const score of [5, 4, 3, 2, 1]) {
      const label = BUTTERFLY_ANSWER_LABELS[score];
      const color = BUTTERFLY_BAR_COLORS[score];

      html += `<div class="bc-row">`;

      /* Linke Seite (Frage 6) */
      html += `<div class="bc-cell bc-cell--left">`;
      for (const g of gList) {
        const pct = BUTTERFLY_DATA.q6[g][score];
        const w   = barWidth(pct, maxL);
        const tip = `<strong>${g}</strong><br>Frage 6 · ${label}<br><strong>${pct.toFixed(1)} %</strong> (n=${BUTTERFLY_N[g]})`;
        html += `
          <div class="bc-bar-row bc-bar-row--left">
            <span class="bc-pct bc-pct--left">${pct.toFixed(1)} %</span>
            <div class="bc-bar"
              style="width:${w}px; background:${color}; box-shadow:inset 0 0 0 2px ${BUTTERFLY_GENDER_COLORS[g]}"
              data-tip="${tip.replace(/"/g, '&quot;')}"
            ></div>
          </div>`;
      }
      html += `</div>`;

      /* Mittellabel */
      html += `<div class="bc-mid">${label}</div>`;

      /* Rechte Seite (Frage 9) */
      html += `<div class="bc-cell bc-cell--right">`;
      for (const g of gList) {
        const pct = BUTTERFLY_DATA.q9[g][score];
        const w   = barWidth(pct, maxR);
        const tip = `<strong>${g}</strong><br>Frage 9 · ${label}<br><strong>${pct.toFixed(1)} %</strong> (n=${BUTTERFLY_N[g]})`;
        html += `
          <div class="bc-bar-row bc-bar-row--right">
            <div class="bc-bar"
              style="width:${w}px; background:${color}; box-shadow:inset 0 0 0 2px ${BUTTERFLY_GENDER_COLORS[g]}"
              data-tip="${tip.replace(/"/g, '&quot;')}"
            ></div>
            <span class="bc-pct bc-pct--right">${pct.toFixed(1)} %</span>
          </div>`;
      }
      html += `</div>`;

      html += `</div>`;
    }

    rowsEl.innerHTML = html;

    /* Tooltip-Events nach Render */
    rowsEl.querySelectorAll('.bc-bar').forEach(bar => {
      bar.addEventListener('mouseenter', e => showTooltip(e, bar.dataset.tip));
      bar.addEventListener('mouseleave', hideTooltip);
    });
  }

  /* Grundstruktur bauen */
  root.innerHTML = `
    <div class="bc-controls">
      <span class="bc-controls-label">Anzeigen</span>
      ${['Mann', 'Frau', 'Divers'].map(g => `
        <button class="bc-gbtn bc-gbtn--on" data-gender="${g}">
          <span class="bc-gbtn-dot" style="background:${BUTTERFLY_GENDER_COLORS[g]}"></span>
          ${g} <span class="bc-gbtn-n">(n=${BUTTERFLY_N[g]})</span>
        </button>`).join('')}
    </div>

    <div class="bc-col-heads">
      <div class="bc-col-head bc-col-head--left">Frage 6 — Wirtschaftliche Zukunft</div>
      <div class="bc-col-head bc-col-head--mid">Antwort</div>
      <div class="bc-col-head bc-col-head--right">Frage 9 — Politische Wahrnehmung</div>
    </div>

    <div class="bc-rows"></div>

    <div class="bc-legend">
      <span class="bc-legend-label">Geschlecht</span>
      ${Object.entries(BUTTERFLY_GENDER_COLORS).map(([g, c]) => `
        <span class="bc-legend-item">
          <span class="bc-legend-dot" style="background:${c}"></span>${g}
        </span>`).join('')}
      <span class="bc-legend-sep">·</span>
      <span class="bc-legend-label">Antwort</span>
      ${Object.entries(BUTTERFLY_BAR_COLORS).reverse().map(([s, c]) => `
        <span class="bc-legend-item">
          <span class="bc-legend-dot" style="background:${c}"></span>${BUTTERFLY_ANSWER_LABELS[s]}
        </span>`).join('')}
    </div>

    <p class="bc-note">
      Frage 6: „Ich habe das Gefühl, dass meine Generation wirtschaftlich schlechtere
      Zukunftsperspektiven hat als frühere Generationen." ·
      Frage 9: „Ich habe das Gefühl, dass die Anliegen der jüngeren Generation von
      Politik und Gesellschaft ausreichend wahrgenommen werden."
    </p>
  `;

  /* Gender-Buttons aktivieren */
  root.querySelectorAll('.bc-gbtn').forEach(btn => {
    btn.addEventListener('click', () => toggleGender(btn.dataset.gender));
  });

  /* Ersten Render */
  renderRows();
}

/* Startet nach DOM-Load */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initButterflyChart);
} else {
  initButterflyChart();
}