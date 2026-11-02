/* reboot.js: the Reboot page (src/pages/reboot.astro). The log and the
   AI's commands live in reboot-store.js; this draws the page from them
   (the sky and its skyline, the ruler, the weather, four weeks, the
   coach's notebook) and talks to the coach through ai.js. */
(function () {
  var box = document.querySelector('[data-reboot]');
  if (!box || !window.abwhReboot) return;
  var R = window.abwhReboot, AI = window.abwhAI;
  var $ = function (s) { return box.querySelector(s); };
  var $$ = function (s) { return [].slice.call(box.querySelectorAll(s)); };
  var SVG = 'http://www.w3.org/2000/svg';
  var d = R.load();
  var today = R.day();
  var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var MOODS = ['', 'Stormy', 'Rainy', 'Cloudy', 'Clearing', 'Sunny'];
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  var toastEl = $('[data-toast]'), toastT = 0;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('is-on'); }, 3400);
  }
  function radio(btns, on) { btns.forEach(function (b) { b.setAttribute('aria-checked', String(b === on)); }); }
  function el(tag, attrs) { var e = document.createElementNS(SVG, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); return e; }
  function label(k) { var t = new Date(k + 'T12:00:00'); return DAYS[t.getDay()] + ' ' + t.getDate() + ' ' + MONTHS[t.getMonth()]; }

  /* ── the sky: night to dawn in flat bands, by how far below usual this week is ── */
  var NIGHT = ['#0b0d14', '#10131c', '#151824', '#1b1d27'];
  var DAWN = ['#24304d', '#5c4256', '#b56a4b', '#e3a25f'];
  function mix(a, b, t) {
    var p = function (h, i) { return parseInt(h.slice(1 + i * 2, 3 + i * 2), 16); };
    var c = [0, 1, 2].map(function (i) { return Math.round(p(a, i) + (p(b, i) - p(a, i)) * t).toString(16).padStart(2, '0'); });
    return '#' + c.join('');
  }
  var stars = $('[data-stars]');
  for (var i = 0; i < 46; i++) stars.appendChild(el('circle', { cx: (i * 337) % 1400, cy: 20 + (i * 151) % 300, r: i % 5 ? 1.3 : 2.2 }));
  function sky() {
    var s = R.stats(d, today);
    var dawn = s.cut == null ? (d.what ? .08 : 0) : Math.max(.08, Math.min(1, s.cut / 40));
    var sv = $('[data-sky]');
    NIGHT.forEach(function (n, k) { box.style.setProperty('--b' + k, mix(n, DAWN[k], dawn)); });
    $$('[data-stars] circle').forEach(function (c) { c.style.opacity = String(Math.max(0, .8 - dawn * 1.2)); });
    var sun = $('[data-sun]');
    sun.setAttribute('cy', String(600 - dawn * 420));
    sun.setAttribute('r', String(54 + dawn * 22));
    /* the skyline: one building per day, as tall as that day's amount */
    var g = $('[data-skyline]'); g.innerHTML = '';
    var days = s.last14, w = 1400 / 14, top = 350, floor = 560;
    if (!d.base) {
      /* nothing logged yet: fourteen empty plots where the days will stand */
      for (var q = 0; q < 14; q++) g.appendChild(el('rect', { class: 'sky__bld sky__bld--empty', x: (q * w + w * .1).toFixed(1), y: floor - 40, width: (w * .8).toFixed(1), height: 40, rx: 3 }));
      return;
    }
    var max = Math.max(d.base * 1.2, 1);
    days.forEach(function (x, k) {
      var v = x.log ? x.log.amt : null;
      var h = v == null ? 18 : Math.max(26, (v / max) * (floor - top));
      var bx = k * w + w * .1, bw = w * .8, by = floor - h;
      var b = el('rect', { class: 'sky__bld', x: bx.toFixed(1), y: by.toFixed(1), width: bw.toFixed(1), height: h.toFixed(1), rx: 3, tabindex: x.log ? 0 : -1 });
      b.style.animationDelay = reduce ? '0s' : (k * 50) + 'ms';
      b.dataset.k = x.k;
      g.appendChild(b);
      if (x.log) for (var r = 0; r < Math.min(6, Math.floor(h / 34)); r++) {
        if ((k + r) % 3 === 0) continue;
        g.appendChild(el('rect', { class: 'sky__win', x: (bx + bw * .3).toFixed(1), y: (by + 14 + r * 30).toFixed(1), width: (bw * .14).toFixed(1), height: 9, rx: 1.5 }));
        g.appendChild(el('rect', { class: 'sky__win', x: (bx + bw * .58).toFixed(1), y: (by + 14 + r * 30).toFixed(1), width: (bw * .14).toFixed(1), height: 9, rx: 1.5 }));
      }
    });
    var ty = floor - (d.goal / max) * (floor - top);
    g.appendChild(el('line', { class: 'sky__target', x1: 0, x2: 1400, y1: ty.toFixed(1), y2: ty.toFixed(1) }));
    var tl = el('text', { class: 'sky__tlabel', x: 1390, y: (ty - 10).toFixed(1), 'text-anchor': 'end' }); tl.textContent = 'target ' + d.goal;
    g.appendChild(tl);
    /* the words over it */
    var t = $('[data-sky-t]'), sub = $('[data-sky-s]');
    if (s.cut == null) { t.textContent = s.days ? 'The first light is coming.' : 'Day one. The sky is still dark.'; sub.textContent = 'Each building below is one day. Log today and the first one goes up.'; }
    else if (s.cut <= 0) { t.innerHTML = 'Still at your usual. <b>That’s okay.</b>'; sub.textContent = 'This week averages ' + s.weekAvg + ' ' + d.unit + ' a day. Small cuts count; the coach can help you pick one.'; }
    else { t.innerHTML = '<b>' + s.cut + '%</b> below your usual.'; sub.textContent = 'This week averages ' + s.weekAvg + ' ' + d.unit + ' a day against your usual ' + d.base + '. The lower the skyline, the higher the sun.'; }
  }
  /* a building's story on hover, focus or tap */
  var tip = $('[data-sky-tip]');
  function showTip(b) {
    var x = d.logs[b.dataset.k]; if (!x) { tip.hidden = true; return; }
    $$('.sky__bld').forEach(function (o) { o.classList.toggle('is-on', o === b); });
    var r = b.getBoundingClientRect(), pr = $('.sky').getBoundingClientRect();
    tip.innerHTML = '<b>' + label(b.dataset.k) + '</b> · ' + x.amt + ' ' + d.unit + ' · ' + (MOODS[x.mood] || '');
    tip.style.left = Math.min(pr.width - 90, Math.max(90, r.left - pr.left + r.width / 2)) + 'px';
    tip.style.top = (r.top - pr.top) + 'px';
    tip.hidden = false;
  }
  var skyEl = $('.sky');
  skyEl.addEventListener('pointerover', function (e) { if (e.target.classList && e.target.classList.contains('sky__bld')) showTip(e.target); });
  skyEl.addEventListener('focusin', function (e) { if (e.target.classList && e.target.classList.contains('sky__bld')) showTip(e.target); });
  skyEl.addEventListener('click', function (e) { if (e.target.classList && e.target.classList.contains('sky__bld')) showTip(e.target); });
  skyEl.addEventListener('pointerleave', function () { tip.hidden = true; $$('.sky__bld').forEach(function (o) { o.classList.remove('is-on'); }); });

  /* ── the first time: one sentence ── */
  var setupEl = $('[data-setup]');
  function setup() {
    setupEl.hidden = false; $('[data-dash]').hidden = true;
    var w = $('[data-what]'), unit = $('[data-setup] [data-unit]');
    if (d.what) w.value = d.what;
    if (d.base) $('[data-base]').value = d.base;
    var upd = function () { unit.textContent = R.UNITS[w.value]; };
    w.onchange = upd; upd();
    sky();
  }
  setupEl.addEventListener('submit', function (e) {
    e.preventDefault();
    var base = Math.max(1, Math.min(99, parseInt($('[data-base]').value, 10) || 1));
    d.what = $('[data-what]').value; d.unit = R.UNITS[d.what]; d.base = base;
    if (!d.goal || d.goal > base) d.goal = base;
    if (!d.start) d.start = today;
    R.save(d);
    dash();
    toast('Your log is ready. Start with today.');
  });

  /* ── today: the ruler, the weather, compared with yesterday ── */
  var amt = 0, mood = 0, feel = '';
  var range = $('[data-amt]'), out = $('[data-amt-out]');
  function ruler() {
    var max = Math.max(6, Math.ceil(d.base * 1.6));
    range.max = String(max);
    var svg = $('[data-ruler-svg]'), W = svg.clientWidth || 600, H = svg.clientHeight || 86;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.innerHTML = '';
    var x = function (v) { return 10 + (W - 20) * v / max; };
    svg.appendChild(el('line', { class: 'base', x1: 0, x2: W, y1: H - 26, y2: H - 26 }));
    for (var v = 0; v <= max; v++) {
      var big = v % (max > 20 ? 5 : 1) === 0 || v === max;
      svg.appendChild(el('line', { class: 'tk' + (big ? ' big' : ''), x1: x(v), x2: x(v), y1: H - 26, y2: H - (big ? 46 : 36) }));
      if (big && (max <= 20 || v % 5 === 0)) { var n = el('text', { class: 'tn', x: x(v), y: H - 8, 'text-anchor': 'middle' }); n.textContent = v; svg.appendChild(n); }
    }
    /* where usual and the target sit on the ruler, named in a key below it */
    svg.appendChild(el('line', { class: 'mkl u', x1: x(d.base), x2: x(d.base), y1: 12, y2: H - 26 }));
    svg.appendChild(el('line', { class: 'mkl t', x1: x(d.goal), x2: x(d.goal), y1: 12, y2: H - 26 }));
    $('[data-ruler-key]').innerHTML = '<span><i class="k-t"></i>target ' + d.goal + '</span><span><i class="k-u"></i>usual ' + d.base + '</span>';
    needle();
  }
  function needle() {
    var max = +range.max;
    $('.ruler__needle').style.setProperty('--x', 'calc(10px + (100% - 20px) * ' + (amt / max) + ')');
  }
  function diff() {
    var e = $('[data-diff]'), dd = d.base - amt;
    e.classList.toggle('is-up', dd < 0);
    e.innerHTML = dd > 0 ? '<b>' + dd + ' less</b> than your usual ' + d.base + '. That counts.'
      : dd === 0 ? 'The same as your usual ' + d.base + '. Logging it still counts.' : '<b>' + (-dd) + ' more</b> than usual. One day is one day.';
  }
  range.addEventListener('input', function () {
    amt = +range.value; out.textContent = amt;
    out.classList.remove('is-bump'); void out.offsetWidth; out.classList.add('is-bump');
    needle(); diff();
  });
  $$('[data-mood]').forEach(function (b) { b.addEventListener('click', function () { mood = +b.getAttribute('data-mood'); radio($$('[data-mood]'), b); }); });
  $$('[data-better]').forEach(function (b) { b.addEventListener('click', function () { feel = b.getAttribute('data-better'); radio($$('[data-better]'), b); }); });
  function form() {
    var log = d.logs[today];
    amt = log ? log.amt : (d.goal != null ? d.goal : d.base); mood = log ? log.mood : 0; feel = log ? log.feel : '';
    ruler();
    range.value = String(amt); out.textContent = amt; needle(); diff();
    radio($$('[data-mood]'), $$('[data-mood]').filter(function (b) { return +b.getAttribute('data-mood') === mood; })[0]);
    radio($$('[data-better]'), $$('[data-better]').filter(function (b) { return b.getAttribute('data-better') === feel; })[0]);
  }
  $('[data-save]').addEventListener('click', function () {
    if (!mood) { toast('Pick the weather inside first.'); return; }
    if (!feel) { toast('Better, same or worse than yesterday?'); return; }
    d.logs[today] = { amt: amt, mood: mood, feel: feel };
    R.save(d);
    $('[data-done-t]').textContent = amt <= d.goal ? 'On target. The sun is a little higher.' : 'Logged. Tomorrow is a new building.';
    draw(true);
    var s = R.stats(d);
    toast(s.streak > 1 ? s.streak + ' days in a row.' : 'Today is logged.');
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });
  $('[data-edit]').addEventListener('click', function () { $('[data-form]').hidden = false; $('[data-done]').hidden = true; form(); });

  /* ── the dashboard ── */
  function dash() {
    setupEl.hidden = true; $('[data-dash]').hidden = false;
    $$('[data-dash] [data-unit]').forEach(function (u) { u.textContent = d.unit; });
    var t = new Date();
    $('[data-day]').textContent = 'Today, ' + DAYS[t.getDay()] + ' ' + t.getDate() + ' ' + MONTHS[t.getMonth()];
    form();
    draw(false);
  }
  function draw(fresh) {
    var s = R.stats(d), logged = !!d.logs[today];
    $('[data-form]').hidden = logged; $('[data-done]').hidden = !logged;
    $('[data-target]').textContent = 'Target ' + d.goal + ' ' + d.unit + ' a day';
    $('[data-avg]').textContent = s.weekAvg == null ? '–' : s.weekAvg;
    $('[data-avg-s]').textContent = d.unit + ' a day this week';
    $('[data-cut]').textContent = s.cut == null ? '–' : Math.max(0, s.cut) + '%';
    $('[data-streak]').textContent = s.streak;
    /* four weeks, oldest first */
    var m = $('[data-month]'); m.innerHTML = '';
    for (var k = 27; k >= 0; k--) {
      var key = R.day(new Date(today + 'T12:00:00').getTime() - k * 864e5), log = d.logs[key];
      var li = document.createElement('li');
      li.style.setProperty('--i', 27 - k);
      li.className = (log ? (log.amt <= d.goal ? 'is-on' : 'is-over') : '') + (key === today ? ' is-today' : '');
      li.textContent = new Date(key + 'T12:00:00').getDate();
      li.title = label(key) + (log ? ': ' + log.amt + ' ' + d.unit : ': not logged');
      m.appendChild(li);
    }
    sky();
    plan(fresh);
  }
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
      li.title = x.why || '';
      li.appendChild(document.querySelector('[data-star]').content.cloneNode(true)); li.appendChild(document.createElement('span'));
      li.querySelector('span').textContent = x.t;
      bd.appendChild(li);
    });
    $('[data-sos]').hidden = !d.sos;
  }

  /* ── the coach ── */
  var msgs = $('[data-msgs]'), convo = [];
  function write(cls, who) {
    var p = document.createElement('div'); p.className = 'msg ' + cls;
    if (who) { var w = document.createElement('span'); w.className = 'msg__who'; w.textContent = who; p.appendChild(w); }
    var body = document.createElement('div'); p.appendChild(body);
    msgs.appendChild(p); return body;
  }
  var SYSTEM = [
    'You are the Reboot coach inside अभी भी वक़्त है ("There is still time"), an Indian website that helps people cut down on drugs, alcohol or tobacco at their own pace. Two doctors reviewed the site.',
    'Each user message starts with a JSON snapshot of their private dashboard: what they are cutting down, their usual daily amount (base), their current daily target (goal), the last 14 days of logs (amount, mood 1-5 where 1 is stormy and 5 is sunny, better/same/worse than yesterday), their focus, plan steps and badges.',
    'Write 2 to 4 short, warm sentences in plain English (or in the language the user writes in). Talk about their real numbers. Never shame, never lecture, never diagnose. Celebrate any real progress, even small.',
    'Safety: never tell anyone to stop alcohol, sleeping pills or benzodiazepines, or opioids all at once; stopping those suddenly can be dangerous, so suggest slow cuts and a doctor or the free helpline 14446. If the user mentions wanting to die, self-harm, an overdose, or someone not waking up or not breathing, add [[SOS]] and tell them to call 112 now (or Tele-MANAS on 14416).',
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
      last_14_days: s.last14.filter(function (x) { return x.log; }).map(function (x) { return { day: x.k, amount: x.log.amt, mood: x.log.mood, vs_yesterday: x.log.feel }; }),
      focus: d.focus, steps: d.steps, badges: d.badges.map(function (b) { return b.t; }),
    });
  }
  var busy = false;
  function ask(q) {
    if (busy || !AI) return;
    busy = true;
    write('msg--me', 'You').textContent = q;
    convo.push({ role: 'user', parts: [{ text: 'Dashboard: ' + snapshot() + '\n\nMe: ' + q }] });
    var b = write('', 'Coach'); b.innerHTML = '<span class="typing"><i></i><i></i><i></i></span>';
    AI.ask({ system: SYSTEM, contents: convo.slice(-8), temperature: .7, maxTokens: 700,
      onText: function (t) { b.innerHTML = AI.md(AI.commands(t.replace(/\[\[[^\]]*$/, '')).text); } })
      .then(function (reply) {
        var r = AI.commands(reply);
        b.innerHTML = AI.md(r.text || 'Done. Your plan is updated.');
        convo.push({ role: 'model', parts: [{ text: reply }] });
        var changed = R.apply(d, r.cmds);
        if (changed.length) {
          R.save(d); draw(true);
          var seen = {};
          changed.forEach(function (c) { seen[c] = (seen[c] || 0) + 1; });
          Object.keys(seen).forEach(function (c) { write('msg--sys').textContent = seen[c] > 1 ? c.replace('a step', seen[c] + ' steps') : c; });
          toast('Your coach updated your plan.');
        }
      }, function (e) {
        b.parentNode.classList.add('msg--err');
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

  /* ── the rest ── */
  $('[data-change]').addEventListener('click', function () { setup(); window.scrollTo({ top: $('.rbm').offsetTop - 60, behavior: 'smooth' }); });
  $('[data-export]').addEventListener('click', function () {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(d, null, 2)], { type: 'application/json' }));
    a.download = 'reboot-log-' + today + '.json'; document.body.appendChild(a); a.click(); a.remove();
  });
  $('[data-wipe]').addEventListener('click', function () {
    if (!confirm('Delete your whole Reboot log from this device? This cannot be undone.')) return;
    d = R.blank(); R.save(d); msgs.innerHTML = ''; convo = []; setup();
  });
  addEventListener('resize', function () { if (d.base && !$('[data-dash]').hidden) { ruler(); } });

  if (d.what && d.base) {
    dash();
    write('', 'Coach').textContent = d.logs[today] ? 'Today is logged. Ask me anything, or tap “Look at my week”.' :
      (Object.keys(d.logs).length ? 'Welcome back. Log today when you’re ready.' : 'Hi. Log today, then tap “Look at my week” and I’ll set your first small target.');
  } else setup();
})();
