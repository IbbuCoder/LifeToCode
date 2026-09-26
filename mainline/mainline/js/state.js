/* Progress model. Everything lives in localStorage under one key so it survives refreshes and restarts. */
(function () {
  const KEY = 'mainline:progress:v1';
  const HEART_MAX = 5, HEART_MS = 30 * 60 * 1000;
  const SRS_DAYS = [0, 1, 2, 4, 8, 16, 32, 64];

  const pad = n => String(n).padStart(2, '0');
  const dateKey = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const today = () => dateKey(new Date());
  const addDays = (key, n) => { const d = new Date(key + 'T12:00:00'); d.setDate(d.getDate() + n); return dateKey(d); };
  const daysBetween = (a, b) => Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 864e5);
  const weekKey = (d = new Date()) => { const t = new Date(d); t.setHours(12, 0, 0, 0); t.setDate(t.getDate() - ((t.getDay() + 6) % 7)); return dateKey(t); };

  const fresh = () => ({
    v: 1, created: today(),
    profile: { name: '', goal: 30, onboarded: false, focus: 'all' },
    xp: 0, days: {}, streak: { count: 0, best: 0, last: null },
    hearts: { n: HEART_MAX, ts: Date.now() },
    nodes: {}, qs: {}, projects: {}, ach: {}, daily: {}, weeks: {}, unlocked: {},
    settings: { hearts: true, explore: false, theme: 'auto', motion: true, sound: false },
    capstone: null, lastNode: null,
    stats: { lessons: 0, perfect: 0, practice: 0, reviews: 0, code: 0, answers: 0, correct: 0, checkpoints: 0, daily: 0, projectSteps: 0 }
  });

  function deepMerge(base, extra) {
    for (const k in extra) {
      if (extra[k] && typeof extra[k] === 'object' && !Array.isArray(extra[k]) && base[k] && typeof base[k] === 'object') deepMerge(base[k], extra[k]);
      else base[k] = extra[k];
    }
    return base;
  }

  let st;
  try { st = deepMerge(fresh(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { st = fresh(); }

  const listeners = new Set();
  const S = {
    KEY, HEART_MAX, today, addDays, daysBetween, weekKey, dateKey,
    get: () => st,
    save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { console.warn('Could not save progress', e); } listeners.forEach(f => f()); },
    onChange(f) { listeners.add(f); },
    reset() { st = fresh(); S.save(); },
    exportJSON() { return JSON.stringify(st, null, 2); },
    importJSON(txt) { const data = JSON.parse(txt); if (!data || data.v !== 1) throw new Error('This file is not a Mainline progress export.'); st = deepMerge(fresh(), data); S.save(); },

    /* ---------- XP, levels, streaks ---------- */
    levelInfo(xp = st.xp) {
      let L = 1; while (25 * L * (L + 1) <= xp) L++;
      const base = 25 * (L - 1) * L, next = 25 * L * (L + 1);
      return { level: L, into: xp - base, need: next - base, next };
    },
    todayXP() { return st.days[today()] || 0; },
    weekStats(wk = weekKey()) { return st.weeks[wk] || (st.weeks[wk] = { xp: 0, lessons: 0, reviews: 0, code: 0, projectSteps: 0, perfect: 0 }); },
    bump(stat, n = 1) { st.stats[stat] = (st.stats[stat] || 0) + n; const w = S.weekStats(); if (stat in w) w[stat] += n; },
    addXP(n) {
      if (!n) return { levelUp: false };
      const before = S.levelInfo().level;
      st.xp += n; const t = today(); st.days[t] = (st.days[t] || 0) + n; S.weekStats().xp += n;
      const s = st.streak;
      if (s.last !== t) {
        s.count = (s.last && daysBetween(s.last, t) === 1) ? s.count + 1 : 1;
        s.last = t; s.best = Math.max(s.best, s.count);
      }
      const after = S.levelInfo().level;
      S.save();
      return { levelUp: after > before, level: after };
    },
    streakInfo() {
      const s = st.streak, t = today();
      if (!s.last) return { count: 0, active: false, atRisk: false };
      const gap = daysBetween(s.last, t);
      if (gap === 0) return { count: s.count, active: true, atRisk: false };
      if (gap === 1) return { count: s.count, active: false, atRisk: true };
      return { count: 0, active: false, atRisk: false };
    },

    /* ---------- hearts ---------- */
    hearts() {
      const h = st.hearts;
      if (h.n < HEART_MAX) {
        const gained = Math.floor((Date.now() - h.ts) / HEART_MS);
        if (gained > 0) { h.n = Math.min(HEART_MAX, h.n + gained); h.ts = h.n >= HEART_MAX ? Date.now() : h.ts + gained * HEART_MS; }
      } else h.ts = Date.now();
      return st.settings.hearts ? h.n : Infinity;
    },
    nextHeartIn() { return st.hearts.n >= HEART_MAX ? 0 : Math.max(0, HEART_MS - (Date.now() - st.hearts.ts)); },
    loseHeart() { if (!st.settings.hearts) return; S.hearts(); if (st.hearts.n >= HEART_MAX) st.hearts.ts = Date.now(); st.hearts.n = Math.max(0, st.hearts.n - 1); S.save(); },
    gainHeart(n = 1) { st.hearts.n = Math.min(HEART_MAX, st.hearts.n + n); S.save(); },

    /* ---------- answers & spaced repetition ---------- */
    family(t) { return ({ mc: 'multiple choice', tf: 'true/false', fill: 'recall', short: 'recall', match: 'matching', order: 'ordering', predict: 'code prediction', fix: 'debugging', code: 'writing code', jscode: 'writing code', bits: 'visual', gen: 'visual' })[t] || t; },
    node(id) { return st.nodes[id] || (st.nodes[id] = { done: false, started: false, attempts: 0, correct: 0, types: {}, recent: [], reviewDays: [], lessonDay: null }); },
    recordAnswer(q, ok) {
      const n = S.node(q.node); const fam = S.family(q.t);
      n.attempts++; if (ok) { n.correct++; n.types[fam] = (n.types[fam] || 0) + 1; }
      n.recent.push(ok ? 1 : 0); if (n.recent.length > 20) n.recent.shift();
      st.stats.answers++; if (ok) st.stats.correct++;
      if (q.id) {
        const r = st.qs[q.id] || (st.qs[q.id] = { box: 0, due: today(), right: 0, wrong: 0 });
        if (ok) { r.right++; r.box = Math.min(SRS_DAYS.length - 1, r.box + 1); r.due = addDays(today(), SRS_DAYS[r.box]); }
        else { r.wrong++; r.box = 0; r.due = today(); r.lastWrong = today(); }
      }
    },
    dueQuestions() {
      const t = today();
      return Object.entries(st.qs).filter(([id, r]) => r.due <= t && window.CS.qById[id]).sort((a, b) => a[1].box - b[1].box || (a[1].due < b[1].due ? -1 : 1)).map(([id]) => id);
    },
    accuracy(id) { const n = st.nodes[id]; if (!n || !n.recent.length) return null; return n.recent.reduce((a, b) => a + b, 0) / n.recent.length; },

    /* ---------- unlocking & mastery ---------- */
    stageComplete(stage) { return stage.nodes.length > 0 && stage.nodes.every(n => st.nodes[n.id] && st.nodes[n.id].done); },
    stageUnlocked(stage) {
      if (st.settings.explore || st.unlocked[stage.id]) return true;
      return (stage.prereq || []).every(pid => { const p = window.CS.stageById[pid]; return !p || S.stageComplete(p); });
    },
    nodeUnlocked(node) {
      const stage = window.CS.stageOfNode[node.id];
      if (!S.stageUnlocked(stage)) return false;
      if (st.settings.explore || node.index === 0) return true;
      const prev = stage.nodes[node.index - 1];
      return !!(st.nodes[prev.id] && st.nodes[prev.id].done) || !!(st.nodes[node.id] && st.nodes[node.id].started);
    },
    availableFamilies(node) { return new Set((node.q || []).map(q => S.family(q.t))); },
    status(node) {
      if (!S.nodeUnlocked(node)) return 'locked';
      const n = st.nodes[node.id];
      if (!n || !n.done) return 'learning';
      const avail = S.availableFamilies(node).size;
      const typesOk = Object.keys(n.types).filter(k => n.types[k] > 0).length;
      const acc = S.accuracy(node.id) ?? 0;
      const days = n.reviewDays.length;
      if (typesOk >= Math.min(3, avail) && acc >= 0.8 && days >= 2) return 'mastered';
      if (typesOk >= Math.min(2, avail) && acc >= 0.7 && days >= 1) return 'proficient';
      return 'practiced';
    },
    masteryWeight: { locked: 0, learning: 0, practiced: 0.6, proficient: 0.8, mastered: 1 },
    overall() {
      const nodes = window.CS.allNodes; if (!nodes.length) return 0;
      return nodes.reduce((a, n) => a + S.masteryWeight[S.status(n)], 0) / nodes.length;
    },
    counts() {
      const c = { locked: 0, learning: 0, practiced: 0, proficient: 0, mastered: 0, done: 0 };
      for (const n of window.CS.allNodes) { const s = S.status(n); c[s]++; if (st.nodes[n.id] && st.nodes[n.id].done) c.done++; }
      return c;
    },
    /* A practice/review pass on a later day counts toward proficiency and mastery. */
    recordNodeSession(nodeId, correct, total) {
      if (!total) return;
      const n = S.node(nodeId);
      if (n.done && correct / total >= 0.7) {
        const t = today();
        if (t !== n.lessonDay && !n.reviewDays.includes(t)) n.reviewDays.push(t);
      }
    },
    weakNodes(limit = 5) {
      return window.CS.allNodes.map(node => {
        const n = st.nodes[node.id]; if (!n || n.attempts < 4) return null;
        const acc = S.accuracy(node.id);
        const recentWrong = Object.entries(st.qs).filter(([id, r]) => r.box === 0 && r.wrong > 0 && id.startsWith(node.id + '#')).length;
        const score = acc - recentWrong * 0.05;
        return score < 0.78 ? { node, acc, recentWrong, score } : null;
      }).filter(Boolean).sort((a, b) => a.score - b.score).slice(0, limit);
    },
    nextNode() {
      for (const s of window.CS.stages) for (const n of s.nodes) if (S.nodeUnlocked(n) && !(st.nodes[n.id] && st.nodes[n.id].done)) return n;
      return null;
    }
  };

  /* ---------- achievements ---------- */
  S.ACHIEVEMENTS = [
    { id: 'first-lesson', em: '🚉', name: 'First stop', desc: 'Finish your first lesson', test: s => s.stats.lessons >= 1 },
    { id: 'lessons-10', em: '🎫', name: 'Commuter', desc: 'Finish 10 lessons', test: s => s.stats.lessons >= 10 },
    { id: 'lessons-50', em: '🚆', name: 'Express rider', desc: 'Finish 50 lessons', test: s => s.stats.lessons >= 50 },
    { id: 'lessons-150', em: '🗺️', name: 'Whole network', desc: 'Finish 150 lessons', test: s => s.stats.lessons >= 150 },
    { id: 'perfect', em: '💯', name: 'Clean run', desc: 'Finish a lesson with no mistakes', test: s => s.stats.perfect >= 1 },
    { id: 'perfect-10', em: '🎯', name: 'Precision', desc: '10 perfect lessons', test: s => s.stats.perfect >= 10 },
    { id: 'streak-3', em: '🔥', name: 'Warming up', desc: 'Reach a 3-day streak', test: s => s.streak.best >= 3 },
    { id: 'streak-7', em: '📅', name: 'Full week', desc: 'Reach a 7-day streak', test: s => s.streak.best >= 7 },
    { id: 'streak-30', em: '🏔️', name: 'Month of code', desc: 'Reach a 30-day streak', test: s => s.streak.best >= 30 },
    { id: 'level-5', em: '⭐', name: 'Level 5', desc: 'Reach level 5', test: () => S.levelInfo().level >= 5 },
    { id: 'level-15', em: '🌟', name: 'Level 15', desc: 'Reach level 15', test: () => S.levelInfo().level >= 15 },
    { id: 'code-1', em: '🐍', name: 'It runs', desc: 'Pass your first coding challenge', test: s => s.stats.code >= 1 },
    { id: 'code-25', em: '⌨️', name: 'Code machine', desc: 'Pass 25 coding challenges', test: s => s.stats.code >= 25 },
    { id: 'review-10', em: '🔁', name: 'Spaced out', desc: 'Finish 10 review sessions', test: s => s.stats.reviews >= 10 },
    { id: 'daily-1', em: '☀️', name: 'Daily habit', desc: 'Finish a daily challenge', test: s => s.stats.daily >= 1 },
    { id: 'daily-7', em: '🗓️', name: 'Seven dailies', desc: 'Finish 7 daily challenges', test: s => s.stats.daily >= 7 },
    { id: 'master-1', em: '👑', name: 'Mastered', desc: 'Master your first topic', test: () => S.counts().mastered >= 1 },
    { id: 'master-20', em: '🏆', name: 'Specialist', desc: 'Master 20 topics', test: () => S.counts().mastered >= 20 },
    { id: 'stage-1', em: '🏁', name: 'Line complete', desc: 'Finish every lesson in a stage', test: () => window.CS.stages.some(x => S.stageComplete(x)) },
    { id: 'python', em: '🐉', name: 'Pythonista', desc: 'Finish the whole Python stage', test: () => { const p = window.CS.stageById['s3']; return p && S.stageComplete(p); } },
    { id: 'project-1', em: '🛠️', name: 'Builder', desc: 'Complete a project', test: s => Object.values(s.projects).some(p => p.done) },
    { id: 'project-5', em: '🏗️', name: 'Portfolio', desc: 'Complete 5 projects', test: s => Object.values(s.projects).filter(p => p.done).length >= 5 },
    { id: 'checkpoint', em: '🚀', name: 'Jumped ahead', desc: 'Pass a checkpoint test', test: s => s.stats.checkpoints >= 1 }
  ];
  S.checkAchievements = function () {
    const earned = [];
    for (const a of S.ACHIEVEMENTS) if (!st.ach[a.id] && a.test(st)) { st.ach[a.id] = today(); earned.push(a); }
    if (earned.length) S.save();
    return earned;
  };

  /* ---------- weekly quests (seeded per week) ---------- */
  const QUESTS = [
    { id: 'xp', label: w => `Earn ${w} XP`, key: 'xp', goals: [250, 400, 600] },
    { id: 'lessons', label: w => `Finish ${w} lessons`, key: 'lessons', goals: [4, 6, 8] },
    { id: 'reviews', label: w => `Complete ${w} review or practice sessions`, key: 'reviews', goals: [3, 5] },
    { id: 'code', label: w => `Pass ${w} coding challenges`, key: 'code', goals: [2, 4] },
    { id: 'perfect', label: w => `Finish ${w} lessons with no mistakes`, key: 'perfect', goals: [2, 3] },
    { id: 'projectSteps', label: w => `Complete ${w} project steps`, key: 'projectSteps', goals: [3, 5] }
  ];
  S.seeded = function (seedStr) { let h = 2166136261; for (const c of seedStr) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 100000) / 100000; }; };
  S.weeklyQuests = function () {
    const wk = weekKey(), rnd = S.seeded('week' + wk), w = S.weekStats(wk);
    const pool = QUESTS.slice().sort(() => rnd() - 0.5).slice(0, 3);
    return pool.map(q => { const goal = q.goals[Math.floor(rnd() * q.goals.length)]; const have = w[q.key] || 0; return { id: q.id, label: q.label(goal), goal, have: Math.min(have, goal), done: have >= goal }; });
  };
  S.claimWeekly = function () {
    const wk = weekKey(); const w = S.weekStats(wk);
    if (w.claimed) return 0;
    if (!S.weeklyQuests().every(q => q.done)) return 0;
    w.claimed = true; S.addXP(100); return 100;
  };

  /* ---------- leaderboard-ready adapter ----------
     Swap LocalBoard for a provider with the same interface (submit/top) to add an online league later. */
  const LocalBoard = {
    name: 'This device',
    async submit() { return true; },
    async top() {
      const rows = Object.entries(st.weeks).sort((a, b) => a[0] < b[0] ? 1 : -1).slice(0, 8)
        .map(([wk, v]) => ({ label: 'Week of ' + wk, xp: v.xp }));
      return rows;
    }
  };
  S.leaderboard = LocalBoard;

  window.S = S;
})();
