/* ==========================================================
   HALBKREIS WEHRDIENST-BEREITSCHAFT ANIMATION
   ========================================================== */

const TARGET_PCT = 52.0;   
const ANIM_DURATION = 800; // ms
const EASE = t => 1 - Math.pow(1 - t, 3); // easeOutCubic

function initSemiCircleAnimation() {
  const circle = document.getElementById('semiCircle');
  const valueDisplay = document.getElementById('semiValue');
  const chartCard = document.querySelector('.chart-card #semiCircle')?.closest('.chart-card');

  if (!circle || !valueDisplay || !chartCard) return;

  // Startzustand auf 0 setzen (Hier stand fälschlicherweise currentValue)
  circle.style.setProperty('--pct', '0');
  valueDisplay.textContent = '0 %';

  const independentObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounting();
        independentObserver.unobserve(entry.target); 
      }
    });
  }, { threshold: 0.15 });

  independentObserver.observe(chartCard);

  function startCounting() {
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / ANIM_DURATION, 1);
      const easeProgress = EASE(progress);
      const currentValue = TARGET_PCT * easeProgress;

      // CSS-Variable für die Grafik füttern (bleibt präzise mit Dezimalstellen)
      circle.style.setProperty('--pct', currentValue.toFixed(2));
      
      // Textanzeige komplett ohne Nachkommastellen (.toFixed(0))
      valueDisplay.textContent = `${currentValue.toFixed(0)} %`;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        // Finale Werte nach Ablauf der Animation
        valueDisplay.textContent = `${TARGET_PCT.toFixed(0)} %`;
        circle.style.setProperty('--pct', TARGET_PCT.toString());
      }
    } // <-- Diese Klammer für die tick-Funktion hat gefehlt!

    requestAnimationFrame(tick);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSemiCircleAnimation);
} else {
  initSemiCircleAnimation();
}