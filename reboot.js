/* reboot.js: the Reboot page (src/pages/reboot.astro). The log and the
   AI's commands live in reboot-store.js; this draws the page from them and
   keeps every part answering at once: the sunrise dial in the hero, the
   three setup steps, the day card and its live score, the numbers, the
   two-week chart, four weeks, what the log shows, the seals, the coach
   (through ai.js) and the log book. */
(function () {
  var box = document.querySelector('[data-reboot]');
  if (!box || !window.abwhReboot) return;
  var R = window.abwhReboot, AI = window.abwhAI;
  var $ = function (s) { return box.querySelector(s); };
  var $$ = function (s, el) { return [].slice.call((el || box).querySelectorAll(s)); };
  var SVG = 'http://www.w3.org/2000/svg';
  var d = R.load();
  if (!Array.isArray(d.seals)) d.seals = [];
  var today = R.day();
  var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var MOODS = ['', 'Stormy', 'Rainy', 'Cloudy', 'Clearing', 'Sunny'];
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── small helpers ── */
  function el(tag, attrs) { var e = document.createElementNS(SVG, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); return e; }
  function at(k) { return new Date(k + 'T12:00:00'); }
  function shift(k, n) { return R.day(at(k).getTime() + n * 864e5); }
  function label(k) { var t = at(k); return DAYS[t.getDay()] + ' ' + t.getDate() + ' ' + MONTHS[t.getMonth()]; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function fmt(n) { return n == null ? '–' : String(Math.round(n * 10) / 10); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function mix(a, b, t) {
    var p = function (h, i) { return parseInt(h.slice(1 + i * 2, 3 + i * 2), 16); };
    return '#' + [0, 1, 2].map(function (i) { return Math.round(p(a, i) + (p(b, i) - p(a, i)) * t).toString(16).padStart(2, '0'); }).join('');
  }
  function bump(e) { e.classList.remove('is-bump'); void e.offsetWidth; e.classList.add('is-bump'); }
  /* a number that counts to its new value instead of jumping */
  function countTo(e, v, suffix) {
    suffix = suffix || '';
    var tok = e._count = {}, end = v == null ? '–' : fmt(v) + suffix;
    clearTimeout(e._countT);
    var from = parseFloat(e.textContent);
    if (v == null || reduce || document.hidden || isNaN(from) || from === v) { e.textContent = end; return; }
    var t0 = performance.now(), dec = v % 1 !== 0;
    /* whatever happens to the frames, the final number always lands */
    e._countT = setTimeout(function () { if (e._count === tok) e.textContent = end; }, 760);
    (function step(t) {
      if (e._count !== tok) return;
      var k = Math.min(1, (t - t0) / 700), x = from + (v - from) * (1 - Math.pow(1 - k, 3));
      e.textContent = k < 1 ? (dec ? x.toFixed(1) : Math.round(x)) + suffix : end;
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }
  function glide(target, off) {
    var y = target.getBoundingClientRect().top + scrollY - (off == null ? 90 : off);
    if (window.abwhLenis) window.abwhLenis.scrollTo(y, { duration: 1.2 });
    else scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
  }
  var toastEl = $('[data-toast]'), toastT = 0;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('is-on'); }, 3400);
  }
  var tipEl = $('[data-tip]');
  function tip(target, html) {
    var r = target.getBoundingClientRect();
    tipEl.innerHTML = html; tipEl.hidden = false;
    var w = tipEl.offsetWidth / 2 + 8;
    tipEl.style.left = clamp(r.left + r.width / 2, w, innerWidth - w) + 'px';
    tipEl.style.top = Math.max(tipEl.offsetHeight + 16, r.top) + 'px';
  }
  function untip() { tipEl.hidden = true; }
  addEventListener('scroll', untip, { passive: true });

  /* radio groups: click, or arrow keys to move along them */
  function group(wrap, pick) {
    var btns = $$('[role="radio"]', wrap);
    function set(b, fire) {
      btns.forEach(function (o) { o.setAttribute('aria-checked', String(o === b)); o.tabIndex = o === b || (!b && o === btns[0]) ? 0 : -1; });
      if (b && fire) pick(b);
    }
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () { set(b, true); });
      b.addEventListener('keydown', function (e) {
        var n = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (!n) return;
        e.preventDefault();
        var t = btns[(i + n + btns.length) % btns.length]; t.focus(); set(t, true);
      });
    });
    set(null);
    return { set: function (fn) { set(btns.filter(fn)[0] || null, false); } };
  }

  /* ── the numbers everything reads ── */
  function withDraft() {
    if (!touched && !d.logs[cur]) return d;
    var logs = Object.assign({}, d.logs); logs[cur] = Object.assign({}, draft);
    return Object.assign({}, d, { logs: logs });
  }
  function bestStreak(logs) {
    var keys = Object.keys(logs).sort(), best = 0, run = 0, prev = null;
    keys.forEach(function (k) { run = prev && shift(prev, 1) === k ? run + 1 : 1; best = Math.max(best, run); prev = k; });
    return best;
  }
  function onTarget(x) { return x && x.amt <= d.goal; }

  /* ════════════════ the hero: words and the sunrise dial ════════════════ */
  var NIGHT = ['#0d1020', '#151a2c', '#25233a'], DAWN = ['#34426e', '#b8704f', '#f2b56b'];
  var dialSvg = $('[data-dial-svg]'), firstDial = true;
  (function stars() {
    var g = $('[data-dial-stars]');
    for (var i = 0; i < 40; i++) {
      var a = i * 2.39996, rr = 30 + (i * 37) % 110;
      var x = 220 + Math.cos(a) * rr, y = 200 + Math.sin(a) * rr * .8 - 30;
      if (y > 285) continue;
      g.appendChild(el('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: i % 6 ? 1 : 1.8 }));
    }
  })();
  function dial() {
    var data = withDraft(), s = R.stats(data, today), live = data !== d;
    var p = !d.base ? 0 : s.cut == null ? .05 : clamp(s.cut / 50, .05, 1);
    box.style.setProperty('--p', p.toFixed(3));
    box.style.setProperty('--h0', mix('#0b0d16', '#1b2036', p));
    box.style.setProperty('--h1', mix('#0f0e12', '#26191a', p));
    $$('[data-sky0], [data-sky1], [data-sky2]').forEach(function (st, i) { st.setAttribute('stop-color', mix(NIGHT[i], DAWN[i], p)); });
    $$('[data-dial-stars] circle').forEach(function (c) { c.style.opacity = String(Math.max(0, .85 - p * 1.25)); });
    $('[data-dial-sun]').style.setProperty('--sun-y', (-p * 190).toFixed(1) + 'px');
    var big = $('[data-dial-big]'), small = $('[data-dial-small]');
    var nb = s.cut == null ? '–' : Math.max(0, s.cut) + '%';
    if (big.textContent !== nb) { big.textContent = nb; var f = $('[data-dial]'); f.classList.remove('is-bump'); void f.offsetWidth; f.classList.add('is-bump'); }
    small.textContent = !d.base ? 'SET UP FIRST' : s.cut == null ? 'LOG A DAY' : live && !d.logs[cur] ? 'WITH TODAY' : 'BELOW USUAL';
    $('[data-dial-desc]').textContent = s.cut == null ? 'Your sunrise dial. Log a day to begin.' : 'This week is ' + Math.max(0, s.cut) + ' percent below your usual. The sun rises as it comes down.';

    /* the ring: one bar per day, longer for more */
    var bars = $('[data-dial-bars]'), labs = $('[data-dial-labels]');
    bars.innerHTML = ''; labs.innerHTML = '';
    var r0 = 160, L = 40;
    var top = Math.max(1, d.base * 1.25, d.goal || 0);
    s.last14.forEach(function (x) { if (x.log) top = Math.max(top, x.log.amt); });
    var len = function (v) { return clamp(v / top * L, 4, L); };
    s.last14.forEach(function (x, i) {
      var ang = (-90 + 360 / 28 + i * 360 / 14) * Math.PI / 180, cos = Math.cos(ang), sin = Math.sin(ang);
      var v = x.log ? x.log.amt : null, isToday = x.k === today;
      var draftDay = live && x.k === cur && !d.logs[cur];
      var g = el('g', { class: 'dial__g', tabindex: '0', role: 'button', 'data-k': x.k,
        'aria-label': label(x.k) + (x.log ? ', ' + v + ' ' + d.unit : ', not logged') });
      g.appendChild(el('line', { class: 'dial__hit', x1: 220 + cos * (r0 - 8), y1: 220 + sin * (r0 - 8), x2: 220 + cos * (r0 + L + 6), y2: 220 + sin * (r0 + L + 6) }));
      var e = v == null ? r0 + 1 : r0 + len(v);
      var cls = 'dial__bar ' + (v == null ? 'is-none' : onTarget(x.log) ? 'is-on' : 'is-over') + (isToday ? ' is-today' : '') + (draftDay ? ' is-draft' : '') + (x.k === cur && !$('[data-dash]').hidden ? ' is-hot' : '');
      var ln = el('line', { class: cls, x1: (220 + cos * r0).toFixed(1), y1: (220 + sin * r0).toFixed(1), x2: (220 + cos * e).toFixed(1), y2: (220 + sin * e).toFixed(1), pathLength: '100' });
      if (firstDial && !reduce) ln.style.animationDelay = (i * 45) + 'ms';
      g.appendChild(ln);
      bars.appendChild(g);
      var t = el('text', { class: 'dial__lab' + (isToday ? ' is-today' : ''), x: (220 + cos * 207).toFixed(1), y: (220 + sin * 207 + 3.5).toFixed(1), 'text-anchor': 'middle' });
      t.textContent = isToday ? 'NOW' : DAYS[at(x.k).getDay()].charAt(0);
      labs.appendChild(t);
    });
    $('[data-ring-target]').setAttribute('r', d.base ? (r0 + len(d.goal)).toFixed(1) : 0);
    $('[data-ring-usual]').setAttribute('r', d.base ? (r0 + len(d.base)).toFixed(1) : 0);
    if (firstDial) { dialSvg.classList.add('is-grow'); setTimeout(function () { dialSvg.classList.remove('is-grow'); }, 1600); firstDial = false; }
  }
  function dayTip(g, k) {
    var x = withDraft().logs[k];
    tip(g, '<b>' + label(k) + '</b>' + (x ? '<span>' + x.amt + ' ' + esc(d.unit) + (x.mood ? ' · ' + MOODS[x.mood] : '') + (x.crave ? ' · cravings ' + x.crave + '/10' : '') + '</span>' : '<span>Not logged · tap to fill in</span>'));
  }
  dialSvg.addEventListener('pointerover', function (e) { var g = e.target.closest && e.target.closest('.dial__g'); if (g) dayTip(g, g.getAttribute('data-k')); });
  dialSvg.addEventListener('pointerout', function (e) { if (!e.relatedTarget || !dialSvg.contains(e.relatedTarget)) untip(); });
  dialSvg.addEventListener('focusin', function (e) { var g = e.target.closest && e.target.closest('.dial__g'); if (g) dayTip(g, g.getAttribute('data-k')); });
  dialSvg.addEventListener('focusout', untip);
  function openFromDial(e) {
    var g = e.target.closest && e.target.closest('.dial__g'); if (!g || !d.base) return;
    if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault(); untip(); selectDay(g.getAttribute('data-k'), true);
  }
  dialSvg.addEventListener('click', openFromDial);
  dialSvg.addEventListener('keydown', openFromDial);

  function hero() {
    var s = R.stats(d, today), t = $('[data-hero-t]'), sub = $('[data-hero-s]'), k = $('[data-hero-k]'), go = $('[data-hero-go-t]');
    if (!d.base) {
      k.textContent = 'Reboot · private daily log';
      t.innerHTML = 'Cut down at <b>your own pace.</b>';
      sub.textContent = 'One minute a day. Log what you used and how it felt, and watch the sun rise as the numbers come down.';
      go.textContent = 'Start my log';
      return;
    }
    var n = Math.max(1, Math.round((at(today) - at(d.start || today)) / 864e5) + 1);
    k.textContent = 'Reboot · day ' + n + ' · private';
    if (!s.days) { t.innerHTML = 'Day one. <b>Light the first ray.</b>'; sub.textContent = 'Log today below and the first bar goes up on the dial.'; }
    else if (s.cut == null) { t.innerHTML = 'Welcome back. <b>Pick up where you left off.</b>'; sub.textContent = 'Nothing logged this week yet. One day is enough to start again.'; }
    else if (s.cut <= 0) { t.innerHTML = 'Still at your usual. <b>That’s okay.</b>'; sub.textContent = 'This week averages ' + s.weekAvg + ' ' + d.unit + ' a day. Small cuts count, and the coach can help you pick one.'; }
    else { t.innerHTML = '<b>' + s.cut + '%</b> below your usual.'; sub.textContent = 'This week averages ' + s.weekAvg + ' ' + d.unit + ' a day against your usual ' + d.base + '. The shorter the ring, the higher the sun.'; }
    go.textContent = d.logs[today] ? 'Today is logged · change it' : 'Log today';
  }
  $('[data-hero-go]').addEventListener('click', function (e) {
    e.preventDefault();
    if (!$('[data-dash]').hidden) { selectDay(today, true); } else glide($('[data-setup]'));
  });

  /* ════════════════ setup: three short steps ════════════════ */
  var setupEl = $('[data-setup]'), w = { what: '', unit: '', base: 4, plan: 'same' }, step = 1;
  var whatG = group($('[data-what-group]'), function (b) {
    w.what = b.getAttribute('data-what');
    w.unit = w.what === 'other' ? ($('[data-unit-in]').value.trim() || 'times') : b.getAttribute('data-unit');
    units(); syncWiz();
    if (step === 1) setTimeout(function () { if (step === 1 && w.what) show(2); }, 320);
  });
  var planG = group($('[data-plan-group]'), function (b) { w.plan = b.getAttribute('data-plan'); syncWiz(); });
  function planNum(k) {
    var b = w.base;
    return k === 'one' ? Math.max(0, b - 1) : k === 'quarter' ? Math.max(0, Math.round(b * .75 * 2) / 2) : b;
  }
  function units() {
    $$('[data-unit-w]').forEach(function (u) { u.textContent = w.unit || 'times'; });
    $('[data-unit-row]').hidden = w.what !== 'other';
    $('[data-safe]').hidden = !(w.what === 'alcohol' || w.what === 'pills');
  }
  function syncWiz() {
    $('[data-base-out]').textContent = w.base;
    $$('[data-base-q]').forEach(function (q) { q.classList.toggle('is-on', +q.getAttribute('data-base-q') === w.base); });
    ['same', 'one', 'quarter'].forEach(function (k) { var n = $('[data-plan-n="' + k + '"]'); n.textContent = planNum(k); n.setAttribute('data-u', w.unit || 'times'); });
    var name = w.what ? R.NAMES[w.what] : '';
    $('[data-wiz-sum]').textContent = step === 1 ? '' : step === 2 ? name + ' · usually ' + w.base + ' ' + w.unit + ' a day'
      : name + ' · usually ' + w.base + ' · first target ' + planNum(w.plan) + ' ' + w.unit;
    $('[data-wiz-next]').disabled = step === 1 && !w.what;
  }
  function show(n, back) {
    step = n;
    $$('[data-step]').forEach(function (f) {
      var on = +f.getAttribute('data-step') === n; f.hidden = !on;
      if (on) { f.classList.toggle('is-back', !!back); f.style.animation = 'none'; void f.offsetWidth; f.style.animation = ''; }
    });
    $('[data-wiz-n]').textContent = 'Step ' + n + ' of 3';
    $('[data-wiz-bar]').style.width = (n / 3 * 100) + '%';
    $('[data-wiz-back]').hidden = n === 1;
    $('[data-wiz-next-t]').textContent = n === 3 ? 'Light the first day' : 'Next';
    syncWiz();
    var first = $('[data-step="' + n + '"] [aria-checked="true"]') || $('[data-step="' + n + '"] button');
    if (first && document.activeElement && setupEl.contains(document.activeElement)) first.focus({ preventScroll: true });
  }
  function setBase(v) { w.base = clamp(Math.round(v), 1, 99); bump($('[data-base-out]')); syncWiz(); }
  $('[data-base-dn]').addEventListener('click', function () { setBase(w.base - 1); });
  $('[data-base-up]').addEventListener('click', function () { setBase(w.base + 1); });
  $$('[data-base-q]').forEach(function (q) { q.addEventListener('click', function () { setBase(+q.getAttribute('data-base-q')); }); });
  $('[data-unit-in]').addEventListener('input', function () {
    w.unit = this.value.trim() || 'times';
    $$('[data-unit-w]').forEach(function (u) { u.textContent = w.unit; });
    syncWiz();
  });
  $('[data-wiz-back]').addEventListener('click', function () { show(Math.max(1, step - 1), true); });
  $('[data-wiz-next]').addEventListener('click', function () {
    if (step === 1 && !w.what) return;
    if (step < 3) { show(step + 1); return; }
    d.what = w.what; d.unit = (w.unit || R.UNITS[w.what]).slice(0, 16); d.base = w.base; d.goal = planNum(w.plan);
    if (!d.start) d.start = today;
    R.save(d);
    dash();
    toast('Your log is ready. Start with today.');
    setTimeout(function () { selectDay(today, true); }, 120);
  });
  setupEl.addEventListener('submit', function (e) { e.preventDefault(); });
  setupEl.addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target.tagName === 'INPUT') { e.preventDefault(); $('[data-wiz-next]').click(); } });
  function setup() {
    setupEl.hidden = false; $('[data-dash]').hidden = true;
    w = { what: d.what || '', unit: d.unit || '', base: d.base || 4, plan: 'same' };
    if (d.what === 'other') $('[data-unit-in]').value = d.unit || 'times';
    whatG.set(function (b) { return b.getAttribute('data-what') === w.what; });
    planG.set(function (b) { return b.getAttribute('data-plan') === 'same'; });
    units(); show(1);
    hero(); dial();
  }

  /* ════════════════ one day: the card ════════════════ */
  var cur = today, touched = false, draft = { amt: 0, mood: 0, feel: '', crave: 0, why: [] };
  var range = $('[data-amt]'), out = $('[data-amt-out]'), crave = $('[data-crave]');
  var moodG = group($('[data-mood-group]'), function (b) { draft.mood = +b.getAttribute('data-mood'); changed(); });
  var feelG = group($('[data-feel-group]'), function (b) { draft.feel = b.getAttribute('data-feel'); changed(); });
  var pos = function (f) { return 'calc(.55rem + (100% - 1.1rem) * ' + f.toFixed(4) + ')'; };
  function track() {
    var max = Math.max(6, Math.ceil(d.base * 1.6), draft.amt);
    range.max = String(max);
    var z = $('[data-amt-zones]');
    var g = clamp(d.goal / max, 0, 1), u = clamp(d.base / max, 0, 1);
    z.innerHTML = '<i style="left:0;width:' + pos(g) + ';background:rgba(159,211,168,.18)"></i>' +
      '<i style="left:' + pos(g) + ';width:calc(' + pos(u) + ' - ' + pos(g) + ');background:rgba(226,189,124,.14)"></i>' +
      '<i style="left:' + pos(u) + ';right:0;background:rgba(240,164,147,.12)"></i>';
    var mt = $('[data-mk-t]'), mu = $('[data-mk-u]');
    mt.style.left = pos(g); mu.style.left = pos(u);
    mt.querySelector('b').textContent = 'target ' + d.goal; mu.querySelector('b').textContent = 'usual ' + d.base;
    mu.hidden = d.base === d.goal;
    mu.classList.toggle('is-near', Math.abs(u - g) < .16);
  }
  function amount() {
    var max = +range.max, f = $('[data-amt-fill]');
    range.value = String(draft.amt); out.textContent = draft.amt;
    f.style.width = pos(clamp(draft.amt / max, 0, 1));
    f.style.setProperty('--fc', draft.amt <= d.goal ? '#9fd3a8' : draft.amt < d.base ? '#e2bd7c' : '#f0a493');
    var e = $('[data-diff]'), dd = d.base - draft.amt, word = cur === today ? 'today' : 'that day';
    e.classList.toggle('is-up', dd < 0);
    e.innerHTML = draft.amt <= d.goal && d.goal < d.base ? '<b>On target</b> · ' + dd + ' less than your usual ' + d.base + '.'
      : dd > 0 ? '<b>' + dd + ' less</b> than your usual ' + d.base + '. That counts.'
      : dd === 0 ? 'The same as your usual ' + d.base + '. Logging it still counts.'
      : '<b>' + (-dd) + ' more</b> than usual. One day is one day; ' + word + ' still counts.';
  }
  function setAmt(v) {
    draft.amt = clamp(Math.round(v), 0, 999);
    if (draft.amt > +range.max) track();
    amount(); bump(out); changed();
  }
  range.addEventListener('input', function () { draft.amt = +range.value; amount(); bump(out); changed(); });
  $('[data-amt-dn]').addEventListener('click', function () { setAmt(draft.amt - 1); });
  $('[data-amt-up]').addEventListener('click', function () { setAmt(draft.amt + 1); });
  function craveUI() {
    var v = draft.crave;
    crave.value = String(v); crave.style.setProperty('--c', (v * 10) + '%');
    $('[data-crave-out]').textContent = v === 0 ? 'none' : v + ' · ' + (v <= 3 ? 'mild' : v <= 6 ? 'moderate' : v <= 8 ? 'strong' : 'very strong');
  }
  crave.addEventListener('input', function () { draft.crave = +crave.value; craveUI(); changed(); });
  $$('[data-why]').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = b.getAttribute('data-why'), none = 'Nothing in particular', on = draft.why.indexOf(t) < 0;
      if (on) { draft.why = t === none ? [none] : draft.why.filter(function (x) { return x !== none; }).concat(t); }
      else draft.why = draft.why.filter(function (x) { return x !== t; });
      whys(); changed();
    });
  });
  function whys() { $$('[data-why]').forEach(function (b) { b.setAttribute('aria-pressed', String(draft.why.indexOf(b.getAttribute('data-why')) > -1)); }); }

  function selectDay(k, scroll) {
    if (k > today) k = today;
    if (k < shift(today, -27)) k = shift(today, -27);
    cur = k; touched = false;
    var x = d.logs[k];
    draft = x ? { amt: x.amt, mood: x.mood || 0, feel: x.feel || '', crave: x.crave || 0, why: (x.why || []).slice() }
      : { amt: d.goal != null ? d.goal : d.base, mood: 0, feel: '', crave: 0, why: [] };
    $('[data-day]').textContent = k === today ? 'Today, ' + label(k) : k === shift(today, -1) ? 'Yesterday, ' + label(k) : label(k);
    var st = $('[data-day-state]');
    st.textContent = x ? 'Logged' : 'Not logged yet'; st.classList.toggle('is-done', !!x);
    $('[data-day-prev]').disabled = k <= shift(today, -27);
    $('[data-day-next]').disabled = k >= today;
    $('[data-save-t]').textContent = x ? 'Update this day' : k === today ? 'Log today' : 'Log ' + label(k);
    track(); amount(); craveUI(); whys();
    moodG.set(function (b) { return +b.getAttribute('data-mood') === draft.mood; });
    feelG.set(function (b) { return b.getAttribute('data-feel') === draft.feel; });
    light(); dial(); chart(); cal();
    if (scroll) {
      var card = $('[data-today]');
      glide(card, 80);
      card.classList.remove('is-flash'); void card.offsetWidth; card.classList.add('is-flash');
    }
  }
  $('[data-day-prev]').addEventListener('click', function () { selectDay(shift(cur, -1)); });
  $('[data-day-next]').addEventListener('click', function () { selectDay(shift(cur, 1)); });
  function changed() { touched = true; light(); dial(); chartSoon(); }

  /* today's light: amount 60, the weather inside 25, the day before 15 */
  (function ticks() {
    var g = $('[data-gauge-ticks]');
    for (var i = 0; i <= 10; i++) {
      var a = Math.PI - i * Math.PI / 10;
      g.appendChild(el('line', { x1: (120 + Math.cos(a) * 80).toFixed(1), y1: (126 - Math.sin(a) * 80).toFixed(1), x2: (120 + Math.cos(a) * (i % 5 ? 75 : 70)).toFixed(1), y2: (126 - Math.sin(a) * (i % 5 ? 75 : 70)).toFixed(1) }));
    }
  })();
  function score(x) {
    var a;
    if (x.amt <= d.goal) a = 60;
    else if (d.base > d.goal && x.amt < d.base) a = 20 + 40 * (d.base - x.amt) / (d.base - d.goal);
    else a = Math.max(0, 20 - (x.amt - d.base) / Math.max(1, d.base) * 20);
    var m = x.mood ? (x.mood - 1) / 4 * 25 : 0;
    var f = { better: 15, same: 9, worse: 3 }[x.feel] || 0;
    return { a: a, m: m, f: f, total: Math.round(a + m + f) };
  }
  function light() {
    var sc = score(draft), n = sc.total;
    $('[data-gauge-arc]').style.strokeDasharray = n + ' 100';
    $('[data-gauge-needle]').style.setProperty('--a', (-90 + n * 1.8) + 'deg');
    countTo($('[data-gauge-n]'), n);
    $('[data-part-a]').style.setProperty('--w', (sc.a / 60 * 100) + '%');
    $('[data-part-m]').style.setProperty('--w', (sc.m / 25 * 100) + '%');
    $('[data-part-f]').style.setProperty('--w', (sc.f / 15 * 100) + '%');
    var word = $('[data-light-word]'), msg = $('[data-light-msg]');
    if (!draft.mood || !draft.feel) { word.textContent = 'Almost there'; msg.textContent = 'Add the weather inside and the day before to finish ' + (cur === today ? 'today’s' : 'this day’s') + ' light.'; }
    else if (n >= 85) { word.textContent = 'Bright day'; msg.textContent = 'On target and feeling it. Days like this add up.'; }
    else if (n >= 65) { word.textContent = 'Good light'; msg.textContent = 'A good day. Logging it honestly is how the pattern changes.'; }
    else if (n >= 45) { word.textContent = 'Some light'; msg.textContent = 'Not perfect, and that’s fine. You still showed up and logged it.'; }
    else { word.textContent = 'A cloudy one'; msg.textContent = 'A hard day. One day is one day; tomorrow is a new bar on the dial.'; }
  }

  /* saving: a burst of light on the button */
  function burst() {
    if (reduce) return;
    var b = $('[data-burst]'); b.innerHTML = '';
    for (var i = 0; i < 18; i++) {
      var s = document.createElement('i'), a = Math.random() * Math.PI * 2, r = 30 + Math.random() * 60;
      s.style.setProperty('--x', (10 + Math.random() * 80) + '%');
      s.style.setProperty('--dx', (Math.cos(a) * r).toFixed(0) + 'px');
      s.style.setProperty('--dy', (Math.sin(a) * r * .6).toFixed(0) + 'px');
      s.style.setProperty('--dl', (Math.random() * 120).toFixed(0) + 'ms');
      b.appendChild(s);
    }
    var btn = $('[data-save]'); btn.classList.remove('is-saved'); void btn.offsetWidth; btn.classList.add('is-saved');
  }
  $('[data-save]').addEventListener('click', function () {
    if (!draft.mood) { toast('Pick the weather inside first.'); $('[data-mood-group]').querySelector('button').focus(); return; }
    if (!draft.feel) { toast('Better, same or worse than the day before?'); $('[data-feel-group]').querySelector('button').focus(); return; }
    var was = !!d.logs[cur];
    d.logs[cur] = { amt: draft.amt, mood: draft.mood, feel: draft.feel, crave: draft.crave, why: draft.why.slice() };
    R.save(d);
    burst();
    var s = R.stats(d);
    var msg = was ? 'Updated.' : draft.amt <= d.goal ? 'On target. The sun is a little higher.' : 'Logged. Tomorrow is a new bar on the dial.';
    if (!was && cur === today && s.streak > 1) msg += ' ' + s.streak + ' days in a row.';
    toast(msg);
    var k = cur;
    draw(true);
    selectDay(k);
  });

  /* ════════════════ the dashboard ════════════════ */
  function dash() {
    setupEl.hidden = true; $('[data-dash]').hidden = false;
    $$('[data-dash] [data-unit]').forEach(function (u) { u.textContent = d.unit; });
    draw(false);
    selectDay(cur > today ? today : cur);
  }
  function draw(fresh) {
    var s = R.stats(d, today);
    $('[data-target]').textContent = d.goal + ' ' + d.unit;
    countTo($('[data-avg]'), s.weekAvg);
    $('[data-avg-s]').textContent = d.unit + ' a day this week';
    countTo($('[data-cut]'), s.cut == null ? null : Math.max(0, s.cut), '%');
    countTo($('[data-streak]'), s.streak);
    var logged = s.last7.filter(function (x) { return x.log; });
    $('[data-ontgt]').textContent = logged.length ? logged.filter(function (x) { return onTarget(x.log); }).length + '/' + logged.length : '–';
    hero(); dial(); chart(); cal(); insights(); seals(fresh); plan(fresh); book();
  }

  /* two weeks, three ways */
  var view = 'amt', chartT = 0;
  var chartEl = $('[data-chart]');
  $$('[data-view]').forEach(function (b) {
    b.addEventListener('click', function () {
      view = b.getAttribute('data-view');
      $$('[data-view]').forEach(function (o) { o.setAttribute('aria-selected', String(o === b)); });
      chart();
    });
  });
  function chartSoon() { clearTimeout(chartT); chartT = setTimeout(chart, 60); }
  function chart() {
    if ($('[data-dash]').hidden) return;
    var data = withDraft(), s = R.stats(data, today), live = data !== d;
    var W = chartEl.clientWidth || 600, H = chartEl.clientHeight || 240, pl = 30, pr = view === 'amt' ? 60 : 8, pt = 22, pb = 26;
    chartEl.setAttribute('viewBox', '0 0 ' + W + ' ' + H); chartEl.innerHTML = '';
    var cw = (W - pl - pr) / 14, bw = Math.min(30, cw * .62);
    var max = view === 'amt' ? Math.max(1, d.base * 1.25, d.goal) : view === 'mood' ? 5 : 10;
    if (view === 'amt') s.last14.forEach(function (x) { if (x.log) max = Math.max(max, x.log.amt); });
    var y = function (v) { return pt + (H - pt - pb) * (1 - v / max); };
    var grid = view === 'amt' ? [0, Math.round(max / 2), Math.round(max)] : view === 'mood' ? [1, 3, 5] : [0, 5, 10];
    grid.forEach(function (g) {
      chartEl.appendChild(el('line', { class: 'gl-line', x1: pl, x2: W - pr, y1: y(g).toFixed(1), y2: y(g).toFixed(1) }));
      var t = el('text', { class: 'ax', x: pl - 8, y: (y(g) + 3.5).toFixed(1), 'text-anchor': 'end' });
      t.textContent = view === 'mood' ? ['', 'storm', '', 'cloud', '', 'sun'][g] : g; chartEl.appendChild(t);
    });
    var pts = [];
    s.last14.forEach(function (x, i) {
      var cx = pl + cw * i + cw / 2, v = !x.log ? null : view === 'amt' ? x.log.amt : view === 'mood' ? x.log.mood : (x.log.crave || 0);
      var isDraft = live && x.k === cur && !d.logs[cur];
      if (view === 'mood') {
        if (v) pts.push([cx, y(v), x]);
        else chartEl.appendChild(el('rect', { class: 'cb is-none', x: (cx - bw / 2).toFixed(1), y: (H - pb - 4).toFixed(1), width: bw.toFixed(1), height: 4, rx: 2, 'data-k': x.k }));
      } else {
        var h = v == null ? 4 : Math.max(4, (H - pt - pb) * v / max);
        var cls = 'cb ' + (v == null ? 'is-none' : view === 'crave' ? 'is-crave' : onTarget(x.log) ? 'is-on' : 'is-over') + (isDraft ? ' is-draft' : '') + (x.k === cur ? ' is-hot' : '');
        chartEl.appendChild(el('rect', { class: cls, x: (cx - bw / 2).toFixed(1), y: (H - pb - h).toFixed(1), width: bw.toFixed(1), height: h.toFixed(1), rx: Math.min(6, bw / 3), 'data-k': x.k, tabindex: '0' }));
        if (v != null && bw > 14) { var vt = el('text', { class: 'val', x: cx.toFixed(1), y: (H - pb - h - 6).toFixed(1), 'text-anchor': 'middle' }); vt.textContent = v; chartEl.appendChild(vt); }
      }
      var t = el('text', { class: 'ax' + (x.k === today ? ' is-today' : ''), x: cx.toFixed(1), y: H - 8, 'text-anchor': 'middle' });
      t.textContent = at(x.k).getDate(); chartEl.appendChild(t);
    });
    if (view === 'mood' && pts.length) {
      chartEl.appendChild(el('polyline', { class: 'ml', points: pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ') }));
      pts.forEach(function (p) { chartEl.appendChild(el('circle', { class: 'md cb', cx: p[0].toFixed(1), cy: p[1].toFixed(1), r: 6, 'data-k': p[2].k, tabindex: '0' })); });
    }
    if (view === 'amt') {
      [[d.base, 'ul', 'usual'], [d.goal, 'tl', 'target']].forEach(function (m) {
        if (m[1] === 'ul' && d.base === d.goal) return;
        chartEl.appendChild(el('line', { class: m[1], x1: pl, x2: W - 4, y1: y(m[0]).toFixed(1), y2: y(m[0]).toFixed(1) }));
        /* named in the right-hand margin, clear of the bars */
        var near = m[1] === 'ul' && Math.abs(y(d.base) - y(d.goal)) < 14;
        var t = el('text', { class: 'ax', x: W - 4, y: (y(m[0]) + (near ? 13 : -5)).toFixed(1), 'text-anchor': 'end' });
        t.textContent = m[2] + ' ' + m[0]; if (m[1] === 'tl') t.style.fill = '#9fd3a8'; chartEl.appendChild(t);
      });
    }
    $('[data-chart-key]').innerHTML = view === 'amt'
      ? '<span><i style="background:#e2bd7c"></i>on target</span><span><i style="background:#f0a493"></i>above target</span><span><i style="background:none;border-top:2px dashed #9fd3a8;border-radius:0;height:0;vertical-align:3px"></i>your target</span>'
      : view === 'mood' ? '<span><i style="background:#8fb4d9;border-radius:50%"></i>the weather inside, stormy to sunny</span>'
      : '<span><i style="background:#e07a64"></i>how strong cravings were, 0 to 10</span>';
  }
  function chartTip(e) {
    var t = e.target; if (!t.getAttribute || !t.getAttribute('data-k')) return;
    var k = t.getAttribute('data-k'), x = withDraft().logs[k];
    tip(t, '<b>' + label(k) + '</b>' + (x ? '<span>' + x.amt + ' ' + esc(d.unit) + ' · ' + (MOODS[x.mood] || '–') + ' · cravings ' + (x.crave || 0) + '/10' + (x.why && x.why.length ? '<br>' + esc(x.why.join(', ')) : '') + '</span>' : '<span>Not logged · tap to fill in</span>'));
  }
  chartEl.addEventListener('pointerover', chartTip);
  chartEl.addEventListener('focusin', chartTip);
  chartEl.addEventListener('pointerout', untip);
  chartEl.addEventListener('focusout', untip);
  chartEl.addEventListener('click', function (e) { var k = e.target.getAttribute && e.target.getAttribute('data-k'); if (k) { untip(); selectDay(k, true); } });
  chartEl.addEventListener('keydown', function (e) { var k = e.target.getAttribute && e.target.getAttribute('data-k'); if (k && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); selectDay(k, true); } });

  /* four weeks, Monday first; tap any day to open it */
  function cal() {
    if ($('[data-dash]').hidden) return;
    var g = $('[data-cal]'); g.innerHTML = '';
    var dow = (at(today).getDay() + 6) % 7, start = shift(today, -dow - 21);
    for (var i = 0; i < 28; i++) {
      var k = shift(start, i), x = d.logs[k], b = document.createElement('button');
      b.type = 'button'; b.className = 'cal__c' + (x ? (onTarget(x) ? ' is-on' : ' is-over') : '') + (k === today ? ' is-today' : '') + (k === cur ? ' is-sel' : '');
      b.style.setProperty('--i', i);
      b.textContent = at(k).getDate();
      b.disabled = k > today;
      b.setAttribute('aria-label', label(k) + (x ? ', ' + x.amt + ' ' + d.unit + (onTarget(x) ? ', on target' : ', above target') : k > today ? '' : ', not logged'));
      b.setAttribute('data-k', k);
      g.appendChild(b);
    }
  }
  $('[data-cal]').addEventListener('click', function (e) { var b = e.target.closest('.cal__c'); if (b && !b.disabled) selectDay(b.getAttribute('data-k'), true); });

  /* what the log shows, in plain sentences */
  function insights() {
    var ul = $('[data-insights]'), out = [], u = esc(d.unit);
    var last = function (from, n) { var a = []; for (var i = from; i < from + n; i++) { var k = shift(today, -i); if (d.logs[k]) a.push({ k: k, log: d.logs[k] }); } return a; };
    var avg = function (a) { return a.length ? a.reduce(function (s, x) { return s + x.log.amt; }, 0) / a.length : null; };
    var w1 = last(0, 7), w2 = last(7, 7), f14 = last(0, 14), m28 = last(0, 28);
    var a1 = avg(w1), a2 = avg(w2);
    if (a1 != null && a2 != null) {
      var dd = Math.round((a2 - a1) * 10) / 10;
      out.push(['↘', 'This week averages <b>' + fmt(a1) + '</b> ' + u + ' a day, ' + (dd > 0 ? '<b>down ' + dd + '</b> from' : dd < 0 ? 'up ' + (-dd) + ' from' : 'the same as') + ' the week before.']);
    } else if (a1 != null) out.push(['↘', 'This week averages <b>' + fmt(a1) + '</b> ' + u + ' a day, against your usual ' + d.base + '.']);
    if (w1.length) {
      var on = w1.filter(function (x) { return onTarget(x.log); }).length;
      out.push(['◎', '<b>' + on + ' of ' + w1.length + '</b> days you logged this week were at or under your target of ' + d.goal + '.']);
    }
    var aw = m28.filter(function (x) { return x.log.crave >= 6 && onTarget(x.log); }).length;
    if (aw) out.push(['∿', '<b>' + aw + (aw === 1 ? ' time' : ' times') + '</b> you had strong cravings and still stayed on target. That is the skill that matters most.']);
    var hi = m28.filter(function (x) { return x.log.mood >= 4; }), lo = m28.filter(function (x) { return x.log.mood && x.log.mood <= 2; });
    if (hi.length && lo.length) {
      var gap = Math.round((avg(lo) - avg(hi)) * 10) / 10;
      if (gap >= .5) out.push(['☀', 'On clearer days you used <b>' + gap + ' less</b> on average than on stormy or rainy ones.']);
    }
    var tally = {};
    m28.forEach(function (x) { (x.log.why || []).forEach(function (t) { if (t !== 'Nothing in particular') tally[t] = (tally[t] || 0) + 1; }); });
    var top = Object.keys(tally).sort(function (a, b) { return tally[b] - tally[a]; })[0];
    if (top && tally[top] >= 2) out.push(['⚡', 'What made it harder most often: <b>' + esc(top.toLowerCase()) + '</b> (' + tally[top] + ' days). Ask your coach to plan for it.']);
    if (f14.length >= 3) {
      var best = f14.slice().sort(function (a, b) { return a.log.amt - b.log.amt; })[0];
      out.push(['★', 'Your lowest day in two weeks: <b>' + label(best.k) + '</b>, with ' + best.log.amt + ' ' + u + '.']);
    }
    var st = R.stats(d).streak;
    if (st >= 2) out.push(['✦', 'You have logged <b>' + st + ' days</b> in a row.']);
    ul.innerHTML = '';
    (out.length ? out.slice(0, 4) : [['·', 'Log a few days and patterns will start to show up here.']]).forEach(function (o, i) {
      var li = document.createElement('li'); li.style.setProperty('--i', i);
      li.innerHTML = '<span class="ins__ic" aria-hidden="true">' + o[0] + '</span><span>' + o[1] + '</span>';
      ul.appendChild(li);
    });
  }

  /* seals: worked out from the log, never handed out */
  function seals(fresh) {
    var logs = d.logs, all = Object.keys(logs).map(function (k) { return logs[k]; });
    var best = bestStreak(logs);
    var bestCut = 0;
    Object.keys(logs).forEach(function (k) {
      var a = []; for (var i = 0; i < 7; i++) { var x = logs[shift(k, -i)]; if (x) a.push(x.amt); }
      if (a.length >= 3 && d.base) bestCut = Math.max(bestCut, Math.round((1 - a.reduce(function (s, v) { return s + v; }, 0) / a.length / d.base) * 100));
    });
    var count = function (fn) { return all.filter(fn).length; };
    var P = {
      first: [all.length, 1], three: [best, 3], week: [best, 7],
      target: [count(onTarget), 1], steady: [count(onTarget), 5],
      clear: [count(function (x) { return x.mood >= 4; }), 5],
      wave: [count(function (x) { return x.crave >= 6 && onTarget(x); }), 3],
      quarter: [bestCut, 25, '%'], half: [bestCut, 50, '%'],
    };
    var won = 0, fresh1 = [];
    $$('[data-seal]').forEach(function (li) {
      var k = li.getAttribute('data-seal'), p = P[k], have = Math.max(0, Math.min(p[0], p[1])), ok = p[0] >= p[1];
      li.classList.toggle('is-won', ok);
      li.querySelector('[data-seal-bar]').style.setProperty('--w', (have / p[1] * 100) + '%');
      li.querySelector('[data-seal-p]').textContent = ok ? 'Earned' : p[2] ? 'Best week ' + Math.max(0, p[0]) + '% of ' + p[1] + '%' : have + ' of ' + p[1];
      if (ok) { won++; if (d.seals.indexOf(k) < 0) { d.seals.push(k); if (fresh) { fresh1.push(li); } } }
    });
    $('[data-seal-n]').textContent = won;
    if (fresh1.length) {
      R.save(d);
      fresh1.forEach(function (li) { li.classList.remove('is-new'); void li.offsetWidth; li.classList.add('is-new'); });
      setTimeout(function () { toast('New seal: ' + fresh1.map(function (li) { return li.querySelector('.seal__t').textContent; }).join(', ') + '.'); }, 1200);
    } else if (!fresh && won) R.save(d);
  }

  /* the coach's plan */
  function plan(fresh) {
    $('[data-focus-box]').hidden = !d.focus;
    $('[data-focus]').textContent = d.focus;
    var st = $('[data-steps]'); st.innerHTML = '';
    d.steps.forEach(function (x, k) {
      var li = document.createElement('li');
      li.innerHTML = '<label><input type="checkbox"><span></span></label>';
      li.querySelector('span').textContent = x.t;
      var c = li.querySelector('input'); c.checked = !!x.done;
      c.addEventListener('change', function () { d.steps[k].done = c.checked; R.save(d); if (c.checked) toast('Step done.'); });
      st.appendChild(li);
    });
    var tp = $('[data-tips]'); tp.innerHTML = '';
    d.tips.forEach(function (x) { var li = document.createElement('li'); li.textContent = x; tp.appendChild(li); });
    var bd = $('[data-badges]'); bd.innerHTML = '';
    d.badges.forEach(function (x, k) {
      var li = document.createElement('li');
      if (fresh && k === d.badges.length - 1 && x.d === today) li.className = 'is-new';
      li.title = x.why || ''; li.textContent = x.t;
      bd.appendChild(li);
    });
    $('[data-plan-empty]').hidden = !!(d.focus || d.steps.length || d.tips.length || d.badges.length);
    $('[data-sos]').hidden = !d.sos;
  }

  /* the log book, newest first */
  var ICON_EDIT = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>';
  var ICON_DEL = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  function book() {
    var tb = $('[data-book]'), keys = Object.keys(d.logs).sort().reverse();
    $('[data-book-n]').textContent = keys.length ? keys.length + (keys.length === 1 ? ' entry' : ' entries') + ' · saved on this device' : 'No entries yet';
    tb.innerHTML = '';
    if (!keys.length) { tb.innerHTML = '<tr class="book__empty"><td colspan="6">Your entries will appear here.</td></tr>'; return; }
    keys.slice(0, 90).forEach(function (k) {
      var x = d.logs[k], tr = document.createElement('tr');
      tr.innerHTML = '<td>' + label(k) + '</td>' +
        '<td><span class="book__pill ' + (onTarget(x) ? 'is-on' : 'is-over') + '">' + x.amt + ' ' + esc(d.unit) + '</span></td>' +
        '<td>' + (MOODS[x.mood] || '–') + '</td>' +
        '<td>' + (x.crave != null ? x.crave + '/10' : '–') + '</td>' +
        '<td class="book__why">' + (x.why && x.why.length ? esc(x.why.join(', ')) : '–') + '</td>' +
        '<td><div class="book__acts"><button type="button" class="book__b" data-edit="' + k + '" aria-label="Change ' + label(k) + '">' + ICON_EDIT + '</button>' +
        '<button type="button" class="book__b book__b--del" data-del="' + k + '" aria-label="Delete ' + label(k) + '">' + ICON_DEL + '</button></div></td>';
      tb.appendChild(tr);
    });
  }
  $('[data-book]').addEventListener('click', function (e) {
    var ed = e.target.closest('[data-edit]'), dl = e.target.closest('[data-del]');
    if (ed) selectDay(ed.getAttribute('data-edit'), true);
    if (dl) {
      var k = dl.getAttribute('data-del');
      if (!confirm('Delete the entry for ' + label(k) + '?')) return;
      delete d.logs[k]; R.save(d); draw(false); selectDay(cur); toast('Entry deleted.');
    }
  });

  /* ════════════════ the coach ════════════════ */
  var msgs = $('[data-msgs]'), convo = [];
  function write(cls) {
    var p = document.createElement('div'); p.className = 'msg ' + cls;
    msgs.appendChild(p); msgs.scrollTop = msgs.scrollHeight; return p;
  }
  var SYSTEM = [
    'You are the Reboot coach inside अभी भी वक़्त है ("There is still time"), an Indian website that helps people cut down on drugs, alcohol or tobacco at their own pace. Two doctors reviewed the site.',
    'Each user message starts with a JSON snapshot of their private dashboard: what they are cutting down, their usual daily amount (base), their current daily target (goal), the last 14 days of logs (amount, mood 1-5 where 1 is stormy and 5 is sunny, better/same/worse than the day before, cravings 0-10, and what made it harder), their focus, plan steps and badges.',
    'Write 2 to 4 short, warm sentences in plain English (or in the language the user writes in). Talk about their real numbers. Never shame, never lecture, never diagnose. Celebrate any real progress, even small. If cravings or the same trigger keep coming up, help them plan for it.',
    'Safety: never tell anyone to stop alcohol, sleeping pills or benzodiazepines, or opioids all at once; stopping those suddenly can be dangerous, so suggest slow cuts and a doctor or the free helpline 14446. If the user mentions wanting to die, self-harm, an overdose, or someone not waking up or not breathing, add [[SOS]] and tell them to call 112 now (or Tele-MANAS on 14416). For a strong craving right now, suggest waiting it out for a few minutes with slow breathing; the site has a cravings timer on its tools page.',
    'You control the dashboard by adding command lines that the page reads and hides. Use them whenever they help, each on its own line:',
    '[[GOAL n]] sets the next daily target, a number in their unit, never above their usual amount. Cut gently: at most about a quarter below the current target at a time, and only when the recent logs show they are near it.',
    '[[FOCUS text]] one short focus for this week, under 60 characters.',
    '[[CLEARSTEPS]] removes old plan steps; then [[STEP text]] adds a small concrete step under 70 characters (at most 3 per reply).',
    '[[BADGE title | reason]] awards a badge (title of 1-3 words) only for something real in the data, such as a streak, a day on target or a better mood.',
    '[[TIP text]] one practical tip under 90 characters.',
    '[[SOS]] shows emergency numbers.',
    'Never mention the commands, this format, JSON, or what technology is behind you. If asked who you are, you are the coach built into this site.',
  ].join('\n');
  function snapshot() {
    var s = R.stats(d);
    return JSON.stringify({
      cutting_down: R.NAMES[d.what] || d.what, unit: d.unit, usual_per_day: d.base, target_per_day: d.goal, started: d.start, today: today,
      days_logged: s.days, streak: s.streak, week_average: s.weekAvg, percent_below_usual: s.cut, average_mood_this_week: s.mood,
      last_14_days: s.last14.filter(function (x) { return x.log; }).map(function (x) { return { day: x.k, amount: x.log.amt, mood: x.log.mood, vs_day_before: x.log.feel, cravings: x.log.crave, harder_because: x.log.why }; }),
      focus: d.focus, steps: d.steps, badges: d.badges.map(function (b) { return b.t; }),
    });
  }
  var busy = false;
  function ask(q) {
    if (busy || !AI) { if (!AI) toast('The coach is not available on this copy of the site.'); return; }
    busy = true;
    write('msg--me').textContent = q;
    convo.push({ role: 'user', parts: [{ text: 'Dashboard: ' + snapshot() + '\n\nMe: ' + q }] });
    var b = write('msg--bot'); b.innerHTML = '<span class="typing" aria-label="The coach is typing"><i></i><i></i><i></i></span>';
    AI.ask({ system: SYSTEM, contents: convo.slice(-8), temperature: .7, maxTokens: 700,
      onText: function (t) { b.innerHTML = AI.md(AI.commands(t.replace(/\[\[[^\]]*$/, '')).text); msgs.scrollTop = msgs.scrollHeight; } })
      .then(function (reply) {
        var r = AI.commands(reply);
        b.innerHTML = AI.md(r.text || 'Done. Your plan is updated.');
        convo.push({ role: 'model', parts: [{ text: reply }] });
        var ch = R.apply(d, r.cmds);
        if (ch.length) {
          R.save(d); draw(true); selectDay(cur);
          var seen = {};
          ch.forEach(function (c) { seen[c] = (seen[c] || 0) + 1; });
          Object.keys(seen).forEach(function (c) { write('msg--sys').textContent = seen[c] > 1 ? c.replace('a step', seen[c] + ' steps') : c; });
          toast('Your coach updated your plan.');
        }
        msgs.scrollTop = msgs.scrollHeight;
      }, function (e) {
        b.className = 'msg msg--err';
        b.textContent = e && e.offline ? 'The coach needs the internet. Your log works offline and is saved.' : 'The coach is busy right now. Try again in a minute; your log is saved.';
        convo.pop();
      }).then(function () { busy = false; });
  }
  $$('[data-q]').forEach(function (b) { b.addEventListener('click', function () { ask(b.getAttribute('data-q')); }); });
  $('[data-ask-form]').addEventListener('submit', function (e) {
    e.preventDefault();
    var i = $('[data-ask-in]'), q = i.value.trim();
    if (q) { ask(q); i.value = ''; }
  });

  /* ════════════════ the rest ════════════════ */
  $('[data-change]').addEventListener('click', function () { setup(); glide(setupEl); });
  $('[data-export]').addEventListener('click', function () {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(d, null, 2)], { type: 'application/json' }));
    a.download = 'reboot-log-' + today + '.json'; document.body.appendChild(a); a.click(); a.remove();
    toast('A copy of your log was saved as a file.');
  });
  $('[data-import]').addEventListener('change', function () {
    var f = this.files && this.files[0], input = this; if (!f) return;
    var rd = new FileReader();
    rd.onload = function () {
      try {
        var x = JSON.parse(rd.result);
        if (!x || typeof x !== 'object' || typeof x.logs !== 'object' || !x.base) throw 0;
        if (!confirm('Replace the log on this device with the one in this file?')) return;
        d = Object.assign(R.blank(), x); if (!Array.isArray(d.seals)) d.seals = [];
        R.save(d); dash(); toast('Your log was loaded.');
      } catch (e) { toast('That file is not a Reboot log.'); }
      input.value = '';
    };
    rd.readAsText(f);
  });
  $('[data-wipe]').addEventListener('click', function () {
    if (!confirm('Delete your whole Reboot log from this device? This cannot be undone.')) return;
    d = R.blank(); R.save(d); msgs.innerHTML = ''; convo = []; cur = today; setup();
    glide($('.rh'), 0);
  });
  var rz = 0;
  addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(function () { if (!$('[data-dash]').hidden) chart(); }, 150); });

  if (d.what && d.base) {
    dash();
    write('msg--bot').textContent = d.logs[today] ? 'Today is logged. Ask me anything, or tap “Look at my week”.' :
      (Object.keys(d.logs).length ? 'Welcome back. Log today when you’re ready, then ask me to look at your week.' : 'Hi. Log today, then tap “Look at my week” and I’ll set your first small target.');
  } else setup();
})();
