import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Chart from "chart.js/auto";
import scatterSurveyData from "./charts/wehrpflicht-scatter-data.json";

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
// Scrollt "mit" zwischen Abschnitt 01 (These) und 02 (Kontext) via ScrollTrigger-Pinning.
// Datenquelle: src/data/wehrpflicht-scatter.json (aus der Umfrage berechnet:
// x = Frage 10, y = Mittelwert aus Frage 15, 17, 18, 19; Frage 16 wurde bewusst ausgeschlossen).

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
          backgroundColor: "rgba(124,186,151,0.5)",
          borderColor: "#4D7C0F",
          borderWidth: 1,
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: "Trend",
          type: "line",
          data: [],
          borderColor: "#1A1A1A",
          borderWidth: 1,
          borderDash: [4, 4],
          pointRadius: 0,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 0 },
      layout: { padding: { top: 8, right: 8 } },
      scales: {
        x: {
          min: 0.5,
          max: 5.5,
          display: false,
          grid: { display: false }
        },
        y: {
          min: 0.5,
          max: 5.5,
          display: false,
          grid: { display: false }
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
            label: (c) => (c.datasetIndex === 1 ? null : `Vertragsscore: ${c.parsed.y.toFixed(2)}`)
          }
        }
      }
    }
  });
}

function renderScatter() {
  if (!scatterChart) return;

  const visible = scatterPoints.filter(p => scatterGender === "all" || p.g === scatterGender);

  scatterChart.data.datasets[0].data = visible.map(p => ({ x: p.jx, y: p.y }));

  const corrEl = document.getElementById("scatterCorr");
  const countEl = document.getElementById("scatterCount");

  if (visible.length > 2) {
    const n = visible.length;
    const mx = visible.reduce((a, p) => a + p.x, 0) / n;
    const my = visible.reduce((a, p) => a + p.y, 0) / n;
    let num = 0, dx = 0, dy = 0;
    visible.forEach(p => {
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
    if (corrEl) corrEl.textContent = isNaN(r) ? "r = –" : `r = ${r.toFixed(2)}`;
  } else {
    scatterChart.data.datasets[1].data = [];
    if (corrEl) corrEl.textContent = "r = –";
  }

  if (countEl) countEl.textContent = `n = ${visible.length}`;
  scatterChart.update();
}

document.querySelectorAll(".scatter-filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".scatter-filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    scatterGender = btn.dataset.g;
    renderScatter();
  });
});

// Panel erscheint exakt mit dem Anfang von Abschnitt 01 (These) und
// verschwindet exakt beim letzten Satz von Abschnitt 02 (Kontext).
const scatterFloatEl = document.getElementById("scatterFloat");
const scatterStartEl = document.getElementById("s1");
const scatterEndEl = document.getElementById("contextEndTrigger");

if (scatterFloatEl && scatterStartEl && scatterEndEl) {
  ScrollTrigger.create({
    trigger: scatterStartEl,
    start: "top top",
    endTrigger: scatterEndEl,
    end: "bottom center",
    markers: false,
    onEnter: () => scatterFloatEl.classList.add("visible"),
    onEnterBack: () => scatterFloatEl.classList.add("visible"),
    onLeave: () => scatterFloatEl.classList.remove("visible"),
    onLeaveBack: () => scatterFloatEl.classList.remove("visible")
  });
}

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