/* tonight.js: Right now, tonight (src/pages/right-now.astro, styles in
   src/styles/tonight.css). A classic script, not a module, so it also runs
   when the site is opened straight from a folder. It draws the lamp-light
   motes, keeps the night arc on the real time and moon, runs the deck of
   cards and the small things to do on them, and turns the sky to morning
   at the end of the page. Nothing here is saved or sent anywhere. */
(function () {
  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var phone = matchMedia('(max-width: 52rem)');
  var fine = matchMedia('(hover: hover) and (pointer: fine)');
  var $ = function (sel, el) { return (el || document).querySelector(sel); };
  var $$ = function (sel, el) { return [].slice.call((el || document).querySelectorAll(sel)); };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var hhmm = function (m) { m = ((Math.round(m) % 1440) + 1440) % 1440; return pad(Math.floor(m / 60)) + ':' + pad(m % 60); };
  var dur = function (m) { m = Math.max(0, Math.round(m)); var h = Math.floor(m / 60); return (h ? h + ' h ' : '') + (m % 60) + ' min'; };

  /* glide to a part of the page, with the site's heavy scroll if it is on */
  function glide(el, off) {
    var y = el.getBoundingClientRect().top + scrollY - (off || 90);
    if (window.abwhLenis) window.abwhLenis.scrollTo(y, { duration: 1.3 });
    else scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
  }

  /* ── lamp-light motes: warm dust that drifts up and parts round the pointer ── */
  (function motes() {
    var cv = $('[data-motes]');
    if (!cv || reduce || phone.matches || !cv.getContext) return;
    var ctx = cv.getContext('2d'), dpr = Math.min(window.devicePixelRatio || 1, 1.5), W = 0, H = 0, ps = [], mx = -1e4, my = -1e4;
    var spr = document.createElement('canvas'); spr.width = spr.height = 64;
    var sc = spr.getContext('2d'), g = sc.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,240,205,1)'); g.addColorStop(.18, 'rgba(255,200,120,.85)'); g.addColorStop(.5, 'rgba(255,150,60,.22)'); g.addColorStop(1, 'rgba(255,140,50,0)');
    sc.fillStyle = g; sc.fillRect(0, 0, 64, 64);
    function size() { W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    function make(any, x, y) {
      return { x: x != null ? x : Math.random() * W, y: y != null ? y : any ? Math.random() * H : H + 12, r: .6 + Math.random() * 2.2,
        vx: (Math.random() - .5) * .2, vy: -(.1 + Math.random() * .3), tw: Math.random() * 6.3, ts: .01 + Math.random() * .03, life: 1 };
    }
    size();
    var N = Math.round(Math.min(80, W * H / 20000));
    for (var k = 0; k < N; k++) ps.push(make(true));
    addEventListener('resize', size);
    addEventListener('pointermove', function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });
    document.addEventListener('pointerleave', function () { mx = my = -1e4; });
    /* a tap on empty ground sends up a little puff of embers */
    addEventListener('pointerdown', function (e) {
      if (e.target.closest('a, button, input, label, .rn-card, .rn-arc')) return;
      for (var j = 0; j < 10; j++) {
        var p = make(false, e.clientX, e.clientY), a = Math.random() * 6.3, s = .6 + Math.random() * 1.8;
        p.vx = Math.cos(a) * s; p.vy = Math.sin(a) * s - 1; p.life = .995; ps.push(p);
      }
    });
    var on = true;
    document.addEventListener('visibilitychange', function () { on = !document.hidden; if (on) requestAnimationFrame(frame); });
    function frame() {
      if (!on) return;
      ctx.clearRect(0, 0, W, H);
      for (var i = ps.length - 1; i >= 0; i--) {
        var p = ps[i], dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
        p.tw += p.ts;
        if (d2 < 22500) {
          var d = Math.sqrt(d2) || 1, f = (1 - d / 150) * .5;
          p.vx += (dx / d * .9 - dy / d * .6) * f * .12; p.vy += (dy / d * .9 + dx / d * .6) * f * .12;
        }
        p.vx *= .965; p.vy = p.vy * .965 - (.04 + p.r * .02) * .035;
        p.x += p.vx + Math.sin(p.tw * .5) * .18; p.y += p.vy;
        if (p.life < 1) p.life *= .985;
        if (p.y < -20 || p.x < -20 || p.x > W + 20 || p.life < .05) {
          if (ps.length > N) { ps.splice(i, 1); continue; }
          ps[i] = make(false); continue;
        }
        var s = p.r * 9, a = (.3 + .7 * Math.abs(Math.sin(p.tw))) * Math.min(1, .2 + p.r / 2.4) * (p.life < 1 ? p.life : 1);
        ctx.globalAlpha = a;
        ctx.drawImage(spr, p.x - s / 2, p.y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  })();

  /* ── the night arc: sunset to sunrise, the real moon, the time now ── */
  (function arc() {
    var fig = $('[data-arc]');
    if (!fig) return;
    var svg = $('svg', fig), moon = $('[data-moon]', fig), lit = $('[data-moon-lit]', fig), ticks = $('[data-ticks]', fig);
    var digits = $$('.rn-clock__d', fig), left = $('[data-left]', fig), note = $('[data-note]', fig), nowBtn = $('[data-now]', fig);
    var cap = note.parentNode, hours = [];
    try { hours = JSON.parse($('[data-hours]', fig).textContent); } catch (e) {}
    var CX = 200, CY = 200, R = 170, NS = 'http://www.w3.org/2000/svg';
    var night = null, scrub = null, lastKey = '';

    /* sunrise and sunset in minutes after local midnight, for the middle of
       India (the NOAA approximation, good to a few minutes) */
    var LAT = 21 * Math.PI / 180, LON = 78.5;
    function sun(d) {
      var N = Math.floor((d - new Date(d.getFullYear(), 0, 1)) / 864e5) + 1, g = 2 * Math.PI / 365 * (N - 1);
      var eq = 229.18 * (.000075 + .001868 * Math.cos(g) - .032077 * Math.sin(g) - .014615 * Math.cos(2 * g) - .040849 * Math.sin(2 * g));
      var de = .006918 - .399912 * Math.cos(g) + .070257 * Math.sin(g) - .006758 * Math.cos(2 * g) + .000907 * Math.sin(2 * g) - .002697 * Math.cos(3 * g) + .00148 * Math.sin(3 * g);
      var ha = Math.acos(Math.cos(90.833 * Math.PI / 180) / (Math.cos(LAT) * Math.cos(de)) - Math.tan(LAT) * Math.tan(de)) * 180 / Math.PI;
      var tz = -d.getTimezoneOffset();
      return { rise: 720 - 4 * (LON + ha) - eq + tz, set: 720 - 4 * (LON - ha) - eq + tz };
    }
    /* tonight, on a clock of minutes from today's midnight (may run past 1440) */
    function tonight(d) {
      var m = d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60, t = sun(d);
      var y = sun(new Date(d.getTime() - 864e5)), n = sun(new Date(d.getTime() + 864e5));
      if (m >= t.set) return { a: t.set, b: n.rise + 1440, m: m, day: false };
      if (m < t.rise) return { a: y.set - 1440, b: t.rise, m: m, day: false };
      return { a: t.set, b: n.rise + 1440, m: m, day: true };
    }
    /* the moon as it is tonight: the lit part drawn as two arcs */
    function phase(d) {
      var p = ((d - Date.UTC(2000, 0, 6, 18, 14)) / 864e5 / 29.530588853) % 1;
      return p < 0 ? p + 1 : p;
    }
    function drawMoon(p) {
      var r = 15, k = Math.cos(2 * Math.PI * p), rx = Math.abs(k) * r, wax = p < .5;
      var outer = wax ? 1 : 0, term = wax ? (k > 0 ? 0 : 1) : (k > 0 ? 1 : 0);
      lit.setAttribute('d', 'M0 ' + -r + ' A' + r + ' ' + r + ' 0 0 ' + outer + ' 0 ' + r + ' A' + rx.toFixed(2) + ' ' + r + ' 0 0 ' + term + ' 0 ' + -r + 'Z');
      var names = ['New moon', 'Waxing crescent', 'First quarter', 'Waxing gibbous', 'Full moon', 'Waning gibbous', 'Last quarter', 'Waning crescent'];
      return names[Math.floor(((p * 8) + .5) % 8)];
    }
    function at(f) { var a = Math.PI * (1 - f); return [CX + R * Math.cos(a), CY - R * Math.sin(a)]; }
    function buildTicks() {
      while (ticks.firstChild) ticks.removeChild(ticks.firstChild);
      for (var h = Math.ceil(night.a / 60) * 60; h < night.b; h += 60) {
        var f = (h - night.a) / (night.b - night.a), a = Math.PI * (1 - f), c = Math.cos(a), s = Math.sin(a);
        var gr = document.createElementNS(NS, 'g'), ln = document.createElementNS(NS, 'line'), hr = ((h / 60) % 24 + 24) % 24;
        ln.setAttribute('x1', CX + (R - 7) * c); ln.setAttribute('y1', CY - (R - 7) * s);
        ln.setAttribute('x2', CX + (R + 7) * c); ln.setAttribute('y2', CY - (R + 7) * s);
        gr.appendChild(ln);
        if (hr % 3 === 0) {
          var tx = document.createElementNS(NS, 'text');
          tx.setAttribute('x', CX + (R + 19) * c); tx.setAttribute('y', CY - (R + 19) * s + 3); tx.setAttribute('text-anchor', 'middle');
          tx.textContent = pad(hr); gr.appendChild(tx);
        }
        if (hr === 0) gr.setAttribute('class', 'is-mid');
        ticks.appendChild(gr);
      }
    }
    function setClock(m) {
      var s = hhmm(m);
      [s[0], s[1], s[3], s[4]].forEach(function (d, i) { digits[i].style.setProperty('--n', d); });
      fig.querySelector('[data-clock]').setAttribute('aria-label', s);
    }
    function place(f) {
      var p = at(f);
      moon.setAttribute('transform', 'translate(' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ')');
      fig.style.setProperty('--f', f.toFixed(4));
    }
    function say(t) {
      if (note.textContent === t) return;
      cap.classList.add('is-swap');
      setTimeout(function () { note.textContent = t; cap.classList.remove('is-swap'); }, reduce ? 0 : 220);
    }
    function hourNote(m) {
      var h = ((m / 60) % 24 + 24) % 24; if (h < 12) h += 24;
      var t = hours[0] ? hours[0].t : '';
      hours.forEach(function (x) { if (h >= x.h) t = x.t; });
      return t;
    }
    function tick() {
      var d = new Date(), n = tonight(d);
      var key = Math.round(n.a) + '|' + Math.round(n.b);
      night = n;
      if (key !== lastKey) {
        lastKey = key; buildTicks();
        $('[data-sunset]', fig).textContent = hhmm(n.a);
        $('[data-sunrise]', fig).textContent = hhmm(n.b);
        var ph = drawMoon(phase(d));
        moon.setAttribute('aria-label', ph + '. Drag along the arc to any hour of the night.');
      }
      if (scrub != null) return;
      setClock(n.m);
      if (n.day) {
        place(0);
        left.textContent = 'Night starts in ' + dur(n.a - n.m);
      } else {
        var f = (n.m - n.a) / (n.b - n.a);
        place(f);
        left.textContent = dur(n.b - n.m) + ' to sunrise';
        moon.setAttribute('aria-valuenow', Math.round(f * 100));
        moon.setAttribute('aria-valuetext', hhmm(n.m));
      }
    }
    /* dragging (or arrow keys on) the moon shows what any hour is for */
    function scrubTo(f) {
      f = Math.max(0, Math.min(1, f));
      scrub = f;
      var m = night.a + f * (night.b - night.a);
      place(f); setClock(m);
      left.textContent = hhmm(m) + ' · ' + dur(night.b - m) + ' before sunrise';
      moon.setAttribute('aria-valuenow', Math.round(f * 100));
      moon.setAttribute('aria-valuetext', hhmm(m));
      say(hourNote(m));
      nowBtn.hidden = false;
    }
    function back() {
      scrub = null; nowBtn.hidden = true; fig.classList.remove('is-drag');
      say('Drag the moon to any hour of the night.');
      tick();
    }
    function fromEvent(e) {
      var pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
      var q = pt.matrixTransform(svg.getScreenCTM().inverse());
      var a = Math.atan2(CY - q.y, q.x - CX);
      if (a < 0) a = q.x < CX ? Math.PI : 0;
      return 1 - a / Math.PI;
    }
    var dragging = false;
    svg.addEventListener('pointerdown', function (e) {
      if (!night) return;
      dragging = true; fig.classList.add('is-drag');
      try { svg.setPointerCapture(e.pointerId); } catch (x) {}
      scrubTo(fromEvent(e)); e.preventDefault();
    });
    svg.addEventListener('pointermove', function (e) { if (dragging) scrubTo(fromEvent(e)); });
    function release() { if (!dragging) return; dragging = false; fig.classList.remove('is-drag'); }
    svg.addEventListener('pointerup', release);
    svg.addEventListener('pointercancel', release);
    moon.setAttribute('tabindex', '0'); moon.setAttribute('role', 'slider');
    moon.setAttribute('aria-valuemin', '0'); moon.setAttribute('aria-valuemax', '100');
    moon.addEventListener('keydown', function (e) {
      var step = 30 / (night.b - night.a), f = scrub != null ? scrub : Math.max(0, (night.m - night.a) / (night.b - night.a));
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { scrubTo(f + step); e.preventDefault(); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { scrubTo(f - step); e.preventDefault(); }
      if (e.key === 'Escape' || e.key === 'Home') { back(); e.preventDefault(); }
    });
    nowBtn.addEventListener('click', back);
    tick();
    setInterval(tick, 1000);
  })();

  /* ── what tonight is: the light follows the pointer across each choice ── */
  $$('.rn-pick__b').forEach(function (b) {
    b.addEventListener('pointermove', function (e) {
      var r = b.getBoundingClientRect();
      b.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      b.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ── the small things to do on a card. Each returns what to do when its
     card comes to the front. ── */
  var X = {};

  /* know it by heart: look once, it fades, type it back. Nothing dials. */
  X.keypad = function (x) {
    var tabs = $$('[data-kp-n]', x), screen = $('[data-kp-screen]', x), ghost = $('[data-kp-ghost]', x), typed = $('[data-kp-typed]', x), msg = $('[data-kp-msg]', x);
    var target = '112', got = '', timer = 0, known = {};
    var OK = {
      '112': '112, by heart. Police, fire or ambulance, from any phone.',
      '108': '108, by heart. The ambulance, directly, and it is free.',
      '14446': '14446, by heart. Free, any hour, and nobody asks your name.',
    };
    function hideSoon() { clearTimeout(timer); timer = setTimeout(function () { screen.classList.add('is-hide'); }, 1500); }
    function set(n) {
      target = n; got = ''; typed.textContent = ''; ghost.textContent = n;
      screen.classList.remove('is-hide', 'is-ok', 'is-bad');
      tabs.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-kp-n') === n)); });
      msg.textContent = known[n] ? 'You know this one. Once more, for luck.' : 'Look once. It fades; then type it from memory. Nothing dials.';
      hideSoon();
    }
    function key(d) {
      if (screen.classList.contains('is-ok')) { set(target); return; }
      screen.classList.add('is-hide'); clearTimeout(timer);
      if (d === '⌫') got = got.slice(0, -1);
      else got += d;
      typed.textContent = got;
      if (target.indexOf(got) !== 0) {
        screen.classList.add('is-bad'); msg.textContent = 'Not quite. Have another look.';
        setTimeout(function () { screen.classList.remove('is-bad', 'is-hide'); got = ''; typed.textContent = ''; hideSoon(); }, 650);
        return;
      }
      if (got === target) {
        screen.classList.add('is-ok'); known[target] = true;
        tabs.forEach(function (b) { if (known[b.getAttribute('data-kp-n')]) b.classList.add('is-known'); });
        msg.textContent = Object.keys(known).length === 3 ? 'All three, by heart. That is the whole card.' : OK[target] + ' Try the next one.';
      }
    }
    tabs.forEach(function (b) { b.addEventListener('click', function () { set(b.getAttribute('data-kp-n')); }); });
    $$('[data-kp-k]', x).forEach(function (b) { b.addEventListener('click', function () { key(b.getAttribute('data-kp-k')); }); });
    x.rnKey = function (k) {
      if (!/^[0-9]$|^Backspace$/.test(k)) return false;
      var d = k === 'Backspace' ? '⌫' : k, b = $('[data-kp-k="' + d + '"]', x);
      if (b) { b.classList.add('is-press'); setTimeout(function () { b.classList.remove('is-press'); }, 140); }
      key(d); return true;
    };
    return function () { set(target); };
  };

  /* tell one person: a message to send from your own phone */
  X.share = function (x) {
    var where = 'at a friend’s place', when = '1 am';
    var msg = $('[data-sh-msg]', x), wa = $('[data-sh-wa]', x), sms = $('[data-sh-sms]', x);
    function upd() {
      var t = 'Hey, I’m ' + where + ' tonight. If you don’t hear from me by ' + when + ', can you check on me?';
      msg.textContent = t;
      msg.style.animation = 'none'; void msg.offsetWidth; msg.style.animation = '';
      wa.href = 'https://wa.me/?text=' + encodeURIComponent(t);
      sms.href = 'sms:?&body=' + encodeURIComponent(t);
    }
    function group(attr, setv) {
      var bs = $$('[' + attr + ']', x);
      bs.forEach(function (b) {
        b.addEventListener('click', function () {
          bs.forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
          setv(b.getAttribute(attr)); upd();
        });
      });
    }
    group('data-sh-where', function (v) { where = v; });
    group('data-sh-when', function (v) { when = v; });
    upd();
  };

  /* ride it out: hold to breathe in, let go to breathe out */
  X.breathe = function (x) {
    var orb = $('[data-br]', x), t = $('[data-br-t]', x), n = $('[data-br-n]', x);
    var b = 0, mode = '', last = 0, start = 0, count = 0, raf = 0;
    function loop(now) {
      var dt = Math.min(64, now - (last || now)); last = now;
      if (mode === 'in') { b = Math.min(1, b + dt / 4000); if (b >= 1) t.textContent = 'Hold it… then let go'; }
      if (mode === 'out') {
        b = Math.max(0, b - dt / 5500);
        if (b <= 0) { mode = ''; orb.classList.remove('is-out'); t.textContent = count ? 'Again: hold to breathe in' : 'Hold to breathe in'; }
      }
      orb.style.setProperty('--b', b.toFixed(3));
      raf = mode ? requestAnimationFrame(loop) : 0;
    }
    function run() { if (!raf) { last = 0; raf = requestAnimationFrame(loop); } }
    function inhale() {
      if (mode === 'in') return;
      mode = 'in'; start = performance.now(); orb.classList.add('is-in'); orb.classList.remove('is-out');
      t.textContent = 'Breathe in…'; run();
    }
    function exhale() {
      if (mode !== 'in') return;
      mode = 'out'; orb.classList.remove('is-in'); orb.classList.add('is-out'); t.textContent = '…and slowly out';
      if (performance.now() - start > 1500) {
        count++;
        n.textContent = count + (count === 1 ? ' slow breath.' : ' slow breaths.') +
          (count >= 5 ? ' An urge rises, peaks and passes. Keep going, or open the timer for ten minutes.' : ' Keep going.');
      } else n.textContent = 'Hold a little longer: let it fill.';
      run();
    }
    orb.addEventListener('pointerdown', function (e) { e.preventDefault(); try { orb.setPointerCapture(e.pointerId); } catch (z) {} inhale(); });
    orb.addEventListener('pointerup', exhale);
    orb.addEventListener('pointercancel', exhale);
    orb.addEventListener('keydown', function (e) { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); inhale(); } });
    orb.addEventListener('keyup', function (e) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); exhale(); } });
    orb.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  };

  /* don't mix: a breath line that slows with each sleepy thing added */
  X.mix = function (x) {
    var path = $('[data-mx-path]', x), lab = $('[data-mx-lab]', x), rate = $('[data-mx-rate]', x), chips = $$('[data-mx]', x), card = x.closest('.rn-card');
    var RATE = [1, .62, .36, .24, .18], AMP = [1, .72, .42, .28, .2];
    var on = 0, r = 1, a = 1, ph = 0, last = 0, raf = 0;
    function loop(now) {
      var dt = Math.min(64, now - (last || now)); last = now;
      r += (RATE[on] - r) * .04; a += (AMP[on] - a) * .04; ph += dt * .0028 * r;
      var d = '', W = 320, cyc = 2.6;
      for (var i = 0; i <= 64; i++) {
        var xx = i / 64 * W, s = Math.sin((xx / W) * cyc * 2 * Math.PI * Math.max(r, .35) - ph);
        d += (i ? 'L' : 'M') + xx.toFixed(1) + ' ' + (45 - a * 30 * (s > 0 ? Math.pow(s, .8) : s * .7)).toFixed(1) + ' ';
      }
      path.setAttribute('d', d);
      raf = card.classList.contains('is-cur') && !reduce ? requestAnimationFrame(loop) : 0;
    }
    function run() { if (!raf) { last = 0; raf = requestAnimationFrame(loop); } }
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        c.setAttribute('aria-pressed', String(c.getAttribute('aria-pressed') !== 'true'));
        var picked = chips.filter(function (o) { return o.getAttribute('aria-pressed') === 'true'; });
        on = picked.length;
        x.classList.toggle('is-warn', on === 1); x.classList.toggle('is-danger', on > 1);
        rate.textContent = on === 0 ? 'Breathing · steady' : on === 1 ? 'Breathing · slower' : 'Breathing · dangerously slow';
        lab.textContent = on === 0 ? 'Steady. Nothing in the mix.'
          : on === 1 ? picked[0].getAttribute('data-mx') + ' makes you sleepy, and slows your breathing with it.'
          : 'Together they slow breathing far more than either one alone. This is how mixing goes wrong.';
        if (reduce) loop(performance.now());
        run();
      });
    });
    return function () { if (reduce) loop(performance.now()); else run(); };
  };

  /* less is a real win: the week, and what a smaller number adds up to */
  X.less = function (x) {
    var now = $('[data-ls-now]', x), goal = $('[data-ls-goal]', x), a = $('[data-ls-a]', x), b = $('[data-ls-b]', x), out = $('[data-ls-out]', x), days = $$('[data-ls-week] span', x);
    function upd() {
      var n = +now.value, g = Math.min(+goal.value, n);
      if (+goal.value > n) goal.value = n;
      a.textContent = n; b.textContent = g;
      days.forEach(function (d, k) { d.className = k < g ? 'is-use' : k < n ? 'is-won' : ''; });
      var won = (n - g) * 52;
      out.innerHTML = won ? '<b>' + won + '</b> fewer days a year. That counts.' : 'Move the second one down. One day less a week is <b>52</b> a year.';
    }
    now.addEventListener('input', upd); goal.addEventListener('input', upd);
    upd();
  };

  /* ── the deck: say what tonight is, then one card at a time ── */
  $$('[data-deck]').forEach(function (box) {
    var deck = $('.rn-deck', box), stack = $('.rn-deck__stack', deck), pick = $('.rn-pick', box);
    var cards = $$('.rn-card[data-in]', deck), end = $('.rn-card--end', deck), lamps = $('.rn-lamps', deck);
    var prev = $('[data-prev]', deck), next = $('[data-next]', deck), ci = $('[data-count-i]', deck), cn = $('[data-count-n]', deck), live = $('[data-live]', deck);
    var LAMP = window.abwhLamp || '';
    var ends = {};
    try { ends = JSON.parse($('[data-ends]', box).textContent); } catch (e) {}
    var list = [], i = 0, released = false;
    deck.classList.add('is-js');

    /* each card's small thing, set up once */
    cards.forEach(function (c) {
      var x = $('.rn-x', c);
      if (x && X[x.getAttribute('data-x')]) c.rnEnter = X[x.getAttribute('data-x')](x) || null;
    });

    function clear() {
      cards.concat(end ? [end] : []).forEach(function (c) {
        c.classList.remove('is-cur', 'is-n1', 'is-n2', 'is-past', 'is-drag', 'is-fly', 'is-tilt');
        c.style.transform = ''; c.style.opacity = '';
      });
    }
    function choose(p, btn) {
      list = cards.filter(function (c) { return (' ' + c.getAttribute('data-in') + ' ').indexOf(' ' + p + ' ') > -1; });
      var e = ends[p];
      if (e && end) {
        $('.rn-card__t', end).textContent = e.t;
        var a = $('.rn-act', end); a.href = e.href; $('span', a).textContent = e.l;
        list.push(end);
      }
      $$('[data-path]', box).forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      pick.classList.add('has-pick');
      deck.classList.add('has-path');
      deck.classList.toggle('is-one', list.length === 1);
      deck.setAttribute('data-path', p);
      var n = list.length - (e && end ? 1 : 0);
      lamps.innerHTML = '';
      for (var k = 0; k < n; k++) { var li = document.createElement('li'); li.className = 'lamp'; li.innerHTML = LAMP; lamps.appendChild(li); }
      cn.textContent = n;
      /* the last path's cards go at once, so the new first card is the only thing moving */
      deck.classList.add('is-swap'); clear(); void deck.offsetWidth; deck.classList.remove('is-swap');
      released = false; i = 0;
      show(true);
      var r = deck.getBoundingClientRect();
      if (phone.matches || r.top < 0 || r.bottom > innerHeight) setTimeout(function () { glide(deck, phone.matches ? 76 : 110); }, 60);
      try { deck.focus({ preventScroll: true }); } catch (z) {}
    }

    function sparks(l) {
      if (reduce) return;
      for (var k = 0; k < 12; k++) {
        var s = document.createElement('span'), a = Math.random() * Math.PI * 2, d = 16 + Math.random() * 30;
        s.className = 'rn-spark';
        s.style.setProperty('--sx', (Math.cos(a) * d).toFixed(1) + 'px');
        s.style.setProperty('--sy', (Math.sin(a) * d - 14).toFixed(1) + 'px');
        s.style.animationDelay = (Math.random() * .12).toFixed(2) + 's';
        l.appendChild(s);
        setTimeout(function (el) { el.remove(); }.bind(null, s), 1300);
      }
    }
    /* finished: one sky lantern rises from each lamp, and a few more with them */
    function lanterns() {
      if (reduce) return;
      var from = $$('.lamp', lamps).map(function (l) { var r = l.getBoundingClientRect(); return r.left + r.width / 2; });
      for (var k = 0; k < from.length + 6; k++) {
        var el = document.createElement('span');
        var x = k < from.length ? from[k] : Math.random() * innerWidth;
        el.className = 'rn-lantern';
        el.style.left = (x - 12).toFixed(0) + 'px';
        el.style.setProperty('--dur', (6 + Math.random() * 4).toFixed(1) + 's');
        el.style.setProperty('--sway', ((Math.random() - .5) * 120).toFixed(0) + 'px');
        el.style.setProperty('--s', (k < from.length ? 1 : .5 + Math.random() * .5).toFixed(2));
        el.style.animationDelay = (k * .22).toFixed(2) + 's';
        el.addEventListener('animationend', function () { this.remove(); });
        document.body.appendChild(el);
      }
    }

    function show(fresh) {
      list.forEach(function (c, k) {
        c.classList.toggle('is-cur', k === i);
        c.classList.toggle('is-n1', k === i + 1);
        c.classList.toggle('is-n2', k === i + 2);
        c.classList.toggle('is-past', k < i);
        c.classList.remove('is-tilt', 'is-fly');
        c.setAttribute('aria-hidden', String(k !== i));
        c.style.transform = ''; c.style.opacity = '';
        c.style.removeProperty('--rx'); c.style.removeProperty('--ry');
      });
      var cur = list[i];
      $$('.lamp', lamps).forEach(function (l, k) {
        var was = l.classList.contains('is-lit'), now = k < i || cur === end;
        l.classList.toggle('is-lit', now);
        l.classList.toggle('is-cur', k === i && cur !== end);
        if (now && !was) sparks(l);
      });
      if (cur === end && !released) { released = true; setTimeout(lanterns, 250); }
      if (cur.rnEnter) cur.rnEnter();
      prev.disabled = i === 0;
      next.disabled = i === list.length - 1;
      $('span', next).textContent = list[i + 1] === end ? 'Finish' : 'Next';
      ci.textContent = cur === end ? '✓' : i + 1;
      if (live && !fresh) live.textContent = $('.rn-card__t', cur).textContent;
    }
    function go(d) {
      var j = Math.max(0, Math.min(list.length - 1, i + d));
      if (j === i) return;
      i = j; show();
    }
    /* throw the front card off to the left, then bring the next one up */
    function fling() {
      var c = list[i];
      if (!c || i >= list.length - 1) return;
      if (reduce) { go(1); return; }
      c.classList.add('is-fly'); c.classList.remove('is-tilt');
      c.style.transform = 'translate3d(-135%, -4%, 0) rotate(-22deg)'; c.style.opacity = '0';
      setTimeout(function () { go(1); }, 240);
    }

    $$('[data-path]', box).forEach(function (b) {
      b.addEventListener('click', function () { choose(b.getAttribute('data-path'), b); });
    });
    prev.addEventListener('click', function () { go(-1); });
    next.addEventListener('click', fling);
    deck.addEventListener('keydown', function (e) {
      if (e.target.closest('input')) return;
      var x = list[i] && $('.rn-x', list[i]);
      if (x && x.rnKey && x.rnKey(e.key)) { e.preventDefault(); return; }
      if (e.key === 'ArrowRight') { fling(); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { go(-1); e.preventDefault(); }
    });
    $$('[data-again]', deck).forEach(function (b) {
      b.addEventListener('click', function () {
        deck.classList.remove('has-path', 'is-one');
        pick.classList.remove('has-pick');
        $$('[data-path]', box).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        clear();
        glide(box, 90);
      });
    });

    /* the front card leans toward the pointer and catches the light */
    stack.addEventListener('pointermove', function (e) {
      if (!fine.matches || reduce || drag) return;
      var c = e.target.closest('.rn-card.is-cur');
      if (!c) return;
      var r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      var m = c.classList.contains('rn-card--x') ? .45 : 1;
      c.classList.add('is-tilt');
      c.style.setProperty('--ry', ((px - .5) * 12 * m).toFixed(2) + 'deg');
      c.style.setProperty('--rx', ((.5 - py) * 9 * m).toFixed(2) + 'deg');
      c.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
      c.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
    });
    stack.addEventListener('pointerleave', function () {
      var c = list[i];
      if (!c) return;
      c.classList.remove('is-tilt');
      c.style.removeProperty('--rx'); c.style.removeProperty('--ry');
    });

    /* a finger (or a mouse) can throw the card away, or pull the last one back */
    var x0 = null, y0 = 0, dx = 0, el = null, drag = false;
    stack.addEventListener('pointerdown', function (e) {
      el = e.target.closest('.rn-card.is-cur');
      if (!el || e.target.closest('a, button, input, label, .rn-x')) { el = null; return; }
      x0 = e.clientX; y0 = e.clientY; dx = 0; drag = false;
    });
    addEventListener('pointermove', function (e) {
      if (!el || x0 === null) return;
      dx = e.clientX - x0;
      if (!drag && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(e.clientY - y0)) { drag = true; el.classList.add('is-drag'); el.classList.remove('is-tilt'); }
      if (drag) el.style.transform = 'translate3d(' + dx + 'px, 0, 0) rotate(' + (dx / 18).toFixed(2) + 'deg)';
    });
    function up() {
      if (!el) return;
      var c = el; el = null; x0 = null;
      c.classList.remove('is-drag');
      if (!drag) return;
      drag = false;
      if (dx < -80 && i < list.length - 1) fling();
      else { c.style.transform = ''; if (dx > 80) go(-1); }
    }
    addEventListener('pointerup', up);
    addEventListener('pointercancel', up);
  });

  /* ── morning: the further down the page, the closer to sunrise ── */
  (function dawn() {
    var sec = $('[data-dawn]');
    if (!sec) return;
    var busy = false;
    function upd() {
      busy = false;
      var r = sec.getBoundingClientRect(), h = innerHeight;
      var p = Math.max(0, Math.min(1, (h - r.top) / (r.height + h * .1)));
      root.style.setProperty('--dawn', p.toFixed(3));
    }
    addEventListener('scroll', function () { if (!busy) { busy = true; requestAnimationFrame(upd); } }, { passive: true });
    addEventListener('resize', upd);
    upd();
  })();
})();
