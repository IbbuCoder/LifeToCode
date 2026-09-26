/* Curriculum registry. Data files call CS.addStage(...) / CS.addProjects(...).
   Schema (see README.md for full details):
   stage: {id, n, title, track, icon, blurb, prereq:[stageIds], pos:[x,y], note?, nodes:[node]}
   node:  {id, title, icon, topics:[...], group?, lab?, learn:[{h, p(html), code?, lang?}], q:[question]}
   question types: mc, tf, fill, short, match, order, predict, fix, code, jscode, bits, gen
*/
window.CS = {
  stages: [], projects: [], specializations: [],
  tracks: {
    foundations: { name: 'Foundations line', color: 'var(--line-foundations)' },
    programming: { name: 'Programming line', color: 'var(--line-programming)' },
    python:      { name: 'Python line', color: 'var(--line-python)' },
    ap:          { name: 'AP prep line', color: 'var(--line-ap)' },
    core:        { name: 'CS core line', color: 'var(--line-core)' },
    systems:     { name: 'Systems line', color: 'var(--line-systems)' },
    web:         { name: 'Web & engineering line', color: 'var(--line-web)' },
    ai:          { name: 'Data & AI line', color: 'var(--line-ai)' },
    projects:    { name: 'Projects line', color: 'var(--line-projects)' }
  },
  addStage(s) { this.stages.push(s); },
  addNodes(stageId, nodes) { const s = this.stages.find(x => x.id === stageId); if (s) s.nodes.push(...nodes); },
  addProjects(list) { this.projects.push(...list); },
  addSpecializations(list) { this.specializations.push(...list); },
  build() {
    this.stages.sort((a, b) => a.n - b.n);
    this.nodeById = {}; this.stageById = {}; this.stageOfNode = {}; this.allNodes = []; this.qById = {};
    this.projectById = {};
    for (const s of this.stages) {
      this.stageById[s.id] = s;
      s.nodes = s.nodes || [];
      s.nodes.forEach((n, i) => {
        n.index = i; this.nodeById[n.id] = n; this.stageOfNode[n.id] = s; this.allNodes.push(n);
        (n.q || []).forEach((q, j) => { q.id = n.id + '#' + j; q.node = n.id; this.qById[q.id] = q; });
      });
    }
    for (const p of this.projects) this.projectById[p.id] = p;
    return this;
  },
  color(track) { return (this.tracks[track] || this.tracks.core).color; }
};
