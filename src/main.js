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
