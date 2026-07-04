/* ==========================================================
   BUTTERFLY CHART — Frage 6 vs. Frage 9
   Echte Umfragedaten (n=248)
   ========================================================== */

const DATA = {
  alle: {
    q6: { 5: 31.5, 4: 46.8, 3: 8.5,  2: 9.7,  1: 3.6 },
    q9: { 5: 2.0,  4: 4.2,  3: 15.7, 2: 45.2, 1: 32.7 },
    n: 248
  },
  Mann: {
    q6: { 5: 34.1, 4: 45.9, 3: 6.7,  2: 8.9,  1: 4.4 },
    q9: { 5: 2.2,  4: 4.4,  3: 17.8, 2: 41.5, 1: 34.1 },
    n: 135
  },
  Frau: {
    q6: { 5: 29.4, 4: 48.0, 3: 10.8, 2: 10.8, 1: 1.0 },
    q9: { 5: 2.0,  4: 3.9,  3: 11.8, 2: 52.9, 1: 29.4 },
    n: 102
  },
  Divers: {
    q6: { 5: 45.5, 4: 45.5, 3: 0.0,  2: 0.0,  1: 9.1 },
    q9: { 5: 0.0,  4: 9.1,  3: 0.0,  2: 45.5, 1: 45.5 },
    n: 11
  }
};

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
  4: 'left',
  3: 'neutral',
  2: 'warm',
  1: 'danger'
};

const root = document.querySelector('#butterfly-root');
if (!root) throw new Error('kein #butterfly-root');

let active = 'alle';

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
            <span class="bf-value left">
                ${pctL} %
            </span>
            
            <div class="bf-bar ${cls}" style="width:${pctL}%"></div>
        </div>

        <div class="bf-label">${LABELS[s]}</div>

        <div class="bf-right">
            <div class="bf-bar ${cls}" style="width:${pctR}%"></div>
            <span class="bf-value right">
                ${pctR} %
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

    <div class="butterfly-chart">
      <div class="bf-layout">

        <div class="bf-head">
          <div class="bf-side">Wirtschaftliche Zukunft</div>
          <div class="bf-center">Antwort</div>
          <div class="bf-side">Politische Wahrnehmung</div>
        </div>

        <div class="bf-body">${rows}</div>

      </div>
    </div>

    <div class="bf-footnote">
      <div class="bf-footnote-questions">
        <span><strong>Links:</strong> „Ich habe das Gefühl, dass meine Generation wirtschaftlich schlechtere Zukunftsperspektiven hat als frühere Generationen."</span>
        <span class="bf-footnote-vs">vs</span>
        <span><strong>Rechts:</strong> „Ich habe das Gefühl, dass die Anliegen der jüngeren Generation von Politik und Gesellschaft ausreichend wahrgenommen werden."</span>
      </div>
      <div class="bf-footnote-n">
        <span>Alle: n=248</span>
        <span>Männlich: n=135</span>
        <span>Weiblich: n=102</span>
        <span>Divers: n=11</span>
      </div>
    </div>
  `;

  /* Buttons aktivieren */
  root.querySelectorAll('.bf-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      active = btn.dataset.group;
      render();
    });
  });

  /* Balken animieren */
  requestAnimationFrame(() => {
    root.querySelectorAll('.bf-bar').forEach(bar => {
      const target = bar.style.width;
      bar.style.width = '0%';
      requestAnimationFrame(() => { bar.style.width = target; });
    });
  });
}

render();