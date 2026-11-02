/* reboot-store.js: the Reboot log, kept only in this browser
   (localStorage 'abwh-reboot'), and the one place where the AI's commands
   change it. Used by the Reboot dashboard (reboot.js) and by the self-check
   (tools.js), which can set the dashboard up from its answers.

   The shape:
   { what, unit, base, goal, start,
     logs: { 'YYYY-MM-DD': { amt, mood 1-5, feel better|same|worse } },
     focus, steps: [{ t, done }], badges: [{ t, why, d }], tips: [t], sos } */
(function () {
  var KEY = 'abwh-reboot';
  var UNITS = { alcohol: 'drinks', cannabis: 'joints', tobacco: 'cigarettes', pills: 'pills', other: 'times' };
  var NAMES = { alcohol: 'Alcohol', cannabis: 'Cannabis / ganja', tobacco: 'Tobacco', pills: 'Pills', other: 'Something else' };

  function blank() { return { what: '', unit: '', base: 0, goal: 0, start: '', logs: {}, focus: '', steps: [], badges: [], tips: [], sos: false }; }
  function load(ls) {
    ls = ls || (typeof localStorage !== 'undefined' ? localStorage : null);
    try { var d = JSON.parse(ls.getItem(KEY) || 'null'); if (d && typeof d === 'object') return Object.assign(blank(), d); } catch (e) {}
    return blank();
  }
  function save(d, ls) {
    ls = ls || (typeof localStorage !== 'undefined' ? localStorage : null);
    try { ls.setItem(KEY, JSON.stringify(d)); } catch (e) {}
  }
  function day(t) {
    var x = t ? new Date(t) : new Date();
    return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0');
  }
  var clip = function (s, n) { s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
  var num = function (v) { var n = parseFloat(v); return isFinite(n) ? Math.max(0, Math.round(n * 2) / 2) : null; };

  /* the AI's commands, applied to the log; returns plain-English changes */
  function apply(d, cmds) {
    var done = [];
    (cmds || []).forEach(function (c) {
      var a = c.args || [];
      switch (c.name) {
        case 'SETUP': {
          var w = String(a[0] || '').toLowerCase();
          if (!UNITS[w]) w = /alco|drink|beer|liquor|daru/.test(w) ? 'alcohol' : /cannab|ganja|weed|bhang|charas/.test(w) ? 'cannabis' : /tobac|cigar|smok|beedi|gutka/.test(w) ? 'tobacco' : /pill|tablet|benzo|opioid/.test(w) ? 'pills' : 'other';
          var b = num(a[1]);
          if (d.what && d.base) break;
          d.what = w; d.unit = clip(a[2], 16) || UNITS[w];
          if (b != null && b > 0) { d.base = Math.min(b, 999); if (!d.goal || d.goal > d.base) d.goal = d.base; }
          if (!d.start) d.start = day();
          done.push('Set up tracking: ' + NAMES[w].toLowerCase() + (d.base ? ', usually ' + d.base + ' ' + d.unit + ' a day' : ''));
          break;
        }
        case 'GOAL': {
          var g = num(a[0]);
          if (g == null) break;
          if (d.base) g = Math.min(g, d.base);
          d.goal = g;
          done.push('Next target: ' + g + ' ' + (d.unit || 'a day') + ' a day');
          break;
        }
        case 'FOCUS': if (a[0]) { d.focus = clip(a.join(' | '), 70); done.push('New focus for this week'); } break;
        case 'CLEARSTEPS': d.steps = []; break;
        case 'STEP':
          if (a[0] && d.steps.length < 6 && !d.steps.some(function (s) { return s.t === clip(a[0], 80); })) {
            d.steps.push({ t: clip(a[0], 80), done: false }); done.push('Added a step to your plan');
          }
          break;
        case 'BADGE':
          if (a[0] && !d.badges.some(function (x) { return x.t === clip(a[0], 28); })) {
            d.badges.push({ t: clip(a[0], 28), why: clip(a[1], 90), d: day() }); done.push('Badge: ' + clip(a[0], 28));
          }
          break;
        case 'TIP': if (a[0]) { d.tips.unshift(clip(a.join(' | '), 110)); d.tips = d.tips.slice(0, 3); done.push('A new tip'); } break;
        case 'SOS': d.sos = true; done.push('Emergency numbers shown'); break;
      }
    });
    return done;
  }

  /* numbers the dashboard and the AI both read */
  function stats(d, today) {
    today = today || day();
    var keys = Object.keys(d.logs).sort();
    var last = function (n) {
      var out = [], t = new Date(today + 'T12:00:00');
      for (var i = n - 1; i >= 0; i--) { var k = day(t.getTime() - i * 864e5); out.push({ k: k, log: d.logs[k] || null }); }
      return out;
    };
    var week = last(7).filter(function (x) { return x.log; });
    var avg = week.length ? week.reduce(function (s, x) { return s + x.log.amt; }, 0) / week.length : null;
    var cut = avg != null && d.base ? Math.max(-100, Math.min(100, Math.round((1 - avg / d.base) * 100))) : null;
    var streak = 0, t = new Date(today + 'T12:00:00');
    if (!d.logs[today]) t = new Date(t.getTime() - 864e5);
    while (d.logs[day(t.getTime())]) { streak++; t = new Date(t.getTime() - 864e5); }
    var moods = week.map(function (x) { return x.log.mood; });
    return {
      days: keys.length, streak: streak, weekAvg: avg == null ? null : Math.round(avg * 10) / 10, cut: cut,
      onGoal: week.filter(function (x) { return d.goal != null && x.log.amt <= d.goal; }).length,
      mood: moods.length ? Math.round(moods.reduce(function (s, m) { return s + m; }, 0) / moods.length * 10) / 10 : null,
      better: week.filter(function (x) { return x.log.feel === 'better'; }).length,
      last14: last(14), last7: last(7),
    };
  }

  var api = { load: load, save: save, apply: apply, stats: stats, day: day, UNITS: UNITS, NAMES: NAMES, blank: blank };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.abwhReboot = api;
})();
