import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

/* ═══════════════════════════════════════════
   BonBern Landing Page — Main Script
   ═══════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

/* ─── Lenis Smooth Scroll ─── */
const lenis = new Lenis({
  duration: 0.9,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1.25,
  touchMultiplier: 1.5,
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

  const angleStep = 24; // degrees between items
  const sections = ['#about', '#process', '#clients', '#showcase', '#contact'];

  // Initialize positions around the circle
  // Inverted: Index 0 (About) is +48deg, Index 2 (Clients) is 0deg (center), Index 4 (Contact) is -48deg
  // In CSS transform-origin: right center, positive angles point up/clockwise, negative point down.
  items.forEach((item, i) => {
    const angle = -(i - 2) * angleStep; 
    gsap.set(item, { rotation: angle });

    // Smooth scroll on click
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(item.getAttribute('href'));
      if (target) lenis.scrollTo(target, { offset: -60 });
    });
  });

  // When in hero section, wheel rotates counter-clockwise so ALL items are in the bottom half (top half completely empty)
  const heroRotation = -(2 * angleStep + 20); // -68deg: About sits at -20deg (below center horizon line)
  gsap.set(wheel, { rotation: heroRotation }); 

  // Create ScrollTriggers for each section to rotate the wheel clockwise as user scrolls down
  sections.forEach((id, i) => {
    const el = document.querySelector(id);
    if(!el) return;
    
    // The target rotation of the wheel so that item `i` is at 0 degrees.
    // Since item i is at angle A = -(i - 2) * angleStep, wheel rotates to -A = (i - 2) * angleStep.
    // As i increases (0 -> 4), targetRotation increases (-48deg -> +48deg), rotating the wheel CLOCKWISE.
    const targetRotation = (i - 2) * angleStep; 

    ScrollTrigger.create({
      trigger: el,
      start: 'top center',
      end: id === '#contact' ? 'bottom bottom' : 'bottom center',
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
        // If we leave the very first section going backwards (up to Hero), clear everything and return below
        if (i === 0) {
          gsap.to(wheel, { 
            rotation: heroRotation, // Return to initial state with top half empty
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

  // Scroll indicator - clickable to jump straight to manifesto
  const scrollBtn = document.getElementById('heroScroll');
  if (scrollBtn) {
    scrollBtn.style.cursor = 'pointer';
    scrollBtn.addEventListener('click', () => {
      lenis.scrollTo('#manifesto', { offset: 0 });
    });
  }
  tl.to('#heroScroll', {
    opacity: 1, duration: 0.6, ease: 'power2.out'
  }, '-=0.3');

  // Parallax on hero media
  gsap.to('.hero-bg-img, .hero-video', {
    yPercent: 12, scale: 1.05,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.4,
    }
  });

  // Background atmosphere switcher
  const switchBtns = document.querySelectorAll('.bg-switch-btn');
  const studioImg = document.getElementById('heroBgImg');
  const noirImg = document.getElementById('heroBgImgNoir');
  const videoEl = document.getElementById('heroBgVideo');

  if (switchBtns.length && studioImg) {
    switchBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const mode = btn.dataset.bg;
        switchBtns.forEach(b => b.classList.toggle('is-active', b === btn));
        
        if (mode === 'studio') {
          studioImg.style.display = 'block';
          if (noirImg) noirImg.style.display = 'none';
          if (videoEl) { videoEl.style.display = 'none'; videoEl.pause(); }
          requestAnimationFrame(() => studioImg.classList.add('is-active'));
          if (noirImg) noirImg.classList.remove('is-active');
          if (videoEl) videoEl.classList.remove('is-active');
        } else if (mode === 'noir') {
          studioImg.style.display = 'none';
          if (noirImg) noirImg.style.display = 'block';
          if (videoEl) { videoEl.style.display = 'none'; videoEl.pause(); }
          requestAnimationFrame(() => noirImg && noirImg.classList.add('is-active'));
          studioImg.classList.remove('is-active');
          if (videoEl) videoEl.classList.remove('is-active');
        } else if (mode === 'video') {
          studioImg.style.display = 'none';
          if (noirImg) noirImg.style.display = 'none';
          if (videoEl) {
            videoEl.style.display = 'block';
            videoEl.play();
            requestAnimationFrame(() => videoEl.classList.add('is-active'));
          }
          studioImg.classList.remove('is-active');
          if (noirImg) noirImg.classList.remove('is-active');
        }
      });
    });
  }

  // Fade out hero content immediately on scroll
  gsap.to('.hero-content', {
    opacity: 0, y: -40,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: '35% top',
      scrub: 0.3,
    }
  });
}

/* ─── Manifesto (Kinetic Morph Text Reveal) ─── */
function initManifesto() {
  const lines = document.querySelectorAll('.m-line');
  if(!lines.length) return;

  const accent1 = lines[1]?.querySelector('.accent');
  const accent2 = lines[2]?.querySelector('.accent');

  // Initial state: Line 1 crisp & centered; Lines 2 & 3 dispersed in soft vapor
  gsap.set(lines[0], { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', letterSpacing: '-0.01em' });
  gsap.set(lines[1], { opacity: 0, y: 32, scale: 0.96, filter: 'blur(16px)', letterSpacing: '0.07em' });
  gsap.set(lines[2], { opacity: 0, y: 32, scale: 0.96, filter: 'blur(16px)', letterSpacing: '0.07em' });
  if (accent1) gsap.set(accent1, { x: 20, opacity: 0.35 });
  if (accent2) gsap.set(accent2, { x: 20, opacity: 0.35 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.manifesto',
      start: 'top top',
      end: '+=220%', // Balanced runway: allows comfortable reading and smooth morphing
      pin: true,
      scrub: 0.6, // Silky, responsive scroll tracking
    }
  });

  // Cinematic parallax & subtle zoom on background video across the full sequence
  tl.to('.manifesto-bg video', {
    scale: 1.15,
    yPercent: 10,
    ease: 'none',
    duration: 4.0
  }, 0);

  tl
    // 1. Initial reading hold for Line 1 ("Building Iconic Images.")
    .to(lines[0], { opacity: 1, duration: 0.55 })

    // ── Morph 1 → 2: Line 1 diffuses into vapor as Line 2 condenses out ──
    .to(lines[0], {
      opacity: 0,
      y: -30,
      scale: 0.96,
      filter: 'blur(16px)',
      letterSpacing: '0.07em',
      duration: 0.85,
      ease: 'sine.inOut'
    })
    .to(lines[1], {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      letterSpacing: '-0.01em',
      duration: 0.85,
      ease: 'sine.inOut'
    }, '-=0.65')

  if (accent1) {
    tl.to(accent1, {
      x: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.6');
  }

  tl
    // 2. Reading hold for Line 2 ("Crafting Viral Campaigns.")
    .to(lines[1], { opacity: 1, duration: 0.65 })

    // ── Morph 2 → 3: Line 2 diffuses into vapor as Line 3 condenses out ──
    .to(lines[1], {
      opacity: 0,
      y: -30,
      scale: 0.96,
      filter: 'blur(16px)',
      letterSpacing: '0.07em',
      duration: 0.85,
      ease: 'sine.inOut'
    })
    .to(lines[2], {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      letterSpacing: '-0.01em',
      duration: 0.85,
      ease: 'sine.inOut'
    }, '-=0.65')

  if (accent2) {
    tl.to(accent2, {
      x: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.6');
  }

  tl
    // 3. Reading hold for Line 3 ("Solving Real-World Problems.")
    .to(lines[2], { opacity: 1, duration: 0.65 })

    // Soft dissolve release directly into the About section
    .to(lines[2], {
      opacity: 0,
      y: -22,
      scale: 0.98,
      filter: 'blur(10px)',
      letterSpacing: '0.04em',
      duration: 0.5,
      ease: 'sine.inOut'
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

/* ─── Process (Horizontal Scroll with Lenis Card Snapping) ─── */
function initProcess() {
  const track = document.getElementById('processTrack');
  const wrap = document.getElementById('processWrap');
  const bar = document.getElementById('processBar');
  if(!track || !wrap || !bar) return;
  const cards = track.querySelectorAll('.process-card');
  if(!cards.length) return;

  // Calculate how far to scroll horizontally
  const getScrollAmount = () => track.scrollWidth - wrap.offsetWidth;

  let processST = null;

  const tween = gsap.to(track, {
    x: () => -getScrollAmount(),
    ease: 'none',
    scrollTrigger: {
      trigger: '#process',
      start: 'top top',
      end: () => '+=' + getScrollAmount(),
      pin: true,
      scrub: 0.5, // Crisp, responsive scrub synced with Lenis
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        bar.style.width = (self.progress * 100) + '%';
      }
    }
  });

  processST = tween.scrollTrigger;

  // Helper: Get target vertical scroll position to center card at given index
  const getCardScroll = (index) => {
    if (!processST) return 0;
    const total = cards.length - 1;
    const clampedIndex = Math.max(0, Math.min(total, index));
    const progress = clampedIndex / total;
    return processST.start + progress * (processST.end - processST.start);
  };

  // 1. Lenis Smooth Card Snapping when scrolling settles inside section
  let isSnapping = false;
  let snapTimer = null;

  lenis.on('scroll', () => {
    if (isSnapping || !processST) return;

    const scroll = lenis.scroll;
    // Only engage snapping when within the pinned Process section (with safety margins)
    if (scroll >= processST.start + 30 && scroll <= processST.end - 30) {
      clearTimeout(snapTimer);
      snapTimer = setTimeout(() => {
        if (isSnapping || !processST) return;
        const currentScroll = lenis.scroll;
        if (currentScroll < processST.start + 20 || currentScroll > processST.end - 20) return;

        const total = cards.length - 1;
        const currentProgress = (currentScroll - processST.start) / (processST.end - processST.start);
        const nearestIndex = Math.max(0, Math.min(total, Math.round(currentProgress * total)));
        const targetScroll = getCardScroll(nearestIndex);

        const diff = Math.abs(currentScroll - targetScroll);
        // Snap directly into dead-center of the card if not already aligned
        if (diff > 6) {
          isSnapping = true;
          lenis.scrollTo(targetScroll, {
            duration: 0.65,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            onComplete: () => {
              setTimeout(() => { isSnapping = false; }, 60);
            }
          });
        }
      }, 130);
    }
  });

  // 2. Horizontal Scroll on hover (Trackpad horizontal swipe, horizontal wheel, Shift + wheel)
  wrap.addEventListener('wheel', (e) => {
    const isHorizontalGesture = Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey;
    const delta = e.shiftKey ? e.deltaY : e.deltaX;

    if (isHorizontalGesture && Math.abs(delta) > 0) {
      e.preventDefault();
      if (!processST) return;

      const currentScroll = lenis.scroll;
      // Scroll the cards side to side smoothly
      const targetScroll = Math.max(processST.start, Math.min(processST.end, currentScroll + delta * 1.3));

      isSnapping = false;
      lenis.scrollTo(targetScroll, { immediate: true });
    }
  }, { passive: false });

  // 3. Mouse / Pointer Click-and-Drag Side-to-Side
  let isDragging = false;
  let startX = 0;
  let startScroll = 0;
  let hasDragged = false;

  wrap.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if (!processST) return;

    isDragging = true;
    hasDragged = false;
    startX = e.clientX;
    startScroll = lenis.scroll;
    isSnapping = true;
    wrap.classList.add('is-dragging');
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging || !processST) return;

    const dx = e.clientX - startX;
    if (Math.abs(dx) > 6) {
      hasDragged = true;
    }

    if (hasDragged) {
      const baseScroll = (startScroll < processST.start || startScroll > processST.end)
        ? processST.start
        : startScroll;

      // Dragging left (dx < 0) advances cards leftward; dragging right advances cards rightward
      const targetScroll = Math.max(processST.start, Math.min(processST.end, baseScroll - dx * 1.5));
      lenis.scrollTo(targetScroll, { immediate: true });
    }
  });

  const endDrag = () => {
    if (!isDragging) return;
    isDragging = false;
    wrap.classList.remove('is-dragging');

    if (hasDragged && processST) {
      // Snap smoothly to nearest card on release
      const currentScroll = lenis.scroll;
      const total = cards.length - 1;
      const currentProgress = (currentScroll - processST.start) / (processST.end - processST.start);
      const nearestIndex = Math.max(0, Math.min(total, Math.round(currentProgress * total)));
      const targetScroll = getCardScroll(nearestIndex);

      isSnapping = true;
      lenis.scrollTo(targetScroll, {
        duration: 0.65,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        onComplete: () => {
          setTimeout(() => { isSnapping = false; }, 60);
        }
      });
    } else {
      isSnapping = false;
    }
  };

  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  // 4. Click any card to glide smoothly into the center using Lenis
  cards.forEach((card, i) => {
    card.addEventListener('click', (e) => {
      // Don't trigger center click if user was dragging side-to-side
      if (hasDragged) {
        e.preventDefault();
        return;
      }
      isSnapping = true;
      lenis.scrollTo(getCardScroll(i), {
        duration: 0.8,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        onComplete: () => {
          setTimeout(() => { isSnapping = false; }, 60);
        }
      });
    });

    // Card entrance stagger
    gsap.from(card, {
      y: 40,
      duration: 0.8,
      ease: 'power2.out',
      clearProps: 'transform',
      scrollTrigger: {
        trigger: card,
        containerAnimation: tween,
        start: 'left 95%',
        toggleActions: 'play none none none',
      }
    });

    // Auto-Highlight active card in center of screen
    ScrollTrigger.create({
      trigger: card,
      containerAnimation: tween,
      start: 'center 60%',
      end: 'center 40%',
      toggleClass: 'is-active',
    });
  });

  // 3. Click progress bar to jump directly to corresponding card
  const progressBarWrap = bar.parentElement;
  if (progressBarWrap) {
    progressBarWrap.style.cursor = 'pointer';
    progressBarWrap.addEventListener('click', (e) => {
      const rect = progressBarWrap.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const targetIndex = Math.round(ratio * (cards.length - 1));
      isSnapping = true;
      lenis.scrollTo(getCardScroll(targetIndex), {
        duration: 0.8,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        onComplete: () => {
          setTimeout(() => { isSnapping = false; }, 60);
        }
      });
    });
  }
}

/* ─── Clients Magazine Marquees & 3D Center Pop-Out ─── */
function initClients() {
  const celebsWrapper = document.getElementById('celebsMarquee');
  const celebsTrack = document.getElementById('celebsTrack');
  const cards = celebsTrack ? Array.from(celebsTrack.querySelectorAll('.mag-card')) : [];

  if (celebsWrapper && cards.length) {
    let activeCard = null;

    // Check which card is centered in the viewport
    const updateCenterCard = () => {
      const windowCenter = window.innerWidth / 2;
      let closestCard = null;
      let minDistance = Infinity;

      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        if (rect.right > -100 && rect.left < window.innerWidth + 100) {
          const cardCenter = rect.left + rect.width / 2;
          const distance = Math.abs(windowCenter - cardCenter);
          if (distance < minDistance) {
            minDistance = distance;
            closestCard = card;
          }
        }
      });

      // Activate if near the center (within 280px of center for refined cards)
      if (closestCard && minDistance < 280) {
        if (activeCard !== closestCard) {
          if (activeCard) activeCard.classList.remove('is-active');
          closestCard.classList.add('is-active');
          activeCard = closestCard;
        }
      } else if (activeCard) {
        activeCard.classList.remove('is-active');
        activeCard = null;
      }
    };

    // Continuous center detection loop using requestAnimationFrame
    let rafId;
    const loop = () => {
      updateCenterCard();
      rafId = requestAnimationFrame(loop);
    };

    // Only run loop when .clients is in viewport to optimize performance
    ScrollTrigger.create({
      trigger: '.clients',
      start: 'top bottom',
      end: 'bottom top',
      onEnter: () => { cancelAnimationFrame(rafId); rafId = requestAnimationFrame(loop); },
      onEnterBack: () => { cancelAnimationFrame(rafId); rafId = requestAnimationFrame(loop); },
      onLeave: () => cancelAnimationFrame(rafId),
      onLeaveBack: () => cancelAnimationFrame(rafId)
    });

    // Clear active card on mouseenter of another card so hover takes precedence
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        if (activeCard && activeCard !== card) {
          activeCard.classList.remove('is-active');
        }
      });
    });
  }

  // Section entrance animations
  gsap.from('.clients-title', {
    opacity: 0, y: 40, duration: 1, ease: 'power2.out',
    scrollTrigger: { trigger: '.clients', start: 'top 75%' }
  });

  gsap.from('.clients-subtitle', {
    opacity: 0, y: 25, duration: 0.9, delay: 0.15, ease: 'power2.out',
    scrollTrigger: { trigger: '.clients', start: 'top 75%' }
  });

  gsap.from('.mag-marquee-section', {
    opacity: 0, y: 50, duration: 1.1, stagger: 0.25, ease: 'power3.out',
    scrollTrigger: { trigger: '.clients', start: 'top 65%' }
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
  ScrollTrigger.refresh();
}

/* ─── Start ─── */
window.addEventListener('DOMContentLoaded', () => {
  lenis.stop(); // Stop scroll during preload
  runPreloader();
  setTimeout(() => { lenis.start(); }, 3600);
});
