/* ==========================================================
   LIKERT CHART 2 — Fragen 16–19 (Staatliche Pflichten)
   Echte Daten aus Umfrage_GenerationsfragDefense.csv
   ========================================================== */

const LIKERT_DATA_2 = {
  alle: [
    { label: "Ich bin der Meinung, dass meine persönliche Freiheit auch in Krisenzeiten Vorrang vor Verpflichtungen gegenüber der Gemeinschaft haben sollte.", values: [15.8, 24.1, 21.9, 28.5, 9.6] },
    { label: "Ich bin der Meinung, dass eine mögliche Dienstpflicht alle Altersgruppen und Geschlechter gleichermaßen betreffen sollte.", values: [25.0, 25.4, 16.2, 19.3, 14.0] },
    { label: "Für mich persönlich ist soziale Sicherheit (z. B. Wohnraum, Grundversorgung) genauso wichtig für die Stabilität des Landes wie die militärische Sicherheit.", values: [30.7, 34.6, 12.7, 14.5, 7.5] },
    { label: "Bereitschaft, staatliche Pflichten zu übernehmen, hängt davon ab, wie stark ich mich vom Staat in wichtigen Lebensbereichen unterstützt fühle.", values: [29.4, 37.7, 14.0, 15.8, 3.1] }
  ],
  Mann: [
    { label: "Ich bin der Meinung, dass meine persönliche Freiheit auch in Krisenzeiten Vorrang vor Verpflichtungen gegenüber der Gemeinschaft haben sollte.", values: [19.0, 19.0, 16.5, 32.2, 13.2] },
    { label: "Ich bin der Meinung, dass eine mögliche Dienstpflicht alle Altersgruppen und Geschlechter gleichermaßen betreffen sollte.", values: [34.7, 24.0, 8.3, 18.2, 14.9] },
    { label: "Für mich persönlich ist soziale Sicherheit (z. B. Wohnraum, Grundversorgung) genauso wichtig für die Stabilität des Landes wie die militärische Sicherheit.", values: [30.6, 39.7, 14.0, 9.1, 6.6] },
    { label: "Bereitschaft, staatliche Pflichten zu übernehmen, hängt davon ab, wie stark ich mich vom Staat in wichtigen Lebensbereichen unterstützt fühle.", values: [27.3, 33.1, 20.7, 14.9, 4.1] }
  ],
  Frau: [
    { label: "Ich bin der Meinung, dass meine persönliche Freiheit auch in Krisenzeiten Vorrang vor Verpflichtungen gegenüber der Gemeinschaft haben sollte.", values: [12.2, 31.1, 28.9, 25.6, 2.2] },
    { label: "Ich bin der Meinung, dass eine mögliche Dienstpflicht alle Altersgruppen und Geschlechter gleichermaßen betreffen sollte.", values: [13.3, 28.9, 24.4, 21.1, 12.2] },
    { label: "Für mich persönlich ist soziale Sicherheit (z. B. Wohnraum, Grundversorgung) genauso wichtig für die Stabilität des Landes wie die militärische Sicherheit.", values: [33.3, 30.0, 10.0, 20.0, 6.7] },
    { label: "Bereitschaft, staatliche Pflichten zu übernehmen, hängt davon ab, wie stark ich mich vom Staat in wichtigen Lebensbereichen unterstützt fühle.", values: [33.3, 45.6, 7.8, 12.2, 1.1] }
  ],
  Divers: [
    { label: "Ich bin der Meinung, dass meine persönliche Freiheit auch in Krisenzeiten Vorrang vor Verpflichtungen gegenüber der Gemeinschaft haben sollte.", values: [9.1, 18.2, 18.2, 27.3, 27.3] },
    { label: "Ich bin der Meinung, dass eine mögliche Dienstpflicht alle Altersgruppen und Geschlechter gleichermaßen betreffen sollte.", values: [27.3, 9.1, 18.2, 27.3, 18.2] },
    { label: "Für mich persönlich ist soziale Sicherheit (z. B. Wohnraum, Grundversorgung) genauso wichtig für die Stabilität des Landes wie die militärische Sicherheit.", values: [18.2, 18.2, 18.2, 27.3, 18.2] },
    { label: "Bereitschaft, staatliche Pflichten zu übernehmen, hängt davon ab, wie stark ich mich vom Staat in wichtigen Lebensbereichen unterstützt fühle.", values: [27.3, 18.2, 0.0, 45.5, 9.1] }
  ]
};

const LIKERT_N_2 = {
  alle: 228,
  Mann: 121,
  Frau: 90,
  Divers: 11
};

const LIKERT_COLORS_2 = ['#2E6F40', '#81B69D', '#D7D3CC', '#E57373', '#A83232'];
const LIKERT_TITLES_2 = ['Stimme voll zu', 'Stimme eher zu', 'Neutral', 'Stimme eher nicht zu', 'Stimme gar nicht zu'];

let likert_active_2 = 'alle';

function initLikertChart2() {
  const root = document.querySelector('#likert-pflichten-root');
  if (!root) return;

  let tip = document.querySelector('.pc-tooltip');
  if (!tip) {
    tip = document.createElement('div');
    tip.className = 'pc-tooltip';
    document.body.appendChild(tip);
  }

  function render() {
    const currentData = LIKERT_DATA_2[likert_active_2];
    const currentN = LIKERT_N_2[likert_active_2];

    const rows = currentData.map(row => {
      const bars = row.values.map((val, idx) => {
        const tipText = `<strong>${LIKERT_TITLES_2[idx]}</strong><br>${val.toFixed(1)} % · n=${currentN}`;
        return `<div class="likert-segment" 
                     style="width: ${val}%; background-color: ${LIKERT_COLORS_2[idx]} !important;" 
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
        ${Object.keys(LIKERT_DATA_2).map(g => `
          <button class="bf-filter${likert_active_2 === g ? ' active' : ''}" data-group="${g}">
            ${g === 'alle' ? 'Alle' : g}
          </button>`).join('')}
      </div>

      <div class="likert-small-multiples">${rows}</div>

      <p class="pc-note">n = ${currentN}</p>
    `;

    root.querySelectorAll('.bf-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        likert_active_2 = btn.dataset.group;
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
  document.addEventListener('DOMContentLoaded', initLikertChart2);
} else {
  initLikertChart2();
}