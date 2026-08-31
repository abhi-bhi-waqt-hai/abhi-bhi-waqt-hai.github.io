/**
 * अभी भी वक़्त है — the only JavaScript on the content pages.
 *
 * Lives in public/ as a plain, unprocessed file on purpose. Astro inlines
 * small <script> blocks into the HTML, and the site's CSP is `script-src
 * 'self'` with no 'unsafe-inline' — so an inlined script gets blocked by the
 * browser. Round 1 shipped exactly that bug: quick exit and scroll restore
 * were both dead on every page, silently, with only a console error to show
 * for it. A real file in public/ is served from 'self' and always runs.
 *
 * Everything here degrades safely. If this file never loads, the helplines
 * and all the content still work — only the quick-exit shortcut is lost, and
 * the button itself is a plain link away from being one.
 *
 * Round 27 removed the second half of this file: a scroll-position carry that
 * ran when a reader followed a language link, and had no caller left once the
 * site became English only.
 */
(function () {
  'use strict';

  /* Proof-of-life flag. tools/smoke.mjs asserts on it, because the two worst
     bugs this project has had were both "the script was silently blocked and
     everything still looked fine". A flag makes that state detectable. */
  window.__siteReady = true;

  /* ── QUICK EXIT, AND IT IS NOW THE WHOLE FILE ────────────────────────────────────────────────────
     Overwrite the current history entry, then leave. Overwriting first means
     Back does not come straight back here. Escape twice inside 800 ms does
     the same thing, because the button may be scrolled off screen when
     someone walks into the room. */
  var AWAY = 'https://www.google.com/search?q=weather+today';

  function quickExit() {
    try { history.replaceState(null, '', location.pathname); } catch (e) { /* no-op */ }
    location.replace(AWAY);
  }

  var exits = document.querySelectorAll('[data-quick-exit]');
  for (var i = 0; i < exits.length; i++) {
    exits[i].addEventListener('click', quickExit);
  }

  var lastEsc = 0;
  addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (e.timeStamp - lastEsc < 800) { quickExit(); return; }
    lastEsc = e.timeStamp;
  });

})();
