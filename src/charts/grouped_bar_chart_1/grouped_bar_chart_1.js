/* ==========================================================
   LIKERT CHART — Fairness-Wahrnehmung (Gesamte Tabelle)
   ========================================================== */

const LIKERT_DATA = {
  alle: {
    n: 228,
    questions: [
      { label: "Ich fühle mich über Themen wie Sicherheit, Verteidigung und die Pläne zur Wehrpflicht in Deutschland ausreichend informiert.", values: [9.6, 27.2, 23.7, 30.3, 9.2] },
      { label: "Ich habe das Gefühl, dass die Interessen und Stimmen junger Menschen von den politischen Entscheidungsträgern in Deutschland ausreichend berücksichtigt werden.", values: [0.4, 4.4, 11.4, 50.0, 33.8] },
      { label: "Ich habe das Gefühl, dass Politik in Deutschland an den tatsächlichen Lebensumständen der Menschen ausgerichtet ist.", values: [0.9, 4.4, 15.4, 45.6, 33.8] },
      { label: "Ich vertraue darauf, dass staatliche Institutionen (z. B. die Bundesregierung oder Behörden) im besten Interesse der gesamten Bevölkerung handeln.", values: [3.1, 15.8, 18.4, 33.8, 28.9] }
    ]
  },
  Mann: {
    n: 121,
    questions: [
      { label: "Ich fühle mich über Themen wie Sicherheit, Verteidigung und die Pläne zur Wehrpflicht in Deutschland ausreichend informiert.", values: [11.6, 30.6, 26.4, 24.8, 6.6] },
      { label: "Ich habe das Gefühl, dass die Interessen und Stimmen junger Menschen von den politischen Entscheidungsträgern in Deutschland ausreichend berücksichtigt werden.", values: [0.8, 5.8, 17.4, 43.8, 32.2] },
      { label: "Ich habe das Gefühl, dass Politik in Deutschland an den tatsächlichen Lebensumständen der Menschen ausgerichtet ist.", values: [1.7, 5.0, 20.7, 41.3, 31.4] },
      { label: "Ich vertraue darauf, dass staatliche Institutionen (z. B. die Bundesregierung oder Behörden) im besten Interesse der gesamten Bevölkerung handeln.", values: [2.5, 20.7, 23.1, 28.9, 24.8] }
    ]
  },
  Frau: {
    n: 90,
    questions: [
      { label: "Ich fühle mich über Themen wie Sicherheit, Verteidigung und die Pläne zur Wehrpflicht in Deutschland ausreichend informiert.", values: [5.6, 22.2, 21.1, 37.8, 13.3] },
      { label: "Ich habe das Gefühl, dass die Interessen und Stimmen junger Menschen von den politischen Entscheidungsträgern in Deutschland ausreichend berücksichtigt werden.", values: [0.0, 1.1, 4.4, 61.1, 33.3] },
      { label: "Ich habe das Gefühl, dass Politik in Deutschland an den tatsächlichen Lebensumständen der Menschen ausgerichtet ist.", values: [0.0, 3.3, 10.0, 52.2, 34.4] },
      { label: "Ich vertraue darauf, dass staatliche Institutionen (z. B. die Bundesregierung oder Behörden) im besten Interesse der gesamten Bevölkerung handeln.", values: [2.2, 12.2, 14.4, 40.0, 31.1] }
    ]
  },
  Divers: {
    n: 11,
    questions: [
      { label: "Ich fühle mich über Themen wie Sicherheit, Verteidigung und die Pläne zur Wehrpflicht in Deutschland ausreichend informiert.", values: [18.2, 27.3, 9.1, 36.4, 9.1] },
      { label: "Ich habe das Gefühl, dass die Interessen und Stimmen junger Menschen von den politischen Entscheidungsträgern in Deutschland ausreichend berücksichtigt werden.", values: [0.0, 18.2, 0.0, 36.4, 45.5] },
      { label: "Ich habe das Gefühl, dass Politik in Deutschland an den tatsächlichen Lebensumständen der Menschen ausgerichtet ist.", values: [0.0, 9.1, 9.1, 45.5, 36.4] },
      { label: "Ich vertraue darauf, dass staatliche Institutionen (z. B. die Bundesregierung oder Behörden) im besten Interesse der gesamten Bevölkerung handeln.", values: [9.1, 0.0, 9.1, 36.4, 45.5] }
    ]
  }
};

const LIKERT_COLORS = ['#2E6F40', '#81B69D', '#D7D3CC', '#D8B69C', '#B96A52'];
const LIKERT_TITLES = ['Stimme voll zu', 'Stimme eher zu', 'Neutral', 'Stimme eher nicht zu', 'Stimme gar nicht zu'];

let likert_active = 'alle';

function initLikertChart() {
  const root = document.querySelector('#likert-root');
  if (!root) return;

  const tip = document.createElement('div');
  tip.className = 'pc-tooltip';
  document.body.appendChild(tip);
  
  document.addEventListener('mousemove', e => {
    tip.style.left = (e.clientX + 14) + 'px';
    tip.style.top  = (e.clientY - 10) + 'px';
  });

  function render() {
    const currentGroup = LIKERT_DATA[likert_active];
    const currentN = currentGroup.n;
    const currentQuestions = currentGroup.questions;

    const rows = currentQuestions.map(row => {
      const bars = row.values.map((val, idx) => {
        const segmentN = Math.round((val * currentN) / 100);
        const tipText = `<strong>${LIKERT_TITLES[idx]}</strong><br>${val.toFixed(1)} % · n = ${segmentN}`;
        
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

    root.querySelectorAll('.bf-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        likert_active = btn.dataset.group;
        render();
      });
    });

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