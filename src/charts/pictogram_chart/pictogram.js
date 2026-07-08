/* ==========================================================
   PICTOGRAM CHART — Frage 21
   Wenn eine allgemeine Dienstpflicht eingeführt würde …
   ========================================================== */

import DATA from "./pictogram-data.json";

const PC_COLS = [
  { key: 'rettung',      label: 'Katastrophenschutz\n/ THW',        color: 'var(--accent)' },
  { key: 'militar',      label: 'Bundeswehr',                        color: 'var(--accent)' },
  { key: 'okologie',     label: 'Klimaschutz /\nUmwelt',             color: 'var(--accent)' },
  { key: 'sozial',       label: 'Pflege / sozialer\nDienst',         color: 'var(--accent)' },
  { key: 'befreiung',    label: 'Befreiung\nversuchen',              color: '#D8B69C'       },
  { key: 'verweigerung', label: 'Dienst\nverweigern',                color: '#B96A52'       },
];

const PC_DOTS = 10;

let pc_active = 'alle';
let pcCarouselIndex = 0;

const PC_INSIGHTS = [
  {
    lead: 'Im Falle der Einführung einer gesetzlichen Dienstpflicht befürwortet die Mehrheit der studentischen Jugend eine Tätigkeit im zivilen Sektor. Der Dienst an der Waffe wird von einer Minderheit gewählt.',
    stats: [
      {
        label: 'Präferenz für den Katastrophenschutz',
        text: 'Rund ein Viertel der Befragten würde sich im zivilen Rettungsdienst, bei der Feuerwehr oder dem Technischen Hilfswerk engagieren. Dies stellt die am häufigsten gewählte Option dar.'
      },
    ]
  },
  {
    lead: 'Im Falle der Einführung einer gesetzlichen Dienstpflicht befürwortet die Mehrheit der studentischen Jugend eine Tätigkeit im zivilen Sektor. Der Dienst an der Waffe wird von einer Minderheit gewählt.',
    stats: [
      {
        label: 'Weitere zivile Optionen',
        text: 'Jeweils knapp ein Fünftel der Teilnehmenden präferiert einen Einsatz im ökologischen Bereich oder in sozialen Einrichtungen. Insgesamt entfallen damit fast zwei Drittel aller Nennungen auf den zivilen Sektor.'
      },
    ]
  },
  {
    lead: 'Im Falle der Einführung einer gesetzlichen Dienstpflicht befürwortet die Mehrheit der studentischen Jugend eine Tätigkeit im zivilen Sektor. Der Dienst an der Waffe wird von einer Minderheit gewählt.',
    stats: [
      {
        label: 'Militärdienst und Dienstverweigerung',
        text: 'Ein Dienst in der Bundeswehr wird von rund einem Fünftel der Befragten gewählt. Der verbleibende Teil der Befragten, etwa ein Sechstel, würde eine offizielle Befreiung anstreben oder den Dienst verweigern.'
      }
    ]
  },
];

function initPictogramChart() {
  const root = document.querySelector('#pictogram-root');
  if (!root) return;

  /* Tooltip */
  const tip = document.createElement('div');
  tip.className = 'pc-tooltip';
  document.body.appendChild(tip);
  document.addEventListener('mousemove', e => {
    tip.style.left = (e.clientX + 14) + 'px';
    tip.style.top  = (e.clientY - 10) + 'px';
  });

  function render() {
    const d = DATA[pc_active];

    const cols = PC_COLS.map(col => {
      const pct    = d[col.key];
      const filled = Math.round(pct / 100 * PC_DOTS);
      const dots   = Array.from({ length: PC_DOTS }, (_, i) => {
        const isActive = i >= (PC_DOTS - filled);
        const tipText  = `<strong>${col.label.replace('\n', ' ')}</strong><br>${pct.toFixed(1)} % · n=${d.n}`;
        return `<div class="pc-dot${isActive ? ' pc-dot--active' : ''}"
          style="${isActive ? `background:${col.color}` : ''}"
          data-tip="${tipText.replace(/"/g, '&quot;')}"></div>`;
      }).join('');

      const labelLines = col.label.split('\n').map(l => `<span>${l}</span>`).join('');
      const pctColor   = col.color === 'var(--accent)' ? 'var(--text)' : col.color;

      return `
        <div class="pc-col">
          <div class="pc-dots">${dots}</div>
          <div class="pc-pct" style="color:${pctColor}">${pct.toFixed(0)} %</div>
          <div class="pc-label">${labelLines}</div>
        </div>`;
    }).join('');

    root.innerHTML = `
      <div class="pc-toolbar">
        ${Object.keys(DATA).map(g => `
          <button class="bf-filter${pc_active === g ? ' active' : ''}" data-group="${g}">
            ${g === 'alle' ? 'Alle' : g}
          </button>`).join('')}
      </div>

      <div class="pc-grid">${cols}</div>

      <p class="pc-note">n = ${d.n} · Bevorzugter Einsatzbereich bei Einführung einer allgemeinen Dienstpflicht</p>

      <div class="bf-insights">
        <div class="bf-carousel">
          <div class="bf-carousel-track" style="width:${PC_INSIGHTS.length * 100}%; transform:translateX(-${pcCarouselIndex * (100 / PC_INSIGHTS.length)}%)">
            ${PC_INSIGHTS.map(card => `
              <article class="bf-card" style="width:${100 / PC_INSIGHTS.length}%">
                <p class="bf-card-lead">${card.lead}</p>
                <ul class="bf-card-stats">
                  ${card.stats.map(stat => `
                    <li>
                      <span class="bf-card-stat-label">${stat.label}</span>
                      <span class="bf-card-stat-text">${stat.text}</span>
                    </li>
                  `).join('')}
                </ul>
              </article>
            `).join('')}
          </div>
        </div>

        <div class="bf-carousel-controls">
          <button class="bf-carousel-arrow" data-dir="-1" aria-label="Vorherige Karte">‹</button>
          <div class="bf-carousel-dots">
            ${PC_INSIGHTS.map((_, i) => `
              <button
                class="bf-carousel-dot${i === pcCarouselIndex ? ' active' : ''}"
                data-index="${i}"
                aria-label="Karte ${i + 1} anzeigen"
              ></button>
            `).join('')}
          </div>
          <button class="bf-carousel-arrow" data-dir="1" aria-label="Nächste Karte">›</button>
        </div>
      </div>
    `;

    /* Button-Events */
    root.querySelectorAll('.bf-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        pc_active = btn.dataset.group;
        pcCarouselIndex = 0; // Karussell bei Filterwechsel zurücksetzen
        render();
      });
    });

    /* Karussell-Events */
    const pcTrack = root.querySelector('.bf-carousel-track');

    function pcGoToCard(index) {
      pcCarouselIndex = (index + PC_INSIGHTS.length) % PC_INSIGHTS.length;
      pcTrack.style.transform = `translateX(-${pcCarouselIndex * (100 / PC_INSIGHTS.length)}%)`;

      root.querySelectorAll('.bf-carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === pcCarouselIndex);
      });
    }

    root.querySelectorAll('.bf-carousel-arrow').forEach(btn => {
      btn.addEventListener('click', () => {
        pcGoToCard(pcCarouselIndex + parseInt(btn.dataset.dir, 10));
      });
    });

    root.querySelectorAll('.bf-carousel-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        pcGoToCard(parseInt(dot.dataset.index, 10));
      });
    });

    /* Tooltip-Events */
    root.querySelectorAll('.pc-dot').forEach(dot => {
      dot.addEventListener('mouseenter', () => { tip.innerHTML = dot.dataset.tip; tip.style.opacity = '1'; });
      dot.addEventListener('mouseleave', () => { tip.style.opacity = '0'; });
    });

    /* Animation */
    requestAnimationFrame(() => {
      root.querySelectorAll('.pc-dot--active').forEach((dot, i) => {
        dot.style.opacity = '0';
        dot.style.transform = 'scale(0)';
        setTimeout(() => {
          dot.style.transition = 'opacity .3s ease, transform .3s ease';
          dot.style.opacity = '1';
          dot.style.transform = 'scale(1)';
        }, i * 25);
      });
    });
  }

  render();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPictogramChart);
} else {
  initPictogramChart();
}