/* ==========================================================
   BUTTERFLY CHART — Frage 6 vs. Frage 9
   Daten werden automatisch aus der CSV generiert
   (siehe scripts/generate-chart-data.mjs)
   ========================================================== */

import DATA from "./butterfly-data.json";


const SCORES = [5, 4, 3, 2, 1];

const LABELS = {
  5: 'Stimme voll zu',
  4: 'Stimme eher zu',
  3: 'Neutral',
  2: 'Stimme eher nicht zu',
  1: 'Stimme gar nicht zu'
};

const BAR_CLASS = {
  5: 'left',
  4: 'left-light',
  3: 'neutral',
  2: 'warm',
  1: 'danger'
};

const root = document.querySelector('#butterfly-root');
if (!root) throw new Error('kein #butterfly-root');

let active = 'alle';

/* ----------------------------------------------------------
   ANIMATION HELPERS
   ---------------------------------------------------------- */
const ANIM_DURATION = 800; // ms – innerhalb 700–900ms
const EASE = t => 1 - Math.pow(1 - t, 3); // easeOutCubic – passt zum CSS-Bar-Easing

function animateCount(el, target, duration = ANIM_DURATION) {
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value = target * EASE(progress);

    el.textContent = `${value.toFixed(1)} %`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = `${target.toFixed(1)} %`; // exakter Endwert, keine Rundungsfehler
    }
  }

  requestAnimationFrame(tick);
}

/* ----------------------------------------------------------
   RENDER
   ---------------------------------------------------------- */
function render() {
  const d = DATA[active];

  const rows = SCORES.map(s => {
    const cls  = BAR_CLASS[s];
    const pctL = d.q6[s].toFixed(1);
    const pctR = d.q9[s].toFixed(1);

    return `
      <div class="bf-row">

        <div class="bf-left">
            <span class="bf-value left" data-target="${pctL}">
                0.0 %
            </span>
            
            <div class="bf-bar ${cls}" style="width:0%" data-target-width="${pctL}%"></div>
        </div>

        <div class="bf-label">${LABELS[s]}</div>

        <div class="bf-right">
            <div class="bf-bar ${cls}" style="width:0%" data-target-width="${pctR}%"></div>
            <span class="bf-value right" data-target="${pctR}">
                0.0 %
            </span>

        </div>

      </div>`;
  }).join('');

  root.innerHTML = `
    <div class="butterfly-toolbar">
      ${['alle','Mann','Frau','Divers'].map(g => `
        <button
          class="bf-filter${active === g ? ' active' : ''}"
          data-group="${g}"
        >${g === 'alle' ? 'Alle' : g}</button>
      `).join('')}
    </div>

    <div class="bf-footnote">
        <div class="bf-footnote-questions">
            <span> „Ich habe das Gefühl, dass meine Generation wirtschaftlich schlechtere Zukunftsperspektiven hat als frühere Generationen."</span>
            <span class="bf-footnote-vs">vs</span>
            <span> „Ich habe das Gefühl, dass die Anliegen der jüngeren Generation von Politik und Gesellschaft ausreichend wahrgenommen werden."</span>
        </div>
    </div>

    <div class="butterfly-chart">
      <div class="bf-layout">

        <div class="bf-head">
          <div class="bf-side">Wirtschaftliche Unsicherheit</div>
          <div class="bf-center">Antwort</div>
          <div class="bf-side">Politische Repräsentanz</div>
        </div>

        <div class="bf-body">${rows}</div>

      </div>
    </div>

<div class="bf-footnote-n">
  <span>Alle: n=${DATA.alle.n}</span>
  <span>Männlich: n=${DATA.Mann.n}</span>
  <span>Weiblich: n=${DATA.Frau.n}</span>
  <span>Divers: n=${DATA.Divers.n}</span>
</div>
  `;

  /* Buttons aktivieren */
  root.querySelectorAll('.bf-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      active = btn.dataset.group;
      render();
    });
  });

  /* Balken + Zahlen animieren (synchron, ~800ms) */
  requestAnimationFrame(() => {
    root.querySelectorAll('.bf-bar').forEach(bar => {
      bar.style.width = bar.dataset.targetWidth;
    });
    root.querySelectorAll('.bf-value').forEach(val => {
      animateCount(val, parseFloat(val.dataset.target));
    });
  });
}

render();