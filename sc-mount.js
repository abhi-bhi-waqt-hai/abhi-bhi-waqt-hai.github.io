/* Mounts the scrollcraft engine over this site's own markup.

   The engine generates no DOM: it reads data-sc-* attributes off the HTML the
   Astro components already emit and drives them from one rAF loop. So this is
   the entire integration — there is no config object, and there is deliberately
   no place to put one.

   If anything goes wrong the class added by sc-boot.js comes back off, which
   restores every cue to opacity 1. A page that loses its animation is a
   disappointment; a page that loses its headlines is a broken page, and this
   site's readers cannot afford the second one. */
(function () {
  'use strict';

  function fallback(why) {
    document.documentElement.classList.remove('sc-on');
    if (window.console && console.warn) console.warn('[site] scroll engine off:', why);
  }

  /* ── WHAT THIS FILE USED TO DO, AND WHY IT NO LONGER DOES IT ─────────────
     There were forty lines here that promoted `data-sc-src-defer` to
     `data-sc-src` on the reader's first scroll, so that megabytes of video
     could not race the page's own largest-contentful paint. That machinery was
     correct and it is gone, because nothing on this site scrubs a video any
     more.

     Chapter media is owned by src/scripts/breath.ts — the clip plays itself
     once, at natural speed, when its chapter arrives. Round 23 replaced that
     with a scrollcraft `scrub` act, which cost a decoder seek per frame per
     visible clip and is what the owner reported as "the first page lags". It
     was also a grammar violation: uniqueness.md §2.2 bans `scrub` beyond one
     chapter in chaptered editorial, and it had been put in all four.

     breath.ts already defers harder than this file ever did. It fetches
     nothing at page load, waits for `load` plus an idle callback before it
     even wires its preload observer, and then fetches a chapter's clip only
     once the reader is within two viewports of it. So the release handshake
     had nothing left to release and no LCP left to protect.

     ── AND THERE IS NO `lerp` OPTION ANY MORE ─────────────────────────────
     `lerp` is the fraction of the remaining distance a SCRUBBING CLIP'S
     PLAYHEAD closes each frame (scrollcraft.js:944). It has never had
     anything to do with page scroll. Round 23 lowered it from 0.28 to 0.11 in
     the belief that it would make the page "slower and more dramatic", and
     wrote a paragraph here explaining that theory; what it actually did was
     make every clip arrive later behind the wheel, on the same round that the
     clips first played at all.

     With no scrub clips on the site the option is inert, so it is not being
     restored to 0.28 — it is being removed, along with the belief. Page
     scroll weight lives in src/scripts/motion.ts and nowhere else. Continuous
     scroll-tied motion lives in CSS, driven from the --sc-p the engine
     publishes on every act. */
  function mount() {
    try {
      if (!window.ScrollCraft || typeof window.ScrollCraft.mount !== 'function') {
        return fallback('engine did not load');
      }
      window.ScrollCraft.mount(document.body);
      /* Proof-of-life for tools/smoke.mjs, mirroring window.__siteReady. */
      window.__scrollcraftReady = true;
    } catch (err) {
      fallback(err && err.message ? err.message : err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount, { once: true });
  } else {
    mount();
  }
})();
