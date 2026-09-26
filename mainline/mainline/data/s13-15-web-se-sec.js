/* Stages 13-15: web development, software engineering, cybersecurity. */
CS.addStage({
  id: 's13', n: 13, title: 'Web development', short: 'Web dev', track: 'web', icon: '🌐', pos: [690, 400], prereq: ['s12'],
  blurb: 'HTML, CSS, JavaScript and the DOM on the front end; APIs, auth and deployment on the back. Runnable JavaScript throughout.',
  nodes: [
    {
      id: 'web-html', group: 'Frontend', title: 'HTML and semantic structure', icon: '📄', topics: ['HTML', 'Semantic HTML', 'Accessibility'],
      learn: [
        { h: 'HTML describes meaning, not appearance', p: '<p>Elements say what content <i>is</i>: a heading, a list, a navigation region, a button. Styling is CSS\'s job. Getting this right gives you accessibility, SEO and keyboard support almost for free.</p>', code: '<article>\n  <h1>Mainline</h1>\n  <p>A roadmap for <strong>computer science</strong>.</p>\n  <nav aria-label="Sections">\n    <ul>\n      <li><a href="#stages">Stages</a></li>\n    </ul>\n  </nav>\n  <button type="button">Start</button>\n</article>', lang: 'html' },
        { h: 'Semantics beat div soup', p: '<p><code>&lt;header&gt; &lt;nav&gt; &lt;main&gt; &lt;section&gt; &lt;article&gt; &lt;aside&gt; &lt;footer&gt;</code> give screen readers landmarks to jump between. One <code>&lt;h1&gt;</code> per page, then <code>&lt;h2&gt;</code> and below in order — never skip a level for visual size, since that is what CSS is for.</p>' },
        { h: 'Forms, labels and images', p: '<p>Every input needs a label tied by <code>for</code>/<code>id</code>. Every meaningful image needs <code>alt</code> text; decorative images get <code>alt=""</code>. Use a real <code>&lt;button&gt;</code> rather than a clickable div, or you lose keyboard focus, Enter/Space activation and the correct role.</p>', code: '<label for="email">Email</label>\n<input id="email" name="email" type="email" required>\n<img src="chart.png" alt="Revenue rose 20% in Q3">', lang: 'html' }
      ],
      q: [
        { t: 'mc', q: 'Why use a `<button>` instead of a `<div onclick=...>`?', o: ['It is focusable, keyboard-activatable and announced correctly by screen readers', 'It renders faster', 'Divs cannot have click handlers', 'It is shorter to type'], a: 0, e: 'Recreating all of that behaviour on a div takes tabindex, key handlers and ARIA roles, and is usually done wrong.' },
        { t: 'mc', q: 'What does `alt=""` mean on an image?', o: ['The image is decorative and should be skipped by screen readers', 'The alt text is missing', 'The image failed to load', 'It is invalid HTML'], a: 0, e: 'An explicit empty alt is different from no alt at all, which makes readers announce the filename.' },
        { t: 'fix', q: 'What is wrong with this markup?', code: '<div class="title">Products</div>\n<div class="item">Chair</div>\n<div class="item">Desk</div>', lang: 'html', o: ['It should be a heading and a list, so structure is conveyed', 'It needs more classes', 'Divs cannot be styled', 'It is missing a form'], a: 0, e: '<h2> plus <ul><li> gives navigable structure with no visual change once styled.' },
        { t: 'fill', q: 'A form input is connected to its label by matching the label\'s `for` attribute with the input\'s ___.', a: ['id'], e: 'Clicking the label then focuses the input, and screen readers announce them together.' },
        { t: 'tf', q: 'You should skip from `<h1>` to `<h3>` when you want smaller text.', a: false, e: 'Heading level is structure. Use CSS for size and keep the outline correct.' }
      ]
    },
    {
      id: 'web-css', group: 'Frontend', title: 'CSS, layout and responsive design', icon: '🎨', topics: ['CSS', 'Flexbox', 'Grid', 'Responsive design'],
      learn: [
        { h: 'Selectors, the cascade and specificity', p: '<p>When rules conflict, specificity decides: inline &gt; id &gt; class &gt; element. Later rules win ties. Fighting specificity with <code>!important</code> is a sign the selectors need simplifying, not escalating.</p>', code: '.card { padding: 1rem; border-radius: 8px; }\n.card:hover { transform: translateY(-2px); }\n:root { --brand: #2F6BDE; }\n.button { background: var(--brand); }', lang: 'css' },
        { h: 'The box model and modern layout', p: '<p>Content, padding, border, margin. <code>box-sizing: border-box</code> makes width include padding and border, which is what everyone expects.</p><pre>Flexbox  one dimension: rows or columns, distributing space\nGrid     two dimensions: rows and columns at once</pre>', code: '.row { display: flex; gap: 1rem; align-items: center; }\n.layout {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));\n  gap: 1rem;\n}', lang: 'css' },
        { h: 'Responsive without guesswork', p: '<p>Design mobile-first, then add <code>@media (min-width: 48rem)</code> rules as space allows. Use relative units (<code>rem</code>, <code>%</code>, <code>fr</code>, <code>clamp()</code>) so text scales with user settings. Respect <code>prefers-reduced-motion</code> and <code>prefers-color-scheme</code>: they are one media query each and matter to real users.</p>' }
      ],
      q: [
        { t: 'mc', q: 'Which selector wins: `#nav .link` or `.header .nav .link`?', o: ['#nav .link, because an id outweighs any number of classes', '.header .nav .link, because it is more specific', 'Whichever comes last', 'Neither; it is an error'], a: 0, e: 'Specificity is compared by category: ids first, then classes, then elements.' },
        { t: 'mc', q: 'You need a one-dimensional row of items with even spacing. The natural tool is:', o: ['Flexbox', 'Grid', 'Floats', 'Absolute positioning'], a: 0, e: 'Flex handles one axis; grid is for rows and columns together.' },
        { t: 'mc', q: 'What does `box-sizing: border-box` change?', o: ['Width includes padding and border', 'Margins collapse', 'Elements become flex items', 'Borders are removed'], a: 0, e: 'Setting a 200px width gives a 200px box, which is the intuitive behaviour.' },
        { t: 'fill', q: 'The media feature used to reduce animation for users who ask for it is `prefers-reduced-___`.', a: ['motion'], e: 'One media query, meaningful accessibility gain.' },
        { t: 'mc', q: 'Why prefer `rem` over `px` for font sizes?', o: ['It scales with the user\'s browser font-size setting', 'It renders faster', 'It is required for flexbox', 'Pixels are deprecated'], a: 0, e: 'Users who enlarge text are often the ones who most need it to work.' }
      ]
    },
    {
      id: 'web-js', group: 'Frontend', title: 'JavaScript and the DOM', icon: '🟨', topics: ['JavaScript', 'DOM', 'Events'],
      learn: [
        { h: 'The language in one card', p: '<pre>let / const (never var)   block scoped\narrow functions          const f = (a) => a * 2\ntemplate literals        `hi ${name}`\ndestructuring            const {id, title} = book\nspread                   [...items, next]\narray methods            map, filter, reduce, find, some, every\n=== not ==               strict equality, no coercion</pre>' },
        { h: 'Finding and changing the DOM', p: '<p>The DOM is a live tree of objects representing the page. Query it, change it, and the browser re-renders.</p>', code: 'const list = document.querySelector("#tasks");\nconst li = document.createElement("li");\nli.textContent = task.title;      // textContent, not innerHTML, for user data\nli.classList.add("done");\nlist.append(li);', lang: 'js' },
        { h: 'Events and delegation', p: '<p>Events bubble up the tree, so one listener on a container can serve hundreds of children — including ones added later.</p>', code: 'list.addEventListener("click", (e) => {\n  const item = e.target.closest("li");\n  if (!item) return;\n  item.classList.toggle("done");\n});', lang: 'js' }
      ],
      q: [
        { t: 'jscode', q: 'Write `sumEven(nums)` returning the sum of the even numbers in the array.', starter: 'function sumEven(nums) {\n  // your code\n}\n', tests: 'if (sumEven([1,2,3,4]) !== 6) throw new Error("1..4 should give 6");\nif (sumEven([]) !== 0) throw new Error("empty array should give 0");\nif (sumEven([1,3]) !== 0) throw new Error("no evens should give 0");\nconsole.log("Summed.");', sol: 'function sumEven(nums) {\n  return nums.filter(n => n % 2 === 0).reduce((a, b) => a + b, 0);\n}', hint: 'filter then reduce, and give reduce an initial value of 0 so empty arrays work.', e: 'Without the initial value, reduce throws on an empty array.' },
        { t: 'mc', q: 'Why prefer `textContent` over `innerHTML` when inserting user data?', o: ['innerHTML parses the string as HTML, allowing script injection', 'textContent is faster to type', 'innerHTML does not exist on all elements', 'They behave identically'], a: 0, e: 'This is how DOM-based XSS happens.' },
        { t: 'mc', q: 'What is event delegation?', o: ['One listener on a parent handles events from many children, including future ones', 'Passing events between windows', 'Removing listeners automatically', 'Delaying an event'], a: 0, e: 'It relies on bubbling and avoids attaching hundreds of listeners.' },
        { t: 'predict', q: 'What does this log?', code: 'console.log(0 == "0", 0 === "0");\nconsole.log([1,2,3].map(n => n * 2));', lang: 'js', a: ['true false\n[ 2, 4, 6 ]', 'true false\n[2, 4, 6]'], e: '`==` coerces types; `===` does not. Always use `===`.' },
        { t: 'mc', q: '`const` declares a variable that:', o: ['Cannot be reassigned, though objects it points to can still be mutated', 'Is completely immutable, including object contents', 'Is function scoped like var', 'Cannot hold objects'], a: 0, e: 'Binding immutability, not value immutability. Use Object.freeze for the latter.' }
      ]
    },
    {
      id: 'web-async', group: 'Frontend', title: 'Fetch, promises and async JavaScript', icon: '📡', topics: ['APIs', 'Fetch', 'Promises', 'JSON'],
      learn: [
        { h: 'Promises and async/await', p: '<p>A promise represents a value that is not ready yet. <code>await</code> pauses the function until it settles, without blocking the page.</p>', code: 'async function loadUser(id) {\n  const res = await fetch(`/api/users/${id}`);\n  if (!res.ok) throw new Error(`HTTP ${res.status}`);\n  return res.json();\n}\n\ntry {\n  const user = await loadUser(7);\n} catch (err) {\n  showError(err.message);\n}', lang: 'js' },
        { h: 'The mistake everyone makes once', p: '<p><code>fetch</code> only rejects on network failure. A 404 or 500 <b>resolves</b> — so you must check <code>res.ok</code> yourself, or you will happily render an error page as if it were data.</p>' },
        { h: 'Concurrency and the event loop', p: '<p>JavaScript is single threaded with an event loop: long synchronous work freezes the UI. Run independent requests together with <code>Promise.all</code> rather than awaiting them one at a time, and handle partial failure with <code>Promise.allSettled</code>.</p>', code: 'const [user, posts] = await Promise.all([\n  loadUser(id),\n  loadPosts(id),\n]);', lang: 'js' }
      ],
      q: [
        { t: 'mc', q: 'A fetch receives a 404. What happens?', o: ['The promise resolves; you must check res.ok yourself', 'The promise rejects and throws', 'The browser retries automatically', 'It returns null'], a: 0, e: 'Only network-level failures reject.' },
        { t: 'mc', q: 'Three independent API calls each take 300 ms. Awaiting them one after another takes ~900 ms. How do you make it ~300 ms?', o: ['await Promise.all([a(), b(), c()])', 'Use three async functions', 'Use forEach with await', 'Use setTimeout'], a: 0, e: 'Start all three, then wait for the slowest. forEach with await does not wait at all, which is a separate classic bug.' },
        { t: 'jscode', q: 'Write `firstSuccessful(results)` that returns the first element whose `ok` property is true, or null.', starter: 'function firstSuccessful(results) {\n  // your code\n}\n', tests: 'const r = [{ok:false,id:1},{ok:true,id:2},{ok:true,id:3}];\nif (firstSuccessful(r).id !== 2) throw new Error("should return the first ok item");\nif (firstSuccessful([]) !== null) throw new Error("empty array should give null");\nif (firstSuccessful([{ok:false}]) !== null) throw new Error("none ok should give null");\nconsole.log("Found.");', sol: 'function firstSuccessful(results) {\n  return results.find(r => r.ok) ?? null;\n}', hint: 'Array.find returns undefined when nothing matches; convert that to null.', e: '`??` only falls back on null or undefined, unlike `||` which also catches 0 and "".' },
        { t: 'fill', q: 'To wait for several promises and get all their results, use Promise.___().', a: ['all', 'all()'], e: 'allSettled if you need the failures too.' },
        { t: 'tf', q: 'A long synchronous loop in JavaScript will freeze the page.', a: true, e: 'One thread renders and runs your code. Break up heavy work, or move it to a Web Worker.' }
      ]
    },
    {
      id: 'web-backend', group: 'Backend', title: 'Servers, REST APIs and frameworks', icon: '🖥️', topics: ['Backend', 'Flask', 'FastAPI', 'REST APIs'],
      learn: [
        { h: 'A server maps requests to functions', p: '', code: 'from fastapi import FastAPI, HTTPException\n\napp = FastAPI()\nbooks = {1: {"id": 1, "title": "Dune"}}\n\n@app.get("/books/{book_id}")\ndef get_book(book_id: int):\n    if book_id not in books:\n        raise HTTPException(status_code=404, detail="not found")\n    return books[book_id]\n\n@app.post("/books", status_code=201)\ndef create_book(book: dict):\n    books[book["id"]] = book\n    return book' },
        { h: 'REST conventions', p: '<pre>GET    /books        list\nGET    /books/7      one\nPOST   /books        create        → 201 with the new resource\nPUT    /books/7      replace\nPATCH  /books/7      partial update\nDELETE /books/7      remove        → 204</pre><p>Nouns in the URL, verbs in the method. Return the right status code: clients and caches behave differently based on it.</p>' },
        { h: 'The shape of a request', p: '<p>Route → validate input → do the work (often a database call) → serialise the response → handle errors. Validation at the boundary (pydantic, zod, a schema) is what keeps the rest of the code simple and safe. Never build SQL by concatenating request data.</p>' }
      ],
      q: [
        { t: 'mc', q: 'Which URL and method pair follows REST conventions for creating a book?', o: ['POST /books', 'GET /createBook', 'POST /books/create', 'PUT /newBook'], a: 0, e: 'The collection URL plus the method that means "create".' },
        { t: 'match', q: 'Match each outcome to its status code.', p: [['Resource created', '201'], ['Deleted, no content to return', '204'], ['Client sent invalid data', '400'], ['Unhandled server error', '500']], e: 'Correct codes let clients, proxies and monitoring behave sensibly without parsing your messages.' },
        { t: 'mc', q: 'Where should request validation happen?', o: ['At the API boundary, before any business logic runs', 'In the database only', 'In the frontend only', 'After writing to the database'], a: 0, e: 'Frontend validation is for user experience; the server cannot trust it at all.' },
        { t: 'mc', q: 'A GET endpoint returns 200 with `{"error": "not found"}`. What is wrong?', o: ['The status code should be 404, so clients can react without parsing the body', 'Nothing', 'It should return 500', 'GET cannot return JSON'], a: 0, e: 'Status codes are the machine-readable part of the contract.' },
        { t: 'fill', q: 'An API that uses nouns in URLs and HTTP methods as verbs follows the ___ style.', a: ['rest', 'restful'], e: 'Representational State Transfer.' }
      ]
    },
    {
      id: 'web-auth', group: 'Backend', title: 'Authentication, sessions and deployment', icon: '🔑', topics: ['Authentication', 'Sessions', 'JWT', 'Deployment', 'Hosting'],
      learn: [
        { h: 'Authentication vs authorisation', p: '<p><b>Authentication</b> is who you are; <b>authorisation</b> is what you may do. Check both, on the server, for every request. A hidden button is not access control.</p>' },
        { h: 'Sessions and tokens', p: '<p><b>Session cookies</b>: the server stores session state and the browser holds an opaque id. Easy to revoke. <b>JWTs</b>: a signed token the client carries; stateless and easy to scale, but hard to revoke before expiry, so keep lifetimes short and pair with refresh tokens.</p><p>Store passwords with bcrypt, scrypt or argon2 — never a plain hash, never encryption. Set cookies <code>HttpOnly</code>, <code>Secure</code> and <code>SameSite</code>.</p>' },
        { h: 'Getting it online', p: '<p>Static sites go to GitHub Pages, Netlify or Cloudflare Pages. Dynamic apps go to a platform (Render, Fly, Railway) or a container on a VM. Essentials either way: environment variables for secrets (never in the repository), HTTPS, automated backups of the database, logging and an uptime check.</p>' }
      ],
      q: [
        { t: 'mc', q: 'What is the difference between authentication and authorisation?', o: ['Who you are, versus what you are allowed to do', 'They are synonyms', 'Authorisation happens in the browser', 'Authentication only applies to admins'], a: 0, e: 'A logged-in user must still be checked against permissions on every request.' },
        { t: 'mc', q: 'How should passwords be stored?', o: ['Hashed with a slow algorithm such as bcrypt or argon2, with a salt', 'Encrypted with a key on the server', 'Hashed with SHA-256', 'In plain text behind a firewall'], a: 0, e: 'Slow hashing with per-user salts defeats bulk cracking; encryption is reversible, which is the wrong property here.' },
        { t: 'mc', q: 'The main drawback of stateless JWTs is:', o: ['They cannot easily be revoked before they expire', 'They cannot be signed', 'They only work on one server', 'They require cookies'], a: 0, e: 'Short lifetimes, refresh tokens or a deny list are the usual mitigations.' },
        { t: 'mc', q: 'An API key ends up committed to a public repository. First action?', o: ['Revoke and rotate the key immediately, then remove it from history', 'Delete the commit and assume it is fine', 'Make the repository private', 'Rename the variable'], a: 0, e: 'Assume it was scraped within minutes. History rewriting alone does not undo exposure.' },
        { t: 'fill', q: 'A cookie flag that prevents JavaScript from reading the cookie is ___.', a: ['httponly', 'http-only'], e: 'It limits the damage of an XSS bug.' }
      ]
    }
  ]
});

CS.addStage({
  id: 's14', n: 14, title: 'Software engineering', short: 'Software eng', track: 'web', icon: '🛠️', pos: [820, 400], prereq: ['s13'],
  blurb: 'Git, testing, clean code, design patterns, CI/CD and the practices that make software survivable in a team.',
  nodes: [
    {
      id: 'se-git', title: 'Git and version control', icon: '🌿', topics: ['Git', 'GitHub', 'Branching', 'Merging'],
      learn: [
        { h: 'Snapshots, not diffs', p: '<p>Each commit records the full tree plus a pointer to its parent. A branch is just a movable pointer to a commit, which is why branching in Git is instant.</p>', code: 'git status                  # what has changed\ngit add -p                  # stage selectively, hunk by hunk\ngit commit -m "Fix off-by-one in pagination"\ngit switch -c feature/login # new branch\ngit merge main              # bring main into your branch\ngit log --oneline --graph   # see the shape of history', lang: 'bash' },
        { h: 'Resolving conflicts', p: '<p>A conflict means two branches changed the same lines. Git marks the region; you choose the correct final text, remove the markers, then <code>git add</code> and continue. Conflicts are normal, not a failure — small, frequent merges keep them small.</p>' },
        { h: 'Working with others', p: '<p>Fork or branch, commit small and often, push, open a pull request, get a review, merge. Write commit messages in the imperative ("Add retry to upload"), explain <i>why</i> in the body, and never rewrite history that others have already pulled.</p>' }
      ],
      q: [
        { t: 'mc', q: 'What is a Git branch?', o: ['A movable pointer to a commit', 'A copy of the whole project folder', 'A remote server', 'A compressed archive'], a: 0, e: 'Which is why creating one is instantaneous regardless of repository size.' },
        { t: 'mc', q: 'What does `git add` do?', o: ['Stages changes for the next commit', 'Uploads changes to GitHub', 'Creates a branch', 'Downloads changes'], a: 0, e: 'add stages, commit records locally, push publishes.' },
        { t: 'order', q: 'Order a typical contribution workflow.', plain: true, o: ['Create a branch for the change', 'Commit your work in small steps', 'Push the branch to the remote', 'Open a pull request for review', 'Merge once approved'], e: 'Small branches get reviewed quickly; large ones sit for days.' },
        { t: 'mc', q: 'Two branches edited the same lines and the merge stops with conflict markers. What now?', o: ['Edit the file to the correct final content, remove the markers, add and commit', 'Delete the branch and start over', 'Run git push --force', 'Wait for Git to resolve it'], a: 0, e: 'Only a human knows which version is right; Git deliberately refuses to guess.' },
        { t: 'tf', q: 'Force-pushing a rewritten history to a shared branch is a safe routine operation.', a: false, e: 'It breaks everyone else\'s local history. Rewrite only your own unpublished commits.' }
      ]
    },
    {
      id: 'se-testing', title: 'Testing', icon: '✅', topics: ['Testing', 'Unit tests', 'Integration tests', 'TDD'],
      learn: [
        { h: 'The pyramid', p: '<p>Many fast <b>unit</b> tests (one function, no I/O), fewer <b>integration</b> tests (modules plus a real database), a few <b>end-to-end</b> tests (the whole system through the UI). Inverting this gives a slow suite everybody learns to ignore.</p>', code: 'import pytest\nfrom cart import total\n\ndef test_empty_cart_is_zero():\n    assert total([]) == 0\n\ndef test_applies_percentage_discount():\n    assert total([10, 10], discount=0.1) == 18\n\ndef test_rejects_negative_prices():\n    with pytest.raises(ValueError):\n        total([-5])' },
        { h: 'Arrange, act, assert', p: '<p>Set up the world, perform one action, check one behaviour. A test name should describe the behaviour, so a failure reads like a bug report. Test the edges: empty, one, many, boundary values, invalid input, and the things that actually broke before (a regression test).</p>' },
        { h: 'TDD and coverage, honestly', p: '<p>Red, green, refactor: write the failing test first, make it pass simply, then clean up. It is a design tool as much as a verification one — code that is hard to test is usually badly coupled.</p><p>Coverage measures which lines ran, not whether they were checked. 100% coverage with weak assertions proves nothing; use it to find untested areas, not as a score.</p>' }
      ],
      q: [
        { t: 'mc', q: 'Why should unit tests avoid the network and the database?', o: ['They must be fast and deterministic, so failures mean a real bug', 'Databases cannot be tested', 'It is a language requirement', 'To reduce disk usage'], a: 0, e: 'Flaky slow tests get skipped, and a skipped test protects nothing.' },
        { t: 'order', q: 'Order the TDD cycle.', plain: true, o: ['Write a failing test for the behaviour you want', 'Write the simplest code that passes it', 'Refactor while the tests stay green'], e: 'Red, green, refactor.' },
        { t: 'mc', q: 'A bug is reported and fixed. What should be added?', o: ['A regression test that fails before the fix and passes after', 'A comment describing the bug', 'A log statement', 'Nothing, the fix is enough'], a: 0, e: 'Otherwise the same bug returns during a later refactor.' },
        { t: 'mc', q: 'A codebase has 100% line coverage but bugs keep shipping. The most likely reason is:', o: ['Tests execute code without asserting meaningful behaviour', 'Coverage tools are inaccurate', 'There are too many tests', 'Unit tests are the wrong kind'], a: 0, e: 'Coverage is an execution metric, not a correctness one.' },
        { t: 'code', q: 'Write `total(prices, discount=0.0)`: sum the prices, apply the discount fraction, and raise ValueError on any negative price.', starter: 'def total(prices, discount=0.0):\n    pass\n', tests: 'assert total([]) == 0\nassert total([10, 10]) == 20\nassert abs(total([10, 10], discount=0.1) - 18) < 1e-9\ntry:\n    total([-5]); raise AssertionError("negative prices must raise ValueError")\nexcept ValueError:\n    pass\nprint("Tested.")', sol: 'def total(prices, discount=0.0):\n    if any(p < 0 for p in prices):\n        raise ValueError("negative price")\n    return sum(prices) * (1 - discount)', hint: 'Validate first with any(), then compute. Empty lists must still work.', e: 'Writing the function against given tests is exactly the TDD experience in reverse.' }
      ]
    },
    {
      id: 'se-clean', title: 'Clean code and refactoring', icon: '🧼', topics: ['Clean code', 'Refactoring', 'Documentation'],
      learn: [
        { h: 'Name things properly', p: '<p><code>days_until_expiry</code> beats <code>d</code>. Functions should do one thing and be named for what they return or change. If the name needs "and", it is two functions.</p><p>Comments explain <i>why</i>, never <i>what</i> — the code already says what. A comment that restates the line is one more thing to go stale.</p>' },
        { h: 'Smells worth acting on', p: '<ul><li>A function longer than a screen</li><li>More than three or four parameters (pass an object)</li><li>Deep nesting (use guard clauses)</li><li>Duplicated logic in three places</li><li>Flag arguments that change what a function does</li><li>Comments explaining a confusing block that could simply be extracted</li></ul>' },
        { h: 'Refactoring is behaviour-preserving', p: '<p>Change structure, not behaviour, with tests green the whole way. Standard moves: extract function, rename, inline variable, replace conditional with polymorphism, introduce parameter object. Do it in small steps and commit often; "refactor" that changes behaviour is just an undocumented rewrite.</p>' }
      ],
      q: [
        { t: 'mc', q: 'What should a comment explain?', o: ['Why the code does something non-obvious', 'What each line does', 'Who wrote it', 'The function signature'], a: 0, e: 'Why survives refactoring; what duplicates the code and rots.' },
        { t: 'mc', q: 'A function takes seven parameters. The usual fix is:', o: ['Group related ones into an object or dataclass', 'Add default values to all of them', 'Rename them', 'Split the file'], a: 0, e: 'Long parameter lists are easy to pass in the wrong order and hard to extend.' },
        { t: 'mc', q: 'What must stay the same during a refactor?', o: ['Observable behaviour', 'The number of lines', 'The file structure', 'The variable names'], a: 0, e: 'That is the definition, and why tests make refactoring safe.' },
        { t: 'fix', q: 'Which refactor most improves this?', code: 'def p(u, f):\n    if u:\n        if u.active:\n            if f > 0:\n                return u.balance - f\n    return None', o: ['Guard clauses plus meaningful names: charge(user, fee)', 'Add comments to each branch', 'Combine into one long condition', 'Convert it to a class'], a: 0, e: 'Early returns flatten the nesting and make the main path obvious.' },
        { t: 'tf', q: 'Duplicated code should always be extracted immediately on the second occurrence.', a: false, e: 'Two similar pieces sometimes diverge later. The common rule of three balances premature abstraction against real duplication.' }
      ]
    },
    {
      id: 'se-design', title: 'SOLID and design patterns', icon: '🏛️', topics: ['SOLID', 'Design patterns', 'Architecture'],
      learn: [
        { h: 'SOLID, briefly', p: '<ul><li><b>S</b>ingle responsibility — one reason to change</li><li><b>O</b>pen/closed — extend without modifying</li><li><b>L</b>iskov substitution — a subclass must work anywhere its parent does</li><li><b>I</b>nterface segregation — small focused interfaces</li><li><b>D</b>ependency inversion — depend on abstractions, not concrete classes</li></ul><p>Dependency inversion is the one with the biggest practical payoff: pass the database or HTTP client in, and the code becomes testable immediately.</p>' },
        { h: 'Patterns you will actually meet', p: '<pre>Strategy    swap an algorithm at run time (sorting keys, pricing rules)\nObserver    publish/subscribe; event listeners\nFactory     centralise object creation\nAdapter     make an incompatible interface fit\nRepository  hide data access behind a collection-like interface\nDecorator   wrap behaviour around an object (you met this in Python)</pre>' },
        { h: 'Patterns are vocabulary, not a goal', p: '<p>Recognise them when they fit; do not go looking for places to install them. A codebase with five patterns applied to a problem that needed a function is harder to read than the function. The architecture question that matters more day to day is: what depends on what, and can I change this piece without touching that one?</p>' }
      ],
      q: [
        { t: 'mc', q: 'A class fetches data, formats a report and emails it. Which principle does that violate?', o: ['Single responsibility', 'Liskov substitution', 'Interface segregation', 'Open/closed'], a: 0, e: 'Three reasons to change, so three places for an unrelated edit to break something.' },
        { t: 'mc', q: 'Passing a database client into a class rather than constructing one inside is an example of:', o: ['Dependency inversion (and injection)', 'The factory pattern', 'Interface segregation', 'Memoisation'], a: 0, e: 'It also makes the class testable with a fake, without patching globals.' },
        { t: 'match', q: 'Match each pattern to its purpose.', p: [['Strategy', 'Swap an algorithm at run time'], ['Observer', 'Notify subscribers when something changes'], ['Adapter', 'Make an incompatible interface usable'], ['Repository', 'Hide data access behind a simple interface']], e: 'Naming a pattern communicates intent quickly in review.' },
        { t: 'mc', q: 'A subclass overrides a method to throw NotImplementedError for an operation the parent supports. Which principle is broken?', o: ['Liskov substitution', 'Single responsibility', 'Open/closed', 'Dependency inversion'], a: 0, e: 'Code written against the parent breaks when handed the subclass, which is exactly what substitutability forbids.' },
        { t: 'tf', q: 'Using more design patterns generally makes a codebase better.', a: false, e: 'Patterns solve specific problems. Applied speculatively they add indirection with no benefit.' }
      ]
    },
    {
      id: 'se-ci', title: 'CI/CD, code review and collaboration', icon: '🚀', topics: ['CI/CD', 'Code review', 'Agile'],
      learn: [
        { h: 'Continuous integration', p: '<p>Every push runs the same checks: install, lint, type-check, test, build. Problems are found in minutes, by a machine, before review. The key discipline is merging small changes often rather than integrating a month of work at once.</p>', code: '# .github/workflows/ci.yml\non: [push, pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with: { python-version: "3.12" }\n      - run: pip install -r requirements.txt\n      - run: ruff check .\n      - run: pytest -q', lang: 'bash' },
        { h: 'Continuous delivery and deployment', p: '<p>Delivery: every green build is <i>releasable</i>. Deployment: it is released automatically. Safety comes from small changes, feature flags, staged rollouts, health checks and a fast rollback — not from deploying rarely, which makes each release bigger and riskier.</p>' },
        { h: 'Reviewing well', p: '<p>Review for correctness, clarity, tests and security; let a formatter handle style. Comment on the code, not the person, and say which remarks are blocking and which are suggestions. As an author, keep pull requests small and explain the why in the description. Standups, retrospectives and a visible backlog exist to surface blockers early, not to generate paperwork.</p>' }
      ],
      q: [
        { t: 'mc', q: 'What does continuous integration primarily prevent?', o: ['Large painful merges and late discovery of broken code', 'The need for tests', 'Production outages entirely', 'Code review'], a: 0, e: 'Small frequent merges plus automated checks find problems while they are cheap.' },
        { t: 'mc', q: 'Difference between continuous delivery and continuous deployment?', o: ['Delivery means every build is releasable; deployment means it is released automatically', 'They are the same', 'Delivery requires manual testing', 'Deployment only applies to mobile apps'], a: 0, e: 'One is readiness, the other is automation of the last step.' },
        { t: 'mc', q: 'Which comment belongs in a code review?', o: ['"This loop re-queries inside the iteration; can we fetch once outside?"', '"Your indentation is wrong"', '"This is bad"', '"I would have written it differently"'], a: 0, e: 'Specific, actionable, about the code. Formatting should be automated away.' },
        { t: 'mc', q: 'A deployment goes wrong in production. The most important capability is:', o: ['A fast, rehearsed rollback', 'A long post-mortem meeting', 'More manual testing next time', 'Deploying less often'], a: 0, e: 'Reducing time-to-recover beats trying to eliminate all failure, and deploying less often makes each release riskier.' },
        { t: 'fill', q: 'A switch that lets you turn a new feature on or off in production without redeploying is a feature ___.', a: ['flag', 'toggle', 'flags'], e: 'It separates deploying code from releasing behaviour.' }
      ]
    },
    {
      id: 'se-ops', title: 'Logging, monitoring and debugging in production', icon: '📟', topics: ['Monitoring', 'Logging', 'Observability'],
      learn: [
        { h: 'Three signals', p: '<p><b>Logs</b> — discrete events, ideally structured (JSON) with a request id so one user\'s journey can be followed. <b>Metrics</b> — numbers over time: request rate, error rate, latency percentiles, saturation. <b>Traces</b> — one request\'s path across services with timings.</p>' },
        { h: 'Alert on symptoms, not causes', p: '<p>Page a human for "checkout error rate above 2%" or "p99 latency above 2 s", not "CPU at 80%", which may be entirely normal. Every alert should be actionable and should say what to do. Alerts nobody acts on train people to ignore the ones that matter.</p>' },
        { h: 'Debugging what you cannot reproduce', p: '<ol><li>Establish what changed: a deploy, a config edit, traffic, a dependency.</li><li>Narrow the blast radius: all users or some? one endpoint or all?</li><li>Correlate the signals: does the error spike line up with a deploy or a queue backing up?</li><li>Mitigate first (roll back, scale, flag off), investigate second.</li></ol><p>Then write a blameless post-mortem: what happened, why it was possible, what change prevents it. The goal is a better system, not a culprit.</p>' }
      ],
      q: [
        { t: 'match', q: 'Match each signal to what it answers.', p: [['Logs', 'What exactly happened in this event'], ['Metrics', 'How is the system behaving over time'], ['Traces', 'Where did this request spend its time'], ['Alerts', 'Does a human need to act now']], e: 'Together they answer what, how much, where and when to care.' },
        { t: 'mc', q: 'Which is the better alert?', o: ['Checkout error rate above 2% for 5 minutes', 'CPU above 80%', 'A new deploy happened', 'Log volume increased'], a: 0, e: 'It describes user-visible harm. CPU load may be perfectly healthy.' },
        { t: 'mc', q: 'Production is broken and you have a hypothesis. What comes first?', o: ['Mitigate: roll back or disable the feature, then investigate', 'Find the root cause before touching anything', 'Write the post-mortem', 'Add more logging and wait'], a: 0, e: 'Stop the harm, then learn. Rolling back also tests the hypothesis.' },
        { t: 'fill', q: 'Attaching an identifier to every log line of one request so it can be followed across services is called a ___ id.', a: ['request', 'correlation', 'trace'], e: 'Without it, logs from concurrent requests are interleaved noise.' },
        { t: 'tf', q: 'A post-mortem should identify who caused the incident.', a: false, e: 'Blameless post-mortems look for the system conditions that allowed it, because blame hides information.' }
      ]
    }
  ]
});

CS.addStage({
  id: 's15', n: 15, title: 'Cybersecurity', short: 'Cybersecurity', track: 'systems', icon: '🛡️', pos: [290, 400], prereq: ['s11'],
  blurb: 'Defensive security: how authentication, encryption and secure coding work, and how to reason about threats. Concepts and defences, not attack recipes.',
  note: 'This stage is defensive. It explains how vulnerabilities arise so you can prevent them, and deliberately gives no step-by-step attack instructions. Only test systems you own or are authorised in writing to test.',
  nodes: [
    {
      id: 'sec-principles', title: 'Security principles and threat modelling', icon: '🧭', topics: ['Security principles', 'Threat modelling', 'Risk'],
      learn: [
        { h: 'The CIA triad', p: '<p><b>Confidentiality</b> — only authorised parties can read it. <b>Integrity</b> — it has not been altered undetectably. <b>Availability</b> — it is there when needed. Most controls trade against each other; encryption helps confidentiality and nothing for availability.</p>' },
        { h: 'Principles that do the heavy lifting', p: '<ul><li><b>Least privilege</b> — grant the minimum access, for the shortest time.</li><li><b>Defence in depth</b> — assume any one control will fail.</li><li><b>Fail securely</b> — an error should deny, not allow.</li><li><b>No security by obscurity</b> — assume the attacker has your source code; the secret is the key, not the design (Kerckhoffs\'s principle).</li><li><b>Secure by default</b> — the safe option should be the one you get without configuring anything.</li></ul>' },
        { h: 'Threat modelling in four questions', p: '<ol><li>What are we building? (a diagram of data flows and trust boundaries)</li><li>What can go wrong? (STRIDE: spoofing, tampering, repudiation, information disclosure, denial of service, elevation of privilege)</li><li>What will we do about it?</li><li>Did we do a good job?</li></ol><p>Doing this on a whiteboard before writing code catches design-level flaws that no scanner will ever find.</p>' }
      ],
      q: [
        { t: 'match', q: 'Match each goal to the property it protects.', p: [['Encrypting data in transit', 'Confidentiality'], ['Signing a message', 'Integrity'], ['Rate limiting and redundancy', 'Availability'], ['Role checks on every request', 'Authorisation']], e: 'Naming the property you are protecting clarifies whether a control actually helps.' },
        { t: 'mc', q: 'What does "least privilege" mean in practice?', o: ['Each account or service gets only the access it needs, for as long as it needs it', 'Only administrators have accounts', 'Users choose their own permissions', 'Everything is read-only'], a: 0, e: 'It limits the blast radius when, not if, something is compromised.' },
        { t: 'mc', q: 'A system\'s security depends on attackers not knowing how it works. This is:', o: ['Security by obscurity, which is not a control on its own', 'Defence in depth', 'Least privilege', 'Fail-secure design'], a: 0, e: 'Kerckhoffs\'s principle: assume the design is public; only keys should be secret.' },
        { t: 'mc', q: 'An authentication service errors out. Failing securely means:', o: ['Deny access', 'Allow access so users are not blocked', 'Log in as a guest admin', 'Retry indefinitely'], a: 0, e: 'Errors must not become a bypass. Availability is handled with redundancy, not by opening the door.' },
        { t: 'fill', q: 'The threat-modelling mnemonic covering spoofing, tampering, repudiation, information disclosure, denial of service and elevation of privilege is ___.', a: ['stride'], e: 'A checklist for "what can go wrong" per component.' }
      ]
    },
    {
      id: 'sec-crypto', title: 'Encryption, hashing and certificates', icon: '🔐', topics: ['Encryption', 'Hashing', 'Public key cryptography', 'Certificates'],
      learn: [
        { h: 'Encryption is reversible; hashing is not', p: '<p><b>Symmetric</b> (AES): one key encrypts and decrypts; fast, but both sides need the key. <b>Asymmetric</b> (RSA, elliptic curve): a public key encrypts and a private key decrypts, which solves key exchange and enables signatures. TLS uses asymmetric cryptography to agree a symmetric key, then uses that.</p>' },
        { h: 'Hashes and passwords', p: '<p>A cryptographic hash (SHA-256) is one-way and collision resistant: it verifies integrity. But it is <i>fast</i>, which is wrong for passwords — use a deliberately slow function (bcrypt, scrypt, argon2) with a unique per-user <b>salt</b>. Salting means identical passwords hash differently, defeating rainbow tables.</p><p>Passwords are hashed, never encrypted: you should never be able to recover them.</p>' },
        { h: 'Signatures and certificates', p: '<p>Signing with a private key lets anyone verify with the public key that a message is authentic and unaltered. A <b>certificate</b> binds a public key to a domain name and is signed by a certificate authority your system already trusts — that chain is what makes HTTPS meaningful.</p><p>Rule for practitioners: use vetted libraries and standard protocols. Implementing your own cryptography is how subtle, fatal bugs get shipped.</p>' }
      ],
      q: [
        { t: 'mc', q: 'Why are passwords hashed rather than encrypted?', o: ['They never need to be recovered, and a stolen key would expose all of them', 'Hashing is faster', 'Encryption is illegal for passwords', 'Hashes are shorter'], a: 0, e: 'Verification only needs a comparison of hashes.' },
        { t: 'mc', q: 'What does a salt accomplish?', o: ['Identical passwords produce different hashes, defeating precomputed tables', 'It makes hashing reversible', 'It encrypts the hash', 'It shortens the hash'], a: 0, e: 'It must be unique per user and is stored alongside the hash; it is not a secret.' },
        { t: 'mc', q: 'Why is SHA-256 a poor choice for storing passwords?', o: ['It is fast, so guesses can be tried at enormous rates', 'It is reversible', 'It produces collisions easily', 'It cannot be salted'], a: 0, e: 'Password hashing deliberately wants slowness and memory cost.' },
        { t: 'mc', q: 'What does a digital signature prove?', o: ['The message came from the holder of the private key and was not altered', 'The message is encrypted', 'The sender is trustworthy', 'The message is recent'], a: 0, e: 'Authenticity and integrity. Freshness needs a timestamp or nonce.' },
        { t: 'tf', q: 'Writing your own encryption algorithm is a reasonable way to improve security.', a: false, e: 'Use standard, reviewed implementations. Novel cryptography fails in ways that are not visible from the outside.' }
      ]
    },
    {
      id: 'sec-authz', title: 'Authentication and access control', icon: '🪪', topics: ['Authentication', 'Authorisation', 'MFA', 'Sessions'],
      learn: [
        { h: 'Factors and MFA', p: '<p>Something you know (password), have (phone, hardware key), or are (biometric). Multi-factor requires more than one <i>category</i>. Hardware security keys resist phishing because the browser checks the origin; SMS codes do not, and are vulnerable to SIM swapping.</p>' },
        { h: 'Access control models', p: '<pre>RBAC   permissions attached to roles, roles to users\nABAC   decisions from attributes (department, time, device)\nACL    per-object lists of who may do what</pre><p>Check authorisation on the server for every request, using the identity from the session — not an id supplied by the client. "Can this user act on this object?" is the question that <b>IDOR</b> bugs forget to ask.</p>' },
        { h: 'Session hygiene', p: '<p>Regenerate the session id on login (to prevent fixation), set cookies <code>HttpOnly; Secure; SameSite=Lax</code>, expire idle sessions, and invalidate all sessions on password change. Rate-limit and add delays on login attempts, and never reveal whether the username or the password was wrong.</p>' }
      ],
      q: [
        { t: 'mc', q: 'Which pair is genuine multi-factor authentication?', o: ['A password plus a hardware security key', 'A password plus a security question', 'Two passwords', 'A long password'], a: 0, e: 'Different categories: knowledge plus possession. Security questions are just more knowledge, and usually guessable.' },
        { t: 'mc', q: 'A URL is `/invoices/1042`. Changing it to 1043 shows another customer\'s invoice. This is:', o: ['A broken access control flaw (IDOR): ownership is never checked', 'An encryption failure', 'A caching bug', 'Expected REST behaviour'], a: 0, e: 'The fix is a server-side check that the session user owns the object, not obscuring the ids.' },
        { t: 'mc', q: 'Why regenerate the session id at login?', o: ['To prevent session fixation, where an attacker pre-sets a known id', 'To speed up the session lookup', 'To keep the user logged in longer', 'To avoid cookies'], a: 0, e: 'Any pre-authentication id becomes useless after the swap.' },
        { t: 'mc', q: 'A login form says "no account with that email". What is the problem?', o: ['It lets an attacker enumerate which accounts exist', 'It is too slow', 'It reveals the password policy', 'Nothing'], a: 0, e: 'Use one generic message for both cases, and keep response timing similar.' },
        { t: 'tf', q: 'Hiding an admin button from the UI is sufficient protection for an admin action.', a: false, e: 'The endpoint is still reachable. Authorisation must be enforced server-side on every request.' }
      ]
    },
    {
      id: 'sec-appsec', title: 'Secure coding and common vulnerability classes', icon: '🧯', topics: ['Secure coding', 'Injection', 'XSS', 'CSRF', 'Input validation'],
      learn: [
        { h: 'The root cause is almost always mixing data with code', p: '<p><b>SQL injection</b> happens when user input is concatenated into a query. The fix is parameterised queries, which send the query and the values separately so input can never become syntax. The same idea fixes command injection (pass an argument list, never a shell string) and template injection.</p>', code: '# safe: the driver never treats email as SQL\ncur.execute("SELECT id FROM users WHERE email = %s", (email,))\n\n# safe: no shell, arguments stay arguments\nsubprocess.run(["convert", user_path, out_path], check=True)' },
        { h: 'XSS and CSRF', p: '<p><b>XSS</b> is injecting script into a page. Defences: escape by context on output, prefer <code>textContent</code> to <code>innerHTML</code>, sanitise any HTML you must accept with a vetted library, and set a Content Security Policy.</p><p><b>CSRF</b> tricks a logged-in browser into submitting a request. Defences: anti-CSRF tokens, <code>SameSite</code> cookies, and never using GET for state changes.</p>' },
        { h: 'Validate in, encode out', p: '<p>Validate input against an allowlist of what is acceptable (type, length, range, format) as close to the boundary as possible; encode on output for the destination context (HTML, SQL, shell, JSON). Add: dependency scanning, no secrets in the repository, and error messages that never leak stack traces or queries to users.</p>' }
      ],
      q: [
        { t: 'mc', q: 'What actually prevents SQL injection?', o: ['Parameterised queries, so input is never parsed as SQL', 'Removing apostrophes from input', 'Encrypting the database', 'Using a NoSQL database'], a: 0, e: 'Blocklisting characters fails against encodings and edge cases; separation of code and data does not.' },
        { t: 'mc', q: 'Rendering user-submitted text with `innerHTML` risks:', o: ['Cross-site scripting, because the string is parsed as HTML', 'A syntax error', 'SQL injection', 'A memory leak'], a: 0, e: 'Use textContent, or sanitise with a maintained library if HTML really is required.' },
        { t: 'mc', q: 'Which defence targets CSRF specifically?', o: ['Anti-CSRF tokens and SameSite cookies', 'Hashing passwords', 'TLS', 'Input length limits'], a: 0, e: 'CSRF abuses the browser automatically attaching cookies; the token proves the request came from your own page.' },
        { t: 'mc', q: 'Best practice for validating input is:', o: ['Allowlist what is acceptable', 'Blocklist known bad patterns', 'Trust client-side validation', 'Escape only quotes'], a: 0, e: 'Define what is valid; attackers are more creative than any blocklist.' },
        { t: 'fix', q: 'Which change makes this safe?', code: 'query = "SELECT * FROM users WHERE name = \'" + name + "\'"\ncur.execute(query)', o: ['cur.execute("SELECT * FROM users WHERE name = %s", (name,))', 'Strip quotes from `name` first', 'Wrap it in try/except', 'Use uppercase SQL keywords'], a: 0, e: 'Parameters are sent separately from the statement, so no input can change its structure.' }
      ]
    },
    {
      id: 'sec-network', title: 'Network and infrastructure security', icon: '🧱', topics: ['Firewalls', 'VPNs', 'Network security', 'Hardening'],
      learn: [
        { h: 'Controlling the paths', p: '<p>A <b>firewall</b> allows or denies traffic by address, port and protocol; default-deny inbound is the baseline. <b>Segmentation</b> puts databases on private subnets so they are unreachable from the internet. A <b>VPN</b> or zero-trust proxy gives authenticated access to internal services without exposing them publicly.</p>' },
        { h: 'Hardening a server', p: '<ul><li>Expose the minimum: close unused ports, remove unused services</li><li>SSH with keys only, no password login, no direct root login</li><li>Automatic security updates; patch promptly</li><li>Separate low-privilege accounts per service</li><li>Central logging, so an attacker cannot simply erase local evidence</li><li>Tested backups, kept offline or immutable — ransomware targets backups first</li></ul>' },
        { h: 'Detection and response', p: '<p>Assume prevention will fail sometimes. Intrusion detection, anomaly alerts and log review shorten the time to notice. Have an incident plan: contain, eradicate, recover, review. Practise the restore, because an untested backup is a hypothesis, not a backup.</p>' }
      ],
      q: [
        { t: 'mc', q: 'What is the sensible default policy for inbound firewall rules?', o: ['Deny everything, then allow only what is needed', 'Allow everything, then block what looks bad', 'Allow all TCP, deny all UDP', 'Depends on the operating system'], a: 0, e: 'Default-deny means an unknown service is not accidentally exposed.' },
        { t: 'mc', q: 'Why disable SSH password authentication in favour of keys?', o: ['Keys are far stronger than typed passwords and resist brute forcing', 'Passwords are slower to type', 'Keys are shorter', 'It is required by TLS'], a: 0, e: 'Internet-facing SSH sees constant automated password guessing.' },
        { t: 'mc', q: 'Why keep a database on a private subnet?', o: ['It is unreachable from the internet, so only application servers can reach it', 'It runs faster', 'It avoids the need for passwords', 'It encrypts the data automatically'], a: 0, e: 'Segmentation limits what an attacker can reach after a foothold.' },
        { t: 'mc', q: 'A backup exists but has never been restored. It is best described as:', o: ['Unverified: untested backups regularly fail when needed', 'Sufficient', 'Better than an offline copy', 'Only useful for ransomware'], a: 0, e: 'Test restores on a schedule. Also keep a copy that live credentials cannot delete.' },
        { t: 'tf', q: 'Once an intrusion is detected, the first priority is finding who did it.', a: false, e: 'Contain and eradicate first, then investigate. Attribution rarely changes the immediate response.' }
      ]
    },
    {
      id: 'sec-people', title: 'Social engineering, privacy and ethics', icon: '🎭', topics: ['Social engineering', 'Phishing', 'Privacy', 'Ethics'],
      learn: [
        { h: 'People are targeted more than software', p: '<p>Phishing, pretexting (a convincing false identity), baiting and urgency exploit helpfulness and haste, not bugs. Organisational defences: verify unusual requests through a second channel, make it safe to report mistakes, enforce phishing-resistant MFA, and keep approval processes for payments and credential resets.</p>' },
        { h: 'Privacy by design', p: '<p>Collect the minimum data, state the purpose, keep it only as long as needed, and delete it on request. Regulations (GDPR, CCPA) formalise those ideas. Pseudonymisation helps, but combining "anonymous" datasets frequently re-identifies people — anonymity is harder than it looks.</p>' },
        { h: 'Ethics and the law', p: '<p>Testing systems you do not own, without written authorisation, is a crime in most jurisdictions regardless of intent. Legitimate routes exist: your own lab, CTF competitions, bug bounty programmes with a defined scope, and professional engagements with a signed agreement. Responsible disclosure means reporting privately and giving time to fix before publishing.</p><p>Security skills carry real responsibility; the defining professional habit is asking whether you are authorised before asking whether you are able.</p>' }
      ],
      q: [
        { t: 'mc', q: 'An urgent message from the "CEO" asks you to buy gift cards immediately. The correct response is:', o: ['Verify through a known separate channel before acting', 'Comply quickly to avoid delay', 'Reply asking for confirmation in the same thread', 'Forward it to the whole team'], a: 0, e: 'Urgency plus an unusual request is the signature of business email compromise. The reply channel may be controlled by the attacker.' },
        { t: 'mc', q: 'What does data minimisation mean?', o: ['Collect only the data you actually need, and keep it only as long as needed', 'Compress stored data', 'Store data in one place', 'Anonymise everything automatically'], a: 0, e: 'Data you never collected cannot be breached, subpoenaed or leaked.' },
        { t: 'mc', q: 'You find a vulnerability in a company\'s public website. The responsible action is:', o: ['Report it privately through their security contact or bug bounty and allow time to fix', 'Publish the details immediately', 'Test how far you can get', 'Sell it'], a: 0, e: 'Coordinated disclosure. Further testing without authorisation exceeds what is legal, even with good intentions.' },
        { t: 'tf', q: 'Scanning or testing a system you do not own is fine if you intend no harm.', a: false, e: 'Authorisation, in writing, is what makes testing lawful. Use labs, CTFs and scoped bug bounty programmes.' },
        { t: 'short', q: 'Why is "anonymised" data often not truly anonymous?', a: [['combin', 'link', 'join', 'cross', 'other data', 'auxiliary', 'multiple'], ['identif', 're-identif', 'unique', 'trace']], model: 'Combining it with other datasets can re-identify individuals, because a few quasi-identifiers are often unique to one person.', e: 'Postcode, birth date and gender alone identify a large share of people.' }
      ]
    }
  ]
});
