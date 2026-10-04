import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

/* ═══════════════════════════════════════════
   BonBern Landing Page — Main Script
   ═══════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

/* ─── Lenis Smooth Scroll ─── */
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* ─── Utilities ─── */
function splitWords(el) {
  const text = el.textContent.trim();
  const words = text.split(/\s+/);
  el.innerHTML = words.map(w => `<span class="word">${w}</span>`).join(' ');
  return el.querySelectorAll('.word');
}

function splitManifesto(el) {
  // Preserve accent spans
  const html = el.innerHTML;
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  let result = '';
  tempDiv.childNodes.forEach(node => {
    if (node.nodeType === 3) { // text node
      const words = node.textContent.trim().split(/\s+/).filter(w => w);
      words.forEach(w => { result += `<span class="m-word">${w}</span> `; });
    } else if (node.nodeType === 1) { // element node
      const words = node.textContent.trim().split(/\s+/).filter(w => w);
      words.forEach(w => { result += `<span class="m-word is-accent">${w}</span> `; });
    }
  });
  el.innerHTML = result;
  return el.querySelectorAll('.m-word');
}

/* ─── Custom Cursor ─── */
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, dotX = 0, dotY = 0, ringX = 0, ringY = 0;
const isTouchDevice = 'ontouchstart' in window;

if (!isTouchDevice) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.classList.add('visible');
    ring.classList.add('visible');

    // Hero glow follow
    const glow = document.getElementById('heroGlow');
    if (glow) {
      const rect = glow.parentElement.getBoundingClientRect();
      glow.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100) + '%');
      glow.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100) + '%');
    }
  });

  function animateCursor() {
    dotX += (mouseX - dotX) * 0.2;
    dotY += (mouseY - dotY) * 0.2;
    ringX += (mouseX - ringX) * 0.1;
    ringY += (mouseY - ringY) * 0.1;
    dot.style.left = dotX + 'px';
    dot.style.top = dotY + 'px';
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover states
  document.querySelectorAll('[data-hover]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('is-hover');
      ring.classList.add('is-hover');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('is-hover');
      ring.classList.remove('is-hover');
    });
  });
} else {
  if(dot) dot.style.display = 'none';
  if(ring) ring.style.display = 'none';
}

/* ─── Magnetic Button ─── */
document.querySelectorAll('[data-magnetic]').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.3;
    const dy = (e.clientY - cy) * 0.3;
    gsap.to(btn, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
  });
});

/* ─── Preloader ─── */
function runPreloader() {
  const preloader = document.getElementById('preloader');
  const root = preloader.querySelector('.bb-mark');
  if (!root) {
    if(preloader) preloader.classList.add('is-done');
    document.body.classList.remove('is-loading');
    initAnimations();
    return;
  }

  const SPEC = [
    { n: 1, dx: 0,    dy: 0,      at: 0,    dur: 620  },
    { n: 2, dx: 9.22, dy: -16.61, at: 400,  dur: 680, parent: 1 },
    { n: 3, dx: 8.61, dy: -23.09, at: 840,  dur: 760, parent: 2 },
    { n: 4, dx: 20.7, dy: -63.63, at: 1340, dur: 1100, parent: 3 }
  ];
  const EASE_BUB = 'cubic-bezier(.22,.68,.32,1)';

  function get(n) { return root.querySelector('[data-bub="' + n + '"]'); }
  function tr(dx, dy, f) {
    return 'translate(' + (-dx * f).toFixed(2) + 'px,' + (-dy * f).toFixed(2) + 'px)';
  }
  function launch(dx, dy) {
    return [
      { transform: tr(dx, dy, 1) + ' scale(0.05,0.05)', opacity: 0, offset: 0 },
      { transform: tr(dx, dy, 0.88) + ' scale(0.30,0.62)', opacity: 1, offset: 0.14 },
      { transform: tr(dx, dy, 0.44) + ' scale(0.62,0.94)', opacity: 1, offset: 0.32 },
      { transform: tr(dx, dy, 0.05) + ' scale(1.22,0.82)', opacity: 1, offset: 0.54 },
      { transform: tr(dx, dy, 0) + ' scale(0.91,1.10)', opacity: 1, offset: 0.70 },
      { transform: tr(dx, dy, 0) + ' scale(1.05,0.96)', opacity: 1, offset: 0.84 },
      { transform: tr(dx, dy, 0) + ' scale(0.99,1.01)', opacity: 1, offset: 0.93 },
      { transform: 'translate(0px,0px) scale(1,1)', opacity: 1, offset: 1 }
    ];
  }
  function haloDrag(dx, dy) {
    return [
      { transform: tr(dx, dy, 0.22) + ' scale(0.88)', offset: 0 },
      { transform: tr(dx, dy, 0.30) + ' scale(0.95)', offset: 0.28 },
      { transform: tr(dx, dy, 0.06) + ' scale(1.08)', offset: 0.60 },
      { transform: 'translate(0px,0px) scale(0.98)', offset: 0.82 },
      { transform: 'translate(0px,0px) scale(1,1)', offset: 1 }
    ];
  }
  const RECOIL = [
    { transform: 'scale(1,1)', offset: 0 },
    { transform: 'scale(1.10,0.90)', offset: 0.24 },
    { transform: 'scale(0.96,1.05)', offset: 0.56 },
    { transform: 'scale(1.01,0.99)', offset: 0.80 },
    { transform: 'scale(1,1)', offset: 1 }
  ];

  SPEC.forEach(s => {
    const g = get(s.n);
    const halo = g.querySelector('.halo');
    g.style.opacity = '0';
    g.animate(launch(s.dx, s.dy), {
      duration: s.dur, delay: s.at, fill: 'both', easing: EASE_BUB
    });
    halo.animate(haloDrag(s.dx, s.dy), {
      duration: s.dur + 160, delay: s.at + 60, fill: 'both', easing: EASE_BUB
    });
    if (s.parent) {
      get(s.parent).animate(RECOIL, {
        duration: 400, delay: s.at - 40, fill: 'none', easing: 'ease-out'
      });
    }
  });

  // Dismiss preloader
  setTimeout(() => {
    preloader.classList.add('is-done');
    document.body.classList.remove('is-loading');
    initAnimations();
  }, 3600);
}

/* ─── Circular Side Navigation ─── */
function initNav() {
  const wheel = document.getElementById('sideNavWheel');
  const items = document.querySelectorAll('.side-nav-item');
  if(!wheel || !items.length) return;

  const angleStep = 25; // degrees between items
  const sections = ['#about', '#process', '#clients', '#showcase', '#contact'];

  // Initialize positions around the circle
  // Index 0 is -50deg, index 2 is 0deg (center), index 4 is +50deg
  items.forEach((item, i) => {
    const angle = (i - 2) * angleStep; 
    gsap.set(item, { rotation: angle });

    // Smooth scroll on click
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(item.getAttribute('href'));
      if (target) lenis.scrollTo(target, { offset: -60 });
    });
  });

  // When in hero section, wheel rotates so all items are slightly below
  gsap.set(wheel, { rotation: 75 }); 

  // Create ScrollTriggers for each section to rotate the wheel
  sections.forEach((id, i) => {
    const el = document.querySelector(id);
    if(!el) return;
    
    // The target rotation of the wheel so that item `i` is at 0 degrees.
    // If item i is at angle A, wheel needs to rotate to -A.
    const targetRotation = -(i - 2) * angleStep; 

    ScrollTrigger.create({
      trigger: el,
      start: 'top center',
      end: 'bottom center',
      onToggle: self => {
        if(self.isActive) {
          gsap.to(wheel, { 
            rotation: targetRotation, 
            duration: 0.8, 
            ease: 'back.out(1.2)', 
            overwrite: 'auto' 
          });
          
          items.forEach((item, index) => {
            item.classList.toggle('is-active', index === i);
          });
        }
      },
      onLeaveBack: self => {
        // If we leave the very first section going backwards (up to Hero), clear everything
        if (i === 0) {
          gsap.to(wheel, { 
            rotation: 75, // Initial rotation state hiding below
            duration: 0.8, 
            ease: 'back.out(1.2)', 
            overwrite: 'auto' 
          });
          items.forEach(item => item.classList.remove('is-active'));
        }
      }
    });
  });
}

/* ─── Hero Animations ─── */
function initHero() {
  const tl = gsap.timeline({ delay: 0.3 });

  // Eyebrow
  tl.to('.hero-eyebrow', {
    opacity: 1, duration: 0.8, ease: 'power2.out'
  });

  // Subtitle
  tl.to('#heroSub', {
    opacity: 1, y: 0, duration: 0.8, ease: 'power2.out'
  }, '-=0.5');

  // Scroll indicator
  tl.to('#heroScroll', {
    opacity: 1, duration: 0.6, ease: 'power2.out'
  }, '-=0.3');

  // Parallax on hero video
  gsap.to('.hero-video', {
    yPercent: 20, scale: 1.15,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    }
  });

  // Fade out hero on scroll
  gsap.to('.hero-content', {
    opacity: 0, y: -60,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: '60% top',
      end: 'bottom top',
      scrub: 1,
    }
  });
}

/* ─── Manifesto (Scroll-driven text reveal) ─── */
function initManifesto() {
  const lines = document.querySelectorAll('.m-line');
  if(!lines.length) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.manifesto',
      start: 'top top',
      end: '+=50%',  // Drastically reduced the pinning distance so it scrubs much faster
      pin: true,
      scrub: 1,
    }
  });

  tl.to(lines, {
    opacity: 1,
    stagger: 1,
    duration: 1,
    ease: 'power1.inOut'
  });
}

/* ─── About Section ─── */
function initAbout() {
  gsap.to('.about-line', {
    opacity: 1, y: 0, duration: 0.9,
    stagger: 0.15, ease: 'power2.out',
    scrollTrigger: {
      trigger: '.about',
      start: 'top 65%',
      toggleActions: 'play none none none',
    }
  });

  // Video parallax
  gsap.to('.about-video', {
    yPercent: -10,
    ease: 'none',
    scrollTrigger: {
      trigger: '.about',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
    }
  });
}

/* ─── Process (Horizontal Scroll) ─── */
function initProcess() {
  const track = document.getElementById('processTrack');
  const wrap = document.getElementById('processWrap');
  const bar = document.getElementById('processBar');
  if(!track || !wrap || !bar) return;
  const cards = track.querySelectorAll('.process-card');

  // Calculate how far to scroll horizontally
  const getScrollAmount = () => track.scrollWidth - wrap.offsetWidth;

  const tween = gsap.to(track, {
    x: () => -getScrollAmount(),
    ease: 'none',
    scrollTrigger: {
      trigger: '#process',
      start: 'top top',
      // The 40vw padding already elongates the scroll path naturally, so no need for an artificial multiplier here
      end: () => '+=' + getScrollAmount(),
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        bar.style.width = (self.progress * 100) + '%';
      }
    }
  });

  // Card entrance stagger & Auto-Highlight
  cards.forEach((card, i) => {
    // 1. Reveal Animation
    gsap.from(card, {
      opacity: 0, y: 50, scale: 0.95,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        containerAnimation: tween,
        start: 'left 95%',
        toggleActions: 'play none none none',
      }
    });

    // 2. Auto-Highlight (adds .is-active when in center of screen)
    ScrollTrigger.create({
      trigger: card,
      containerAnimation: tween,
      start: 'left 55%',
      end: 'right 45%',
      toggleClass: 'is-active',
    });
  });
}

/* ─── Clients Staggered Reveal ─── */
function initClients() {
  const groups = document.querySelectorAll('.clients-group');
  groups.forEach(group => {
    const chips = group.querySelectorAll('.client-chip');
    ScrollTrigger.create({
      trigger: group,
      start: 'top 75%',
      onEnter: () => {
        chips.forEach((chip, i) => {
          setTimeout(() => {
            chip.classList.add('is-visible');
          }, i * 120);
        });
      }
    });
  });

  // Title animation
  gsap.from('.clients-title', {
    opacity: 0, y: 40, duration: 1, ease: 'power2.out',
    scrollTrigger: { trigger: '.clients', start: 'top 70%' }
  });
}

/* ─── Showcase ─── */
function initShowcase() {
  const items = document.querySelectorAll('.showcase-item');
  items.forEach((item, i) => {
    gsap.from(item, {
      opacity: 0, y: 60, scale: 0.96,
      duration: 0.9, delay: i * 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });
  });
}

/* ─── Founder ─── */
function initFounder() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.founder',
      start: 'top 60%',
      toggleActions: 'play none none none',
    }
  });

  tl.from('.founder .section-eyebrow', {
    opacity: 0, y: 20, duration: 0.6, ease: 'power2.out'
  })
  .from('.founder-quote', {
    opacity: 0, x: -40, duration: 0.9, ease: 'power2.out'
  }, '-=0.3')
  .from('.founder-name', {
    opacity: 0, y: 20, duration: 0.6, ease: 'power2.out'
  }, '-=0.4')
  .from('.founder-role', {
    opacity: 0, y: 20, duration: 0.6, ease: 'power2.out'
  }, '-=0.4')
  .from('.founder-bio', {
    opacity: 0, y: 20, duration: 0.8, ease: 'power2.out'
  }, '-=0.3');

  // Deco circle parallax
  gsap.to('.founder-deco', {
    rotation: 30, y: -60,
    ease: 'none',
    scrollTrigger: {
      trigger: '.founder',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
    }
  });
}

/* ─── CTA ─── */
function initCta() {
  gsap.from('.cta-title', {
    opacity: 0, y: 50, scale: 0.97,
    duration: 1, ease: 'power2.out',
    scrollTrigger: { trigger: '.cta', start: 'top 65%' }
  });
  gsap.from('.cta-btn', {
    opacity: 0, y: 30,
    duration: 0.8, delay: 0.2, ease: 'power2.out',
    scrollTrigger: { trigger: '.cta', start: 'top 65%' }
  });
}

/* ─── Video Lazy Playback ─── */
function initVideoPlayback() {
  const videos = document.querySelectorAll('video');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.play().catch(() => {});
      } else {
        entry.target.pause();
      }
    });
  }, { threshold: 0.1 });

  videos.forEach(v => observer.observe(v));
}

/* ─── Initialize All Animations ─── */
function initAnimations() {
  initHero();
  initManifesto();
  initAbout();
  initProcess();
  initClients();
  initShowcase();
  initFounder();
  initCta();
  initVideoPlayback();
  
  // Initialize nav LAST so ScrollTrigger calculates positions after all pins are created
  initNav();
}

/* ─── Start ─── */
window.addEventListener('DOMContentLoaded', () => {
  lenis.stop(); // Stop scroll during preload
  runPreloader();
  setTimeout(() => { lenis.start(); }, 3600);
});
