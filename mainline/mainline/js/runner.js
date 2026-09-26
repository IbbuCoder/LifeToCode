/* Code execution in Web Workers so an infinite loop can be stopped.
   Python uses Pyodide (CPython compiled to WebAssembly), loaded on first use from jsDelivr. */
(function () {
  const PY_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';
  const pySrc = `
importScripts('${PY_URL}pyodide.js');
let py;
const ready = loadPyodide({ indexURL: '${PY_URL}' }).then(p => { py = p; postMessage({ type: 'ready' }); })
  .catch(e => postMessage({ type: 'fail', err: String(e) }));
onmessage = async (e) => {
  await ready;
  const { id, code, tests } = e.data;
  let out = '';
  py.setStdout({ batched: s => out += s + '\\n' });
  py.setStderr({ batched: s => out += s + '\\n' });
  try {
    py.globals.set('__user_code', code);
    py.globals.set('__test_code', tests || '');
    await py.runPythonAsync(\`
import builtins as __b
def __no_input(prompt=''):
    raise RuntimeError('input() is not available here. Put your logic in a function and call it with values instead.')
__ns = {'__name__': '__main__', 'input': __no_input}
exec(compile(__user_code, 'main.py', 'exec'), __ns)
if __test_code:
    exec(compile(__test_code, 'tests.py', 'exec'), __ns)
\`);
    postMessage({ id, ok: true, out });
  } catch (err) {
    let msg = String(err.message || err);
    const lines = msg.trim().split('\\n');
    const keep = [];
    for (let i = lines.length - 1; i >= 0 && keep.length < 6; i--) { if (/pyodide|_pyodide|<exec>|__user_code|File "<string>"/.test(lines[i])) continue; keep.unshift(lines[i]); }
    postMessage({ id, ok: false, out, err: keep.join('\\n') });
  }
};`;

  const jsSrc = `
onmessage = (e) => {
  const { id, code, tests } = e.data; let out = '';
  const fmt = a => typeof a === 'string' ? a : (() => { try { return JSON.stringify(a); } catch (x) { return String(a); } })();
  const console = { log: (...a) => { out += a.map(fmt).join(' ') + '\\n'; }, error: (...a) => { out += a.map(fmt).join(' ') + '\\n'; } };
  const assert = (cond, msg) => { if (!cond) throw new Error('Test failed: ' + (msg || 'assertion')); };
  try { new Function('console', 'assert', code + '\\n;' + (tests || ''))(console, assert); postMessage({ id, ok: true, out }); }
  catch (err) { postMessage({ id, ok: false, out, err: String(err && err.message || err) }); }
};`;

  function makeWorker(src) { return new Worker(URL.createObjectURL(new Blob([src], { type: 'text/javascript' }))); }

  let py = null, pyReady = null, seq = 0; const pending = {};
  function startPy() {
    py = makeWorker(pySrc);
    pyReady = new Promise((res, rej) => {
      const t = setTimeout(() => rej(new Error('Python took too long to load. Check your connection and try again.')), 90000);
      py.addEventListener('message', function h(e) {
        if (e.data.type === 'ready') { clearTimeout(t); py.removeEventListener('message', h); res(); }
        if (e.data.type === 'fail') { clearTimeout(t); rej(new Error('Python could not load: ' + e.data.err)); }
      });
      py.addEventListener('error', () => { clearTimeout(t); rej(new Error('Python could not load. You may be offline.')); });
    });
    py.addEventListener('message', e => { const p = pending[e.data.id]; if (p) { delete pending[e.data.id]; p(e.data); } });
    pyReady.catch(() => { py = null; });
  }

  const Runner = {
    pyStatus: 'idle',
    async python(code, tests, timeoutMs = 8000) {
      if (!py) { startPy(); Runner.pyStatus = 'loading'; }
      try { await pyReady; Runner.pyStatus = 'ready'; }
      catch (e) { Runner.pyStatus = 'failed'; py = null; return { ok: false, out: '', err: e.message, loadError: true }; }
      const id = ++seq;
      return new Promise(res => {
        const timer = setTimeout(() => { delete pending[id]; py.terminate(); py = null; Runner.pyStatus = 'idle'; res({ ok: false, out: '', err: 'Stopped after ' + timeoutMs / 1000 + ' seconds. Look for a loop that never ends.' }); }, timeoutMs);
        pending[id] = r => { clearTimeout(timer); res(r); };
        py.postMessage({ id, code, tests });
      });
    },
    preloadPython() { if (!py) { startPy(); Runner.pyStatus = 'loading'; pyReady.then(() => Runner.pyStatus = 'ready', () => Runner.pyStatus = 'failed'); } },
    javascript(code, tests, timeoutMs = 4000) {
      return new Promise(res => {
        const w = makeWorker(jsSrc);
        const timer = setTimeout(() => { w.terminate(); res({ ok: false, out: '', err: 'Stopped after ' + timeoutMs / 1000 + ' seconds. Look for a loop that never ends.' }); }, timeoutMs);
        w.onmessage = e => { clearTimeout(timer); w.terminate(); res(e.data); };
        w.onerror = e => { clearTimeout(timer); w.terminate(); res({ ok: false, out: '', err: e.message }); };
        w.postMessage({ id: 1, code, tests });
      });
    }
  };
  window.Runner = Runner;
})();
