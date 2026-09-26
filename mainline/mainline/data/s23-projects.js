/* Stage 23: the project tree. Beginner, intermediate and advanced builds, plus capstone specializations. */
CS.addStage({
  id: 's23', n: 23, title: 'Master projects', short: 'Projects', track: 'projects', icon: '🏗️', pos: [950, 400], prereq: [],
  blurb: 'Twenty-one builds from a calculator to a compiler, then a capstone chosen for the field you want to work in. Knowledge becomes skill here.',
  nodes: []
});

CS.addProjects([
  {
    id: 'pr-calculator', title: 'Calculator', icon: '🧮', tier: 'beginner', time: '2-4 hours',
    summary: 'A calculator that parses and evaluates expressions, not just a row of buttons.',
    skills: ['Functions', 'Parsing', 'Error handling', 'Testing'],
    related: ['s2-functions', 'py-errors', 'ds-stackqueue'],
    brief: '<p>Start with the four operations on two numbers, then push further: handle a whole typed expression such as <code>3 + 4 * (2 - 1)</code>. That means respecting precedence and brackets, which is your first taste of parsing.</p><p>The interesting work is in the failure cases: division by zero, unmatched brackets, letters where a number should be. A calculator that crashes on bad input is not finished.</p>',
    starter: 'def evaluate(expression: str) -> float:\n    """Evaluate an arithmetic expression with + - * / and brackets."""\n    tokens = tokenize(expression)\n    value, rest = parse_expression(tokens)\n    if rest:\n        raise ValueError(f"unexpected input: {rest[0]}")\n    return value\n',
    lang: 'python',
    steps: [
      { t: 'Two-number operations', d: 'Functions for add, subtract, multiply and divide. Write tests for each, including divide by zero raising a clear error.' },
      { t: 'A command-line loop', d: 'Read input, compute, print, repeat, with a way to quit. Keep the loop separate from the maths so both can be tested.' },
      { t: 'Tokenise an expression', d: 'Turn "3 + 4*2" into a list of numbers and operators. Handle whitespace, decimals and negative numbers.' },
      { t: 'Respect precedence', d: 'Evaluate multiplication and division before addition and subtraction. Either recursive descent or the shunting-yard algorithm with two stacks.' },
      { t: 'Brackets', d: 'Support nesting to any depth, and report unmatched brackets with the position where the problem was found.' },
      { t: 'Harden the input handling', d: 'Every malformed input should produce a helpful message, never a traceback. Add a test for each kind of bad input you can think of.' }
    ],
    accept: [
      '`3 + 4 * 2` returns 11, not 14',
      'Nested brackets evaluate correctly to at least three levels',
      'Bad input (letters, `5 +`, `((1)`, `1/0`) gives a clear message and the program keeps running',
      'A test suite covers precedence, brackets and every error case'
    ],
    stretch: ['Add `%`, `**`, and unary minus', 'Support variables: `x = 5` then `x * 3`', 'Add a small HTML front end and run the same logic in the browser']
  },
  {
    id: 'pr-quiz', title: 'Quiz game', icon: '❓', tier: 'beginner', time: '3-5 hours',
    summary: 'A terminal quiz with a question bank, scoring, and results saved between runs.',
    skills: ['Data structures', 'File I/O', 'JSON', 'Randomisation'],
    related: ['py-dicts', 'py-files', 'py-control'],
    brief: '<p>Separating data from code is the lesson here. Questions live in a JSON file; the program only knows how to read that file, ask, score and save. Adding a hundred questions should require no code change at all.</p><p>Once it works, add categories and a high-score table so returning users see their history.</p>',
    steps: [
      { t: 'Design the question format', d: 'Decide the JSON shape: prompt, options, correct answer, category, and an explanation. Write five questions by hand.' },
      { t: 'Load and validate', d: 'Read the file, and fail with a clear message if a question is missing a field or the answer index is out of range.' },
      { t: 'Ask and score', d: 'Shuffle the questions and the options. Accept an answer, tell the user whether it was right, and show the explanation.' },
      { t: 'Results screen', d: 'Show score, percentage, and which questions were missed so the user can learn from them.' },
      { t: 'Persistence', d: 'Save each run to a scores file: date, category, score. Show the best previous result at the start.' },
      { t: 'Categories and length', d: 'Let the player choose a category and how many questions to answer, with sensible defaults.' }
    ],
    accept: [
      'Adding a question to the JSON file changes the quiz with no code edits',
      'Options are shuffled, so the answer is not always in the same position',
      'Scores persist across runs and survive a missing or empty scores file',
      'Invalid input at any prompt re-asks instead of crashing'
    ],
    stretch: ['A timer per question with bonus points for speed', 'Track which questions you get wrong most and ask them more often', 'Export a results summary as CSV']
  },
  {
    id: 'pr-todo', title: 'To-do list app', icon: '✅', tier: 'beginner', time: '4-6 hours',
    summary: 'Full create, read, update and delete over persistent storage, with a real command-line interface.',
    skills: ['CRUD', 'Persistence', 'CLI design', 'Data modelling'],
    related: ['py-files', 'py-modules', 'py-errors'],
    brief: '<p>The smallest complete application: it stores state, changes it, and survives a restart. Every larger system you build is this with more layers.</p><p>Use <code>argparse</code> so the tool behaves like a real command (<code>todo add "buy milk" --due friday</code>) and gets <code>--help</code> for free.</p>',
    starter: 'import argparse, json, pathlib\n\nDATA = pathlib.Path.home() / ".todo.json"\n\ndef load():\n    if not DATA.exists():\n        return []\n    return json.loads(DATA.read_text(encoding="utf-8"))\n\ndef save(items):\n    DATA.write_text(json.dumps(items, indent=2), encoding="utf-8")\n',
    lang: 'python',
    steps: [
      { t: 'Model a task', d: 'Decide the fields: id, title, done, created, optional due date and priority. Keep them in one place.' },
      { t: 'Add and list', d: 'Add a task and list tasks with stable ids. Handle the first run when no data file exists yet.' },
      { t: 'Complete and delete', d: 'Mark done and remove by id, with a clear error when the id does not exist.' },
      { t: 'Persist safely', d: 'Write to a temporary file and rename, so an interrupted write cannot corrupt the list.' },
      { t: 'Filter and sort', d: 'Show only open tasks by default; allow sorting by due date or priority and filtering by keyword.' },
      { t: 'Proper CLI', d: 'Use argparse subcommands so `todo add`, `todo list`, `todo done 3` all work, with help text.' }
    ],
    accept: [
      'Tasks survive closing and reopening the program',
      'Every subcommand has help text and validates its arguments',
      'Deleting or completing an unknown id gives a clear message, not a traceback',
      'A corrupted or empty data file is reported rather than crashing the tool'
    ],
    stretch: ['Recurring tasks', 'Tags and a `--tag` filter', 'Wrap the same core logic in a small web interface and reuse it unchanged']
  },
  {
    id: 'pr-guess', title: 'Number guessing game', icon: '🎯', tier: 'beginner', time: '1-2 hours',
    summary: 'A guessing game in both directions: you guess, then the computer guesses using binary search.',
    skills: ['Loops', 'Input validation', 'Binary search'],
    related: ['s2-control', 'al-search'],
    brief: '<p>Small, but it contains a real algorithmic idea. In part two the computer guesses <i>your</i> number by halving the range each time — binary search, felt rather than read.</p><p>A number between 1 and 1,000,000 should take at most twenty guesses. Watching that happen makes logarithmic growth concrete.</p>',
    steps: [
      { t: 'Player guesses', d: 'Pick a random number, loop until correct, and respond higher or lower. Count the attempts.' },
      { t: 'Validate input', d: 'Non-numbers and out-of-range guesses should re-prompt without consuming an attempt.' },
      { t: 'Difficulty levels', d: 'Ranges and attempt limits per difficulty, with a lose condition when attempts run out.' },
      { t: 'Computer guesses', d: 'Reverse the roles. The computer guesses and you answer higher, lower or correct; it must always halve the remaining range.' },
      { t: 'Catch contradictions', d: 'If the answers are inconsistent (the range collapses to nothing), say so rather than looping forever.' },
      { t: 'Report the maths', d: 'After each game, print the number of guesses used and the theoretical maximum, log2(range).' }
    ],
    accept: [
      'The computer never needs more than ceil(log2(range)) + 1 guesses',
      'Invalid input never crashes the game or wastes an attempt',
      'Contradictory answers are detected and reported',
      'Both game modes are selectable from one menu'
    ],
    stretch: ['Track a best-score table per difficulty', 'Add a two-player mode', 'Visualise the shrinking range as a bar after each guess']
  },

  {
    id: 'pr-discordbot', title: 'Discord bot', icon: '🤖', tier: 'intermediate', time: '6-10 hours',
    summary: 'An event-driven bot with commands, persistent data and safe secret handling.',
    skills: ['APIs', 'Async', 'Event handling', 'Secrets management'],
    related: ['py-async', 'py-errors', 'web-auth'],
    brief: '<p>Your first event-driven program: the bot waits for events and reacts, rather than running top to bottom. It is also your first time handling a live credential, which must never touch the repository.</p><p>Build a few commands that do something real — a poll, a reminder, a lookup against an API — plus per-server settings stored on disk or in SQLite.</p>',
    starter: 'import os, discord\nfrom discord.ext import commands\n\nbot = commands.Bot(command_prefix="!", intents=discord.Intents.default())\n\n@bot.command()\nasync def ping(ctx):\n    await ctx.send(f"pong ({round(bot.latency * 1000)} ms)")\n\nbot.run(os.environ["DISCORD_TOKEN"])   # never hard-code the token\n',
    lang: 'python',
    steps: [
      { t: 'Register and connect', d: 'Create the application, set intents, and get the bot online. Read the token from an environment variable, and add .env to .gitignore.' },
      { t: 'First commands', d: 'Implement ping and help. Confirm you understand which intents each feature requires.' },
      { t: 'Something useful', d: 'Pick a real feature: polls with reactions, a reminder scheduler, or a lookup against a public API.' },
      { t: 'Persistence', d: 'Store per-server settings and any user data in SQLite or JSON, keyed by guild id.' },
      { t: 'Errors and limits', d: 'Handle API failures, rate limits and permission errors. The bot must never crash on a bad command.' },
      { t: 'Deploy and keep it running', d: 'Run it on a small host with restart-on-failure, and log to a file you can read later.' }
    ],
    accept: [
      'The token is loaded from the environment and appears nowhere in the repository',
      'Commands handle missing arguments and insufficient permissions gracefully',
      'Settings persist across restarts, separately per server',
      'The bot stays online unattended for at least 24 hours'
    ],
    stretch: ['Slash commands with autocomplete', 'A small dashboard showing usage stats', 'Per-user rate limiting to prevent spam']
  },
  {
    id: 'pr-scraper', title: 'Web scraper', icon: '🕷️', tier: 'intermediate', time: '5-8 hours',
    summary: 'Fetch, parse and store structured data from a site, politely and reliably.',
    skills: ['HTTP', 'HTML parsing', 'Data cleaning', 'Ethics'],
    related: ['net-web', 'py-files', 'ds-pandas'],
    brief: '<p>Scraping teaches HTTP, HTML structure and the reality that real-world data is messy. It also teaches restraint: check <code>robots.txt</code> and the terms of service, identify your client honestly, and rate-limit yourself. Prefer an official API whenever one exists.</p><p>Choose a target you are allowed to scrape — your own site, a public dataset page, or a site that explicitly permits it.</p>',
    starter: 'import time, requests\nfrom bs4 import BeautifulSoup\n\nHEADERS = {"User-Agent": "learning-scraper/1.0 (contact: you@example.com)"}\n\ndef fetch(url, session):\n    res = session.get(url, headers=HEADERS, timeout=10)\n    res.raise_for_status()\n    time.sleep(1)          # be polite\n    return BeautifulSoup(res.text, "html.parser")\n',
    lang: 'python',
    steps: [
      { t: 'Check permission', d: 'Read robots.txt and the terms. Write down what you may fetch and how often, and honour it.' },
      { t: 'Fetch one page reliably', d: 'Use a session, a real user agent, timeouts and raise_for_status. Handle non-200 responses explicitly.' },
      { t: 'Extract fields', d: 'Select the elements you need with CSS selectors. Expect missing fields and handle them without crashing.' },
      { t: 'Paginate', d: 'Follow next-page links with a delay between requests and a hard limit on total pages.' },
      { t: 'Clean and store', d: 'Normalise types, strip whitespace, deduplicate, and write to CSV or SQLite with a stable key.' },
      { t: 'Make it re-runnable', d: 'Cache fetched pages, log what was scraped, and make a second run update rather than duplicate.' }
    ],
    accept: [
      'robots.txt and terms were checked and are respected, with a delay between requests',
      'A missing or changed field logs a warning instead of crashing the run',
      'Re-running updates existing records rather than creating duplicates',
      'Output is clean, typed and directly usable in pandas or a spreadsheet'
    ],
    stretch: ['Detect layout changes and alert instead of silently collecting nothing', 'Schedule daily runs and track changes over time', 'Add a small dashboard over the collected data']
  },
  {
    id: 'pr-weather', title: 'Weather app', icon: '🌦️', tier: 'intermediate', time: '5-8 hours',
    summary: 'Consume a public API and present it well, with caching and graceful failure.',
    skills: ['REST APIs', 'JSON', 'Caching', 'Frontend'],
    related: ['web-async', 'web-css', 'net-web'],
    brief: '<p>A clean lesson in consuming someone else\'s API: read the docs, handle the response shapes, respect rate limits, and never ship the key in client-side code.</p><p>Build both a search by city and a current-location view, and make the offline and error states as considered as the happy path.</p>',
    steps: [
      { t: 'Choose an API and read the docs', d: 'Note the rate limits, required parameters, units and error responses before writing code.' },
      { t: 'Fetch and model', d: 'Request current conditions for one city and map the response into your own small data structure, so a provider change touches one function.' },
      { t: 'Build the interface', d: 'Current conditions plus a multi-day forecast, responsive from phone width upward.' },
      { t: 'Search and geolocation', d: 'City search with sensible handling of no results, plus the browser geolocation API with a permission-denied fallback.' },
      { t: 'Cache', d: 'Store the last successful response with a timestamp; reuse it within a few minutes and show it when the network fails.' },
      { t: 'Handle every failure', d: 'Loading, empty, error and offline states. Never leave the user staring at a blank panel.' }
    ],
    accept: [
      'Works from a phone width to a desktop without horizontal scrolling',
      'Repeated searches within the cache window make no extra network requests',
      'Network failure shows cached data or a clear message, never a blank screen',
      'No API key is exposed in client-side source if the provider requires one to be secret'
    ],
    stretch: ['Save favourite cities to local storage', 'Add a temperature chart for the coming days', 'A severe weather banner driven by alert data']
  },
  {
    id: 'pr-dbapp', title: 'Database application', icon: '🗄️', tier: 'intermediate', time: '8-12 hours',
    summary: 'A real schema with relationships, queries, migrations and a usable interface over it.',
    skills: ['SQL', 'Schema design', 'Transactions', 'Migrations'],
    related: ['db-model', 'db-join', 'db-perf'],
    brief: '<p>Pick a domain you understand — a library, a gym, a small shop, a game collection — and model it properly: at least three related tables, one of them many-to-many.</p><p>Write the queries that answer real questions, then put an interface on top. The point is the data model and the queries, not the buttons.</p>',
    starter: 'CREATE TABLE members (\n    id         INTEGER PRIMARY KEY,\n    name       TEXT NOT NULL,\n    joined     DATE NOT NULL DEFAULT CURRENT_DATE\n);\n\nCREATE TABLE loans (\n    id        INTEGER PRIMARY KEY,\n    member_id INTEGER NOT NULL REFERENCES members(id),\n    book_id   INTEGER NOT NULL REFERENCES books(id),\n    taken     DATE NOT NULL,\n    returned  DATE\n);\nCREATE INDEX idx_loans_member ON loans(member_id);\n',
    lang: 'sql',
    steps: [
      { t: 'Model the domain', d: 'Draw the entities and relationships first. Identify the many-to-many pair and design its join table.' },
      { t: 'Create the schema', d: 'Primary and foreign keys, NOT NULL, CHECK and UNIQUE constraints. Let the database enforce the rules.' },
      { t: 'Seed realistic data', d: 'A few hundred rows, including awkward cases: missing optional fields, duplicates you must reject, long names.' },
      { t: 'Write the queries', d: 'At least five that answer real questions, including a join with aggregation and an anti-join for missing records.' },
      { t: 'Transactions', d: 'Any operation touching two tables must commit or roll back as a unit. Demonstrate a rollback working.' },
      { t: 'Interface and migrations', d: 'Add a CLI or small web interface, and a numbered migration file for every schema change.' }
    ],
    accept: [
      'The schema includes a working many-to-many relationship',
      'Invalid data is rejected by the database, not only by the application',
      'A multi-table operation rolls back cleanly when part of it fails',
      'Every query uses parameters, never string concatenation'
    ],
    stretch: ['Add EXPLAIN output and index the queries that need it', 'Soft deletes with an audit trail', 'A weekly summary report generated from the data']
  },
  {
    id: 'pr-restapi', title: 'REST API', icon: '🔌', tier: 'intermediate', time: '10-15 hours',
    summary: 'A documented, tested, authenticated API over a real database.',
    skills: ['HTTP', 'Validation', 'Auth', 'Testing', 'Documentation'],
    related: ['web-backend', 'web-auth', 'se-testing'],
    brief: '<p>The backbone of most professional backend work. Build full CRUD over a resource, with validation at the boundary, authentication, pagination, consistent errors and automated tests.</p><p>FastAPI gives you an OpenAPI document for free; that document is part of the deliverable, not an afterthought.</p>',
    starter: 'from fastapi import FastAPI, Depends, HTTPException, Query\nfrom pydantic import BaseModel, Field\n\napp = FastAPI(title="Notes API", version="1.0.0")\n\nclass NoteIn(BaseModel):\n    title: str = Field(min_length=1, max_length=120)\n    body: str = ""\n\nclass Note(NoteIn):\n    id: int\n\n@app.get("/notes", response_model=list[Note])\ndef list_notes(limit: int = Query(20, le=100), offset: int = 0):\n    ...\n',
    lang: 'python',
    steps: [
      { t: 'Design the resources', d: 'URLs, methods and status codes for every operation, written down before any code.' },
      { t: 'CRUD with validation', d: 'Request and response models with types and limits. Reject invalid bodies with 422 and a useful message.' },
      { t: 'Persist properly', d: 'Back it with a real database and parameterised queries or an ORM, with migrations.' },
      { t: 'Authentication and authorisation', d: 'Token-based auth, plus an ownership check on every resource so users cannot read each other\'s data.' },
      { t: 'Pagination, filtering, errors', d: 'Limit and offset with a maximum, filter parameters, and one consistent error shape across every endpoint.' },
      { t: 'Test and document', d: 'Automated tests for the happy path, validation failures and auth failures. Publish the OpenAPI docs.' }
    ],
    accept: [
      'Every endpoint returns the correct status code, including 201, 204, 401, 404 and 422',
      'Changing an id in the URL cannot expose another user\'s data',
      'Tests cover success, validation failure and unauthorised access',
      'Interactive API documentation is generated and accurate'
    ],
    stretch: ['Rate limiting per API key', 'Versioning with /v1 and a deprecation policy', 'Deploy behind HTTPS with health checks and structured logs']
  },
  {
    id: 'pr-site', title: 'Personal website', icon: '🪪', tier: 'intermediate', time: '6-10 hours',
    summary: 'A fast, accessible, deployed site that presents your work properly.',
    skills: ['HTML', 'CSS', 'Accessibility', 'Performance', 'Deployment'],
    related: ['web-html', 'web-css', 'se-git'],
    brief: '<p>Your portfolio is itself a portfolio piece: if it is slow, inaccessible or broken on a phone, that is the first thing a reader learns about your work.</p><p>Aim for semantic HTML, a deliberate type and colour system, sub-second loads, and a case study for each project explaining the problem, the approach and the result.</p>',
    steps: [
      { t: 'Decide the content', d: 'Who it is for and what you want them to do. Write the words before designing anything.' },
      { t: 'Semantic structure', d: 'Landmarks, one h1 per page, labelled links, alt text. It should be fully usable with the keyboard alone.' },
      { t: 'Design system', d: 'Choose type, spacing and colour tokens in CSS variables and apply them consistently. Support light and dark.' },
      { t: 'Project case studies', d: 'For each project: the problem, your approach, a screenshot or demo, what you would change next time.' },
      { t: 'Performance', d: 'Compress images, serve modern formats, avoid unnecessary scripts and fonts. Measure with Lighthouse.' },
      { t: 'Deploy with a real domain', d: 'Publish to GitHub Pages or similar with HTTPS, a custom domain if you have one, and a working contact route.' }
    ],
    accept: [
      'Lighthouse accessibility and performance scores above 90 on mobile',
      'Every interactive element is reachable and operable by keyboard',
      'The site loads and renders correctly with JavaScript disabled',
      'Each project links to source or a live demo'
    ],
    stretch: ['Add a blog with an RSS feed', 'A print stylesheet that produces a clean CV', 'Automate deploys with a CI workflow on every push']
  }
]);

/* Advanced tier: systems-scale builds. */
CS.addProjects([
  {
    id: 'pr-saas', title: 'Full-stack SaaS app', icon: '💼', tier: 'advanced', time: '40-80 hours',
    summary: 'Multi-user product with accounts, billing-ready plans, background jobs and real deployment.',
    skills: ['Full stack', 'Auth', 'Databases', 'Deployment', 'Monitoring'],
    related: ['web-backend', 'web-auth', 'db-design', 'se-ci'],
    brief: '<p>Everything you have learned, assembled: a front end, an API, a database, authentication, background work and an operational story. The hard parts are not features — they are multi-tenancy (user A must never see user B\'s data), migrations on live data, and knowing when something breaks.</p><p>Pick a narrow product you would actually use. Narrow and finished beats broad and abandoned.</p>',
    steps: [
      { t: 'Define one job the product does', d: 'One sentence. Write the three screens it needs and nothing more.' },
      { t: 'Schema with tenancy', d: 'Every row that belongs to a user carries an owner. Decide how that is enforced in one place rather than in every query.' },
      { t: 'Accounts and sessions', d: 'Sign-up, login, logout, password reset, email verification. Hash with argon2 or bcrypt; secure cookie flags.' },
      { t: 'Core feature end to end', d: 'One complete flow from UI through API to database and back, with validation at the boundary.' },
      { t: 'Plans and limits', d: 'Free and paid tiers enforced server-side: usage counters, quota checks, clear upgrade messaging. Integrate a payment provider in test mode.' },
      { t: 'Background jobs', d: 'A queue for email, exports or scheduled work, with retries and a dead-letter path for repeated failures.' },
      { t: 'Deploy and observe', d: 'CI running tests, migrations on deploy, structured logs, error tracking, uptime checks and tested backups.' }
    ],
    accept: [
      'A user cannot reach another user\'s data by changing an id, in any endpoint',
      'Tests cover authentication, authorisation and the core flow',
      'A deploy runs migrations and can be rolled back',
      'You are alerted when the error rate rises, before a user tells you'
    ],
    stretch: ['Team accounts with roles and invitations', 'Usage analytics dashboard for the owner', 'Feature flags for staged rollout']
  },
  {
    id: 'pr-chatbot', title: 'AI chatbot with RAG', icon: '💬', tier: 'advanced', time: '20-40 hours',
    summary: 'A grounded assistant over your own documents, with citations, evaluation and cost control.',
    skills: ['LLMs', 'Embeddings', 'Vector search', 'Evaluation'],
    related: ['ai-rag', 'ai-prompt', 'ai-prod'],
    brief: '<p>Anyone can call a chat API. The engineering is in retrieval quality, citations, refusing to answer when the documents do not contain the answer, and proving with an evaluation set that a change made things better.</p><p>Use a corpus you know well, so you can judge the answers yourself.</p>',
    starter: 'def answer(question: str) -> dict:\n    chunks = retrieve(question, k=8)\n    chunks = rerank(question, chunks)[:4]\n    if not chunks:\n        return {"answer": "I could not find this in the documents.", "sources": []}\n    prompt = build_prompt(question, chunks)   # instruct: answer only from context, cite ids\n    reply = call_model(prompt, temperature=0)\n    return {"answer": reply, "sources": [c.id for c in chunks]}\n',
    lang: 'python',
    steps: [
      { t: 'Ingest a corpus', d: 'Chunk with overlap, keep metadata (source, section, position), embed and index. Make re-ingestion idempotent.' },
      { t: 'Retrieve and rerank', d: 'Hybrid keyword plus vector search, then rerank the top candidates. Log what was retrieved for every query.' },
      { t: 'Ground the generation', d: 'Instruct the model to answer only from the supplied context, cite chunk ids, and say so when the answer is absent.' },
      { t: 'Conversation state', d: 'Keep history within the context budget by summarising older turns, and rewrite follow-up questions to be self-contained before retrieving.' },
      { t: 'Build an evaluation set', d: 'Thirty or more real questions with expected sources. Score retrieval hit rate and answer correctness on every change.' },
      { t: 'Guardrails and cost', d: 'Treat retrieved text as data, not instructions. Cap tokens, cache repeats, stream responses, and track cost per conversation.' },
      { t: 'Ship it', d: 'A usable interface with visible citations the reader can open, plus logging of questions that failed to retrieve anything.' }
    ],
    accept: [
      'Every answer cites sources the user can open and verify',
      'Questions outside the corpus get an honest "not in these documents" rather than an invention',
      'The evaluation suite runs on demand and reports retrieval and answer scores',
      'Injected instructions inside a document cannot change the system\'s behaviour'
    ],
    stretch: ['Add tool calling for live data such as a database lookup', 'Per-user document collections with access control', 'A feedback button that adds failures to the evaluation set']
  },
  {
    id: 'pr-recommender', title: 'Recommendation system', icon: '🎬', tier: 'advanced', time: '20-30 hours',
    summary: 'Collaborative and content-based recommendations, evaluated on ranking metrics that reflect reality.',
    skills: ['Machine learning', 'Matrix factorisation', 'Evaluation', 'Cold start'],
    related: ['ml-unsup', 'ml-eval', 'ds-pandas'],
    brief: '<p>Build on a public ratings dataset. Start with a popularity baseline, because beating it honestly is harder than it sounds, then add content-based similarity and collaborative filtering.</p><p>Evaluate by ranking, not by RMSE alone: precision@k and NDCG reflect what a user actually sees. Watch for a feedback loop where popular items get recommended and therefore become more popular.</p>',
    steps: [
      { t: 'Explore the data', d: 'Rating distribution, sparsity, long tail, per-user and per-item counts. Decide on a minimum-interactions filter.' },
      { t: 'Baselines', d: 'Global popularity and per-user mean. Everything later must beat these on the same split.' },
      { t: 'Content-based model', d: 'Item feature vectors and cosine similarity. This is also your cold-start answer for new items.' },
      { t: 'Collaborative filtering', d: 'Item-item similarity or matrix factorisation with regularisation, tuned on a validation split.' },
      { t: 'Ranking evaluation', d: 'Time-aware split, then precision@k, recall@k and NDCG. Also measure catalogue coverage and diversity.' },
      { t: 'Hybrid and cold start', d: 'Blend the models, falling back to content or popularity for new users and items.' },
      { t: 'Serve it', d: 'An API or interface returning top-N with a reason ("because you liked X"), fast enough to use.' }
    ],
    accept: [
      'The hybrid beats the popularity baseline on precision@10 with a time-aware split',
      'New users and new items receive sensible recommendations',
      'Coverage and diversity are reported, not just accuracy',
      'Each recommendation can be explained in one line'
    ],
    stretch: ['Implicit feedback (views, dwell time) instead of ratings only', 'An A/B test harness for two ranking strategies', 'Diversity re-ranking to break the popularity loop']
  },
  {
    id: 'pr-search', title: 'Search engine', icon: '🔎', tier: 'advanced', time: '25-40 hours',
    summary: 'Crawler, inverted index, ranking and a query interface, built from first principles.',
    skills: ['Indexing', 'Tokenisation', 'Ranking', 'Data structures'],
    related: ['ds-hash', 'ds-tries', 'adv-info'],
    brief: '<p>Build the machinery yourself: a polite crawler, a tokeniser, an inverted index (term → posting list), and a ranking function. TF-IDF first, then BM25.</p><p>The interesting problems arrive at scale: index size, phrase queries, updating without rebuilding everything, and making a result page feel instant.</p>',
    starter: 'from collections import defaultdict\n\nindex = defaultdict(list)     # term -> [(doc_id, term_frequency, positions)]\n\ndef add_document(doc_id, text):\n    for position, term in enumerate(tokenize(text)):\n        postings = index[term]\n        if postings and postings[-1][0] == doc_id:\n            postings[-1][1] += 1\n            postings[-1][2].append(position)\n        else:\n            postings.append([doc_id, 1, [position]])\n',
    lang: 'python',
    steps: [
      { t: 'Crawl a corpus', d: 'Respect robots.txt, rate-limit, deduplicate URLs, and store raw documents with their source.' },
      { t: 'Tokenise and normalise', d: 'Lowercase, strip punctuation, remove stop words, and stem. Keep positions for later phrase support.' },
      { t: 'Build the inverted index', d: 'Term to posting list with frequencies. Persist it and support incremental additions.' },
      { t: 'Boolean and phrase queries', d: 'AND, OR and NOT by intersecting posting lists, then exact phrases using stored positions.' },
      { t: 'Rank results', d: 'TF-IDF, then BM25 with length normalisation. Compare the two on the same queries.' },
      { t: 'Interface with snippets', d: 'Results with highlighted snippets showing the query terms in context, paginated.' },
      { t: 'Measure', d: 'Index size, build time and query latency. Optimise the slowest step, measuring before and after.' }
    ],
    accept: [
      'Multi-term and exact-phrase queries both return correct results',
      'BM25 ranking is visibly better than raw term-frequency counting on test queries',
      'Query latency stays under 100 ms on at least ten thousand documents',
      'The index can be updated incrementally without a full rebuild'
    ],
    stretch: ['Spelling correction with edit distance', 'A simple PageRank over the crawled link graph', 'Compress posting lists with variable-byte or delta encoding']
  },
  {
    id: 'pr-interpreter', title: 'Interpreter for your own language', icon: '📜', tier: 'advanced', time: '30-50 hours',
    summary: 'Lexer, parser, tree-walking evaluator, functions, closures and useful error messages.',
    skills: ['Parsing', 'ASTs', 'Recursion', 'Language design'],
    related: ['adv-compilers', 'al-backtrack', 'py-oop2'],
    brief: '<p>Design a small language and make it run. Variables, arithmetic, conditionals, loops, functions and closures are enough to be genuinely programmable.</p><p>Nothing else demystifies programming quite like this: once you have implemented scope and closures, they stop being magic in every other language you use.</p>',
    starter: 'class Interpreter:\n    def eval(self, node, env):\n        match node:\n            case Number(value):        return value\n            case Var(name):            return env.get(name)\n            case Binary(op, a, b):     return self.binary(op, self.eval(a, env), self.eval(b, env))\n            case If(cond, then, other):\n                return self.eval(then if truthy(self.eval(cond, env)) else other, env)\n            case Call(fn, args):\n                f = self.eval(fn, env)\n                return f.call([self.eval(a, env) for a in args])\n',
    lang: 'python',
    steps: [
      { t: 'Design the language', d: 'Write ten example programs you want to run. That is your specification and your test suite.' },
      { t: 'Lexer', d: 'Characters to tokens, tracking line and column so errors can point at the right place.' },
      { t: 'Parser', d: 'Recursive descent producing an AST, with precedence expressed by rule nesting.' },
      { t: 'Evaluate expressions and variables', d: 'Walk the tree. Implement environments with parent links for nested scope.' },
      { t: 'Control flow', d: 'if/else, while and blocks, with truthiness rules you have written down.' },
      { t: 'Functions and closures', d: 'First-class functions capturing their defining environment, plus return, recursion and arity checking.' },
      { t: 'Errors and a REPL', d: 'Syntax and run-time errors with line numbers and context, and an interactive prompt that keeps state.' }
    ],
    accept: [
      'All ten example programs run correctly',
      'Closures capture variables correctly, demonstrated by a counter factory',
      'Every error reports a line number and a message a user could act on',
      'Recursive functions such as factorial and fibonacci work, with a clear error on runaway recursion'
    ],
    stretch: ['Add arrays and dictionaries with literal syntax', 'First-class objects or structs with methods', 'A standard library of built-in functions']
  },
  {
    id: 'pr-compiler', title: 'Compiler', icon: '⚙️', tier: 'advanced', time: '40-70 hours',
    summary: 'Compile your language to bytecode or assembly, with a VM or real machine code output.',
    skills: ['Compilers', 'Code generation', 'Optimisation', 'Assembly'],
    related: ['adv-compilers', 'ar-isa', 'cpp-basics'],
    brief: '<p>The next step after the interpreter: stop walking the tree and emit code. Either a stack-based bytecode with your own virtual machine, or real assembly you assemble and link.</p><p>Then make it faster: constant folding, dead code elimination, and keeping values in registers. Measuring the speed-up against your interpreter is the reward.</p>',
    steps: [
      { t: 'Reuse the front end', d: 'Take the lexer and parser from the interpreter, and add a semantic pass that resolves names and checks types.' },
      { t: 'Design the target', d: 'Either a stack bytecode instruction set you define, or a subset of x86-64 or ARM64 assembly. Write the instruction reference first.' },
      { t: 'Emit code for expressions', d: 'Arithmetic and comparisons, with correct evaluation order and stack discipline.' },
      { t: 'Control flow', d: 'Labels and jumps for if/else and loops. Verify the jump targets by hand on a small program.' },
      { t: 'Functions', d: 'Calling convention, stack frames, arguments, return values and local variables.' },
      { t: 'Optimise', d: 'Constant folding, dead code elimination, peephole rules. Measure each one on a benchmark.' },
      { t: 'Benchmark against the interpreter', d: 'Run the same programs both ways and report the difference honestly.' }
    ],
    accept: [
      'The same example programs produce identical output as the interpreter',
      'Compiled code is measurably faster than tree walking on a loop-heavy benchmark',
      'Function calls with recursion work correctly, including deep recursion',
      'Each optimisation pass is documented with its measured effect'
    ],
    stretch: ['Register allocation via graph colouring', 'Emit a real executable through an assembler and linker', 'Target WebAssembly and run it in the browser']
  },
  {
    id: 'pr-dbengine', title: 'Database engine', icon: '🛢️', tier: 'advanced', time: '40-70 hours',
    summary: 'Storage pages, a B-tree index, a SQL subset and crash-safe writes.',
    skills: ['Storage', 'B-trees', 'Parsing', 'Durability'],
    related: ['ds-trees', 'db-perf', 'os-fs'],
    brief: '<p>Build the layers underneath SQL: a paged file format, a B-tree index, a small query parser and executor, and a write-ahead log so a crash mid-write cannot corrupt the file.</p><p>Test durability by actually killing the process during a write and reopening the database.</p>',
    steps: [
      { t: 'Page-based storage', d: 'Fixed-size pages in one file, with a header, free-page tracking and a page cache in memory.' },
      { t: 'Row format', d: 'Serialise typed rows into pages, handling variable-length values and page splits.' },
      { t: 'B-tree index', d: 'Insert, search and range scan with node splitting. Verify invariants after every operation in tests.' },
      { t: 'SQL subset', d: 'Parse CREATE TABLE, INSERT, SELECT with WHERE, and DELETE into a query plan.' },
      { t: 'Executor', d: 'Sequential scan and index scan, choosing the index when the WHERE clause allows it.' },
      { t: 'Durability', d: 'A write-ahead log with commit records, plus recovery on open that replays or discards incomplete transactions.' },
      { t: 'Crash testing', d: 'Kill the process at random points during writes and confirm the database always reopens consistently.' }
    ],
    accept: [
      'Data survives a process kill during a write, with no corruption',
      'An indexed query is measurably faster than a full scan on a large table',
      'B-tree invariants hold after tens of thousands of random inserts and deletes',
      'The SQL subset is documented, with clear errors for unsupported syntax'
    ],
    stretch: ['Multi-statement transactions with rollback', 'A simple query planner that chooses between available indexes', 'Concurrent readers with a single writer']
  },
  {
    id: 'pr-webserver', title: 'HTTP web server', icon: '🖧', tier: 'advanced', time: '20-35 hours',
    summary: 'A server built on raw sockets: HTTP parsing, routing, concurrency and static files.',
    skills: ['Sockets', 'HTTP', 'Concurrency', 'Performance'],
    related: ['net-transport', 'net-web', 'os-concurrency'],
    brief: '<p>Start from <code>socket()</code>, not from a framework. Parse the request line and headers yourself, serve files and dynamic routes, keep connections alive, and handle many clients at once.</p><p>You will meet partial reads, malformed requests and slow clients — the realities every framework hides.</p>',
    starter: 'import socket\n\nserver = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\nserver.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)\nserver.bind(("0.0.0.0", 8080))\nserver.listen(128)\n\nwhile True:\n    conn, addr = server.accept()\n    handle(conn)          # then: thread pool, or an event loop\n',
    lang: 'python',
    steps: [
      { t: 'Accept connections', d: 'Bind, listen, accept, echo. Handle partial reads: one recv is not one request.' },
      { t: 'Parse HTTP/1.1', d: 'Request line, headers, Content-Length body. Reject malformed requests with 400 rather than crashing.' },
      { t: 'Serve static files', d: 'Correct content types, 404 for missing files, and path handling that cannot escape the document root.' },
      { t: 'Routing and dynamic responses', d: 'Map method and path to handlers, with parameters and query strings parsed.' },
      { t: 'Concurrency', d: 'A thread pool or an event loop with selectors. Measure throughput under concurrent load.' },
      { t: 'Keep-alive and limits', d: 'Persistent connections, timeouts, maximum header and body sizes, and graceful shutdown.' },
      { t: 'Benchmark and harden', d: 'Load test it, then fix what breaks: slow clients, huge headers, and directory traversal attempts.' }
    ],
    accept: [
      'Browsers render a served page correctly with the right content types',
      '`../../etc/passwd` style paths cannot escape the document root',
      'Handles at least 100 concurrent connections without failing requests',
      'Malformed requests and slow clients are rejected without taking the server down'
    ],
    stretch: ['Gzip compression with content negotiation', 'TLS termination using the standard library', 'A WebSocket upgrade path for a live demo page']
  },
  {
    id: 'pr-gameengine', title: 'Game engine', icon: '🎮', tier: 'advanced', time: '40-80 hours',
    summary: 'Game loop, rendering, physics, collision and entity management, with a game built on it.',
    skills: ['Game loops', 'Physics', 'Collision detection', 'Architecture'],
    related: ['m-linalg', 'ds-arrays', 'cpp-classes'],
    brief: '<p>A 2D engine is an excellent architecture exercise: a fixed-timestep loop, an entity-component system, a rendering layer, collision detection with broad and narrow phases, input, audio and a scene format.</p><p>Finish by building an actual small game on top of it — that is what proves the API is usable.</p>',
    steps: [
      { t: 'Fixed-timestep game loop', d: 'Separate update from render with an accumulator, so physics is deterministic regardless of frame rate.' },
      { t: 'Entities and components', d: 'A component store keyed by entity id, with systems iterating over the components they care about.' },
      { t: 'Rendering', d: 'Sprites, layers, a camera with translation and zoom, and interpolation between physics steps.' },
      { t: 'Physics and collision', d: 'Velocity, acceleration and gravity; broad phase with a spatial grid, narrow phase with AABB or circle tests, and resolution.' },
      { t: 'Input and events', d: 'An abstraction over keyboard, mouse and gamepad, plus an event bus so systems do not call each other directly.' },
      { t: 'Scenes and assets', d: 'Load levels from a data file, with an asset cache so textures and sounds load once.' },
      { t: 'Build a game with it', d: 'A complete small game: menu, play, win and lose states. Fix whatever the engine made awkward.' }
    ],
    accept: [
      'Physics behaves identically at 30 and 144 frames per second',
      'Collision remains responsive with several hundred entities on screen',
      'A new entity type can be added without modifying engine internals',
      'The demo game is playable start to finish, including menus and restart'
    ],
    stretch: ['A particle system', 'Tilemap loading from a standard editor format', 'A simple level editor built on the engine itself']
  },
  {
    id: 'pr-ossim', title: 'Operating system simulator', icon: '🧷', tier: 'advanced', time: '25-40 hours',
    summary: 'Simulate scheduling, memory management and file systems, then compare policies with data.',
    skills: ['Scheduling', 'Virtual memory', 'File systems', 'Simulation'],
    related: ['os-sched', 'os-memory', 'os-fs'],
    brief: '<p>Rather than writing a kernel, simulate one: model processes, a scheduler, paging and a file system, then measure how different policies perform on the same workloads.</p><p>The output is a report with charts comparing round robin against shortest-job-first, and LRU against FIFO page replacement — conclusions you derived rather than read.</p>',
    steps: [
      { t: 'Process model', d: 'PCBs with states, arrival time, CPU bursts and I/O bursts. Generate reproducible random workloads from a seed.' },
      { t: 'Schedulers', d: 'Implement FCFS, SJF, round robin and priority with aging behind one interface.' },
      { t: 'Measure scheduling', d: 'Average waiting time, turnaround, response time, throughput and context switches per policy.' },
      { t: 'Virtual memory', d: 'Page tables, page faults, and FIFO, LRU and optimal replacement over a reference string.' },
      { t: 'Measure paging', d: 'Fault rate versus frame count for each policy. Demonstrate Belady\'s anomaly with FIFO.' },
      { t: 'File system', d: 'Inodes, directories, block allocation and free-space tracking, with fragmentation statistics.' },
      { t: 'Report', d: 'Charts and a written conclusion about which policy suits which workload, and why.' }
    ],
    accept: [
      'The same seed reproduces identical runs, so comparisons are fair',
      'Round robin shows better response time and worse turnaround than SJF, as theory predicts',
      'Belady\'s anomaly is demonstrated with a concrete reference string',
      'The report draws conclusions from your measurements, with charts'
    ],
    stretch: ['Add deadlock detection with a resource allocation graph', 'Simulate multi-core scheduling with load balancing', 'Animate the page table and memory frames over time']
  },
  {
    id: 'pr-nnframework', title: 'Neural network framework', icon: '🧠', tier: 'advanced', time: '30-50 hours',
    summary: 'Autograd, layers, optimisers and training loop written from scratch, then used to train a real model.',
    skills: ['Automatic differentiation', 'Linear algebra', 'Optimisation', 'NumPy'],
    related: ['dl-train', 'dl-nn', 'm-calc'],
    brief: '<p>Build a miniature PyTorch. A tensor that records operations, a backward pass that applies the chain rule through the recorded graph, layers, losses and optimisers on top.</p><p>Then train it on MNIST and match a reference implementation. Gradients you derived yourself removes the last of the mystery from deep learning.</p>',
    starter: 'class Tensor:\n    def __init__(self, data, parents=(), op=""):\n        self.data = np.asarray(data, dtype=np.float32)\n        self.grad = np.zeros_like(self.data)\n        self._backward = lambda: None\n        self._parents = set(parents)\n\n    def __add__(self, other):\n        out = Tensor(self.data + other.data, (self, other), "+")\n        def _backward():\n            self.grad += out.grad\n            other.grad += out.grad\n        out._backward = _backward\n        return out\n',
    lang: 'python',
    steps: [
      { t: 'Tensor with autograd', d: 'Wrap a NumPy array, record parents and a local backward closure for each operation.' },
      { t: 'Backward pass', d: 'Topologically sort the graph and propagate gradients from the loss backwards. Zero gradients between steps.' },
      { t: 'Verify with numerical gradients', d: 'Compare analytic gradients against finite differences on random inputs. This is non-negotiable.' },
      { t: 'Layers and activations', d: 'Linear, ReLU, sigmoid and softmax, with correct broadcasting and shape checks that produce useful errors.' },
      { t: 'Losses and optimisers', d: 'MSE and cross-entropy; SGD with momentum, then Adam. Match reference behaviour on a toy problem.' },
      { t: 'Train on MNIST', d: 'Batching, shuffling, an epoch loop, and validation accuracy per epoch.' },
      { t: 'Compare and document', d: 'Match a PyTorch baseline within a small margin, and write up where your implementation differs and why.' }
    ],
    accept: [
      'Analytic gradients match numerical gradients within 1e-4 for every operation',
      'The framework trains MNIST to at least 95% test accuracy',
      'Shape mismatches produce clear errors naming the layer and the shapes involved',
      'Results are within a reasonable margin of an equivalent PyTorch model'
    ],
    stretch: ['Add convolution and pooling layers', 'Implement dropout and batch normalisation, including their train/eval behaviour', 'A computation graph visualiser']
  }
]);

CS.addSpecializations([
  {
    id: 'sp-aiml', name: 'AI / Machine learning', icon: '🧠', role: 'ML engineer, data scientist, AI researcher',
    why: 'You want to build systems that learn from data: models, pipelines and the engineering that makes them reliable in production rather than only in a notebook.',
    stages: ['s3', 's8', 's16', 's17', 's18', 's19'],
    projects: ['pr-recommender', 'pr-chatbot', 'pr-nnframework'],
    capstone: {
      title: 'An end-to-end ML system that someone uses',
      brief: '<p>Take one real prediction problem all the way from raw data to a deployed, monitored service with an honest evaluation. The deliverable is not a notebook with a good score: it is a system that keeps working when the data shifts, and a write-up that a sceptical reader would believe.</p>',
      steps: [
        { t: 'Frame the problem', d: 'The decision the model informs, the metric that reflects it, and the cost of each kind of error. Define what "good enough to ship" means before modelling.' },
        { t: 'Build the data pipeline', d: 'Ingestion, cleaning and feature engineering as reproducible code, with a fixed split and no leakage. Version the dataset.' },
        { t: 'Baseline then model', d: 'A trivial baseline first, then your model, compared on the same split with confidence intervals.' },
        { t: 'Evaluate honestly', d: 'Error analysis by segment, calibration, and a fairness check across groups where relevant. Document the failure modes you found.' },
        { t: 'Serve it', d: 'An API with input validation, batching or caching as needed, and latency measured under realistic load.' },
        { t: 'Monitor and retrain', d: 'Track input drift, prediction distribution and outcome quality. Define the trigger and procedure for retraining.' },
        { t: 'Write it up', d: 'Problem, data, method, results, limitations and what you would do next. Include the experiments that failed.' }
      ]
    }
  },
  {
    id: 'sp-swe', name: 'Software engineering', icon: '🛠️', role: 'Full-stack, backend or frontend engineer',
    why: 'You want to build and maintain software that other people depend on: correct, tested, deployable and possible for a team to change safely.',
    stages: ['s3', 's6', 's7', 's12', 's13', 's14'],
    projects: ['pr-restapi', 'pr-saas', 'pr-webserver'],
    capstone: {
      title: 'A production application, operated properly',
      brief: '<p>Ship a multi-user application and run it like a professional would: tested, deployed by a pipeline, observable, documented, and safe to change six months from now by someone who is not you.</p>',
      steps: [
        { t: 'Specify and design', d: 'User stories, a data model, and an architecture sketch showing what depends on what. Write down the decisions you rejected.' },
        { t: 'Build the core', d: 'Vertical slices, each complete from interface to database, with validation and error handling at every boundary.' },
        { t: 'Test at the right levels', d: 'Fast unit tests for logic, integration tests over a real database, and a handful of end-to-end tests for the critical path.' },
        { t: 'Automate the pipeline', d: 'CI that lints, type-checks and tests on every push, and a deploy that runs migrations and can roll back.' },
        { t: 'Secure it', d: 'Authentication, authorisation checks on every resource, parameterised queries, secret management and dependency scanning.' },
        { t: 'Make it observable', d: 'Structured logs with request ids, metrics for rate, errors and latency, and one alert that would actually page you.' },
        { t: 'Document for the next maintainer', d: 'README, architecture notes, runbook for common failures, and a first-contribution guide.' }
      ]
    }
  },
  {
    id: 'sp-ce', name: 'Computer engineering', icon: '🔩', role: 'Hardware, firmware or systems engineer',
    why: 'You want to work where software meets silicon: architecture, firmware, timing and the constraints of real devices.',
    stages: ['s1', 's5', 's9', 's10', 's21'],
    projects: ['pr-ossim', 'pr-compiler', 'pr-gameengine'],
    capstone: {
      title: 'A hardware-software system with measured performance',
      brief: '<p>Design and build a system that spans the boundary: firmware on a microcontroller, a host-side application, and a communication protocol between them — with timing and resource use measured rather than assumed.</p>',
      steps: [
        { t: 'Define requirements and constraints', d: 'Timing deadlines, memory budget, power budget and failure behaviour. State which are hard requirements.' },
        { t: 'Design the protocol', d: 'Message format, framing, checksums and error recovery between device and host. Document it well enough for someone else to implement.' },
        { t: 'Build the firmware', d: 'Interrupt-driven input, no dynamic allocation, a watchdog, and a deterministic main loop.' },
        { t: 'Build the host side', d: 'Application that configures the device, streams data, and handles disconnection and reconnection cleanly.' },
        { t: 'Measure', d: 'Worst-case latency, jitter, memory high-water mark and throughput, with the method described.' },
        { t: 'Test failure modes', d: 'Pull the cable, corrupt a message, brown out the supply. The system must recover without manual intervention.' },
        { t: 'Document the design', d: 'Schematic or wiring diagram, protocol specification, measurement results and the trade-offs you made.' }
      ]
    }
  },
  {
    id: 'sp-aihw', name: 'AI hardware', icon: '🔌', role: 'ML systems, inference optimisation, accelerator engineer',
    why: 'You want to make models run fast and cheaply: kernels, memory, precision and the hardware they execute on.',
    stages: ['s5', 's9', 's18', 's19', 's20'],
    projects: ['pr-nnframework', 'pr-compiler', 'pr-chatbot'],
    capstone: {
      title: 'Make a model measurably faster, and prove it',
      brief: '<p>Take a model with a real latency or cost problem and optimise its inference end to end. Every change must be justified by a measurement, and quality must be shown to hold on your own evaluation set.</p>',
      steps: [
        { t: 'Establish the baseline', d: 'Latency percentiles, throughput, memory use, cost per thousand requests and a quality score, all on fixed hardware and inputs.' },
        { t: 'Profile', d: 'Find where the time actually goes. Determine whether each hot kernel is compute bound or memory bound.' },
        { t: 'Optimise precision', d: 'Apply mixed precision or quantisation, then measure both the speed gain and the quality change on your evaluation set.' },
        { t: 'Optimise execution', d: 'Batching, KV cache reuse, kernel fusion, a compiled runtime, or moving preprocessing off the critical path.' },
        { t: 'Optimise the serving layer', d: 'Caching, request scheduling, concurrency limits and graceful degradation under overload.' },
        { t: 'Verify quality', d: 'Full evaluation against the baseline, with per-segment results so you can see what the optimisation cost.' },
        { t: 'Report', d: 'A table of each change with its speed, cost and quality effect, and a recommendation on which to keep.' }
      ]
    }
  },
  {
    id: 'sp-sec', name: 'Cybersecurity', icon: '🛡️', role: 'Security engineer, application security, defensive operations',
    why: 'You want to build and defend systems against real adversaries, understanding how they fail in order to make them fail safely.',
    stages: ['s10', 's11', 's13', 's15', 's22'],
    projects: ['pr-webserver', 'pr-restapi', 'pr-saas'],
    capstone: {
      title: 'Secure a real application, end to end',
      brief: '<p>Take an application you built and harden it properly: threat model, fix what the model finds, add defence in depth, and produce the documentation an auditor or an on-call engineer would need. Defensive work only, on systems you own.</p>',
      steps: [
        { t: 'Threat model', d: 'Data flow diagram with trust boundaries, then STRIDE per component. Rank findings by likelihood and impact.' },
        { t: 'Fix the application layer', d: 'Parameterised queries, output encoding, CSRF protection, secure session handling and strict input validation.' },
        { t: 'Harden authentication', d: 'Argon2 or bcrypt hashing, MFA, rate limiting, account enumeration prevention and safe recovery flows.' },
        { t: 'Enforce authorisation everywhere', d: 'An ownership check on every resource access, tested with an automated suite that tries to cross tenant boundaries.' },
        { t: 'Secure the infrastructure', d: 'Least-privilege service accounts, secret management, network segmentation, dependency scanning and patching policy.' },
        { t: 'Detect and respond', d: 'Central logging of security events, alerts for credential stuffing and privilege changes, and a written incident runbook.' },
        { t: 'Verify and document', d: 'Re-test every finding, record what was fixed and what risk was accepted, and write the security notes for the repository.' }
      ]
    }
  },
  {
    id: 'sp-robotics', name: 'Robotics', icon: '🤖', role: 'Robotics engineer, control systems, autonomous systems',
    why: 'You want to build machines that sense, decide and act in the physical world, where timing and safety are not abstractions.',
    stages: ['s5', 's8', 's9', 's21', 's17'],
    projects: ['pr-gameengine', 'pr-ossim', 'pr-recommender'],
    capstone: {
      title: 'An autonomous robot that completes a task reliably',
      brief: '<p>Build a robot — physical or simulated — that senses its environment, plans and acts to complete a defined task, and does so repeatably. Reliability across many trials is the deliverable, not one lucky demonstration.</p>',
      steps: [
        { t: 'Define the task and safety limits', d: 'Success criteria, the operating envelope, and what the robot must do when something goes wrong. Include an emergency stop.' },
        { t: 'Sensing and filtering', d: 'Choose sensors, calibrate them, and fuse or filter the readings into a usable state estimate.' },
        { t: 'Closed-loop control', d: 'A tuned PID or equivalent controller with anti-windup, output clamping and a fixed loop rate.' },
        { t: 'Localisation and planning', d: 'Know where the robot is, plan a path that avoids obstacles, and re-plan when the world changes.' },
        { t: 'Simulate first', d: 'Run the full stack in simulation and fix what you can there. Record the differences you expect on hardware.' },
        { t: 'Test on hardware, repeatedly', d: 'At least twenty trials with results logged. Investigate every failure rather than retrying until it works once.' },
        { t: 'Document and demonstrate', d: 'Architecture, tuning method, success rate with failure analysis, and a video of a complete run.' }
      ]
    }
  },
  {
    id: 'sp-systems', name: 'Systems and infrastructure', icon: '🏗️', role: 'Systems engineer, SRE, platform or distributed systems engineer',
    why: 'You want to build the layer everything else runs on: storage, networking, distributed coordination and the operations that keep it up.',
    stages: ['s6', 's7', 's10', 's11', 's12', 's22'],
    projects: ['pr-dbengine', 'pr-webserver', 'pr-search'],
    capstone: {
      title: 'A distributed service that survives failure',
      brief: '<p>Build a replicated service that stays correct and available while parts of it fail. Then prove it by breaking things deliberately and showing what happened, with numbers.</p>',
      steps: [
        { t: 'Specify the guarantees', d: 'What consistency, durability and availability you promise, and explicitly what you do not. Justify the choice for your use case.' },
        { t: 'Build the single-node version', d: 'Correct, tested, benchmarked. Establish the baseline before adding distribution.' },
        { t: 'Replicate', d: 'Leader election or a consensus library, replication of writes, and a documented read path with its staleness properties.' },
        { t: 'Make operations safe to retry', d: 'Idempotency keys, deduplication, timeouts with jittered backoff, and circuit breakers between components.' },
        { t: 'Inject failures', d: 'Kill nodes, partition the network, add latency and clock skew. Record the observed behaviour against your stated guarantees.' },
        { t: 'Operate it', d: 'Metrics, dashboards, alerts on symptoms, a deployment pipeline with rollback, and tested backup and restore.' },
        { t: 'Write the report', d: 'Design decisions, benchmark results, failure test results, known limitations and the runbook.' }
      ]
    }
  }
]);
