/* Stages 0-2: digital literacy, computer fundamentals, programming fundamentals. */
CS.addStage({
  id: 's0', n: 0, title: 'Digital literacy', short: 'Digital literacy', track: 'foundations', icon: '💡', pos: [60, 230], prereq: [],
  blurb: 'What a computer actually is, where your files live, how the internet reaches you, and how to stay safe.',
  nodes: [
    {
      id: 's0-computers', title: 'What a computer is', icon: '💻', topics: ['Computers', 'Hardware vs software'],
      learn: [
        { h: 'A computer is four jobs in one box', p: '<p>Every computer, from a smartwatch to a data-centre server, does the same four things:</p><ul><li><b>Input</b> — take data in (keyboard, camera, network)</li><li><b>Process</b> — do arithmetic and comparisons on it (the CPU)</li><li><b>Store</b> — keep it (RAM while running, disk for later)</li><li><b>Output</b> — show or send the result (screen, speaker, network)</li></ul><p>Everything else in this roadmap is detail hanging off those four words.</p>' },
        { h: 'Hardware you can drop on your foot; software you cannot', p: '<p><b>Hardware</b> is physical: chips, boards, cables. <b>Software</b> is instructions stored as data that tell the hardware what to do.</p><p>The same laptop runs a game, a spreadsheet, or a web server. The hardware never changes; only the instructions loaded into memory do. That flexibility is the whole point of a computer, and it is why one skill — writing instructions — opens all of it.</p>' },
        { h: 'Firmware sits in between', p: '<p>Firmware is software that ships inside a device and rarely changes: the code in your router, your keyboard, or the UEFI/BIOS that starts your PC before the operating system loads. It is still just instructions, but stored on a chip rather than installed by you.</p>' }
      ],
      q: [
        { t: 'mc', q: 'Which of these is software?', o: ['The web browser you are reading this in', 'The screen showing it', 'The Wi-Fi antenna', 'The USB-C port'], a: 0, e: 'A browser is a set of instructions stored as data. The rest are physical parts.' },
        { t: 'match', q: 'Match each part to the job it does.', p: [['Microphone', 'Input'], ['CPU', 'Processing'], ['Hard drive', 'Storage'], ['Speaker', 'Output']], e: 'Input, processing, storage, output: the four jobs every computer performs.' },
        { t: 'tf', q: 'A phone and a laptop are fundamentally different kinds of machine that share no design ideas.', a: false, e: 'Both are general-purpose computers with a CPU, memory, storage and I/O. The differences are size, power budget and instruction set, not the core idea.' },
        { t: 'fill', q: 'Software that ships inside a device and is stored on a chip, such as the code in a router, is called ___.', a: ['firmware'], e: 'Firmware is the software baked into a device.' },
        { t: 'short', q: 'In one or two sentences: why can the same laptop run both a game and a web server?', a: [['software', 'instruction', 'program'], ['hardware', 'same machine', 'general']], model: 'Because the hardware is general purpose: it just executes whatever instructions are loaded into memory, so different software makes it behave differently.', e: 'General-purpose hardware plus swappable software is the central trick of computing.' }
      ]
    },
    {
      id: 's0-files', title: 'Files, folders and the OS', icon: '🗂️', topics: ['Files and folders', 'Operating systems'],
      learn: [
        { h: 'A file is named bytes; a folder is a list of names', p: '<p>A <b>file</b> is a sequence of bytes with a name. Nothing more. A photo, a Python script and a song are all just bytes; the <b>extension</b> (<code>.png</code>, <code>.py</code>, <code>.mp3</code>) is a hint about how to interpret them.</p><p>A <b>folder</b> (directory) is a file that lists other files. Folders inside folders make a tree, and a <b>path</b> is the route through that tree:</p>', code: '/home/ada/projects/notes.txt      ← Linux and macOS\nC:\\Users\\Ada\\projects\\notes.txt    ← Windows\n./notes.txt     relative to where you are now\n../notes.txt    one folder up', lang: 'bash' },
        { h: 'The operating system is the manager', p: '<p>The OS (Windows, macOS, Linux, Android, iOS) sits between programs and hardware. It decides which program gets the CPU next, hands out memory, owns the file system, and talks to devices through drivers.</p><p>Programs cannot touch the disk directly; they ask the OS with a <b>system call</b>. That is what keeps one badly behaved app from wiping your drive.</p>' },
        { h: 'Absolute vs relative paths matter later', p: '<p>An <b>absolute path</b> starts at the root and always means the same place. A <b>relative path</b> depends on the current working directory. Half of all "file not found" bugs are a relative path evaluated from somewhere you did not expect.</p>' }
      ],
      q: [
        { t: 'mc', q: 'What does the file extension `.py` actually do?', o: ['Hints to humans and programs how to interpret the bytes', 'Changes the bytes inside the file', 'Makes the file run faster', 'Encrypts the file'], a: 0, e: 'Extensions are convention, not content. Renaming a .png to .txt does not change a single byte inside it.' },
        { t: 'fill', q: 'In a path, `..` means the ___ folder.', a: ['parent', 'previous', 'containing', 'one up', 'parent directory'], e: '`..` is the parent directory; `.` is the current one.' },
        { t: 'tf', q: 'A program can write to your hard drive without the operating system being involved.', a: false, e: 'Normal programs make system calls; the OS performs the actual device access. That boundary is what protection and permissions are built on.' },
        { t: 'order', q: 'Put this path in order from the outermost folder to the file itself.', plain: true, o: ['/ (root)', 'home', 'ada', 'projects', 'notes.txt'], e: 'Paths read left to right, outermost first.' },
        { t: 'mc', q: 'You run a script that opens `data.csv`. It works in your project folder but fails from your desktop. Why?', o: ['It is a relative path, resolved from the current working directory', 'CSV files only work in one folder', 'The file was deleted', 'Desktop folders cannot hold data'], a: 0, e: 'Relative paths resolve from wherever the program is run. Use an absolute path, or compute one from the script location.' }
      ]
    },
    {
      id: 's0-internet', title: 'Browsers, the internet and the cloud', icon: '🌐', topics: ['Browsers', 'Internet basics', 'Cloud computing'],
      learn: [
        { h: 'The internet is not the web', p: '<p>The <b>internet</b> is the physical and logical network: cables, radio links, routers and addresses. The <b>web</b> is one application running on it (HTTP pages in browsers). Email, games, video calls and app APIs also ride the same network without touching the web.</p>' },
        { h: 'What happens when you type an address', p: '<ol><li>The browser looks up the name with <b>DNS</b>: <code>example.com → 93.184.215.14</code>.</li><li>It opens a <b>TCP</b> connection to that address, usually port 443.</li><li><b>TLS</b> encrypts the connection and checks the site\'s certificate (the padlock).</li><li>It sends an <b>HTTP</b> request; the server sends HTML back.</li><li>The browser parses the HTML, then fetches CSS, JavaScript and images and renders the page.</li></ol><p>You will simulate this packet by packet in the networking lab.</p>', lab: 'network' },
        { h: 'The cloud is someone else\'s computer, rented by the minute', p: '<p>Cloud computing means renting compute, storage and services instead of owning servers. It comes in layers:</p><ul><li><b>IaaS</b> — you rent a virtual machine and manage the OS (AWS EC2)</li><li><b>PaaS</b> — you push code, they run it (Heroku, App Engine)</li><li><b>SaaS</b> — you just use the finished app (Gmail, Figma)</li></ul><p>The trade is control for convenience, and capital cost for a monthly bill.</p>' }
      ],
      q: [
        { t: 'mc', q: 'Which statement is accurate?', o: ['The web is one service that runs on the internet', 'The internet is one service that runs on the web', 'They are two names for the same thing', 'The web replaced the internet'], a: 0, e: 'The internet is the network; the web is an application layered on top of it, alongside email, video calls and APIs.' },
        { t: 'order', q: 'Put the steps of loading a web page in order.', plain: true, o: ['DNS turns the name into an IP address', 'A TCP connection opens to that address', 'TLS encrypts the connection and checks the certificate', 'An HTTP request is sent', 'The browser renders the HTML and fetches CSS, JS and images'], e: 'Name → connection → encryption → request → render.' },
        { t: 'fill', q: 'Renting a virtual machine where you still manage the operating system is called ___ (three-letter acronym).', a: ['iaas', 'infrastructure as a service'], e: 'Infrastructure as a Service: you rent the machine, you run the OS.' },
        { t: 'tf', q: 'The padlock in the address bar means the site is trustworthy and honest.', a: false, e: 'It means the connection is encrypted and the certificate matches the domain. A scam site can get a valid certificate. Encryption protects the pipe, not the person at the other end.' },
        { t: 'mc', q: 'Your files "in the cloud" are physically stored:', o: ['On disks in data centres, usually copied to more than one', 'In the air between satellites', 'Only on your device until you go online', 'Nowhere; they are recreated on demand'], a: 0, e: 'Cloud storage is ordinary disks in buildings, with replication so a single failure does not lose your data.' }
      ]
    },
    {
      id: 's0-safety', title: 'Privacy and digital security', icon: '🔒', topics: ['Privacy', 'Digital security'],
      learn: [
        { h: 'Three things protect an account', p: '<ul><li><b>Long, unique passwords</b> — length beats symbols. A password manager makes uniqueness free.</li><li><b>Two-factor authentication</b> — an app code or hardware key, not SMS where you can choose.</li><li><b>Suspicion of urgency</b> — phishing works through pressure: "your account will close in 24 hours".</li></ul><p>Reused passwords are the single biggest cause of account takeover: one breached site hands attackers the key to the rest.</p>' },
        { h: 'Updates are security work', p: '<p>Most real attacks use known holes that were patched months ago. Updating your OS, browser and libraries closes them. In Stage 15 you will see how those holes are found and fixed.</p>' },
        { h: 'Privacy is about who can link data to you', p: '<p>Data you give away (posts, forms) and data you emit (location, browsing, purchases) can be joined together. Practical habits: check app permissions, prefer end-to-end encrypted messaging, and assume anything you post can be copied and kept forever.</p>' }
      ],
      q: [
        { t: 'mc', q: 'Which password is strongest against modern cracking?', o: ['correct-horse-battery-staple-1998', 'P@ssw0rd!', 'Summer2024', 'Xy7!q'], a: 0, e: 'Length dominates. A long passphrase has far more possible combinations than a short one with substitutions, which crackers try first.' },
        { t: 'tf', q: 'Reusing one strong password everywhere is safe because the password itself is hard to guess.', a: false, e: 'If any one site is breached, attackers try that password everywhere else. Uniqueness matters as much as strength.' },
        { t: 'mc', q: 'An email says your bank account will be locked in 2 hours and links to a login page. The best first move is:', o: ['Ignore the link and open the bank\'s app or type the address yourself', 'Click and check whether the page looks right', 'Reply asking if it is genuine', 'Forward it to a friend for a second opinion'], a: 0, e: 'Never navigate from the message. Urgency plus a link is the standard phishing shape.' },
        { t: 'fill', q: 'Requiring a code from an app in addition to a password is called two-factor ___.', a: ['authentication', '2fa', 'auth'], e: 'Two-factor authentication: something you know plus something you have.' },
        { t: 'short', q: 'Why do security professionals nag about installing updates?', a: [['patch', 'fix', 'vulnerab', 'known', 'hole', 'bug']], model: 'Updates patch known vulnerabilities that attackers already have working exploits for.', e: 'Most breaches use published vulnerabilities, not new ones.' }
      ]
    },
    {
      id: 's0-cli', title: 'Command line basics', icon: '⌨️', topics: ['Command line basics'],
      learn: [
        { h: 'The shell is a text conversation with the OS', p: '<p>You type a command, it runs a program, you get text back. It is faster than clicking for anything repeatable, and it is how servers are run, because servers rarely have a screen.</p>', code: 'pwd                 # print working directory: where am I?\nls -la              # list files, including hidden, with details\ncd projects         # change directory\nmkdir notes         # make a folder\ncat notes.txt       # print a file\ncp a.txt b.txt      # copy       mv a.txt c.txt  # move or rename\nrm old.txt          # delete (no recycle bin!)\npython3 app.py      # run a program', lang: 'bash' },
        { h: 'Arguments, flags and the manual', p: '<p>A command line is <code>program flag(s) argument(s)</code>. <code>-l</code> is a short flag, <code>--long-form</code> is its readable twin. <code>man ls</code> or <code>ls --help</code> shows what a program accepts.</p><p>On Windows, PowerShell uses different names (<code>Get-ChildItem</code>), but Git Bash and WSL give you the same Unix commands you will see in every tutorial.</p>' },
        { h: 'Pipes: small tools, joined up', p: '<p><code>|</code> feeds one program\'s output into the next. This is the Unix philosophy: many small sharp tools instead of one giant one.</p>', code: 'ls *.csv | wc -l            # how many CSV files?\ncat log.txt | grep ERROR    # only lines containing ERROR\nhistory | grep git | tail -5', lang: 'bash' }
      ],
      q: [
        { t: 'fill', q: 'Which command prints the folder you are currently in?', a: ['pwd'], mono: true, e: '`pwd` = print working directory.' },
        { t: 'mc', q: 'What does `ls -la` add compared with plain `ls`?', o: ['A long detailed listing including hidden files', 'It deletes files after listing', 'It lists only folders', 'It sorts by size'], a: 0, e: '`-l` is the long format, `-a` includes entries starting with a dot.' },
        { t: 'predict', q: 'A folder holds 4 CSV files and 2 text files. What does this print?', code: 'ls *.csv | wc -l', lang: 'bash', a: ['4'], e: '`ls *.csv` lists the 4 matching files, one per line, and `wc -l` counts the lines.' },
        { t: 'match', q: 'Match each command to what it does.', p: [['cd', 'Change directory'], ['mkdir', 'Create a folder'], ['rm', 'Delete a file'], ['grep', 'Filter lines that match text']], e: 'These five cover most day-to-day shell work.' },
        { t: 'tf', q: '`rm notes.txt` moves the file to the recycle bin, so it can be restored.', a: false, e: '`rm` unlinks the file immediately, with no recycle bin. This is why professionals pause before typing rm with a wildcard.' }
      ]
    }
  ]
});

CS.addStage({
  id: 's1', n: 1, title: 'Computer fundamentals', short: 'Fundamentals', track: 'foundations', icon: '🧩', pos: [170, 230], prereq: ['s0'],
  blurb: 'The parts inside the box, how they represent everything as numbers, and how a program actually runs.',
  nodes: [
    {
      id: 's1-parts', title: 'The parts inside', icon: '🔩', topics: ['CPU', 'GPU', 'RAM', 'Storage', 'Motherboards', 'Peripherals'],
      learn: [
        { h: 'Who does what', p: '<ul><li><b>CPU</b> — a few very fast, very flexible cores. Runs the OS and your code.</li><li><b>GPU</b> — thousands of simple cores doing the same operation on lots of data. Graphics, and the matrix multiplications behind AI.</li><li><b>RAM</b> — fast working memory, volatile: it empties when power is lost.</li><li><b>Storage</b> — SSD or hard disk; slower but persistent.</li><li><b>Motherboard</b> — the wiring (buses) that connects everything, plus power delivery.</li><li><b>Peripherals</b> — keyboard, mouse, display, network card: I/O at the edges.</li></ul>' },
        { h: 'Speed differences are enormous', p: '<p>Rough ratios: a CPU register is ~1 step away, L1 cache ~4, RAM ~200, an SSD ~200,000, a spinning disk ~10,000,000. This is why programs are designed to keep hot data close, and why "just add RAM" sometimes fixes everything.</p>' },
        { h: 'How a spec sheet reads', p: '<p>"8-core, 3.6 GHz, 16 GB RAM, 1 TB NVMe, 8 GB VRAM" means: eight independent CPU cores, each doing about 3.6 billion clock ticks per second, 16 GB of working memory, a fast solid-state drive, and a graphics card with its own 8 GB. More cores help when work can be split; higher clocks help when it cannot.</p>' }
      ],
      lab: 'cache',
      q: [
        { t: 'mc', q: 'You close a program without saving and lose your work. Which component was holding it?', o: ['RAM', 'The SSD', 'The GPU', 'The motherboard'], a: 0, e: 'RAM is volatile working memory. Saving copies data to persistent storage.' },
        { t: 'match', q: 'Match each component to its defining job.', p: [['CPU', 'Few fast flexible cores'], ['GPU', 'Thousands of simple parallel cores'], ['RAM', 'Volatile working memory'], ['SSD', 'Persistent storage']], e: 'Those four decide most of a machine\'s performance character.' },
        { t: 'tf', q: 'A 4 GHz single-core CPU always beats a 3 GHz eight-core CPU.', a: false, e: 'Only for work that cannot be split. Compiling, rendering and serving many users all scale across cores.' },
        { t: 'mc', q: 'Why are GPUs used for training neural networks?', o: ['The same operation is applied to huge arrays of numbers at once', 'They have more storage than CPUs', 'They run Python natively', 'They never overheat'], a: 0, e: 'Training is mostly matrix multiplication: thousands of identical independent multiply-add operations, exactly what a GPU is built for.' },
        { t: 'order', q: 'Order these from fastest access to slowest.', plain: true, o: ['CPU register', 'L1 cache', 'RAM', 'SSD', 'Hard disk'], e: 'Each step down is roughly an order of magnitude or more slower, and bigger and cheaper per byte.' }
      ]
    },
    {
      id: 's1-binary', title: 'Binary and number systems', icon: '🔢', topics: ['Binary', 'Bits and bytes', 'Number systems'], lab: 'binary',
      learn: [
        { h: 'Counting with two symbols', p: '<p>A <b>bit</b> is one switch: 0 or 1. Place values double instead of multiplying by ten:</p><pre>128 64 32 16 8 4 2 1\n  1  0  0  1 1 0 1 0   =  128+16+8+2 = 154</pre><p>8 bits = 1 <b>byte</b> = 256 possible values (0–255). n bits give 2ⁿ values, which is why capacities are powers of two.</p>' },
        { h: 'Hexadecimal is shorthand for binary', p: '<p>Base 16 uses 0–9 then A–F. Each hex digit is exactly 4 bits, so a byte is always two hex digits: <code>11011110 = DE = 222</code>. That is why colours look like <code>#FF8800</code> and memory addresses like <code>0x7ffd</code>.</p>' },
        { h: 'Negative numbers: two\'s complement', p: '<p>To store −5 in 8 bits: take 5 (<code>00000101</code>), invert every bit (<code>11111010</code>), add 1 → <code>11111011</code>. Addition then works unchanged for negatives, which is why hardware uses it. The top bit ends up acting as a sign bit.</p>' }
      ],
      q: [
        { t: 'gen', g: 'bin2dec' },
        { t: 'bits', q: 'Flip the bits to make the number 37.', target: 37, e: '37 = 32 + 4 + 1 = 00100101.' },
        { t: 'fill', q: 'How many different values can 10 bits represent?', a: ['1024', '2^10'], e: '2¹⁰ = 1024.' },
        { t: 'gen', g: 'dec2hex' },
        { t: 'mc', q: 'Why is hexadecimal used so often in computing?', o: ['One hex digit maps exactly to 4 bits', 'Computers calculate in base 16 internally', 'It is the only base with letters', 'It uses less memory'], a: 0, e: 'Hex is a compact human-readable view of binary; the machine is still working in bits.' },
        { t: 'gen', g: 'twos' }
      ]
    },
    {
      id: 's1-data', title: 'Representing everything as numbers', icon: '🎞️', topics: ['How computers represent data'],
      learn: [
        { h: 'Text: bytes with an agreed meaning', p: '<p><b>ASCII</b> gave 128 characters one byte each: <code>A</code> = 65, <code>a</code> = 97, <code>0</code> = 48. <b>Unicode</b> extends this to every writing system plus emoji, and <b>UTF-8</b> encodes those code points in 1–4 bytes, staying compatible with ASCII.</p><p>"Mojibake" — <code>â€™</code> where an apostrophe should be — is a file written in one encoding and read as another.</p>' },
        { h: 'Images, sound and video', p: '<ul><li><b>Image</b>: a grid of pixels, each usually 3 bytes (red, green, blue). 1920×1080×3 ≈ 6 MB raw, which is why JPEG and PNG compress.</li><li><b>Sound</b>: amplitude sampled 44,100 times a second, 16 bits per sample per channel.</li><li><b>Video</b>: images per second, compressed mostly by storing what <i>changed</i> between frames.</li></ul>' },
        { h: 'Lossless vs lossy', p: '<p><b>Lossless</b> (PNG, ZIP, FLAC) rebuilds the original bit for bit. <b>Lossy</b> (JPEG, MP3, H.264) throws away detail humans barely notice to get far smaller files. Editing and re-saving a lossy file repeatedly degrades it every time.</p>' }
      ],
      q: [
        { t: 'mc', q: 'A 4000×3000 photo stored raw at 3 bytes per pixel takes about:', o: ['36 MB', '12 KB', '360 MB', '3.6 GB'], a: 0, e: '4000 × 3000 × 3 = 36,000,000 bytes ≈ 36 MB. A JPEG of the same photo might be 3 MB.' },
        { t: 'tf', q: 'Saving a JPEG repeatedly, editing it each time, loses quality with every save.', a: true, e: 'JPEG is lossy: each re-encode throws away more detail. Work in a lossless format and export to JPEG once.' },
        { t: 'fill', q: 'The encoding that represents any Unicode character in 1 to 4 bytes and is backwards compatible with ASCII is called ___.', a: ['utf-8', 'utf8'], e: 'UTF-8 dominates the web for exactly those two reasons.' },
        { t: 'mc', q: 'Text appears as `Ã©` instead of `é`. The most likely cause is:', o: ['The file was written as UTF-8 and read as a single-byte encoding', 'The font is missing', 'The file is corrupted beyond repair', 'The screen resolution is too low'], a: 0, e: 'An encoding mismatch: the two bytes of a UTF-8 é were each shown as their own character.' },
        { t: 'match', q: 'Match the format to its kind of compression.', p: [['PNG', 'Lossless image'], ['JPEG', 'Lossy image'], ['FLAC', 'Lossless audio'], ['MP3', 'Lossy audio']], e: 'Lossless can rebuild the original exactly; lossy trades fidelity for size.' }
      ]
    },
    {
      id: 's1-logic', title: 'Logic gates and circuits', icon: '🔌', topics: ['Logic gates', 'Boolean logic'], lab: 'gates',
      learn: [
        { h: 'Three gates are enough for everything', p: '<p>Gates are switches made of transistors that compute on 0 and 1:</p><ul><li><b>AND</b> — 1 only if both inputs are 1</li><li><b>OR</b> — 1 if at least one input is 1</li><li><b>NOT</b> — flips the input</li></ul><p>From those you build <b>XOR</b> (1 when inputs differ), <b>NAND</b> and <b>NOR</b>. NAND alone can build every other gate, which is convenient because it is cheap in silicon.</p>' },
        { h: 'From gates to arithmetic', p: '<p>A <b>half adder</b> adds two bits: Sum = A XOR B, Carry = A AND B. A <b>full adder</b> also takes a carry in. Chain eight full adders and you can add two bytes. Chain, repeat and add some control logic and you have the ALU inside a CPU.</p><p>There is no arithmetic circuit hiding underneath: addition <i>is</i> gates.</p>', lab: 'gates' },
        { h: 'Boolean algebra is the same idea in code', p: '<p>De Morgan\'s laws let you rewrite conditions: <code>not (a and b) == (not a) or (not b)</code>. You will use this constantly to simplify <code>if</code> statements.</p>' }
      ],
      q: [
        { t: 'gen', g: 'gate' },
        { t: 'mc', q: 'Which gate outputs 1 exactly when its two inputs are different?', o: ['XOR', 'AND', 'NOR', 'NOT'], a: 0, e: 'XOR is "exclusive or": 1 when the inputs disagree. It is the sum bit of a half adder.' },
        { t: 'fill', q: 'In a half adder, the carry output is produced by an ___ gate.', a: ['and'], e: 'Carry = A AND B; Sum = A XOR B.' },
        { t: 'mc', q: '`not (raining and cold)` is equivalent to:', o: ['not raining or not cold', 'not raining and not cold', 'raining or cold', 'raining and not cold'], a: 0, e: 'De Morgan\'s law: negating an AND turns it into an OR of the negations.' },
        { t: 'gen', g: 'gate' },
        { t: 'tf', q: 'Every logic gate can be built out of NAND gates alone.', a: true, e: 'NAND (and NOR) are functionally complete. Chip designers exploit this heavily.' }
      ]
    },
    {
      id: 's1-exec', title: 'How a program runs', icon: '⚙️', topics: ['How programs execute', 'Computer architecture basics'], lab: 'cpu',
      learn: [
        { h: 'Fetch, decode, execute — forever', p: '<p>A CPU repeats three steps billions of times a second:</p><ol><li><b>Fetch</b> the instruction at the address in the program counter (PC), then advance the PC.</li><li><b>Decode</b> it: which operation, which operands?</li><li><b>Execute</b> it: compute, read or write memory, or jump.</li></ol><p>Instructions and data live in the same memory — the stored-program idea that makes computers general.</p>', lab: 'cpu' },
        { h: 'Machine code, assembly, high-level code', p: '<p>The CPU only understands <b>machine code</b>: numbers. <b>Assembly</b> is a one-to-one readable form of it. Languages like Python and C++ sit above:</p><ul><li><b>Compiled</b> (C, C++, Rust): translated ahead of time into machine code. Fast, platform-specific.</li><li><b>Interpreted</b> (Python): another program reads your code and acts on it. Slower, portable, quick to iterate.</li></ul>' },
        { h: 'Why a loop is just a jump', p: '<p>There is no "while" in hardware. A loop is a comparison that sets a flag, plus a conditional jump that sets the PC backwards. Every control structure you learn compiles down to compare-and-jump.</p>', code: 'LOADI 5      ; ACC = 5\nloop: OUT    ; print ACC\nSUBI 1       ; ACC = ACC - 1\nJNZ loop     ; if ACC != 0, jump back\nHALT', lang: 'asm' }
      ],
      q: [
        { t: 'order', q: 'Put the CPU cycle in order.', plain: true, o: ['Fetch the instruction at the program counter', 'Decode it into operation and operands', 'Execute it', 'Repeat with the next instruction'], e: 'Fetch, decode, execute, repeat: the heartbeat of every processor.' },
        { t: 'mc', q: 'Which register holds the address of the next instruction?', o: ['Program counter', 'Accumulator', 'Zero flag', 'Cache line'], a: 0, e: 'The PC points at the next instruction and is updated by jumps.' },
        { t: 'predict', q: 'In the CPU lab, what does this program output?', code: 'LOADI 3\nloop: OUT\nSUBI 1\nJNZ loop\nHALT', lang: 'asm', a: ['3\n2\n1', '3 2 1'], e: 'It prints 3, then 2, then 1, and stops when the accumulator hits 0 and the zero flag ends the jump.' },
        { t: 'mc', q: 'The main practical difference between compiled and interpreted languages is:', o: ['When translation to machine code happens', 'Compiled languages cannot use loops', 'Interpreted languages do not use a CPU', 'Compiled languages have no syntax errors'], a: 0, e: 'Ahead of time versus at run time. It drives the speed-versus-flexibility trade.' },
        { t: 'tf', q: 'Instructions and data are stored in separate memories that programs cannot confuse.', a: false, e: 'In the stored-program (von Neumann) design they share memory. That is powerful — and the reason buffer overflows can turn data into executed code.' }
      ]
    }
  ]
});

CS.addStage({
  id: 's2', n: 2, title: 'Programming fundamentals', short: 'Programming', track: 'programming', icon: '📝', pos: [290, 230], prereq: ['s1'],
  blurb: 'Algorithms, variables, control flow, functions and debugging — the ideas every language shares. Examples use Python.',
  nodes: [
    {
      id: 's2-algorithms', title: 'Algorithms, pseudocode and flowcharts', icon: '🧭', topics: ['What programming is', 'Algorithms', 'Pseudocode', 'Flowcharts'],
      learn: [
        { h: 'Programming is precise instruction-giving', p: '<p>An <b>algorithm</b> is a finite, unambiguous sequence of steps that turns an input into an output. "Make it nice" is not an algorithm. "Compare each pair of neighbours and swap them if they are out of order, repeating until no swaps happen" is.</p><p>Code is an algorithm written so a machine can follow it. Getting the algorithm right on paper first is most of the job.</p>' },
        { h: 'Pseudocode: thinking without syntax', p: '<p>Pseudocode is structured English. It lets you reason about the steps without fighting a language.</p>', code: 'SET total TO 0\nFOR each price IN basket\n    SET total TO total + price\nIF total > 100 THEN\n    SET shipping TO 0\nELSE\n    SET shipping TO 5\nOUTPUT total + shipping', lang: 'python' },
        { h: 'Flowcharts show the branches', p: '<p>Standard shapes: oval = start/end, rectangle = process, diamond = decision, parallelogram = input/output. A flowchart is most useful when the control flow is tangled and you need to see every path, including the one you forgot to handle.</p>' }
      ],
      q: [
        { t: 'mc', q: 'Which of these is NOT a property every algorithm must have?', o: ['It must be written in Python', 'It must finish', 'Each step must be unambiguous', 'It must produce an output'], a: 0, e: 'Algorithms are language independent. Finiteness, definiteness and output are the requirements.' },
        { t: 'match', q: 'Match each flowchart shape to its meaning.', p: [['Diamond', 'Decision'], ['Rectangle', 'Process step'], ['Oval', 'Start or end'], ['Parallelogram', 'Input or output']], e: 'Shape carries meaning, which is what makes a flowchart readable at a glance.' },
        { t: 'order', q: 'Order the pseudocode to compute the average of a list of numbers.', o: ['SET total TO 0', 'FOR each n IN numbers: SET total TO total + n', 'SET average TO total / count of numbers', 'OUTPUT average'], e: 'Initialise, accumulate, divide, report. Dividing before accumulating gives the wrong answer.' },
        { t: 'tf', q: 'A recipe that says "bake until it looks done" qualifies as an algorithm.', a: false, e: '"Looks done" is ambiguous. An algorithm needs steps a machine could follow with no judgement.' },
        { t: 'short', q: 'Why write pseudocode before writing real code?', a: [['think', 'logic', 'plan', 'design', 'steps'], ['syntax', 'language', 'without', 'before']], model: 'It lets you get the logic right without being distracted by a language\'s syntax, and it is far cheaper to change.', e: 'Fix the algorithm on paper; typing is the easy part.' }
      ]
    },
    {
      id: 's2-vars', title: 'Variables, types and operators', icon: '📦', topics: ['Variables', 'Data types', 'Operators'],
      learn: [
        { h: 'A variable is a name bound to a value', p: '<p>In Python a variable is a label attached to an object in memory. Assignment re-points the label; it does not copy in place.</p>', code: 'score = 10        # int\nname = "Ada"      # str\nratio = 0.75      # float\nactive = True     # bool\nnothing = None    # NoneType\n\nscore = score + 5 # the label now points at 15' },
        { h: 'Types decide what operations mean', p: '<p><code>"3" + "4"</code> is <code>"34"</code> but <code>3 + 4</code> is <code>7</code>. Python is <b>dynamically typed</b> (the value knows its type, the name does not) and <b>strongly typed</b> (it will not silently mix a string and an int).</p>' },
        { h: 'Operators worth knowing early', p: '<pre>+  -  *  /     # / always gives a float: 7/2 = 3.5\n//             # floor division: 7//2 = 3\n%              # remainder: 7%2 = 1  (even/odd tests)\n**             # power: 2**10 = 1024\n== != < > <= >= # comparison, gives True/False\nand or not     # boolean logic</pre><p><code>%</code> and <code>//</code> show up constantly: clock arithmetic, grouping, alternating rows, digit extraction.</p>' }
      ],
      q: [
        { t: 'predict', q: 'What does this print?', code: 'x = 7\ny = 2\nprint(x / y)\nprint(x // y)\nprint(x % y)', a: ['3.5\n3\n1'], e: '`/` is true division (float), `//` floors, `%` gives the remainder.' },
        { t: 'mc', q: 'What is the value of `"5" + "5"` in Python?', o: ['"55"', '10', '55', 'A TypeError'], a: 0, e: '`+` concatenates strings. Use `int("5") + int("5")` for 10.' },
        { t: 'fill', q: 'Which operator tests whether a number `n` is even? Write the full condition that is True for even numbers.', a: ['n % 2 == 0', 'n%2==0', 'n % 2 == 0:'], mono: true, e: 'The remainder after dividing by 2 is 0 exactly for even numbers.' },
        { t: 'fix', q: 'This should add a number to a total, but crashes with a TypeError. Which line is wrong and what fixes it?', code: 'total = 0\nentry = input("Amount: ")   # returns a string\ntotal = total + entry\nprint(total)', o: ['`total = total + int(entry)` — input() always returns a string', '`total = 0.0` — the total must be a float', '`print(str(total))` — printing needs a string', '`entry = "Amount: "` — the prompt is wrong'], a: 0, e: 'input() returns text. Convert it before arithmetic. This is the most common beginner bug in any language.' },
        { t: 'tf', q: 'In Python you must declare a variable\'s type before using it.', a: false, e: 'Python infers it at run time. Type hints exist and are useful, but they are optional and not enforced by the interpreter.' }
      ]
    },
    {
      id: 's2-control', title: 'Conditions and loops', icon: '🔀', topics: ['Conditions', 'Loops'],
      learn: [
        { h: 'if / elif / else chooses a path', p: '<p>Order matters: the first true branch wins and the rest are skipped. Indentation defines the block in Python.</p>', code: 'if score >= 90:\n    grade = "A"\nelif score >= 80:\n    grade = "B"\nelse:\n    grade = "C"' },
        { h: 'for repeats over items; while repeats on a condition', p: '<pre>for i in range(5):        # 0,1,2,3,4\nfor name in ["a","b"]:    # each item\nwhile guess != answer:    # until something changes</pre><p>Use <code>for</code> when you know the collection or count, <code>while</code> when you are waiting for a condition. A <code>while</code> whose condition never changes is the classic infinite loop.</p>', code: 'total = 0\nfor n in range(1, 6):\n    total += n        # 1+2+3+4+5\nprint(total)          # 15' },
        { h: 'break, continue and the off-by-one trap', p: '<p><code>break</code> leaves the loop entirely, <code>continue</code> skips to the next iteration. <code>range(1, 5)</code> includes 1 but stops before 5 — half-open ranges avoid a whole class of length errors once you are used to them.</p>' }
      ],
      q: [
        { t: 'predict', q: 'What does this print?', code: 'for i in range(1, 6):\n    if i % 2 == 0:\n        continue\n    print(i)', a: ['1\n3\n5'], e: '`continue` skips the even numbers before reaching print.' },
        { t: 'mc', q: 'A score of 95 goes through `if score >= 80: "B" elif score >= 90: "A"`. What is the result?', o: ['"B", because the first true branch wins', '"A", because 95 is higher', 'Both run', 'An error'], a: 0, e: 'Condition order matters. Test the most specific or highest threshold first.' },
        { t: 'fill', q: 'A loop that never ends because its condition never becomes false is called an ___ loop.', a: ['infinite', 'endless'], e: 'Usually caused by forgetting to change the variable in the condition.' },
        { t: 'predict', q: 'How many lines does this print?', code: 'i = 0\nwhile i < 3:\n    print("tick")\n    i += 1', a: ['tick\ntick\ntick'], e: 'Three iterations: i is 0, 1, 2 and then the condition fails.' },
        { t: 'fix', q: 'This should print the numbers 1 to 5 but prints nothing. What is wrong?', code: 'for i in range(1, 1):\n    print(i)', o: ['`range(1, 6)` — range stops before the second argument', '`range(1, 5)` — 5 items starting at 1', '`for i in 1..5` — wrong syntax', 'Nothing; it is correct'], a: 0, e: 'range(a, b) is half-open: it yields a up to b-1. range(1,1) is empty.' }
      ]
    },
    {
      id: 's2-functions', title: 'Functions and input/output', icon: '🧰', topics: ['Functions', 'Input/output'],
      learn: [
        { h: 'A function is a named, reusable block', p: '<p>It takes <b>parameters</b>, does work, and usually <b>returns</b> a value. Functions are how you stop repeating yourself and how you make code testable.</p>', code: 'def area(width, height):\n    """Return the area of a rectangle."""\n    return width * height\n\nprint(area(3, 4))        # 12\nprint(area(height=2, width=5))  # 10, keyword arguments' },
        { h: 'Return is not print', p: '<p><code>print</code> shows a value to a human. <code>return</code> hands a value back to the calling code so it can be used. A function that prints but does not return gives back <code>None</code>, and <code>total = show(x)</code> then silently sets total to None.</p>' },
        { h: 'Getting data in and out', p: '<p><code>input()</code> reads a line of text from the user (always a string). <code>print()</code> writes to standard output. Later you will read files, arguments and network responses, but the shape stays the same: get data, transform it, emit it.</p>', code: 'name = input("Your name: ")\nprint(f"Hello, {name}! Your name is {len(name)} letters long.")' }
      ],
      q: [
        { t: 'predict', q: 'What does this print?', code: 'def double(n):\n    print(n * 2)\n\nresult = double(5)\nprint(result)', a: ['10\nNone'], e: 'The function prints 10 but returns nothing, so `result` is None. Use `return n * 2`.' },
        { t: 'mc', q: 'Why use functions instead of repeating code?', o: ['One place to fix bugs, plus reuse and testability', 'They make programs run in parallel', 'They use less disk space', 'Python requires them'], a: 0, e: 'A bug in a repeated block must be fixed everywhere. A bug in a function is fixed once.' },
        { t: 'fill', q: 'The values you pass into a function when calling it are called ___.', a: ['arguments', 'args', 'argument'], e: 'Parameters are the names in the definition; arguments are the values at the call site.' },
        { t: 'code', q: 'Write a function `celsius_to_f(c)` that converts Celsius to Fahrenheit using `c * 9/5 + 32`.', starter: 'def celsius_to_f(c):\n    # your code here\n    pass\n', tests: 'assert celsius_to_f(0) == 32, "0C should be 32F"\nassert celsius_to_f(100) == 212, "100C should be 212F"\nassert abs(celsius_to_f(37) - 98.6) < 0.01, "37C should be about 98.6F"\nprint("Looks right.")', sol: 'def celsius_to_f(c):\n    return c * 9 / 5 + 32', hint: 'Use `return`, not `print`. The tests compare the returned value.', e: 'Returning the value lets the caller use it; printing would not.' },
        { t: 'tf', q: '`input()` returns a number when the user types digits.', a: false, e: 'It always returns a string. Convert with int() or float() before doing arithmetic.' }
      ]
    },
    {
      id: 's2-debug', title: 'Errors, debugging and problem solving', icon: '🐞', topics: ['Debugging', 'Errors', 'Problem solving'],
      learn: [
        { h: 'Three kinds of error', p: '<ul><li><b>Syntax error</b> — the code cannot be parsed. Caught before anything runs.</li><li><b>Runtime error</b> (exception) — it starts, then fails: dividing by zero, opening a missing file.</li><li><b>Logic error</b> — it runs and gives the wrong answer. No error message. The dangerous one.</li></ul>' },
        { h: 'Read the traceback from the bottom', p: '<p>The last line names the error type and message; the lines above show the call chain. The lowest line of <i>your</i> code in the trace is usually where to look first.</p>', code: 'Traceback (most recent call last):\n  File "app.py", line 12, in <module>\n    print(average(scores))\n  File "app.py", line 8, in average\n    return total / len(values)\nZeroDivisionError: division by zero', lang: 'python' },
        { h: 'A debugging method that works', p: '<ol><li><b>Reproduce</b> it reliably. A bug you cannot trigger cannot be fixed.</li><li><b>Localise</b> it: print or breakpoint halfway; is the value already wrong here? Binary-search the code.</li><li><b>Check your assumptions</b> — print the actual value and type, do not trust what you think it is.</li><li><b>Change one thing</b> at a time, then verify.</li></ol><p>Explaining the problem out loud, line by line, solves a surprising share of bugs before you finish the sentence.</p>' }
      ],
      q: [
        { t: 'match', q: 'Match each failure to its error category.', p: [['Missing colon after `if x > 3`', 'Syntax error'], ['Dividing by a variable that is zero', 'Runtime error'], ['Average computed with the wrong divisor', 'Logic error'], ['Calling a function that does not exist', 'Runtime error (NameError)']], e: 'Logic errors are the ones no message warns you about.' },
        { t: 'mc', q: 'In a traceback, which line usually tells you the error type?', o: ['The last line', 'The first line', 'The file name line', 'None; you must guess'], a: 0, e: 'Read the bottom line first: type and message. Then walk upwards to find your own code.' },
        { t: 'fix', q: 'This averages a list but crashes on an empty list. Which fix is best?', code: 'def average(values):\n    return sum(values) / len(values)', o: ['Return 0 (or raise a clear error) when `values` is empty', 'Wrap the whole program in try/except and ignore it', 'Use `sum(values) / (len(values) + 1)`', 'Convert values to a string first'], a: 0, e: 'Handle the edge case explicitly. Adding 1 to the divisor silently returns wrong numbers, which is worse than crashing.' },
        { t: 'order', q: 'Order an effective debugging process.', plain: true, o: ['Reproduce the bug reliably', 'Narrow down where the value first goes wrong', 'Check your assumption by printing the real value and type', 'Change one thing and re-test'], e: 'Reproduce, localise, verify assumptions, change one thing. Random edits hide bugs rather than fix them.' },
        { t: 'tf', q: 'Code that runs without any error message is definitely correct.', a: false, e: 'That is exactly what a logic error looks like. Tests, not the absence of exceptions, tell you it is right.' }
      ]
    }
  ]
});
