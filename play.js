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

  /* ── the deck: say what tonight is, then one card at a time ──
     [data-deck] holds buttons with data-path and .card elements with
     data-in="path path". The cards that belong to the chosen path become
     the deck; .card--end (if there is one) closes it. */
  $$('[data-deck]').forEach(function (box) {
    var deck = box.querySelector('.deck');
    var stack = deck.querySelector('.deck__stack');
    var cards = $$('.card[data-in]', deck);
    var end = deck.querySelector('.card--end');
    var lamps = deck.querySelector('.lamps');
    var prev = deck.querySelector('[data-prev]');
    var next = deck.querySelector('[data-next]');
    var tally = deck.querySelector('.deck__count');
    var live = deck.querySelector('[data-live]');
    var ends = {};
    try { ends = JSON.parse(box.querySelector('[data-ends]').textContent); } catch (e) {}
    var list = [], i = 0, path = null;
    deck.classList.add('is-js');

    function choose(p, btn) {
      path = p;
      list = cards.filter(function (c) { return (' ' + c.getAttribute('data-in') + ' ').indexOf(' ' + p + ' ') > -1; });
      var e = ends[p];
      if (e && end) {
        end.querySelector('.card__t').textContent = e.t;
        var a = end.querySelector('.card__act');
        a.href = e.href; a.querySelector('span').textContent = e.l;
        list.push(end);
      }
      $$('[data-path]', box).forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      deck.classList.add('has-path');
      deck.classList.toggle('is-one', list.length === 1);
      deck.setAttribute('data-path', p);
      var n = list.length - (e && end ? 1 : 0);
      lamps.innerHTML = '';
      for (var k = 0; k < n; k++) { var li = document.createElement('li'); li.className = 'lamp'; li.innerHTML = LAMP; lamps.appendChild(li); }
      cards.concat(end ? [end] : []).forEach(function (c) { c.className = c.className.replace(/\s?is-(cur|n1|n2|past)/g, ''); });
      i = 0;
      show(true);
      if (phone.matches) setTimeout(function () { glide(deck, 76); }, 60);
    }

    function show(fresh) {
      list.forEach(function (c, k) {
        c.classList.toggle('is-cur', k === i);
        c.classList.toggle('is-n1', k === i + 1);
        c.classList.toggle('is-n2', k === i + 2);
        c.classList.toggle('is-past', k < i);
        c.setAttribute('aria-hidden', String(k !== i));
        c.style.transform = '';
      });
      var cur = list[i];
      draw(cur.querySelector('.gl'));
      $$('.lamp', lamps).forEach(function (l, k) {
        l.classList.toggle('is-lit', k < i || cur === end);
        l.classList.toggle('is-cur', k === i && cur !== end);
      });
      prev.disabled = i === 0;
      var last = i === list.length - 1;
      next.disabled = last;
      next.querySelector('span').textContent = list[i + 1] === end ? 'Finish' : 'Next';
      tally.textContent = cur === end ? 'Done' : (i + 1) + ' of ' + (list.length - (end && list.indexOf(end) > -1 ? 1 : 0));
      if (live && !fresh) live.textContent = cur.querySelector('.card__t').textContent;
    }
    function go(d) {
      var j = Math.max(0, Math.min(list.length - 1, i + d));
      if (j === i) return;
      i = j; show();
    }

    $$('[data-path]', box).forEach(function (b) {
      b.addEventListener('click', function () { choose(b.getAttribute('data-path'), b); });
    });
    prev.addEventListener('click', function () { go(-1); });
    next.addEventListener('click', function () { go(1); });
    deck.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { go(1); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { go(-1); e.preventDefault(); }
    });
    $$('[data-again]', deck).forEach(function (b) {
      b.addEventListener('click', function () {
        deck.classList.remove('has-path', 'is-one');
        $$('[data-path]', box).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        cards.concat(end ? [end] : []).forEach(function (c) { c.className = c.className.replace(/\s?is-(cur|n1|n2|past)/g, ''); });
        glide(box, 90);
      });
    });

    /* a finger (or a mouse) can throw the card away, or pull the last one back */
    var x0 = null, dx = 0, el = null, drag = false;
    stack.addEventListener('pointerdown', function (e) {
      el = e.target.closest('.card.is-cur');
      if (!el || e.target.closest('a, button')) { el = null; return; }
      x0 = e.clientX; dx = 0; drag = false;
    });
    addEventListener('pointermove', function (e) {
      if (!el || x0 === null) return;
      dx = e.clientX - x0;
      if (!drag && Math.abs(dx) > 8) { drag = true; el.classList.add('is-drag'); }
      if (drag) el.style.transform = 'translateX(' + dx + 'px) rotate(' + dx / 22 + 'deg)';
    });
    function up() {
      if (!el) return;
      el.classList.remove('is-drag');
      var d = dx < -70 ? 1 : dx > 70 ? -1 : 0;
      el.style.transform = '';
      el = null; x0 = null;
      if (d) go(d);
    }
    addEventListener('pointerup', up);
    addEventListener('pointercancel', up);
  });

  /* ── the law check: four taps, a shield that lights, a plain verdict ──
     Each option carries data-v (ok, warn, no; kid or adult for the age
     question) and data-note, the sentence shown in the verdict. */
  $$('[data-check]').forEach(function (box) {
    var steps = $$('.chk__step', box);
    var dots = $$('.chk__dots li', box);
    var res = box.querySelector('.chk__res');
    var shield = document.querySelector('[data-shield]');
    var segs = shield ? $$('[data-seg]', shield) : [];
    var picks = [], i = 0;
    box.classList.add('is-js');
    function show() {
      steps.forEach(function (s, k) { s.classList.toggle('is-cur', k === i); });
      dots.forEach(function (d, k) {
        var p = picks[k];
        d.className = p ? (p.v === 'kid' || p.v === 'adult' ? 'is-done' : 'is-' + p.v) : '';
      });
      segs.forEach(function (s, k) { var p = picks[k]; s.setAttribute('class', 'shield__seg' + (p ? ' is-' + p.v : '')); });
    }
    function verdict() {
      steps.forEach(function (s) { s.classList.remove('is-cur'); });
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
      if (phone.matches) glide(box, 80);
    }
    $$('.chk__o', box).forEach(function (o) {
      o.addEventListener('click', function () {
        var k = steps.indexOf(o.closest('.chk__step'));
        picks[k] = { v: o.getAttribute('data-v'), note: o.getAttribute('data-note') };
        picks.length = k + 1;
        i = k + 1;
        show();
        if (i >= steps.length) verdict();
      });
    });
    box.querySelector('[data-redo]').addEventListener('click', function () {
      picks = []; i = 0; res.hidden = true;
      if (shield) shield.classList.remove('is-yes', 'is-nope');
      show();
    });
    show();
  });

  /* copy a piece of text, and say so on the button for a moment */
  function copy(text, btn) {
    var done = function () {
      var t = btn.firstElementChild || btn, was = t.textContent;
      btn.classList.add('is-done'); t.textContent = 'Copied';
      setTimeout(function () { btn.classList.remove('is-done'); t.textContent = was; }, 1800);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
    function fallback() {
      var ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) {}
      ta.remove();
    }
  }

  /* ── the place finder: age, then what feels possible ── */
  $$('[data-finder]').forEach(function (box) {
    var age = box.querySelector('[data-fd="age"]'), want = box.querySelector('[data-fd="want"]');
    var res = box.querySelector('.fd__res'), kid = false;
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
          if (on) { draw(p.querySelector('.gl')); count(p.querySelector('[data-count]')); }
        });
        box.querySelector('[data-kid]').hidden = !kid;
        if (phone.matches) glide(box, 80);
      });
    });
    box.querySelector('[data-fd-redo]').addEventListener('click', function () { res.hidden = true; step(age); });
    var dist = box.querySelector('[data-district]'), q = box.querySelector('[data-search-text]');
    var phrase = function () { return 'Nasha Mukt Bharat Abhiyaan' + (dist.value.trim() ? ' ' + dist.value.trim() : ''); };
    dist.addEventListener('input', function () { q.textContent = phrase(); });
    box.querySelector('[data-copy-search]').addEventListener('click', function (e) { copy(phrase(), e.currentTarget); });
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

  /* ── the call list: copy the ticked questions ── */
  $$('[data-calls]').forEach(function (box) {
    box.querySelector('[data-copy-calls]').addEventListener('click', function (e) {
      var qs = $$('input:checked', box).map(function (i, k) { return (k + 1) + '. ' + i.value; });
      copy('Questions for 14446\n' + (qs.length ? qs.join('\n') : '(none ticked)'), e.currentTarget);
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
    inp.addEventListener('input', function () { out.textContent = inp.value; });
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
