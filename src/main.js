import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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