/* ==========================================================
   HALBKREIS WEHRDIENST-BEREITSCHAFT ANIMATION
   ========================================================== */

const TARGET_PCT = 52.0;   
const ANIM_DURATION = 800; // ms
const EASE = t => 1 - Math.pow(1 - t, 3); // easeOutCubic

// Funktion zum Laden und Parsen der CSV-Datei
async function loadTargetFromCSV() {
  try {
    // Relativer Pfad zur CSV-Datei überprüfen
    const response = await fetch('./Umfrage_GenerationsfragDefense.csv');
    if (!response.ok) throw new Error('CSV-Datei konnte nicht geladen werden');
    
    const text = await response.text();
    const lines = text.split('\n');
    
    // Nach der genauen Frage aus der Tabelle suchen
    const targetLine = lines.find(line => line.includes('Frage 10: 5. Meine grundsätzliche Bereitschaft'));
    
    if (targetLine) {
      // Kommas durch Punkte ersetzen, falls deutsches Zahlenformat vorliegt
      const cleanLine = targetLine.replace(',', '.');
      const matches = cleanLine.match(/\d+(\.\d+)?/);
      
      if (matches) {
        const parsedValue = parseFloat(matches[0]);
        
        // Mathematische Rundung auf die nächste ganze Zahl
        TARGET_PCT = Math.round(parsedValue); 
        
        console.log(`Daten erfolgreich geladen: Originalwert ${parsedValue}%, gerundet auf: ${TARGET_PCT}%`);
      }
    } else {
      console.warn('Zeile mit "Frage 10" nicht in der CSV gefunden. Bitte Text überprüfen.');
    }
  } catch (error) {
    console.warn('Fehler beim Lesen der CSV, nutze Standardwert:', error);
  }
}

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

/* ==========================================================
   KARUSSELL: Dienstbereitschaft-Karte (Grafik / Text)
   ========================================================== */

function initWehrdienstCarousel() {
  const root = document.getElementById('wehrdienstCarousel');
  if (!root) return;

  const track = root.querySelector('.carousel-track');
  const slides = root.querySelectorAll('.carousel-slide');
  const dots = root.querySelectorAll('.carousel-dot');
  const prevBtn = root.querySelector('.carousel-arrow-prev');
  const nextBtn = root.querySelector('.carousel-arrow-next');

  const total = slides.length;
  let index = 0;

  function update() {
    // Pixel-genau statt Prozent, da der Track durch die nicht
    // schrumpfenden Slides breiter als sein Elternelement ist —
    // eine Prozentangabe würde sich auf die (falsche) Track-Breite
    // beziehen statt auf die sichtbare Karussell-Breite.
    const slideWidth = root.clientWidth;
    track.style.transform = `translateX(-${index * slideWidth}px)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  }

  function goTo(i) {
    index = (i + total) % total;
    update();
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goTo(i));
  });

  prevBtn?.addEventListener('click', () => goTo(index - 1));
  nextBtn?.addEventListener('click', () => goTo(index + 1));

  window.addEventListener('resize', update);

  update();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWehrdienstCarousel);
} else {
  initWehrdienstCarousel();
}