/* ai.js: one small door to the site's AI (the same Cloudflare server the
   counsellor uses, worker/counsellor-proxy.js), for the self-check and the
   Reboot dashboard. A classic script. It tries each model in turn, fastest
   first, and resolves with the whole reply.

   Commands: the AI is told to put instructions for the page on lines of
   their own, written [[NAME value]] or [[NAME a | b]]. commands() pulls them
   out of a reply and returns the reply without them, so the reader never
   sees the machinery. */
(function () {
  var PROXY = 'https://abwh-counsellor.abhi-bhi-waqt-hai-site.workers.dev/';
  var MODELS = [
    { id: 'gemini-3.5-flash', cfg: { thinkingConfig: { thinkingLevel: 'minimal' } } },
    { id: 'gemini-3.8-flash', cfg: { thinkingConfig: { thinkingLevel: 'low' } } },
    { id: 'gemini-3.1-flash-lite', cfg: {} },
  ];
  function hint() { try { return parseInt(localStorage.getItem('abwh-hint') || '0', 10) || 0; } catch (e) { return 0; } }

  function once(model, body, onText) {
    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 30000);
    var b = JSON.parse(JSON.stringify(body));
    b.generationConfig = Object.assign({}, b.generationConfig || {}, model.cfg);
    return fetch(PROXY + '?model=' + encodeURIComponent(model.id) + '&line=' + hint(), {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b), signal: ctrl ? ctrl.signal : undefined,
    }).then(function (res) {
      if (!res.ok) { clearTimeout(timer); throw { status: res.status }; }
      var line = res.headers.get('X-Line');
      if (line != null) { try { localStorage.setItem('abwh-hint', String(parseInt(line, 10) || 0)); } catch (e) {} }
      var reader = res.body.getReader(), dec = new TextDecoder(), buf = '', text = '';
      function pump() {
        return reader.read().then(function (r) {
          if (r.done) return;
          buf += dec.decode(r.value, { stream: true });
          var parts = buf.split(/\r?\n/); buf = parts.pop();
          parts.forEach(function (ln) {
            if (ln.indexOf('data:') !== 0) return;
            try {
              var c = (JSON.parse(ln.slice(5)).candidates || [])[0];
              ((c && c.content && c.content.parts) || []).forEach(function (p) {
                if (p.text && !p.thought) { text += p.text; if (onText) onText(text); }
              });
            } catch (e) {}
          });
          return pump();
        });
      }
      return pump().then(function () {
        clearTimeout(timer);
        if (!text) throw { status: 0 };
        return text;
      });
    }, function () { clearTimeout(timer); throw { status: 0 }; });
  }

  /* opts: { system, contents | prompt, temperature, maxTokens, onText } */
  function ask(opts) {
    if (navigator.onLine === false) return Promise.reject({ offline: true });
    var body = {
      systemInstruction: { parts: [{ text: opts.system }] },
      contents: opts.contents || [{ role: 'user', parts: [{ text: opts.prompt }] }],
      generationConfig: { temperature: opts.temperature == null ? .7 : opts.temperature, maxOutputTokens: opts.maxTokens || 900 },
    };
    var i = 0;
    function next() {
      if (i >= MODELS.length) return Promise.reject({ busy: true });
      var m = MODELS[i++];
      return once(m, body, opts.onText).catch(next);
    }
    return next();
  }

  /* [[NAME rest]] lines out of a reply: { text, cmds: [{ name, args: [] }] } */
  function commands(reply) {
    var cmds = [];
    var text = String(reply || '').replace(/\[\[\s*([A-Z_]+)\s*([^\]]*?)\s*\]\]/g, function (m, name, rest) {
      cmds.push({ name: name, args: rest ? rest.split('|').map(function (s) { return s.trim(); }) : [] });
      return '';
    }).replace(/\n{3,}/g, '\n\n').trim();
    return { text: text, cmds: cmds };
  }

  /* the little markdown the replies use: **bold**, lists, paragraphs */
  function md(s) {
    var esc = String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    esc = esc.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
    return esc.split(/\n{2,}/).map(function (blk) {
      var ls = blk.split('\n');
      if (ls.every(function (l) { return /^\s*([-*•]|\d+\.)\s+/.test(l); })) {
        return '<ul>' + ls.map(function (l) { return '<li>' + l.replace(/^\s*([-*•]|\d+\.)\s+/, '') + '</li>'; }).join('') + '</ul>';
      }
      return '<p>' + ls.join('<br>') + '</p>';
    }).join('');
  }

  var api = { ask: ask, commands: commands, md: md };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.abwhAI = api;
})();
