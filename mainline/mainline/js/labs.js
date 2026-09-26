/* Interactive labs. Each lab renders into a container and cleans up its timers when you navigate away. */
(function () {
  const { h } = U;
  let timers = [];
  const every = (fn, ms) => { const id = setInterval(fn, ms); timers.push(id); return id; };
  const stopAll = () => { timers.forEach(clearInterval); timers = []; };
  const btn = (label, onclick, cls = 'btn ghost small') => h('button', { class: cls, type: 'button', onclick }, label);
  const svgEl = (tag, attrs = {}) => { const e = document.createElementNS('http://www.w3.org/2000/svg', tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
  const cssVar = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

  /* Play/step controller shared by step-based labs */
  function stepper(el, getSteps, apply, { speed = 400 } = {}) {
    let steps = [], i = 0, playing = null;
    const playBtn = btn('Play', () => toggle(), 'btn small');
    const reset = () => { pause(); steps = getSteps(); i = 0; apply(steps[0], 0, steps.length); };
    const step = () => { if (i < steps.length - 1) { i++; apply(steps[i], i, steps.length); } else pause(); };
    const pause = () => { if (playing) { clearInterval(playing); playing = null; } playBtn.textContent = 'Play'; };
    const toggle = () => { if (playing) return pause(); if (i >= steps.length - 1) reset(); playBtn.textContent = 'Pause'; playing = every(step, speedInput ? 1100 - +speedInput.value : speed); };
    const speedInput = h('input', { type: 'range', min: 100, max: 1050, value: 700, 'aria-label': 'Speed', oninput: () => { if (playing) { pause(); toggle(); } } });
    el.append(playBtn, btn('Step', () => { pause(); step(); }), btn('Restart', reset), h('label', { class: 'small muted' }, 'Speed ', speedInput));
    return { reset, pause };
  }

  const LABS = [
    { id: 'binary', title: 'Binary & number systems', icon: '🔢', track: 'foundations', desc: 'Flip bits and watch decimal, hex, signed values and characters change.' },
    { id: 'gates', title: 'Logic gates & adders', icon: '🔌', track: 'foundations', desc: 'Toggle inputs through AND, OR, XOR, NAND and build a full adder.' },
    { id: 'cpu', title: 'CPU simulator', icon: '🧠', track: 'systems', desc: 'Run a tiny assembly program through fetch, decode and execute.' },
    { id: 'cache', title: 'Cache & memory hierarchy', icon: '🗄️', track: 'systems', desc: 'Send memory accesses through a direct-mapped cache and count hits.' },
    { id: 'sorting', title: 'Sorting algorithms', icon: '📊', track: 'core', desc: 'Bubble, selection, insertion, merge and quick sort, step by step.' },
    { id: 'search', title: 'Linear vs binary search', icon: '🔍', track: 'core', desc: 'See why halving the search space wins on sorted data.' },
    { id: 'lists', title: 'Linked lists, stacks & queues', icon: '🔗', track: 'core', desc: 'Push, pop, enqueue, insert, delete and reverse with pointers drawn.' },
    { id: 'trees', title: 'BSTs & heaps', icon: '🌳', track: 'core', desc: 'Insert, delete, search and traverse trees; sift values through a heap.' },
    { id: 'graph', title: 'Graph traversal & shortest paths', icon: '🕸️', track: 'core', desc: 'Run BFS, DFS and Dijkstra from any starting node.' },
    { id: 'network', title: 'A web request, packet by packet', icon: '📡', track: 'systems', desc: 'DHCP, DNS, TCP handshake, TLS and HTTP between real-looking hosts.' },
    { id: 'neural', title: 'Neural network playground', icon: '🧬', track: 'ai', desc: 'Train a small network on XOR and circles; watch the boundary form.' },
    { id: 'python', title: 'Python playground', icon: '🐍', track: 'python', desc: 'A scratchpad that runs real Python in your browser.' }
  ];

  const R = {};

  /* ---------- binary ---------- */
  R.binary = el => {
    const bits = Array(8).fill(0); bits[6] = 1; bits[4] = 1; bits[7] = 1;
    const row = h('div', { class: 'bitsq' }); const out = h('div', { class: 'readout' });
    const val = () => bits.reduce((a, b, i) => a + b * 2 ** (7 - i), 0);
    const set = v => { v = ((v % 256) + 256) % 256; for (let i = 0; i < 8; i++) bits[i] = (v >> (7 - i)) & 1; draw(); };
    const draw = () => {
      row.innerHTML = '';
      bits.forEach((b, i) => { const x = h('button', { type: 'button', class: b ? 'on' : '', 'aria-label': `bit ${7 - i}, worth ${2 ** (7 - i)}, currently ${b}` }, String(b), h('small', {}, 2 ** (7 - i))); x.onclick = () => { bits[i] ^= 1; draw(); }; row.append(x); });
      const v = val(), signed = v > 127 ? v - 256 : v;
      out.textContent = `Binary      ${bits.join('')}\nDecimal     ${v}\nHex         0x${v.toString(16).toUpperCase().padStart(2, '0')}\nOctal       0o${v.toString(8)}\nSigned (two's complement)  ${signed}\nASCII       ${v >= 32 && v < 127 ? "'" + String.fromCharCode(v) + "'" : '(not a printable character)'}\nSum         ${bits.map((b, i) => b ? 2 ** (7 - i) : null).filter(x => x !== null).join(' + ') || '0'}`;
    };
    const inp = h('input', { type: 'number', min: 0, max: 255, value: 0, 'aria-label': 'Decimal value' });
    el.append(h('p', { class: 'muted' }, 'Each switch is one bit. Its value doubles from right to left. Tap bits, or type a number.'),
      h('div', { class: 'controls' }, inp, btn('Set', () => set(+inp.value)), btn('+1', () => set(val() + 1)), btn('Shift left (×2)', () => set(val() << 1)), btn('Shift right (÷2)', () => set(val() >> 1)), btn('NOT', () => set(~val() & 255)), btn('Clear', () => set(0))),
      row, out, h('p', { class: 'small muted' }, 'Try: count up with +1 and watch the rightmost bit flip every time. Shift left on 200 and see the overflow drop off the edge.'));
    draw();
  };

  /* ---------- gates ---------- */
  R.gates = el => {
    const G = {
      AND: { f: (a, b) => a & b, n: 2 }, OR: { f: (a, b) => a | b, n: 2 }, NOT: { f: a => 1 - a, n: 1 }, NAND: { f: (a, b) => 1 - (a & b), n: 2 },
      NOR: { f: (a, b) => 1 - (a | b), n: 2 }, XOR: { f: (a, b) => a ^ b, n: 2 }, XNOR: { f: (a, b) => 1 - (a ^ b), n: 2 },
      'Half adder': { f: (a, b) => [a ^ b, a & b], n: 2, outs: ['Sum', 'Carry'] }, 'Full adder': { f: (a, b, c) => [a ^ b ^ c, (a & b) | (c & (a ^ b))], n: 3, outs: ['Sum', 'Cout'] }
    };
    let g = 'AND'; const ins = [0, 0, 0];
    const sel = h('select', { 'aria-label': 'Gate', onchange: () => { g = sel.value; draw(); } }, Object.keys(G).map(k => h('option', { value: k }, k)));
    const inBtns = h('div', { class: 'row' }); const svgBox = h('div'); const table = h('div');
    const draw = () => {
      const def = G[g], n = def.n, outs = def.outs || ['Out'];
      inBtns.innerHTML = '';
      ['A', 'B', 'Cin'].slice(0, n).forEach((name, i) => inBtns.append(btn(`${name} = ${ins[i]}`, () => { ins[i] ^= 1; draw(); }, 'btn small ' + (ins[i] ? 'good' : 'ghost'))));
      let r = def.f(...ins.slice(0, n)); if (!Array.isArray(r)) r = [r];
      const on = cssVar('--good'), off = cssVar('--locked'), ink = cssVar('--ink');
      const s = svgEl('svg', { viewBox: '0 0 520 200', role: 'img', 'aria-label': `${g} with inputs ${ins.slice(0, n).join(', ')} gives ${r.join(', ')}` });
      const ys = n === 1 ? [100] : n === 2 ? [70, 130] : [55, 100, 145];
      ys.forEach((y, i) => { s.append(svgEl('line', { x1: 40, y1: y, x2: 190, y2: y, stroke: ins[i] ? on : off, 'stroke-width': 7, 'stroke-linecap': 'round' })); const t = svgEl('text', { x: 10, y: y + 6, fill: ink, 'font-weight': 700, 'font-size': 18 }); t.textContent = ins[i]; s.append(t); });
      s.append(svgEl('rect', { x: 190, y: 30, width: 150, height: 140, rx: 20, fill: 'none', stroke: ink, 'stroke-width': 4 }));
      const lab = svgEl('text', { x: 265, y: 108, 'text-anchor': 'middle', fill: ink, 'font-weight': 800, 'font-size': g.length > 5 ? 18 : 26 }); lab.textContent = g; s.append(lab);
      const oy = r.length === 1 ? [100] : [75, 125];
      r.forEach((v, i) => { s.append(svgEl('line', { x1: 340, y1: oy[i], x2: 470, y2: oy[i], stroke: v ? on : off, 'stroke-width': 7, 'stroke-linecap': 'round' })); const t = svgEl('text', { x: 478, y: oy[i] + 6, fill: ink, 'font-weight': 700, 'font-size': 16 }); t.textContent = `${outs[i]}=${v}`; s.append(t); });
      svgBox.innerHTML = ''; svgBox.append(s);
      const rows = []; for (let m = 0; m < 2 ** n; m++) { const v = Array.from({ length: n }, (_, k) => (m >> (n - 1 - k)) & 1); let o = def.f(...v); if (!Array.isArray(o)) o = [o]; rows.push([v, o]); }
      table.innerHTML = '';
      const t = h('table', { class: 'simple' }, h('tr', {}, ['A', 'B', 'Cin'].slice(0, n).map(x => h('th', {}, x)), outs.map(x => h('th', {}, x))));
      rows.forEach(([v, o]) => { const cur = v.every((x, k) => x === ins[k]); t.append(h('tr', { style: cur ? { background: 'var(--good-bg)', fontWeight: 700 } : {} }, v.map(x => h('td', {}, x)), o.map(x => h('td', {}, x)))); });
      table.append(t);
    };
    el.append(h('div', { class: 'controls' }, sel, inBtns), svgBox, h('h3', {}, 'Truth table'), table,
      h('p', { class: 'small muted' }, 'A full adder is two half adders plus an OR gate. Chain eight of them and you can add two bytes, which is exactly what an ALU does.'));
    draw();
  };

  /* ---------- sorting ---------- */
  function* bubble(a) { const n = a.length; for (let i = 0; i < n; i++) { for (let j = 0; j < n - i - 1; j++) { yield { cmp: [j, j + 1] }; if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; yield { swp: [j, j + 1] }; } } yield { done: n - i - 1 }; } }
  function* selection(a) { const n = a.length; for (let i = 0; i < n; i++) { let m = i; for (let j = i + 1; j < n; j++) { yield { cmp: [m, j] }; if (a[j] < a[m]) m = j; } if (m !== i) { [a[i], a[m]] = [a[m], a[i]]; yield { swp: [i, m] }; } yield { done: i }; } }
  function* insertion(a) { for (let i = 1; i < a.length; i++) { let j = i; while (j > 0) { yield { cmp: [j - 1, j] }; if (a[j - 1] > a[j]) { [a[j - 1], a[j]] = [a[j], a[j - 1]]; yield { swp: [j - 1, j] }; j--; } else break; } } }
  function* merge(a, lo = 0, hi = a.length - 1) { if (lo >= hi) return; const mid = (lo + hi) >> 1; yield* merge(a, lo, mid); yield* merge(a, mid + 1, hi); const L = a.slice(lo, mid + 1), Rr = a.slice(mid + 1, hi + 1); let i = 0, j = 0, k = lo; while (i < L.length && j < Rr.length) { yield { cmp: [lo + i, mid + 1 + j] }; a[k] = L[i] <= Rr[j] ? L[i++] : Rr[j++]; yield { swp: [k, k] }; k++; } while (i < L.length) { a[k] = L[i++]; yield { swp: [k, k] }; k++; } while (j < Rr.length) { a[k] = Rr[j++]; yield { swp: [k, k] }; k++; } }
  function* quick(a, lo = 0, hi = a.length - 1) { if (lo >= hi) { if (lo === hi) yield { done: lo }; return; } const p = a[hi]; let i = lo; for (let j = lo; j < hi; j++) { yield { cmp: [j, hi], pivot: hi }; if (a[j] < p) { [a[i], a[j]] = [a[j], a[i]]; yield { swp: [i, j], pivot: hi }; i++; } } [a[i], a[hi]] = [a[hi], a[i]]; yield { swp: [i, hi] }; yield { done: i }; yield* quick(a, lo, i - 1); yield* quick(a, i + 1, hi); }
  const SORTS = { 'Bubble sort': [bubble, 'O(n²) comparisons. Largest values bubble to the end each pass.'], 'Selection sort': [selection, 'O(n²). Finds the minimum of the unsorted part and swaps it into place.'], 'Insertion sort': [insertion, 'O(n²) worst, O(n) on nearly-sorted data. Slides each item left into place.'], 'Merge sort': [merge, 'O(n log n) always. Splits in half, sorts each half, merges them.'], 'Quick sort': [quick, 'O(n log n) average, O(n²) worst. Partitions around a pivot (purple).'] };
  R.sorting = el => {
    let algo = 'Bubble sort', size = 24, base = [];
    const bars = h('div', { class: 'bars', role: 'img', 'aria-label': 'Array shown as bars' }); const info = h('div', { class: 'readout' }); const desc = h('p', { class: 'muted' });
    const sel = h('select', { 'aria-label': 'Algorithm', onchange: () => { algo = sel.value; ctl.reset(); } }, Object.keys(SORTS).map(k => h('option', {}, k)));
    const sizeIn = h('input', { type: 'range', min: 6, max: 60, value: size, 'aria-label': 'Array size', onchange: () => { size = +sizeIn.value; fresh(); } });
    const fresh = () => { base = Array.from({ length: size }, () => 5 + Math.floor(Math.random() * 95)); ctl.reset(); };
    const getSteps = () => {
      const a = base.slice(), steps = [{ a: a.slice(), cmp: 0, sw: 0, done: new Set() }]; let cmp = 0, sw = 0; const done = new Set();
      for (const ev of SORTS[algo][0](a)) { if (ev.cmp) cmp++; if (ev.swp) sw++; if (ev.done !== undefined) done.add(ev.done); steps.push({ a: a.slice(), ev, cmp, sw, done: new Set(done) }); if (steps.length > 6000) break; }
      steps.push({ a: a.slice(), cmp, sw, done: new Set(a.map((_, i) => i)), final: true }); return steps;
    };
    const apply = (s, i, n) => {
      desc.textContent = SORTS[algo][1];
      const max = Math.max(...s.a); bars.innerHTML = '';
      s.a.forEach((v, k) => { const d = h('div', { style: { height: (v / max * 100) + '%' } }); const ev = s.ev || {}; if (s.done.has(k)) d.className = 'done'; if (ev.cmp && ev.cmp.includes(k)) d.className = 'cmp'; if (ev.swp && ev.swp.includes(k)) d.className = 'swp'; if (ev.pivot === k) d.className = 'pivot'; bars.append(d); });
      info.textContent = `Step ${i} of ${n - 1}   comparisons: ${s.cmp}   ${algo === 'Merge sort' ? 'writes' : 'swaps'}: ${s.sw}${s.final ? '   ✓ sorted' : ''}\nGold = comparing, red = moving, green = in final place.`;
    };
    const controls = h('div', { class: 'controls' }, sel, h('label', { class: 'small muted' }, 'Size ', sizeIn), btn('New array', () => fresh()), btn('Nearly sorted', () => { base = Array.from({ length: size }, (_, i) => 5 + Math.round(i * 90 / size)); for (let k = 0; k < 2; k++) { const i = Math.floor(Math.random() * size), j = Math.floor(Math.random() * size); [base[i], base[j]] = [base[j], base[i]]; } ctl.reset(); }));
    const ctl = stepper(controls, getSteps, apply);
    el.append(controls, desc, bars, info, h('p', { class: 'small muted' }, 'Try insertion sort on a nearly sorted array, then quick sort on the same one. Count the comparisons.'));
    fresh();
  };

  /* ---------- search ---------- */
  R.search = el => {
    let arr = [], mode = 'Binary search';
    const cells = h('div', { class: 'cells' }); const info = h('div', { class: 'readout' });
    const tIn = h('input', { type: 'number', 'aria-label': 'Target', value: 0 });
    const sel = h('select', { 'aria-label': 'Search type', onchange: () => { mode = sel.value; ctl.reset(); } }, h('option', {}, 'Binary search'), h('option', {}, 'Linear search'));
    const fresh = () => { const s = new Set(); while (s.size < 20) s.add(1 + Math.floor(Math.random() * 99)); arr = [...s].sort((a, b) => a - b); tIn.value = arr[Math.floor(Math.random() * 20)]; ctl.reset(); };
    const getSteps = () => {
      const t = +tIn.value, steps = [{ msg: `Looking for ${t}.`, lo: 0, hi: arr.length - 1 }];
      if (mode === 'Linear search') { for (let i = 0; i < arr.length; i++) { const hit = arr[i] === t; steps.push({ cur: i, found: hit ? i : -1, msg: `Check index ${i}: ${arr[i]} ${hit ? '== target. Found!' : '!= ' + t}`, n: i + 1 }); if (hit) return steps; } steps.push({ msg: `Not found after ${arr.length} checks.`, n: arr.length }); return steps; }
      let lo = 0, hi = arr.length - 1, n = 0;
      while (lo <= hi) { const mid = (lo + hi) >> 1; n++; if (arr[mid] === t) { steps.push({ lo, hi, cur: mid, found: mid, msg: `mid = (${lo}+${hi})//2 = ${mid}; ${arr[mid]} == ${t}. Found in ${n} checks!`, n }); return steps; } const go = arr[mid] < t; steps.push({ lo, hi, cur: mid, msg: `mid = ${mid}; ${arr[mid]} ${go ? '<' : '>'} ${t}, so discard the ${go ? 'left' : 'right'} half.`, n }); if (go) lo = mid + 1; else hi = mid - 1; }
      steps.push({ lo, hi, msg: `lo > hi: ${t} is not in the list. ${n} checks.`, n }); return steps;
    };
    const apply = s => {
      cells.innerHTML = '';
      arr.forEach((v, i) => { const out = s.lo !== undefined && (i < s.lo || i > s.hi) && mode === 'Binary search'; cells.append(h('div', { class: i === s.found ? 'hit' : i === s.cur ? 'cur' : out ? 'out' : '' }, v, h('small', {}, i))); });
      info.textContent = s.msg + (s.n ? `\nChecks so far: ${s.n}` : '') + `\nWorst case for ${arr.length} items: linear = ${arr.length}, binary = ${Math.ceil(Math.log2(arr.length + 1))}.`;
    };
    const controls = h('div', { class: 'controls' }, sel, h('label', { class: 'small muted' }, 'Target ', tIn), btn('Search', () => ctl.reset(), 'btn small good'), btn('New list', () => fresh()));
    const ctl = stepper(controls, getSteps, apply);
    el.append(controls, cells, info); fresh();
  };

  /* ---------- linked list, stack, queue ---------- */
  R.lists = el => {
    let mode = 'Linked list', items = [7, 3, 9], hl = -1, msg = 'A singly linked list: each node stores a value and a pointer to the next node.';
    const svgBox = h('div', { style: { overflowX: 'auto' } }); const info = h('div', { class: 'readout' });
    const vIn = h('input', { type: 'number', value: 5, 'aria-label': 'Value', style: { width: '90px' } });
    const ops = h('div', { class: 'row' });
    const v = () => +vIn.value;
    const bump = () => { vIn.value = 1 + Math.floor(Math.random() * 99); };
    const act = { 
      'Linked list': [['Insert at head', () => { items.unshift(v()); hl = 0; msg = `Insert ${v()} at head: new node points to old head. O(1).`; bump(); }], ['Insert at tail', () => { items.push(v()); hl = items.length - 1; msg = `Insert ${v()} at tail: walk to the end (O(n)) unless you keep a tail pointer (O(1)).`; bump(); }], ['Delete value', () => { const i = items.indexOf(v()); if (i < 0) { msg = `${v()} is not in the list. Searched all ${items.length} nodes: O(n).`; hl = -1; } else { items.splice(i, 1); hl = -1; msg = `Deleted ${v()} after walking ${i + 1} nodes: the previous node now points past it.`; } }], ['Search', () => { const i = items.indexOf(v()); hl = i; msg = i < 0 ? `${v()} not found after ${items.length} steps.` : `Found ${v()} at position ${i} after ${i + 1} steps. No random access in a linked list.`; }], ['Reverse', () => { items.reverse(); hl = -1; msg = 'Reversed in place by flipping every next pointer: prev, cur, next. O(n) time, O(1) extra space.'; }]],
      'Stack': [['Push', () => { items.push(v()); hl = items.length - 1; msg = `push(${v()}): goes on top. O(1).`; bump(); }], ['Pop', () => { if (!items.length) { msg = 'Stack underflow: nothing to pop.'; return; } const x = items.pop(); hl = items.length - 1; msg = `pop() returned ${x}. Last in, first out.`; }], ['Peek', () => { hl = items.length - 1; msg = items.length ? `peek() = ${items[items.length - 1]} (not removed).` : 'Empty stack.'; }]],
      'Queue': [['Enqueue', () => { items.push(v()); hl = items.length - 1; msg = `enqueue(${v()}): joins the back. O(1).`; bump(); }], ['Dequeue', () => { if (!items.length) { msg = 'Queue is empty.'; return; } const x = items.shift(); hl = 0; msg = `dequeue() returned ${x}. First in, first out.`; }], ['Peek front', () => { hl = 0; msg = items.length ? `front = ${items[0]}.` : 'Empty queue.'; }]]
    };
    const sel = h('select', { 'aria-label': 'Structure', onchange: () => { mode = sel.value; items = [4, 8, 1]; hl = -1; msg = { 'Stack': 'A stack: only the top is reachable. Think of the call stack or an undo history.', 'Queue': 'A queue: add at the back, remove from the front. Think of a print queue or BFS.' }[mode] || 'A singly linked list.'; build(); } }, Object.keys(act).map(k => h('option', {}, k)));
    const build = () => { ops.innerHTML = ''; act[mode].forEach(([l, f]) => ops.append(btn(l, () => { f(); draw(); }))); draw(); };
    const draw = () => {
      const ink = cssVar('--ink'), pri = cssVar('--primary'), gold = cssVar('--gold'), muted = cssVar('--muted');
      const vertical = mode === 'Stack', n = items.length;
      const W = vertical ? 300 : Math.max(520, 40 + n * 110 + 80), Hh = vertical ? Math.max(160, 40 + n * 52) : 140;
      const s = svgEl('svg', { viewBox: `0 0 ${W} ${Hh}`, style: `min-width:${Math.min(W, 900)}px`, role: 'img', 'aria-label': mode + ' containing ' + (items.join(', ') || 'nothing') });
      items.forEach((val, i) => {
        let x, y; if (vertical) { x = 90; y = Hh - 50 - i * 52; } else { x = 30 + i * 110; y = 45; }
        s.append(svgEl('rect', { x, y, width: mode === 'Linked list' ? 80 : 110, height: 44, rx: 8, fill: i === hl ? gold : 'none', stroke: ink, 'stroke-width': 3 }));
        const t = svgEl('text', { x: x + (mode === 'Linked list' ? 28 : 55), y: y + 29, 'text-anchor': 'middle', fill: ink, 'font-weight': 700, 'font-size': 18 }); t.textContent = val; s.append(t);
        if (mode === 'Linked list') { s.append(svgEl('line', { x1: x + 56, y1: y, x2: x + 56, y2: y + 44, stroke: ink, 'stroke-width': 2 })); s.append(svgEl('circle', { cx: x + 68, cy: y + 22, r: 4, fill: pri })); const x2 = i < n - 1 ? x + 108 : x + 100; s.append(svgEl('line', { x1: x + 68, y1: y + 22, x2, y2: y + 22, stroke: pri, 'stroke-width': 3, 'marker-end': 'url(#ar)' })); if (i === n - 1) { const nl = svgEl('text', { x: x + 104, y: y + 27, fill: muted, 'font-size': 14 }); nl.textContent = 'None'; s.append(nl); } }
        if (!vertical && mode === 'Queue' && (i === 0 || i === n - 1)) { const l = svgEl('text', { x: x + 55, y: y - 10, 'text-anchor': 'middle', fill: muted, 'font-size': 13 }); l.textContent = i === 0 ? (n === 1 ? 'front/back' : 'front') : 'back'; s.append(l); }
        if (vertical && i === n - 1) { const l = svgEl('text', { x: x + 125, y: y + 28, fill: muted, 'font-size': 14 }); l.textContent = '← top'; s.append(l); }
      });
      if (mode === 'Linked list') { const l = svgEl('text', { x: 30, y: 30, fill: muted, 'font-size': 13 }); l.textContent = 'head'; s.append(l); }
      const defs = svgEl('defs'); const m = svgEl('marker', { id: 'ar', markerWidth: 10, markerHeight: 10, refX: 8, refY: 5, orient: 'auto' }); m.append(svgEl('path', { d: 'M0,0 L10,5 L0,10 z', fill: pri })); defs.append(m); s.prepend(defs);
      svgBox.innerHTML = ''; svgBox.append(s); info.textContent = msg + `\nSize: ${n}`;
    };
    el.append(h('div', { class: 'controls' }, sel, h('label', { class: 'small muted' }, 'Value ', vIn), ops), svgBox, info);
    build();
  };

  /* ---------- trees: BST & heap ---------- */
  R.trees = el => {
    let mode = 'BST', root = null, heap = [], path = [], order = [], msg = '';
    const node = v => ({ v, l: null, r: null });
    const ins = (t, v) => { if (!t) return node(v); if (v < t.v) t.l = ins(t.l, v); else if (v > t.v) t.r = ins(t.r, v); return t; };
    const del = (t, v) => { if (!t) return t; if (v < t.v) t.l = del(t.l, v); else if (v > t.v) t.r = del(t.r, v); else { if (!t.l) return t.r; if (!t.r) return t.l; let m = t.r; while (m.l) m = m.l; t.v = m.v; t.r = del(t.r, m.v); } return t; };
    const hgt = t => t ? 1 + Math.max(hgt(t.l), hgt(t.r)) : 0;
    const vIn = h('input', { type: 'number', value: 42, 'aria-label': 'Value', style: { width: '90px' } });
    const svgBox = h('div', { style: { overflowX: 'auto' } }); const info = h('div', { class: 'readout' }); const ops = h('div', { class: 'row' });
    const heapTree = () => { const mk = i => i < heap.length ? { v: heap[i], i, l: mk(2 * i + 1), r: mk(2 * i + 2) } : null; return mk(0); };
    const draw = () => {
      const t = mode === 'BST' ? root : heapTree(), H = Math.max(1, hgt(t)), W = Math.max(560, 2 ** (H - 1) * 56), Ht = H * 72 + 30;
      const s = svgEl('svg', { viewBox: `0 0 ${W} ${Ht}`, style: `min-width:${Math.min(W, 1200)}px`, role: 'img', 'aria-label': mode + ' diagram' });
      const ink = cssVar('--ink'), gold = cssVar('--gold'), good = cssVar('--good'), rule = cssVar('--rule');
      const walk = (n, x, y, dx) => { if (!n) return; [[n.l, -1], [n.r, 1]].forEach(([c, d]) => { if (c) { s.append(svgEl('line', { x1: x, y1: y, x2: x + d * dx, y2: y + 72, stroke: rule, 'stroke-width': 3 })); walk(c, x + d * dx, y + 72, dx / 2); } });
        const k = order.indexOf(n.v); s.append(svgEl('circle', { cx: x, cy: y, r: 22, fill: path.includes(n.v) ? gold : k >= 0 ? good : cssVar('--surface'), stroke: ink, 'stroke-width': 3 }));
        const tx = svgEl('text', { x, y: y + 6, 'text-anchor': 'middle', 'font-weight': 700, 'font-size': 15, fill: ink }); tx.textContent = n.v; s.append(tx);
        if (k >= 0) { const o = svgEl('text', { x: x + 24, y: y - 16, 'font-size': 12, fill: good, 'font-weight': 700 }); o.textContent = k + 1; s.append(o); } };
      walk(t, W / 2, 34, W / 4);
      svgBox.innerHTML = ''; svgBox.append(s);
      info.textContent = msg + (mode === 'Heap' ? `\nArray form: [${heap.join(', ')}]  (children of i are at 2i+1 and 2i+2)` : `\nHeight: ${hgt(root)}`);
    };
    const animateOrder = seq => { order = []; let i = 0; const id = every(() => { if (i >= seq.length) { clearInterval(id); return; } order.push(seq[i++]); draw(); }, 450); };
    const trav = kind => { const out = []; const go = n => { if (!n) return; if (kind === 'Pre-order') out.push(n.v); go(n.l); if (kind === 'In-order') out.push(n.v); go(n.r); if (kind === 'Post-order') out.push(n.v); }; if (kind === 'Level-order') { const q = root ? [root] : []; while (q.length) { const n = q.shift(); out.push(n.v); n.l && q.push(n.l); n.r && q.push(n.r); } } else go(root); msg = `${kind}: ${out.join(', ')}${kind === 'In-order' ? '  (sorted! that is the BST property)' : ''}`; path = []; animateOrder(out); };
    const val = () => { const x = +vIn.value; vIn.value = 1 + Math.floor(Math.random() * 99); return x; };
    const act = {
      BST: [['Insert', () => { const x = val(); path = []; let t = root; while (t) { path.push(t.v); t = x < t.v ? t.l : t.r; } root = ins(root, x); order = []; msg = `Insert ${x}: compared with ${path.join(' → ') || 'nothing (new root)'}, then placed as a leaf.`; }],
        ['Search', () => { const x = +vIn.value; path = []; let t = root; while (t && t.v !== x) { path.push(t.v); t = x < t.v ? t.l : t.r; } if (t) path.push(t.v); order = []; msg = t ? `Found ${x} in ${path.length} comparisons.` : `${x} not found after ${path.length} comparisons.`; }],
        ['Delete', () => { const x = +vIn.value; root = del(root, x); path = []; order = []; msg = `Deleted ${x} (if present). A node with two children is replaced by its in-order successor.`; }],
        ...['In-order', 'Pre-order', 'Post-order', 'Level-order'].map(k => [k, () => trav(k)]),
        ['Random tree', () => { root = null; [50, 30, 70, 20, 40, 60, 80, 35, 65].sort(() => Math.random() - .5).forEach(v => root = ins(root, v)); path = []; order = []; msg = 'Same values, random insertion order: the shape changes, the in-order traversal does not.'; }],
        ['Sorted inserts', () => { root = null; [10, 20, 30, 40, 50, 60].forEach(v => root = ins(root, v)); path = []; order = []; msg = 'Inserting sorted data makes a degenerate BST: it is really a linked list. Search becomes O(n). Balanced trees (AVL, red-black) prevent this.'; }]],
      Heap: [['Insert', () => { const x = val(); heap.push(x); let i = heap.length - 1, sw = 0; while (i > 0 && heap[(i - 1) >> 1] > heap[i]) { const p = (i - 1) >> 1; [heap[p], heap[i]] = [heap[i], heap[p]]; i = p; sw++; } path = [x]; order = []; msg = `Insert ${x} at the end, sift up with ${sw} swap(s). O(log n).`; }],
        ['Extract min', () => { if (!heap.length) { msg = 'Heap is empty.'; return; } const m = heap[0]; const last = heap.pop(); if (heap.length) { heap[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let s = i; if (l < heap.length && heap[l] < heap[s]) s = l; if (r < heap.length && heap[r] < heap[s]) s = r; if (s === i) break; [heap[s], heap[i]] = [heap[i], heap[s]]; i = s; } } path = []; order = []; msg = `Removed the minimum, ${m}. The last item moved to the root and sifted down. O(log n).`; }],
        ['Random heap', () => { heap = []; for (let k = 0; k < 9; k++) { act.Heap[0][1](); } msg = 'Every parent is ≤ its children. The minimum is always at the root.'; }]]
    };
    const sel = h('select', { 'aria-label': 'Structure', onchange: () => { mode = sel.value; path = []; order = []; msg = mode === 'BST' ? 'Binary search tree: left < node < right.' : 'Min-heap: a complete binary tree stored in an array.'; build(); } }, h('option', {}, 'BST'), h('option', {}, 'Heap'));
    const build = () => { ops.innerHTML = ''; act[mode].forEach(([l, f]) => ops.append(btn(l, () => { f(); draw(); }))); draw(); };
    [50, 30, 70, 20, 40, 60, 80].forEach(v => root = ins(root, v)); msg = 'Binary search tree: left < node < right. Try a traversal.';
    el.append(h('div', { class: 'controls' }, sel, h('label', { class: 'small muted' }, 'Value ', vIn)), ops, svgBox, info); build();
  };

  /* ---------- graph ---------- */
  R.graph = el => {
    const N = { A: [80, 60], B: [240, 40], C: [400, 70], D: [120, 200], E: [280, 170], F: [440, 210], G: [200, 320], H: [380, 330] };
    const E = [['A', 'B', 4], ['A', 'D', 2], ['B', 'C', 5], ['B', 'E', 10], ['D', 'E', 3], ['C', 'F', 3], ['E', 'F', 4], ['D', 'G', 8], ['E', 'H', 6], ['G', 'H', 1], ['F', 'H', 2]];
    const adj = {}; Object.keys(N).forEach(k => adj[k] = []); E.forEach(([a, b, w]) => { adj[a].push([b, w]); adj[b].push([a, w]); }); Object.values(adj).forEach(l => l.sort());
    let algo = 'BFS', start = 'A';
    const svgBox = h('div'); const info = h('div', { class: 'readout' });
    const sel = h('select', { 'aria-label': 'Algorithm', onchange: () => { algo = sel.value; ctl.reset(); } }, ['BFS', 'DFS', 'Dijkstra'].map(x => h('option', {}, x)));
    const getSteps = () => {
      const steps = [];
      if (algo === 'Dijkstra') {
        const dist = {}, prev = {}, done = new Set(); Object.keys(N).forEach(k => dist[k] = Infinity); dist[start] = 0;
        steps.push({ visited: new Set(), cur: null, dist: { ...dist }, msg: `All distances start at ∞ except ${start} = 0.` });
        while (done.size < Object.keys(N).length) {
          const u = Object.keys(N).filter(k => !done.has(k)).sort((a, b) => dist[a] - dist[b])[0]; if (dist[u] === Infinity) break; done.add(u);
          const upd = []; for (const [v, w] of adj[u]) if (!done.has(v) && dist[u] + w < dist[v]) { dist[v] = dist[u] + w; prev[v] = u; upd.push(`${v}=${dist[v]}`); }
          steps.push({ visited: new Set(done), cur: u, dist: { ...dist }, prev: { ...prev }, msg: `Take the closest unvisited node, ${u} (${dist[u]}). ${upd.length ? 'Relax: ' + upd.join(', ') : 'No shorter paths found.'}` });
        }
        return steps;
      }
      const seen = new Set([start]), order = [], frontier = [start];
      steps.push({ visited: new Set(), cur: null, frontier: [...frontier], msg: `${algo === 'BFS' ? 'Queue' : 'Stack'} starts with ${start}.` });
      while (frontier.length) {
        const u = algo === 'BFS' ? frontier.shift() : frontier.pop();
        if (algo === 'DFS' && order.includes(u)) continue;
        order.push(u); const added = [];
        const nb = adj[u].map(x => x[0]); (algo === 'DFS' ? nb.slice().reverse() : nb).forEach(v => { if (algo === 'BFS' ? !seen.has(v) : !order.includes(v)) { seen.add(v); frontier.push(v); added.push(v); } });
        steps.push({ visited: new Set(order), cur: u, frontier: [...frontier], order: [...order], msg: `Visit ${u}. ${added.length ? 'Add ' + added.join(', ') : 'No new neighbours.'}` });
      }
      return steps;
    };
    const apply = s => {
      const ink = cssVar('--ink'), rule = cssVar('--rule'), good = cssVar('--good'), gold = cssVar('--gold'), muted = cssVar('--muted');
      const svg = svgEl('svg', { viewBox: '0 0 520 380', role: 'img', 'aria-label': 'Weighted graph with nodes A to H' });
      const tree = s.prev ? Object.entries(s.prev) : [];
      E.forEach(([a, b, w]) => { const inTree = tree.some(([x, y]) => (x === a && y === b) || (x === b && y === a)); svg.append(svgEl('line', { x1: N[a][0], y1: N[a][1], x2: N[b][0], y2: N[b][1], stroke: inTree ? good : rule, 'stroke-width': inTree ? 6 : 4 })); if (algo === 'Dijkstra') { const t = svgEl('text', { x: (N[a][0] + N[b][0]) / 2 + 6, y: (N[a][1] + N[b][1]) / 2 - 6, fill: muted, 'font-size': 13, 'font-weight': 700 }); t.textContent = w; svg.append(t); } });
      Object.entries(N).forEach(([k, [x, y]]) => {
        const g = svgEl('g', { style: 'cursor:pointer', tabindex: 0, role: 'button', 'aria-label': 'Start from ' + k });
        g.addEventListener('click', () => { start = k; ctl.reset(); }); g.addEventListener('keydown', e => { if (e.key === 'Enter') { start = k; ctl.reset(); } });
        g.append(svgEl('circle', { cx: x, cy: y, r: 24, fill: k === s.cur ? gold : s.visited.has(k) ? good : cssVar('--surface'), stroke: k === start ? cssVar('--primary') : ink, 'stroke-width': k === start ? 6 : 3 }));
        const t = svgEl('text', { x, y: y + 6, 'text-anchor': 'middle', 'font-weight': 800, 'font-size': 17, fill: ink }); t.textContent = k; g.append(t);
        if (s.dist) { const d = svgEl('text', { x, y: y - 30, 'text-anchor': 'middle', 'font-size': 13, fill: cssVar('--primary'), 'font-weight': 700 }); d.textContent = s.dist[k] === Infinity ? '∞' : s.dist[k]; g.append(d); }
        svg.append(g);
      });
      svgBox.innerHTML = ''; svgBox.append(svg);
      info.textContent = s.msg + (s.frontier ? `\n${algo === 'BFS' ? 'Queue' : 'Stack'}: [${s.frontier.join(', ')}]` : '') + (s.order ? `\nVisit order: ${s.order.join(' → ')}` : '') + '\nClick any node to start from it.';
    };
    const controls = h('div', { class: 'controls' }, sel);
    const ctl = stepper(controls, getSteps, apply);
    el.append(controls, svgBox, info); ctl.reset();
  };

  /* ---------- CPU ---------- */
  R.cpu = el => {
    const PROGS = {
      'Count down from 5': 'LOADI 5\nloop: OUT\nSUBI 1\nJNZ loop\nOUT\nHALT',
      'Add two numbers': '; memory[0]=12, memory[1]=30 are preloaded\nLOAD 0\nADD 1\nSTORE 2\nOUT\nHALT',
      'Multiply 6 × 4 by repeated addition': '; mem[0]=6 (a), mem[1]=4 (counter), mem[2]=result\nloop: LOAD 2\nADD 0\nSTORE 2\nLOAD 1\nSUBI 1\nSTORE 1\nJNZ loop\nLOAD 2\nOUT\nHALT'
    };
    const INIT = { 'Count down from 5': [], 'Add two numbers': [12, 30], 'Multiply 6 × 4 by repeated addition': [6, 4, 0] };
    const ta = h('textarea', { spellcheck: 'false', 'aria-label': 'Assembly program' });
    const sel = h('select', { 'aria-label': 'Example program', onchange: () => { ta.value = PROGS[sel.value]; load(); } }, Object.keys(PROGS).map(k => h('option', {}, k)));
    const regsEl = h('div', { class: 'regs' }); const phaseEl = h('div', { class: 'phase' }); const memEl = h('div', { class: 'mem' }); const outEl = h('div', { class: 'readout' }); const listEl = h('div', { class: 'readout' });
    let prog, labels, cpu, phase, flash = [], touched = -1, running = null;
    const load = () => {
      stop(); labels = {}; prog = [];
      ta.value.split('\n').forEach(line => { line = line.replace(/;.*/, '').trim(); if (!line) return; const m = line.match(/^(\w+):\s*(.*)$/); if (m) { labels[m[1]] = prog.length; line = m[2]; } if (line) { const [op, arg] = line.split(/\s+/); prog.push({ op: op.toUpperCase(), arg, text: line }); } });
      const mem = Array(16).fill(0); (INIT[sel.value] || []).forEach((v, i) => mem[i] = v);
      cpu = { pc: 0, ir: '—', acc: 0, z: 0, mem, out: [], halted: false, err: '' }; phase = 0; flash = []; touched = -1; draw();
    };
    const addr = a => { const n = parseInt(a, 10); if (isNaN(n) || n < 0 || n > 15) throw new Error('Address must be 0 to 15, got ' + a); return n; };
    const tick = () => {
      if (cpu.halted) return stop();
      flash = []; touched = -1;
      try {
        if (phase === 0) { if (cpu.pc >= prog.length) throw new Error('Ran past the end of the program. Add HALT.'); cpu.cur = prog[cpu.pc]; cpu.ir = cpu.cur.text; cpu.pc++; flash = ['PC', 'IR']; }
        else if (phase === 1) { cpu.decoded = `opcode ${cpu.cur.op}${cpu.cur.arg !== undefined ? ', operand ' + cpu.cur.arg : ''}`; flash = ['IR']; }
        else {
          const { op, arg } = cpu.cur; const setZ = () => { cpu.acc = ((cpu.acc % 256) + 256) % 256; cpu.z = cpu.acc === 0 ? 1 : 0; flash.push('ACC', 'Z'); };
          const target = () => { if (!(arg in labels)) throw new Error('Unknown label ' + arg); return labels[arg]; };
          switch (op) {
            case 'LOAD': cpu.acc = cpu.mem[touched = addr(arg)]; setZ(); break; case 'LOADI': cpu.acc = +arg; setZ(); break;
            case 'ADD': cpu.acc += cpu.mem[touched = addr(arg)]; setZ(); break; case 'ADDI': cpu.acc += +arg; setZ(); break;
            case 'SUB': cpu.acc -= cpu.mem[touched = addr(arg)]; setZ(); break; case 'SUBI': cpu.acc -= +arg; setZ(); break;
            case 'STORE': cpu.mem[touched = addr(arg)] = cpu.acc; break;
            case 'JMP': cpu.pc = target(); flash.push('PC'); break; case 'JZ': if (cpu.z) { cpu.pc = target(); flash.push('PC'); } break; case 'JNZ': if (!cpu.z) { cpu.pc = target(); flash.push('PC'); } break;
            case 'OUT': cpu.out.push(cpu.acc); break; case 'HALT': cpu.halted = true; break;
            default: throw new Error('Unknown instruction ' + op);
          }
        }
        phase = (phase + 1) % 3;
      } catch (e) { cpu.err = e.message; cpu.halted = true; }
      draw();
    };
    const stop = () => { if (running) { clearInterval(running); running = null; runBtn.textContent = 'Run'; } };
    const runBtn = btn('Run', () => { if (running) return stop(); if (cpu.halted) load(); runBtn.textContent = 'Pause'; running = every(tick, 350); }, 'btn small');
    const draw = () => {
      regsEl.innerHTML = '';
      [['PC', 'Program counter', cpu.pc], ['IR', 'Instruction register', cpu.ir], ['ACC', 'Accumulator', cpu.acc], ['Z', 'Zero flag', cpu.z]].forEach(([k, n, v]) => regsEl.append(h('div', { class: 'reg' + (flash.includes(k) ? ' flash' : '') }, h('b', {}, n), String(v))));
      phaseEl.innerHTML = ''; ['Fetch', 'Decode', 'Execute'].forEach((p, i) => phaseEl.append(h('span', { class: (phase + 2) % 3 === i && (flash.length || cpu.ir !== '—') ? 'on' : '' }, p)));
      memEl.innerHTML = ''; cpu.mem.forEach((v, i) => memEl.append(h('div', { class: i === touched ? 'touched' : '' }, h('div', { class: 'small muted' }, '@' + i), v)));
      listEl.textContent = prog.map((p, i) => (i === cpu.pc && !cpu.halted ? '▶ ' : '  ') + String(i).padStart(2) + '  ' + p.text).join('\n') || '(empty program)';
      outEl.textContent = `Output: ${cpu.out.join(', ') || '(nothing yet)'}${cpu.decoded ? '\nDecoded: ' + cpu.decoded : ''}${cpu.halted ? (cpu.err ? '\n⚠ ' + cpu.err : '\n■ Halted') : ''}`;
    };
    el.append(h('p', { class: 'muted' }, 'An accumulator CPU. Instructions: LOAD a, LOADI n, ADD a, ADDI n, SUB a, SUBI n, STORE a, JMP label, JZ label, JNZ label, OUT, HALT. Addresses are 0–15; values wrap at 256.'),
      h('div', { class: 'controls' }, sel, btn('Load program', load, 'btn small good'), runBtn, btn('Step one phase', () => { stop(); tick(); }), btn('Reset', load)),
      h('div', { class: 'cpu' }, h('div', {}, h('h3', {}, 'Registers'), regsEl, phaseEl, h('h3', {}, 'Data memory'), memEl, outEl), h('div', {}, h('h3', {}, 'Program'), ta, listEl)));
    ta.value = PROGS[sel.value]; load();
  };

  /* ---------- cache ---------- */
  R.cache = el => {
    const LINES = 4, BLOCK = 4; let lines, hits, misses, log;
    const reset = () => { lines = Array.from({ length: LINES }, () => ({ valid: false, tag: 0 })); hits = 0; misses = 0; log = []; draw(); };
    const access = a => { a = Math.max(0, Math.min(63, a | 0)); const off = a % BLOCK, idx = Math.floor(a / BLOCK) % LINES, tag = Math.floor(a / (BLOCK * LINES)); const L = lines[idx]; const hit = L.valid && L.tag === tag; if (hit) hits++; else { misses++; L.valid = true; L.tag = tag; } log.unshift(`addr ${String(a).padStart(2)} = ${a.toString(2).padStart(6, '0')}  tag ${tag} | index ${idx} | offset ${off}  → ${hit ? 'HIT  (~1 ns)' : 'MISS (~80 ns, load block ' + (a - off) + '–' + (a - off + BLOCK - 1) + ')'}`); log = log.slice(0, 14); draw(idx, hit); };
    const table = h('div'); const info = h('div', { class: 'readout' });
    const draw = (idx, hit) => {
      table.innerHTML = '';
      const t = h('table', { class: 'simple' }, h('tr', {}, h('th', {}, 'Line'), h('th', {}, 'Valid'), h('th', {}, 'Tag'), h('th', {}, 'Holds addresses')));
      lines.forEach((L, i) => t.append(h('tr', { style: i === idx ? { background: hit ? 'var(--good-bg)' : 'var(--bad-bg)', fontWeight: 700 } : {} }, h('td', {}, i), h('td', {}, L.valid ? 1 : 0), h('td', {}, L.valid ? L.tag : '—'), h('td', {}, L.valid ? `${(L.tag * LINES + i) * BLOCK}–${(L.tag * LINES + i) * BLOCK + 3}` : 'empty'))));
      table.append(t);
      const total = hits + misses, time = hits * 1 + misses * 80;
      info.textContent = `Hits ${hits}  Misses ${misses}  Hit rate ${total ? Math.round(100 * hits / total) : 0}%\nTime with cache ≈ ${time} ns  vs RAM every time ≈ ${total * 80} ns\n\n` + log.join('\n');
    };
    const aIn = h('input', { type: 'number', min: 0, max: 63, value: 0, 'aria-label': 'Address' });
    const seq = s => { reset(); s.forEach(access); };
    el.append(h('p', { class: 'muted' }, 'A 4-line direct-mapped cache with 4-byte blocks, in front of 64 bytes of RAM. The address splits into tag, index (which line) and offset (which byte).'),
      h('div', { class: 'controls' }, aIn, btn('Access', () => { access(+aIn.value); aIn.value = (+aIn.value + 1) % 64; }, 'btn small good'),
        btn('Sequential 0–31', () => seq([...Array(32).keys()])), btn('Stride 16 (conflicts)', () => seq([0, 16, 32, 48, 0, 16, 32, 48, 0, 16])), btn('Loop over 8 bytes ×4', () => seq([].concat(...Array(4).fill([0, 1, 2, 3, 4, 5, 6, 7])))), btn('Random', () => seq(Array.from({ length: 20 }, () => Math.floor(Math.random() * 64)))), btn('Clear', reset)),
      table, info,
      h('h3', { style: { marginTop: '18px' } }, 'The memory hierarchy (typical)'),
      h('table', { class: 'simple' }, h('tr', {}, h('th', {}, 'Level'), h('th', {}, 'Size'), h('th', {}, 'Latency'), h('th', {}, 'If 1 ns were 1 second')),
        [['Registers', '~1 KB', '~0.3 ns', '0.3 s'], ['L1 cache', '32–64 KB', '~1 ns', '1 s'], ['L2 cache', '256 KB–2 MB', '~4 ns', '4 s'], ['L3 cache', '8–64 MB', '~12 ns', '12 s'], ['RAM', '8–128 GB', '~80 ns', '1.3 min'], ['NVMe SSD', '1–4 TB', '~20–100 µs', '6–28 hours'], ['Hard disk', '1–20 TB', '~5 ms', '58 days']].map(r => h('tr', {}, r.map(c => h('td', {}, c))))));
    reset();
  };

  /* ---------- network ---------- */
  R.network = el => {
    const H = { L: [60, 190, 'Your laptop', '192.168.1.23'], R: [220, 190, 'Home router', '192.168.1.1 / 73.12.4.9'], D: [390, 70, 'DNS resolver', '1.1.1.1'], S: [560, 190, 'Web server', '93.184.215.14'] };
    const STEPS = [
      ['L', 'R', 'DHCP', 'Laptop joins Wi-Fi and broadcasts DHCP DISCOVER. The router offers 192.168.1.23, the gateway and a DNS server.', 'UDP 68 → 67   broadcast'],
      ['L', 'D', 'DNS query', 'You typed example.com. The laptop asks the resolver: what is the A record for example.com?', 'UDP 51034 → 53   "A? example.com"'],
      ['D', 'L', 'DNS answer', 'Resolver replies 93.184.215.14 (after asking root, .com and the domain\'s name servers if not cached).', 'UDP 53 → 51034   "93.184.215.14, TTL 3600"'],
      ['L', 'S', 'TCP SYN', 'Start a TCP connection to port 443. The router rewrites the source address to your public IP (NAT).', 'TCP 50122 → 443   SYN seq=1000'],
      ['S', 'L', 'TCP SYN-ACK', 'Server agrees and sends its own sequence number.', 'TCP 443 → 50122   SYN-ACK seq=7000 ack=1001'],
      ['L', 'S', 'TCP ACK', 'Handshake done. Now there is a reliable, ordered byte stream.', 'TCP 50122 → 443   ACK ack=7001'],
      ['L', 'S', 'TLS ClientHello', 'Begin encryption: supported cipher suites plus a key share.', 'TLS 1.3 ClientHello (key_share, SNI=example.com)'],
      ['S', 'L', 'TLS ServerHello + certificate', 'Server sends its key share and a certificate signed by a trusted CA. Both sides derive the same session keys.', 'TLS 1.3 ServerHello, Certificate, Finished'],
      ['L', 'S', 'HTTP GET', 'The encrypted HTTP request travels inside TLS.', 'GET / HTTP/1.1\\nHost: example.com'],
      ['S', 'L', 'HTTP 200', 'The server responds with HTML. The browser parses it and requests CSS, JS and images, often reusing this connection.', 'HTTP/1.1 200 OK\\nContent-Type: text/html']
    ];
    const svgBox = h('div'); const info = h('div', { class: 'readout' }); let i = -1, anim = null;
    const draw = (t = 1) => {
      const ink = cssVar('--ink'), pri = cssVar('--primary'), rule = cssVar('--rule'), muted = cssVar('--muted');
      const s = svgEl('svg', { viewBox: '0 0 640 280', role: 'img', 'aria-label': 'Network diagram: laptop, router, DNS resolver, web server' });
      [['L', 'R'], ['R', 'D'], ['R', 'S']].forEach(([a, b]) => s.append(svgEl('line', { x1: H[a][0], y1: H[a][1], x2: H[b][0], y2: H[b][1], stroke: rule, 'stroke-width': 5, 'stroke-dasharray': a === 'L' ? '8 6' : '' })));
      const lab = svgEl('text', { x: 400, y: 245, fill: muted, 'font-size': 12, 'text-anchor': 'middle' }); lab.textContent = 'the internet: many routers between here and there'; s.append(lab);
      Object.values(H).forEach(([x, y, n, ip]) => { s.append(svgEl('rect', { x: x - 52, y: y - 26, width: 104, height: 52, rx: 12, fill: cssVar('--surface'), stroke: ink, 'stroke-width': 3 })); const a = svgEl('text', { x, y: y + 5, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 700, fill: ink }); a.textContent = n; s.append(a); const b = svgEl('text', { x, y: y + 44, 'text-anchor': 'middle', 'font-size': 11, fill: muted }); b.textContent = ip; s.append(b); });
      if (i >= 0) {
        const [a, b] = STEPS[i]; const via = (a === 'R' || b === 'R' || (a === 'L' && b === 'R')) ? null : 'R';
        const pts = via ? [H[a], H[via], H[b]] : [H[a], H[b]]; const seg = t * (pts.length - 1); const k = Math.min(Math.floor(seg), pts.length - 2), f = seg - k;
        const x = pts[k][0] + (pts[k + 1][0] - pts[k][0]) * f, y = pts[k][1] + (pts[k + 1][1] - pts[k][1]) * f;
        s.append(svgEl('circle', { cx: x, cy: y, r: 11, fill: pri, stroke: '#fff', 'stroke-width': 3 }));
      }
      svgBox.innerHTML = ''; svgBox.append(s);
      info.textContent = i < 0 ? 'Press Next packet to load https://example.com from scratch.' : `Step ${i + 1} of ${STEPS.length}: ${STEPS[i][2]}\n${STEPS[i][3]}\n\nPacket: ${STEPS[i][4].replace(/\\n/g, '\n        ')}`;
    };
    const go = d => { if (anim) cancelAnimationFrame(anim); i = Math.max(-1, Math.min(STEPS.length - 1, i + d)); const t0 = performance.now(); const f = now => { const t = Math.min(1, (now - t0) / 700); draw(t); if (t < 1) anim = requestAnimationFrame(f); }; anim = requestAnimationFrame(f); };
    el.append(h('div', { class: 'controls' }, btn('Previous', () => go(-1)), btn('Next packet', () => go(1), 'btn small good'), btn('Restart', () => { i = -1; draw(); })), svgBox, info,
      h('p', { class: 'small muted' }, 'Layers at work: Wi-Fi/Ethernet move frames between neighbours (MAC addresses), IP routes packets across networks, TCP/UDP deliver to ports, and HTTP/DNS/TLS are the application protocols.'));
    draw();
  };

  /* ---------- neural network ---------- */
  R.neural = el => {
    const canvas = h('canvas', { width: 360, height: 360, 'aria-label': 'Decision boundary' }); const info = h('div', { class: 'readout' });
    let data = [], net, epoch = 0, running = null, lr = 0.3, hidden = 4, set = 'XOR', losses = [];
    const lossCanvas = h('canvas', { width: 360, height: 90, 'aria-label': 'Loss over time' });
    const DATA = {
      XOR: () => { const d = []; for (let k = 0; k < 80; k++) { const x = Math.random() * 2 - 1, y = Math.random() * 2 - 1; d.push([x, y, (x > 0) !== (y > 0) ? 1 : 0]); } return d; },
      Circle: () => { const d = []; for (let k = 0; k < 100; k++) { const x = Math.random() * 2 - 1, y = Math.random() * 2 - 1; d.push([x, y, x * x + y * y < 0.4 ? 1 : 0]); } return d; },
      'Two blobs': () => { const d = []; for (let k = 0; k < 80; k++) { const c = k % 2, g = () => (Math.random() + Math.random() - 1) * 0.5; d.push([c ? 0.45 + g() : -0.45 + g(), c ? 0.4 + g() : -0.4 + g(), c]); } return d; },
      AND: () => [[-.8, -.8, 0], [-.8, .8, 0], [.8, -.8, 0], [.8, .8, 1], [-.7, -.6, 0], [.7, .75, 1], [-.6, .8, 0], [.75, -.7, 0]]
    };
    const init = () => { const r = () => (Math.random() * 2 - 1); net = { W1: Array.from({ length: hidden }, () => [r(), r()]), b1: Array(hidden).fill(0).map(r), W2: Array(hidden).fill(0).map(r), b2: 0 }; epoch = 0; losses = []; };
    const sig = z => 1 / (1 + Math.exp(-z));
    const fwd = (x, y) => { const a = net.W1.map((w, j) => Math.tanh(w[0] * x + w[1] * y + net.b1[j])); const o = sig(a.reduce((s, v, j) => s + v * net.W2[j], net.b2)); return { a, o }; };
    const train = () => {
      let loss = 0; const g = { W1: net.W1.map(() => [0, 0]), b1: Array(hidden).fill(0), W2: Array(hidden).fill(0), b2: 0 };
      for (const [x, y, t] of data) { const { a, o } = fwd(x, y); loss += -(t * Math.log(o + 1e-9) + (1 - t) * Math.log(1 - o + 1e-9)); const d = o - t; g.b2 += d; a.forEach((v, j) => { g.W2[j] += d * v; const dh = d * net.W2[j] * (1 - v * v); g.W1[j][0] += dh * x; g.W1[j][1] += dh * y; g.b1[j] += dh; }); }
      const n = data.length; net.b2 -= lr * g.b2 / n; for (let j = 0; j < hidden; j++) { net.W2[j] -= lr * g.W2[j] / n; net.W1[j][0] -= lr * g.W1[j][0] / n; net.W1[j][1] -= lr * g.W1[j][1] / n; net.b1[j] -= lr * g.b1[j] / n; }
      epoch++; losses.push(loss / n); if (losses.length > 300) losses.shift(); return loss / n;
    };
    const draw = () => {
      const c = canvas.getContext('2d'), W = canvas.width, S = 36, cell = W / S;
      for (let i = 0; i < S; i++) for (let j = 0; j < S; j++) { const x = (i + .5) / S * 2 - 1, y = 1 - (j + .5) / S * 2; const o = fwd(x, y).o; c.fillStyle = `rgba(${Math.round(47 + (240 - 47) * (1 - o))},${Math.round(107 + (113 - 107) * (1 - o))},${Math.round(222 - (222 - 46) * (1 - o))},0.35)`; c.fillRect(i * cell, j * cell, cell + 1, cell + 1); }
      let correct = 0;
      data.forEach(([x, y, t]) => { const o = fwd(x, y).o; if ((o > .5) === !!t) correct++; c.beginPath(); c.arc((x + 1) / 2 * W, (1 - y) / 2 * W, 5, 0, 7); c.fillStyle = t ? '#2F6BDE' : '#F0712E'; c.fill(); c.lineWidth = 2; c.strokeStyle = '#fff'; c.stroke(); });
      const lc = lossCanvas.getContext('2d'); lc.clearRect(0, 0, 360, 90); lc.strokeStyle = '#2E9E5B'; lc.lineWidth = 2; lc.beginPath(); const mx = Math.max(...losses, 0.01); losses.forEach((l, k) => { const px = k / 300 * 360, py = 85 - l / mx * 80; k ? lc.lineTo(px, py) : lc.moveTo(px, py); }); lc.stroke();
      info.textContent = `Epoch ${epoch}   loss ${losses.length ? losses[losses.length - 1].toFixed(4) : '—'}   accuracy ${Math.round(100 * correct / data.length)}%\nNetwork: 2 inputs → ${hidden} tanh hidden neurons → 1 sigmoid output. Trained with full-batch gradient descent on cross-entropy loss.`;
    };
    const stop = () => { if (running) { clearInterval(running); running = null; playB.textContent = 'Train'; } };
    const playB = btn('Train', () => { if (running) return stop(); playB.textContent = 'Pause'; running = every(() => { for (let k = 0; k < 10; k++) train(); draw(); }, 40); }, 'btn small good');
    const setSel = h('select', { 'aria-label': 'Dataset', onchange: () => { set = setSel.value; data = DATA[set](); stop(); init(); draw(); } }, Object.keys(DATA).map(k => h('option', {}, k)));
    const lrIn = h('input', { type: 'range', min: 1, max: 100, value: 30, 'aria-label': 'Learning rate', oninput: () => { lr = lrIn.value / 100; lrOut.textContent = lr.toFixed(2); } }); const lrOut = h('span', {}, '0.30');
    const hIn = h('input', { type: 'range', min: 1, max: 8, value: 4, 'aria-label': 'Hidden neurons', oninput: () => { hidden = +hIn.value; hOut.textContent = hidden; stop(); init(); draw(); } }); const hOut = h('span', {}, '4');
    el.append(h('div', { class: 'controls' }, setSel, playB, btn('One step', () => { stop(); train(); draw(); }), btn('Reset weights', () => { stop(); init(); draw(); }),
      h('label', { class: 'small muted' }, 'Learning rate ', lrIn, ' ', lrOut), h('label', { class: 'small muted' }, 'Hidden neurons ', hIn, ' ', hOut)),
      h('div', { style: { display: 'grid', gridTemplateColumns: 'minmax(0,360px) 1fr', gap: '16px', alignItems: 'start' }, class: 'nn' }, h('div', {}, canvas, h('p', { class: 'small muted' }, 'Loss over time'), lossCanvas), h('div', {}, info,
        h('p', { class: 'small' }, 'Try XOR with 1 hidden neuron: it cannot be solved, because one neuron draws one straight line. Add a second and it can. Push the learning rate to 1.0 and watch training become jumpy.'))));
    data = DATA[set](); init(); draw();
  };

  /* ---------- python playground ---------- */
  R.python = el => {
    const ta = h('textarea', { spellcheck: 'false', 'aria-label': 'Python code', style: { minHeight: '280px' } });
    ta.value = '# Real Python 3, running in your browser.\ndef fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n\nprint([fib(i) for i in range(12)])\n\nfrom collections import Counter\nprint(Counter("mississippi").most_common(3))\n';
    U.tabTextarea(ta);
    const out = h('div', { class: 'console' }, 'Press Run. Python loads on first use (about 10 MB, then cached by your browser).');
    const run = btn('Run', async () => { run.disabled = true; out.textContent = Runner.pyStatus === 'ready' ? 'Running…' : 'Loading Python…'; const r = await Runner.python(ta.value, ''); run.disabled = false; out.innerHTML = ''; if (r.out) out.append(h('div', {}, r.out)); out.append(h('div', { class: r.ok ? 'ok' : 'err' }, r.ok ? '✓ Finished' : r.err)); }, 'btn small good');
    el.append(h('div', { class: 'codebox' }, ta, h('div', { class: 'tools' }, run, h('span', { class: 'small muted' }, 'Tab indents. input() is disabled: pass values to functions instead.'))), out);
  };

  window.Labs = {
    list: LABS,
    get: id => LABS.find(l => l.id === id),
    render(id, el) { stopAll(); if (!R[id]) return false; R[id](el); return true; },
    stop: stopAll
  };
})();
