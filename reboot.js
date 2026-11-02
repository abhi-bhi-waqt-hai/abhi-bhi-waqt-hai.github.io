/* reboot.js: the Reboot page (src/pages/reboot.astro). The log itself and
   the AI's commands live in reboot-store.js; this draws the page from them
   and talks to the coach through ai.js. */
(function () {
  var box = document.querySelector('[data-reboot]');
  if (!box || !window.abwhReboot) return;
  var R = window.abwhReboot, AI = window.abwhAI;
  var $ = function (s) { return box.querySelector(s); };
  var $$ = function (s) { return [].slice.call(box.querySelectorAll(s)); };
  var toastEl = document.querySelector('[data-toast]');
  var d = R.load();
  var today = R.day();
  var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  var toastT = 0;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg; toastEl.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('is-on'); }, 3400);
  }
  function radio(btns, on) { btns.forEach(function (b) { b.setAttribute('aria-checked', String(b === on)); }); }
  function stepper(el, get, set, min, max) {
    var out = el.querySelector('output');
    el.querySelectorAll('[data-d]').forEach(function (b) {
      b.addEventListener('click', function () {
        var v = Math.max(min, Math.min(max, get() + parseFloat(b.getAttribute('data-d'))));
        set(v); out.textContent = v;
        out.classList.remove('is-bump'); void out.offsetWidth; out.classList.add('is-bump');
      });
    });
    out.textContent = get();
  }

  /* ── first time ── */
  var pickWhat = 'alcohol', base = 4;
  function setup() {
    $('[data-setup]').hidden = false; $('[data-dash]').hidden = true;
    var chips = $$('[data-what]');
    var unit = $('[data-setup] [data-unit]');
    chips.forEach(function (c) {
      c.onclick = function () { pickWhat = c.getAttribute('data-what'); radio(chips, c); unit.textContent = R.UNITS[pickWhat]; };
    });
    var cur = chips.filter(function (c) { return c.getAttribute('data-what') === (d.what || pickWhat); })[0] || chips[0];
    cur.click();
    if (d.base) base = d.base;
    stepper($('[data-base]'), function () { return base; }, function (v) { base = v; }, 1, 99);
  }
  $('[data-start]').addEventListener('click', function () {
    d.what = pickWhat; d.unit = R.UNITS[pickWhat]; d.base = base;
    if (!d.goal || d.goal > base) d.goal = base;
    if (!d.start) d.start = today;
    R.save(d);
    dash();
    toast('Your log is ready. Start with today.');
  });

  /* ── today's form ── */
  var amt = 0, mood = 0, feel = '';
  function form() {
    var log = d.logs[today];
    amt = log ? log.amt : (d.goal || d.base || 0); mood = log ? log.mood : 0; feel = log ? log.feel : '';
    $('[data-amt] output').textContent = amt;
    radio($$('[data-mood]'), $$('[data-mood]').filter(function (b) { return +b.getAttribute('data-mood') === mood; })[0]);
    radio($$('[data-better]'), $$('[data-better]').filter(function (b) { return b.getAttribute('data-better') === feel; })[0]);
    diff();
  }
  function diff() {
    var el = $('[data-diff]'), dd = d.base - amt;
    el.classList.toggle('is-up', dd < 0);
    el.innerHTML = !d.base ? '' : dd > 0 ? '<b>' + dd + ' less</b> than your usual ' + d.base + '. That counts.'
      : dd === 0 ? 'The same as your usual ' + d.base + '. Logging it still counts.' : '<b>' + (-dd) + ' more</b> than usual. One day is one day.';
  }
  stepper($('[data-amt]'), function () { return amt; }, function (v) { amt = v; diff(); }, 0, 999);
  $$('[data-mood]').forEach(function (b) { b.addEventListener('click', function () { mood = +b.getAttribute('data-mood'); radio($$('[data-mood]'), b); }); });
  $$('[data-better]').forEach(function (b) { b.addEventListener('click', function () { feel = b.getAttribute('data-better'); radio($$('[data-better]'), b); }); });
  $('[data-save]').addEventListener('click', function () {
    if (!mood) { toast('Tap a face for how you feel.'); return; }
    if (!feel) { toast('Better, same or worse than yesterday?'); return; }
    d.logs[today] = { amt: amt, mood: mood, feel: feel };
    R.save(d);
    var s = R.stats(d);
    $('[data-done-t]').textContent = amt <= d.goal ? 'On target. One more lamp lit.' : 'Logged. One more lamp lit.';
    draw(true);
    toast(s.streak > 1 ? s.streak + ' days in a row. Keep the lamps lit.' : 'Today is logged.');
  });
  $('[data-edit]').addEventListener('click', function () { $('[data-form]').hidden = false; $('[data-done]').hidden = true; form(); });

  /* ── the dashboard ── */
  function dash() {
    $('[data-setup]').hidden = true; $('[data-dash]').hidden = false;
    $$('[data-dash] [data-unit]').forEach(function (u) { u.textContent = d.unit; });
    var t = new Date();
    $('[data-day]').textContent = 'Today · ' + DAYS[t.getDay()] + ' ' + t.getDate() + ' ' + MONTHS[t.getMonth()];
    form();
    draw(false);
    var go = document.querySelector('[data-hero-go]');
    if (go && d.logs[today]) go.textContent = 'See my dashboard';
  }
  function draw(fresh) {
    var s = R.stats(d), logged = !!d.logs[today];
    $('[data-form]').hidden = logged; $('[data-done]').hidden = !logged;
    $('[data-target]').textContent = 'Target: ' + d.goal + ' ' + d.unit + ' a day';
    /* ring */
    var cut = s.cut;
    $('[data-cut]').textContent = cut == null ? '–' : Math.max(0, cut);
    requestAnimationFrame(function () { $('[data-ring]').style.strokeDasharray = (cut == null ? 0 : Math.max(0, cut)) + ' 100'; });
    $('[data-cut-s]').textContent = cut == null ? 'Log a few days to see it.' : 'This week averages ' + s.weekAvg + ' ' + d.unit + ' a day, against your usual ' + d.base + '.';
    /* week of lamps */
    var wk = $('[data-week]'); wk.innerHTML = '';
    s.last7.forEach(function (x) {
      var li = document.createElement('li');
      li.className = 'lamp' + (x.log ? ' is-lit' : x.k === today ? ' is-cur' : '');
      li.innerHTML = window.abwhLamp || ''; wk.appendChild(li);
    });
    $('[data-streak]').textContent = s.streak;
    $('[data-week-s]').textContent = s.onGoal ? s.onGoal + ' of the last 7 days on target' : 'Every day you log lights a lamp.';
    chart(s);
    plan(fresh);
  }
  function chart(s) {
    var svg = $('[data-chart]'), W = 700, H = 220, pad = 18, top = 14;
    var vals = s.last14.map(function (x) { return x.log ? x.log.amt : null; });
    var max = Math.max(d.base || 1, d.goal || 0, Math.max.apply(null, vals.map(function (v) { return v || 0; }))) * 1.12;
    var y = function (v) { return H - pad - (v / max) * (H - pad - top); };
    var bw = W / 14;
    var h = '<defs><linearGradient id="rbBar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0d39b"/><stop offset="1" stop-color="#b8893d" stop-opacity=".55"/></linearGradient></defs>';
    h += '<line class="base" x1="0" x2="' + W + '" y1="' + y(d.base) + '" y2="' + y(d.base) + '"/>';
    h += '<text class="lbl" x="4" y="' + (y(d.base) - 5) + '">usual ' + d.base + '</text>';
    vals.forEach(function (v, i) {
      if (v == null) return;
      var x = i * bw + bw * .2, top2 = y(Math.max(v, .15));
      h += '<rect class="bar' + (v > d.goal ? ' is-over' : '') + (s.last14[i].k === today ? ' is-today' : '') + '" style="animation-delay:' + (i * 40) + 'ms" x="' + x.toFixed(1) + '" y="' + top2.toFixed(1) + '" width="' + (bw * .6).toFixed(1) + '" height="' + (H - pad - top2).toFixed(1) + '" rx="5"/>';
    });
    h += '<line class="goal" x1="0" x2="' + W + '" y1="' + y(d.goal) + '" y2="' + y(d.goal) + '"/>';
    var pts = [];
    s.last14.forEach(function (x, i) { if (x.log && x.log.mood) pts.push([i * bw + bw / 2, top + (5 - x.log.mood) / 4 * (H - pad - top) * .9]); });
    if (pts.length > 1) h += '<path class="mood" pathLength="1" d="M' + pts.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' L') + '"/>';
    pts.forEach(function (p) { h += '<circle class="dot" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="4.5"/>'; });
    if (!s.days) h += '<text class="lbl" x="' + W / 2 + '" y="' + H / 2 + '" text-anchor="middle">Your first bar appears when you save today</text>';
    svg.innerHTML = h;
    $('[data-chart-days]').innerHTML = s.last14.map(function (x) { return '<span>' + (x.k === today ? 'Now' : DAYS[new Date(x.k + 'T12:00:00').getDay()][0]) + '</span>'; }).join('');
  }
  function plan(fresh) {
    $('[data-focus-box]').hidden = !d.focus;
    $('[data-focus]').textContent = d.focus;
    $('[data-steps]').innerHTML = d.steps.map(function (st, i) {
      return '<li><label><input type="checkbox" data-step="' + i + '"' + (st.done ? ' checked' : '') + '><span></span></label></li>';
    }).join('');
    $$('[data-steps] li span').forEach(function (sp, i) { sp.textContent = d.steps[i].t; });
    $$('[data-step]').forEach(function (c) {
      c.addEventListener('change', function () { d.steps[+c.getAttribute('data-step')].done = c.checked; R.save(d); if (c.checked) toast('Step done.'); });
    });
    $('[data-tips]').innerHTML = '';
    d.tips.forEach(function (t) { var li = document.createElement('li'); li.textContent = t; $('[data-tips]').appendChild(li); });
    $('[data-badges]').innerHTML = '';
    d.badges.forEach(function (b, i) {
      var li = document.createElement('li');
      if (fresh && i === d.badges.length - 1 && b.d === today) li.className = 'is-new';
      li.title = b.why || '';
      li.innerHTML = '<b></b><span></span>';
      li.querySelector('b').textContent = '✦';
      li.querySelector('span').textContent = b.t;
      $('[data-badges]').appendChild(li);
    });
    $('[data-sos]').hidden = !d.sos;
  }

  /* ── the coach ── */
  var msgs = $('[data-msgs]'), convo = [];
  function bubble(cls, html) {
    var p = document.createElement('div'); p.className = 'rb-msg ' + cls; p.innerHTML = html; msgs.appendChild(p);
    msgs.scrollTop = msgs.scrollHeight; return p;
  }
  var SYSTEM = [
    'You are the Reboot coach inside अभी भी वक़्त है ("There is still time"), an Indian website that helps people cut down on drugs, alcohol or tobacco at their own pace. Two doctors reviewed the site.',
    'Each user message starts with a JSON snapshot of their private dashboard: what they are cutting down, their usual daily amount (base), their current daily target (goal), the last 14 days of logs (amount, mood 1-5, better/same/worse than yesterday), their focus, plan steps and badges.',
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
    bubble('rb-msg--me', '').textContent = q;
    convo.push({ role: 'user', parts: [{ text: 'Dashboard: ' + snapshot() + '\n\nMe: ' + q }] });
    var b = bubble('', '<span class="rb-typing"><i></i><i></i><i></i></span>');
    AI.ask({ system: SYSTEM, contents: convo.slice(-8), temperature: .7, maxTokens: 700,
      onText: function (t) { b.innerHTML = AI.md(AI.commands(t.replace(/\[\[[^\]]*$/, '')).text); msgs.scrollTop = msgs.scrollHeight; } })
      .then(function (reply) {
        var r = AI.commands(reply);
        b.innerHTML = AI.md(r.text || 'Done. Your dashboard is updated.');
        convo.push({ role: 'model', parts: [{ text: reply }] });
        var changed = R.apply(d, r.cmds);
        if (changed.length) {
          R.save(d); draw(true);
          var seen = {};
          changed.forEach(function (c) { seen[c] = (seen[c] || 0) + 1; });
          Object.keys(seen).forEach(function (c) { bubble('rb-msg--sys', '').textContent = seen[c] > 1 ? c.replace('a step', seen[c] + ' steps') : c; });
          toast('Your coach updated your dashboard.');
        }
      }, function (e) {
        b.classList.add('rb-msg--err');
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
  $('[data-change]').addEventListener('click', function () { setup(); box.scrollIntoView({ behavior: 'smooth' }); });
  $('[data-export]').addEventListener('click', function () {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(d, null, 2)], { type: 'application/json' }));
    a.download = 'reboot-log-' + today + '.json'; document.body.appendChild(a); a.click(); a.remove();
  });
  $('[data-wipe]').addEventListener('click', function () {
    if (!confirm('Delete your whole Reboot log from this device? This cannot be undone.')) return;
    d = R.blank(); R.save(d); msgs.innerHTML = ''; convo = []; setup();
  });

  if (d.what && d.base) {
    dash();
    var hello = d.logs[today] ? 'Today is logged. Ask me anything, or tap “Look at my week”.' :
      (Object.keys(d.logs).length ? 'Welcome back. Log today when you’re ready.' : 'Hi. Log today, then tap “Look at my week” and I’ll set your first small target.');
    bubble('', '').textContent = hello;
  } else setup();
})();
