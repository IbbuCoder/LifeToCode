/* Stages 21-22: embedded systems and robotics, advanced computer science. */
CS.addStage({
  id: 's21', n: 21, title: 'Embedded systems and robotics', short: 'Embedded', track: 'systems', icon: '🤖', pos: [690, 60], labelUp: true, prereq: ['s5'],
  blurb: 'Microcontrollers, GPIO, sensors, motors, control loops and real-time constraints — programming that moves things in the physical world.',
  nodes: [
    {
      id: 'emb-mcu', title: 'Microcontrollers and bare metal', icon: '🔲', topics: ['Microcontrollers', 'Arduino', 'Raspberry Pi', 'Firmware'],
      learn: [
        { h: 'A microcontroller is a whole computer on one chip', p: '<p>CPU, flash for the program, a few kilobytes of RAM, and peripherals (timers, ADC, UART, PWM) in one package costing a dollar or two. There is usually no operating system: your code <i>is</i> the system, running forever in a loop.</p><pre>Arduino / AVR / STM32 / ESP32   microcontroller: no OS, microsecond timing, tiny RAM\nRaspberry Pi                     single-board computer: full Linux, filesystem, networking</pre><p>Choose a microcontroller for precise timing and low power; choose a Linux board when you need a network stack, a camera pipeline or Python libraries.</p>' },
        { h: 'The shape of firmware', p: '', code: '#define LED_PIN 13\n\nvoid setup() {          // runs once at power-on\n    pinMode(LED_PIN, OUTPUT);\n    Serial.begin(115200);\n}\n\nvoid loop() {           // runs forever\n    digitalWrite(LED_PIN, HIGH);\n    delay(500);\n    digitalWrite(LED_PIN, LOW);\n    delay(500);\n}', lang: 'cpp' },
        { h: 'Constraints change how you write code', p: '<p>2 KB of RAM means no large buffers, usually no dynamic allocation (fragmentation with no way to recover), and fixed-size arrays. Floating point may be emulated in software and slow. There is no console to print to unless you wire one up, so an LED and a serial line are your debugger — alongside a logic analyser or oscilloscope when timing is in question.</p>' }
      ],
      q: [
        { t: 'mc', q: 'What is the main difference between an Arduino and a Raspberry Pi?', o: ['The Arduino runs your code directly with no operating system', 'The Arduino is faster', 'The Pi has no GPIO pins', 'The Arduino runs Python natively'], a: 0, e: 'No OS means deterministic timing; a Linux board can be interrupted by the scheduler at any moment.' },
        { t: 'mc', q: 'Why is dynamic memory allocation usually avoided in microcontroller firmware?', o: ['Fragmentation in a few KB of RAM can fail with no way to recover', 'malloc does not exist', 'It is slower than the CPU clock', 'Compilers reject it'], a: 0, e: 'Static buffers make worst-case memory use provable, which matters when nobody can reboot the device.' },
        { t: 'mc', q: 'Your firmware needs to react within 50 microseconds of a pulse. The right platform is:', o: ['A bare-metal microcontroller', 'A Raspberry Pi running Linux', 'A cloud function', 'A phone app'], a: 0, e: 'A general-purpose OS gives no hard timing guarantee unless a real-time kernel is used.' },
        { t: 'fill', q: 'In the Arduino model, the function that runs repeatedly forever after startup is called ___().', a: ['loop'], e: 'setup() runs once; loop() is the main cycle.' },
        { t: 'tf', q: 'Firmware normally returns from main() and exits when it is finished.', a: false, e: 'There is nothing to return to. Embedded programs loop forever, or sleep until an interrupt.' }
      ]
    },
    {
      id: 'emb-io', title: 'GPIO, interrupts and buses', icon: '🔌', topics: ['GPIO', 'Interrupts', 'I2C', 'SPI', 'UART', 'PWM'],
      learn: [
        { h: 'Digital and analogue pins', p: '<p>A GPIO pin is an input or an output, high or low. <b>PWM</b> fakes an analogue output by switching fast and varying the duty cycle: 50% duty at 1 kHz dims an LED to half brightness or runs a motor at half speed. An <b>ADC</b> converts a voltage to a number so you can read analogue sensors.</p>' },
        { h: 'Polling versus interrupts', p: '<p>Polling checks a pin repeatedly in the loop and can miss short events. An <b>interrupt</b> stops whatever is running and calls a handler immediately.</p>', code: 'volatile uint32_t pulses = 0;       // volatile: changed outside normal flow\n\nvoid onPulse() { pulses++; }        // keep ISRs tiny and fast\n\nvoid setup() {\n    attachInterrupt(digitalPinToInterrupt(2), onPulse, RISING);\n}', lang: 'cpp' },
        { h: 'Talking to peripherals', p: '<pre>UART  two wires, point to point, simple serial; needs matching baud rate\nI2C   two wires, many devices by address, modest speed — sensors\nSPI    four wires, one device per chip-select, fast — displays, SD cards</pre><p>Interrupt handlers must not block: no delays, no serial printing, no long loops. Set a flag or push to a buffer and do the work in the main loop.</p>' }
      ],
      q: [
        { t: 'mc', q: 'Why must a variable shared with an interrupt handler be declared `volatile`?', o: ['It can change outside normal program flow, so the compiler must not cache it in a register', 'It makes access atomic', 'It allocates it on the heap', 'It makes it thread-safe'], a: 0, e: 'volatile prevents an optimisation, but does not make multi-byte access atomic — that still needs care.' },
        { t: 'mc', q: 'Which bus lets many sensors share just two wires, addressed individually?', o: ['I2C', 'SPI', 'UART', 'PWM'], a: 0, e: 'SDA and SCL, with a 7-bit address per device. SPI is faster but needs a chip-select line each.' },
        { t: 'mc', q: 'What does PWM at 25% duty cycle do to a motor?', o: ['Delivers roughly a quarter of full power by switching rapidly', 'Reduces the supply voltage to a quarter', 'Runs it in reverse', 'Nothing, motors need analogue voltage'], a: 0, e: 'Switching far faster than the motor can respond makes the average behave like a lower voltage.' },
        { t: 'fix', q: 'What is wrong with this interrupt handler?', code: 'void onButton() {\n    Serial.println("pressed");\n    delay(200);\n}', lang: 'cpp', o: ['ISRs must be fast and non-blocking; set a flag and handle it in loop()', 'It needs a return value', 'Serial must be faster', 'It should use digitalRead'], a: 0, e: 'Printing and delaying inside an ISR blocks every other interrupt, including the timer the system depends on.' },
        { t: 'tf', q: 'Polling a pin in the main loop is guaranteed to catch a 10-microsecond pulse.', a: false, e: 'Only if the loop runs faster than the pulse. That is exactly what interrupts are for.' }
      ]
    },
    {
      id: 'emb-sensors', title: 'Sensors, actuators and signals', icon: '🎛️', topics: ['Sensors', 'Actuators', 'Motors', 'Servos', 'Signal processing'],
      learn: [
        { h: 'Reading the world', p: '<p>Sensors turn a physical quantity into a signal: temperature, distance (ultrasonic, time-of-flight), acceleration and rotation (IMU), light, current, encoder ticks. Every reading has noise, offset and drift, so raw values are rarely usable as-is.</p>' },
        { h: 'Filtering', p: '<p>A <b>moving average</b> smooths noise but adds lag. An <b>exponential filter</b> is one line and needs no history:</p><pre>filtered = alpha * reading + (1 - alpha) * filtered   # alpha near 0 = smoother, slower</pre><p>A <b>median filter</b> removes spikes without smearing edges. A <b>Kalman filter</b> fuses several noisy sensors with a motion model, which is how a drone combines accelerometer and gyroscope into a stable attitude estimate.</p>' },
        { h: 'Moving the world', p: '<pre>DC motor    speed by PWM, direction by an H-bridge; needs a driver, not a GPIO pin\nServo       commanded to an angle by pulse width; internal feedback loop\nStepper     precise discrete steps; open loop but can lose steps under load\nSolenoid/relay  on-off; always add a flyback diode</pre><p>Motors are electrically noisy and draw far more current than a microcontroller can supply. Separate power, common ground, and a driver chip are not optional.</p>' }
      ],
      q: [
        { t: 'mc', q: 'An ultrasonic distance sensor occasionally reports 0 cm among good readings. The best fix is:', o: ['A median filter to reject spikes', 'A larger moving average', 'Ignoring the sensor', 'Increasing the sample rate only'], a: 0, e: 'Averaging drags the mean toward the spike; a median discards it entirely.' },
        { t: 'mc', q: 'In `filtered = a*reading + (1-a)*filtered`, lowering `a` gives:', o: ['Smoother output with more lag', 'Faster response with more noise', 'No change', 'Unstable output'], a: 0, e: 'The classic smoothing versus responsiveness trade.' },
        { t: 'mc', q: 'Why must a DC motor not be driven directly from a microcontroller pin?', o: ['It draws far more current than the pin can supply, and generates damaging spikes', 'Pins output the wrong voltage polarity', 'Motors need analogue signals only', 'It is fine to do so'], a: 0, e: 'Use an H-bridge or motor driver, a separate supply and a common ground.' },
        { t: 'match', q: 'Match each actuator to how it is commanded.', p: [['Servo', 'Pulse width sets an angle'], ['DC motor', 'PWM duty sets speed via a driver'], ['Stepper', 'Sequenced coil pulses give discrete steps'], ['Relay', 'A digital on/off signal']], e: 'Knowing the command interface is the first step in choosing hardware.' },
        { t: 'fill', q: 'The algorithm that fuses noisy sensor readings with a motion model to estimate state is the ___ filter.', a: ['kalman'], e: 'Widely used in drones, robots and navigation.' }
      ]
    },
    {
      id: 'emb-control', title: 'Control loops and PID', icon: '🎚️', topics: ['Control systems', 'PID', 'Feedback'],
      learn: [
        { h: 'Open loop versus feedback', p: '<p>Open loop commands an output and hopes: "50% power" does not mean a known speed once there is a slope or a load. A feedback loop measures the result, computes the <b>error</b> (target − measured) and corrects continuously.</p>' },
        { h: 'PID in three terms', p: '<pre>P  proportional to the current error   → the main push; alone it leaves steady-state error\nI  accumulated past error             → removes steady-state offset; can wind up\nD  rate of change of error            → damping; amplifies noise</pre>', code: 'error = target - measured;\nintegral += error * dt;\nintegral = clamp(integral, -LIMIT, LIMIT);   // anti-windup\nderivative = (error - last_error) / dt;\noutput = Kp*error + Ki*integral + Kd*derivative;\nlast_error = error;' },
        { h: 'Tuning and the practical details', p: '<p>Raise Kp until the response is brisk and slightly oscillatory, add Kd to damp the overshoot, then add just enough Ki to remove the remaining offset. Clamp the output to what the actuator can actually do, clamp the integral (anti-windup), and run the loop at a fixed interval — variable timing makes the D and I terms meaningless.</p>' }
      ],
      q: [
        { t: 'mc', q: 'A robot with P-only control always stops just short of the target. Which term fixes it?', o: ['Integral', 'Derivative', 'A larger derivative', 'None; it is a hardware limit'], a: 0, e: 'Accumulated error grows until the residual offset is driven out.' },
        { t: 'mc', q: 'The output oscillates and overshoots badly. The usual first adjustment is:', o: ['Increase Kd, or reduce Kp', 'Increase Ki', 'Increase Kp', 'Remove the feedback'], a: 0, e: 'Derivative damps the approach; too much proportional gain causes the oscillation in the first place.' },
        { t: 'mc', q: 'What is integral windup?', o: ['The integral term accumulates while the actuator is saturated, causing a big overshoot later', 'The derivative becomes negative', 'The loop runs too fast', 'The sensor drifts'], a: 0, e: 'Clamp the integral, or stop accumulating while the output is saturated.' },
        { t: 'fill', q: 'In a control loop, target minus measured value is called the ___.', a: ['error'], e: 'Everything a PID controller does is a function of the error and its history.' },
        { t: 'tf', q: 'A PID loop can run at whatever interval is convenient, since the maths adapts.', a: false, e: 'The I and D terms depend on dt. Use a fixed interval, or include dt explicitly and honestly.' }
      ]
    },
    {
      id: 'emb-rtos', title: 'Real-time systems and robotics software', icon: '⏰', topics: ['Real-time systems', 'RTOS', 'ROS', 'Robotics'],
      learn: [
        { h: 'Real-time means predictable, not fast', p: '<p>A <b>hard real-time</b> system must meet every deadline (airbags, motor commutation); a missed deadline is a failure. <b>Soft real-time</b> tolerates occasional misses (video playback). What matters is the guaranteed worst case, not the average — a system that is usually 1 ms and occasionally 40 ms is unusable for control.</p>' },
        { h: 'RTOS concepts', p: '<p>An RTOS (FreeRTOS, Zephyr) provides tasks with priorities, preemptive scheduling, queues, semaphores and timers in a few kilobytes. Watch for <b>priority inversion</b> (a low-priority task holding a lock a high-priority one needs) and always include a watchdog timer that resets the device if the main loop stops feeding it.</p>' },
        { h: 'The robotics stack', p: '<p>Above the firmware sits perception (sensors → a model of the world), localisation and mapping (SLAM), planning (a path that avoids obstacles) and control (following that path). ROS 2 provides the plumbing: nodes communicating over typed topics and services, plus simulation in Gazebo so you can test without breaking hardware.</p><p>Simulate first, then test on hardware with limits in place — a bug that is a stack trace in software is a broken mechanism here.</p>' }
      ],
      q: [
        { t: 'mc', q: 'What defines a hard real-time system?', o: ['Missing a deadline is a system failure', 'It is very fast on average', 'It uses an RTOS', 'It runs on a microcontroller'], a: 0, e: 'Guaranteed worst-case timing is the requirement; speed is incidental.' },
        { t: 'mc', q: 'What is priority inversion?', o: ['A low-priority task holds a resource that a high-priority task needs', 'Priorities are assigned in reverse', 'Interrupts preempt each other', 'Two tasks deadlock'], a: 0, e: 'Priority inheritance is the standard mitigation, and a famous Mars Pathfinder bug.' },
        { t: 'mc', q: 'What does a watchdog timer do?', o: ['Resets the device if the software stops periodically feeding it', 'Logs errors to flash', 'Measures loop timing for tuning', 'Limits motor current'], a: 0, e: 'The last line of defence against a hang in a device nobody can reach.' },
        { t: 'order', q: 'Order a typical robotics pipeline.', plain: true, o: ['Perception: read and fuse sensors', 'Localisation and mapping', 'Planning: choose a path or action', 'Control: drive actuators to follow it'], e: 'Each layer publishes to the next; in ROS these are separate nodes on topics.' },
        { t: 'tf', q: 'Testing new control code in simulation first is an optional nicety.', a: false, e: 'A software bug on real hardware bends metal, drains batteries and can injure people.' }
      ]
    }
  ]
});

CS.addStage({
  id: 's22', n: 22, title: 'Advanced computer science', short: 'Advanced CS', track: 'core', icon: '🎓', pos: [820, 140], prereq: ['s7'],
  blurb: 'Compilers, distributed systems, containers and cloud, cryptography, information theory and computability — the deep end.',
  nodes: [
    {
      id: 'adv-compilers', title: 'Compilers and interpreters', icon: '⚙️', topics: ['Compilers', 'Interpreters', 'Parsing', 'Code generation'],
      learn: [
        { h: 'The pipeline', p: '<pre>source → lexer      → tokens         "x = 1 + 2"  →  [ID x] [=] [NUM 1] [+] [NUM 2]\n       → parser     → syntax tree    Assign(x, Add(1, 2))\n       → semantic   → typed tree     type checking, scope resolution\n       → IR + optimiser              constant folding, inlining, dead code\n       → code gen   → machine code / bytecode</pre><p>A compiler emits code to run later; an interpreter walks the tree or bytecode now. A JIT does both: interpret, profile, then compile the hot paths.</p>' },
        { h: 'Parsing', p: '<p>A grammar describes valid programs; a recursive-descent parser writes one function per rule, which is how most hand-written parsers work. Precedence is expressed by which rule calls which: <code>expr → term (+ term)*</code> and <code>term → factor (* factor)*</code> makes multiplication bind tighter without any special cases.</p>' },
        { h: 'Why this matters even if you never write a language', p: '<p>Every config format, query language, template engine, linter and formatter is a small compiler. Understanding tokens, trees and passes turns "regex the string and hope" into a structured approach — and explains why your compiler\'s error messages point where they do.</p>' }
      ],
      q: [
        { t: 'order', q: 'Order the stages of a compiler.', plain: true, o: ['Lexing into tokens', 'Parsing into a syntax tree', 'Semantic analysis and type checking', 'Optimisation on an intermediate representation', 'Code generation'], e: 'Each stage consumes a more structured representation than the last.' },
        { t: 'mc', q: 'What does a JIT compiler do?', o: ['Interprets first, then compiles frequently executed code at run time', 'Compiles the whole program before it starts', 'Translates between languages', 'Removes the need for an IR'], a: 0, e: 'It can also use run-time type information that an ahead-of-time compiler never sees.' },
        { t: 'mc', q: 'In a recursive-descent parser, how is operator precedence usually expressed?', o: ['By the nesting of grammar rules that call each other', 'With a precedence table at run time', 'By sorting tokens', 'It cannot be expressed'], a: 0, e: 'Lower-precedence rules call higher-precedence ones, so the tighter binding ends up deeper in the tree.' },
        { t: 'mc', q: '`2 + 3 * 4` parses to `Add(2, Mul(3, 4))`. Why?', o: ['Multiplication binds tighter, so it sits deeper in the tree', 'The parser reads right to left', 'Addition is evaluated last alphabetically', 'The lexer reorders tokens'], a: 0, e: 'Tree shape encodes evaluation order, which is why syntax trees beat flat token lists.' },
        { t: 'fill', q: 'The stage that turns a character stream into tokens is called the ___.', a: ['lexer', 'tokenizer', 'tokeniser', 'scanner'], e: 'Lexer, scanner and tokeniser all name the same stage.' }
      ]
    },
    {
      id: 'adv-distributed', title: 'Distributed systems', icon: '🌐', topics: ['Distributed systems', 'CAP theorem', 'Consensus', 'Replication'],
      learn: [
        { h: 'What changes when there is more than one machine', p: '<p>The network is unreliable and has latency, machines fail independently, and clocks disagree. A message with no reply is ambiguous: the request may have succeeded, failed, or be about to arrive. That ambiguity is the source of almost every distributed systems problem.</p>' },
        { h: 'CAP and its honest reading', p: '<p>Under a network <b>partition</b> you must choose between <b>consistency</b> (refuse to answer rather than answer wrongly) and <b>availability</b> (answer with possibly stale data). Partitions are not optional, so the real choice is CP or AP <i>during a partition</i>; the rest of the time you can have both. <b>Eventual consistency</b> means replicas converge once traffic settles.</p>' },
        { h: 'Consensus and practical patterns', p: '<p>Raft and Paxos let a majority of nodes agree on an ordered log despite failures — the basis of etcd, ZooKeeper and most leader election. Day to day: make operations <b>idempotent</b> so retries are safe, use timeouts with jittered exponential backoff, add circuit breakers, and prefer at-least-once delivery with deduplication over pretending exactly-once exists.</p>' }
      ],
      q: [
        { t: 'mc', q: 'A write request times out with no response. What do you know?', o: ['Nothing certain: it may have succeeded, failed, or still be in flight', 'It definitely failed', 'It definitely succeeded', 'The server is down'], a: 0, e: 'This is why idempotency keys exist: a safe retry needs the operation to be repeatable.' },
        { t: 'mc', q: 'The CAP theorem says that during a network partition you must sacrifice:', o: ['Consistency or availability', 'Partition tolerance', 'Durability', 'Latency'], a: 0, e: 'Partition tolerance is not a choice on a real network.' },
        { t: 'mc', q: 'Why make an API operation idempotent?', o: ['Retries after an ambiguous failure cannot cause duplicate effects', 'It runs faster', 'It avoids the need for authentication', 'It guarantees ordering'], a: 0, e: 'Combine with a client-supplied request id so the server can deduplicate.' },
        { t: 'mc', q: 'What do Raft and Paxos provide?', o: ['Agreement on an ordered log among a majority of nodes despite failures', 'Encryption between nodes', 'Load balancing', 'Data compression'], a: 0, e: 'Consensus underlies leader election, configuration stores and replicated state machines.' },
        { t: 'tf', q: 'Exactly-once message delivery is straightforward to achieve across a network.', a: false, e: 'The usual practical answer is at-least-once delivery plus idempotent handling, which is equivalent in effect.' }
      ]
    },
    {
      id: 'adv-cloud', title: 'Virtualisation, containers and cloud', icon: '☁️', topics: ['Virtualization', 'Containers', 'Docker', 'Kubernetes', 'Cloud'],
      learn: [
        { h: 'VMs and containers', p: '<p>A <b>virtual machine</b> emulates hardware and runs a whole guest OS: strong isolation, gigabytes, seconds to boot. A <b>container</b> shares the host kernel and isolates processes with namespaces and cgroups: megabytes, milliseconds to start, weaker isolation. Containers solve "works on my machine" by shipping the dependencies with the code.</p>', code: 'FROM python:3.12-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY . .\nCMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]', lang: 'bash' },
        { h: 'Orchestration', p: '<p>Kubernetes runs containers across many machines: you declare the desired state (three replicas, this image, this much memory) and a control loop works to match it, restarting failures and rescheduling on node loss. The cost is real complexity — for a single small service, a managed platform is usually the better engineering decision.</p>' },
        { h: 'Cloud building blocks', p: '<pre>compute   VMs, containers, serverless functions\nstorage   object (S3-style), block, managed databases\nnetwork   load balancers, CDN, private networks\nmanaged   queues, caches, identity, secrets</pre><p>Serverless scales to zero and charges per request, at the price of cold starts and vendor coupling. The durable skills are the concepts: statelessness, horizontal scaling, health checks, and infrastructure defined as code.</p>' }
      ],
      q: [
        { t: 'mc', q: 'What is the key difference between a container and a virtual machine?', o: ['Containers share the host kernel; VMs run their own guest OS', 'Containers are only for Linux apps', 'VMs cannot be automated', 'Containers cannot be networked'], a: 0, e: 'Sharing the kernel is why containers are small and fast, and why isolation is weaker.' },
        { t: 'mc', q: 'What does Kubernetes actually do?', o: ['Continuously reconciles the running state with a declared desired state', 'Builds container images', 'Replaces the need for monitoring', 'Compiles your application'], a: 0, e: 'Declarative desired state plus control loops: restart, reschedule, scale.' },
        { t: 'mc', q: 'For one small internal service, choosing Kubernetes over a managed platform usually means:', o: ['Significant operational complexity for little benefit', 'Lower cost and less work', 'Better security by default', 'Faster development'], a: 0, e: 'Match the tool to the scale of the problem; complexity has a permanent maintenance cost.' },
        { t: 'mc', q: 'The main drawback of serverless functions is:', o: ['Cold starts and coupling to a provider\'s model', 'They cannot use databases', 'They never scale', 'They require Kubernetes'], a: 0, e: 'Excellent for spiky, stateless, short work; awkward for long-running or latency-critical paths.' },
        { t: 'fill', q: 'Defining servers and networks in version-controlled configuration files is called infrastructure as ___.', a: ['code', 'code (iac)', 'iac'], e: 'Terraform and friends make environments reproducible and reviewable.' }
      ]
    },
    {
      id: 'adv-crypto', title: 'Cryptography in depth', icon: '🔏', topics: ['Cryptography', 'Key exchange', 'Protocols'],
      learn: [
        { h: 'Primitives and what each guarantees', p: '<pre>block cipher (AES)      confidentiality, with a mode\nAEAD (AES-GCM, ChaCha20-Poly1305)  confidentiality AND integrity together\nhash (SHA-256)          integrity fingerprint\nHMAC                    integrity with a shared key\nsignature (Ed25519)     authenticity, non-repudiation\nKDF (argon2, HKDF)      derive keys from passwords or shared secrets</pre><p>Encryption without authentication is a bug: an attacker can flip bits in ciphertext. Always use an AEAD mode, never raw ECB.</p>' },
        { h: 'Key exchange and forward secrecy', p: '<p>Diffie-Hellman lets two parties derive a shared secret over a public channel; an eavesdropper who records everything cannot compute it. <b>Ephemeral</b> keys per session give <b>forward secrecy</b>: stealing the long-term private key later does not decrypt recorded past traffic. Modern TLS uses ECDHE for exactly this.</p>' },
        { h: 'Where implementations fail', p: '<p>Reused nonces (catastrophic for GCM and stream ciphers), predictable randomness, timing side channels in comparisons (use constant-time equality), rolling your own protocol, and unvalidated certificate chains. The professional stance: use libsodium, the platform TLS stack or a reviewed library, and keep your creativity for the parts of the system that are not cryptography.</p>' }
      ],
      q: [
        { t: 'mc', q: 'Why is AES-GCM preferred over AES-CBC without a MAC?', o: ['It authenticates as well as encrypts, detecting tampering', 'It uses shorter keys', 'It is easier to implement', 'It needs no nonce'], a: 0, e: 'Encryption alone does not prevent an attacker modifying ciphertext in meaningful ways.' },
        { t: 'mc', q: 'What does forward secrecy protect against?', o: ['Recorded traffic being decrypted after the long-term key is later stolen', 'Weak passwords', 'Replay attacks', 'Certificate forgery'], a: 0, e: 'Ephemeral per-session keys are discarded, so there is nothing to recover.' },
        { t: 'mc', q: 'Reusing a nonce with the same key in AES-GCM:', o: ['Breaks confidentiality and authentication catastrophically', 'Is fine if the message differs', 'Only slows things down', 'Is required by the spec'], a: 0, e: 'Nonce reuse is one of the most common fatal implementation mistakes.' },
        { t: 'mc', q: 'Comparing an HMAC with `==` in a loop that returns early can leak information through:', o: ['Timing side channels', 'Memory usage', 'Log files', 'The nonce'], a: 0, e: 'Use a constant-time comparison; libraries provide one.' },
        { t: 'fill', q: 'A function that derives a strong key from a password, deliberately slowly, is a key ___ function.', a: ['derivation', 'derivation function', 'kdf'], e: 'argon2 and scrypt are the current recommendations.' }
      ]
    },
    {
      id: 'adv-info', title: 'Information theory and compression', icon: '📶', topics: ['Information theory', 'Entropy', 'Compression', 'Error correction'],
      learn: [
        { h: 'Entropy is surprise', p: '<p>Shannon entropy measures the average information per symbol: H = −Σ p log₂ p bits. A fair coin gives 1 bit per flip; a coin that always lands heads gives 0 — you learn nothing. Entropy sets a hard lower bound on lossless compression: you cannot encode a source in fewer bits per symbol than its entropy.</p>' },
        { h: 'Compression follows from it', p: '<p>Give short codes to frequent symbols and long codes to rare ones: that is <b>Huffman coding</b>, and it is why English text compresses well. <b>Arithmetic coding</b> gets closer to the entropy bound; <b>LZ77</b> and friends (used in ZIP, gzip, PNG) replace repeated sequences with references to earlier ones. Random data does not compress, because there is no redundancy to remove.</p>' },
        { h: 'Error detection and correction', p: '<p>Redundancy also buys reliability. A <b>parity bit</b> detects one flipped bit; a <b>checksum</b> or <b>CRC</b> detects accidental corruption; <b>Hamming codes</b> and Reed-Solomon can <i>correct</i> errors, which is how QR codes survive being scratched and how RAM with ECC tolerates bit flips. Note that a checksum detects accidents, not tampering: that requires a MAC or signature.</p>' }
      ],
      q: [
        { t: 'mc', q: 'What is the entropy of a fair coin flip?', o: ['1 bit', '0 bits', '2 bits', 'It depends on the encoding'], a: 0, e: 'Two equally likely outcomes: exactly one bit of information per flip.' },
        { t: 'mc', q: 'Why does a file of random bytes not compress?', o: ['There is no redundancy or predictability to exploit', 'It is too large', 'Compression tools reject binary files', 'It compresses, just slowly'], a: 0, e: 'Its entropy is already at the maximum for its length.' },
        { t: 'mc', q: 'Huffman coding assigns shorter codes to:', o: ['More frequent symbols', 'Alphabetically earlier symbols', 'Longer symbols', 'Randomly chosen symbols'], a: 0, e: 'Expected length falls toward the entropy bound.' },
        { t: 'mc', q: 'A QR code still scans after part of it is damaged. This is due to:', o: ['Error-correcting codes adding structured redundancy', 'Compression', 'Encryption', 'Higher resolution'], a: 0, e: 'Reed-Solomon can reconstruct missing symbols, at the cost of extra data.' },
        { t: 'tf', q: 'A CRC checksum proves a file has not been deliberately altered.', a: false, e: 'CRCs detect accidental corruption and are trivial to forge. Integrity against an attacker needs an HMAC or a signature.' }
      ]
    },
    {
      id: 'adv-theory', title: 'Computability and complexity classes', icon: '♾️', topics: ['Computability', 'Turing machines', 'P vs NP', 'Undecidability'],
      learn: [
        { h: 'What a computer can do at all', p: '<p>A <b>Turing machine</b> — a tape, a head, a rule table — defines what "computable" means. The Church-Turing thesis says every realistic model of computation (your laptop, lambda calculus, a Python program) computes exactly the same set of functions. Faster, yes; more capable, no.</p>' },
        { h: 'Undecidability', p: '<p>The <b>halting problem</b> — decide whether an arbitrary program halts on an arbitrary input — has no algorithm. The proof is a short self-reference argument: assume such a decider exists, build a program that halts exactly when the decider says it loops, and ask it about itself.</p><p>Consequences are practical: no perfect static analyser, no perfect virus scanner, no tool that proves your program terminates in every case. Real tools are conservative approximations, which is why they report false positives.</p>' },
        { h: 'P, NP and why it matters', p: '<pre>P     solvable in polynomial time\nNP    a proposed solution can be *verified* in polynomial time\nNP-complete  the hardest in NP; a fast algorithm for one gives one for all\nNP-hard      at least as hard, not necessarily in NP</pre><p>P vs NP asks whether verifying and finding are equally easy. Most believe not. Practically, recognising a problem as NP-complete (SAT, travelling salesman, graph colouring, knapsack) tells you to stop hunting for an exact fast algorithm and reach for heuristics, approximation or a solver instead.</p>' }
      ],
      q: [
        { t: 'mc', q: 'What does the halting problem show?', o: ['No algorithm can decide, for all programs and inputs, whether they halt', 'Some programs run slowly', 'Recursion is dangerous', 'Turing machines are obsolete'], a: 0, e: 'It is undecidable, which limits every static analysis tool ever written.' },
        { t: 'mc', q: 'What characterises problems in NP?', o: ['A candidate solution can be verified in polynomial time', 'They cannot be solved at all', 'They require exponential memory', 'They are solvable in polynomial time'], a: 0, e: 'Verification is easy; finding may not be. P ⊆ NP.' },
        { t: 'mc', q: 'Your scheduling problem turns out to be NP-complete. The sensible response is:', o: ['Use heuristics, approximation or a solver, and accept good-enough solutions', 'Keep searching for a fast exact algorithm', 'Declare it unsolvable', 'Add more servers'], a: 0, e: 'Exact optimal is fine for small instances; real ones need SAT/ILP solvers or good heuristics.' },
        { t: 'fill', q: 'The thesis that every realistic model of computation computes the same class of functions is the ___-Turing thesis.', a: ['church'], e: 'Different models differ in speed, not in what is computable.' },
        { t: 'tf', q: 'A quantum computer can solve the halting problem.', a: false, e: 'Undecidability is not about speed. Quantum computers change complexity for some problems, not computability.' }
      ]
    }
  ]
});
