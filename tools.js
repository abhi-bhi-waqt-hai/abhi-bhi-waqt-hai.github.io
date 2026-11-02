/* ── The help tools ─────────────────────────────────────────────────────────
   The self-check, the cravings timer and Find help near me, on /tools. A
   classic script, not a module, so it also runs when the built site is
   opened straight from a folder. Nothing here is saved or sent anywhere,
   except two small things kept on this device: how many urges the timer has
   seen out, and nothing else. Find help near me sends only the point to
   search around to the public map service (OpenStreetMap's Overpass). */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function get(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function put(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ARROW = '<span aria-hidden="true">→</span>';
  /* the lamp's flame, the same shape the film draws: hot white low in the
     middle, gold, then orange at the edge */
  var FLAME = '<svg viewBox="0 0 40 64" aria-hidden="true"><defs><radialGradient id="tFl" cx=".5" cy=".72" r=".62"><stop offset="0" stop-color="#fffaee"/><stop offset=".28" stop-color="#ffd98a"/><stop offset=".62" stop-color="#ffa844"/><stop offset="1" stop-color="#ff7424"/></radialGradient></defs>' +
    '<path d="M20 2C23 13 35 24 35 40a15 15 0 0 1-30 0C5 26 17 17 20 2z" fill="url(#tFl)"/><path d="M20 26c1.6 5 7 9 7 15a7 7 0 0 1-14 0c0-5 5.4-9 7-15z" fill="#fff6e0" opacity=".85"/></svg>';
  /* the numbers, as big buttons, wherever they are needed */
  function sos(list, title, note) {
    return '<div class="t-sos" role="alert"><p class="t-sos__t">' + title + '</p><div class="t-sos__b">' + list.map(function (n, i) {
      return '<a class="' + (i ? '' : 'is-hot') + '" href="tel:' + n[0] + '"><b>' + n[0] + '</b><span>' + n[1] + '</span></a>';
    }).join('') + '</div>' + (note ? '<p class="t-sos__s">' + note + '</p>' : '') + '</div>';
  }

  /* ════════════════════════ 1 · THE SELF-CHECK ════════════════════════
     The eleven signs doctors use to recognise a substance use problem
     (DSM-5), asked in plain words about the past twelve months. Two to
     three is what doctors call mild, four to five moderate, six or more
     severe; the result says that in kinder words, and what to do next. */
  var quiz = $('[data-quiz]');
  if (quiz) (function () {
    var USED = [
      ['alcohol', 'Alcohol'], ['tobacco', 'Tobacco or vapes'], ['cannabis', 'Ganja, charas or bhang'],
      ['pills', 'Pills or cough syrup not prescribed for me'], ['inhalants', 'Whitener, glue or petrol'],
      ['opioids', 'Heroin, smack, brown sugar or chitta'], ['stimulants', 'Meth, MDMA or cocaine'],
    ];
    var OFTEN = ['Once or twice', 'About every month', 'Every week', 'Every day, or almost'];
    var SIGNS = [
      'Have you often used more, or for longer, than you meant to?',
      'Have you wanted to cut down or stop, but couldn’t?',
      'Do you spend a lot of time getting it, using it, or getting over it?',
      'Have you had cravings so strong it was hard to think of anything else?',
      'Has it made you miss or fall behind at school, work or home?',
      'Have you kept using even though it caused fights or problems with family or friends?',
      'Have you given up things you used to enjoy because of it?',
      'Have you used it somewhere risky: riding or driving, alone, or with people you don’t trust?',
      'Have you kept using even though it was harming your body or your mind?',
      'Do you need more than before to feel the same effect?',
      'When it wears off, do you feel sick, shaky, sweaty, restless or very low?',
    ];
    var SAFETY = 'In the past month, have you had thoughts of hurting yourself, or has using left you or someone with you unconscious or struggling to breathe?';
    var st;
    function reset() { st = { step: 'intro', used: [], often: -1, yes: [], safety: null, i: 0, dir: 1 }; render(); }
    var total = SIGNS.length + 3; // what, how often, the signs, safety
    function progress(n) { return '<div class="q-bar" aria-hidden="true"><i style="width:' + Math.round(n / total * 100) + '%"></i></div>'; }
    function screen(html) {
      quiz.innerHTML = '<div class="q-screen' + (st.dir < 0 ? ' is-back' : '') + '">' + html + '</div>';
      var f = quiz.querySelector('[data-focus]');
      if (f && quiz.getBoundingClientRect().top < innerHeight && quiz.getBoundingClientRect().bottom > 0) f.focus({ preventScroll: true });
    }
    function back() { return '<button class="q-back" type="button" data-q="back">← Back</button>'; }
    function render() {
      if (st.step === 'intro') {
        screen('<p class="q-k">Private · about 2 minutes</p><h3 class="q-h">How is it going, honestly?</h3>' +
          '<p class="q-p">Answer for yourself. There are no right answers, nobody else sees this, and nothing is kept.</p>' +
          '<button class="q-go" type="button" data-q="start" data-focus>Start the check ' + ARROW + '</button>');
      } else if (st.step === 'what') {
        screen(progress(1) + '<p class="q-k">Question 1 of ' + total + '</p><h3 class="q-h">In the past year, have you used any of these?</h3><p class="q-p">Pick all that are true.</p>' +
          '<div class="q-picks">' + USED.map(function (u) { return '<button type="button" class="q-pick' + (st.used.indexOf(u[0]) >= 0 ? ' is-on' : '') + '" aria-pressed="' + (st.used.indexOf(u[0]) >= 0) + '" data-u="' + u[0] + '">' + u[1] + '</button>'; }).join('') + '</div>' +
          '<div class="q-row"><button class="q-ghost" type="button" data-q="none">None of these</button><button class="q-go" type="button" data-q="next"' + (st.used.length ? '' : ' disabled') + ' data-focus>Next ' + ARROW + '</button></div>');
      } else if (st.step === 'often') {
        screen(progress(2) + '<p class="q-k">Question 2 of ' + total + '</p><h3 class="q-h">In the past 3 months, how often did you use the one you use most?</h3>' +
          '<div class="q-list">' + OFTEN.map(function (o, i) { return '<button type="button" class="q-opt" data-o="' + i + '"' + (i ? '' : ' data-focus') + '>' + o + '</button>'; }).join('') +
          '<button type="button" class="q-opt" data-o="-2">Not in the past 3 months</button></div>' + back());
      } else if (st.step === 'sign') {
        var i = st.i;
        screen(progress(3 + i) + '<p class="q-k">Question ' + (3 + i) + ' of ' + total + ' · the past year</p><h3 class="q-h q-h--big">' + SIGNS[i] + '</h3>' +
          '<div class="q-yn"><button type="button" class="q-y" data-a="1" data-focus>Yes</button><button type="button" class="q-n" data-a="0">No</button></div>' + back());
      } else if (st.step === 'safety') {
        screen(progress(total) + '<p class="q-k">Last question</p><h3 class="q-h">' + SAFETY + '</h3>' +
          '<div class="q-yn"><button type="button" class="q-y" data-s="1" data-focus>Yes</button><button type="button" class="q-n" data-s="0">No</button></div>' + back());
      } else if (st.step === 'none') {
        screen('<p class="q-k">Your result</p><h3 class="q-h">Then this check isn’t about you right now.</h3>' +
          '<p class="q-p">That’s good. If you’re here because of someone you care about, the counsellor can help you work out what to say to them, and 14446 gives advice to families and friends too.</p>' +
          '<div class="q-acts"><a class="q-go" href="counsellor.html">Talk about a friend ' + ARROW + '</a><a class="q-ghost" href="tel:14446">Call 14446</a></div>' +
          '<button class="q-again" type="button" data-q="again">Start again</button>');
      } else if (st.step === 'result') result();
    }
    function result() {
      var n = st.yes.filter(Boolean).length;
      var band = n <= 1 ? 0 : n <= 3 ? 1 : n <= 5 ? 2 : 3;
      var B = [
        { h: 'Few signs right now.', p: 'You said yes to ' + n + ' of the 11 signs doctors look for. That’s good. If you do use, using less and never mixing things keeps you safer. If anything changes, this check is here, any time.' },
        { h: 'Some early signs.', p: 'You said yes to ' + n + ' of the 11 signs doctors look for. Doctors would call this a mild pattern, and it is the easiest point to change course. Talking it through once, with no name and no pressure, can really help.' },
        { h: 'Clear signs.', p: 'You said yes to ' + n + ' of the 11 signs doctors look for. Doctors would call this a moderate pattern. It’s worth talking to someone soon: a counsellor at 14446 (free, any hour, no name needed), or a walk-in centre near you.' },
        { h: 'Strong signs. Please don’t do this alone.', p: 'You said yes to ' + n + ' of the 11 signs doctors look for. Doctors would call this a severe pattern, and that is exactly what free help in India is for. Asking for treatment is confidential, and the law protects a person who volunteers for it (Section 64A).' },
      ][band];
      var daily = st.often === 3;
      var warn = '';
      if (daily && (st.used.indexOf('alcohol') >= 0 || st.used.indexOf('pills') >= 0)) warn += '<p class="q-warn"><b>Don’t stop suddenly on your own.</b> With daily alcohol or sleeping pills, stopping all at once can cause fits and can be dangerous. A doctor can help you stop safely, for free.</p>';
      if (st.used.indexOf('opioids') >= 0) warn += '<p class="q-warn"><b>After any break, your body can take far less.</b> Going back to the old amount after a gap is when most overdoses happen. Never use alone.</p>';
      if (st.used.length > 1) warn += '<p class="q-warn"><b>Mixing is the other big danger,</b> especially alcohol, sleeping pills or cough syrup on top of each other.</p>';
      var dots = '';
      for (var i = 0; i < 11; i++) dots += '<i class="' + (i < n ? 'is-on' : '') + '" style="--i:' + i + '"></i>';
      screen(
        (st.safety ? sos([['14416', 'Tele-MANAS · talk now'], ['112', 'Emergency'], ['108', 'Ambulance']], 'Please talk to someone today.', 'Free, any hour, in Tamil and Hindi too. If someone is unconscious or not breathing well, call 108 now and stay with them.') : '') +
        '<p class="q-k">Your result · nothing was saved</p><div class="q-dots q-dots--' + band + '" aria-label="' + n + ' of 11 signs">' + dots + '</div>' +
        '<h3 class="q-h">' + B.h + '</h3><p class="q-p">' + B.p + '</p>' + warn +
        '<div class="q-acts">' +
        (band >= 2 ? '<a class="q-go" href="tel:14446">Call 14446, free ' + ARROW + '</a><a class="q-ghost" href="counsellor.html">Talk to the counsellor</a>'
                   : '<a class="q-go" href="counsellor.html">Talk to the counsellor ' + ARROW + '</a><a class="q-ghost" href="tel:14446">Call 14446</a>') +
        '<a class="q-ghost" href="#near">Help near me</a><a class="q-ghost" href="#timer">Cravings timer</a><a class="q-ghost" href="how-to-quit-drugs.html">How to quit</a></div>' +
        '<p class="q-fine">Based on the 11 signs doctors use to recognise a substance use problem (DSM-5). This is not a diagnosis; only a doctor can say that.</p>' +
        '<button class="q-again" type="button" data-q="again">Start again</button>');
    }
    quiz.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b || !quiz.contains(b)) return;
      var q = b.dataset.q;
      st.dir = 1;
      if (q === 'start') { st.step = 'what'; }
      else if (q === 'again') { reset(); return; }
      else if (q === 'none') { st.step = 'none'; }
      else if (q === 'next') { st.step = 'often'; }
      else if (q === 'back') {
        st.dir = -1;
        if (st.step === 'often') st.step = 'what';
        else if (st.step === 'sign') { if (st.i) st.i--; else st.step = 'often'; }
        else if (st.step === 'safety') { st.step = 'sign'; st.i = SIGNS.length - 1; }
      } else if (b.dataset.u) {
        var k = b.dataset.u, at = st.used.indexOf(k);
        if (at >= 0) st.used.splice(at, 1); else st.used.push(k);
        b.classList.toggle('is-on', at < 0); b.setAttribute('aria-pressed', String(at < 0));
        quiz.querySelector('[data-q="next"]').disabled = !st.used.length;
        return;
      } else if (b.dataset.o) {
        st.often = +b.dataset.o; st.step = 'sign'; st.i = 0;
      } else if (b.dataset.a) {
        st.yes[st.i] = b.dataset.a === '1';
        if (st.i < SIGNS.length - 1) st.i++; else st.step = 'safety';
      } else if (b.dataset.s) {
        st.safety = b.dataset.s === '1'; st.step = 'result';
      }
      render();
    });
    reset();
  })();

  /* ════════════════════════ 2 · THE CRAVINGS TIMER ════════════════════════
     Pick how long, rate the urge, then breathe with the light: in for four,
     out for six. The flame flickers hard at first and steadies as the time
     runs down. A line of encouragement changes every so often. At the end,
     rate the urge again and see the difference. */
  var urge = $('[data-urge]');
  if (urge) (function () {
    var LINES = [
      'An urge is like a wave. It rises, peaks, and passes on its own.',
      'You don’t have to fight it. Just watch it, like weather.',
      'Notice where you feel it in your body. Breathe into that spot.',
      'Drink a glass of water, slowly.',
      'Think of one reason you want this to change.',
      'It is already smaller than when you started.',
      'Text someone you trust, or call 14446. It’s free.',
      'You have ridden out urges before. You can do it again.',
      'Unclench your jaw. Drop your shoulders. Breathe out long.',
      'Every urge you ride out makes the next one weaker.',
    ];
    var IN = 4000, OUT = 6000, CYCLE = IN + OUT;
    var mins = 10, t0 = 0, paused = 0, pauseAt = 0, raf = 0, phase = '', before = 0, lock = null, vib = !!navigator.vibrate;
    var count = get('abwh-urges', 0) || 0;
    function rate(name, label) {
      var h = '<p class="u-rate-l">' + label + '</p><div class="u-rate" role="group" aria-label="' + label + '">';
      for (var i = 1; i <= 5; i++) h += '<button type="button" data-' + name + '="' + i + '" aria-label="' + i + ' of 5">' + i + '</button>';
      return h + '</div><p class="u-rate-k"><span>A little</span><span>Very strong</span></p>';
    }
    function setup() {
      cancelAnimationFrame(raf); release();
      urge.innerHTML = '<div class="u-setup">' +
        '<div class="u-flame u-flame--idle" aria-hidden="true">' + FLAME + '</div>' +
        '<p class="u-k">How long?</p><div class="u-mins" role="group" aria-label="How long">' +
        [5, 10, 15].map(function (m) { return '<button type="button" data-m="' + m + '" class="' + (m === mins ? 'is-on' : '') + '" aria-pressed="' + (m === mins) + '">' + m + ' min</button>'; }).join('') + '</div>' +
        rate('b', 'How strong is the urge right now?') +
        '<button type="button" class="u-start" data-u="start">Start breathing ' + ARROW + '</button>' +
        (count ? '<p class="u-count">Urges ridden out on this device: <b>' + count + '</b></p>' : '') +
        '</div>';
    }
    function run() {
      t0 = Date.now(); paused = 0; pauseAt = 0; phase = '';
      urge.innerHTML = '<div class="u-run">' +
        '<div class="u-ring">' +
          '<svg viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="92" class="u-track"/><circle cx="100" cy="100" r="92" class="u-prog" pathLength="1000"/></svg>' +
          '<div class="u-breath"></div>' +
          '<div class="u-flame" aria-hidden="true">' + FLAME + '</div>' +
        '</div>' +
        '<p class="u-say" aria-live="polite">Breathe in…</p>' +
        '<p class="u-time" aria-hidden="true">' + mins + ':00</p>' +
        '<p class="u-line" aria-live="polite">' + LINES[0] + '</p>' +
        '<div class="u-ctl"><button type="button" class="u-ghost" data-u="pause">Pause</button><button type="button" class="u-ghost" data-u="stop">Stop</button></div>' +
        '</div>';
      try { if (navigator.wakeLock) navigator.wakeLock.request('screen').then(function (l) { lock = l; }, function () {}); } catch (e) {}
      tick();
    }
    function release() { if (lock) { try { lock.release(); } catch (e) {} lock = null; } }
    function tick() {
      var el = urge.querySelector('.u-run');
      if (!el) return;
      var now = pauseAt || Date.now(), ms = now - t0 - paused, dur = mins * 60e3, left = Math.max(0, dur - ms), u = Math.min(1, ms / dur);
      el.querySelector('.u-prog').style.strokeDashoffset = String(1000 * u);
      var s = Math.ceil(left / 1000);
      el.querySelector('.u-time').textContent = Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2);
      /* the breath: in for four, out for six */
      var c = ms % CYCLE, inhale = c < IN, k = inhale ? c / IN : 1 - (c - IN) / OUT;
      el.style.setProperty('--b', (reduced ? .5 : (inhale ? easeIO(k) : easeIO(k))).toFixed(3));
      var ph = inhale ? 'in' : 'out';
      if (ph !== phase && !pauseAt) {
        phase = ph;
        el.querySelector('.u-say').textContent = inhale ? 'Breathe in…' : 'Breathe out, slowly…';
        if (vib) try { navigator.vibrate(inhale ? 18 : 8); } catch (e) {}
      }
      /* the flame calms as the time runs down */
      el.style.setProperty('--wild', (1 - u * .85).toFixed(3));
      var li = Math.min(LINES.length - 1, Math.floor(ms / Math.max(30e3, dur / LINES.length)));
      var lineEl = el.querySelector('.u-line');
      if (lineEl.dataset.i !== String(li)) { lineEl.dataset.i = li; lineEl.classList.remove('is-new'); void lineEl.offsetWidth; lineEl.classList.add('is-new'); lineEl.textContent = LINES[li]; }
      if (left <= 0) return done();
      raf = requestAnimationFrame(tick);
    }
    function easeIO(x) { return x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; }
    function done() {
      release();
      count++; put('abwh-urges', count);
      if (vib) try { navigator.vibrate([30, 60, 30]); } catch (e) {}
      urge.innerHTML = '<div class="u-done">' +
        '<div class="u-flame u-flame--calm" aria-hidden="true">' + FLAME + '</div>' +
        '<p class="u-k">' + mins + ' minutes</p><h3 class="u-h">You rode it out.</h3>' +
        '<p class="u-p">That’s ' + count + (count === 1 ? ' urge' : ' urges') + ' ridden out on this device. Each one makes the next a little easier.</p>' +
        rate('a', 'How strong is it now?') +
        '<p class="u-diff" data-diff></p>' +
        '<div class="u-ctl"><button type="button" class="u-start" data-u="again">Again</button><a class="u-ghost" href="counsellor.html">Talk to the counsellor</a><a class="u-ghost" href="tel:14446">Call 14446</a></div>' +
        '</div>';
    }
    urge.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b || !urge.contains(b)) return;
      if (b.dataset.m) { mins = +b.dataset.m; urge.querySelectorAll('[data-m]').forEach(function (x) { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', String(x === b)); }); return; }
      if (b.dataset.b) { before = +b.dataset.b; urge.querySelectorAll('[data-b]').forEach(function (x) { x.classList.toggle('is-on', +x.dataset.b <= before); }); return; }
      if (b.dataset.a) {
        var after = +b.dataset.a;
        urge.querySelectorAll('[data-a]').forEach(function (x) { x.classList.toggle('is-on', +x.dataset.a <= after); });
        var d = urge.querySelector('[data-diff]');
        d.innerHTML = before
          ? (after < before ? 'From <b>' + before + '</b> to <b>' + after + '</b>. It passed, just like a wave.' : after === before ? 'Still <b>' + after + '</b>. That’s okay: try another round, or talk to someone now.' : 'Up to <b>' + after + '</b>. Please don’t sit with it alone: call <a href="tel:14446">14446</a> or talk to the counsellor.')
          : 'Thanks. Notice how it feels now compared with when you started.';
        return;
      }
      var u = b.dataset.u;
      if (u === 'start' || u === 'again') { if (u === 'again') before = 0; if (u === 'again') { setup(); return; } run(); }
      else if (u === 'pause') {
        if (pauseAt) { paused += Date.now() - pauseAt; pauseAt = 0; b.textContent = 'Pause'; urge.querySelector('.u-run').classList.remove('is-paused'); phase = ''; }
        else { pauseAt = Date.now(); b.textContent = 'Resume'; urge.querySelector('.u-run').classList.add('is-paused'); urge.querySelector('.u-say').textContent = 'Paused'; }
      } else if (u === 'stop') setup();
    });
    setup();
  })();

  /* ════════════════════════ 3 · HELP NEAR ME ════════════════════════
     From the device's location (or, for a judge on a computer, a sample
     city): hospitals, de-addiction and mental-health places nearby, drawn
     round the reader like embers round a lamp, and listed nearest first.
     Live from OpenStreetMap; the sample cities are saved with the site
     (data/near.js), so the demo works without a connection too. */
  var near = $('[data-near]');
  if (near) (function () {
    var DATA = window.NEAR_DATA || { cities: {} };
    var CITIES = Object.keys(DATA.cities).map(function (id) { var c = DATA.cities[id]; return { id: id, name: c.name, lat: c.lat, lng: c.lng }; });
    var MIRRORS = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter', 'https://overpass.private.coffee/api/interpreter'];
    var touch = window.matchMedia('(pointer: coarse)').matches;
    var KIND = {
      addiction: { l: 'De-addiction', c: 'k-add' },
      mind: { l: 'Mental health', c: 'k-mind' },
      hospital: { l: 'Hospital', c: 'k-hosp' },
    };
    function query(lat, lng) {
      return '[out:json][timeout:25];(' +
        'nwr(around:8000,' + lat + ',' + lng + ')["amenity"="hospital"];' +
        'nwr(around:20000,' + lat + ',' + lng + ')["healthcare"~"psychiatry|psychotherapist|counselling|rehabilitation"];' +
        'nwr(around:20000,' + lat + ',' + lng + ')["healthcare:speciality"~"psychiatry|addiction"];' +
        'nwr(around:15000,' + lat + ',' + lng + ')["amenity"~"clinic|doctors|social_facility"]["name"~"addiction|nasha|rehab|psychiatr|mental|mind",i];' +
        ');out center tags;';
    }
    function kind(t) {
      var name = (t.name || t['name:en'] || ''), lo = name.toLowerCase(), care = ((t.healthcare || '') + ' ' + (t['healthcare:speciality'] || '')).toLowerCase();
      var hosp = t.amenity === 'hospital' || /hospital/.test(t.healthcare || '');
      if (/physio|ortho|spine|stroke|cardi|\beye\b|dental|derma|cosmetic|fertility|ivf|veterinar|animal|pet /.test(lo)) return hosp ? 'hospital' : null;
      if (/de-?addiction|nasha|addiction|drug|alcohol|\birca\b|\bodic\b|rehab(ilitation)? cent/.test(lo) || /addiction/.test(care)) return 'addiction';
      if (/psychiatr|mental|psycholog|counsel|nimhans|\bimh\b|\bmind\b/.test(lo) || /psychiatry|psychotherapist|counselling/.test(care)) return 'mind';
      if (hosp) return 'hospital';
      return null;
    }
    function gov(t) {
      var s = ((t.name || '') + ' ' + (t['name:en'] || '') + ' ' + (t.operator || '')).toLowerCase();
      return /government|govt|\bg\.?h\b|district|medical college|aiims|\besi\b|esic|municipal|corporation|primary health|\bphc\b|\bchc\b|taluk|railway|jipmer|nimhans|institute of mental health|civil hospital|general hospital|state/.test(s) ||
        t['operator:type'] === 'government' || t['operator:type'] === 'public';
    }
    function dist(a, b) {
      var R = 6371, dLat = (b.lat - a.lat) * Math.PI / 180, dLng = (b.lng - a.lng) * Math.PI / 180;
      var x = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
      return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
    }
    function bearing(a, b) {
      var y = Math.sin((b.lng - a.lng) * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180);
      var x = Math.cos(a.lat * Math.PI / 180) * Math.sin(b.lat * Math.PI / 180) - Math.sin(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.cos((b.lng - a.lng) * Math.PI / 180);
      return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
    }
    var DIRS = ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west'];
    function km(d) { return d < 1 ? Math.round(d * 1000 / 10) * 10 + ' m' : d.toFixed(d < 10 ? 1 : 0) + ' km'; }

    function start() {
      near.innerHTML = '<div class="n-start">' +
        '<div class="n-radar n-radar--idle" aria-hidden="true">' + radar([], null) + '</div>' +
        '<div class="n-start__b">' +
          '<button type="button" class="n-go" data-n="locate"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 2v3M12 19v3M2 12h3M19 12h3M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>Use my location</button>' +
          (CITIES.length ? '<p class="n-or">' + (touch ? 'or try a sample city' : 'On a computer? Try a sample city (expo demo)') + '</p>' +
          '<div class="n-cities">' + CITIES.map(function (c) { return '<button type="button" data-city="' + c.id + '">' + esc(c.name) + '</button>'; }).join('') + '</div>' : '') +
          '<p class="n-note">Your location is used only to search. It is never saved.</p>' +
        '</div></div>' + lines();
    }
    function lines() {
      return '<div class="n-lines"><a href="tel:14446"><b>14446</b><span>Your nearest government centre</span></a><a href="tel:14416"><b>14416</b><span>Tele-MANAS · 24 hours</span></a><a href="tel:112"><b>112</b><span>Emergency</span></a></div>';
    }
    function busy(msg) {
      near.innerHTML = '<div class="n-start"><div class="n-radar n-radar--scan" aria-hidden="true">' + radar([], null) + '</div><div class="n-start__b"><p class="n-busy" role="status">' + msg + '</p></div></div>' + lines();
    }
    function fail(msg) {
      start();
      var b = near.querySelector('.n-start__b');
      b.insertAdjacentHTML('afterbegin', '<p class="n-err" role="alert">' + msg + '</p>');
    }
    function locate() {
      if (!navigator.geolocation) { fail('This browser can’t share its location. Try a sample city, or call 14446 to find your nearest centre.'); return; }
      busy('Finding where you are…');
      navigator.geolocation.getCurrentPosition(function (p) {
        search({ lat: p.coords.latitude, lng: p.coords.longitude }, 'Near you', false);
      }, function (e) {
        fail(e.code === 1 ? 'Location is switched off for this site. Allow it in your browser, or try a sample city.' : 'Couldn’t find your location just now. Try again, or pick a sample city.');
      }, { enableHighAccuracy: false, timeout: 15000, maximumAge: 300000 });
    }
    function ask(q) {
      var i = 0;
      function next() {
        if (i >= MIRRORS.length) return Promise.reject('none');
        var m = MIRRORS[i++], ctrl = window.AbortController ? new AbortController() : null;
        var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 22000);
        return fetch(m, { method: 'POST', body: 'data=' + encodeURIComponent(q), headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, signal: ctrl ? ctrl.signal : undefined })
          .then(function (r) { clearTimeout(timer); if (!r.ok) throw r.status; return r.json(); })
          .then(function (j) { if (j.remark && /error|timed out/i.test(j.remark)) throw j.remark; return j; })
          .catch(function () { clearTimeout(timer); return next(); });
      }
      return next();
    }
    function search(at, label, demo) {
      busy(demo ? 'Looking around ' + esc(label) + '…' : 'Looking for help around you…');
      ask(query(at.lat.toFixed(5), at.lng.toFixed(5))).then(function (j) {
        var raw = (j.elements || []).map(function (e) {
          var lat = e.lat != null ? e.lat : e.center && e.center.lat, lng = e.lon != null ? e.lon : e.center && e.center.lon;
          return lat == null ? null : { lat: lat, lng: lng, t: e.tags || {} };
        }).filter(Boolean);
        show(at, label, raw, demo, false);
      }, function () {
        /* offline, or the map service is busy: a saved city if one is close */
        var best = null, bd = Infinity;
        CITIES.forEach(function (c) { var d = dist(at, c); if (d < bd) { bd = d; best = c; } });
        if (best && (demo || bd < 60)) show(demo ? at : best, demo ? label : best.name, DATA.cities[best.id].places, demo, true);
        else fail('The map service didn’t answer just now. Check your internet and try again, or call 14446: they will tell you your nearest government centre.');
      });
    }
    function city(id) {
      var c = DATA.cities[id];
      if (!c) return;
      /* the saved places first, at once; then a fresh look if online */
      show({ lat: c.lat, lng: c.lng }, c.name, c.places, true, true);
    }
    var current = null;
    function show(at, label, raw, demo, saved) {
      var seen = {}, all = [];
      raw.forEach(function (p) {
        var t = p.t || {}, name = t['name:en'] || t.name;
        if (!name) return;
        var k = kind(t);
        if (!k) return;
        var key = name.toLowerCase().replace(/\W+/g, '');
        if (seen[key]) return;
        seen[key] = 1;
        var d = dist(at, p);
        all.push({ name: name, k: k, gov: gov(t), d: d, b: bearing(at, p), lat: p.lat, lng: p.lng, ph: (t.phone || t['contact:phone'] || '').split(/[;,]/)[0].trim(), street: t['addr:street'] || '' });
      });
      all.sort(function (a, b) { return a.d - b.d; });
      var special = all.filter(function (p) { return p.k !== 'hospital'; }).slice(0, 8);
      var hosp = all.filter(function (p) { return p.k === 'hospital'; });
      /* government hospitals first among the near ones: that is where the
         Addiction Treatment Facilities are */
      var nearH = hosp.slice(0, 12).sort(function (a, b) { return (b.gov - a.gov) || (a.d - b.d); }).slice(0, 6);
      var list = special.concat(nearH).sort(function (a, b) { return a.d - b.d; });
      current = { at: at, list: list, filter: 'all' };
      if (!list.length) {
        fail('No places are marked on the public map near ' + esc(label) + ' yet. Call 14446: they know every government centre and will tell you the nearest one.');
        return;
      }
      near.innerHTML =
        '<div class="n-top"><p class="n-where">' + (demo ? '<span class="n-demo">Expo demo</span>' : '') + '<b>' + esc(label) + '</b> · ' + list.length + ' places within ' + km(Math.max.apply(null, list.map(function (p) { return p.d; }))) + '</p>' +
        '<button type="button" class="n-ghost" data-n="restart">Change place</button></div>' +
        '<div class="n-res"><div class="n-radar" aria-hidden="true">' + radar(list, at) + '</div>' +
        '<div class="n-side"><div class="n-filters" role="group" aria-label="Show">' +
          [['all', 'All'], ['addiction', 'De-addiction'], ['mind', 'Mental health'], ['hospital', 'Hospitals']].map(function (f) {
            var n = f[0] === 'all' ? list.length : list.filter(function (p) { return p.k === f[0]; }).length;
            return '<button type="button" data-f="' + f[0] + '" class="' + (f[0] === 'all' ? 'is-on' : '') + '"' + (n ? '' : ' disabled') + '>' + f[1] + ' <i>' + n + '</i></button>';
          }).join('') + '</div>' +
        '<ol class="n-list" role="list">' + list.map(function (p, i) {
          return '<li class="n-p ' + KIND[p.k].c + '" data-i="' + i + '" style="--i:' + i + '">' +
            '<span class="n-p__dot" aria-hidden="true"></span>' +
            '<div class="n-p__b"><p class="n-p__n">' + esc(p.name) + '</p>' +
            '<p class="n-p__m"><span class="n-tag">' + KIND[p.k].l + '</span>' + (p.gov ? '<span class="n-tag n-tag--gov">Government</span>' : '') + '<span>' + km(p.d) + ' ' + DIRS[Math.round(p.b / 45) % 8] + '</span></p>' +
            '<p class="n-p__a"><a href="https://www.google.com/maps/dir/?api=1&destination=' + p.lat.toFixed(5) + ',' + p.lng.toFixed(5) + '" target="_blank" rel="noopener noreferrer">Directions ↗</a>' +
            (p.ph ? '<a href="tel:' + esc(p.ph.replace(/[^\d+]/g, '')) + '">Call</a>' : '') + '</p></div></li>';
        }).join('') + '</ol></div></div>' +
        '<p class="n-fine">Places from OpenStreetMap, a public map anyone can edit' + (saved && DATA.fetched ? ' (saved ' + esc(DATA.fetched) + ')' : '') + '. It may be out of date and is not a list of approved centres: always call before you go. Government hospitals often have an Addiction Treatment Facility inside; ask for it. 14446 knows every recognised centre.</p>' +
        lines();
      if (!reduced) near.querySelector('.n-res').classList.add('is-in');
    }
    /* the radar: the reader at the centre, a lamp; places as embers, at
       their real direction, nearer ones nearer the middle */
    function radar(list, at) {
      var max = list.length ? Math.max(5, Math.max.apply(null, list.map(function (p) { return p.d; }))) : 20;
      var rings = [1, 2, 5, 10, 20].filter(function (r) { return r <= max * 1.05; });
      if (!rings.length || rings[rings.length - 1] < max) rings.push(Math.ceil(max));
      var R = 132, sc = function (d) { return Math.sqrt(Math.min(d, max) / max) * R; };
      var s = '<svg viewBox="0 0 300 300"><defs><radialGradient id="nGlow"><stop offset="0" stop-color="#ffd890" stop-opacity=".9"/><stop offset=".35" stop-color="#e2a24e" stop-opacity=".35"/><stop offset="1" stop-color="#e2a24e" stop-opacity="0"/></radialGradient>' +
        '<linearGradient id="nSweep" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d1a866" stop-opacity="0"/><stop offset="1" stop-color="#d1a866" stop-opacity=".35"/></linearGradient></defs>';
      rings.forEach(function (r) {
        var rr = sc(r);
        s += '<circle cx="150" cy="150" r="' + rr.toFixed(1) + '" class="n-ring"/>' + (list.length ? '<text x="' + (150 + rr * .707 + 3).toFixed(1) + '" y="' + (150 - rr * .707 - 3).toFixed(1) + '" class="n-rl">' + r + ' km</text>' : '');
      });
      s += '<path d="M150 18V282M18 150H282" class="n-axis"/><text x="150" y="12" class="n-nl">N</text>';
      s += '<g class="n-sweep"><path d="M150 150 L282 150 A132 132 0 0 0 243.3 56.7 Z" fill="url(#nSweep)"/></g>';
      s += '<circle cx="150" cy="150" r="46" fill="url(#nGlow)" class="n-you-glow"/><circle cx="150" cy="150" r="5" class="n-you"/>';
      list.forEach(function (p, i) {
        var a = (p.b - 90) * Math.PI / 180, r = sc(p.d), x = 150 + Math.cos(a) * r, y = 150 + Math.sin(a) * r;
        s += '<g class="n-dot ' + KIND[p.k].c + '" data-i="' + i + '" style="--i:' + i + '"><circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="11" class="n-dot__halo"/><circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="4.5" class="n-dot__c"/></g>';
      });
      return s + '</svg>';
    }
    function pick(i) {
      near.querySelectorAll('.n-p, .n-dot').forEach(function (x) { x.classList.toggle('is-pick', x.dataset.i === String(i)); });
      var li = near.querySelector('.n-p[data-i="' + i + '"]');
      if (li) { var list = near.querySelector('.n-list'); list.scrollTo({ top: li.offsetTop - list.offsetTop - 8, behavior: reduced ? 'auto' : 'smooth' }); }
    }
    near.addEventListener('click', function (e) {
      var b = e.target.closest('button, .n-dot, .n-p');
      if (!b || !near.contains(b)) return;
      if (b.dataset.n === 'locate') locate();
      else if (b.dataset.n === 'restart') start();
      else if (b.dataset.city) city(b.dataset.city);
      else if (b.dataset.f) {
        var f = b.dataset.f;
        near.querySelectorAll('[data-f]').forEach(function (x) { x.classList.toggle('is-on', x === b); });
        near.querySelectorAll('.n-p, .n-dot').forEach(function (x) { var p = current.list[+x.dataset.i]; x.classList.toggle('is-hid', f !== 'all' && p.k !== f); });
      } else if (b.classList.contains('n-dot')) pick(b.dataset.i);
      else if (b.classList.contains('n-p') && !e.target.closest('a')) pick(b.dataset.i);
    });
    start();
  })();
})();
