# Mainline

A complete, interactive computer science roadmap — 24 stages, 151 lesson stops, 760 questions, 12 hands-on labs and 21 projects — built as a 100% static site. No build step, no backend, no dependencies to install. Open `index.html` or push it to GitHub Pages and it works.

The metaphor is a transit map: stages are lines, lessons are stops, and you travel from "what is a computer" to compilers, distributed systems and AI engineering.

---

## What is in it

| Area | Content |
| --- | --- |
| Stages 0–2 | Digital literacy, computer fundamentals, programming fundamentals |
| Stage 3 | Python, 22 stops from syntax to asyncio |
| Stage 4 | AP CSP + AP CSA (Java) — supplementary practice, clearly labelled |
| Stage 5 | C++ |
| Stages 6–8 | Data structures, algorithms, mathematics for CS |
| Stages 9–12 | Architecture, operating systems, networking, databases |
| Stages 13–15 | Web development, software engineering, cybersecurity (defensive) |
| Stages 16–20 | Data science, machine learning, deep learning, AI engineering, AI hardware |
| Stages 21–22 | Embedded systems and robotics, advanced CS |
| Stage 23 | 21 projects across three tiers, plus 7 capstone specializations |

**Learning mechanics**

- Duolingo-style lesson player: teaching cards, then questions, wrong answers re-queued
- 12 question types: multiple choice, true/false, fill, match, order, predict-the-output, fix-the-bug, runnable Python, runnable JavaScript, bit toggling, and procedurally generated items (binary/hex, logic gates, two's complement, Big-O, subnetting)
- Mastery ladder per stop: Locked → Learning → Practiced → Proficient → Mastered, requiring accuracy across several question families on separate days
- Spaced repetition with Leitner boxes (1, 2, 4, 8, 16, 32, 64 days)
- XP, levels, streaks, hearts, 23 achievements, daily challenge, weekly quests, weak-topic detection
- Stage checkpoints to skip ahead if you already know the material
- Global search over every stop, topic, lab and project (`/` to focus)

**Interactive labs** (`#/labs`)

Binary · logic gates and adders · CPU assembly simulator · cache hierarchy · sorting visualiser · linear vs binary search · linked lists, stacks and queues · BST and heaps · BFS/DFS/Dijkstra · packet walkthrough · trainable neural network · Python playground.

**Real code execution**

Python runs in a Web Worker via Pyodide (loaded from jsDelivr); JavaScript runs in its own worker. Both are sandboxed with timeouts. If the CDN is unreachable, code questions degrade gracefully with a skip option rather than hanging.

---

## Running it

```bash
# any static server works
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly from the filesystem mostly works, but Web Workers (the code runner) need a server.

## Deploying to GitHub Pages

1. Create a repository and push these files to the `main` branch, keeping the folder structure.
2. Repository → **Settings** → **Pages**.
3. Source: **Deploy from a branch**. Branch: `main`, folder: `/ (root)`. Save.
4. Wait a minute, then visit `https://<username>.github.io/<repo>/`.

`.nojekyll` is included so GitHub serves every file untouched. All routing is hash-based (`#/roadmap`, `#/node/py-lists`), so the site works from a repository subpath with no configuration.

All progress lives in `localStorage` under `mainline:progress:v1`. Settings → Export writes a JSON backup; Import restores it.

---

## File layout

```
index.html                 shell: topbar, side nav, script order
.nojekyll                  tells GitHub Pages to serve files as-is
css/styles.css             design system, responsive layout, themes
js/registry.js             CS: stage/project registry and lookup tables
js/state.js                S: progress, XP, hearts, SRS, mastery, achievements
js/runner.js               Runner: Python (Pyodide) and JS execution in workers
js/engine.js               U + Engine: question renderers and the lesson player
js/labs.js                 Labs: the 12 interactive visualisations
js/app.js                  views and hash router
data/s00-02-foundations.js
data/s03-python.js
data/s04-05-ap-cpp.js
data/s06-08-dsa-math.js
data/s09-12-systems.js
data/s13-15-web-se-sec.js
data/s16-20-data-ai.js
data/s21-22-robotics-advanced.js
data/s23-projects.js
```

Script order in `index.html` matters: `registry.js` → all `data/*.js` → `state.js` → `runner.js` → `engine.js` → `labs.js` → `app.js`.

---

## Adding content

Curriculum is pure data. Nothing in `js/` needs editing to add a stage, stop, question or project.

### A stage

```js
CS.addStage({
  id: 's24', n: 24, title: 'Quantum computing', short: 'Quantum',
  track: 'core',              // foundations | programming | python | core | systems | web | ai | projects | ap
  icon: '⚛️',
  pos: [1200, 400],           // position on the transit map SVG (viewBox 0 0 1300 470)
  labelUp: false,             // put the label above the station instead of below
  prereq: ['s8'],             // stage ids that must be complete
  blurb: 'One sentence shown on the roadmap.',
  note: 'Optional disclaimer box.',
  nodes: [ /* see below */ ]
});

// append more stops to an existing stage (used to split large files)
CS.addNodes('s24', [ /* nodes */ ]);
```

### A stop (node)

```js
{
  id: 'q-superposition',            // globally unique; used in URLs and SRS keys
  title: 'Superposition',
  icon: '🌀',
  group: 'Foundations',             // optional heading within the stage
  topics: ['Qubits', 'Superposition'],
  lab: 'binary',                    // optional: links this stop to a lab
  learn: [
    { h: 'Card heading',
      p: '<p>HTML body.</p>',       // HTML is allowed here
      code: 'print("optional code block")',
      lang: 'python',               // python | js | cpp | java | sql | bash | asm | html | css
      lab: 'binary' }               // optional per-card lab link
  ],
  q: [ /* 5-6 questions */ ]
}
```

### Question types

```js
{ t: 'mc',  q: 'Prompt?', o: ['a','b','c','d'], a: 0, e: 'Why.' }
{ t: 'tf',  q: 'Claim.', a: false, e: 'Why.' }
{ t: 'fill', q: 'The ___ is it.', a: ['answer','accepted variant'], mono: true, e: 'Why.' }
{ t: 'short', q: 'Explain X.', a: [['keyword','synonym'], ['second','group']], model: 'Model answer.', e: 'Why.' }
{ t: 'match', q: 'Match them.', p: [['left','right'], ['left2','right2']], e: 'Why.' }
{ t: 'order', q: 'Order these.', o: ['first','second','third'], plain: true, e: 'Why.' }
{ t: 'predict', q: 'What prints?', code: 'print(1+1)', lang: 'python', a: ['2'], e: 'Why.' }
{ t: 'fix', q: 'What is wrong?', code: '...', lang: 'python', o: ['fix A','fix B'], a: 0, e: 'Why.' }
{ t: 'code', q: 'Write f(x).', starter: 'def f(x):\n    pass\n',
  tests: 'assert f(1) == 2, "message"\nprint("ok")', sol: 'def f(x):\n    return x + 1',
  hint: 'Nudge.', e: 'Why.' }
{ t: 'jscode', q: 'Write f(x).', starter: '...', tests: 'if (f(1) !== 2) throw new Error("msg");', sol: '...' }
{ t: 'bits', q: 'Make 37.', target: 37, e: 'Why.' }
{ t: 'gen', g: 'bin2dec' }   // bin2dec | dec2hex | hex2dec | gate | bits | bigo | twos | subnet
```

Notes:
- `a` for `mc`/`fix` is the **index** of the correct option; options are shuffled at run time.
- `order` items must be listed in the correct order; they are shuffled for the learner. Use `plain: true` for prose steps (monospace is the default, for code).
- `predict` answers are whitespace-normalised, so list the most likely formatting variants.
- `code`/`jscode` tests should use assertions with human-readable messages — the learner sees them.
- `short` grading requires at least one keyword from **each** group in `a`.

### A project

```js
CS.addProjects([{
  id: 'pr-thing', title: 'Thing', icon: '🔧',
  tier: 'beginner',                 // beginner | intermediate | advanced
  time: '4-6 hours',
  summary: 'One line for the card.',
  skills: ['Skill', 'Skill'],
  related: ['py-files'],            // node ids to review first
  brief: '<p>HTML description.</p>',
  starter: 'optional code',
  lang: 'python',
  steps:   [{ t: 'Step title', d: 'What to do and why.' }],
  accept:  ['Done when this is true'],
  stretch: ['Optional extension']
}]);
```

### A specialization

```js
CS.addSpecializations([{
  id: 'sp-x', name: 'Name', icon: '🎯', role: 'Job titles this leads to',
  why: 'Who should pick this.',
  stages: ['s3', 's7'],             // stage ids that make up the roadmap
  projects: ['pr-restapi'],         // recommended projects first
  capstone: { title: '...', brief: '<p>HTML</p>', steps: [{ t: '...', d: '...' }] }
}]);
```

### Map positions

The transit map SVG uses a `0 0 1300 470` viewBox. Keep stations at least 90 units apart horizontally and 70 vertically, and make sure a straight line between a stage and its prerequisite does not pass through an unrelated station. `labelUp: true` moves a label above the circle where the row below is crowded.

---

## Design notes

- Type: Bricolage Grotesque (display), Atkinson Hyperlegible (body), JetBrains Mono (code), each with a real fallback stack.
- Every track has its own line colour, used consistently on the map, stage headers and progress bars.
- Light, dark and auto themes; `prefers-reduced-motion` is respected.
- Keyboard: `/` focuses search, number keys select answer options, Enter checks and continues.
- Mobile: the side nav becomes a bottom bar under 860px; no horizontal scrolling at 390px.

## Testing

Data integrity and all 37 code-challenge solutions are verified by running each solution against its own tests. Browser smoke tests cover all routes at desktop and mobile widths, lesson flow, unlocking, persistence and every lab control, with zero console errors.
