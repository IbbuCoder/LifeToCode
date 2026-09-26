/* Mainline app: hash router + views. Hash routes keep GitHub Pages happy at any repository subpath. */
(function () {
  const { h, esc, md, shuffle } = U;
  CS.build();
  const st = () => S.get();
  const main = document.getElementById('main');
  const TIER_XP = { beginner: 50, intermediate: 100, advanced: 200, capstone: 500 };
  const STATUS_LABEL = { locked: 'Locked', learning: 'Learning', practiced: 'Practiced', proficient: 'Proficient', mastered: 'Mastered' };
  const stageColor = s => CS.color(s.track);
  const stars = s => ({ practiced: '★☆☆', proficient: '★★☆', mastered: '★★★' })[s] || '';

  /* ---------- theme & HUD ---------- */
  function applyTheme() {
    const t = st().settings.theme; if (t === 'auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', t);
    document.body.classList.toggle('reduce', !st().settings.motion);
  }
  function hud() {
    const el = document.getElementById('hud'); const L = S.levelInfo(), sk = S.streakInfo(), hearts = S.hearts();
    el.innerHTML = '';
    el.append(
      h('a', { class: 'chip streak' + (sk.active ? ' on' : ''), href: '#/profile', title: sk.atRisk ? 'Practice today to keep your streak' : 'Day streak' }, '🔥 ' + sk.count),
      h('a', { class: 'chip hearts', href: '#/practice', title: st().settings.hearts ? 'Hearts' : 'Hearts are off' }, '♥ ' + (hearts === Infinity ? '∞' : hearts)),
      h('a', { class: 'chip', href: '#/profile', title: 'Total XP' }, '⚡ ' + st().xp.toLocaleString()),
      h('a', { class: 'chip lvl', href: '#/profile', title: 'Level' }, 'Lv ' + L.level)
    );
  }
  S.onChange(hud);

  /* ---------- session builders ---------- */
  const isCode = q => q.t === 'code' || q.t === 'jscode';
  function reviewSprinkle(excludeNode, n = 2) {
    return S.dueQuestions().filter(id => !id.startsWith(excludeNode + '#')).slice(0, n).map(id => Object.assign({}, CS.qById[id], { _review: true }));
  }
  function lessonItems(node) {
    const qs = shuffle(node.q.filter(q => !isCode(q))), code = node.q.filter(isCode);
    const rev = reviewSprinkle(node.id);
    if (rev.length) { qs.splice(Math.min(2, qs.length), 0, rev[0]); if (rev[1]) qs.splice(Math.min(5, qs.length), 0, rev[1]); }
    return [...qs, ...code];
  }
  function weightedPick(qs, n) {
    const scored = qs.map(q => { const r = st().qs[q.id]; return { q, w: (r ? (r.box === 0 ? 0 : r.box) : 1) + Math.random() * 1.5 }; });
    return scored.sort((a, b) => a.w - b.w).slice(0, n).map(x => x.q);
  }
  function practiceItems(node) { const items = shuffle(weightedPick(node.q.filter(q => !isCode(q)), 7)); const code = node.q.filter(isCode); if (code.length) items.push(code[Math.floor(Math.random() * code.length)]); return items; }
  function doneNodes() { return CS.allNodes.filter(n => st().nodes[n.id] && st().nodes[n.id].done); }
  function reviewItems() {
    let ids = S.dueQuestions().slice(0, 12); const items = ids.map(id => CS.qById[id]);
    if (items.length < 8) {
      const extra = shuffle(doneNodes().flatMap(n => n.q.filter(q => !isCode(q) && !ids.includes(q.id)))); items.push(...weightedPick(extra, 8 - items.length));
    }
    return shuffle(items);
  }
  function weakItems() { const w = S.weakNodes(4); return shuffle(w.flatMap(x => weightedPick(x.node.q.filter(q => !isCode(q)), 4))).slice(0, 12); }
  function seededPool(seed, pool, n) { const rnd = S.seeded(seed); return shuffle(pool, rnd).slice(0, n); }
  function challengePool() { let nodes = doneNodes(); if (nodes.length < 2) nodes = CS.allNodes.filter(n => S.nodeUnlocked(n)).slice(0, 4); return nodes.flatMap(n => n.q.filter(q => !isCode(q))); }
  function dailyItems() { return seededPool('day' + S.today(), challengePool(), 6).concat([{ t: 'gen', g: ['bin2dec', 'gate', 'bigo', 'hex2dec', 'bits'][new Date().getDay() % 5], id: 's1-binary#gen-daily', node: CS.allNodes[0].id }]); }
  function weeklyItems() { return seededPool('wk' + S.weekKey(), challengePool(), 12); }
  function checkpointItems(stage) {
    const pre = (stage.prereq || []).map(id => CS.stageById[id]).filter(Boolean);
    const pool = pre.flatMap(s => s.nodes.flatMap(n => n.q.filter(q => !isCode(q))));
    return shuffle(pool).slice(0, 12);
  }

  /* ---------- finishing sessions ---------- */
  function celebrations(before, xpRes) {
    const out = [];
    if (xpRes && xpRes.levelUp) out.push('Level up! You are now level ' + xpRes.level);
    S.checkAchievements().forEach(a => out.push(a.em + ' Achievement: ' + a.name));
    if (before) CS.allNodes.forEach(n => { const now = S.status(n); if (before[n.id] !== now && ['proficient', 'mastered'].includes(now)) out.push((now === 'mastered' ? '👑 Mastered: ' : '★ Proficient: ') + n.title); if (before[n.id] === 'locked' && now !== 'locked') out.push('🔓 Unlocked: ' + n.title); });
    return out;
  }
  const snapshot = () => Object.fromEntries(CS.allNodes.map(n => [n.id, S.status(n)]));
  function sessionNodes(res) { for (const [id, v] of Object.entries(res.perNode)) S.recordNodeSession(id, v.c, v.t); }
  function dailyGoalNote() { const g = st().profile.goal, t = S.todayXP(); return t >= g ? `Daily goal reached: ${t}/${g} XP.` : `${t}/${g} XP toward today's goal.`; }

  function startLesson(node) {
    if (!S.nodeUnlocked(node)) { U.toast('That stop is still locked.'); return go('#/node/' + node.id); }
    if (S.hearts() <= 0) { U.toast('Out of hearts. Practice to refill one.'); return go('#/practice'); }
    const n = S.node(node.id); n.started = true; st().lastNode = node.id; S.save();
    const before = snapshot();
    Engine.play({ mode: 'lesson', title: node.title, learn: node.learn, items: lessonItems(node), onFinish(res) {
      const first = !n.done; const perfect = res.wrong === 0;
      if (first) { n.done = true; n.lessonDay = S.today(); }
      S.bump('lessons'); if (perfect) S.bump('perfect');
      if (res.code) n.codeDone = true;
      for (const [id, v] of Object.entries(res.perNode)) if (id !== node.id) S.recordNodeSession(id, v.c, v.t);
      const xp = (first ? 15 : 8) + res.firstTry + (perfect ? 5 : 0);
      const r = S.addXP(xp); S.save();
      const next = CS.stageOfNode[node.id].nodes[node.index + 1];
      return { xp, headline: perfect ? 'Flawless!' : 'Lesson complete', sub: `${node.title}. ${dailyGoalNote()}`, celebrate: celebrations(before, r),
        next: next && S.nodeUnlocked(next) ? '#/node/' + next.id : '#/node/' + node.id, nextLabel: next && S.nodeUnlocked(next) ? 'Next stop: ' + next.title : 'Continue' };
    } });
  }
  function startPractice(title, items, kind, extraNode) {
    if (!items.length) { U.toast('Nothing to practise yet. Finish a lesson first.'); return; }
    const before = snapshot();
    Engine.play({ mode: 'practice', title, items, onFinish(res) {
      sessionNodes(res); if (extraNode && res.code) S.node(extraNode).codeDone = true;
      S.bump(kind === 'review' ? 'reviews' : 'practice'); if (kind !== 'review') S.weekStats().reviews++;
      S.gainHeart(1);
      const xp = 5 + res.firstTry; const r = S.addXP(xp); S.save();
      return { xp, headline: kind === 'review' ? 'Review done' : 'Practice done', sub: `+1 heart. ${dailyGoalNote()}`, celebrate: celebrations(before, r), next: extraNode ? '#/node/' + extraNode : '#/practice' };
    } });
  }
  function startChallenge(kind) {
    const before = snapshot();
    if (kind === 'daily') {
      if (st().daily[S.today()]) return U.toast('Today\'s challenge is done. A new one unlocks tomorrow.');
      Engine.play({ mode: 'daily', title: 'Daily challenge', items: dailyItems(), onFinish(res) {
        sessionNodes(res); st().daily[S.today()] = { score: res.firstTry, of: res.answered }; S.bump('daily');
        const xp = 20 + res.firstTry * 2; const r = S.addXP(xp); S.save();
        return { xp, headline: 'Daily challenge complete', sub: `${res.firstTry} of ${res.answered} right. Come back tomorrow for a new one.`, celebrate: celebrations(before, r), next: '#/' };
      } });
    } else {
      const w = S.weekStats(); if (w.quiz) return U.toast('This week\'s quiz is done.');
      Engine.play({ mode: 'weekly', title: 'Weekly quiz', items: weeklyItems(), onFinish(res) {
        sessionNodes(res); w.quiz = { score: res.firstTry, of: res.answered };
        const xp = 40 + res.firstTry * 2; const r = S.addXP(xp); S.save();
        return { xp, headline: 'Weekly quiz complete', sub: `${res.firstTry} of ${res.answered}.`, celebrate: celebrations(before, r), next: '#/practice' };
      } });
    }
  }
  function startCheckpoint(stage) {
    const items = checkpointItems(stage);
    if (!items.length) { st().unlocked[stage.id] = true; S.save(); return render(); }
    const before = snapshot();
    Engine.play({ mode: 'checkpoint', title: 'Checkpoint', items, onFinish(res) {
      const pass = res.firstTry / res.answered >= 0.75;
      if (pass) { st().unlocked[stage.id] = true; S.bump('checkpoints'); }
      const r = S.addXP(pass ? 30 : 5); S.save();
      return { xp: pass ? 30 : 5, headline: pass ? 'Checkpoint passed' : 'Not yet', sub: pass ? `Stage ${stage.n}: ${stage.title} is unlocked.` : `You needed 75% (${Math.ceil(res.answered * 0.75)} of ${res.answered}). Missed questions are now in your review queue.`, celebrate: celebrations(before, r), next: '#/stage/' + stage.id };
    } });
  }

  /* ---------- shared bits ---------- */
  const go = hash => { location.hash = hash; };
  const stagePct = s => s.nodes.length ? s.nodes.reduce((a, n) => a + S.masteryWeight[S.status(n)], 0) / s.nodes.length : 0;
  function progressBar(p, cls = '') { return h('div', { class: 'bar ' + cls, role: 'progressbar', 'aria-valuenow': Math.round(p * 100), 'aria-valuemin': 0, 'aria-valuemax': 100 }, h('i', { style: { width: Math.round(p * 100) + '%' } })); }
  function recommendation() {
    const weak = S.weakNodes(1)[0]; const due = S.dueQuestions().length; const next = S.nextNode();
    if (weak) return { title: 'Strengthen: ' + weak.node.title, why: `Your recent accuracy here is ${Math.round(weak.acc * 100)}%. A short practice set will lock it in.`, action: () => startPractice('Practice: ' + weak.node.title, practiceItems(weak.node), 'practice', weak.node.id), label: 'Practice now' };
    if (due >= 6) return { title: `Review ${due} due questions`, why: 'Spaced repetition: these are scheduled for today, right before you would forget them.', action: () => startPractice('Review', reviewItems(), 'review'), label: 'Start review' };
    if (next) return { title: next.title, why: `Next stop on ${CS.stageOfNode[next.id].title}. Covers ${next.topics.join(', ')}.`, action: () => go('#/node/' + next.id), label: 'Open lesson' };
    return { title: 'Build a project', why: 'You have finished every unlocked lesson. Put it together in a project.', action: () => go('#/projects'), label: 'See projects' };
  }
  function continueNode() { const l = st().lastNode && CS.nodeById[st().lastNode]; if (l && !(st().nodes[l.id] || {}).done && S.nodeUnlocked(l)) return l; return S.nextNode(); }

  /* ---------- network map ---------- */
  function netMap() {
    const box = h('div', { class: 'netmap' });
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('viewBox', '0 0 1300 470'); svg.setAttribute('role', 'group'); svg.setAttribute('aria-label', 'Map of all stages and how they connect');
    const P = s => s.pos || [60, 230];
    let html = '';
    CS.stages.forEach(s => (s.prereq || []).forEach(pid => { const p = CS.stageById[pid]; if (!p) return; const [x1, y1] = P(p), [x2, y2] = P(s); const mx = (x1 + x2) / 2; const locked = !S.stageUnlocked(s); html += `<path d="M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}" fill="none" stroke="${locked ? 'var(--locked)' : stageColor(s)}" stroke-width="7" stroke-linecap="round" opacity="${locked ? .55 : .9}"/>`; }));
    svg.innerHTML = html;
    CS.stages.forEach(s => {
      const [x, y] = P(s); const unl = S.stageUnlocked(s), comp = S.stageComplete(s), pct = stagePct(s);
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); g.setAttribute('class', 'st' + (unl ? '' : ' locked') + (comp ? ' complete' : '')); g.setAttribute('tabindex', '0'); g.setAttribute('role', 'link');
      g.setAttribute('aria-label', `Stage ${s.n}: ${s.title}, ${unl ? Math.round(pct * 100) + '% complete' : 'locked'}`);
      const r = 17, C = 2 * Math.PI * (r + 6);
      g.innerHTML = `<circle cx="${x}" cy="${y}" r="${r + 6}" fill="none" stroke="var(--rule)" stroke-width="4"/>` +
        (pct > 0 ? `<circle cx="${x}" cy="${y}" r="${r + 6}" fill="none" stroke="${stageColor(s)}" stroke-width="4" stroke-dasharray="${C * pct} ${C}" transform="rotate(-90 ${x} ${y})"/>` : '') +
        `<circle class="o" cx="${x}" cy="${y}" r="${r}"/><text class="num" x="${x}" y="${y + 4}" text-anchor="middle" ${comp ? 'fill="var(--surface)" style="fill:var(--surface)"' : ''}>${s.n}</text>` +
        `<text x="${x}" y="${y + (s.labelUp ? -32 : 44)}" text-anchor="middle">${esc(s.short || s.title)}</text>`;
      const open = () => go('#/stage/' + s.id); g.addEventListener('click', open); g.addEventListener('keydown', e => { if (e.key === 'Enter') open(); });
      svg.append(g);
    });
    box.append(svg);
    const legend = h('div', { class: 'legend' }, Object.entries(CS.tracks).map(([k, t]) => h('span', {}, h('i', { style: { background: t.color } }), t.name)), h('span', {}, 'Ring = stage progress · filled = complete'));
    return h('div', {}, box, legend);
  }

  /* ---------- views ---------- */
  const V = {};

  V.onboarding = () => {
    let goal = 30, start = 'zero';
    const name = h('input', { class: 'textans', placeholder: 'What should we call you?', 'aria-label': 'Name', value: st().profile.name || '' });
    const goals = h('div', { class: 'seg' }, [[10, 'Casual'], [20, 'Regular'], [30, 'Serious'], [50, 'Intense']].map(([g, l]) => { const b = h('button', { type: 'button', class: g === goal ? 'on' : '', onclick: () => { goal = g; goals.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); } }, `${l} · ${g} XP`); return b; }));
    const starts = h('div', { class: 'spec' }, [['zero', 'Start from zero', 'Begin at Stage 0: how computers, files and the internet work.'], ['code', 'I can code a little', 'Start at the beginning but take checkpoint tests to jump ahead whenever you like.'], ['explore', 'Let me explore everything', 'Every stage is open. Mastery still has to be earned.']].map(([k, t, d]) => { const b = h('button', { type: 'button', class: k === start ? 'sel' : '', onclick: () => { start = k; starts.querySelectorAll('button').forEach(x => x.classList.toggle('sel', x === b)); } }, h('b', {}, t), h('span', { class: 'small muted' }, d)); return b; }));
    main.append(h('div', { class: 'narrow' },
      h('h1', {}, 'The whole of computer science, one stop at a time.'),
      h('p', { class: 'muted' }, `${CS.stages.length} stages, ${CS.allNodes.length} lesson stops, ${Object.keys(CS.qById).length} questions, ${CS.projects.length} projects, and ${Labs.list.length} interactive labs. From "what is a file" to building AI systems and understanding the chips they run on.`),
      netMap(),
      h('div', { class: 'panel', style: { marginTop: '22px' } },
        h('h3', {}, 'Your name'), name,
        h('h3', { style: { marginTop: '18px' } }, 'Daily goal'), goals,
        h('h3', { style: { marginTop: '18px' } }, 'Where are you starting?'), starts,
        h('p', { class: 'small muted', style: { marginTop: '14px' } }, 'Progress is saved in this browser. Export it from Settings to move it to another device.'),
        h('button', { class: 'btn good wide', style: { marginTop: '10px' }, onclick: () => { const p = st().profile; p.name = name.value.trim(); p.goal = goal; p.onboarded = true; p.start = start; if (start === 'explore') st().settings.explore = true; S.save(); go('#/'); render(); } }, 'Start learning'))));
  };

  V.home = () => {
    if (!st().profile.onboarded) return V.onboarding();
    const s = st(), L = S.levelInfo(), sk = S.streakInfo(), c = S.counts(), overall = S.overall(), nextN = continueNode();
    const projDone = Object.values(s.projects).filter(p => p.done).length;
    const wrap = h('div', { class: 'wrap' });
    wrap.append(h('h1', { style: { marginBottom: '18px' } }, (s.profile.name ? `Welcome back, ${s.profile.name}` : 'Welcome back')));
    const grid = h('div', { class: 'grid dash' }); wrap.append(grid);

    // Hero: next stop sign
    if (nextN) {
      const stage = CS.stageOfNode[nextN.id]; const idx = nextN.index; const around = stage.nodes.slice(Math.max(0, idx - 2), idx + 3);
      const stops = h('div', { class: 'stops', 'aria-hidden': 'true' }); around.forEach((n, k) => { if (k) stops.append(h('i')); stops.append(h('span', { class: n === nextN ? 'here' : (s.nodes[n.id] || {}).done ? 'done' : '' })); });
      grid.append(h('section', { class: 'nextstop span-8', style: { '--lc': stageColor(stage) } },
        h('div', {}, h('small', {}, `Next stop · Stage ${stage.n}: ${stage.title}`), h('h2', {}, nextN.title), h('div', { class: 'via' }, nextN.topics.join(' · ')), stops),
        h('button', { class: 'btn gold', onclick: () => startLesson(nextN) }, (s.nodes[nextN.id] || {}).started ? 'Continue learning' : 'Start lesson'), h('div', { class: 'lineband' })));
    } else grid.append(h('section', { class: 'nextstop span-8' }, h('div', {}, h('small', {}, 'Every unlocked lesson is done'), h('h2', {}, 'Time to build something'), h('div', { class: 'via' }, 'Take a checkpoint to open a new stage, or start a project.')), h('a', { class: 'btn gold', href: '#/projects' }, 'Projects'), h('div', { class: 'lineband' })));

    const todayXP = S.todayXP(), goal = s.profile.goal;
    grid.append(h('section', { class: 'panel span-4' }, h('div', { class: 'row' }, h('div', { class: 'ring', style: { '--p': Math.min(100, Math.round(todayXP / goal * 100)) } }, h('div', {}, h('b', {}, todayXP), `of ${goal} XP`)),
      h('div', {}, h('h3', {}, todayXP >= goal ? 'Daily goal done' : 'Daily goal'), h('p', { class: 'muted small' }, sk.active ? `🔥 ${sk.count}-day streak. Best: ${s.streak.best}.` : sk.atRisk ? `🔥 ${sk.count}-day streak ends tonight unless you earn XP today.` : 'Earn any XP today to start a streak.'))),
      h('p', { class: 'small muted', style: { marginTop: '12px' } }, S.hearts() === Infinity ? 'Hearts are off in Settings.' : `♥ ${S.hearts()} of 5 hearts${S.hearts() < 5 ? ', next in ' + Math.ceil(S.nextHeartIn() / 60000) + ' min' : ''}.`)));

    grid.append(h('section', { class: 'panel span-12' },
      h('div', { class: 'row' }, h('h3', { style: { margin: 0 } }, 'Computer science progress'), h('span', { class: 'spacer' }), h('b', { class: 'levelbadge' }, Math.round(overall * 100) + '%')),
      h('div', { style: { margin: '10px 0 16px' } }, progressBar(overall)),
      h('div', { class: 'statline' },
        [['Level ' + L.level, `${L.into}/${L.need} XP to next`], [s.xp.toLocaleString(), 'total XP'], ['🔥 ' + sk.count, 'day streak'], [s.stats.lessons, 'lessons completed'], [c.done + '/' + CS.allNodes.length, 'stops finished'], [c.mastered, 'topics mastered'], [projDone, 'projects completed']].map(([b, sp]) => h('div', { class: 'stat' }, h('b', {}, b), h('span', {}, sp))))));

    const rec = recommendation();
    grid.append(h('section', { class: 'panel span-4' }, h('h3', {}, 'Recommended'), h('p', {}, h('b', {}, rec.title)), h('p', { class: 'muted small' }, rec.why), h('button', { class: 'btn', onclick: rec.action }, rec.label)));
    const weak = S.weakNodes(4);
    grid.append(h('section', { class: 'panel span-4' }, h('h3', {}, 'Weak topics'),
      weak.length ? h('ul', { class: 'list' }, weak.map(w => h('li', {}, h('button', { class: 'item', onclick: () => startPractice('Practice: ' + w.node.title, practiceItems(w.node), 'practice', w.node.id) }, h('span', { class: 'dot', style: { '--c': 'var(--bad)' } }), h('span', { style: { flex: 1 } }, w.node.title), h('span', { class: 'small muted' }, Math.round(w.acc * 100) + '%'))))) :
        h('p', { class: 'muted small' }, 'None right now. Topics appear here when your recent accuracy drops below about 78%, and the app builds extra practice for them.')));
    const dd = s.daily[S.today()];
    grid.append(h('section', { class: 'panel span-4' }, h('h3', {}, 'Daily challenge'), h('p', { class: 'muted small' }, dd ? `Done today: ${dd.score} of ${dd.of}. A fresh set arrives tomorrow.` : '7 mixed questions from what you have learned, plus a drill with fresh numbers. +20 XP bonus.'),
      h('button', { class: 'btn ' + (dd ? 'ghost' : 'good'), disabled: !!dd, onclick: () => startChallenge('daily') }, dd ? 'Completed' : 'Start daily challenge')));

    const quests = S.weeklyQuests();
    grid.append(h('section', { class: 'panel span-6' }, h('h3', {}, 'This week'), h('ul', { class: 'list' }, quests.map(q => h('li', { class: 'stat' }, h('div', { class: 'row' }, h('span', { style: { flex: 1 } }, (q.done ? '✓ ' : '') + q.label), h('span', { class: 'small muted' }, `${q.have}/${q.goal}`)), progressBar(q.have / q.goal, 'gold')))),
      quests.every(q => q.done) && !S.weekStats().claimed ? h('button', { class: 'btn gold', style: { marginTop: '12px' }, onclick: () => { const x = S.claimWeekly(); U.toast(`+${x} XP weekly reward`); render(); } }, 'Claim 100 XP') : null));
    const due = S.dueQuestions().length;
    grid.append(h('section', { class: 'panel span-6' }, h('h3', {}, 'Review queue'), h('p', { class: 'muted small' }, due ? `${due} question${due > 1 ? 's are' : ' is'} due. Missed questions come back today; correct ones come back after 1, 2, 4, 8, 16… days.` : 'Nothing due. Questions you miss, and ones you learned a while ago, show up here on schedule.'),
      h('div', { class: 'row' }, h('button', { class: 'btn', disabled: !doneNodes().length, onclick: () => startPractice('Review', reviewItems(), 'review') }, due ? 'Review now' : 'Mixed review'), h('a', { class: 'btn ghost', href: '#/practice' }, 'All practice'))));
    grid.append(h('section', { class: 'span-12' }, h('div', { class: 'row', style: { marginBottom: '10px' } }, h('h2', { style: { margin: 0 } }, 'The whole journey'), h('span', { class: 'spacer' }), h('a', { href: '#/roadmap' }, 'Open the full roadmap')), netMap()));
    main.append(wrap);
  };

  V.roadmap = (focusStage) => {
    const wrap = h('div', { class: 'wrap' });
    const c = S.counts();
    wrap.append(h('h1', {}, 'Roadmap'), h('p', { class: 'muted' }, `Beginner → programmer → computer scientist → engineer. ${c.done} of ${CS.allNodes.length} stops finished, ${c.mastered} mastered.`), netMap());
    const cur = continueNode();
    CS.stages.forEach(stage => {
      const unl = S.stageUnlocked(stage), pct = stagePct(stage);
      const sec = h('section', { class: 'stage', id: 'stage-' + stage.id, style: { '--lc': stageColor(stage) } });
      const pre = (stage.prereq || []).map(id => CS.stageById[id]).filter(Boolean);
      sec.append(h('div', { class: 'stagehead' + (unl ? '' : ' locked') }, h('div', { class: 'no' }, stage.n),
        h('div', { style: { flex: 1 } }, h('h2', {}, `${stage.icon} ${stage.title}`), h('p', { class: 'muted', style: { margin: 0 } }, stage.blurb),
          stage.note ? h('div', { class: 'apnote' }, stage.note) : null,
          h('div', { class: 'meta' }, stage.nodes.length ? h('span', { class: 'pill' }, `${Math.round(pct * 100)}% · ${stage.nodes.length} stops`) : null,
            pre.length ? h('span', { class: 'small muted' }, 'Needs: ' + pre.map(p => `Stage ${p.n} ${p.title}`).join(', ')) : null,
            !unl && stage.nodes.length ? h('button', { class: 'btn small gold', onclick: () => startCheckpoint(stage) }, 'Take checkpoint to jump ahead') : null,
            stage.id === 's23' ? h('a', { class: 'btn small', href: '#/projects' }, 'Open project tree') : null))));
      const path = h('div', { class: 'path' });
      let lastGroup = null;
      if (stage.id === 's23') {
        ['beginner', 'intermediate', 'advanced'].forEach((tier, ti) => {
          path.append(h('div', { class: 'grouplabel' }, tier[0].toUpperCase() + tier.slice(1)));
          CS.projects.filter(p => p.tier === tier).forEach((p, k) => {
            const ps = st().projects[p.id] || {}; const cls = ps.done ? 'mastered' : ps.started ? 'practiced' : '';
            path.append(h('div', { class: 'station ' + cls + (k === 0 ? ' first' : ''), style: { '--off': Math.round(Math.sin((k + ti) * 1.1) * 70) } }, h('div', { class: 'conn' }),
              h('a', { class: 'stop', href: '#/project/' + p.id, 'aria-label': p.title }, p.icon), h('a', { class: 'lbl', href: '#/project/' + p.id }, h('b', {}, p.title), h('span', { class: 'topics' }, p.summary))));
          });
        });
        path.append(h('div', { class: 'grouplabel' }, 'Capstone'),
          h('div', { class: 'station first' }, h('div', { class: 'conn' }),
            h('a', { class: 'stop', href: '#/capstone', 'aria-label': 'Capstone specialization' }, '🎓'),
            h('a', { class: 'lbl', href: '#/capstone' }, h('b', {}, 'Choose a specialization'), h('span', { class: 'topics' }, 'A personal roadmap and a final capstone project'))));
      }
      stage.nodes.forEach((n, i) => {
        if (n.group && n.group !== lastGroup) { path.append(h('div', { class: 'grouplabel' }, n.group)); lastGroup = n.group; }
        const status = S.status(n);
        const off = Math.round(Math.sin(i * 1.1) * 90);
        const station = h('div', { class: `station ${status}${i === 0 || (n.group && stage.nodes[i - 1].group !== n.group) ? ' first' : ''}${cur === n ? ' current' : ''}`, style: { '--off': off } },
          h('div', { class: 'conn' }),
          h('a', { class: 'stop', href: '#/node/' + n.id, 'aria-label': `${n.title}: ${STATUS_LABEL[status]}` }, status === 'locked' ? '🔒' : status === 'mastered' ? '👑' : n.icon || '●'),
          h('a', { class: 'lbl', href: '#/node/' + n.id }, h('b', {}, n.title), h('span', { class: 'topics' }, n.topics.join(', ')), status !== 'locked' && status !== 'learning' ? h('div', { class: 'stars', 'aria-label': STATUS_LABEL[status] }, stars(status), ' ', h('span', { class: 'small muted' }, STATUS_LABEL[status])) : null));
        path.append(station);
      });
      sec.append(path); wrap.append(sec);
    });
    main.append(wrap);
    if (focusStage) requestAnimationFrame(() => { const el = document.getElementById('stage-' + focusStage); if (el) el.scrollIntoView({ behavior: st().settings.motion ? 'smooth' : 'auto' }); });
  };

  V.node = id => {
    const node = CS.nodeById[id]; if (!node) return V.notFound();
    const stage = CS.stageOfNode[id], status = S.status(node), n = st().nodes[id] || { types: {}, reviewDays: [], recent: [] };
    const locked = status === 'locked', done = !!n.done;
    const next = stage.nodes[node.index + 1];
    const acc = S.accuracy(id); const fams = [...S.availableFamilies(node)];
    const codeQs = node.q.filter(isCode); const dueHere = S.dueQuestions().filter(q => q.startsWith(id + '#')).length;
    const wrap = h('div', { class: 'narrow' });
    wrap.append(h('p', {}, h('a', { href: '#/stage/' + stage.id }, `← Stage ${stage.n}: ${stage.title}`)),
      h('div', { class: 'row' }, h('span', { style: { fontSize: '2.4rem' } }, node.icon || '●'), h('div', { style: { flex: 1 } }, h('h1', { style: { margin: 0 } }, node.title), h('div', { class: 'row', style: { marginTop: '6px' } }, h('span', { class: 'pill s-' + status }, stars(status) + ' ' + STATUS_LABEL[status]), node.group ? h('span', { class: 'pill' }, node.group) : null))),
      h('p', { class: 'muted', style: { marginTop: '12px' } }, 'Covers: ' + node.topics.join(', ')));
    const loop = [['Learn', n.started], ['Practice', done], ['Quiz', done], ['Code', !codeQs.length ? done : !!n.codeDone], ['Review', n.reviewDays.length > 0], ['Master', status === 'mastered'], ['Unlock', done && (!next || S.nodeUnlocked(next))]];
    wrap.append(h('div', { class: 'loop', 'aria-label': 'Learning loop progress' }, loop.map(([l, on]) => h('div', { class: on ? 'on' : '' }, (on ? '✓ ' : '') + l))));
    if (locked) {
      const prev = stage.nodes[node.index - 1];
      wrap.append(h('div', { class: 'panel' }, h('h3', {}, 'Locked'), h('p', { class: 'muted' }, S.stageUnlocked(stage) ? `Finish "${prev.title}" to unlock this stop.` : `This stage opens when you finish ${stage.prereq.map(p => 'Stage ' + CS.stageById[p].n).join(' and ')}. Or prove you already know it.`),
        !S.stageUnlocked(stage) ? h('button', { class: 'btn gold', onclick: () => startCheckpoint(stage) }, 'Take checkpoint') : h('a', { class: 'btn', href: '#/node/' + prev.id }, 'Go to ' + prev.title)));
    }
    const steps = h('div', { class: 'steps', style: { marginTop: '10px' } });
    const step = (ic, title, sub, isDone, button) => h('div', { class: 'stepcard' + (isDone ? ' done' : '') }, h('div', { class: 'ic' }, ic), h('div', { class: 'tx' }, h('b', {}, title), h('span', { class: 'small muted' }, sub)), button);
    steps.append(step('📖', 'Lesson', `${node.learn.length} short concept cards, then ${node.q.length} questions${codeQs.length ? ' including ' + codeQs.length + ' coding challenge' + (codeQs.length > 1 ? 's' : '') : ''}. About ${5 + Math.round(node.q.length * 1.2)} minutes.`, done,
      h('button', { class: 'btn ' + (done ? 'ghost' : 'good'), disabled: locked, onclick: () => startLesson(node) }, done ? 'Redo' : n.started ? 'Continue' : 'Start')));
    if (node.lab) { const lab = Labs.get(node.lab); steps.append(step('🔬', 'Visualize: ' + lab.title, lab.desc, false, h('a', { class: 'btn ghost', href: '#/lab/' + lab.id }, 'Open lab'))); }
    steps.append(step('🔁', 'Practice', 'A fresh mix weighted toward what you get wrong. Counts toward proficiency when done on a later day.', n.reviewDays.length > 0, h('button', { class: 'btn ghost', disabled: !done, onclick: () => startPractice('Practice: ' + node.title, practiceItems(node), 'practice', node.id) }, 'Practice')));
    if (codeQs.length) steps.append(step('⌨️', 'Coding challenges', `${codeQs.length} challenge${codeQs.length > 1 ? 's' : ''} with automatic tests.`, !!n.codeDone, h('button', { class: 'btn ghost', disabled: locked, onclick: () => startPractice('Code: ' + node.title, codeQs.slice(), 'practice', node.id) }, 'Code')));
    wrap.append(steps);
    // Mastery panel
    const needs = [];
    const typesOk = fams.filter(f => (n.types[f] || 0) > 0);
    if (!done) needs.push('Finish the lesson.');
    if (typesOk.length < Math.min(3, fams.length)) needs.push(`Answer correctly in ${Math.min(3, fams.length)} different question styles (you have ${typesOk.length}).`);
    if ((acc ?? 0) < 0.8) needs.push(`Keep recent accuracy at 80%+ (now ${acc == null ? '—' : Math.round(acc * 100) + '%'}).`);
    if (n.reviewDays.length < 2) needs.push(`Pass practice or review on ${2 - n.reviewDays.length} more later day${2 - n.reviewDays.length > 1 ? 's' : ''}.`);
    wrap.append(h('div', { class: 'panel', style: { marginTop: '18px' } }, h('h3', {}, 'Mastery'),
      h('p', { class: 'small muted' }, 'Locked → Learning → Practiced → Proficient → Mastered. Mastery needs correct answers across several question styles, on more than one day.'),
      h('div', { class: 'typegrid' }, fams.map(f => h('span', { class: (n.types[f] || 0) > 0 ? 'ok' : '' }, ((n.types[f] || 0) > 0 ? '✓ ' : '') + f))),
      h('p', { class: 'small', style: { marginTop: '12px' } }, status === 'mastered' ? 'Mastered. It will still come back occasionally in review so it stays that way.' : 'To master: ' + needs.join(' ')),
      dueHere ? h('p', { class: 'small' }, `${dueHere} question${dueHere > 1 ? 's' : ''} from this stop ${dueHere > 1 ? 'are' : 'is'} due for review.`) : null));
    // Notes
    const notes = h('details', { class: 'panel', style: { marginTop: '18px' }, open: done && !locked ? true : null }, h('summary', { style: { cursor: 'pointer', fontWeight: 700 } }, 'Concept notes'));
    if (locked) notes.append(h('p', { class: 'muted small' }, 'Unlock this stop to read its notes.'));
    else node.learn.forEach(c => { notes.append(h('h3', { style: { marginTop: '16px' } }, c.h), h('div', { html: c.p })); if (c.code) notes.append(U.codeBlock(c.code, c.lang || 'python')); });
    wrap.append(notes);
    const nav = h('div', { class: 'row', style: { marginTop: '20px' } });
    if (node.index > 0) nav.append(h('a', { class: 'btn ghost', href: '#/node/' + stage.nodes[node.index - 1].id }, '← ' + stage.nodes[node.index - 1].title));
    nav.append(h('span', { class: 'spacer' }));
    if (next) nav.append(h('a', { class: 'btn ' + (S.nodeUnlocked(next) ? '' : 'ghost'), href: '#/node/' + next.id }, next.title + ' →'));
    wrap.append(nav);
    main.append(wrap);
  };

  V.practice = () => {
    const wrap = h('div', { class: 'wrap' }); const due = S.dueQuestions().length; const done = doneNodes();
    wrap.append(h('h1', {}, 'Practice'), h('p', { class: 'muted' }, 'Review keeps what you learned. Every practice or review session also refills one heart.'));
    const grid = h('div', { class: 'grid dash' }); wrap.append(grid);
    grid.append(h('section', { class: 'panel span-6' }, h('h3', {}, 'Spaced review'), h('p', { class: 'muted small' }, due ? `${due} question${due > 1 ? 's' : ''} due today.` : 'Nothing is due. A mixed review still helps.'), h('button', { class: 'btn good', disabled: !done.length, onclick: () => startPractice('Review', reviewItems(), 'review') }, 'Start review')));
    const weak = S.weakNodes(6);
    grid.append(h('section', { class: 'panel span-6' }, h('h3', {}, 'Weak-topic workout'), h('p', { class: 'muted small' }, weak.length ? 'Built from the topics where your recent accuracy is lowest: ' + weak.map(w => w.node.title).join(', ') + '.' : 'No weak topics detected yet.'), h('button', { class: 'btn', disabled: !weak.length, onclick: () => startPractice('Weak topics', weakItems(), 'practice') }, 'Start workout')));
    const dd = st().daily[S.today()];
    grid.append(h('section', { class: 'panel span-6' }, h('h3', {}, 'Daily challenge'), h('p', { class: 'muted small' }, dd ? `Done: ${dd.score}/${dd.of}.` : 'Same questions for everyone on this device today, drawn from what you have learned. +20 XP.'), h('button', { class: 'btn good', disabled: !!dd, onclick: () => startChallenge('daily') }, dd ? 'Completed' : 'Start')));
    const w = S.weekStats();
    grid.append(h('section', { class: 'panel span-6' }, h('h3', {}, 'Weekly quiz'), h('p', { class: 'muted small' }, w.quiz ? `Done this week: ${w.quiz.score}/${w.quiz.of}.` : '12 questions across everything you have finished. +40 XP and more for each right answer.'), h('button', { class: 'btn', disabled: !!w.quiz || done.length < 2, onclick: () => startChallenge('weekly') }, w.quiz ? 'Completed' : done.length < 2 ? 'Finish 2 lessons first' : 'Start'),
      h('ul', { class: 'list', style: { marginTop: '12px' } }, S.weeklyQuests().map(q => h('li', { class: 'small' }, (q.done ? '✓ ' : '○ ') + q.label + ` (${q.have}/${q.goal})`)))));
    const locked = CS.stages.filter(s => s.nodes.length && !S.stageUnlocked(s));
    grid.append(h('section', { class: 'panel span-12' }, h('h3', {}, 'Practise a topic'), done.length ? h('ul', { class: 'list' }, done.map(n => { const s = S.status(n), a = S.accuracy(n.id); return h('li', {}, h('button', { class: 'item', onclick: () => startPractice('Practice: ' + n.title, practiceItems(n), 'practice', n.id) }, h('span', { class: 'dot', style: { '--c': stageColor(CS.stageOfNode[n.id]) } }), h('span', { style: { flex: 1 } }, n.title), h('span', { class: 'pill s-' + s }, STATUS_LABEL[s]), h('span', { class: 'small muted' }, a == null ? '' : Math.round(a * 100) + '%'))); })) : h('div', { class: 'empty' }, 'Finish your first lesson and it will appear here.', h('br'), h('a', { class: 'btn', style: { marginTop: '12px' }, href: '#/roadmap' }, 'Open roadmap'))));
    if (locked.length) grid.append(h('section', { class: 'panel span-12' }, h('h3', {}, 'Checkpoints'), h('p', { class: 'muted small' }, 'Already know the material? Score 75% on a checkpoint to unlock a stage early.'), h('ul', { class: 'list' }, locked.map(s => h('li', {}, h('button', { class: 'item', onclick: () => startCheckpoint(s) }, h('span', { class: 'dot', style: { '--c': stageColor(s) } }), h('span', { style: { flex: 1 } }, `Stage ${s.n}: ${s.title}`), h('span', { class: 'small muted' }, 'Test out')))))));
    main.append(wrap);
  };

  V.labs = () => {
    main.append(h('div', { class: 'wrap' }, h('h1', {}, 'Labs'), h('p', { class: 'muted' }, 'Interactive simulations. Poke at them until the idea clicks.'),
      h('div', { class: 'labgrid' }, Labs.list.map(l => h('a', { class: 'labcard', href: '#/lab/' + l.id, style: { '--lc': CS.color(l.track) } }, h('span', { class: 'ic' }, l.icon), h('b', {}, l.title), h('span', { class: 'small muted' }, l.desc))))));
  };
  V.lab = id => {
    const l = Labs.get(id); if (!l) return V.notFound();
    const box = h('div', { class: 'lab' });
    const related = CS.allNodes.filter(n => n.lab === id);
    main.append(h('div', { class: 'wrap' }, h('p', {}, h('a', { href: '#/labs' }, '← All labs')), h('h1', {}, l.icon + ' ' + l.title), h('p', { class: 'muted' }, l.desc), box,
      related.length ? h('p', { style: { marginTop: '16px' } }, 'Lessons that use this lab: ', ...related.flatMap((n, i) => [i ? ', ' : '', h('a', { href: '#/node/' + n.id }, n.title)])) : null));
    Labs.render(id, box);
  };

  V.projects = () => {
    const wrap = h('div', { class: 'wrap' });
    const doneN = CS.projects.filter(p => (st().projects[p.id] || {}).done).length;
    wrap.append(h('h1', {}, 'Projects'), h('p', { class: 'muted' }, `Build real things. ${doneN} of ${CS.projects.length} complete. Each step you check off earns 10 XP; finishing a project earns a bonus.`));
    [['beginner', 'Beginner', '🌱'], ['intermediate', 'Intermediate', '🔧'], ['advanced', 'Advanced', '🏗️']].forEach(([tier, name, em]) => {
      wrap.append(h('section', { class: 'tier' }, h('h2', {}, em + ' ' + name, h('span', { class: 'pill' }, `+${TIER_XP[tier]} XP each`)),
        h('div', { class: 'projgrid' }, CS.projects.filter(p => p.tier === tier).map(p => { const ps = st().projects[p.id] || {}; const pct = ps.steps ? ps.steps.filter(Boolean).length / p.steps.length : 0;
          return h('a', { class: 'projcard' + (ps.done ? ' done' : ''), href: '#/project/' + p.id }, h('div', { class: 'row' }, h('span', { style: { fontSize: '1.6rem' } }, p.icon), h('b', { style: { flex: 1 } }, p.title), ps.done ? h('span', { class: 'pill s-mastered' }, 'Done') : null), h('span', { class: 'small muted' }, p.summary), progressBar(pct), h('span', { class: 'small muted' }, 'Skills: ' + p.skills.join(', '))); }))));
    });
    const cap = st().capstone;
    wrap.append(h('section', { class: 'tier' }, h('h2', {}, '🎓 Capstone', h('span', { class: 'pill' }, `+${TIER_XP.capstone} XP`)), h('p', { class: 'muted' }, 'Pick a specialization and get a personal roadmap plus a capstone project to finish your journey.'),
      h('a', { class: 'btn gold', href: '#/capstone' }, cap ? 'Continue: ' + CS.specializations.find(s => s.id === cap.spec).name : 'Choose a specialization')));
    main.append(wrap);
  };
  function checklist(steps, state, onToggle) {
    return h('ol', { class: 'checks' }, steps.map((s, i) => { const cb = h('input', { type: 'checkbox', checked: state[i] ? true : null, onchange: () => onToggle(i, cb.checked) }); return h('li', {}, h('label', { class: state[i] ? 'on' : '' }, cb, h('div', {}, h('b', {}, `${i + 1}. ${s.t}`), h('div', { class: 'small', html: md(s.d) })))); }));
  }
  V.project = id => {
    const p = CS.projectById[id]; if (!p) return V.notFound();
    const ps = st().projects[id] || (st().projects[id] = { steps: [], started: false, done: false });
    const wrap = h('div', { class: 'narrow' });
    const pct = ps.steps.filter(Boolean).length / p.steps.length;
    wrap.append(h('p', {}, h('a', { href: '#/projects' }, '← All projects')), h('h1', {}, p.icon + ' ' + p.title),
      h('div', { class: 'row' }, h('span', { class: 'pill' }, p.tier), h('span', { class: 'pill' }, `+${TIER_XP[p.tier]} XP on completion`), p.time ? h('span', { class: 'pill' }, p.time) : null, ps.done ? h('span', { class: 'pill s-mastered' }, 'Completed') : null),
      h('p', { style: { marginTop: '14px' } }, p.summary),
      h('div', { class: 'panel' }, h('h3', {}, 'What you will build'), h('div', { html: p.brief }), h('p', { class: 'small muted' }, 'Skills: ' + p.skills.join(', ')),
        p.related ? h('p', { class: 'small' }, 'Review first: ', ...p.related.flatMap((nid, i) => CS.nodeById[nid] ? [i ? ', ' : '', h('a', { href: '#/node/' + nid }, CS.nodeById[nid].title)] : [])) : null),
      h('h2', { style: { marginTop: '24px' } }, 'Steps'), progressBar(pct), h('div', { style: { height: '12px' } }),
      checklist(p.steps, ps.steps, (i, v) => {
        const was = ps.steps[i]; ps.steps[i] = v; ps.started = true;
        if (v && !was && !(ps.awarded || []).includes(i)) { ps.awarded = [...(ps.awarded || []), i]; S.bump('projectSteps'); S.addXP(10); }
        if (!ps.done && p.steps.every((_, k) => ps.steps[k])) { ps.done = true; const r = S.addXP(TIER_XP[p.tier]); U.toast(`🛠️ Project complete! +${TIER_XP[p.tier]} XP`); celebrations(null, r).forEach(m => U.toast(m, 3500)); }
        S.save(); render();
      }),
      h('div', { class: 'panel', style: { marginTop: '20px' } }, h('h3', {}, 'Done when'), h('ul', {}, p.accept.map(a => h('li', { html: md(a) })))),
      p.starter ? h('div', { class: 'panel', style: { marginTop: '16px' } }, h('h3', {}, 'Starter'), U.codeBlock(p.starter, p.lang || 'python')) : null,
      h('div', { class: 'panel', style: { marginTop: '16px' } }, h('h3', {}, 'Stretch goals'), h('ul', {}, p.stretch.map(a => h('li', { html: md(a) })))));
    main.append(wrap);
  };
  V.capstone = () => {
    const wrap = h('div', { class: 'narrow' }); const cap = st().capstone;
    wrap.append(h('p', {}, h('a', { href: '#/projects' }, '← Projects')), h('h1', {}, 'Capstone'), h('p', { class: 'muted' }, 'Choose where you are headed. Your roadmap and final project adapt to it. You can switch later; checked milestones are kept per specialization.'));
    wrap.append(h('div', { class: 'spec' }, CS.specializations.map(sp => h('button', { type: 'button', class: cap && cap.spec === sp.id ? 'sel' : '', onclick: () => { const c = st().capstone || { spec: sp.id, steps: {} }; c.spec = sp.id; c.steps = c.steps || {}; st().capstone = c; S.save(); render(); } }, h('b', {}, sp.icon + ' ' + sp.name), h('span', { class: 'small muted' }, sp.role)))));
    if (cap) {
      const sp = CS.specializations.find(s => s.id === cap.spec); const steps = cap.steps[sp.id] || (cap.steps[sp.id] = []);
      const stages = sp.stages.map(id => CS.stageById[id]).filter(Boolean);
      const ready = stages.reduce((a, s) => a + stagePct(s), 0) / stages.length;
      wrap.append(h('h2', { style: { marginTop: '28px' } }, `Your ${sp.name} roadmap`), h('p', { class: 'muted' }, sp.why), h('div', { class: 'row' }, h('span', {}, 'Readiness'), h('div', { style: { flex: 1 } }, progressBar(ready)), h('b', {}, Math.round(ready * 100) + '%')),
        h('ol', { class: 'list', style: { marginTop: '14px' } }, stages.map((s, i) => { const pct = stagePct(s); return h('li', {}, h('a', { href: '#/stage/' + s.id }, h('span', { class: 'dot', style: { '--c': stageColor(s) } }), h('span', { style: { flex: 1 } }, `${i + 1}. Stage ${s.n}: ${s.title}`), h('span', { class: 'small muted' }, S.stageUnlocked(s) ? Math.round(pct * 100) + '%' : 'locked'))); })),
        h('h3', { style: { marginTop: '18px' } }, 'Recommended projects first'), h('ul', { class: 'list' }, sp.projects.map(id => CS.projectById[id]).filter(Boolean).map(p => h('li', {}, h('a', { href: '#/project/' + p.id }, p.icon + ' ' + p.title, h('span', { class: 'spacer' }), (st().projects[p.id] || {}).done ? '✓' : '')))),
        h('h2', { style: { marginTop: '28px' } }, 'Capstone: ' + sp.capstone.title), h('div', { html: sp.capstone.brief }),
        checklist(sp.capstone.steps, steps, (i, v) => { const was = steps[i]; steps[i] = v; if (v && !was) { S.bump('projectSteps'); S.addXP(10); } if (sp.capstone.steps.every((_, k) => steps[k]) && !cap['done_' + sp.id]) { cap['done_' + sp.id] = true; S.addXP(TIER_XP.capstone); U.toast('🎓 Capstone complete! +500 XP'); } S.save(); render(); }));
    }
    main.append(wrap);
  };

  V.profile = () => {
    const s = st(), L = S.levelInfo(), c = S.counts(); const wrap = h('div', { class: 'wrap' });
    wrap.append(h('h1', {}, s.profile.name || 'Your profile'), h('p', { class: 'muted' }, `Learning since ${s.created}.`));
    const grid = h('div', { class: 'grid dash' }); wrap.append(grid);
    grid.append(h('section', { class: 'panel span-6' }, h('h3', {}, 'Level ' + L.level), progressBar(L.into / L.need, 'blue'), h('p', { class: 'small muted' }, `${L.into} / ${L.need} XP to level ${L.level + 1}. Total ${s.xp.toLocaleString()} XP.`),
      h('div', { class: 'statline', style: { marginTop: '12px' } }, [[s.streak.count, 'current streak'], [s.streak.best, 'best streak'], [s.stats.lessons, 'lessons'], [s.stats.code, 'code challenges'], [s.stats.answers ? Math.round(100 * s.stats.correct / s.stats.answers) + '%' : '—', 'all-time accuracy'], [s.stats.reviews + s.stats.practice, 'practice sessions']].map(([b, t]) => h('div', { class: 'stat' }, h('b', {}, b), h('span', {}, t))))));
    // activity heatmap: 20 weeks
    const heat = h('div', { class: 'heat', 'aria-label': 'XP per day, last 20 weeks' }); const start = new Date(); start.setDate(start.getDate() - 139 - ((start.getDay() + 6) % 7));
    for (let i = 0; i < 140 + ((new Date().getDay() + 6) % 7) + 1; i++) { const d = new Date(start); d.setDate(start.getDate() + i); const k = S.dateKey(d), x = s.days[k] || 0; heat.append(h('i', { class: x >= s.profile.goal ? 'l3' : x >= s.profile.goal / 2 ? 'l2' : x > 0 ? 'l1' : '', title: `${k}: ${x} XP` })); }
    grid.append(h('section', { class: 'panel span-6' }, h('h3', {}, 'Activity'), heat, h('p', { class: 'small muted' }, 'Darker = closer to your daily goal.')));
    grid.append(h('section', { class: 'panel span-12' }, h('h3', {}, 'Mastery map'), h('p', { class: 'small muted' }, `${c.mastered} mastered · ${c.proficient} proficient · ${c.practiced} practiced · ${c.learning} learning · ${c.locked} locked`),
      h('div', { class: 'mgrid' }, CS.allNodes.map(n => { const st2 = S.status(n); return h('a', { class: st2, href: '#/node/' + n.id, title: `${n.title}: ${STATUS_LABEL[st2]}`, 'aria-label': `${n.title}: ${STATUS_LABEL[st2]}` }); }))));
    grid.append(h('section', { class: 'panel span-12' }, h('h3', {}, 'Stages'), h('table', { class: 'simple' }, h('tr', {}, h('th', {}, 'Stage'), h('th', {}, 'Progress'), h('th', {}, 'Status')),
      CS.stages.filter(x => x.nodes.length).map(x => h('tr', {}, h('td', {}, h('a', { href: '#/stage/' + x.id }, `${x.n}. ${x.title}`)), h('td', { style: { width: '40%' } }, progressBar(stagePct(x))), h('td', {}, S.stageComplete(x) ? 'All lessons done' : S.stageUnlocked(x) ? 'Open' : 'Locked'))))));
    const got = S.ACHIEVEMENTS.filter(a => s.ach[a.id]).length;
    grid.append(h('section', { class: 'panel span-12' }, h('h3', {}, `Achievements (${got}/${S.ACHIEVEMENTS.length})`), h('div', { class: 'ach' }, S.ACHIEVEMENTS.map(a => h('div', { class: s.ach[a.id] ? '' : 'locked' }, h('span', { class: 'em' }, a.em), h('span', {}, h('b', {}, a.name), h('br'), h('span', { class: 'small muted' }, s.ach[a.id] ? 'Earned ' + s.ach[a.id] : a.desc)))))));
    const lb = h('section', { class: 'panel span-12' }, h('h3', {}, 'Weekly XP'), h('p', { class: 'small muted' }, `League: ${S.leaderboard.name}. The leaderboard adapter is ready for an online provider; for now it ranks your own weeks.`));
    S.leaderboard.top().then(rows => lb.append(rows.length ? h('table', { class: 'simple' }, rows.map((r, i) => h('tr', {}, h('td', {}, '#' + (i + 1)), h('td', {}, r.label), h('td', {}, r.xp + ' XP')))) : h('p', { class: 'muted' }, 'No weeks yet.')));
    grid.append(lb);
    main.append(wrap);
  };

  V.settings = () => {
    const s = st(); const wrap = h('div', { class: 'narrow' });
    const toggle = (label, desc, key, after) => { const cb = h('input', { type: 'checkbox', checked: s.settings[key] ? true : null, onchange: () => { s.settings[key] = cb.checked; S.save(); after && after(); } }); return h('div', { class: 'field' }, h('div', {}, h('b', {}, label), h('div', { class: 'small muted' }, desc)), h('label', { class: 'switch' }, cb, h('span', { 'aria-hidden': 'true' }), h('span', { class: 'hidden' }, label))); };
    const name = h('input', { class: 'textans', value: s.profile.name, 'aria-label': 'Name', onchange: () => { s.profile.name = name.value.trim(); S.save(); } });
    const goal = h('div', { class: 'seg' }, [10, 20, 30, 50, 80].map(g => h('button', { type: 'button', class: s.profile.goal === g ? 'on' : '', onclick: () => { s.profile.goal = g; S.save(); render(); } }, g + ' XP')));
    const theme = h('div', { class: 'seg' }, [['auto', 'System'], ['light', 'Light'], ['dark', 'Dark']].map(([k, l]) => h('button', { type: 'button', class: s.settings.theme === k ? 'on' : '', onclick: () => { s.settings.theme = k; S.save(); applyTheme(); render(); } }, l)));
    const file = h('input', { type: 'file', accept: 'application/json', class: 'hidden', onchange: async () => { try { S.importJSON(await file.files[0].text()); applyTheme(); U.toast('Progress imported.'); render(); } catch (e) { U.toast(e.message); } } });
    wrap.append(h('h1', {}, 'Settings'),
      h('div', { class: 'panel' }, h('div', { class: 'field' }, h('b', {}, 'Name'), name), h('div', { class: 'field' }, h('div', {}, h('b', {}, 'Daily goal'), h('div', { class: 'small muted' }, 'XP per day. About 10 XP per short lesson.')), goal), h('div', { class: 'field' }, h('b', {}, 'Theme'), theme)),
      h('div', { class: 'panel', style: { marginTop: '16px' } },
        toggle('Hearts', 'Lose a heart for each lesson mistake. Turn off for relaxed learning. Practice and review never cost hearts.', 'hearts', hud),
        toggle('Free explore mode', 'Open every stage and stop without checkpoints. Mastery still has to be earned.', 'explore', hud),
        toggle('Motion', 'Animations such as the pulsing current stop and smooth scrolling.', 'motion', applyTheme)),
      h('div', { class: 'panel', style: { marginTop: '16px' } }, h('h3', {}, 'Your data'), h('p', { class: 'small muted' }, 'Everything is stored in this browser (localStorage). Nothing is sent to a server. Export a backup before clearing browser data or switching devices.'),
        h('div', { class: 'row' }, h('button', { class: 'btn', onclick: () => { const a = h('a', { href: URL.createObjectURL(new Blob([S.exportJSON()], { type: 'application/json' })), download: `mainline-progress-${S.today()}.json` }); document.body.append(a); a.click(); a.remove(); } }, 'Export progress'),
          h('button', { class: 'btn ghost', onclick: () => file.click() }, 'Import progress'), file,
          h('button', { class: 'btn bad', onclick: () => { const close = U.modal(h('div', {}, h('h3', {}, 'Erase all progress?'), h('p', { class: 'muted' }, 'XP, streaks, mastery, projects and review history will be deleted from this browser. This cannot be undone.'), h('div', { class: 'row' }, h('button', { class: 'btn ghost', onclick: () => close() }, 'Cancel'), h('button', { class: 'btn bad', onclick: () => { S.reset(); close(); applyTheme(); go('#/'); render(); } }, 'Erase everything')))); } }, 'Reset progress'))),
      h('p', { class: 'small muted', style: { marginTop: '16px' } }, `Keyboard: Enter checks and continues, 1–9 picks an answer. ${CS.allNodes.length} stops · ${Object.keys(CS.qById).length} questions · curriculum files live in /data.`));
    main.append(wrap);
  };

  /* ---------- search ---------- */
  let INDEX = null;
  function buildIndex() {
    INDEX = [];
    const strip = s => String(s).replace(/<[^>]+>/g, ' ');
    CS.stages.forEach(s => INDEX.push({ type: 'Stage', title: `Stage ${s.n}: ${s.title}`, text: s.blurb + ' ' + s.nodes.flatMap(n => n.topics).join(' '), href: '#/stage/' + s.id }));
    CS.allNodes.forEach(n => {
      INDEX.push({ type: 'Lesson', title: n.title, text: n.topics.join(', ') + ' — ' + CS.stageOfNode[n.id].title, href: '#/node/' + n.id });
      n.topics.forEach(t => INDEX.push({ type: 'Topic', title: t, text: 'In ' + n.title, href: '#/node/' + n.id }));
      n.learn.forEach(c => INDEX.push({ type: 'Concept', title: c.h, text: strip(c.p), href: '#/node/' + n.id }));
      n.learn.filter(c => c.code).forEach(c => INDEX.push({ type: 'Code', title: c.h + ' (example)', text: c.code, href: '#/node/' + n.id, code: true }));
      n.q.filter(q => q.t === 'code' || q.t === 'jscode').forEach(q => INDEX.push({ type: 'Code', title: 'Challenge: ' + strip(q.q).slice(0, 70), text: (q.starter || '') + ' ' + strip(q.q), href: '#/node/' + n.id, code: true }));
    });
    CS.projects.forEach(p => INDEX.push({ type: 'Project', title: p.title, text: p.summary + ' ' + p.skills.join(' ') + ' ' + p.steps.map(s => s.t).join(' '), href: '#/project/' + p.id }));
    Labs.list.forEach(l => INDEX.push({ type: 'Lab', title: l.title, text: l.desc, href: '#/lab/' + l.id }));
  }
  function search(q) {
    if (!INDEX) buildIndex();
    const words = q.toLowerCase().split(/\s+/).filter(Boolean); if (!words.length) return [];
    return INDEX.map(it => { const t = it.title.toLowerCase(), x = it.text.toLowerCase(); let score = 0; for (const w of words) { if (t.includes(w)) score += t.startsWith(w) ? 6 : 4; else if (x.includes(w)) score += 1; else return null; } if (it.type === 'Stage' || it.type === 'Lesson') score += 1; return { it, score }; }).filter(Boolean).sort((a, b) => b.score - a.score).slice(0, 60).map(x => x.it);
  }
  function highlightText(text, words) { let s = esc(text); words.forEach(w => { if (w.length > 1) s = s.replace(new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<mark>$1</mark>'); }); return s; }
  V.search = q => {
    q = decodeURIComponent(q || ''); const input = document.getElementById('searchInput'); if (document.activeElement !== input) input.value = q;
    const res = search(q), words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const wrap = h('div', { class: 'narrow searchres' }, h('h1', {}, q ? `Results for "${q}"` : 'Search'), h('p', { class: 'muted' }, q ? `${res.length} result${res.length === 1 ? '' : 's'} across lessons, topics, concepts, code, projects and stages.` : 'Type in the search bar above.'));
    if (q && !res.length) wrap.append(h('div', { class: 'empty' }, 'No matches. Try a shorter word, like "sort", "pointer" or "tcp".'));
    wrap.append(h('ul', { class: 'list' }, res.map(it => { const x = it.text.toLowerCase(); const i = Math.max(0, x.indexOf(words.find(w => x.includes(w)) || '') - 50); const snip = (i > 0 ? '…' : '') + it.text.slice(i, i + 160) + (it.text.length > i + 160 ? '…' : ''); return h('li', {}, h('a', { href: it.href, style: { flexDirection: 'column', alignItems: 'flex-start', gap: '2px' } }, h('span', { class: 'small muted' }, it.type), h('b', { html: highlightText(it.title, words) }), h('span', { class: 'small muted' + (it.code ? '' : ''), style: it.code ? { fontFamily: 'var(--mono)', fontSize: '.8rem' } : {}, html: highlightText(snip, words) }))); })));
    main.append(wrap);
  };
  let searchTimer;
  document.getElementById('searchForm').addEventListener('submit', e => { e.preventDefault(); go('#/search/' + encodeURIComponent(document.getElementById('searchInput').value.trim())); });
  document.getElementById('searchInput').addEventListener('input', e => { clearTimeout(searchTimer); searchTimer = setTimeout(() => { const v = e.target.value.trim(); if (v.length >= 2) history.replaceState(null, '', '#/search/' + encodeURIComponent(v)), render(); }, 250); });
  document.addEventListener('keydown', e => { if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !document.body.classList.contains('in-lesson')) { e.preventDefault(); document.getElementById('searchInput').focus(); } });

  V.notFound = () => { main.append(h('div', { class: 'narrow empty' }, h('h2', {}, 'That page does not exist'), h('p', {}, 'The link may be from an older version of the curriculum.'), h('a', { class: 'btn', href: '#/' }, 'Go home'))); };

  /* ---------- router ---------- */
  function render() {
    Labs.stop();
    document.body.classList.remove('in-lesson');
    const ov = document.getElementById('overlay'); ov.hidden = true; ov.innerHTML = '';
    const parts = location.hash.replace(/^#\/?/, '').split('/');
    const [r, a] = parts; main.innerHTML = '';
    const navKey = { '': 'home', roadmap: 'roadmap', stage: 'roadmap', node: 'roadmap', practice: 'practice', labs: 'labs', lab: 'labs', projects: 'projects', project: 'projects', capstone: 'projects', profile: 'profile', settings: 'settings' }[r || ''];
    document.querySelectorAll('.sidenav a').forEach(x => { x.classList.toggle('active', x.dataset.nav === navKey); if (x.dataset.nav === navKey) x.setAttribute('aria-current', 'page'); else x.removeAttribute('aria-current'); });
    const titles = { roadmap: 'Roadmap', practice: 'Practice', labs: 'Labs', projects: 'Projects', profile: 'Profile', settings: 'Settings', search: 'Search' };
    try {
      switch (r || '') {
        case '': V.home(); break;
        case 'roadmap': V.roadmap(); break;
        case 'stage': V.roadmap(a); break;
        case 'node': V.node(a); document.title = (CS.nodeById[a] || {}).title + ' · Mainline'; break;
        case 'lesson': { const n = CS.nodeById[a]; if (n) startLesson(n); else V.notFound(); break; }
        case 'practice': V.practice(); break;
        case 'labs': V.labs(); break;
        case 'lab': V.lab(a); break;
        case 'projects': V.projects(); break;
        case 'project': V.project(a); break;
        case 'capstone': V.capstone(); break;
        case 'profile': V.profile(); break;
        case 'settings': V.settings(); break;
        case 'search': V.search(parts.slice(1).join('/')); break;
        default: V.notFound();
      }
    } catch (err) { console.error(err); main.innerHTML = ''; main.append(h('div', { class: 'narrow empty' }, h('h2', {}, 'Something broke on this page'), h('p', {}, String(err.message)), h('a', { class: 'btn', href: '#/' }, 'Go home'))); }
    if (r !== 'node') document.title = (titles[r] ? titles[r] + ' · ' : '') + 'Mainline';
    if (r !== 'stage' && !document.body.classList.contains('in-lesson')) window.scrollTo(0, 0);
    hud();
  }
  window.addEventListener('hashchange', render);
  applyTheme(); render();
  setInterval(hud, 60000);
  window.App = { render, startLesson, search };
})();
