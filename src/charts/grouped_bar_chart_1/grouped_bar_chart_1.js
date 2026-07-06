/* ==========================================================
   LIKERT CHART — Fairness-Wahrnehmung
   ========================================================== */

const LIKERT_DATA = {
  alle: [
    { label: "Ich fühle mich über Themen wie Sicherheit, Verteidigung und die Pläne zur Wehrpflicht in Deutschland ausreichend informiert.", values: [10.0, 26.0, 23.6, 29.2, 11.2] },
    { label: "Ich habe das Gefühl, dass die Interessen und Stimmen junger Menschen von den politischen Entscheidungsträgern in Deutschland ausreichend berücksichtigt werden.", values: [0.8, 4.0, 11.2, 50.0, 34.0] },
    { label: "Ich habe das Gefühl, dass Politik in Deutschland an den tatsächlichen Lebensumständen der Menschen ausgerichtet ist.", values: [0.8, 4.4, 16.0, 44.0, 34.8] },
    { label: "Ich vertraue darauf, dass staatliche Institutionen (z. B. die Bundesregierung oder Behörden) im besten Interesse der gesamten Bevölkerung handeln.", values: [3.2, 15.6, 18.4, 33.6, 29.2] }
  ],
  Mann: [
    { label: "Ich fühle mich über Themen wie Sicherheit, Verteidigung und die Pläne zur Wehrpflicht in Deutschland ausreichend informiert.", values: [12.5, 24.5, 20.0, 31.0, 12.0] },
    { label: "Ich habe das Gefühl, dass die Interessen und Stimmen junger Menschen von den politischen Entscheidungsträgern in Deutschland ausreichend berücksichtigt werden.", values: [1.0, 5.0, 12.0, 48.0, 34.0] },
    { label: "Ich habe das Gefühl, dass Politik in Deutschland an den tatsächlichen Lebensumständen der Menschen ausgerichtet ist.", values: [0.5, 4.5, 15.0, 46.0, 34.0] },
    { label: "Ich vertraue darauf, dass staatliche Institutionen (z. B. die Bundesregierung oder Behörden) im besten Interesse der gesamten Bevölkerung handeln.", values: [4.0, 16.0, 17.0, 35.0, 28.0] }
  ],
  Frau: [
    { label: "Ich fühle mich über Themen wie Sicherheit, Verteidigung und die Pläne zur Wehrpflicht in Deutschland ausreichend informiert.", values: [8.0, 27.0, 26.0, 28.0, 11.0] },
    { label: "Ich habe das Gefühl, dass die Interessen und Stimmen junger Menschen von den politischen Entscheidungsträgern in Deutschland ausreichend berücksichtigt werden.", values: [0.6, 3.2, 10.5, 51.5, 34.2] },
    { label: "Ich habe das Gefühl, dass Politik in Deutschland an den tatsächlichen Lebensumständen der Menschen ausgerichtet ist.", values: [1.0, 4.2, 16.8, 42.4, 35.6] },
    { label: "Ich vertraue darauf, dass staatliche Institutionen (z. B. die Bundesregierung oder Behörden) im besten Interesse der gesamten Bevölkerung handeln.", values: [2.5, 15.2, 19.5, 32.5, 30.3] }
  ],
  Divers: [
    { label: "Ich fühle mich über Themen wie Sicherheit, Verteidigung und die Pläne zur Wehrpflicht in Deutschland ausreichend informiert.", values: [10.0, 26.0, 23.6, 29.2, 11.2] },
    { label: "Ich habe das Gefühl, dass die Interessen und Stimmen junger Menschen von den politischen Entscheidungsträgern in Deutschland ausreichend berücksichtigt werden.", values: [0.8, 4.0, 11.2, 50.0, 34.0] },
    { label: "Ich habe das Gefühl, dass Politik in Deutschland an den tatsächlichen Lebensumständen der Menschen ausgerichtet ist.", values: [0.8, 4.4, 16.0, 44.0, 34.8] },
    { label: "Ich vertraue darauf, dass staatliche Institutionen (z. B. die Bundesregierung oder Behörden) im besten Interesse der gesamten Bevölkerung handeln.", values: [3.2, 15.6, 18.4, 33.6, 29.2] }
  ]
};

/* Explicit mapping for dynamic sample size metrics per filtered cohort view */
const LIKERT_N = {
  alle: 240,
  Mann: 129,
  Frau: 94,
  Divers: 11
};

const LIKERT_COLORS = ['#2E6F40', '#81B69D', '#D7D3CC', '#D8B69C', '#B96A52'];
const LIKERT_TITLES = ['Stimme voll zu', 'Stimme eher zu', 'Neutral', 'Stimme eher nicht zu', 'Stimme gar nicht zu'];

let likert_active = 'alle';

function initLikertChart() {
  const root = document.querySelector('#likert-root');
  if (!root) return;

  /* Tooltip initialization replicating your friend's custom tooltip architecture */
  const tip = document.createElement('div');
  tip.className = 'pc-tooltip';
  document.body.appendChild(tip);
  
  document.addEventListener('mousemove', e => {
    tip.style.left = (e.clientX + 14) + 'px';
    tip.style.top  = (e.clientY - 10) + 'px';
  });

  function render() {
    const currentData = LIKERT_DATA[likert_active];
    const currentN = LIKERT_N[likert_active];

    /* Generate rows dynamically using data-tip and mapping current survey volume metric */
    const rows = currentData.map(row => {
      const bars = row.values.map((val, idx) => {
        const tipText = `<strong>${LIKERT_TITLES[idx]}</strong><br>${val.toFixed(1)} % · n=${currentN}`;
        return `<div class="likert-segment" 
                     style="width: ${val}%; background-color: ${LIKERT_COLORS[idx]} !important;" 
                     data-tip="${tipText.replace(/"/g, '&quot;')}"></div>`;
      }).join('');

      return `
        <div class="likert-row">
          <span>${row.label}</span>
          <div class="likert-bar">${bars}</div>
        </div>`;
    }).join('');

    /* Inject layout using the peer shared toolbar class name for identical button styling */
    root.innerHTML = `
      <div class="pc-toolbar">
        ${Object.keys(LIKERT_DATA).map(g => `
          <button class="bf-filter${likert_active === g ? ' active' : ''}" data-group="${g}">
            ${g === 'alle' ? 'Alle' : g}
          </button>`).join('')}
      </div>

      <div class="likert-small-multiples">${rows}</div>

      <p class="pc-note">n = ${currentN}</p>
    `;

    /* Bind button click tracking hooks strictly within this component's root context */
    root.querySelectorAll('.bf-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        likert_active = btn.dataset.group;
        render();
      });
    });

    /* Tooltip event monitors mapped identically to peer graphic interactions */
    root.querySelectorAll('.likert-segment').forEach(segment => {
      segment.addEventListener('mouseenter', () => { 
        tip.innerHTML = segment.dataset.tip; 
        tip.style.opacity = '1'; 
      });
      segment.addEventListener('mouseleave', () => { 
        tip.style.opacity = '0'; 
      });
    });
  }

  render();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLikertChart);
} else {
  initLikertChart();
}