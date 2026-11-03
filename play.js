/* play.js: the parts of a page you use rather than read (styles in
   src/styles/play.css). A classic script, not a module, so it also runs
   when the site is opened straight from a folder. Every part here only
   adds behaviour to markup that already reads correctly without it. */
(function () {
  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var phone = matchMedia('(max-width: 52rem)');
  var $$ = function (sel, el) { return [].slice.call((el || document).querySelectorAll(sel)); };

  /* the page's own entrance comes first (site.ts sets html.ready) */
  function whenReady(fn) {
    if (!root.classList.contains('boot') || root.classList.contains('ready')) return fn();
    var mo = new MutationObserver(function () {
      if (root.classList.contains('ready')) { mo.disconnect(); fn(); }
    });
    mo.observe(root, { attributes: true, attributeFilter: ['class'] });
  }
  /* glide to a part of the page, with the site's heavy scroll if it is on */
  function glide(el, off) {
    var y = el.getBoundingClientRect().top + scrollY - (off || 90);
    if (window.abwhLenis) window.abwhLenis.scrollTo(y, { duration: 1.3 });
    else scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
  }
  function draw(gl) {
    if (!gl) return;
    gl.classList.remove('on');
    void gl.getBoundingClientRect();
    gl.classList.add('on');
  }

  /* ── drawings draw themselves as they come into view ── */
  whenReady(function () {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px 4% 0px' });
    $$('.gl:not([data-manual])').forEach(function (g) { if (!g.closest('.card')) io.observe(g); });
  });

  /* ── numbers count up the first time they are seen ── */
  whenReady(function () {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        count(e.target);
      });
    }, { threshold: .5 });
    $$('[data-count]:not([data-manual])').forEach(function (n) { io.observe(n); });
  });
  function count(n) {
    var to = parseFloat(n.getAttribute('data-count')) || 0;
    var from = parseFloat(n.getAttribute('data-from')) || 0;
    if (reduce) { n.textContent = to.toLocaleString('en-IN'); return; }
    var t0 = performance.now(), dur = +(n.getAttribute('data-dur') || 1600);
    (function step(t) {
      var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 4);
      n.textContent = Math.round(from + (to - from) * e).toLocaleString('en-IN');
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }
  window.abwhCount = count;

  /* ── a small clay lamp, for the rows that light as you go ── */
  var LAMP = '<svg viewBox="0 0 40 36" aria-hidden="true"><circle class="lamp__g" cx="34.5" cy="12" r="7"/>' +
    '<path class="lamp__b" d="M3 21c3 8 9 12 17 12s14-4 17-11"/><path class="lamp__b" d="M3 21c6 2 13 2.5 19 2s10-1.5 13-3l2-1"/>' +
    '<g class="lamp__f"><path d="M34.5 3c1.2 4 4.4 6.4 4.4 10.2a4.4 4.4 0 0 1-8.8 0c0-3.8 3.2-6.2 4.4-10.2z" fill="#ffbe5c"/>' +
    '<path d="M34.5 8.5c.6 2 2.2 3.2 2.2 5a2.2 2.2 0 0 1-4.4 0c0-1.8 1.6-3 2.2-5z" fill="#fff4dc"/></g></svg>';
  window.abwhLamp = LAMP;
  $$('[data-lamp]').forEach(function (s) { s.innerHTML = LAMP; });

  /* ── the law check: four taps, a shield that lights, a plain verdict ──
     Each option carries data-v (ok, warn, no; kid or adult for the age
     question) and data-note, the sentence shown in the verdict. */
  $$('[data-check]').forEach(function (box) {
    var steps = $$('.chk__step', box);
    var dots = $$('.chk__dots li', box);
    var res = box.querySelector('.chk__res');
    var shield = document.querySelector('[data-shield]');
    var segs = shield ? $$('[data-seg]', shield) : [];
    var picks = [], i = 0, paper = box.hasAttribute('data-paper');
    box.classList.add('is-js');
    function show() {
      steps.forEach(function (s, k) { s.classList.toggle('is-cur', k === i); s.classList.toggle('is-done', k < i); s.classList.toggle('is-later', k > i); });
      dots.forEach(function (d, k) {
        var p = picks[k];
        d.className = p ? (p.v === 'kid' || p.v === 'adult' ? 'is-done' : 'is-' + p.v) : '';
      });
      segs.forEach(function (s, k) { var p = picks[k]; s.setAttribute('class', 'shield__seg' + (p ? ' is-' + p.v : '')); });
    }
    function verdict() {
      if (!paper) steps.forEach(function (s) { s.classList.remove('is-cur'); });
      var law = picks.slice(0, 3), no = law.some(function (p) { return p.v === 'no'; });
      var v = box.querySelector('[data-verdict]');
      v.textContent = no ? 'Section 64A does not reach this.' : 'Section 64A is on your side.';
      v.classList.toggle('is-no', no);
      var notes = box.querySelector('[data-notes]');
      notes.innerHTML = '';
      law.forEach(function (p, k) {
        if (no && p.v === 'ok') return;
        var li = document.createElement('li');
        li.className = 'is-' + p.v; li.style.setProperty('--i', k); li.textContent = p.note;
        notes.appendChild(li);
      });
      box.querySelector('[data-limits]').hidden = no;
      box.querySelector('[data-kid]').hidden = !(picks[3] && picks[3].v === 'kid');
      res.hidden = false;
      if (shield) { shield.classList.toggle('is-yes', !no); shield.classList.toggle('is-nope', no); }
      box.setAttribute('data-verdict', no ? 'no' : 'yes');
      var st = box.querySelector('[data-stamp-t]'); if (st) st.textContent = no ? 'Not covered' : 'Covered';
      if (phone.matches) glide(box, 80);
    }
    $$('.chk__o', box).forEach(function (o) {
      o.addEventListener('click', function () {
        var k = steps.indexOf(o.closest('.chk__step'));
        if (paper && k !== i) return;
        $$('.chk__o', steps[k]).forEach(function (x) { x.classList.toggle('is-picked', x === o); });
        picks[k] = { v: o.getAttribute('data-v'), note: o.getAttribute('data-note') };
        picks.length = k + 1;
        i = k + 1;
        show();
        if (i >= steps.length) verdict();
      });
    });
    box.querySelector('[data-redo]').addEventListener('click', function () {
      picks = []; i = 0; res.hidden = true; box.removeAttribute('data-verdict');
      $$('.chk__o', box).forEach(function (x) { x.classList.remove('is-picked'); });
      if (shield) shield.classList.remove('is-yes', 'is-nope');
      show();
    });
    show();
  });

  /* ── the place finder: age, then what feels possible ── */
  $$('[data-finder]').forEach(function (box) {
    var age = box.querySelector('[data-fd="age"]'), want = box.querySelector('[data-fd="want"]');
    var res = box.querySelector('.fd__res'), kid = false, what = 'de-addiction centre';
    box.classList.add('is-js');
    function step(s) { [age, want].forEach(function (x) { x.classList.toggle('is-cur', x === s); }); }
    step(age);
    $$('[data-age]', box).forEach(function (b) {
      b.addEventListener('click', function () { kid = b.getAttribute('data-age') === 'kid'; step(want); });
    });
    $$('[data-want]', box).forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-want');
        step(null);
        res.hidden = false;
        $$('[data-pick]', box).forEach(function (p) {
          var on = p.getAttribute('data-pick') === k;
          p.hidden = !on;
          if (on) { draw(p.querySelector('.gl')); count(p.querySelector('[data-count]')); what = p.getAttribute('data-map') || what; }
        });
        box.querySelector('[data-kid]').hidden = !kid;
        q.textContent = phrase();
        if (phone.matches) glide(box, 80);
      });
    });
    box.querySelector('[data-fd-redo]').addEventListener('click', function () { res.hidden = true; step(age); });
    /* the district goes straight into a map search for the kind of place picked */
    var dist = box.querySelector('[data-district]'), q = box.querySelector('[data-search-text]');
    var phrase = function () { var d = dist.value.trim(); return what + (d ? ' in ' + d : ' near me'); };
    dist.addEventListener('input', function () { q.textContent = phrase(); });
    box.querySelector('[data-map-form]').addEventListener('submit', function (e) {
      e.preventDefault();
      window.open('https://www.google.com/maps/search/' + encodeURIComponent(phrase()), '_blank', 'noopener');
    });
  });

  /* ── the street: one building open at a time ── */
  $$('[data-street]').forEach(function (box) {
    var tabs = $$('[data-st]', box);
    function open(b) {
      var k = b.getAttribute('data-st');
      tabs.forEach(function (t) { t.setAttribute('aria-selected', String(t === b)); });
      $$('[data-stc]', box).forEach(function (c) {
        var on = c.getAttribute('data-stc') === k;
        c.hidden = !on;
        if (on) count(c.querySelector('[data-count]'));
      });
    }
    tabs.forEach(function (b, k) {
      b.addEventListener('click', function () { open(b); });
      b.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        var n = tabs[(k + d + tabs.length) % tabs.length]; n.focus(); open(n);
      });
    });
  });

  /* ── the call list: keep the ticked questions for the call ──
     A phone hands them to its own share sheet (notes, messages, yourself on
     WhatsApp); anything without one saves them as a small text file. */
  $$('[data-calls]').forEach(function (box) {
    var btn = box.querySelector('[data-save-calls]'), hint = box.querySelector('[data-calls-hint]');
    var t = btn.firstElementChild, was = t.textContent;
    function flash(s) { btn.classList.add('is-done'); t.textContent = s; setTimeout(function () { btn.classList.remove('is-done'); t.textContent = was; }, 2200); }
    btn.addEventListener('click', function () {
      var qs = $$('input:checked', box).map(function (i, k) { return (k + 1) + '. ' + i.value; });
      if (!qs.length) { hint.textContent = 'Tick at least one question first.'; return; }
      var text = 'Questions for 14446 (free, any hour, press 1)\n\n' + qs.join('\n');
      if (navigator.share && matchMedia('(pointer: coarse)').matches) {
        navigator.share({ title: 'Questions for 14446', text: text }).then(function () { flash('Saved'); }, function () {});
        return;
      }
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([text.replace(/\n/g, '\r\n')], { type: 'text/plain' }));
      a.download = 'questions-for-14446.txt';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
      flash('Saved');
      hint.textContent = 'Saved as questions-for-14446.txt. Keep it open when you call.';
    });
  });

  /* ── chips that show one of several things (how to quit) ──
     [data-filter-chips] buttons with data-f; the next [data-filter-items]
     holds children with data-fi. "all" shows everything. */
  $$('[data-filter-chips]').forEach(function (bar) {
    var items = bar.nextElementSibling;
    if (!items || !items.hasAttribute('data-filter-items')) return;
    items.classList.add('is-js');
    var chips = $$('[data-f]', bar);
    function pick(f) {
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-f') === f)); });
      $$('[data-fi]', items).forEach(function (it) {
        it.hidden = !(f === 'all' || it.getAttribute('data-fi') === f);
        if (!it.hidden) it.classList.add('in');
      });
    }
    chips.forEach(function (c) { c.addEventListener('click', function () { pick(c.getAttribute('data-f')); }); });
    var start = items.getAttribute('data-filter-start');
    if (start) pick(start);
  });

  /* ── guess first, then the real figure (campaigns) ── */
  $$('[data-guess]').forEach(function (g) {
    var inp = g.querySelector('[data-guess-in]'), out = g.querySelector('[data-guess-out]'), res = g.querySelector('[data-guess-res]');
    var ans = +g.getAttribute('data-answer');
    var sec = g.closest('section');
    if (sec) sec.classList.add('has-guess');
    /* the guess is drawn on the chart itself, square by square, as the slider moves */
    var cells = $$('.waffle__grid span'), mine = document.querySelector('[data-waffle-mine]');
    function draw() {
      var v = +inp.value;
      out.textContent = v; var dial = g.querySelector('[data-guess-dial]'); if (dial) dial.style.setProperty('--v', v);
      cells.forEach(function (c, i) { c.classList.toggle('g', i < v); });
      if (mine) mine.textContent = v;
    }
    inp.addEventListener('input', draw); draw();
    g.querySelector('[data-guess-go]').addEventListener('click', function () {
      var v = +inp.value, d = Math.abs(v - ans);
      res.hidden = false;
      res.innerHTML = 'You said <b>' + v + '</b>. The real number is <b>' + ans + '</b>. ' +
        (d <= 5 ? 'Very close.' : v < ans ? 'More young people than you thought. You are far from the only one.' : 'Fewer than you guessed, but still nearly four in ten.');
      var waffle = document.querySelector('.waffle');
      if (waffle) waffle.classList.add('go');
      if (sec) sec.classList.add('guessed');
    });
  });

  /* ── find a source (sources page) ── */
  $$('[data-src-find]').forEach(function (inp) {
    var groups = document.querySelector('[data-src-groups]'), tally = document.querySelector('[data-src-count]');
    if (!groups) return;
    inp.addEventListener('input', function () {
      var q = inp.value.trim().toLowerCase(), shown = 0;
      $$('.grp', groups).forEach(function (grp) {
        var title = (grp.querySelector('.grp__h') || {}).textContent || '', any = false;
        $$('.row', grp).forEach(function (r) {
          var hit = !q || (title + ' ' + r.textContent).toLowerCase().indexOf(q) > -1;
          r.hidden = !hit; if (hit) { any = true; shown++; }
        });
        grp.hidden = !any;
        if (any) grp.classList.add('in');
      });
      tally.textContent = q ? shown + (shown === 1 ? ' source' : ' sources') : '';
    });
  });

  /* ── a lamp to say thank you (credits); remembered on this device ── */
  $$('[data-thanks]').forEach(function (b) {
    var t = b.querySelector('[data-thanks-t]'), lamp = b.querySelector('.lamp');
    function set(on) {
      b.setAttribute('aria-pressed', String(on)); lamp.classList.toggle('is-lit', on);
      t.textContent = on ? 'Lamp lit. Thank you, doctors.' : 'Light a lamp to say thank you';
    }
    var on = false;
    try { on = localStorage.getItem('abwh-thanks') === '1'; } catch (e) {}
    set(on);
    b.addEventListener('click', function () { on = !on; set(on); try { localStorage.setItem('abwh-thanks', on ? '1' : '0'); } catch (e) {} });
  });

  /* ── questions that open like a conversation, one at a time ── */
  $$('[data-ask]').forEach(function (box) {
    box.classList.add('is-js');
    var items = $$('.ask__item', box);
    items.forEach(function (it) {
      var b = it.querySelector('.ask__q');
      b.addEventListener('click', function () {
        var open = !it.classList.contains('is-open');
        items.forEach(function (x) { x.classList.remove('is-open'); x.querySelector('.ask__q').setAttribute('aria-expanded', 'false'); });
        it.classList.toggle('is-open', open);
        b.setAttribute('aria-expanded', String(open));
      });
    });
  });
})();
