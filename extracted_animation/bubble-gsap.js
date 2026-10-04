/*
 * BonBern bubble mark — GSAP timeline
 * Drop-in for the existing GSAP + ScrollTrigger landing page.
 *
 * Sequence: smallest dot pops in and locks. Each larger bubble launches out
 * from BEHIND the one before it, settles, and locks. Nothing drifts after it
 * lands — the timeline resolves into the exact logo as drawn.
 *
 * Markup: same SVG, groups in paint order 4, 3, 2, 1 (large circle first so
 * it renders behind), each with data-bub and an inline transform-origin
 * matching its own cx/cy. Start every group at opacity 0.
 *
 * CSS required:
 *   .bb-mark g.bub, .bb-mark .halo { transform-box: view-box; }
 *
 * Requires: gsap, ScrollTrigger.
 */

gsap.registerPlugin(ScrollTrigger);

const BUBBLES = [
  { n: 1, dx: 0,    dy: 0,      at: 0.00, dur: 0.62 },
  { n: 2, dx: 9.22, dy: -16.61, at: 0.40, dur: 0.68, parent: 1 },
  { n: 3, dx: 8.61, dy: -23.09, at: 0.84, dur: 0.76, parent: 2 },
  { n: 4, dx: 20.7, dy: -63.63, at: 1.34, dur: 1.10, parent: 3 }
];

const sel = (n) => `.bb-mark [data-bub="${n}"]`;

function buildBubbleTimeline() {
  const tl = gsap.timeline({
    scrollTrigger: { trigger: '.bb-mark', start: 'top 78%', once: true }
  });

  BUBBLES.forEach(({ n, dx, dy, at, dur, parent }, i) => {
    const g = sel(n);
    const halo = `${g} .halo`;

    gsap.set(g, { autoAlpha: 0, x: -dx, y: -dy, scaleX: 0.05, scaleY: 0.05 });

    // Parent recoil — anticipation and reaction in one beat. Always returns
    // to scaleX/scaleY 1, so the parent holds its designed shape afterwards.
    if (parent) {
      tl.to(sel(parent), {
        scaleX: 1.10, scaleY: 0.90, duration: 0.1, ease: 'power2.out'
      }, at - 0.04)
        .to(sel(parent), {
          scaleX: 1, scaleY: 1, duration: 0.42, ease: 'elastic.out(1, 0.5)'
        }, at + 0.06);
    }

    // Launch — stretch along the direction of travel.
    tl.to(g, {
      autoAlpha: 1, x: -dx * 0.44, y: -dy * 0.44,
      scaleX: 0.62, scaleY: 0.94,
      duration: dur * 0.32, ease: 'power2.out'
    }, at)
      // Arrival — squash on impact.
      .to(g, {
        x: 0, y: 0, scaleX: 1.22, scaleY: 0.82,
        duration: dur * 0.22, ease: 'power1.inOut'
      }, at + dur * 0.32)
      // Settle — elastic, mass-scaled: bigger bubble, looser spring.
      // Ends on exact 1/1 and stays there.
      .to(g, {
        scaleX: 1, scaleY: 1,
        duration: dur * 0.60,
        ease: `elastic.out(1, ${0.36 + i * 0.03})`
      }, at + dur * 0.54);

    // Halo drag — the translucent ring trails, then sits flush.
    tl.fromTo(halo,
      { x: -dx * 0.22, y: -dy * 0.22, scale: 0.88 },
      { x: 0, y: 0, scale: 1, duration: dur * 0.9, ease: 'power2.out' },
      at + 0.06
    );
  });

  // Hard lock: snap every transform to identity once the sequence ends, so
  // the final frame is pixel-identical to the source SVG.
  tl.set('.bb-mark .bub, .bb-mark .halo', {
    x: 0, y: 0, scaleX: 1, scaleY: 1, autoAlpha: 1, clearProps: 'transform'
  });

  return tl;
}

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  buildBubbleTimeline();
} else {
  gsap.set('.bb-mark .bub', { autoAlpha: 1 });
}
