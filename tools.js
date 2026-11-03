/* ── The help tools ─────────────────────────────────────────────────────────
   The self-check, the cravings timer and Find help near me, on /tools. A
   classic script, not a module, so it also runs when the built site is
   opened straight from a folder. Nothing here is saved or sent anywhere,
   except two small things kept on this device: how many urges the timer has
   seen out, and nothing else. Find help near me hands its search to
   Google Maps, and nothing else. */
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
    /* the extra questions the AI read-out uses */
    var AMOUNT = ['1 or 2', '3 to 5', '6 to 10', 'More than 10'];
    var AMOUNT_N = [2, 4, 8, 12];
    var UNIT = { alcohol: 'drinks', tobacco: 'cigarettes', cannabis: 'joints', pills: 'pills or doses', inhalants: 'times', opioids: 'doses', stimulants: 'times' };
    var WANT = ['Cut down slowly', 'Stop completely', 'Just understand where I am', 'I’m not sure yet'];
    var MOOD = ['Very low', 'Low', 'Okay', 'Good', 'Great'];
    var SAFETY = 'In the past month, have you had thoughts of hurting yourself, or has using left you or someone with you unconscious or struggling to breathe?';
    var st;
    function reset() { st = { step: 'intro', used: [], often: -1, amount: -1, want: -1, mood: -1, note: '', yes: [], safety: null, i: 0, dir: 1 }; render(); }
    var total = SIGNS.length + 7; // what, how often, how much, the signs, want, mood, a note, safety
    function unit() { return UNIT[st.used[0]] || 'times'; }
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
      } else if (st.step === 'amount') {
        screen(progress(3) + '<p class="q-k">Question 3 of ' + total + '</p><h3 class="q-h">On a day you use, how much, roughly?</h3><p class="q-p">Counted in ' + unit() + '.</p>' +
          '<div class="q-list">' + AMOUNT.map(function (o, i) { return '<button type="button" class="q-opt" data-am="' + i + '"' + (i ? '' : ' data-focus') + '>' + o + ' ' + unit() + '</button>'; }).join('') + '</div>' + back());
      } else if (st.step === 'want') {
        screen(progress(SIGNS.length + 4) + '<p class="q-k">Question ' + (SIGNS.length + 4) + ' of ' + total + '</p><h3 class="q-h">What do you want right now?</h3><p class="q-p">Any answer is fine. You don’t have to stop all at once.</p>' +
          '<div class="q-list">' + WANT.map(function (o, i) { return '<button type="button" class="q-opt" data-w="' + i + '"' + (i ? '' : ' data-focus') + '>' + o + '</button>'; }).join('') + '</div>' + back());
      } else if (st.step === 'mood') {
        screen(progress(SIGNS.length + 5) + '<p class="q-k">Question ' + (SIGNS.length + 5) + ' of ' + total + '</p><h3 class="q-h">How have you been feeling, most days this month?</h3>' +
          '<div class="q-list q-list--mood">' + MOOD.map(function (o, i) { return '<button type="button" class="q-opt" data-md="' + i + '"' + (i ? '' : ' data-focus') + '>' + o + '</button>'; }).join('') + '</div>' + back());
      } else if (st.step === 'note') {
        screen(progress(SIGNS.length + 6) + '<p class="q-k">Question ' + (SIGNS.length + 6) + ' of ' + total + ' · optional</p><h3 class="q-h">Anything else the AI should know?</h3><p class="q-p">When you use, why, what you have tried. Don’t write your name.</p>' +
          '<textarea class="q-note" rows="3" maxlength="400" placeholder="Optional" data-note-in>' + esc(st.note) + '</textarea>' +
          '<div class="q-row"><button class="q-ghost" type="button" data-q="skip">Skip</button><button class="q-go" type="button" data-q="noted" data-focus>Next ' + ARROW + '</button></div>' + back());
      } else if (st.step === 'sign') {
        var i = st.i;
        screen(progress(4 + i) + '<p class="q-k">Question ' + (4 + i) + ' of ' + total + ' · the past year</p><h3 class="q-h q-h--big">' + SIGNS[i] + '</h3>' +
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
        '<div class="q-ai" data-ai><p class="q-ai__k"><span class="q-ai__spark" aria-hidden="true"></span>Your AI read-out</p><div class="q-ai__body" data-ai-body><span class="q-typing"><i></i><i></i><i></i></span></div></div>' +
        '<p class="q-fine">Based on the 11 signs doctors use to recognise a substance use problem (DSM-5). This is not a diagnosis; only a doctor can say that.</p>' +
        '<button class="q-again" type="button" data-q="again">Start again</button>');
      readout(n, band);
    }

    /* ── the AI read-out: Gemini reads the answers, writes a short personal
       note, and sets up the Reboot dashboard with commands
       (reboot-store.js applies them) ── */
    var AI_SYSTEM = [
      'You read the answers to a private self-check on अभी भी वक़्त है ("There is still time"), an Indian website reviewed by two doctors that helps people with drugs, alcohol and tobacco. You are not a doctor and you never diagnose.',
      'Write a warm, plain-English read-out of 3 very short paragraphs (under 100 words in all): 1) what their answers show, kindly and honestly, using their numbers; 2) the single most useful next step for them; 3) one safety point that fits what they use.',
      'Safety rules: never advise stopping alcohol, sleeping pills, benzodiazepines or opioids all at once without a doctor; stopping those suddenly can be dangerous. After a break, tolerance drops and the old amount can cause an overdose. Mixing sedatives is the biggest danger. Free help: 14446 (drug helpline, any hour, no name), 14416 (Tele-MANAS, mental health), 112 (emergency). Section 64A of the NDPS Act protects a person who volunteers for treatment at a government-recognised centre.',
      'Then set up their private Reboot dashboard (a daily cut-down log) with command lines that the page reads and hides, each on its own line:',
      '[[SETUP substance | usual daily amount | unit]] substance is one of alcohol, cannabis, tobacco, pills, other; use the amount and unit they gave.',
      '[[GOAL n]] a first gentle daily target, about 10 to 25 percent below their usual amount (never 0 for alcohol, pills or opioids used daily).',
      '[[FOCUS text]] one focus for their first week, under 60 characters.',
      '[[STEP text]] up to 3 small concrete steps, under 70 characters each.',
      '[[TIP text]] one practical tip under 90 characters.',
      '[[SOS]] only if they said yes to the safety question.',
      'If they said they used none of these, skip SETUP and GOAL. Never mention the commands, this format, or the technology behind you.',
    ].join('\n');
    function readout(n, band) {
      var body = quiz.querySelector('[data-ai-body]');
      if (!body) return;
      if (!window.abwhAI || !window.abwhReboot) { quiz.querySelector('[data-ai]').remove(); return; }
      var names = st.used.map(function (k) { return USED.filter(function (u) { return u[0] === k; })[0][1]; });
      var answers = {
        uses: names, most_used: names[0], how_often_last_3_months: OFTEN[st.often] || 'not in the past 3 months',
        amount_on_a_using_day: st.amount >= 0 ? AMOUNT[st.amount] + ' ' + unit() : 'not given', amount_number: st.amount >= 0 ? AMOUNT_N[st.amount] : null, unit: unit(),
        signs_yes: SIGNS.filter(function (x, i) { return st.yes[i]; }), signs_count: n + ' of 11', band: ['few', 'mild', 'moderate', 'severe'][band],
        wants: WANT[st.want] || 'not said', mood_this_month: MOOD[st.mood] || 'not said', note: st.note || '', safety_question: st.safety ? 'YES' : 'no',
      };
      var R = window.abwhReboot, AI = window.abwhAI;
      AI.ask({ system: AI_SYSTEM, prompt: 'My answers: ' + JSON.stringify(answers), temperature: .6, maxTokens: 800,
        onText: function (t) { body.innerHTML = AI.md(AI.commands(t.replace(/\[\[[^\]]*$/, '')).text); } })
        .then(function (reply) {
          var r = AI.commands(reply), d = R.load();
          body.innerHTML = AI.md(r.text);
          var changed = R.apply(d, r.cmds);
          if (changed.length && d.what) {
            R.save(d);
            var a = document.createElement('a');
            a.className = 'q-go q-ai__go'; a.href = 'reboot.html';
            a.innerHTML = 'Open my Reboot dashboard ' + ARROW;
            var p = document.createElement('p'); p.className = 'q-ai__set';
            p.textContent = 'Your daily log is set up: ' + (d.goal ? 'a first target of ' + d.goal + ' ' + d.unit + ' a day' : 'ready when you are') + (d.focus ? ', and a focus for this week.' : '.');
            body.appendChild(p); body.appendChild(a);
          }
        }, function (e) {
          body.innerHTML = '<p>' + (e && e.offline ? 'The AI read-out needs the internet. Your result above works offline.' : 'The AI is busy right now. Your result above still stands; try again in a minute.') + '</p>';
        });
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
        else if (st.step === 'amount') st.step = 'often';
        else if (st.step === 'sign') { if (st.i) st.i--; else st.step = st.often === -2 ? 'often' : 'amount'; }
        else if (st.step === 'want') { st.step = 'sign'; st.i = SIGNS.length - 1; }
        else if (st.step === 'mood') st.step = 'want';
        else if (st.step === 'note') st.step = 'mood';
        else if (st.step === 'safety') st.step = 'note';
      } else if (b.dataset.u) {
        var k = b.dataset.u, at = st.used.indexOf(k);
        if (at >= 0) st.used.splice(at, 1); else st.used.push(k);
        b.classList.toggle('is-on', at < 0); b.setAttribute('aria-pressed', String(at < 0));
        quiz.querySelector('[data-q="next"]').disabled = !st.used.length;
        return;
      } else if (b.dataset.o) {
        st.often = +b.dataset.o; st.i = 0; st.step = st.often === -2 ? 'sign' : 'amount';
      } else if (b.dataset.am) {
        st.amount = +b.dataset.am; st.step = 'sign'; st.i = 0;
      } else if (b.dataset.w) {
        st.want = +b.dataset.w; st.step = 'mood';
      } else if (b.dataset.md) {
        st.mood = +b.dataset.md; st.step = 'note';
      } else if (q === 'skip' || q === 'noted') {
        var ta = quiz.querySelector('[data-note-in]');
        st.note = q === 'noted' && ta ? ta.value.trim().slice(0, 400) : ''; st.step = 'safety';
      } else if (b.dataset.a) {
        st.yes[st.i] = b.dataset.a === '1';
        if (st.i < SIGNS.length - 1) st.i++; else st.step = 'want';
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
     Two questions: where you are (typed, or this device's location) and
     what you need. Each kind of place is a link that opens Google Maps in a
     new tab with the search already done: "De-addiction centre near me", or
     "De-addiction centre in Erode or nearby". The map beside it shows the
     same search as you point at each one. */
  var nf = $('[data-nf]');
  if (nf) (function () {
    var place = $('[data-nf-place]', nf), msg = $('[data-nf-msg]', nf), frame = $('[data-nf-frame]', nf), blank = $('[data-nf-blank]', nf);
    var cap = $('[data-nf-cap]', nf), open = $('[data-nf-open]', nf), qOut = $('[data-nf-q]', nf), label = $('[data-nf-label]', nf);
    var kinds = nf.querySelectorAll('[data-nf-kind]'), at = null, shown = '', timer = 0, MSG = msg.textContent;
    var touch = window.matchMedia('(pointer: coarse)').matches;
    function phrase(k) { return at && at.name ? k + ' in ' + at.name + ' or nearby' : k + ' near me'; }
    function href(k) {
      var base = 'https://www.google.com/maps/search/' + encodeURIComponent(phrase(k)).replace(/%20/g, '+');
      return at && at.lat != null ? base + '/@' + at.lat.toFixed(4) + ',' + at.lng.toFixed(4) + ',13z' : base;
    }
    function embed(k) {
      var q = at && at.lat != null ? k + ' near ' + at.lat.toFixed(4) + ',' + at.lng.toFixed(4) : phrase(k);
      return 'https://maps.google.com/maps?q=' + encodeURIComponent(q) + '&z=12&output=embed';
    }
    function preview(k) {
      clearTimeout(timer);
      nf.querySelectorAll('[data-nf-kind]').forEach(function (a) { a.classList.toggle('is-hot', a.getAttribute('data-nf-kind') === k); });
      cap.textContent = phrase(k);
      open.href = href(k);
      qOut.textContent = phrase(k);
      timer = setTimeout(function () {
        if (!at.name && at.lat == null) { blank.querySelector('p').textContent = 'Google Maps will find where you are when it opens, and search around you.'; nf.classList.remove('has-map'); shown = ''; return; }
        if (!navigator.onLine) { blank.querySelector('p').textContent = 'You’re offline, so the map can’t load. It opens once you’re back online; 14446 works without the internet.'; return; }
        var u = embed(k);
        if (u === shown) return;
        shown = u; frame.src = u; nf.classList.add('has-map');
      }, 220);
    }
    function step(n) {
      nf.querySelectorAll('[data-nf-step]').forEach(function (x) { x.hidden = x.getAttribute('data-nf-step') !== String(n); });
      nf.querySelectorAll('[data-nf-dot]').forEach(function (x) { x.classList.toggle('is-on', +x.getAttribute('data-nf-dot') <= n); });
      nf.setAttribute('data-at', n);
    }
    function go(where) {
      at = where;
      label.textContent = at.name ? 'in ' + at.name + ' or nearby' : 'near you';
      kinds.forEach(function (a) { a.href = href(a.getAttribute('data-nf-kind')); });
      step(2);
      preview(kinds[0].getAttribute('data-nf-kind'));
      if (!touch) kinds[0].focus({ preventScroll: true });
    }
    $('[data-nf-form]', nf).addEventListener('submit', function (e) {
      e.preventDefault();
      var v = place.value.replace(/\s+/g, ' ').trim();
      if (!v) { msg.textContent = 'Type a town, city or district first, or use your location.'; msg.classList.add('is-err'); place.focus(); return; }
      msg.textContent = MSG; msg.classList.remove('is-err');
      go({ name: v.replace(/(^|\s)\S/g, function (c) { return c.toUpperCase(); }) });
    });
    $('[data-nf-locate]', nf).addEventListener('click', function () {
      var btn = this;
      msg.classList.remove('is-err');
      if (!navigator.geolocation) { go({}); return; }
      btn.classList.add('is-busy'); msg.textContent = 'Finding where you are…';
      navigator.geolocation.getCurrentPosition(function (p) {
        btn.classList.remove('is-busy'); msg.textContent = MSG;
        go({ lat: p.coords.latitude, lng: p.coords.longitude });
      }, function () {
        /* no location here: Google Maps can still find "near me" itself */
        btn.classList.remove('is-busy'); msg.textContent = MSG;
        go({});
      }, { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 });
    });
    $('[data-nf-back]', nf).addEventListener('click', function () { step(1); place.focus(); });
    kinds.forEach(function (a) {
      var k = a.getAttribute('data-nf-kind');
      a.addEventListener('mouseenter', function () { preview(k); });
      a.addEventListener('focus', function () { preview(k); });
    });
  })();
})();
