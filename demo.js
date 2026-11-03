/* demo.js: ready-made Reboot logs for showing the dashboard to the Stugo
   judges, so it can be seen full without weeks of real entries. Loading one
   puts the visitor's own log aside ('abwh-reboot-mine') and marks the demo
   (d.demo); "Back to my own log" puts it back. Every date is counted back
   from today, so the charts always look current. Buttons anywhere on the
   site use data-demo="<preset>" or data-demo-restore. */
(function () {
  var KEY = 'abwh-reboot', MINE = 'abwh-reboot-mine';
  function day(n) {
    var x = new Date(Date.now() - n * 864e5);
    return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0');
  }
  /* amounts, oldest first, ending yesterday (today is left for the judge to log) */
  function logs(rows) {
    var out = {}, n = rows.length;
    rows.forEach(function (r, i) { if (r) out[day(n - i)] = { amt: r[0], mood: r[1], feel: r[2], crave: r[3], why: r[4] || [] }; });
    return out;
  }
  var B = 'better', S = 'same', W = 'worse';
  var PRESETS = {
    weeks: {
      t: 'Three weeks in', b: 'Alcohol, cutting from 6 drinks a day to 2',
      d: function () {
        return {
          what: 'alcohol', unit: 'drinks', base: 6, goal: 2, start: day(21),
          logs: logs([
            [6, 2, S, 8, ['Stress', 'Evening']], [5, 2, B, 7, ['Friends']], [5, 3, B, 7, ['Evening']], [6, 2, W, 8, ['Bad sleep', 'Stress']],
            [4, 3, B, 6, ['Evening']], [4, 3, S, 6, ['Boredom']], [4, 3, B, 5, ['Friends', 'Celebrating']], [3, 3, B, 6, ['Stress']],
            [4, 2, W, 7, ['Bad sleep']], [3, 3, B, 5, ['Evening']], [3, 4, B, 5, ['Nothing in particular']], [3, 4, S, 4, ['Boredom']],
            [2, 4, B, 6, ['Friends']], [3, 3, W, 7, ['Stress', 'Loneliness']], [2, 4, B, 4, ['Evening']], [2, 4, B, 4, ['Nothing in particular']],
            [2, 4, S, 3, ['Boredom']], [1, 5, B, 6, ['Stress']], [2, 4, S, 3, ['Evening']], [2, 5, B, 2, ['Nothing in particular']], [1, 5, B, 3, []],
          ]),
          focus: 'Evenings | a walk after dinner instead of the first drink',
          steps: [
            { t: 'Keep no bottles at home', done: true },
            { t: 'Walk for 20 minutes after dinner', done: true },
            { t: 'Tell one friend about the plan', done: true },
            { t: 'Try two drink-free days this week', done: false },
          ],
          badges: [{ t: 'Rode out the wave', why: 'A craving of 6 and still on target', d: day(4) }, { t: 'Half way down', why: 'Your usual was 6; this week averages under 2', d: day(1) }],
          tips: ['Stress days are your hardest: plan something for the evening before it starts.', 'Water first, every time. It slows the first drink down.'],
          sos: false, seals: [],
        };
      },
    },
    start: {
      t: 'Day two', b: 'Tobacco, just started: 12 cigarettes a day',
      d: function () {
        return {
          what: 'tobacco', unit: 'cigarettes', base: 12, goal: 10, start: day(2),
          logs: logs([[12, 2, S, 7, ['Stress', 'Friends']], [10, 3, B, 8, ['Boredom']]]),
          focus: 'The first cigarette | wait 15 minutes after waking',
          steps: [{ t: 'Wait 15 minutes before the first one', done: false }, { t: 'Leave the packet at home on short trips', done: false }],
          badges: [], tips: ['Cravings for nicotine peak and pass in about 5 minutes. Try the cravings timer.'], sos: false, seals: [],
        };
      },
    },
    hard: {
      t: 'A hard week', b: 'Cannabis, a slip after good days',
      d: function () {
        return {
          what: 'cannabis', unit: 'joints', base: 4, goal: 1, start: day(12),
          logs: logs([
            [4, 2, S, 7, ['Friends']], [3, 3, B, 6, ['Evening']], [2, 3, B, 5, ['Boredom']], [2, 4, B, 4, []], [1, 4, B, 4, ['Nothing in particular']],
            [1, 4, S, 5, ['Evening']], [1, 4, B, 3, []], [2, 3, W, 7, ['Stress']], [3, 2, W, 8, ['Stress', 'Bad sleep']], [4, 1, W, 9, ['Loneliness', 'Bad sleep']],
            [3, 2, S, 8, ['Stress']], [2, 2, B, 6, ['Friends']],
          ]),
          focus: 'Sleep | same bedtime every night this week',
          steps: [{ t: 'Call 14446 and ask about counselling', done: false }, { t: 'Same bedtime for 5 nights', done: false }, { t: 'Keep nothing at home', done: true }],
          badges: [{ t: 'Five days on target', why: 'Five days at or under your goal', d: day(6) }],
          tips: ['A slip is not a restart. Your best week is still yours.', 'Bad sleep came before every hard day: start there.'], sos: true, seals: [],
        };
      },
    },
  };

  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function put(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} }
  function current() { try { return JSON.parse(get(KEY) || 'null'); } catch (e) { return null; } }
  function active() { var d = current(); return d && d.demo ? d.demo : ''; }
  function load(id) {
    var p = PRESETS[id]; if (!p) return;
    var now = current();
    /* the visitor's own log is put aside once, never overwritten by a demo */
    if (!(now && now.demo) && get(MINE) == null) put(MINE, get(KEY) || '');
    var d = p.d(); d.demo = id;
    put(KEY, JSON.stringify(d));
  }
  function restore() {
    var mine = get(MINE);
    put(KEY, mine ? mine : null);
    put(MINE, null);
  }
  window.abwhDemo = { PRESETS: PRESETS, load: load, restore: restore, active: active };

  /* the buttons: load, then show the dashboard */
  function wire() {
    var here = !!document.querySelector('[data-reboot]');
    var on = active();
    document.querySelectorAll('[data-demo]').forEach(function (b) {
      var id = b.getAttribute('data-demo');
      b.setAttribute('aria-pressed', String(on === id));
      b.addEventListener('click', function (e) {
        e.preventDefault(); load(id);
        if (here) {
          try { if (parent !== window && parent.__SA) { parent.__SA.go('reboot', 'reboot-log'); return; } } catch (x) {}
          location.hash = 'reboot-log'; location.reload();
        }
        else {
          var to = b.getAttribute('data-href') || 'reboot.html#reboot-log';
          /* inside the single-file copy, pages change through its shell */
          try { if (parent !== window && parent.__SA) { parent.__SA.goUrl(to); return; } } catch (x) {}
          location.href = to;
        }
      });
    });
    document.querySelectorAll('[data-demo-restore]').forEach(function (b) {
      b.hidden = !on;
      b.addEventListener('click', function (e) {
        e.preventDefault(); restore();
        if (!here) { b.hidden = true; return; }
        try { if (parent !== window && parent.__SA) { parent.__SA.go('reboot', ''); return; } } catch (x) {}
        location.reload();
      });
    });
    document.querySelectorAll('[data-demo-on]').forEach(function (x) {
      x.hidden = !on;
      var n = x.querySelector('[data-demo-name]'); if (n && on) n.textContent = PRESETS[on].t;
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire); else wire();
})();
