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
    `;

    /* Button-Events */
    root.querySelectorAll('.bf-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        pc_active = btn.dataset.group;
        render();
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