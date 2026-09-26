/* Stage 4: AP Computer Science prep (CSP and CSA). Stage 5: C++. */
CS.addStage({
  id: 's4', n: 4, title: 'AP Computer Science', short: 'AP CS', track: 'ap', icon: '🎓', pos: [420, 310], prereq: ['s2'],
  blurb: 'Two tracks: AP CSP concepts, and AP CSA in Java. Supplementary practice, not official material.',
  note: 'Supplementary AP preparation. Mainline is not affiliated with, endorsed by, or reviewed by the College Board. Always check the current official Course and Exam Description for exam content.',
  nodes: [
    {
      id: 'csp-systems', group: 'AP CSP', title: 'Computing systems and the internet', icon: '🖧', topics: ['Computing systems', 'Internet'],
      learn: [
        { h: 'The internet is built to survive failure', p: '<p>Data is split into <b>packets</b> that travel independently and are reassembled at the far end. <b>Redundancy</b> — more than one path between two points — means a broken link reroutes instead of failing. <b>Protocols</b> are the agreed rules (IP, TCP, HTTP, DNS) that let unrelated systems interoperate.</p>' },
        { h: 'Scalability and fault tolerance', p: '<p>A <b>scalable</b> system keeps working as it grows; a <b>fault-tolerant</b> one keeps working when parts break. The internet is both because of packet switching, redundancy and open standards, not because any single machine is reliable.</p>' },
        { h: 'The digital divide', p: '<p>Access to computing is unevenly distributed by geography, income and infrastructure. AP CSP treats this as a first-class topic: technology decisions have social consequences, and who is excluded is part of evaluating a system.</p>' }
      ],
      q: [
        { t: 'mc', q: 'Why does the internet split data into packets?', o: ['Packets can take different routes and be resent individually if lost', 'Packets are encrypted by default', 'It makes files smaller', 'Routers can only read small files'], a: 0, e: 'Packet switching gives redundancy and efficient use of shared links.' },
        { t: 'fill', q: 'An agreed set of rules that lets different systems communicate is called a ___.', a: ['protocol'], e: 'IP, TCP, HTTP and DNS are all protocols.' },
        { t: 'tf', q: 'Fault tolerance in a network comes mainly from having redundant paths between endpoints.', a: true, e: 'Redundancy is the mechanism: if one route fails, routing protocols find another.' },
        { t: 'mc', q: 'Which best describes the digital divide?', o: ['Unequal access to computing devices and connectivity across groups and regions', 'The gap between analogue and digital signals', 'The split between hardware and software careers', 'Differences between operating systems'], a: 0, e: 'It is a question of equitable access and its downstream effects on education and opportunity.' },
        { t: 'short', q: 'Explain in a sentence how redundancy makes the internet fault tolerant.', a: [['more than one path', 'multiple path', 'alternate', 'redundan', 'another route', 'reroute']], model: 'Because multiple routes connect any two points, traffic can be rerouted when a link or router fails.', e: 'Redundancy is the mechanism; fault tolerance is the result.' }
      ]
    },
    {
      id: 'csp-data', group: 'AP CSP', title: 'Data, abstraction and compression', icon: '📊', topics: ['Data', 'Binary', 'Compression', 'Abstraction'],
      learn: [
        { h: 'Analogue to digital', p: '<p>Sampling measures a continuous signal at intervals and stores each measurement as bits. Higher sampling rate and bit depth mean more fidelity and more storage. All digital data is an approximation with a chosen resolution.</p>' },
        { h: 'Lossless and lossy compression', p: '<p><b>Lossless</b> (run-length encoding, ZIP, PNG) restores the original exactly. <b>Lossy</b> (JPEG, MP3) discards information permanently for a much smaller file. Choose lossless when every bit matters — text, code, archives, medical images.</p><p>Run-length encoding is the classic exam example: <code>AAAABBB → 4A3B</code>.</p>' },
        { h: 'Data and information', p: '<p>Raw data becomes information when it is processed, filtered, visualised or correlated. Metadata (when, where, which device) is often more revealing than the content, which is why it matters for privacy questions.</p>' }
      ],
      q: [
        { t: 'mc', q: 'Which compression type can always reconstruct the original file exactly?', o: ['Lossless', 'Lossy', 'Both', 'Neither'], a: 0, e: 'Lossy formats discard data permanently in exchange for smaller size.' },
        { t: 'fill', q: 'Using run-length encoding, `AAABBBBC` becomes ___.', a: ['3a4b1c', '3A4B1C', '3a4bc', '3A4BC'], e: 'Three As, four Bs, one C.' },
        { t: 'mc', q: 'Doubling the sampling rate of an audio recording generally:', o: ['Captures higher frequencies and doubles the data size', 'Halves the file size', 'Has no effect on quality', 'Converts it to lossless'], a: 0, e: 'More samples per second capture more detail and cost proportionally more storage.' },
        { t: 'tf', q: 'Metadata about a photo (time, location, device) can reveal as much as the image itself.', a: true, e: 'This is a standard AP CSP privacy point, and true in practice.' },
        { t: 'mc', q: 'A program stores temperature as an 8-bit integer. What is the main limitation?', o: ['Only 256 distinct values can be represented', 'It cannot store negative numbers at all', 'It uses more memory than a float', 'It is lossy compression'], a: 0, e: 'Fixed bit widths bound both range and precision; picking a representation is a design decision with consequences.' }
      ]
    },
    {
      id: 'csp-algo', group: 'AP CSP', title: 'Algorithms and programming', icon: '🧮', topics: ['Algorithms', 'Programming', 'Procedures', 'Simulation'],
      learn: [
        { h: 'Sequencing, selection, iteration', p: '<p>Every program is built from three control structures: do things in order, choose between paths, and repeat. Exam pseudocode uses <code>REPEAT UNTIL</code>, <code>IF/ELSE</code> and <code>DISPLAY</code>.</p>' },
        { h: 'Procedural abstraction and parameters', p: '<p>A procedure with parameters lets you name a chunk of logic and reuse it. AP emphasises this: pulling repeated code into a procedure with parameters is the canonical "improve this program" answer.</p>' },
        { h: 'Reasonable time, and undecidable problems', p: '<p>An algorithm runs in <b>reasonable time</b> if its steps grow polynomially with input size; exponential growth is unreasonable. Some problems are <b>undecidable</b>: no algorithm can solve every instance. Heuristics give good-enough answers when exact ones cost too much.</p>' }
      ],
      q: [
        { t: 'mc', q: 'Which pair of algorithms runs in reasonable time?', o: ['Linear search and binary search', 'Trying every subset and every permutation', 'Only binary search', 'Neither: all searching is exponential'], a: 0, e: 'Linear O(n) and binary O(log n) are polynomial or better. Subsets are 2ⁿ and permutations n!.' },
        { t: 'fill', q: 'A problem for which no algorithm can produce a correct yes/no answer for every input is called ___.', a: ['undecidable'], e: 'The halting problem is the classic example.' },
        { t: 'mc', q: 'What is the benefit of procedural abstraction?', o: ['Repeated logic lives in one named place that can be reused and fixed once', 'Programs run in parallel', 'It removes the need for testing', 'Variables become global'], a: 0, e: 'Reuse, readability and one place to fix bugs.' },
        { t: 'predict', q: 'Using AP-style pseudocode, what is displayed?', code: 'count ← 0\nREPEAT 4 TIMES\n{\n  count ← count + 3\n}\nDISPLAY(count)', lang: 'python', a: ['12'], e: 'Four iterations of adding 3.' },
        { t: 'mc', q: 'A heuristic is used when:', o: ['An exact algorithm would take unreasonable time', 'The problem is trivial', 'The program has a syntax error', 'Data is compressed'], a: 0, e: 'Heuristics trade guaranteed optimality for a usable answer, as in route planning.' }
      ]
    },
    {
      id: 'csp-impact', group: 'AP CSP', title: 'Cybersecurity and the impact of computing', icon: '⚖️', topics: ['Cybersecurity', 'Impacts of computing'],
      learn: [
        { h: 'Common threats, in exam terms', p: '<ul><li><b>Phishing</b> — tricking a person into giving credentials</li><li><b>Keylogger</b> — records keystrokes</li><li><b>Malware / rogue access point</b> — malicious software or a fake Wi-Fi hotspot</li><li><b>Multifactor authentication</b> — something you know, have and are</li></ul>' },
        { h: 'Symmetric vs public key', p: '<p><b>Symmetric</b> encryption uses one shared key. <b>Public key</b> encryption uses a public key to encrypt and a private key to decrypt, which solves the problem of exchanging a secret with someone you have never met. HTTPS uses public key cryptography to agree a symmetric key, then uses that.</p>' },
        { h: 'Bias, ownership and beneficial effects', p: '<p>Computing innovations have intended and unintended effects. Data sets carry the bias of how they were collected, so a model trained on them can reproduce it. Digital ownership, open source licences and crowdsourcing are all standard CSP topics.</p>' }
      ],
      q: [
        { t: 'mc', q: 'Which is an example of multifactor authentication?', o: ['A password plus a code from an authenticator app', 'Two different passwords', 'A very long password', 'A password saved in a browser'], a: 0, e: 'Different categories of factor: knowledge plus possession.' },
        { t: 'match', q: 'Match each threat to its description.', p: [['Phishing', 'Tricking a person into revealing credentials'], ['Keylogger', 'Records every keystroke'], ['Rogue access point', 'A fake wireless network that intercepts traffic'], ['Malware', 'Software designed to damage or gain access']], e: 'CSP expects you to recognise all four by definition.' },
        { t: 'tf', q: 'In public key encryption, the key used to encrypt is the same one used to decrypt.', a: false, e: 'That describes symmetric encryption. Public key uses a related but different key pair.' },
        { t: 'mc', q: 'An algorithm trained on historical hiring data recommends mostly one demographic. The most likely explanation is:', o: ['Bias present in the training data was learned by the model', 'A syntax error', 'Insufficient RAM', 'Lossy compression'], a: 0, e: 'Models reproduce the patterns in their data, including unfair historical ones.' },
        { t: 'short', q: 'Give one beneficial and one harmful effect of the same computing innovation.', a: [['help', 'benefit', 'access', 'faster', 'connect', 'save', 'easier'], ['harm', 'privacy', 'bias', 'job', 'addict', 'misinform', 'divide', 'risk']], model: 'Social media connects people and spreads useful information quickly, and also spreads misinformation and harms attention and privacy.', e: 'CSP expects both sides: innovations rarely have only one kind of effect.' }
      ]
    },
    {
      id: 'csa-basics', group: 'AP CSA (Java)', title: 'Java basics and types', icon: '☕', topics: ['Java basics', 'Variables', 'Data types'],
      learn: [
        { h: 'Java is statically typed and class-based', p: '<p>Every variable declares a type, every program lives in a class, and execution begins at <code>main</code>.</p>', code: 'public class Hello {\n    public static void main(String[] args) {\n        int count = 5;\n        double price = 2.50;\n        boolean ready = true;\n        String name = "Ada";\n        System.out.println(name + " has " + count + " items");\n    }\n}', lang: 'java' },
        { h: 'Primitives vs objects', p: '<p>Primitives (<code>int</code>, <code>double</code>, <code>boolean</code>, <code>char</code>) hold values directly. Objects (<code>String</code>, <code>ArrayList</code>) are references. Integer division truncates: <code>7 / 2</code> is <code>3</code>, while <code>7 / 2.0</code> is <code>3.5</code>. Casting: <code>(double) 7 / 2</code>.</p>' },
        { h: 'Strings are objects and immutable', p: '<p>Compare with <code>.equals()</code>, not <code>==</code>, which compares references. Useful methods for the exam: <code>length()</code>, <code>substring(a, b)</code> (b exclusive), <code>indexOf()</code>, <code>compareTo()</code>.</p>' }
      ],
      q: [
        { t: 'predict', q: 'What does this print?', code: 'int a = 7, b = 2;\nSystem.out.println(a / b);\nSystem.out.println((double) a / b);', lang: 'java', a: ['3\n3.5'], e: 'Integer division truncates toward zero; casting one operand gives floating-point division.' },
        { t: 'mc', q: 'Why is `s1 == s2` unreliable for Strings in Java?', o: ['It compares references, not contents; use .equals()', 'Strings cannot be compared at all', '== only works on primitives of the same size', 'It always returns true'], a: 0, e: 'A classic AP CSA trap, made worse by string literal interning sometimes making == look right.' },
        { t: 'predict', q: 'What is printed?', code: 'String s = "computer";\nSystem.out.println(s.substring(0, 3));\nSystem.out.println(s.length());', lang: 'java', a: ['com\n8'], e: 'substring(0,3) takes indices 0,1,2. The second index is exclusive.' },
        { t: 'fill', q: 'Every Java program starts executing in the method named ___.', a: ['main'], e: 'public static void main(String[] args).' },
        { t: 'mc', q: 'Which declaration is valid Java?', o: ['double rate = 0.05;', 'rate = 0.05;', 'var double rate = 0.05;', 'double rate := 0.05;'], a: 0, e: 'Type then name then initialiser, ending with a semicolon.' }
      ]
    },
    {
      id: 'csa-control', group: 'AP CSA (Java)', title: 'Conditionals, loops and boolean logic', icon: '🔂', topics: ['Conditionals', 'Loops', 'Boolean expressions'],
      learn: [
        { h: 'Braces, not indentation', p: '<code>if (x > 0) { ... } else if (...) { ... } else { ... }</code><p>Operators: <code>&amp;&amp;</code> and, <code>||</code> or, <code>!</code> not. Both <code>&amp;&amp;</code> and <code>||</code> short-circuit, which is how you write <code>if (s != null &amp;&amp; s.length() &gt; 0)</code> safely.</p>' },
        { h: 'The three loops', p: '', code: 'for (int i = 0; i < 5; i++) { ... }          // counting\nwhile (scanner.hasNext()) { ... }             // condition\nfor (String w : words) { ... }                // enhanced for-each', lang: 'java' },
        { h: 'De Morgan on the exam', p: '<p><code>!(a &amp;&amp; b)</code> equals <code>!a || !b</code>. Free-response questions frequently ask you to simplify or rewrite a condition, and off-by-one bounds in <code>for</code> loops are the most common error to spot in multiple choice.</p>' }
      ],
      q: [
        { t: 'predict', q: 'How many lines does this print?', code: 'for (int i = 0; i < 5; i += 2) {\n    System.out.println(i);\n}', lang: 'java', a: ['0\n2\n4'], e: 'i takes 0, 2, 4 and then 6 fails the test: three lines.' },
        { t: 'mc', q: '`!(a && b)` is equivalent to:', o: ['!a || !b', '!a && !b', 'a || b', '!(a || b)'], a: 0, e: 'De Morgan\'s law.' },
        { t: 'mc', q: 'Why does `if (s != null && s.length() > 0)` not crash when s is null?', o: ['&& short-circuits: the right side is skipped when the left is false', 'Java ignores null checks', 'length() returns 0 for null', 'It does crash'], a: 0, e: 'Short-circuit evaluation is the reason for the ordering.' },
        { t: 'predict', q: 'What is printed?', code: 'int n = 0;\nwhile (n < 3) {\n    n++;\n}\nSystem.out.println(n);', lang: 'java', a: ['3'], e: 'The loop exits as soon as n reaches 3.' },
        { t: 'fix', q: 'This loop should process every element of `arr` but throws ArrayIndexOutOfBoundsException. Which fix is right?', code: 'for (int i = 0; i <= arr.length; i++) {\n    System.out.println(arr[i]);\n}', lang: 'java', o: ['Use `i < arr.length`', 'Use `i <= arr.length - 2`', 'Start at i = 1', 'Use arr.size() instead'], a: 0, e: 'Valid indices are 0 to length-1. `size()` is for ArrayList, `length` for arrays.' }
      ]
    },
    {
      id: 'csa-classes', group: 'AP CSA (Java)', title: 'Methods, classes and objects', icon: '🧱', topics: ['Methods', 'Classes', 'Objects', 'Constructors'],
      learn: [
        { h: 'A class with private state and public methods', p: '', code: 'public class Student {\n    private String name;      // private field\n    private int score;\n\n    public Student(String name, int score) {   // constructor\n        this.name = name;\n        this.score = score;\n    }\n\n    public int getScore() { return score; }    // accessor\n    public void addPoints(int p) { score += p; } // mutator\n\n    @Override\n    public String toString() { return name + ":" + score; }\n}', lang: 'java' },
        { h: 'Signatures, void and return types', p: '<p>A method signature is its name plus parameter types. <code>void</code> returns nothing; anything else must return a matching value on every path. Methods can be <b>overloaded</b>: same name, different parameter lists.</p>' },
        { h: 'Static vs instance', p: '<p><code>static</code> members belong to the class (<code>Math.sqrt</code>, <code>main</code>); instance members belong to an object and can use <code>this</code>. A static method cannot touch instance fields, which is the reason for the classic "non-static variable cannot be referenced from a static context" error.</p>' }
      ],
      q: [
        { t: 'predict', q: 'What does this print?', code: 'Student s = new Student("Ada", 80);\ns.addPoints(15);\nSystem.out.println(s);', lang: 'java', a: ['Ada:95'], e: 'println calls toString() on the object, and addPoints mutated the score.' },
        { t: 'mc', q: 'Why make fields private with public accessors?', o: ['The class controls how its state is read and changed', 'Private fields use less memory', 'It is required by the compiler', 'It makes the class static'], a: 0, e: 'Encapsulation: invariants can be enforced in one place.' },
        { t: 'fill', q: 'The special method that runs when an object is created with `new` is the ___.', a: ['constructor'], e: 'It has the class name and no return type.' },
        { t: 'mc', q: 'Two methods named `area` with different parameter lists is called:', o: ['Overloading', 'Overriding', 'Inheritance', 'Encapsulation'], a: 0, e: 'Overloading is same name, different signature; overriding replaces a superclass method with the same signature.' },
        { t: 'tf', q: 'A static method can directly use an instance field of the same class.', a: false, e: 'There is no instance in a static context, which is exactly what that famous compiler error says.' }
      ]
    },
    {
      id: 'csa-arrays', group: 'AP CSA (Java)', title: 'Arrays, 2D arrays and ArrayList', icon: '🗄️', topics: ['Arrays', 'ArrayLists', '2D arrays'],
      learn: [
        { h: 'Arrays are fixed length', p: '', code: 'int[] nums = new int[5];        // zeros\nint[] vals = {3, 1, 4};\nvals.length                      // field, no parentheses\nfor (int v : vals) { ... }       // for-each, read only\n\nint[][] grid = new int[3][4];    // 3 rows, 4 columns\ngrid[1][2] = 7;', lang: 'java' },
        { h: 'ArrayList grows', p: '', code: 'ArrayList<String> names = new ArrayList<String>();\nnames.add("Ada");\nnames.add(0, "Grace");      // insert at index\nnames.get(1); names.set(1, "x"); names.remove(0);\nnames.size();               // method, with parentheses', lang: 'java' },
        { h: 'Removing while looping', p: '<p>Calling <code>remove(i)</code> inside an ascending loop skips the next element, because everything shifts left. Loop downwards, or build a new list. This is one of the most frequently tested traps on the exam.</p>' }
      ],
      q: [
        { t: 'mc', q: 'Which gets the number of elements?', o: ['arr.length for an array, list.size() for an ArrayList', 'length() for both', 'size() for both', 'count for both'], a: 0, e: 'Array length is a field; ArrayList size() is a method; String length() is a method. All three differ.' },
        { t: 'predict', q: 'What does this print?', code: 'int[][] g = {{1,2,3},{4,5,6}};\nint total = 0;\nfor (int[] row : g)\n    for (int v : row)\n        total += v;\nSystem.out.println(total);', lang: 'java', a: ['21'], e: '1+2+3+4+5+6 = 21. Nested for-each is the standard 2D traversal.' },
        { t: 'fix', q: 'This should remove every "x" from an ArrayList but misses some. Why?', code: 'for (int i = 0; i < list.size(); i++) {\n    if (list.get(i).equals("x")) list.remove(i);\n}', lang: 'java', o: ['After a removal everything shifts left, so the next element is skipped; loop downwards', 'ArrayList cannot be modified', 'equals() is wrong here', 'size() must be cached first'], a: 0, e: 'Iterate from size()-1 down to 0, or use an iterator\'s remove().' },
        { t: 'mc', q: 'Why does `ArrayList<int>` not compile?', o: ['Generics need a reference type, so use Integer', 'ArrayList only holds Strings', 'int is too large', 'It needs a size first'], a: 0, e: 'Autoboxing converts int to Integer when you add values.' },
        { t: 'predict', q: 'What is printed?', code: 'ArrayList<String> a = new ArrayList<String>();\na.add("p"); a.add("q"); a.add(1, "r");\nSystem.out.println(a);', lang: 'java', a: ['[p, r, q]'], e: 'add(index, value) inserts and shifts the rest right.' }
      ]
    },
    {
      id: 'csa-inherit', group: 'AP CSA (Java)', title: 'Inheritance and polymorphism in Java', icon: '🧬', topics: ['Inheritance', 'Polymorphism'],
      learn: [
        { h: 'extends and super', p: '', code: 'public class Animal {\n    private String name;\n    public Animal(String name) { this.name = name; }\n    public String speak() { return "..."; }\n    public String getName() { return name; }\n}\n\npublic class Dog extends Animal {\n    public Dog(String name) { super(name); }   // must be first\n    @Override\n    public String speak() { return "Woof"; }\n}', lang: 'java' },
        { h: 'Static type vs dynamic type', p: '<p><code>Animal a = new Dog("Rex");</code> — the <b>declared</b> type is Animal, the <b>actual</b> object is a Dog. The compiler allows only methods Animal declares; at run time the Dog version executes. AP calls this dynamic method dispatch, and it is tested constantly.</p>' },
        { h: 'Object methods and arrays of supertypes', p: '<p>Every class inherits from <code>Object</code>, so <code>toString()</code> and <code>equals()</code> always exist and are usually worth overriding. An <code>Animal[]</code> can hold Dogs and Cats, and one loop calling <code>speak()</code> gives different behaviour per element.</p>' }
      ],
      q: [
        { t: 'predict', q: 'What does this print?', code: 'Animal a = new Dog("Rex");\nSystem.out.println(a.speak());', lang: 'java', a: ['Woof'], e: 'The method that runs is chosen by the actual object type at run time, not the declared type.' },
        { t: 'mc', q: '`Animal a = new Dog(); a.fetch();` fails to compile when fetch() is declared only in Dog. Why?', o: ['The compiler checks the declared type, which has no fetch()', 'Dog is not a subclass', 'fetch() must be static', 'Only interfaces may add methods'], a: 0, e: 'You would need a cast: ((Dog) a).fetch().' },
        { t: 'mc', q: 'Where must `super(name)` appear in a subclass constructor?', o: ['As the first statement', 'Anywhere in the constructor', 'After the fields are set', 'It is optional and ignored'], a: 0, e: 'The superclass must be initialised before the subclass adds to it.' },
        { t: 'fill', q: 'Replacing a superclass method with the same signature in a subclass is called ___.', a: ['overriding', 'method overriding'], e: 'Overriding replaces behaviour; overloading adds a variant with different parameters.' },
        { t: 'tf', q: 'A single loop over an `Animal[]` can produce different speak() output per element.', a: true, e: 'That is polymorphism, and it is the reason inheritance is worth the complexity.' }
      ]
    },
    {
      id: 'csa-algos', group: 'AP CSA (Java)', title: 'Searching, sorting and recursion', icon: '🔎', topics: ['Algorithms', 'Searching', 'Sorting', 'Recursion'],
      learn: [
        { h: 'The two searches', p: '<p><b>Linear search</b> checks every element, O(n), and works on any array. <b>Binary search</b> needs sorted data and halves the range each step, O(log n).</p>', code: 'public static int binarySearch(int[] a, int target) {\n    int lo = 0, hi = a.length - 1;\n    while (lo <= hi) {\n        int mid = (lo + hi) / 2;\n        if (a[mid] == target) return mid;\n        else if (a[mid] < target) lo = mid + 1;\n        else hi = mid - 1;\n    }\n    return -1;\n}', lang: 'java' },
        { h: 'The three exam sorts', p: '<ul><li><b>Selection sort</b> — find the minimum of the rest, swap it into place. O(n²), few swaps.</li><li><b>Insertion sort</b> — slide each element back into the sorted prefix. O(n²), but O(n) on nearly sorted data.</li><li><b>Merge sort</b> — split, sort halves recursively, merge. O(n log n), uses extra space.</li></ul><p>Questions often show the array after k passes: know what one pass of each looks like.</p>' },
        { h: 'Recursion on the exam', p: '<p>Trace carefully: write the arguments of each call, then unwind. A recursive method needs a base case and progress toward it. Merge sort is the recursive sort you must be able to describe.</p>' }
      ],
      lab: 'sorting',
      q: [
        { t: 'mc', q: 'Binary search on a sorted 1,000,000-element array needs at most about how many comparisons?', o: ['20', '1000', '500000', '1000000'], a: 0, e: 'log₂(1,000,000) ≈ 20. Each step halves the range.' },
        { t: 'predict', q: 'What does this recursive method return for mystery(4)?', code: 'public static int mystery(int n) {\n    if (n <= 1) return 1;\n    return n * mystery(n - 1);\n}', lang: 'java', a: ['24'], e: '4 × 3 × 2 × 1 = 24: factorial.' },
        { t: 'mc', q: 'After one pass of selection sort (ascending) on {5, 2, 9, 1}, the array is:', o: ['{1, 2, 9, 5}', '{2, 5, 9, 1}', '{1, 2, 5, 9}', '{5, 2, 1, 9}'], a: 0, e: 'The minimum 1 swaps with the first element 5.' },
        { t: 'mc', q: 'Which sort is O(n log n) and typically uses extra memory?', o: ['Merge sort', 'Selection sort', 'Insertion sort', 'Linear search'], a: 0, e: 'Merging needs a temporary array. Selection and insertion are quadratic but in place.' },
        { t: 'order', q: 'Order the steps of merge sort.', plain: true, o: ['Split the array into two halves', 'Recursively sort the left half', 'Recursively sort the right half', 'Merge the two sorted halves into one'], e: 'Divide and conquer: the merge step is where the sorting actually appears.' }
      ]
    }
  ]
});

CS.addStage({
  id: 's5', n: 5, title: 'C++', short: 'C++', track: 'programming', icon: '⚡', pos: [560, 60], labelUp: true, prereq: ['s3'],
  blurb: 'Compilation, types, pointers, memory ownership and the STL: the layer where you can see the machine underneath.',
  nodes: [
    {
      id: 'cpp-basics', title: 'Syntax, types and compilation', icon: '🔧', topics: ['Syntax', 'Variables', 'Types', 'Compilation'],
      learn: [
        { h: 'Hello, compiled world', p: '<p>C++ is compiled ahead of time into machine code for one platform. The compiler checks types before anything runs.</p>', code: '#include <iostream>\n\nint main() {\n    int count = 5;\n    double price = 2.5;\n    std::cout << "total " << count * price << "\\n";\n    return 0;   // 0 means success\n}', lang: 'cpp' },
        { h: 'The build pipeline', p: '<p><b>Preprocessor</b> (handles <code>#include</code>, macros) → <b>compiler</b> (each .cpp becomes an object file) → <b>linker</b> (joins object files and libraries into an executable). "Undefined reference" is a linker error: the declaration was found but no definition.</p>', code: 'g++ -std=c++20 -Wall -Wextra -g main.cpp -o app\n./app', lang: 'bash' },
        { h: 'Fixed-size types and auto', p: '<p><code>int</code> is usually 32 bits, <code>long long</code> 64, <code>double</code> 64-bit floating point. Overflow of a signed integer is undefined behaviour, not a wrap-around you can rely on. <code>auto</code> asks the compiler to infer a type that is still static and checked.</p>' }
      ],
      q: [
        { t: 'mc', q: 'Which stage produces the "undefined reference to `foo`" error?', o: ['The linker', 'The preprocessor', 'The parser', 'The loader'], a: 0, e: 'The compiler accepted the declaration; nothing supplied the definition at link time.' },
        { t: 'predict', q: 'What does this print?', code: '#include <iostream>\nint main() {\n    int a = 7, b = 2;\n    std::cout << a / b << " " << a % b << " " << (double)a / b;\n}', lang: 'cpp', a: ['3 1 3.5'], e: 'Integer division truncates; % gives the remainder; casting forces floating-point division.' },
        { t: 'fill', q: 'The compiler flag that turns on most warnings, and which you should always use, is -___.', a: ['wall', '-wall', 'wall -wextra'], e: '-Wall (plus -Wextra) catches a large share of real bugs before you run anything.' },
        { t: 'mc', q: 'What does `auto x = 3.0;` do?', o: ['Deduces the static type double at compile time', 'Makes x dynamically typed', 'Creates a variant type', 'Allocates on the heap'], a: 0, e: 'Type inference, not dynamic typing. The type is fixed once deduced.' },
        { t: 'tf', q: 'Signed integer overflow in C++ is guaranteed to wrap around to a negative number.', a: false, e: 'It is undefined behaviour: the optimiser may assume it never happens. Use unsigned types or checked arithmetic when wrapping matters.' }
      ]
    },
    {
      id: 'cpp-funcs', title: 'Functions, arrays and strings', icon: '🧮', topics: ['Functions', 'Arrays', 'Strings'],
      learn: [
        { h: 'Pass by value, reference, or const reference', p: '<pre>void f(std::string s);         // copies\nvoid g(std::string& s);        // can modify the caller\'s object\nvoid h(const std::string& s);  // no copy, cannot modify — the default for big types</pre>', code: 'int add(int a, int b) { return a + b; }\nvoid scale(std::vector<int>& v, int k) {\n    for (int& x : v) x *= k;      // reference in the loop mutates\n}' },
        { h: 'Prefer std::vector and std::string', p: '<p>Raw arrays decay to pointers and forget their size. <code>std::vector</code> knows its size, grows, and frees itself; <code>std::string</code> does the same for text. Use raw arrays only when you must.</p>', code: '#include <vector>\n#include <string>\nstd::vector<int> v{3, 1, 4};\nv.push_back(1);\nv.size();  v[0];  v.at(9);   // at() bounds-checks and throws\nstd::string s = "hi";\ns += " there";  s.substr(0, 2);' },
        { h: 'Overloading and default arguments', p: '<p>Functions can share a name with different parameter types. Defaults go in the declaration: <code>void log(const std::string&amp; msg, int level = 1);</code>. Templates (next stops) generalise the same idea across types.</p>' }
      ],
      q: [
        { t: 'mc', q: 'Why pass a large object as `const std::string&` rather than by value?', o: ['It avoids copying while promising not to modify it', 'It makes the function static', 'References are faster to declare', 'It allocates on the heap'], a: 0, e: 'No copy, and the const documents and enforces the intent.' },
        { t: 'predict', q: 'What does this print?', code: 'void bump(int x)   { x += 1; }\nvoid bump2(int& x) { x += 1; }\nint main() {\n    int a = 5; bump(a); std::cout << a << " ";\n    bump2(a); std::cout << a;\n}', lang: 'cpp', a: ['5 6'], e: 'Pass by value copies; pass by reference lets the function modify the caller\'s variable.' },
        { t: 'mc', q: 'What is the difference between `v[9]` and `v.at(9)` on a vector of size 3?', o: ['[] is undefined behaviour; at() throws std::out_of_range', 'Both throw', 'Both return 0', 'at() is a syntax error'], a: 0, e: 'Bounds checking costs a little speed and buys you a diagnosable error instead of memory corruption.' },
        { t: 'fill', q: 'The standard container that knows its own size and manages its own memory, unlike a raw array, is std::___.', a: ['vector'], e: 'std::vector is the default container in modern C++.' },
        { t: 'fix', q: 'This function returns a dangling reference. What is the fix?', code: 'const std::string& name() {\n    std::string local = "ada";\n    return local;\n}', lang: 'cpp', o: ['Return by value: `std::string name()`', 'Make local static const', 'Add const to the return type', 'Use a pointer instead'], a: 0, e: 'The local dies at the end of the function. Returning by value is cheap thanks to move semantics and copy elision.' }
      ]
    },
    {
      id: 'cpp-pointers', title: 'Pointers, references and memory', icon: '📍', topics: ['Pointers', 'References', 'Memory'],
      learn: [
        { h: 'A pointer holds an address', p: '', code: 'int x = 42;\nint* p = &x;      // & takes the address\nstd::cout << *p;  // * dereferences: 42\n*p = 7;           // writes through the pointer; x is now 7\nint* q = nullptr; // points at nothing; dereferencing is UB' },
        { h: 'Stack vs heap', p: '<p><b>Stack</b>: automatic, fast, freed when the scope ends, limited size. <b>Heap</b>: <code>new</code>/<code>delete</code> (or better, containers and smart pointers), lives until freed, costs a little to allocate.</p><p>Every <code>new</code> needs exactly one <code>delete</code>. Too few leaks memory; too many is a double free. This is why modern C++ avoids both keywords in ordinary code.</p>' },
        { h: 'References are not pointers', p: '<p>A reference is an alias: it must bind on creation, cannot be null, and cannot be re-seated. Use references for parameters and pointers when "no object" is a valid state or when you need to re-point.</p>' }
      ],
      lab: 'lists',
      q: [
        { t: 'predict', q: 'What does this print?', code: 'int x = 10;\nint* p = &x;\n*p = *p * 2;\nstd::cout << x << " " << (p == &x);', lang: 'cpp', a: ['20 1'], e: 'Writing through the pointer changes x itself; comparing addresses gives true, printed as 1.' },
        { t: 'mc', q: 'What is a dangling pointer?', o: ['A pointer to memory that has already been freed or gone out of scope', 'A pointer set to nullptr', 'A pointer to a pointer', 'An uninitialised reference'], a: 0, e: 'Using it is undefined behaviour and one of the classic sources of security holes.' },
        { t: 'match', q: 'Match each memory problem to its cause.', p: [['Memory leak', 'new without a matching delete'], ['Double free', 'delete called twice on one address'], ['Dangling pointer', 'Using memory after it was freed'], ['Buffer overflow', 'Writing past the end of an allocation']], e: 'Smart pointers and containers eliminate most of these by construction.' },
        { t: 'mc', q: 'Which statement about references is true?', o: ['A reference must be initialised and cannot be re-seated', 'A reference can be null', 'A reference can point to a different object later', 'References and pointers are identical'], a: 0, e: 'That is exactly why references are preferred for parameters that must always refer to something.' },
        { t: 'tf', q: 'Local variables declared inside a function normally live on the stack and are freed automatically.', a: true, e: 'Automatic storage duration: this is what RAII builds on.' }
      ]
    },
    {
      id: 'cpp-classes', title: 'Classes, RAII and smart pointers', icon: '🏛️', topics: ['Classes', 'OOP', 'RAII', 'Smart pointers'],
      learn: [
        { h: 'RAII: resources are owned by objects', p: '<p>Acquire a resource in the constructor, release it in the destructor. When the object goes out of scope — normally or by exception — the destructor runs and the resource is released. Files, locks, sockets and memory all use this.</p>', code: 'class File {\n    std::FILE* f;\npublic:\n    explicit File(const char* path) : f(std::fopen(path, "r")) {}\n    ~File() { if (f) std::fclose(f); }   // always runs\n    File(const File&) = delete;          // non-copyable\n};' },
        { h: 'Smart pointers express ownership', p: '<pre>std::unique_ptr&lt;T&gt;  one owner, freed automatically, movable not copyable\nstd::shared_ptr&lt;T&gt;  reference counted, freed when the last owner dies\nstd::weak_ptr&lt;T&gt;    non-owning observer, breaks shared_ptr cycles</pre>', code: 'auto p = std::make_unique<Node>(5);   // no delete anywhere\nauto s = std::make_shared<Config>();  // shared ownership' },
        { h: 'Virtual functions and the rule of zero', p: '<p>A base class used polymorphically needs <code>virtual</code> methods and a <code>virtual ~Base()</code>, or deleting through a base pointer is undefined. Best practice: design classes so that the compiler-generated copy, move and destructor are correct, and write none of them — the rule of zero.</p>' }
      ],
      q: [
        { t: 'mc', q: 'What does RAII guarantee?', o: ['A resource is released when its owning object goes out of scope, including during exceptions', 'Memory is allocated lazily', 'Objects are garbage collected', 'Resources are shared between threads safely'], a: 0, e: 'Deterministic cleanup tied to scope is C++\'s answer to garbage collection.' },
        { t: 'mc', q: 'Which smart pointer expresses a single exclusive owner?', o: ['unique_ptr', 'shared_ptr', 'weak_ptr', 'auto_ptr'], a: 0, e: 'unique_ptr is movable but not copyable, so ownership transfer is explicit and free of overhead.' },
        { t: 'mc', q: 'Why must a polymorphic base class have a virtual destructor?', o: ['Deleting a derived object through a base pointer is otherwise undefined behaviour', 'To allow inheritance at all', 'To enable operator overloading', 'To make the class abstract'], a: 0, e: 'Without it the derived destructor never runs and its resources leak.' },
        { t: 'fill', q: 'Two shared_ptrs that reference each other never reach zero. The pointer type used to break that cycle is ____ptr.', a: ['weak', 'weak_ptr'], e: 'weak_ptr observes without owning, so the count can fall to zero.' },
        { t: 'predict', q: 'In what order do the messages appear?', code: 'struct Noisy {\n    Noisy()  { std::cout << "up\\n"; }\n    ~Noisy() { std::cout << "down\\n"; }\n};\nint main() {\n    Noisy n;\n    std::cout << "work\\n";\n}', lang: 'cpp', a: ['up\nwork\ndown'], e: 'The destructor runs at the closing brace. That determinism is what makes RAII reliable.' }
      ]
    },
    {
      id: 'cpp-stl', title: 'Templates and the STL', icon: '📚', topics: ['Templates', 'STL', 'Vectors', 'Maps', 'Sets', 'Iterators'],
      learn: [
        { h: 'Templates: generic code, checked at compile time', p: '<p>The compiler generates a separate version for each type used, so there is no run-time cost.</p>', code: 'template <typename T>\nT largest(const std::vector<T>& v) {\n    T best = v.at(0);\n    for (const T& x : v) if (best < x) best = x;\n    return best;\n}' },
        { h: 'Containers and their costs', p: '<pre>vector&lt;T&gt;          contiguous; index O(1); push_back amortised O(1)\ndeque&lt;T&gt;           fast push/pop at both ends\nmap&lt;K,V&gt;           sorted, balanced tree, O(log n)\nunordered_map&lt;K,V&gt; hash table, O(1) average\nset / unordered_set  unique keys, same trade-off</pre><p>vector is the default: cache locality usually beats theoretical complexity for small n.</p>' },
        { h: 'Iterators and algorithms', p: '<p>Algorithms work on iterator ranges, so the same function serves every container.</p>', code: '#include <algorithm>\nstd::sort(v.begin(), v.end());\nauto it = std::find(v.begin(), v.end(), 42);\nif (it != v.end()) std::cout << "found at " << (it - v.begin());\nstd::sort(v.begin(), v.end(), [](int a, int b){ return a > b; });' }
      ],
      q: [
        { t: 'mc', q: 'When is a template function\'s code generated?', o: ['At compile time, once per type actually used', 'At run time on first call', 'When the linker runs', 'Never: it is interpreted'], a: 0, e: 'This is why templates are fast, and why template errors are long and appear at compile time.' },
        { t: 'match', q: 'Match each container to its behaviour.', p: [['std::vector', 'Contiguous, index in O(1)'], ['std::map', 'Sorted keys, O(log n)'], ['std::unordered_map', 'Hash table, O(1) average'], ['std::set', 'Unique sorted keys']], e: 'map is ordered; unordered_map is hashed. Choose by whether you need ordering.' },
        { t: 'predict', q: 'What does this print?', code: 'std::vector<int> v{5, 1, 4};\nstd::sort(v.begin(), v.end());\nfor (int x : v) std::cout << x << " ";\nstd::cout << (std::find(v.begin(), v.end(), 9) == v.end());', lang: 'cpp', a: ['1 4 5 1'], e: 'find returns end() when the value is absent, and comparing equal to end() prints 1 for true.' },
        { t: 'mc', q: 'What does `std::find` return when the value is not present?', o: ['The end iterator of the range', 'nullptr', '-1', 'It throws'], a: 0, e: 'Always compare the result with end() before dereferencing it.' },
        { t: 'fill', q: 'The header you include for sort, find and count is <___>.', a: ['algorithm', '<algorithm>'], e: '#include <algorithm> gives you the range algorithms.' }
      ]
    },
    {
      id: 'cpp-debug', title: 'Debugging and undefined behaviour', icon: '🧪', topics: ['Debugging', 'Undefined behaviour', 'Tooling'],
      learn: [
        { h: 'Undefined behaviour is not a crash', p: '<p>Out-of-bounds access, use after free, signed overflow, reading uninitialised memory, dereferencing null: the standard says anything may happen. The program may appear to work — until the optimiser, a new compiler, or production input changes the outcome.</p>' },
        { h: 'Tools that find it for you', p: '<pre>g++ -g -fsanitize=address,undefined main.cpp   # catches UB at run time\nvalgrind ./app                                  # leaks and invalid reads\ngdb ./app   → run, bt, break file:line, print x</pre><p>Sanitizers turn "it crashes sometimes on a colleague\'s machine" into a precise line number.</p>', lang: 'bash' },
        { h: 'A habit that prevents most of it', p: '<p>Prefer containers and smart pointers to raw arrays and <code>new</code>; use <code>at()</code> during development; initialise every variable at declaration; compile with warnings as errors in CI. Most C++ memory bugs are a style choice away from impossible.</p>' }
      ],
      q: [
        { t: 'mc', q: 'A program reads past the end of an array and prints plausible values. This is:', o: ['Undefined behaviour that happens to look fine today', 'Safe, since it printed something', 'A compiler bug', 'Guaranteed to print zero'], a: 0, e: 'Absence of a crash is not evidence of correctness in C++.' },
        { t: 'fill', q: 'The compiler flag that adds run-time checks for memory errors is -fsanitize=___.', a: ['address', 'address,undefined', 'undefined'], e: 'AddressSanitizer catches out-of-bounds and use-after-free; UBSan catches other undefined behaviour.' },
        { t: 'match', q: 'Match the tool to the job.', p: [['gdb', 'Step through and inspect a running program'], ['valgrind', 'Find leaks and invalid memory reads'], ['AddressSanitizer', 'Catch out-of-bounds and use-after-free at run time'], ['-Wall -Wextra', 'Warn about suspicious code at compile time']], e: 'Different stages: compile-time warnings, run-time instrumentation, interactive debugging.' },
        { t: 'mc', q: 'Which habit removes the largest class of C++ memory bugs?', o: ['Use containers and smart pointers instead of new/delete', 'Add more comments', 'Compile without optimisation', 'Use global variables'], a: 0, e: 'RAII ownership means there is no manual free to get wrong.' },
        { t: 'tf', q: 'Reading an uninitialised local variable is defined to give zero.', a: false, e: 'It is undefined behaviour. Initialise at the point of declaration.' }
      ]
    }
  ]
});
