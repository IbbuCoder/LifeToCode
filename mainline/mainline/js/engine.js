/* Lesson engine: renders every question type and runs lesson / practice / review / challenge sessions. */
(function () {
  /* ---------- small utilities ---------- */
  const U = {
    h(tag, attrs = {}, ...kids) {
      const el = document.createElement(tag);
      for (const k in attrs) {
        const v = attrs[k];
        if (v == null || v === false) continue;
        if (k === 'class') el.className = v;
        else if (k === 'html') el.innerHTML = v;
        else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
        else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
        else el.setAttribute(k, v === true ? '' : v);
      }
      for (const kid of kids.flat()) if (kid != null && kid !== false) el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
      return el;
    },
    esc: s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]),
    shuffle(a, rnd = Math.random) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; },
    norm: s => String(s).trim().toLowerCase().replace(/\s+/g, ' ').replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/\.$/, ''),
    normOut: s => String(s).replace(/\r/g, '').split('\n').map(l => l.replace(/\s+$/, '')).join('\n').trim(),
    /* inline markdown-ish: `code`, **bold** */
    md: s => U.esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>'),
    highlight(code, lang = 'python') {
      const KW = {
        python: 'False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield match case self print len range',
        js: 'const let var function return if else for while do break continue new class extends this null undefined true false typeof instanceof async await try catch finally throw switch case default of in import export',
        cpp: 'int float double char bool void auto const return if else for while do break continue class struct public private protected new delete nullptr true false template typename using namespace std include virtual override unique_ptr shared_ptr vector map set string cout cin endl',
        java: 'public private protected class static void int double boolean char String new return if else for while do break continue extends implements this super null true false final import interface abstract ArrayList System out println',
        sql: 'SELECT FROM WHERE INSERT INTO VALUES UPDATE SET DELETE JOIN LEFT RIGHT INNER ON GROUP BY ORDER HAVING COUNT SUM AVG MIN MAX AS AND OR NOT NULL PRIMARY KEY FOREIGN REFERENCES CREATE TABLE INDEX BEGIN COMMIT ROLLBACK LIMIT DISTINCT',
        bash: 'cd ls pwd mkdir rm cp mv cat echo grep sudo chmod git pip python',
        asm: 'LOAD STORE ADD SUB JMP JZ OUT HALT MOV'
      }[lang] || '';
      const kw = new Set(KW.split(' '));
      const cm = lang === 'python' || lang === 'bash' ? '#' : lang === 'sql' ? '--' : lang === 'asm' ? ';' : '//';
      const re = new RegExp('(' + cm.replace(/[/]/g, '\\/') + '.*$)|("(?:[^"\\\\]|\\\\.)*"|\'(?:[^\'\\\\]|\\\\.)*\'|`[^`]*`)|(\\b\\d+(?:\\.\\d+)?\\b)|([A-Za-z_][A-Za-z0-9_]*)(?=\\s*\\()|([A-Za-z_][A-Za-z0-9_]*)', 'gm');
      return U.esc(code).replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(re, (m, c, s, n, f, w) => {
        const e = x => x.replace(/"/g, '&quot;');
        if (c) return '<span class="cm">' + e(c) + '</span>';
        if (s) return '<span class="st">' + e(s) + '</span>';
        if (n) return '<span class="nu">' + n + '</span>';
        if (f) return kw.has(f) ? '<span class="kw">' + f + '</span>' : '<span class="fn">' + f + '</span>';
        if (w) return kw.has(w) || kw.has(w.toUpperCase()) && lang === 'sql' ? '<span class="kw">' + w + '</span>' : w;
        return m;
      });
    },
    codeBlock(code, lang) { const p = U.h('pre', { class: 'code', tabindex: 0 }); p.innerHTML = U.highlight(code, lang); return p; },
    toast(msg, ms = 2600) { const t = U.h('div', { class: 'toast' }, msg); document.getElementById('toasts').append(t); setTimeout(() => t.remove(), ms); },
    modal(content, { onClose } = {}) {
      const ov = document.getElementById('overlay'); ov.innerHTML = ''; ov.hidden = false;
      const m = U.h('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true' }, content);
      ov.append(m);
      const close = () => { ov.hidden = true; ov.innerHTML = ''; onClose && onClose(); };
      ov.onclick = e => { if (e.target === ov) close(); };
      const f = m.querySelector('button, input, a'); f && f.focus();
      return close;
    },
    tabTextarea(ta) {
      ta.addEventListener('keydown', e => {
        if (e.key === 'Tab' && !e.shiftKey) { e.preventDefault(); const s = ta.selectionStart; ta.setRangeText('    ', s, ta.selectionEnd, 'end'); }
        if (e.key === 'Enter') {
          const s = ta.selectionStart, line = ta.value.slice(0, s).split('\n').pop(); let ind = line.match(/^\s*/)[0];
          if (/:\s*$|\{\s*$/.test(line)) ind += '    ';
          e.preventDefault(); ta.setRangeText('\n' + ind, s, ta.selectionEnd, 'end');
        }
      });
    }
  };

  /* ---------- generated questions (fresh numbers every time, so answers cannot be memorised) ---------- */
  const R = n => Math.floor(Math.random() * n);
  const GEN = {
    bin2dec() { const v = 1 + R(254); return { t: 'fill', q: `Convert the binary number \`${v.toString(2).padStart(8, '0')}\` to decimal.`, a: [String(v)], e: `Add the place values of each 1 bit: ${v.toString(2).padStart(8, '0').split('').map((b, i) => b === '1' ? 2 ** (7 - i) : null).filter(x => x !== null).join(' + ')} = ${v}.` }; },
    dec2hex() { const v = 16 + R(240); return { t: 'fill', q: `Write ${v} in hexadecimal (digits only, no 0x).`, a: [v.toString(16), v.toString(16).toUpperCase(), '0x' + v.toString(16)], e: `${v} = ${Math.floor(v / 16)} × 16 + ${v % 16}, so the hex digits are ${Math.floor(v / 16).toString(16).toUpperCase()} and ${(v % 16).toString(16).toUpperCase()}: ${v.toString(16).toUpperCase()}.` }; },
    hex2dec() { const v = 16 + R(240), hx = v.toString(16).toUpperCase(); return { t: 'fill', q: `What is 0x${hx} in decimal?`, a: [String(v)], e: `0x${hx} = ${parseInt(hx[0], 16)} × 16 + ${parseInt(hx[1], 16)} = ${v}.` }; },
    gate() {
      const gates = { AND: (a, b) => a & b, OR: (a, b) => a | b, XOR: (a, b) => a ^ b, NAND: (a, b) => 1 - (a & b), NOR: (a, b) => 1 - (a | b) };
      const g = Object.keys(gates)[R(5)], a = R(2), b = R(2), out = gates[g](a, b);
      return { t: 'mc', q: `A ${g} gate receives A = ${a} and B = ${b}. What is the output?`, o: [String(out), String(1 - out)], a: 0, e: { AND: 'AND outputs 1 only when both inputs are 1.', OR: 'OR outputs 1 when at least one input is 1.', XOR: 'XOR outputs 1 when the inputs differ.', NAND: 'NAND is NOT AND: 0 only when both inputs are 1.', NOR: 'NOR is NOT OR: 1 only when both inputs are 0.' }[g] };
    },
    bits() { const v = 1 + R(254); return { t: 'bits', q: `Flip the bits to make the number ${v}.`, target: v, e: `${v} in binary is ${v.toString(2).padStart(8, '0')}.` }; },
    bigo() {
      const items = [['A single loop over n items', 'O(n)'], ['Two nested loops, each over n items', 'O(n²)'], ['Binary search on a sorted list', 'O(log n)'], ['Reading list[i] by index', 'O(1)'], ['Merge sort', 'O(n log n)'], ['Trying every subset of n items', 'O(2ⁿ)']];
      const [d, a] = items[R(items.length)];
      return { t: 'mc', q: `Time complexity: ${d}?`, o: [a, ...U.shuffle(['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'].filter(x => x !== a)).slice(0, 3)], a: 0, e: `${d} grows as ${a}.` };
    },
    twos() { const v = -(1 + R(100)); const b = ((v + 256) >>> 0).toString(2).padStart(8, '0'); return { t: 'fill', q: `Write ${v} as an 8-bit two's complement binary number.`, a: [b], e: `Invert the bits of ${-v} (${(-v).toString(2).padStart(8, '0')}) and add 1: ${b}.` }; },
    subnet() { const p = [24, 25, 26, 27, 28, 16][R(6)]; const hosts = 2 ** (32 - p) - 2; return { t: 'fill', q: `How many usable host addresses does a /${p} IPv4 network have?`, a: [String(hosts)], e: `32 − ${p} = ${32 - p} host bits → 2^${32 - p} addresses, minus the network and broadcast addresses = ${hosts}.` }; }
  };
  function materialize(q) {
    if (q.t !== 'gen') return q;
    const g = GEN[q.g](); return Object.assign(g, { id: q.id, node: q.node, generated: true });
  }

  const KIND = { mc: 'Choose the answer', tf: 'True or false?', fill: 'Fill in the blank', short: 'Answer in your own words', match: 'Match the pairs', order: 'Put these in order', predict: 'What does this code print?', fix: 'Find the fix', code: 'Write the code', jscode: 'Write the code', bits: 'Interactive', gen: 'Quick drill' };

  /* ---------- renderers: each returns {el, ready(), check() -> {ok, answer}} ---------- */
  function renderQuestion(q, onChange) {
    const box = U.h('div');
    box.append(U.h('div', { class: 'qkind' }, KIND[q.t] || ''));
    box.append(U.h('div', { class: 'qtext', html: U.md(q.q) }));
    if (q.code && q.t !== 'code' && q.t !== 'jscode') box.append(U.codeBlock(q.code, q.lang || 'python'));
    const api = { el: box, ready: () => false, check: () => ({ ok: false }) };
    const R = RENDER[q.t] || RENDER.mc;
    R(q, box, api, onChange);
    return api;
  }

  const RENDER = {
    mc(q, box, api, changed) {
      const opts = U.shuffle(q.o.map((t, i) => ({ t, i })));
      let sel = null; const wrap = U.h('div', { class: 'choices', role: 'radiogroup' });
      const btns = opts.map((o, k) => {
        const hasCode = /\n/.test(o.t);
        const b = U.h('button', { class: 'choice', type: 'button', role: 'radio', 'aria-checked': 'false' }, U.h('span', { class: 'k' }, k + 1), hasCode ? U.codeBlock(o.t, q.lang || 'python') : U.h('span', { html: U.md(o.t) }));
        b.onclick = () => { sel = o; btns.forEach(x => { x.classList.toggle('sel', x === b); x.setAttribute('aria-checked', x === b); }); changed(); };
        wrap.append(b); return b;
      });
      box.append(wrap);
      api.keys = n => { if (btns[n - 1]) btns[n - 1].click(); };
      api.ready = () => !!sel;
      api.check = () => {
        const ok = sel.i === q.a;
        btns.forEach((b, k) => { if (opts[k].i === q.a) b.classList.add('right'); else if (opts[k] === sel) b.classList.add('wrong'); b.disabled = true; });
        return { ok, answer: q.o[q.a] };
      };
    },
    fix(q, box, api, changed) { RENDER.mc(q, box, api, changed); },
    tf(q, box, api, changed) {
      let sel = null; const wrap = U.h('div', { class: 'tfrow' });
      const mk = v => { const b = U.h('button', { class: 'choice', type: 'button' }, v ? 'True' : 'False'); b.onclick = () => { sel = v; [t, f].forEach(x => x.classList.toggle('sel', x === b)); changed(); }; return b; };
      const t = mk(true), f = mk(false); wrap.append(t, f); box.append(wrap);
      api.keys = n => { if (n === 1) t.click(); if (n === 2) f.click(); };
      api.ready = () => sel !== null;
      api.check = () => { const ok = sel === q.a; (q.a ? t : f).classList.add('right'); if (!ok) (sel ? t : f).classList.add('wrong'); t.disabled = f.disabled = true; return { ok, answer: q.a ? 'True' : 'False' }; };
    },
    fill(q, box, api, changed) {
      const inp = U.h('input', { class: 'textans' + (q.mono ? ' mono' : ''), type: 'text', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', 'aria-label': 'Your answer', placeholder: 'Type your answer' });
      inp.oninput = changed; box.append(inp); setTimeout(() => inp.focus(), 50);
      api.ready = () => inp.value.trim().length > 0;
      api.check = () => { inp.disabled = true; const v = U.norm(inp.value); const ok = q.a.some(a => U.norm(a) === v || U.norm(a).replace(/[\s()]/g, '') === v.replace(/[\s()]/g, '')); return { ok, answer: q.a[0] }; };
    },
    short(q, box, api, changed) {
      const ta = U.h('textarea', { class: 'textans', rows: 3, 'aria-label': 'Your answer', placeholder: 'Explain in a sentence or two' });
      ta.oninput = changed; box.append(ta); setTimeout(() => ta.focus(), 50);
      api.ready = () => ta.value.trim().length > 3;
      api.check = () => { ta.disabled = true; const v = U.norm(ta.value); const ok = q.a.every(group => group.some(k => v.includes(U.norm(k)))); return { ok, answer: q.model || q.a.map(g => g[0]).join(', ') }; };
    },
    predict(q, box, api, changed) {
      const ta = U.h('textarea', { class: 'textans mono', rows: Math.max(1, (q.a[0].match(/\n/g) || []).length + 1), 'aria-label': 'Predicted output', placeholder: 'Type the exact output', spellcheck: 'false' });
      ta.oninput = changed; box.append(ta); setTimeout(() => ta.focus(), 50);
      api.ready = () => ta.value.trim().length > 0;
      api.check = () => { ta.disabled = true; const v = U.normOut(ta.value); const ok = q.a.some(a => U.normOut(a) === v || U.normOut(a).toLowerCase() === v.toLowerCase()); return { ok, answer: q.a[0] }; };
    },
    match(q, box, api, changed) {
      const left = U.shuffle(q.p.map((p, i) => ({ t: p[0], i }))), right = U.shuffle(q.p.map((p, i) => ({ t: p[1], i })));
      const grid = U.h('div', { class: 'matchgrid' }); let pick = null, matched = 0, misses = 0;
      const col = (items, side) => items.map(it => { const b = U.h('button', { class: 'choice', type: 'button', html: U.md(it.t) }); b.dataset.side = side; b.dataset.i = it.i; b.onclick = () => click(b); return b; });
      const L = col(left, 'L'), Rr = col(right, 'R');
      for (let k = 0; k < L.length; k++) grid.append(L[k], Rr[k]);
      function click(b) {
        if (!pick || pick.dataset.side === b.dataset.side) { if (pick) pick.classList.remove('sel'); pick = b; b.classList.add('sel'); return; }
        if (pick.dataset.i === b.dataset.i) { [pick, b].forEach(x => { x.classList.remove('sel'); x.classList.add('done'); }); matched++; }
        else { misses++; [pick, b].forEach(x => { x.classList.remove('sel'); x.classList.add('shake'); setTimeout(() => x.classList.remove('shake'), 320); }); }
        pick = null; changed();
      }
      box.append(grid, U.h('p', { class: 'muted small' }, 'Tap an item on the left, then its partner on the right.'));
      api.ready = () => matched === q.p.length;
      api.check = () => ({ ok: misses <= Math.floor(q.p.length / 3), answer: q.p.map(p => p[0] + ' → ' + p[1]).join('; '), note: misses ? `${misses} wrong pairing${misses > 1 ? 's' : ''} on the way.` : '' });
    },
    order(q, box, api, changed) {
      let items = U.shuffle(q.o.map((t, i) => ({ t, i })));
      if (items.every((x, k) => x.i === k)) items.reverse();
      const code = q.o.some(t => /[(){}=:;]/.test(t)) && !q.plain;
      const ul = U.h('ol', { class: 'orderlist' }); box.append(ul, U.h('p', { class: 'muted small' }, 'Drag, or use the arrow buttons, to reorder.'));
      let moved = false;
      const draw = () => {
        ul.innerHTML = '';
        items.forEach((it, k) => {
          const li = U.h('li', { draggable: 'true' }, U.h('span', { class: 'grip', 'aria-hidden': 'true' }, '⠿'), U.h('span', { class: 'tx' + (code ? '' : ' plain') }, it.t),
            U.h('span', { class: 'mv' }, U.h('button', { type: 'button', 'aria-label': 'Move up', onclick: () => mv(k, -1) }, '↑'), U.h('button', { type: 'button', 'aria-label': 'Move down', onclick: () => mv(k, 1) }, '↓')));
          li.addEventListener('dragstart', e => { li.classList.add('dragging'); e.dataTransfer.setData('text/plain', k); });
          li.addEventListener('dragend', () => li.classList.remove('dragging'));
          li.addEventListener('dragover', e => e.preventDefault());
          li.addEventListener('drop', e => { e.preventDefault(); const from = +e.dataTransfer.getData('text/plain'); const [x] = items.splice(from, 1); items.splice(k, 0, x); moved = true; draw(); changed(); });
          ul.append(li);
        });
      };
      const mv = (k, d) => { const j = k + d; if (j < 0 || j >= items.length) return; [items[k], items[j]] = [items[j], items[k]]; moved = true; draw(); changed(); };
      draw();
      api.ready = () => moved;
      api.check = () => { const ok = items.every((x, k) => x.i === k); [...ul.children].forEach((li, k) => { li.classList.add(items[k].i === k ? 'right' : 'wrong'); li.querySelectorAll('button').forEach(b => b.disabled = true); li.draggable = false; }); return { ok, answer: q.o.join('\n') }; };
    },
    bits(q, box, api, changed) {
      const wrap = U.h('div', { class: 'bitsq' }); const bits = Array(8).fill(0); const readout = U.h('p', { class: 'muted', style: { textAlign: 'center' } });
      const upd = () => { const v = bits.reduce((a, b, i) => a + b * 2 ** (7 - i), 0); readout.textContent = 'Current value: ' + v; return v; };
      bits.forEach((_, i) => { const b = U.h('button', { type: 'button', 'aria-label': 'bit worth ' + 2 ** (7 - i) }, '0', U.h('small', {}, 2 ** (7 - i))); b.onclick = () => { bits[i] ^= 1; b.firstChild.textContent = bits[i]; b.classList.toggle('on', !!bits[i]); upd(); changed(); }; wrap.append(b); });
      box.append(wrap, readout); upd();
      api.ready = () => true;
      api.check = () => { const v = upd(); wrap.querySelectorAll('button').forEach(b => b.disabled = true); return { ok: v === q.target, answer: q.target.toString(2).padStart(8, '0') }; };
    },
    code(q, box, api, changed) { codeRenderer(q, box, api, changed, 'python'); },
    jscode(q, box, api, changed) { codeRenderer(q, box, api, changed, 'js'); }
  };

  function codeRenderer(q, box, api, changed, lang) {
    const ta = U.h('textarea', { spellcheck: 'false', 'aria-label': 'Code editor', autocapitalize: 'off' }); ta.value = q.starter || '';
    U.tabTextarea(ta);
    const out = U.h('div', { class: 'console', 'aria-live': 'polite' }, lang === 'python' ? 'Python loads the first time you run code (about 10 MB, then cached).' : 'Output appears here.');
    let passed = false, fails = 0, revealed = false, loadFail = false;
    const run = async (withTests) => {
      runBtn.disabled = testBtn.disabled = true; out.innerHTML = '<span>' + (lang === 'python' && Runner.pyStatus !== 'ready' ? 'Loading Python…' : 'Running…') + '</span>';
      const res = lang === 'python' ? await Runner.python(ta.value, withTests ? q.tests : '') : await Runner.javascript(ta.value, withTests ? q.tests : '');
      runBtn.disabled = testBtn.disabled = false;
      out.innerHTML = '';
      if (res.out) out.append(U.h('div', {}, res.out));
      if (res.ok) { out.append(U.h('div', { class: 'ok' }, withTests ? '✓ All tests passed.' : '✓ Ran without errors.')); if (withTests) { passed = true; changed(); } }
      else { out.append(U.h('div', { class: 'err' }, res.err || 'Error')); if (withTests) { fails++; passed = false; if (fails >= 2 && q.sol) solBtn.classList.remove('hidden'); changed(); } if (res.loadError) { loadFail = true; skipBtn.classList.remove('hidden'); } }
    };
    const runBtn = U.h('button', { class: 'btn ghost small', type: 'button', onclick: () => run(false) }, 'Run');
    const testBtn = U.h('button', { class: 'btn small', type: 'button', onclick: () => run(true) }, 'Run tests');
    const hintBtn = q.hint ? U.h('button', { class: 'linkbtn', type: 'button', onclick: () => { hintBtn.replaceWith(U.h('p', { class: 'small', html: '💡 ' + U.md(q.hint) })); } }, 'Show a hint') : null;
    const solBtn = U.h('button', { class: 'linkbtn hidden', type: 'button', onclick: () => { revealed = true; ta.value = q.sol; changed(); U.toast('Solution loaded. It will count as a miss so it comes back in review.'); } }, 'Show solution');
    const skipBtn = U.h('button', { class: 'linkbtn hidden', type: 'button', onclick: () => { api.skipped = true; changed(); } }, 'Skip this one (no hearts lost)');
    box.append(U.h('div', { class: 'codebox' }, ta, U.h('div', { class: 'tools' }, runBtn, testBtn, U.h('span', { class: 'spacer' }), hintBtn, solBtn, skipBtn)), out);
    if (lang === 'python') Runner.preloadPython();
    api.isCode = true;
    api.ready = () => passed || api.skipped || revealed;
    api.check = () => { ta.readOnly = true; if (api.skipped) return { ok: null, skipped: true, answer: '' }; return { ok: passed && !revealed, answer: q.sol ? 'One working solution:\n' + q.sol : '' }; };
  }

  /* Navigate, re-rendering even when the target is the page the session was started from. */
  function navigate(target) {
    const norm = x => (x || '#/').replace(/^#?\/?/, '#/');
    if (norm(location.hash) === norm(target)) window.App.render(); else location.hash = target;
  }

  /* ---------- session player ---------- */
  /* opts: {title, mode: lesson|practice|review|daily|checkpoint|weekly, learn:[cards], items:[question], nodeId, onFinish(result)} */
  function play(opts) {
    const main = document.getElementById('main');
    document.body.classList.add('in-lesson');
    const useHearts = opts.mode === 'lesson' && S.get().settings.hearts;
    const requeue = ['lesson', 'practice', 'review'].includes(opts.mode);
    let queue = opts.items.map(materialize);
    const total = queue.length; let doneCount = 0;
    const res = { correct: 0, wrong: 0, firstTry: 0, answered: 0, perNode: {}, code: 0, mistakes: [] };
    const seenWrong = new Set();
    const learn = opts.learn || [];
    let learnIdx = 0;

    const root = U.h('div', { class: 'player' });
    const bar = U.h('div', { class: 'bar' }, U.h('i', { style: { width: '0%' } }));
    const heartsEl = U.h('span', { class: 'chip hearts', style: { fontWeight: 700 } });
    const quit = U.h('button', { class: 'x', type: 'button', 'aria-label': 'Quit session', onclick: confirmQuit }, '×');
    root.append(U.h('div', { class: 'player-top' }, quit, bar, useHearts ? heartsEl : null));
    const body = U.h('div', { class: 'player-body' }); root.append(body);
    main.innerHTML = ''; main.append(root); window.scrollTo(0, 0);

    const setBar = () => { const p = learn.length && learnIdx < learn.length ? (learnIdx / (learn.length + total)) : ((learn.length + doneCount) / (learn.length + total)); bar.firstChild.style.width = Math.round(p * 100) + '%'; };
    const setHearts = () => { heartsEl.textContent = '♥ ' + S.hearts(); };
    if (useHearts) setHearts();

    function confirmQuit() {
      const close = U.modal(U.h('div', {}, U.h('h3', {}, 'Leave this session?'), U.h('p', { class: 'muted' }, 'Answers you already gave are saved to your review queue. Lesson completion and XP are only awarded at the end.'),
        U.h('div', { class: 'row' }, U.h('button', { class: 'btn ghost', onclick: () => close() }, 'Keep going'), U.h('button', { class: 'btn bad', onclick: () => { close(); exit(); } }, 'Leave'))));
    }
    function exit() { document.body.classList.remove('in-lesson'); document.removeEventListener('keydown', onKey); if (fb) fb.remove(); S.save(); navigate(location.hash || '#/'); }

    let cur = null, fb = null, state = 'answer';
    const onKey = e => {
      if (e.target.tagName === 'TEXTAREA' || (e.target.tagName === 'INPUT' && e.key !== 'Enter')) return;
      if (e.key === 'Enter') { const btn = root.querySelector('[data-primary]'); if (btn && !btn.disabled) { e.preventDefault(); btn.click(); } }
      if (/^[1-9]$/.test(e.key) && cur && cur.keys && state === 'answer') cur.keys(+e.key);
    };
    document.addEventListener('keydown', onKey);

    function showLearn() {
      setBar();
      const c = learn[learnIdx];
      body.innerHTML = '';
      const card = U.h('article', { class: 'learncard' }, U.h('div', { class: 'qkind' }, `Learn · ${learnIdx + 1} of ${learn.length}`), U.h('h2', {}, c.h), U.h('div', { html: c.p }));
      if (c.code) card.append(U.codeBlock(c.code, c.lang || 'python'));
      if (c.lab) card.append(U.h('p', {}, U.h('a', { href: '#/lab/' + c.lab, target: '_blank', rel: 'noopener' }, 'Open the interactive lab in a new tab')));
      body.append(card, U.h('div', { class: 'dots' }, learn.map((_, i) => U.h('i', { class: i === learnIdx ? 'on' : '' }))));
      footer(null, learnIdx === learn.length - 1 ? 'Start practice' : 'Continue', () => { learnIdx++; learnIdx < learn.length ? showLearn() : nextQ(); }, learnIdx > 0 ? () => { learnIdx--; showLearn(); } : null);
    }

    function footer(kind, label, action, back) {
      if (fb) fb.remove();
      fb = U.h('div', { class: 'feedback' + (kind ? ' ' + kind : '') });
      const inner = U.h('div', { class: 'in' });
      fb.append(inner);
      fb._inner = inner;
      if (back) inner.append(U.h('button', { class: 'btn ghost', type: 'button', onclick: back }, 'Back'));
      inner.append(U.h('div', { class: 'msg' }));
      const b = U.h('button', { class: 'btn' + (kind === 'no' ? ' bad' : kind === 'ok' ? ' good' : ''), type: 'button', 'data-primary': '', onclick: action }, label);
      inner.append(b); root.append(fb); return b;
    }

    function nextQ() {
      setBar();
      if (useHearts && S.hearts() <= 0) return outOfHearts();
      if (!queue.length) return finish();
      const q = queue.shift(); state = 'answer';
      body.innerHTML = '';
      if (q._review) body.append(U.h('div', { class: 'review-tag' }, 'Review from ' + (CS.nodeById[q.node] ? CS.nodeById[q.node].title : 'earlier')));
      if (q._retry) body.append(U.h('div', { class: 'review-tag' }, 'Try this one again'));
      const checkBtn = footer(null, 'Check', () => doCheck(q));
      checkBtn.disabled = true;
      cur = renderQuestion(q, () => { checkBtn.disabled = !cur.ready(); if (cur.isCode && cur.ready()) checkBtn.textContent = cur.skipped ? 'Skip' : 'Continue'; });
      body.append(cur.el);
      if (cur.ready()) checkBtn.disabled = false;
    }

    function doCheck(q) {
      state = 'feedback';
      const r = cur.check();
      if (r.skipped) { doneCount++; return nextQ(); }
      const ok = !!r.ok;
      if (!q._retry) { S.recordAnswer(q, ok); res.answered++; const pn = res.perNode[q.node] || (res.perNode[q.node] = { c: 0, t: 0 }); pn.t++; if (ok) pn.c++; }
      if (ok) { res.correct++; if (!seenWrong.has(q)) res.firstTry++; if (q.t === 'code' || q.t === 'jscode') { res.code++; S.bump('code'); } }
      else { res.wrong++; res.mistakes.push(q); seenWrong.add(q); if (useHearts) { S.loseHeart(); setHearts(); } if (requeue && !q._retry) queue.push(Object.assign(Object.create(Object.getPrototypeOf(q)), q, { _retry: true })); }
      doneCount = Math.min(total, doneCount + (ok || !requeue || q._retry ? 1 : 0));
      S.save();
      const btn = footer(ok ? 'ok' : 'no', 'Continue', nextQ);
      const msg = fb._inner.querySelector('.msg');
      const praise = ['Nice work!', 'Correct!', 'Exactly.', 'You got it.', 'Spot on.'];
      msg.append(U.h('b', {}, ok ? praise[Math.floor(Math.random() * praise.length)] : 'Not quite.'));
      const ex = U.h('div', { class: 'expl' });
      if (!ok && r.answer && q.t !== 'match') { ex.append(U.h('div', { class: 'small' }, 'Correct answer:')); ex.append(/\n/.test(r.answer) ? U.codeBlock(r.answer, q.lang || 'python') : U.h('div', { html: '<b>' + U.md(r.answer) + '</b>' })); }
      if (r.note) ex.append(U.h('div', { class: 'small' }, r.note));
      if (q.e) ex.append(U.h('div', { class: 'small', html: U.md(q.e) }));
      if (!ok && requeue && !q._retry) ex.append(U.h('div', { class: 'small muted' }, 'This question will come back at the end, and again in your review queue.'));
      msg.append(ex);
      btn.focus();
    }

    function outOfHearts() {
      body.innerHTML = '';
      body.append(U.h('div', { class: 'result' }, U.h('div', { class: 'big' }, '♥ 0'), U.h('h2', {}, 'Out of hearts'),
        U.h('p', { class: 'muted' }, 'Hearts refill one every 30 minutes. A review or practice session refills one heart right away, and it is the best way to fix the mistakes that cost them.'),
        U.h('div', { class: 'row', style: { justifyContent: 'center' } }, U.h('a', { class: 'btn good', href: '#/practice', onclick: () => { document.body.classList.remove('in-lesson'); if (fb) fb.remove(); } }, 'Go to practice'), U.h('button', { class: 'btn ghost', onclick: exit }, 'Leave lesson'))));
      if (fb) fb.remove();
    }

    function finish() {
      document.removeEventListener('keydown', onKey);
      if (fb) fb.remove();
      bar.firstChild.style.width = '100%';
      const out = opts.onFinish ? opts.onFinish(res) : { xp: 0 };
      const acc = res.answered ? Math.round(100 * (res.answered - res.mistakes.filter(m => !m._retry).length) / res.answered) : 100;
      body.innerHTML = '';
      const tiles = U.h('div', { class: 'tiles' },
        U.h('div', { class: 'stat' }, U.h('b', {}, '+' + (out.xp || 0)), U.h('span', {}, 'XP earned')),
        U.h('div', { class: 'stat' }, U.h('b', {}, acc + '%'), U.h('span', {}, 'accuracy')),
        U.h('div', { class: 'stat' }, U.h('b', {}, res.firstTry + '/' + res.answered), U.h('span', {}, 'right first time')));
      const r = U.h('div', { class: 'result' }, U.h('div', { class: 'big' }, out.headline || (res.wrong ? 'Session complete' : 'Flawless!')), U.h('p', { class: 'muted' }, out.sub || ''), tiles);
      if (out.extra) r.append(out.extra);
      if (res.mistakes.length) r.append(U.h('p', { class: 'small muted' }, `${res.mistakes.length} missed question${res.mistakes.length > 1 ? 's are' : ' is'} now in your review queue.`));
      body.append(r);
      footer('ok', out.nextLabel || 'Continue', () => { document.body.classList.remove('in-lesson'); if (fb) fb.remove(); navigate(out.next || '#/'); });
      (out.celebrate || []).forEach((m, i) => setTimeout(() => U.toast(m, 3500), 400 + i * 700));
    }

    learn.length ? showLearn() : nextQ();
  }

  window.U = U; window.Engine = { play, materialize, GEN, renderQuestion, KIND };
})();
