/* Stages 9-12: computer architecture, operating systems, networking, databases. */
CS.addStage({
  id: 's9', n: 9, title: 'Computer architecture', short: 'Architecture', track: 'systems', icon: '🏭', pos: [290, 140], prereq: ['s1'],
  blurb: 'From transistors to pipelines and GPUs: how a pile of switches becomes a processor that runs your code.',
  nodes: [
    {
      id: 'ar-transistors', title: 'Transistors, gates and circuits', icon: '🔋', topics: ['Transistors', 'Logic gates', 'Boolean logic', 'Circuits'], lab: 'gates',
      learn: [
        { h: 'A transistor is a voltage-controlled switch', p: '<p>Apply voltage to the gate terminal and current flows between the other two. Combine a few and you get a logic gate; a modern CPU has tens of billions of them, each a few nanometres across.</p><p>Moore\'s law described the doubling of transistor count roughly every two years. It has slowed, which is why the industry turned to more cores, specialised accelerators and better memory systems instead of higher clocks.</p>' },
        { h: 'Combinational vs sequential', p: '<p><b>Combinational</b> circuits (adders, multiplexers, decoders) depend only on their current inputs. <b>Sequential</b> circuits (flip-flops, registers, counters) also depend on stored state and a clock. Memory exists because a feedback loop of gates can hold a bit.</p>' },
        { h: 'The clock', p: '<p>A clock signal synchronises state changes. 3 GHz means three billion ticks per second — about 0.33 ns each, during which a signal travels roughly 10 cm. Speed of light is a real design constraint at this scale.</p>' }
      ],
      q: [
        { t: 'mc', q: 'What is a transistor, functionally?', o: ['An electrically controlled switch', 'A tiny battery', 'A memory cell only', 'A signal amplifier only'], a: 0, e: 'Switching is what makes digital logic possible; amplification is the analogue use.' },
        { t: 'mc', q: 'Which is a sequential circuit?', o: ['A flip-flop that stores one bit', 'A full adder', 'A multiplexer', 'A decoder'], a: 0, e: 'Sequential circuits have state and respond to a clock; combinational ones are pure functions of their inputs.' },
        { t: 'gen', g: 'gate' },
        { t: 'fill', q: 'A 4 GHz clock ticks ___ billion times per second.', a: ['4', 'four'], e: 'Each tick is 0.25 nanoseconds.' },
        { t: 'mc', q: 'Why did the industry shift to multi-core rather than ever-higher clock speeds?', o: ['Power and heat scale badly with frequency', 'Multi-core is simpler to program', 'Transistors stopped shrinking entirely', 'Software demanded fewer instructions'], a: 0, e: 'Dynamic power grows with frequency and voltage; past ~4 GHz the heat is impractical to remove.' }
      ]
    },
    {
      id: 'ar-alu', title: 'ALU, registers and the datapath', icon: '➕', topics: ['ALU', 'Registers', 'CPU'], lab: 'cpu',
      learn: [
        { h: 'The ALU does the arithmetic', p: '<p>An arithmetic logic unit takes two operands and a control code, and produces a result plus flags (zero, negative, carry, overflow). It is built from adders and gates — the circuit you assembled in the gates lab, widened to 64 bits.</p>' },
        { h: 'Registers are the fastest storage', p: '<p>A handful of named locations inside the CPU, accessed in a single cycle. x86-64 has 16 general-purpose registers; ARM has 31. Compilers work hard at <b>register allocation</b> because spilling a value to memory is orders of magnitude slower.</p><p>Special registers: PC (next instruction), IR (current instruction), SP (stack pointer), status/flags.</p>' },
        { h: 'The datapath ties it together', p: '<p>Control logic decodes each instruction and steers data: registers → ALU → registers or memory. The CPU lab is a miniature version, with an accumulator instead of a register file.</p>' }
      ],
      q: [
        { t: 'mc', q: 'What does an ALU produce besides its result?', o: ['Status flags such as zero, carry and overflow', 'The next instruction', 'A cache line', 'A memory address only'], a: 0, e: 'Conditional jumps read those flags: that is how if statements work in hardware.' },
        { t: 'mc', q: 'Why do compilers try hard to keep values in registers?', o: ['Register access is a single cycle; memory is far slower', 'Registers are unlimited', 'Memory cannot hold integers', 'Registers are shared between cores'], a: 0, e: 'Spilling to the stack costs cache accesses at best.' },
        { t: 'match', q: 'Match each register to its role.', p: [['PC', 'Address of the next instruction'], ['IR', 'The instruction being executed'], ['SP', 'Top of the call stack'], ['Flags', 'Results of the last comparison']], e: 'Every architecture has some version of these four.' },
        { t: 'fill', q: 'The unit that performs addition, subtraction and bitwise operations inside a CPU is the ___ (three letters).', a: ['alu', 'arithmetic logic unit'], e: 'Arithmetic Logic Unit.' },
        { t: 'tf', q: 'A CPU has thousands of general-purpose registers.', a: false, e: 'Typically 16 to 32. They are expensive in area and must be addressable with a few instruction bits.' }
      ]
    },
    {
      id: 'ar-isa', title: 'Instruction sets, machine code and assembly', icon: '📜', topics: ['Instruction sets', 'Machine code', 'Assembly'], lab: 'cpu',
      learn: [
        { h: 'The ISA is the contract', p: '<p>An instruction set architecture defines the instructions, registers and memory model that software can rely on. x86-64 is <b>CISC</b> (many complex instructions, variable length); ARM and RISC-V are <b>RISC</b> (fewer, fixed-size, simpler to pipeline). Modern x86 chips translate CISC instructions into RISC-like micro-ops internally.</p>' },
        { h: 'What an instruction looks like', p: '<p>Opcode plus operands, encoded in bits. Assembly is a readable form of the same thing:</p>', code: 'mov  rax, [rbp-8]   ; load a local variable into rax\nadd  rax, 1         ; increment\nmov  [rbp-8], rax   ; store it back\ncmp  rax, 10        ; compare, setting flags\njl   loop_start     ; jump if less', lang: 'asm' },
        { h: 'Why bother reading assembly', p: '<p>To understand what the compiler really did, to debug optimised code, to reason about performance, and to work in security where exploits operate at this level. You rarely write it; being able to read it is a genuine advantage.</p>' }
      ],
      q: [
        { t: 'mc', q: 'What is the main difference between RISC and CISC?', o: ['RISC has fewer, simpler, fixed-length instructions', 'RISC chips are always faster', 'CISC has no registers', 'RISC cannot run compiled code'], a: 0, e: 'Simplicity makes pipelining and decoding cheaper, which suits power-constrained designs like ARM.' },
        { t: 'predict', q: 'Using the CPU lab instruction set, what does this leave in the accumulator?', code: 'LOADI 4\nADDI 3\nSUBI 2\nHALT', lang: 'asm', a: ['5'], e: '4 + 3 − 2 = 5.' },
        { t: 'fill', q: 'A human-readable one-to-one representation of machine code is called ___ language.', a: ['assembly', 'assembler'], e: 'An assembler translates it to the binary encoding.' },
        { t: 'mc', q: 'Modern x86 processors internally:', o: ['Decode complex instructions into simpler micro-operations', 'Interpret Python directly', 'Execute assembly text', 'Run only RISC instructions supplied by the compiler'], a: 0, e: 'The CISC interface is preserved for compatibility; the engine underneath is RISC-like.' },
        { t: 'tf', q: 'Code compiled for x86-64 runs unmodified on an ARM processor.', a: false, e: 'Different ISAs. It must be recompiled, or translated by software such as Rosetta or QEMU.' }
      ]
    },
    {
      id: 'ar-memory', title: 'Caches and the memory hierarchy', icon: '🗂️', topics: ['Cache', 'RAM', 'Memory hierarchy'], lab: 'cache',
      learn: [
        { h: 'Small and fast, or large and slow', p: '<pre>registers  ~1 KB     ~0.3 ns\nL1 cache   ~64 KB    ~1 ns\nL2 cache   ~1 MB     ~4 ns\nL3 cache   ~32 MB    ~12 ns\nRAM        ~32 GB    ~80 ns\nSSD        ~1 TB     ~50 µs</pre><p>The hierarchy exists because fast memory is expensive per byte. Caches make the common case fast.</p>' },
        { h: 'Locality is why caching works', p: '<p><b>Temporal</b>: data used now is likely to be used again soon. <b>Spatial</b>: data next to it is likely to be used soon, so memory moves in 64-byte <b>cache lines</b>, not single bytes.</p><p>This is why iterating a 2D array row by row can be several times faster than column by column: one fetch serves many consecutive accesses.</p>' },
        { h: 'Hits, misses and mapping', p: '<p>An address splits into tag, index and offset. Direct-mapped caches are simple but suffer conflicts; set-associative caches give each index several ways. Miss types: compulsory (first touch), capacity (working set too big), conflict (bad mapping).</p>' }
      ],
      q: [
        { t: 'mc', q: 'Roughly how much slower is a RAM access than an L1 cache hit?', o: ['About 50–100 times', 'About twice', 'About 10 times', 'About 10,000 times'], a: 0, e: '~1 ns versus ~80 ns. This gap is why cache-friendly code matters.' },
        { t: 'mc', q: 'Why is row-major traversal of a 2D array usually faster than column-major in C or NumPy?', o: ['Consecutive elements share cache lines, so each miss loads several useful values', 'Rows are stored in registers', 'Columns require more instructions', 'The compiler forbids column access'], a: 0, e: 'Spatial locality: same algorithm, same big-O, several times the speed.' },
        { t: 'match', q: 'Match each miss type to its cause.', p: [['Compulsory miss', 'First ever access to that data'], ['Capacity miss', 'Working set is larger than the cache'], ['Conflict miss', 'Addresses map to the same set'], ['Cache hit', 'Data was already present']], e: 'Knowing which kind you have tells you whether to change the data layout or the algorithm.' },
        { t: 'fill', q: 'Memory is transferred between RAM and cache in blocks called cache ___.', a: ['lines', 'line', 'blocks'], e: 'Typically 64 bytes.' },
        { t: 'tf', q: 'Adding more RAM always fixes a program that is slow because of cache misses.', a: false, e: 'Cache size and access patterns are the issue. Improving locality is the fix.' }
      ]
    },
    {
      id: 'ar-pipeline', title: 'Pipelines and branch prediction', icon: '🚄', topics: ['CPU pipelines', 'Branch prediction'],
      learn: [
        { h: 'Overlap the stages', p: '<p>Rather than finishing one instruction before starting the next, split execution into stages (fetch, decode, execute, memory, write-back) and keep all of them busy. Throughput approaches one instruction per cycle even though each still takes five.</p>' },
        { h: 'Hazards', p: '<ul><li><b>Data hazard</b> — an instruction needs a result that is not ready; solved by forwarding or stalling.</li><li><b>Control hazard</b> — a branch means the next address is unknown.</li><li><b>Structural hazard</b> — two instructions want the same unit.</li></ul>' },
        { h: 'Prediction and speculation', p: '<p>Rather than stall on every branch, the CPU predicts the outcome and executes speculatively. Modern predictors are over 95% accurate; a misprediction costs 15–20 cycles of discarded work. This is why sorted data can make a branchy loop dramatically faster, and why speculation created the Spectre and Meltdown vulnerabilities.</p>' }
      ],
      q: [
        { t: 'mc', q: 'What does pipelining improve?', o: ['Throughput: more instructions finish per second', 'Latency of a single instruction', 'Cache size', 'Clock speed'], a: 0, e: 'Each instruction still takes the same time, but several are in flight at once.' },
        { t: 'mc', q: 'A branch misprediction costs roughly:', o: ['15–20 cycles of discarded work', 'One cycle', 'Nothing, predictions are free', 'A full context switch'], a: 0, e: 'The pipeline must be flushed and refilled from the correct address.' },
        { t: 'mc', q: 'Why can a loop over sorted data run faster than over shuffled data, with identical code?', o: ['The branch becomes predictable, so speculation rarely fails', 'Sorted data compresses better', 'Sorted arrays fit in registers', 'The compiler removes the branch'], a: 0, e: 'A famous StackOverflow result, and a real effect in tight loops.' },
        { t: 'fill', q: 'When an instruction needs a result that is still being computed, that is a ___ hazard.', a: ['data'], e: 'Forwarding paths send the result directly to the waiting stage.' },
        { t: 'tf', q: 'Speculative execution has been the root cause of real security vulnerabilities.', a: true, e: 'Spectre and Meltdown leaked data through side effects of speculated work that was later discarded.' }
      ]
    },
    {
      id: 'ar-parallel', title: 'GPUs and parallel computing', icon: '🧮', topics: ['GPU architecture', 'Parallel computing'],
      learn: [
        { h: 'Latency machines vs throughput machines', p: '<p>A CPU minimises the time for one thread: big caches, deep pipelines, branch prediction. A GPU maximises total work: thousands of simple cores running the same instruction on different data (SIMT), hiding memory latency by switching between many warps of threads.</p>' },
        { h: 'When the GPU wins', p: '<p>When the work is large, regular and independent: matrix multiplication, convolutions, rendering, simulations. It loses on branchy, sequential, latency-sensitive code — and data must be transferred over PCIe, which can dominate for small jobs.</p>' },
        { h: 'Amdahl\'s law', p: '<p>If a fraction s of a program is inherently serial, the maximum speed-up from infinite cores is 1/s. Ten percent serial caps you at 10×, no matter the hardware. This is the honest ceiling on parallelism, and the reason algorithm choice usually beats buying more cores.</p>' }
      ],
      q: [
        { t: 'mc', q: 'What is a GPU optimised for?', o: ['Throughput on many identical independent operations', 'Minimising the latency of a single thread', 'Branch-heavy control flow', 'Disk access'], a: 0, e: 'Thousands of simple cores in lockstep, which is exactly what tensor maths needs.' },
        { t: 'mc', q: 'A program is 20% inherently serial. The best possible speed-up with unlimited cores is:', o: ['5×', '20×', '80×', 'Unlimited'], a: 0, e: 'Amdahl\'s law: 1 / 0.2 = 5.' },
        { t: 'mc', q: 'Which task is a poor fit for a GPU?', o: ['Parsing a configuration file with many branches', 'Multiplying two 4096×4096 matrices', 'Applying a filter to every pixel', 'Training a neural network'], a: 0, e: 'Small, sequential and branchy. Divergent branches serialise a warp.' },
        { t: 'fill', q: 'Copying data between host RAM and GPU memory happens over the ___ bus, and can dominate small jobs.', a: ['pcie', 'pci express', 'pci-e'], e: 'Keeping data resident on the device is a core optimisation.' },
        { t: 'tf', q: 'Doubling the number of cores roughly halves the runtime of any program.', a: false, e: 'Only for perfectly parallel work. Amdahl\'s law and coordination overhead bound real gains.' }
      ]
    }
  ]
});

CS.addStage({
  id: 's10', n: 10, title: 'Operating systems', short: 'Operating systems', track: 'systems', icon: '🧷', pos: [290, 60], labelUp: true, prereq: ['s9'],
  blurb: 'Processes, scheduling, virtual memory, file systems and concurrency: how one machine runs everything at once without chaos.',
  nodes: [
    {
      id: 'os-processes', title: 'Processes, threads and system calls', icon: '⚙️', topics: ['Processes', 'Threads', 'Kernels', 'System calls'],
      learn: [
        { h: 'Process vs thread', p: '<p>A <b>process</b> is a running program with its own memory space, file handles and identity. A <b>thread</b> is a unit of execution inside a process; threads share memory, which makes communication fast and data races possible.</p><p>Isolation is the trade: a crashed process cannot corrupt another; a crashed thread takes the whole process with it.</p>' },
        { h: 'User mode, kernel mode, system calls', p: '<p>The CPU runs your code in user mode, which cannot touch hardware. To read a file or open a socket, the program makes a <b>system call</b>, which traps into kernel mode, does the privileged work and returns. This boundary is the foundation of all OS security.</p>', code: 'strace ls        # watch the system calls a command makes\n# openat, read, write, close, mmap, execve, fork, clone', lang: 'bash' },
        { h: 'Context switching', p: '<p>To switch tasks the kernel saves the registers and state of one thread and restores another\'s. It costs microseconds plus the cache pollution afterwards, which is why thousands of threads perform worse than a few threads with an event loop.</p>' }
      ],
      q: [
        { t: 'mc', q: 'What do threads within one process share?', o: ['The same memory space and open file handles', 'Nothing; they are fully isolated', 'Only the CPU core', 'Only the program counter'], a: 0, e: 'Shared memory is why they are cheap to coordinate and why locks are needed.' },
        { t: 'mc', q: 'Why does opening a file require a system call?', o: ['User-mode code cannot access hardware directly; the kernel mediates', 'Files are stored in the kernel', 'System calls are faster than function calls', 'It is only required on Linux'], a: 0, e: 'The user/kernel boundary is what enforces permissions and isolation.' },
        { t: 'match', q: 'Match each item to its scope.', p: [['Process', 'Own memory space'], ['Thread', 'Shares memory with siblings'], ['Kernel', 'Privileged mode'], ['System call', 'Controlled entry into the kernel']], e: 'These four terms explain most OS behaviour you will meet in practice.' },
        { t: 'tf', q: 'Creating a process is generally more expensive than creating a thread.', a: true, e: 'A new address space and page tables are needed; threads reuse the process\'s.' },
        { t: 'mc', q: 'One thread crashes with a segmentation fault. What happens?', o: ['The whole process usually dies', 'Only that thread stops, others continue safely', 'The OS restarts it automatically', 'Nothing happens'], a: 0, e: 'Shared memory means shared fate, which is an argument for process isolation in critical services.' }
      ]
    },
    {
      id: 'os-sched', title: 'Scheduling', icon: '⏱️', topics: ['Scheduling'],
      learn: [
        { h: 'The scheduler decides who runs next', p: '<p>With more runnable threads than cores, the kernel picks. Goals conflict: throughput, low latency, fairness, meeting deadlines, and keeping interactive apps responsive.</p>' },
        { h: 'Classic policies', p: '<pre>FCFS             simple; a long job blocks everyone (convoy effect)\nShortest job first optimal average wait; needs to know durations; can starve long jobs\nRound robin      each gets a time slice; fair, good for interactivity\nPriority + aging boost waiting tasks to prevent starvation\nCFS (Linux)      tracks virtual runtime; runs whoever has had least CPU</pre>' },
        { h: 'Preemption and quantum size', p: '<p>Preemptive scheduling interrupts a task when its slice expires, so no program can hog the CPU. Short slices improve responsiveness but add context-switch overhead; long slices do the reverse. Real-time systems add deadline guarantees instead of fairness.</p>' }
      ],
      q: [
        { t: 'mc', q: 'Round-robin scheduling primarily improves:', o: ['Responsiveness and fairness between tasks', 'Total throughput', 'Memory use', 'Disk latency'], a: 0, e: 'Everyone gets the CPU regularly, so interactive tasks stay responsive.' },
        { t: 'mc', q: 'What is starvation in scheduling?', o: ['A task never gets CPU time because higher-priority work keeps arriving', 'A task runs out of memory', 'The CPU idles with work available', 'Two tasks wait on each other'], a: 0, e: 'Aging raises the priority of long-waiting tasks to prevent it. Mutual waiting is deadlock, which is different.' },
        { t: 'mc', q: 'A very short time quantum causes:', o: ['More context switches and higher overhead', 'Starvation of short jobs', 'Deadlock', 'Fragmentation'], a: 0, e: 'Responsiveness improves up to a point, then switching cost dominates.' },
        { t: 'fill', q: 'A scheduler that can interrupt a running task when its time slice expires is called ___.', a: ['preemptive'], e: 'Cooperative scheduling relies on tasks yielding, which one bad program can break.' },
        { t: 'tf', q: 'Shortest-job-first gives the minimum average waiting time when job lengths are known.', a: true, e: 'Provably optimal for average wait, but it needs knowledge of durations and can starve long jobs.' }
      ]
    },
    {
      id: 'os-memory', title: 'Memory management and virtual memory', icon: '🧠', topics: ['Memory management', 'Virtual memory'],
      learn: [
        { h: 'Every process sees its own address space', p: '<p>Programs use virtual addresses; the MMU translates them to physical ones through page tables, typically in 4 KB pages. Two processes can both "use" address 0x400000 and never collide. Isolation, relocation and sharing all come from this indirection.</p>' },
        { h: 'Paging and page faults', p: '<p>Not all pages need to be resident. A <b>page fault</b> traps to the kernel, which loads the page from disk (or the file it is mapped from) and resumes. Too much of this is <b>thrashing</b>: the machine spends its time paging instead of computing, which is what a swapping system feels like.</p><p>The <b>TLB</b> caches recent translations, because walking page tables on every access would be ruinous.</p>' },
        { h: 'Stack, heap and fragmentation', p: '<p>The stack grows and shrinks automatically with calls; the heap is explicitly allocated and freed. Repeated allocation of mixed sizes causes <b>external fragmentation</b>: free memory exists but not in one contiguous piece. Allocators, compaction and garbage collectors all fight this.</p>' }
      ],
      q: [
        { t: 'mc', q: 'What does virtual memory provide?', o: ['A private address space per process, translated to physical memory', 'Extra physical RAM', 'Faster CPU caches', 'Automatic garbage collection'], a: 0, e: 'Isolation and flexible placement; swapping to disk is a separate consequence.' },
        { t: 'mc', q: 'What happens on a page fault?', o: ['The kernel loads the missing page and resumes the instruction', 'The process crashes', 'The CPU clock slows', 'The page table is deleted'], a: 0, e: 'Only an invalid access (a segmentation fault) terminates the process.' },
        { t: 'fill', q: 'The cache that stores recent virtual-to-physical address translations is the ___ (three letters).', a: ['tlb', 'translation lookaside buffer'], e: 'A TLB miss means walking the page tables, which is far slower.' },
        { t: 'mc', q: 'A machine slows to a crawl and the disk light stays on with plenty of programs open. This is:', o: ['Thrashing: the working set no longer fits in RAM', 'A CPU bottleneck', 'A network problem', 'Fragmentation of the file system'], a: 0, e: 'Constant paging between RAM and swap. Close programs or add memory.' },
        { t: 'tf', q: 'Two processes can hold the same virtual address pointing to different physical memory.', a: true, e: 'Each process has its own page table. It is also how shared libraries are mapped once and reused.' }
      ]
    },
    {
      id: 'os-fs', title: 'File systems, permissions and drivers', icon: '💾', topics: ['File systems', 'Permissions', 'Drivers'],
      learn: [
        { h: 'From blocks to files', p: '<p>A file system imposes structure on a block device: metadata (inodes) records size, owner, timestamps and the blocks holding the data; directories map names to inodes. This is why a hard link is two names for one inode, while a symlink is a file containing a path.</p>' },
        { h: 'Permissions', p: '<p>Unix permissions are read/write/execute for owner, group and others: <code>rwxr-xr--</code> is 754. On a directory, execute means "may traverse". Windows uses ACLs, which are more expressive and more complex. Principle of least privilege: grant the minimum that works.</p>', code: 'ls -l app.py      # -rwxr-xr--  1 ada  staff  1234 Mar 3 app.py\nchmod 640 secrets.env\nchown ada:staff app.py', lang: 'bash' },
        { h: 'Journals and drivers', p: '<p>A <b>journal</b> records intended changes before making them, so a crash mid-write leaves a recoverable state (ext4, NTFS); copy-on-write designs such as ZFS and btrfs never overwrite live data. <b>Drivers</b> are kernel modules that translate generic requests into device-specific commands, which is why one <code>write()</code> call works for an SSD, a USB stick and a network share.</p>' }
      ],
      q: [
        { t: 'mc', q: 'What does `chmod 640 file` allow?', o: ['Owner read/write, group read, others nothing', 'Everyone read/write', 'Owner only, no access for anyone else', 'Execute for all'], a: 0, e: '6 = rw-, 4 = r--, 0 = ---.' },
        { t: 'mc', q: 'What is the difference between a hard link and a symbolic link?', o: ['A hard link is another name for the same inode; a symlink stores a path', 'A hard link copies the file', 'Symlinks cannot cross directories', 'They are identical'], a: 0, e: 'Delete the original and a hard link still works; a symlink dangles.' },
        { t: 'mc', q: 'Why do file systems keep a journal?', o: ['So an interrupted write leaves a recoverable, consistent state', 'To compress files', 'To speed up reads', 'To store permissions'], a: 0, e: 'Crash consistency: replay or discard the incomplete transaction on mount.' },
        { t: 'fill', q: 'The structure holding a file\'s metadata and block pointers in a Unix file system is called an ___.', a: ['inode', 'i-node'], e: 'The file name lives in the directory; everything else lives in the inode.' },
        { t: 'tf', q: 'Execute permission on a directory means you can run it as a program.', a: false, e: 'On a directory it means you may traverse into it and access entries by name.' }
      ]
    },
    {
      id: 'os-concurrency', title: 'Concurrency, locks and deadlocks', icon: '🔐', topics: ['Concurrency', 'Deadlocks', 'Synchronisation'],
      learn: [
        { h: 'Race conditions', p: '<p>Two threads read-modify-write the same variable, and the result depends on timing. Even <code>counter += 1</code> is three machine steps, so increments get lost. Correctness cannot rely on "it worked when I tested it".</p>' },
        { h: 'The tools', p: '<pre>mutex       one holder at a time\nsemaphore   up to N holders (resource pools)\ncondition   wait for a state change, signalled by another thread\natomic ops  hardware-level compare-and-swap; the basis of lock-free code\nqueues      share by communicating rather than sharing memory</pre>' },
        { h: 'Deadlock needs four conditions', p: '<p>Mutual exclusion, hold-and-wait, no preemption, and circular wait. Break any one and deadlock is impossible — the usual practical rule is a global <b>lock ordering</b>, so every thread acquires locks in the same sequence. Related failures: livelock (busy but making no progress) and starvation.</p>' }
      ],
      q: [
        { t: 'mc', q: 'Two threads each run `counter += 1` a million times and the total is short. Why?', o: ['The read-modify-write is not atomic, so updates are lost', 'Python cannot count that high', 'The CPU overheated', 'Threads run sequentially'], a: 0, e: 'A lost update: both read the same old value and write the same new one.' },
        { t: 'order', q: 'Order the four conditions required for deadlock.', plain: true, o: ['Mutual exclusion: a resource is held exclusively', 'Hold and wait: a thread holds one resource and waits for another', 'No preemption: resources cannot be forcibly taken', 'Circular wait: a cycle of threads each waiting on the next'], e: 'Eliminate any one and deadlock cannot occur. Consistent lock ordering removes the cycle.' },
        { t: 'mc', q: 'The simplest practical rule for avoiding deadlock between multiple locks is:', o: ['Always acquire locks in the same global order', 'Use more locks', 'Make locks recursive', 'Hold locks longer'], a: 0, e: 'No cycle can form if every thread follows the same order.' },
        { t: 'mc', q: 'How does a semaphore differ from a mutex?', o: ['It allows up to N simultaneous holders', 'It cannot block', 'It is only for processes', 'It never needs releasing'], a: 0, e: 'Useful for limiting concurrent access to a pool of N resources, such as database connections.' },
        { t: 'tf', q: 'Passing messages through a queue can remove the need for explicit locks.', a: true, e: '"Share memory by communicating" is the Go and actor-model approach: ownership moves with the message.' }
      ]
    }
  ]
});

CS.addStage({
  id: 's11', n: 11, title: 'Networking', short: 'Networking', track: 'systems', icon: '📡', pos: [170, 400], prereq: ['s1'],
  blurb: 'Addresses, routing, TCP, DNS, HTTP and TLS — traced packet by packet in an interactive lab.',
  nodes: [
    {
      id: 'net-basics', title: 'Networks, layers and client/server', icon: '🌍', topics: ['Internet', 'LAN/WAN', 'Client/server architecture'], lab: 'network',
      learn: [
        { h: 'Layers keep it manageable', p: '<pre>Application  HTTP, DNS, SMTP — what the data means\nTransport    TCP, UDP — delivery to a port, reliability\nInternet     IP — routing between networks\nLink         Ethernet, Wi-Fi — the next hop, MAC addresses</pre><p>Each layer wraps the one above in its own header. Changing Wi-Fi to Ethernet does not affect HTTP at all: that independence is the point.</p>' },
        { h: 'LAN, WAN and the path out', p: '<p>Your devices share a local network; the router forwards anything not local toward your ISP, which forwards toward its peers. No single machine knows the whole route — each router knows only the next hop, which is why the system scales to billions of devices.</p>' },
        { h: 'Client/server and peer-to-peer', p: '<p>A client initiates, a server listens on a port and responds. Peer-to-peer systems let every node do both (BitTorrent, some blockchains). Most of the web is client/server, with caches and CDNs in the middle to keep content near users.</p>' }
      ],
      q: [
        { t: 'order', q: 'Order the layers from closest to the application to closest to the wire.', plain: true, o: ['Application (HTTP)', 'Transport (TCP)', 'Internet (IP)', 'Link (Ethernet/Wi-Fi)'], e: 'Data is wrapped in a header at each step down and unwrapped on the way up.' },
        { t: 'mc', q: 'What does a router do that a switch does not?', o: ['Forward packets between different networks using IP addresses', 'Send frames to a MAC address', 'Provide power over Ethernet', 'Encrypt traffic'], a: 0, e: 'Switches work inside one network on MAC addresses; routers connect networks.' },
        { t: 'mc', q: 'Why are protocols organised in layers?', o: ['Each layer can change independently of the others', 'It makes packets smaller', 'Hardware requires exactly four layers', 'It removes the need for addresses'], a: 0, e: 'Wi-Fi replacing Ethernet does not require rewriting HTTP.' },
        { t: 'fill', q: 'A program that listens on a port and waits for connections is called a ___.', a: ['server'], e: 'The client initiates the connection.' },
        { t: 'tf', q: 'Each router along a path knows the complete route to the destination.', a: false, e: 'It knows only the best next hop. Routing tables are built by protocols like BGP and OSPF.' }
      ]
    },
    {
      id: 'net-addr', title: 'IP, MAC, DHCP and routing', icon: '🏷️', topics: ['IP', 'MAC', 'DHCP', 'Routers', 'Switches'], lab: 'network',
      learn: [
        { h: 'Two kinds of address', p: '<p>A <b>MAC address</b> is burned into a network interface and is used for the next hop on the local link. An <b>IP address</b> is assigned by the network and identifies a host globally. ARP maps an IP to a MAC on the local network.</p>' },
        { h: 'IPv4, subnets and NAT', p: '<p><code>192.168.1.23/24</code> means the first 24 bits are the network and the last 8 identify the host: 254 usable addresses. Private ranges (10.x, 172.16–31.x, 192.168.x) are not routable on the internet, so home routers perform <b>NAT</b>, rewriting private addresses to one public one and tracking the mapping. IPv6\'s 128-bit addresses remove the shortage that made NAT necessary.</p>' },
        { h: 'DHCP hands out the settings', p: '<p>On joining a network a device broadcasts a DHCP request and receives an IP address, subnet mask, default gateway and DNS server, on a lease. That is why a new device works without configuration.</p>' }
      ],
      q: [
        { t: 'gen', g: 'subnet' },
        { t: 'mc', q: 'What does DHCP give a device that has just joined a network?', o: ['An IP address, subnet mask, gateway and DNS server', 'A MAC address', 'A domain name', 'A TLS certificate'], a: 0, e: 'The MAC address is built into the hardware; everything else is assigned.' },
        { t: 'mc', q: 'Why does a home router use NAT?', o: ['Many devices share one public IPv4 address', 'To encrypt traffic', 'To speed up DNS', 'To assign MAC addresses'], a: 0, e: 'It rewrites source addresses and ports and keeps a translation table for replies.' },
        { t: 'fill', q: 'The protocol that resolves an IP address to a MAC address on the local network is ___.', a: ['arp', 'address resolution protocol'], e: 'ARP broadcasts "who has 192.168.1.1?" and caches the answer.' },
        { t: 'mc', q: 'Which address is private and not routable on the public internet?', o: ['192.168.0.15', '8.8.8.8', '93.184.215.14', '1.1.1.1'], a: 0, e: '10.x.x.x, 172.16–31.x.x and 192.168.x.x are reserved for private networks.' }
      ]
    },
    {
      id: 'net-dns', title: 'DNS and ports', icon: '📖', topics: ['DNS', 'Ports'], lab: 'network',
      learn: [
        { h: 'The internet\'s phone book', p: '<p>DNS maps names to addresses through a hierarchy: your resolver asks a root server, then the <code>.com</code> servers, then the domain\'s authoritative servers. Answers are cached for their TTL, which is why a DNS change can take hours to appear everywhere.</p>' },
        { h: 'Record types worth knowing', p: '<pre>A / AAAA   name → IPv4 / IPv6 address\nCNAME      alias to another name\nMX         mail servers\nTXT        arbitrary text: domain verification, SPF, DKIM\nNS         which servers are authoritative</pre>', code: 'dig example.com A +short\nnslookup example.com\ndig example.com MX', lang: 'bash' },
        { h: 'Ports identify the service', p: '<p>An IP address finds the machine; the port finds the program. 80 HTTP, 443 HTTPS, 22 SSH, 53 DNS, 25 SMTP, 5432 PostgreSQL. Ports below 1024 are privileged. "Connection refused" means nothing is listening; a timeout usually means a firewall silently dropped the packet.</p>' }
      ],
      q: [
        { t: 'match', q: 'Match each port to its usual service.', p: [['443', 'HTTPS'], ['22', 'SSH'], ['53', 'DNS'], ['5432', 'PostgreSQL']], e: 'Recognising ports speeds up every debugging session.' },
        { t: 'mc', q: 'You changed a DNS record but some users still reach the old server. Why?', o: ['Cached answers are still within their TTL', 'DNS changes require a reboot', 'The registrar rejected it', 'The old server is hijacking traffic'], a: 0, e: 'Lower the TTL before a planned migration so caches expire quickly.' },
        { t: 'mc', q: 'Which record type maps a hostname to an IPv4 address?', o: ['A', 'MX', 'CNAME', 'TXT'], a: 0, e: 'AAAA does the same for IPv6.' },
        { t: 'mc', q: '"Connection refused" typically means:', o: ['The host was reachable but nothing is listening on that port', 'DNS failed', 'The certificate expired', 'A firewall dropped the packet silently'], a: 0, e: 'A silent drop gives a timeout instead; refusal is an active reset.' },
        { t: 'order', q: 'Order a full recursive DNS lookup.', plain: true, o: ['Ask the configured resolver', 'Resolver asks a root server for .com', 'Resolver asks the .com servers for example.com', 'Resolver asks example.com\'s authoritative server for the record'], e: 'Any step may be skipped if the answer is already cached.' }
      ]
    },
    {
      id: 'net-transport', title: 'TCP and UDP', icon: '🚚', topics: ['TCP', 'UDP'], lab: 'network',
      learn: [
        { h: 'Reliability, or speed', p: '<p><b>TCP</b> gives an ordered, reliable byte stream: three-way handshake, sequence numbers, acknowledgements, retransmission, flow control and congestion control. <b>UDP</b> sends datagrams with none of that — no handshake, no ordering, no retransmission.</p>' },
        { h: 'Where each belongs', p: '<p>TCP: web, email, file transfer, databases — anything where a missing byte ruins the result. UDP: video calls, live streaming, games, DNS queries — where a late packet is worse than a lost one. QUIC (the basis of HTTP/3) rebuilds reliability on top of UDP to avoid TCP\'s head-of-line blocking and to shorten connection setup.</p>' },
        { h: 'The handshake and congestion control', p: '<p>SYN → SYN-ACK → ACK establishes the connection before any data moves, which costs one round trip. TCP then probes for available bandwidth (slow start, congestion avoidance) and backs off when packets are lost. That back-off is why one lossy link can slow a whole transfer.</p>' }
      ],
      q: [
        { t: 'order', q: 'Order the TCP three-way handshake.', plain: true, o: ['Client sends SYN', 'Server replies SYN-ACK', 'Client sends ACK', 'Data transfer begins'], e: 'One full round trip before the first byte of data.' },
        { t: 'mc', q: 'A live video call drops a packet. Why is UDP the right choice?', o: ['Retransmitting a late frame is worse than skipping it', 'UDP guarantees ordering', 'UDP encrypts by default', 'UDP is more reliable'], a: 0, e: 'Freshness beats completeness for real-time media.' },
        { t: 'mc', q: 'Which feature does TCP provide that UDP does not?', o: ['Retransmission of lost segments and in-order delivery', 'Port numbers', 'Checksums', 'Use of IP addresses'], a: 0, e: 'Both have ports and checksums; reliability and ordering are TCP\'s addition.' },
        { t: 'fill', q: 'The protocol underneath HTTP/3, which runs over UDP, is called ___.', a: ['quic'], e: 'QUIC provides reliability, multiplexing and TLS with faster setup.' },
        { t: 'tf', q: 'TCP slows itself down when it detects packet loss.', a: true, e: 'Congestion control treats loss as a signal that the network is saturated.' }
      ]
    },
    {
      id: 'net-web', title: 'HTTP, TLS, WebSockets and APIs', icon: '🔗', topics: ['HTTP', 'HTTPS', 'TLS', 'WebSockets', 'APIs'], lab: 'network',
      learn: [
        { h: 'HTTP is request and response', p: '<pre>GET /users/7 HTTP/1.1        200 OK        success\nHost: api.example.com        201 Created   resource made\nAuthorization: Bearer …      301/302       redirect\n                             400/401/403/404 client errors\n                             500/503       server errors</pre><p>Methods: GET reads (safe), POST creates, PUT replaces, PATCH updates partially, DELETE removes. GET and PUT should be idempotent: repeating them changes nothing further.</p>' },
        { h: 'TLS in one paragraph', p: '<p>The client and server exchange key shares, the server presents a certificate signed by a trusted authority, and both derive the same symmetric session key. After that everything is encrypted and tamper-evident. HTTPS is HTTP inside that tunnel; the padlock proves the domain, not the honesty of its owner.</p>' },
        { h: 'When request/response is not enough', p: '<p><b>WebSockets</b> upgrade an HTTP connection to a persistent two-way channel for chat, live dashboards and multiplayer. <b>Server-sent events</b> stream one way. <b>Polling</b> asks repeatedly and wastes requests. REST APIs use HTTP verbs on resource URLs; GraphQL lets the client ask for exactly the fields it wants.</p>' }
      ],
      q: [
        { t: 'match', q: 'Match each status code to its meaning.', p: [['200', 'Success'], ['404', 'Resource not found'], ['401', 'Not authenticated'], ['500', 'Server error']], e: '4xx is the client\'s problem; 5xx is the server\'s.' },
        { t: 'mc', q: 'Which HTTP method should never change server state?', o: ['GET', 'POST', 'DELETE', 'PATCH'], a: 0, e: 'GET is safe and cacheable. A GET that deletes something breaks caches, prefetchers and crawlers.' },
        { t: 'mc', q: 'What does a valid TLS certificate prove?', o: ['You are talking to the domain named in it, over an encrypted channel', 'The website is honest and safe', 'The server has no vulnerabilities', 'The data is stored encrypted'], a: 0, e: 'Identity of the domain plus confidentiality in transit. Nothing about the operator\'s intentions.' },
        { t: 'mc', q: 'A dashboard needs live updates pushed from the server. The best fit is:', o: ['WebSockets or server-sent events', 'Polling every 50 ms', 'A new GET per second', 'FTP'], a: 0, e: 'A persistent connection avoids the overhead and latency of repeated requests.' },
        { t: 'fill', q: 'An HTTP method is ___ when repeating the same request has no further effect.', a: ['idempotent'], e: 'GET, PUT and DELETE are idempotent; POST is not.' }
      ]
    }
  ]
});

CS.addStage({
  id: 's12', n: 12, title: 'Databases', short: 'Databases', track: 'web', icon: '🗃️', pos: [560, 400], prereq: ['s3'],
  blurb: 'Relational modelling, SQL from SELECT to JOIN, indexes, transactions, and when a document store or cache fits better.',
  nodes: [
    {
      id: 'db-model', title: 'Tables, keys and relationships', icon: '🔑', topics: ['Tables', 'Rows', 'Columns', 'Primary keys', 'Foreign keys', 'Relationships'],
      learn: [
        { h: 'The relational model', p: '<p>A table holds rows (records) with a fixed set of typed columns. A <b>primary key</b> uniquely identifies each row. A <b>foreign key</b> points at another table\'s primary key, and the database enforces that the target exists — referential integrity you get for free.</p>', code: 'CREATE TABLE authors (\n    id    INTEGER PRIMARY KEY,\n    name  TEXT NOT NULL\n);\n\nCREATE TABLE books (\n    id         INTEGER PRIMARY KEY,\n    title      TEXT NOT NULL,\n    author_id  INTEGER REFERENCES authors(id),\n    published  DATE\n);', lang: 'sql' },
        { h: 'Cardinality', p: '<ul><li><b>One-to-many</b> — one author, many books: the foreign key lives on the many side.</li><li><b>Many-to-many</b> — books and tags: needs a join table with both keys.</li><li><b>One-to-one</b> — rarer; usually a table split for size or access control.</li></ul>' },
        { h: 'Constraints do work for you', p: '<p><code>NOT NULL</code>, <code>UNIQUE</code>, <code>CHECK</code>, <code>DEFAULT</code> and foreign keys keep invalid data out at the source. A constraint in the database protects you from every application that ever touches it, including the buggy one written next year.</p>' }
      ],
      q: [
        { t: 'mc', q: 'Where does the foreign key live in a one-to-many relationship?', o: ['On the "many" side, pointing at the "one"', 'On the "one" side', 'In a separate join table', 'It is optional either way'], a: 0, e: 'Each book stores its author_id; an author does not list book ids.' },
        { t: 'mc', q: 'Students and courses, where each may relate to many of the other. You need:', o: ['A join table holding student_id and course_id', 'A comma-separated list in a column', 'Two foreign keys on the students table', 'Nothing special'], a: 0, e: 'Many-to-many always needs a junction table, which can also carry attributes like enrolment date.' },
        { t: 'fill', q: 'A column (or set of columns) that uniquely identifies each row is the ___ key.', a: ['primary'], e: 'Usually indexed automatically.' },
        { t: 'mc', q: 'Why put a CHECK or NOT NULL constraint in the database instead of only in application code?', o: ['Every client is protected, including future or buggy ones', 'It runs faster', 'Application validation is impossible', 'It replaces the need for tests'], a: 0, e: 'Data outlives applications, and several programs usually touch the same database.' },
        { t: 'tf', q: 'Referential integrity means the database can reject a row whose foreign key points at a non-existent record.', a: true, e: 'It can also cascade updates and deletes if you ask it to.' }
      ]
    },
    {
      id: 'db-crud', title: 'SELECT, INSERT, UPDATE, DELETE', icon: '📝', topics: ['SELECT', 'INSERT', 'UPDATE', 'DELETE'],
      learn: [
        { h: 'Reading data', p: '', code: 'SELECT title, published\nFROM books\nWHERE published >= \'2020-01-01\' AND title LIKE \'%Python%\'\nORDER BY published DESC\nLIMIT 10;', lang: 'sql' },
        { h: 'Changing data', p: '', code: 'INSERT INTO authors (name) VALUES (\'Ada Lovelace\');\n\nUPDATE books SET title = \'New Title\'\nWHERE id = 7;              -- never forget the WHERE\n\nDELETE FROM books WHERE id = 7;', lang: 'sql' },
        { h: 'Two habits that prevent disasters', p: '<p>Run the <code>WHERE</code> clause as a <code>SELECT</code> first and look at what comes back; an UPDATE without WHERE rewrites every row. And always use <b>parameterised queries</b> rather than string concatenation — that is what stops SQL injection.</p>', code: 'cur.execute("SELECT * FROM users WHERE email = ?", (email,))   # safe\n# f"... WHERE email = \'{email}\'"   ← never do this' }
      ],
      q: [
        { t: 'mc', q: 'What does `UPDATE books SET title = \'x\'` do without a WHERE clause?', o: ['Updates every row in the table', 'Updates nothing', 'Raises a syntax error', 'Updates only the first row'], a: 0, e: 'The classic production accident. Test with SELECT first, and use a transaction.' },
        { t: 'predict', q: 'Table `scores(name, points)` holds (ada, 90), (bo, 70), (cy, 85). What does this return?', code: "SELECT name FROM scores WHERE points > 80 ORDER BY points DESC;", lang: 'sql', a: ['ada\ncy', 'ada, cy'], e: 'Filter to 90 and 85, then order descending.' },
        { t: 'mc', q: 'Why use parameterised queries?', o: ['User input can never be interpreted as SQL code', 'They are shorter', 'They avoid the need for indexes', 'They format dates automatically'], a: 0, e: 'The driver sends the query and the values separately, which is what defeats SQL injection.' },
        { t: 'fill', q: 'The clause that restricts which rows a query affects is ___.', a: ['where'], e: 'Applied before grouping; HAVING filters after.' },
        { t: 'mc', q: 'Which query safely returns the 5 newest books?', o: ['SELECT * FROM books ORDER BY published DESC LIMIT 5', 'SELECT TOP 5 * FROM books', 'SELECT * FROM books LIMIT 5', 'SELECT NEWEST 5 FROM books'], a: 0, e: 'Without ORDER BY, LIMIT returns an arbitrary five rows.' }
      ]
    },
    {
      id: 'db-join', title: 'Joins and aggregation', icon: '🔗', topics: ['JOIN', 'GROUP BY'],
      learn: [
        { h: 'Joins combine tables', p: '<pre>INNER JOIN  only rows matching on both sides\nLEFT JOIN   all left rows; NULLs where the right has no match\nRIGHT JOIN  the mirror image\nFULL OUTER  everything from both sides</pre>', code: 'SELECT a.name, b.title\nFROM authors a\nJOIN books b ON b.author_id = a.id\nWHERE b.published > \'2015-01-01\';', lang: 'sql' },
        { h: 'Aggregation', p: '<p><code>COUNT</code>, <code>SUM</code>, <code>AVG</code>, <code>MIN</code>, <code>MAX</code> collapse groups of rows. <code>GROUP BY</code> defines the groups; <code>HAVING</code> filters the groups after aggregation, while <code>WHERE</code> filters rows before it.</p>', code: 'SELECT a.name, COUNT(b.id) AS book_count\nFROM authors a\nLEFT JOIN books b ON b.author_id = a.id\nGROUP BY a.name\nHAVING COUNT(b.id) > 2\nORDER BY book_count DESC;', lang: 'sql' },
        { h: 'Find the missing rows', p: '<p>A LEFT JOIN plus <code>WHERE right.id IS NULL</code> is the standard way to ask "which authors have no books?" — the anti-join. It shows up constantly in data cleaning.</p>' }
      ],
      q: [
        { t: 'mc', q: 'Authors with no books should still appear in the result. Which join?', o: ['LEFT JOIN from authors', 'INNER JOIN', 'CROSS JOIN', 'No join is needed'], a: 0, e: 'INNER JOIN drops rows with no match; LEFT JOIN keeps them with NULLs.' },
        { t: 'mc', q: 'What is the difference between WHERE and HAVING?', o: ['WHERE filters rows before grouping; HAVING filters groups after aggregation', 'They are interchangeable', 'HAVING is for joins', 'WHERE cannot be used with GROUP BY'], a: 0, e: 'You cannot reference COUNT(*) in WHERE, because it does not exist yet at that stage.' },
        { t: 'predict', q: 'Orders: (ada, 10), (ada, 20), (bo, 5). What does this return?', code: 'SELECT customer, SUM(amount) FROM orders GROUP BY customer ORDER BY customer;', lang: 'sql', a: ['ada 30\nbo 5', 'ada, 30\nbo, 5', 'ada|30\nbo|5'], e: 'One row per group, with the aggregate computed within it.' },
        { t: 'mc', q: 'How do you find authors who have written no books?', o: ['LEFT JOIN books and filter WHERE books.id IS NULL', 'INNER JOIN and filter for NULL', 'Use COUNT(*) = 0 in WHERE', 'Use DELETE'], a: 0, e: 'The anti-join pattern.' },
        { t: 'fill', q: 'The aggregate function that counts rows in each group is ___.', a: ['count', 'count()', 'count(*)'], e: 'COUNT(*) counts rows; COUNT(column) skips NULLs, which is a real difference.' }
      ]
    },
    {
      id: 'db-perf', title: 'Indexes and transactions', icon: '⚡', topics: ['Indexes', 'Transactions'],
      learn: [
        { h: 'An index is a B-tree on a column', p: '<p>Without one, finding rows means scanning every row. With one, the database walks a tree: O(log n). The cost is extra storage and slower writes, because every insert updates every index.</p>', code: 'CREATE INDEX idx_books_author ON books(author_id);\nEXPLAIN QUERY PLAN SELECT * FROM books WHERE author_id = 3;', lang: 'sql' },
        { h: 'When an index is not used', p: '<p>Wrapping the column in a function (<code>WHERE lower(email) = …</code>), leading wildcards (<code>LIKE \'%x\'</code>), or a query that will read most of the table anyway. Read the query plan instead of guessing: <code>EXPLAIN</code> tells you whether it is a scan or a seek.</p>' },
        { h: 'Transactions and ACID', p: '<p>A transaction groups statements so they all apply or none do.</p><pre>Atomicity   all or nothing\nConsistency constraints hold before and after\nIsolation   concurrent transactions do not see each other\'s half-work\nDurability  once committed, it survives a crash</pre><p>The money-transfer example is the canonical one: debit and credit must commit together, or you have invented or destroyed money.</p>', code: 'BEGIN;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;   -- or ROLLBACK', lang: 'sql' }
      ],
      q: [
        { t: 'mc', q: 'What is the main cost of adding an index?', o: ['Slower writes and extra storage', 'Slower reads', 'Loss of referential integrity', 'Nothing'], a: 0, e: 'Every insert, update and delete must maintain it, so index the columns you actually filter and join on.' },
        { t: 'mc', q: 'Which query is unlikely to use an index on `email`?', o: ["WHERE lower(email) = 'a@b.com'", "WHERE email = 'a@b.com'", "WHERE email LIKE 'a%'", 'WHERE email IS NOT NULL AND email > \'a\''], a: 0, e: 'The function must be applied to every row. Store a normalised column or create an expression index.' },
        { t: 'mc', q: 'Two updates must both apply or neither. Which ACID property is that?', o: ['Atomicity', 'Consistency', 'Isolation', 'Durability'], a: 0, e: 'Atomic means indivisible: commit both or roll back both.' },
        { t: 'fill', q: 'The SQL command that discards all changes made since BEGIN is ___.', a: ['rollback'], e: 'COMMIT makes them permanent; ROLLBACK undoes them.' },
        { t: 'mc', q: 'A query on a 10-million-row table takes 30 seconds. The first thing to check is:', o: ['The query plan, to see whether it is scanning the whole table', 'The RAM in the server', 'The programming language used', 'The network speed'], a: 0, e: 'EXPLAIN first. A missing index on the filtered column is the usual answer.' }
      ]
    },
    {
      id: 'db-tech', title: 'SQLite, PostgreSQL, NoSQL and Redis', icon: '🧰', topics: ['SQLite', 'PostgreSQL', 'NoSQL', 'Redis'],
      learn: [
        { h: 'Pick the boring right one', p: '<ul><li><b>SQLite</b> — the whole database is one file, no server. Perfect for apps, tools, tests and small sites. It is the most deployed database in the world.</li><li><b>PostgreSQL</b> — full-featured client/server SQL: strong types, JSON columns, extensions, excellent concurrency. The sensible default for a web application.</li><li><b>MySQL/MariaDB</b> — the other common relational option.</li></ul>' },
        { h: 'NoSQL families', p: '<pre>Document   MongoDB     flexible schemas, nested documents\nKey-value  Redis       in-memory, microsecond reads, caches and queues\nWide column Cassandra  huge write volumes, tunable consistency\nGraph      Neo4j       relationship-heavy traversals\nSearch     Elasticsearch  full-text ranking</pre>' },
        { h: 'How to choose', p: '<p>Start relational unless you have a specific reason not to: joins, constraints and transactions are hard to reimplement in application code. Add Redis when repeated reads dominate, a search engine when you need ranked text, and a document store when the shape of the data genuinely varies per record. Caches introduce invalidation bugs, so add them deliberately.</p>' }
      ],
      q: [
        { t: 'match', q: 'Match each store to its best fit.', p: [['SQLite', 'A local app with no server'], ['PostgreSQL', 'A web app needing joins and transactions'], ['Redis', 'A cache or rate limiter with microsecond reads'], ['Elasticsearch', 'Ranked full-text search']], e: 'Most production systems use two or three of these together.' },
        { t: 'mc', q: 'What does Redis primarily trade for its speed?', o: ['Data lives in memory, so capacity is limited and durability needs configuration', 'It cannot store strings', 'It requires a schema', 'It only runs on Linux'], a: 0, e: 'Persistence options exist, but it is a cache first.' },
        { t: 'mc', q: 'A sensible default for a new web application\'s primary database is:', o: ['PostgreSQL', 'A document store, always', 'Flat JSON files', 'Redis'], a: 0, e: 'Relational databases give constraints, joins and transactions that are painful to rebuild later.' },
        { t: 'tf', q: 'NoSQL databases remove the need to think about data modelling.', a: false, e: 'They move the modelling into your access patterns, and usually into application code. The thinking does not disappear.' },
        { t: 'mc', q: 'Which is a genuine reason to choose a document database?', o: ['Records legitimately have varying shapes and are read as whole documents', 'You dislike SQL syntax', 'You want faster joins', 'You need stronger constraints'], a: 0, e: 'Joins and constraints are relational strengths; varying shapes are the document model\'s.' }
      ]
    },
    {
      id: 'db-design', title: 'Schema design and normalisation', icon: '📐', topics: ['Database design', 'Normalization'],
      learn: [
        { h: 'Normalisation removes duplicated facts', p: '<ul><li><b>1NF</b> — atomic values; no comma-separated lists in a column.</li><li><b>2NF</b> — non-key columns depend on the whole primary key.</li><li><b>3NF</b> — non-key columns depend on nothing but the key.</li></ul><p>Informal version: every fact is stored in exactly one place. Then an update cannot leave two contradictory copies.</p>' },
        { h: 'When to denormalise', p: '<p>Deliberately duplicating data (a cached count, a copied name) can be right for read-heavy workloads — but only once you have measured, and only with a clear plan for keeping the copies in sync. Denormalising by accident is just a bug.</p><p>Some duplication is not duplication at all: an order should store the price <i>at the time of the order</i>, because that is a different fact from the product\'s current price.</p>' },
        { h: 'Practical habits', p: '<p>Use a surrogate integer or UUID primary key; store timestamps in UTC; name tables and columns consistently; write migrations rather than editing schemas by hand; put indexes on foreign keys. Design for the queries you will run, not only for tidiness.</p>' }
      ],
      q: [
        { t: 'mc', q: 'A column stores "python, sql, git" for each user. Which normal form does that violate?', o: ['First normal form (atomic values)', 'Second', 'Third', 'None'], a: 0, e: 'Use a related skills table; searching and constraints become possible again.' },
        { t: 'mc', q: 'The customer\'s address is copied into every order row. The main risk is:', o: ['Update anomalies: copies drift out of sync', 'Wasted CPU', 'Slower reads', 'Foreign keys break'], a: 0, e: 'Unless it is deliberately a historical snapshot of the shipping address, which is a different fact.' },
        { t: 'mc', q: 'Why should an order store the price paid rather than only referencing the product price?', o: ['The product price can change later; the historical fact must not', 'It is faster', 'Foreign keys require it', 'Normalisation demands it'], a: 0, e: 'Recording a point-in-time fact is not denormalisation.' },
        { t: 'fill', q: 'Deliberately introducing redundancy for read performance is called ___.', a: ['denormalisation', 'denormalization', 'denormalising'], e: 'Legitimate when measured and maintained.' },
        { t: 'tf', q: 'Storing timestamps in local time is fine as long as your users are in one country.', a: false, e: 'Daylight saving alone breaks ordering and arithmetic. Store UTC and convert for display.' }
      ]
    }
  ]
});
