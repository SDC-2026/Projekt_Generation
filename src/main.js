import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Chart from "chart.js/auto";
import scatterSurveyData from "./charts/scatterchart/wehrpflicht-scatter-data.json";
import "./charts/scatterchart/scatterplot.css";
import "./charts/pictogram_chart/pictogram.js";
import "./charts/pictogram_chart/pictogram.css";
import "./charts/half-circle/half-circle.js";

gsap.registerPlugin(ScrollTrigger);

// ─── Progress Bar ───
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const pct = (window.scrollY / total) * 100;
  progressBar.style.width = pct + '%';
});

// ─── Nav scroll state ───
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 80);
});

// ─── Nav Dot active state ───
const sections = document.querySelectorAll('.section');
const navDots = document.querySelectorAll('.nav-dot');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const idx = [...sections].indexOf(entry.target);
      navDots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

navDots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    sections[i]?.scrollIntoView({ behavior: 'smooth' });
  });
});

// ─── Reveal on scroll ───
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ─── Datastory items ───
const dsItems = document.querySelectorAll('.datastory-item');
const dsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      dsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

dsItems.forEach(el => dsObserver.observe(el));

// ─── Animate bars when visible ───
const bars = document.querySelectorAll('.bar');
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // bars animate via CSS var(--h), already set
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
bars.forEach(b => barObserver.observe(b));

// ─── Hero: stagger reveal on load ───
window.addEventListener('DOMContentLoaded', () => {
  const heroEls = document.querySelectorAll('.hero-section .reveal');
  heroEls.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 200 + i * 180);
  });

  // Gen tags stagger
  const tags = document.querySelectorAll('.gen-tag');
  tags.forEach((t, i) => {
    t.style.transitionDelay = `${i * 80}ms`;
    t.style.opacity = '0';
    t.style.transform = 'translateX(20px)';
    t.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    setTimeout(() => {
      t.style.opacity = t.classList.contains('active') ? '1' : '0.5';
      t.style.transform = 'translateX(0)';
    }, 800 + i * 80);
  });
});


// ─── Hero Parallax ───
const hero = document.querySelector(".hero-section");
const heroBg = document.querySelector(".hero-background-svg");

function updateHeroParallax() {
  if (!hero || !heroBg) return;

  const scroll = window.scrollY;
  const heroHeight = hero.offsetHeight;
  const progress = Math.min(scroll / heroHeight, 1);

  heroBg.style.transform = `translateY(calc(-50% + ${scroll * 0.15}px)) scale(${1 - progress * 0.05})`;
  heroBg.style.opacity = 0.08 * (1 - progress);
}

updateHeroParallax();
window.addEventListener("scroll", updateHeroParallax);

/* ==========================================================
   LETTER REVEAL (These)
   ========================================================== */

const hypothesis = document.getElementById("hypothesisText");

if (hypothesis) {

    const text = hypothesis.textContent.trim();

    hypothesis.innerHTML = "";

    [...text].forEach(letter => {

        const span = document.createElement("span");
        span.textContent = letter;
        hypothesis.appendChild(span);

    });

    const letters = hypothesis.querySelectorAll("span");

    function updateLetters() {

        const rect = hypothesis.getBoundingClientRect();

        const start = window.innerHeight * 0.85;
        const end = window.innerHeight * 0.25;

        const progress = (start - rect.top) / (start - end);

        const clamped = Math.max(0, Math.min(progress, 1));

        const visibleLetters = Math.floor(clamped * letters.length);

        letters.forEach((letter, index) => {

            if (index < visibleLetters) {
                letter.classList.add("active");
            } else {
                letter.classList.remove("active");
            }

        });

    }

    window.addEventListener("scroll", updateLetters, { passive: true });

    updateLetters();

}

// SECTION 04 — METHODE

const methodContent = [
  {
    number: "01",
    title: "Datenerhebung",
    description:
      "Die Untersuchung basiert auf einer standardisierten Online-Befragung von Studierenden der Generation Z.",
    list: [
      "Standardisierte Online-Umfrage",
      "Durchführung über Lamapoll",
      "Anonyme Teilnahme",
      "Grundlage der Analyse"
    ]
  },
  {
    number: "02",
    title: "Fragebogen",
    description:
      "Der Fragebogen erfasst Einstellungen zum Gesellschaftsvertrag sowie zur Bereitschaft, staatliche Verantwortung zu übernehmen.",
    list: [
      "Vertrauen",
      "Fairness",
      "soziale Sicherheit",
      "Dienstbereitschaft"
    ]
  },
  {
    number: "03",
    title: "Stichprobe",
    description:
      "Befragt wurden Studierende der Generation Z der Technischen Hochschule Nürnberg.",
    list: [
      "Generation Z",
      "Studierende",
      "Technische Hochschule Nürnberg",
      "Quantitative Auswertung"
    ]
  }
];

const steps = document.querySelectorAll(".process-step");
const lines = document.querySelectorAll(".process-line");

const number = document.getElementById("methodNumber");
const title = document.getElementById("methodTitle");
const description = document.getElementById("methodDescription");
const list = document.getElementById("methodList");

function activateStep(index) {

  // Aktiven Schritt setzen
  steps.forEach(step => step.classList.remove("active"));
  steps[index]?.classList.add("active");

  // Linien aktivieren
  lines.forEach(line => line.classList.remove("active"));

  for (let i = 0; i < index; i++) {
    lines[i]?.classList.add("active");
  }

  // Karte aktualisieren
  const data = methodContent[index];

  number.textContent = data.number;
  title.textContent = data.title;
  description.textContent = data.description;

  list.innerHTML = "";

  data.list.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });

}

// Anfangszustand
activateStep(0);

// ─── SCATTERPLOT: Wehrdienst-Bereitschaft & Gesellschaftsvertrag ───
// Eigene Section (05 — Zusammenhänge), direkt unter Abschnitt 04 (Methode).
// Datenquelle: src/charts/scatterchart/wehrpflicht-scatter-data.json (aus der Umfrage berechnet:
// x = Frage 10, y = Mittelwert aus Frage 15, 17, 18, 19; Frage 16 wurde bewusst ausgeschlossen).

const GENDER_COLORS = {
  w: "#7CBA97",
  m: "#E0954B",
  d: "#8C7AE6",
  k: "#B3AFA8"
};
const GENDER_LABELS = {
  w: "Frauen",
  m: "Männer",
  d: "Divers",
  k: "Keine Angabe"
};
const LIKERT_LABELS = ["", "sehr gering", "eher gering", "neutral", "eher hoch", "sehr hoch"];

function jitterSeed(seed) {
  const v = Math.sin(seed * 99991) * 10000;
  return (v - Math.floor(v)) - 0.5;
}

const scatterPoints = scatterSurveyData.map((p, i) => ({
  x: p.x,
  y: p.y,
  g: p.g,
  jx: p.x + jitterSeed(i) * 0.5
}));

const scatterCanvas = document.getElementById("scatterCanvas");
let scatterChart = null;
let scatterGender = "all";

if (scatterCanvas) {
  scatterChart = new Chart(scatterCanvas.getContext("2d"), {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Befragte",
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 1,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointHoverBorderWidth: 2
        },
        {
          label: "Trend",
          type: "line",
          data: [],
          borderColor: "#1A1A1A",
          borderWidth: 1.5,
          borderDash: [5, 4],
          pointRadius: 0,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 250 },
      layout: { padding: { top: 8, right: 8 } },
      scales: {
        x: {
          min: 0.5,
          max: 5.5,
          afterBuildTicks: (axis) => {
            axis.ticks = [1, 2, 3, 4, 5].map((v) => ({ value: v }));
          },
          ticks: {
            color: "#6B6B68",
            font: { size: 11 },
            callback: (v) => {
              const rounded = Math.round(v);
              return LIKERT_LABELS[rounded] ? `${rounded} – ${LIKERT_LABELS[rounded]}` : "";
            }
          },
          grid: { color: "#EDEBE5" },
          title: { display: true, text: "Bereitschaft zum Wehrdienst", color: "#6B6B68", font: { size: 12 } }
        },
        y: {
          min: 0.5,
          max: 5.5,
          afterBuildTicks: (axis) => {
            axis.ticks = [1, 2, 3, 4, 5].map((v) => ({ value: v }));
          },
          ticks: {
            color: "#6B6B68",
            font: { size: 11 },
            callback: (v) => {
              const rounded = Math.round(v);
              return LIKERT_LABELS[rounded] ? `${rounded} – ${LIKERT_LABELS[rounded]}` : "";
            }
          },
          grid: { color: "#EDEBE5" },
          title: { display: true, text: "Gesellschaftsvertrags-Score", color: "#6B6B68", font: { size: 12 } }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#1A1A1A",
          titleColor: "#FFFFFF",
          bodyColor: "#FFFFFF",
          displayColors: false,
          callbacks: {
            label: (c) => {
              if (c.datasetIndex === 1) return null;
              const p = scatterVisiblePoints[c.dataIndex];
              return [`Vertragsscore: ${c.parsed.y.toFixed(2)}`, GENDER_LABELS[p.g]];
            }
          }
        }
      }
    }
  });
}

let scatterVisiblePoints = [];

function renderScatter() {
  if (!scatterChart) return;

  scatterVisiblePoints = scatterPoints.filter(p => scatterGender === "all" || p.g === scatterGender);

  scatterChart.data.datasets[0].data = scatterVisiblePoints.map(p => ({ x: p.jx, y: p.y }));
  scatterChart.data.datasets[0].backgroundColor = scatterVisiblePoints.map(p => `${GENDER_COLORS[p.g]}88`);
  scatterChart.data.datasets[0].borderColor = scatterVisiblePoints.map(p => GENDER_COLORS[p.g]);

  const corrEl = document.getElementById("scatterCorr");
  const countEl = document.getElementById("scatterCount");

  if (scatterVisiblePoints.length > 2) {
    const n = scatterVisiblePoints.length;
    const mx = scatterVisiblePoints.reduce((a, p) => a + p.x, 0) / n;
    const my = scatterVisiblePoints.reduce((a, p) => a + p.y, 0) / n;
    let num = 0, dx = 0, dy = 0;
    scatterVisiblePoints.forEach(p => {
      num += (p.x - mx) * (p.y - my);
      dx += (p.x - mx) ** 2;
      dy += (p.y - my) ** 2;
    });
    const r = num / Math.sqrt(dx * dy);
    const slope = num / dx;
    const intercept = my - slope * mx;
    scatterChart.data.datasets[1].data = [
      { x: 0.6, y: slope * 0.6 + intercept },
      { x: 5.4, y: slope * 5.4 + intercept }
    ];
    if (corrEl) corrEl.textContent = isNaN(r) ? "–" : r.toFixed(2);
  } else {
    scatterChart.data.datasets[1].data = [];
    if (corrEl) corrEl.textContent = "–";
  }

  if (countEl) countEl.textContent = scatterVisiblePoints.length;
  scatterChart.update();

  document.querySelectorAll(".scatter-legend-item").forEach(item => {
    const g = item.dataset.g;
    item.classList.toggle("dimmed", scatterGender !== "all" && scatterGender !== g);
  });
}

document.querySelectorAll(".scatter-filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".scatter-filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    scatterGender = btn.dataset.g;
    renderScatter();
  });
});

renderScatter();

ScrollTrigger.create({

  trigger: ".method-section",

  start: "top top",

  end: "+=600",

  pin: true,

  scrub: true,

  markers: false,

  onUpdate: (self) => {

    const progress = self.progress;

    if (progress < 0.33) {

      activateStep(0);

    } else if (progress < 0.66) {

      activateStep(1);

    } else {

      activateStep(2);

    }

  }

});

// ─── Insight Cards Flip ───
document.querySelectorAll(".insight-card").forEach(card => {
  card.addEventListener("click", () => {
    console.log("geklickt");
    card.classList.toggle("flipped");
  });
});

window.addEventListener('scroll', () => {
  const section = document.querySelector('.context-section.modern-stacking');
  const cards = document.querySelectorAll('.mini-card');

  if (!section || cards.length === 0) return;

  const rect = section.getBoundingClientRect();
  const totalScrollable = rect.height - window.innerHeight;
  let progress = -rect.top / totalScrollable;
  progress = Math.min(Math.max(progress, 0), 1);

  cards.forEach((card, index) => {
    // Da im CSS row-reverse aktiv ist, spiegeln wir das Timing hier um:
    const flyInOrder = 2 - index; 

    // Timing für das langsame REINFLIEGEN von RECHTS
    const startIn = flyInOrder * 0.25; 
    const duration = 0.35; 
    const endIn = startIn + duration;

    let xPos = 150; // Startet rechts außerhalb des Bildschirms
    let currentRot = 0; // Komplett gerade ohne Neigung!

    if (progress < startIn) {
      xPos = 150;
    } else if (progress >= startIn && progress < endIn) {
      // Einfliegen von RECHTS nach LINKS auf Position 0
      const t = (progress - startIn) / duration;
      
      // Sanftes Abbremsen (Ease-Out)
      const easeOut = 1 - Math.pow(1 - t, 3); 
      xPos = 150 * (1 - easeOut);
    } else {
      // Bleibt fixiert auf Position 0
      xPos = 0;
    }

    card.style.transform = `translateX(${xPos}vw) rotate(${currentRot}deg)`;
    card.style.opacity = "1";
  });
});