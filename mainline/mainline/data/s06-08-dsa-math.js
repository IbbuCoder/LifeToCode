/* Stages 6-8: data structures, algorithms, mathematics for computer science. */
CS.addStage({
  id: 's6', n: 6, title: 'Data structures', short: 'Data structures', track: 'core', icon: '🧱', pos: [560, 140], prereq: ['s3'],
  blurb: 'Explanation, visualisation, implementation, practice and challenge for each structure. Build them, do not just name them.',
  nodes: [
    {
      id: 'ds-arrays', title: 'Arrays and dynamic arrays', icon: '📏', topics: ['Arrays', 'Dynamic arrays'],
      learn: [
        { h: 'An array is contiguous memory', p: '<p>Elements sit next to each other, all the same size, so the address of index i is <code>base + i × size</code>: one multiplication and one add, O(1), no searching. Contiguity also means the CPU cache loads neighbours for free, which is why arrays beat "theoretically equal" structures in practice.</p>' },
        { h: 'Dynamic arrays grow by doubling', p: '<p>Python lists, C++ vectors and Java ArrayLists are dynamic arrays: when full, they allocate a bigger block (usually 2×) and copy. Most appends are O(1); the occasional copy is O(n). Averaged out, append is <b>amortised O(1)</b>.</p>', code: 'class DynamicArray:\n    def __init__(self):\n        self._data = [None] * 1\n        self._n = 0\n\n    def append(self, value):\n        if self._n == len(self._data):\n            bigger = [None] * (2 * len(self._data))   # O(n), but rare\n            for i in range(self._n):\n                bigger[i] = self._data[i]\n            self._data = bigger\n        self._data[self._n] = value\n        self._n += 1' },
        { h: 'The costs that shape your code', p: '<pre>index          O(1)\nappend         O(1) amortised\ninsert(0, x)   O(n)  — everything shifts right\nremove(0)      O(n)\nsearch         O(n) unsorted, O(log n) sorted with binary search</pre>' }
      ],
      lab: 'lists',
      q: [
        { t: 'mc', q: 'Why is reading `arr[5000]` as fast as `arr[0]`?', o: ['The address is computed arithmetically from the index', 'The array is sorted', 'The CPU caches every element', 'It is not; later indices are slower'], a: 0, e: 'base + i × element_size. No traversal is involved.' },
        { t: 'mc', q: 'What does "amortised O(1)" mean for appending to a dynamic array?', o: ['Most appends are O(1); the rare resize is O(n), and the average stays constant', 'Every append is exactly one step', 'It is O(1) only for small arrays', 'It means O(n) in disguise'], a: 0, e: 'Doubling makes copies exponentially rare, so the cost spread over n appends is constant.' },
        { t: 'mc', q: 'Inserting at the front of a list of 1,000,000 items costs:', o: ['O(n): every later element shifts right', 'O(1)', 'O(log n)', 'O(n log n)'], a: 0, e: 'Use a deque when you need fast insertion at both ends.' },
        { t: 'order', q: 'Order the steps a dynamic array takes when it is full and you append.', plain: true, o: ['Allocate a new block, usually twice the size', 'Copy the existing elements into it', 'Free or release the old block', 'Store the new value and increment the count'], e: 'Allocate, copy, release, store.' },
        { t: 'code', q: 'Implement `rotate(arr, k)` returning a new list rotated left by k positions, in O(n) and without a loop of single-step rotations.', starter: 'def rotate(arr, k):\n    pass\n', tests: 'assert rotate([1,2,3,4,5], 2) == [3,4,5,1,2]\nassert rotate([1,2,3], 0) == [1,2,3]\nassert rotate([1,2,3], 5) == [3,1,2], "k larger than len should wrap"\nassert rotate([], 3) == []\nprint("Rotated.")', sol: 'def rotate(arr, k):\n    if not arr:\n        return []\n    k %= len(arr)\n    return arr[k:] + arr[:k]', hint: 'Use k % len(arr) to handle large k, then slice twice and concatenate.', e: 'Slicing is O(n) once, rather than O(n·k) for repeated single rotations.' }
      ]
    },
    {
      id: 'ds-linked', title: 'Linked lists', icon: '🔗', topics: ['Linked lists'],
      learn: [
        { h: 'Nodes scattered in memory, joined by pointers', p: '<p>Each node holds a value and a reference to the next node. Insertion and deletion are O(1) <i>given the node</i>, because nothing shifts — but reaching position i costs O(i), and there is no random access.</p>', code: 'class Node:\n    def __init__(self, value, next=None):\n        self.value = value\n        self.next = next\n\nclass LinkedList:\n    def __init__(self):\n        self.head = None\n\n    def push_front(self, value):       # O(1)\n        self.head = Node(value, self.head)\n\n    def __iter__(self):\n        node = self.head\n        while node:\n            yield node.value\n            node = node.next' },
        { h: 'Reversing: three pointers', p: '<p>The canonical interview exercise. Walk the list, flipping each <code>next</code> as you go.</p>', code: 'def reverse(head):\n    prev = None\n    while head:\n        nxt = head.next    # remember the rest\n        head.next = prev   # flip\n        prev = head        # advance\n        head = nxt\n    return prev            # new head' },
        { h: 'When to use one, honestly', p: '<p>Rarely, in application code: a dynamic array is faster for most work because of cache locality. Linked structures matter inside other things — LRU caches, hash-table buckets, free lists, adjacency lists — and understanding pointers is the point of learning them.</p><p>Variants: doubly linked (a <code>prev</code> pointer, O(1) deletion given a node) and circular (last points to first).</p>' }
      ],
      lab: 'lists',
      q: [
        { t: 'mc', q: 'What does a linked list give up compared with an array?', o: ['Random access: reaching index i costs O(i)', 'The ability to store objects', 'Insertion at the head', 'Iteration'], a: 0, e: 'Pointer chasing also defeats the CPU cache, which costs more in practice than the big-O suggests.' },
        { t: 'order', q: 'Order the steps for reversing a singly linked list.', o: ['nxt = head.next', 'head.next = prev', 'prev = head', 'head = nxt'], e: 'Save the rest, flip the pointer, then advance both cursors.' },
        { t: 'mc', q: 'Inserting after a node you already hold a reference to costs:', o: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'], a: 0, e: 'Only two pointers change. Finding the node is the expensive part.' },
        { t: 'tf', q: 'A doubly linked list can delete a given node in O(1) without scanning from the head.', a: true, e: 'The prev pointer means you can rewire both neighbours immediately. That is why LRU caches use them.' },
        { t: 'code', q: 'Using the Node class given, write `to_list(head)` returning the values in order, and `length(head)`.', starter: 'class Node:\n    def __init__(self, value, next=None):\n        self.value = value\n        self.next = next\n\ndef to_list(head):\n    pass\n\ndef length(head):\n    pass\n', tests: 'n = Node(1, Node(2, Node(3)))\nassert to_list(n) == [1, 2, 3]\nassert length(n) == 3\nassert to_list(None) == [] and length(None) == 0\nprint("Traversed.")', sol: 'class Node:\n    def __init__(self, value, next=None):\n        self.value = value\n        self.next = next\n\ndef to_list(head):\n    out = []\n    while head:\n        out.append(head.value)\n        head = head.next\n    return out\n\ndef length(head):\n    n = 0\n    while head:\n        n += 1\n        head = head.next\n    return n', hint: 'while head: ... head = head.next is the traversal loop for every linked structure.', e: 'Handle the empty list (None) without a special case by letting the while loop run zero times.' }
      ]
    },
    {
      id: 'ds-stackqueue', title: 'Stacks, queues and deques', icon: '🥞', topics: ['Stacks', 'Queues', 'Deques'],
      learn: [
        { h: 'Stack: last in, first out', p: '<p><code>push</code>, <code>pop</code>, <code>peek</code>, all O(1). Stacks appear wherever you must remember what to come back to: function calls, undo history, bracket matching, depth-first search, expression evaluation.</p>', code: 'stack = []\nstack.append(x)   # push\nstack.pop()       # pop the most recent' },
        { h: 'Queue: first in, first out', p: '<p><code>enqueue</code> at the back, <code>dequeue</code> from the front. Print jobs, task pipelines, breadth-first search. In Python use <code>collections.deque</code>: <code>list.pop(0)</code> is O(n).</p>', code: 'from collections import deque\nq = deque()\nq.append(x)      # enqueue\nq.popleft()      # dequeue, O(1)' },
        { h: 'Deque: both ends', p: '<p>A double-ended queue supports O(1) push and pop at both ends, and is the natural structure for sliding windows, undo/redo pairs and work stealing.</p>' }
      ],
      lab: 'lists',
      q: [
        { t: 'match', q: 'Match each use to the structure it needs.', p: [['Undo history', 'Stack'], ['Print job queue', 'Queue'], ['Breadth-first search frontier', 'Queue'], ['Depth-first search frontier', 'Stack']], e: 'BFS uses a queue and DFS uses a stack: that single difference changes the entire traversal order.' },
        { t: 'predict', q: 'What is printed?', code: 's = []\nfor ch in "abc":\n    s.append(ch)\nprint(s.pop(), s.pop())', a: ['c b'], e: 'LIFO: the most recent item comes off first.' },
        { t: 'mc', q: 'Why use `collections.deque` instead of a list for a queue in Python?', o: ['list.pop(0) is O(n); deque.popleft() is O(1)', 'deque uses less memory', 'lists cannot hold objects', 'deque sorts automatically'], a: 0, e: 'Removing from the front of a list shifts every remaining element.' },
        { t: 'code', q: 'Write `balanced(text)` returning True when brackets ()[]{} are correctly nested and matched.', starter: 'def balanced(text):\n    pass\n', tests: 'assert balanced("a(b[c]{d})") is True\nassert balanced("(]") is False\nassert balanced("(()") is False\nassert balanced(")(") is False\nassert balanced("") is True\nprint("Balanced.")', sol: 'def balanced(text):\n    pairs = {")": "(", "]": "[", "}": "{"}\n    stack = []\n    for ch in text:\n        if ch in "([{":\n            stack.append(ch)\n        elif ch in pairs:\n            if not stack or stack.pop() != pairs[ch]:\n                return False\n    return not stack', hint: 'Push openers. On a closer, pop and compare. At the end the stack must be empty.', e: 'This is the classic proof that a stack is the right tool for nesting.' },
        { t: 'tf', q: 'A deque can act as both a stack and a queue.', a: true, e: 'Push and pop at either end in O(1), so it covers both disciplines.' }
      ]
    },
    {
      id: 'ds-hash', title: 'Hash tables', icon: '#️⃣', topics: ['Hash tables', 'Collisions', 'Load factor'],
      learn: [
        { h: 'Turn a key into an index', p: '<p>A hash function maps a key to a bucket number: <code>index = hash(key) % capacity</code>. Lookup is then arithmetic plus one comparison — O(1) average, no scanning. Python dicts and sets, Java HashMap and C++ unordered_map all work this way.</p>' },
        { h: 'Collisions are normal', p: '<p>Two keys can land in the same bucket. Two standard fixes: <b>chaining</b> (each bucket holds a small list) and <b>open addressing</b> (probe for the next free slot). Worst case degrades to O(n) if everything collides, which is why hash functions must spread keys well.</p>', code: 'class HashMap:\n    def __init__(self, capacity=8):\n        self.buckets = [[] for _ in range(capacity)]\n\n    def put(self, key, value):\n        bucket = self.buckets[hash(key) % len(self.buckets)]\n        for i, (k, v) in enumerate(bucket):\n            if k == key:\n                bucket[i] = (key, value)   # replace\n                return\n        bucket.append((key, value))' },
        { h: 'Load factor and rehashing', p: '<p>Load factor = items ÷ buckets. Above roughly 0.7 collisions become common, so the table grows and every key is rehashed into a bigger array. Keys must be immutable: mutate a key after insertion and its hash no longer points at where it lives.</p>' }
      ],
      q: [
        { t: 'mc', q: 'What is a hash collision?', o: ['Two different keys mapping to the same bucket', 'Two identical keys inserted twice', 'A hash function that crashes', 'Running out of memory'], a: 0, e: 'Unavoidable by the pigeonhole principle: infinite keys, finite buckets.' },
        { t: 'mc', q: 'Average and worst-case lookup in a hash table are:', o: ['O(1) and O(n)', 'O(1) and O(1)', 'O(log n) and O(n)', 'O(n) and O(n²)'], a: 0, e: 'Worst case is everything in one bucket. Good hash functions and resizing keep it far away.' },
        { t: 'mc', q: 'Why must dictionary keys be immutable?', o: ['A changed key would hash to a different bucket than the one it is stored in', 'Mutable objects use more memory', 'Python cannot compare mutable objects', 'To keep insertion order'], a: 0, e: 'The stored entry would become unreachable. That is why lists cannot be keys and tuples can.' },
        { t: 'fill', q: 'Items divided by buckets gives the ___ factor, which triggers a resize when it gets too high.', a: ['load'], e: 'Most implementations resize around 0.7.' },
        { t: 'code', q: 'Write `first_repeat(items)` returning the first value that appears twice, or None. Must be O(n).', starter: 'def first_repeat(items):\n    pass\n', tests: 'assert first_repeat([1,2,3,2,1]) == 2\nassert first_repeat("abca") == "a"\nassert first_repeat([1,2,3]) is None\nbig = list(range(80000)) + [5]\nimport time; t = time.perf_counter()\nassert first_repeat(big) == 5\nassert time.perf_counter() - t < 1.0, "must be O(n): use a set"\nprint("Hashed.")', sol: 'def first_repeat(items):\n    seen = set()\n    for x in items:\n        if x in seen:\n            return x\n        seen.add(x)\n    return None', hint: 'A set gives O(1) membership. Add as you go and return on the first hit.', e: 'Hash-set membership is the workhorse behind dozens of linear-time algorithms.' }
      ]
    },
    {
      id: 'ds-trees', title: 'Trees and binary search trees', icon: '🌳', topics: ['Trees', 'Binary trees', 'BSTs'],
      learn: [
        { h: 'Vocabulary first', p: '<p>Root, parent, child, leaf, subtree. <b>Height</b> is the longest root-to-leaf path. A <b>binary</b> tree gives each node at most two children. Trees model hierarchy: file systems, the DOM, parse trees, decision trees.</p>' },
        { h: 'The BST property', p: '<p>Everything in the left subtree is smaller than the node, everything in the right is larger. Search, insert and delete are O(h) — O(log n) when the tree is balanced, O(n) when it degenerates into a line (which is what sorted insertions produce).</p>', code: 'def insert(node, value):\n    if node is None:\n        return Node(value)\n    if value < node.value:\n        node.left = insert(node.left, value)\n    elif value > node.value:\n        node.right = insert(node.right, value)\n    return node' },
        { h: 'Traversals', p: '<pre>in-order    left, node, right   → sorted output for a BST\npre-order   node, left, right   → copying or serialising\npost-order  left, right, node   → deleting or evaluating expressions\nlevel-order breadth first, with a queue</pre><p>Self-balancing variants (AVL, red-black, B-trees) keep the height logarithmic by rotating on insert. Databases use B-trees so each node is one disk page.</p>' }
      ],
      lab: 'trees',
      q: [
        { t: 'mc', q: 'Which traversal of a BST outputs the values in sorted order?', o: ['In-order', 'Pre-order', 'Post-order', 'Level-order'], a: 0, e: 'Left, node, right visits everything smaller before the node and everything bigger after it.' },
        { t: 'mc', q: 'You insert 1, 2, 3, 4, 5 in that order into a BST. What shape results, and what is search cost?', o: ['A right-leaning chain; O(n)', 'A balanced tree; O(log n)', 'A complete tree; O(1)', 'An error'], a: 0, e: 'Sorted input degenerates a plain BST into a linked list. Self-balancing trees exist for exactly this reason.' },
        { t: 'predict', q: 'Given this tree, what does an in-order traversal print?', code: '      8\n     / \\\n    3   10\n   / \\\n  1   6', lang: 'python', a: ['1 3 6 8 10', '1, 3, 6, 8, 10', '1\n3\n6\n8\n10'], e: 'Left subtree, node, right subtree, recursively.' },
        { t: 'fill', q: 'A balanced binary search tree performs search in O(___ n).', a: ['log', 'log2', 'log '], e: 'Each comparison discards half the remaining nodes.' },
        { t: 'code', q: 'Write `height(node)` for a binary tree of Node(value, left, right); an empty tree has height 0 and a single node has height 1.', starter: 'class Node:\n    def __init__(self, value, left=None, right=None):\n        self.value, self.left, self.right = value, left, right\n\ndef height(node):\n    pass\n', tests: 'assert height(None) == 0\nassert height(Node(1)) == 1\nt = Node(8, Node(3, Node(1)), Node(10))\nassert height(t) == 3, "expected 3, got " + str(height(t))\nprint("Measured.")', sol: 'class Node:\n    def __init__(self, value, left=None, right=None):\n        self.value, self.left, self.right = value, left, right\n\ndef height(node):\n    if node is None:\n        return 0\n    return 1 + max(height(node.left), height(node.right))', hint: 'Base case: None → 0. Otherwise 1 + the taller of the two subtrees.', e: 'Almost every tree algorithm has this shape: handle None, then combine the results of the children.' }
      ]
    },
    {
      id: 'ds-heaps', title: 'Heaps and priority queues', icon: '⛰️', topics: ['Heaps', 'Priority queues'],
      learn: [
        { h: 'A heap is a complete tree in an array', p: '<p>Min-heap rule: every parent is ≤ its children, so the minimum sits at the root. Stored in an array: children of index i are at 2i+1 and 2i+2, parent at (i−1)//2. No pointers needed.</p>' },
        { h: 'Costs', p: '<pre>peek minimum      O(1)\npush (sift up)    O(log n)\npop  (sift down)  O(log n)\nbuild from n items O(n) with heapify</pre>', code: 'import heapq\nh = []\nheapq.heappush(h, 5)\nheapq.heappush(h, 1)\nheapq.heappop(h)          # 1\nheapq.nlargest(3, data)   # top-k without a full sort\n# max-heap trick: push negated values' },
        { h: 'Where they earn their keep', p: '<p>Task schedulers, Dijkstra\'s algorithm, A*, event simulation, merging k sorted streams, and top-k over a huge stream (keep a heap of size k: O(n log k) instead of sorting everything).</p>' }
      ],
      lab: 'trees',
      q: [
        { t: 'mc', q: 'What does a min-heap guarantee?', o: ['Every parent is ≤ its children, so the minimum is at the root', 'The array is fully sorted', 'All leaves are equal', 'Lookup of any value is O(1)'], a: 0, e: 'It is a partial order: finding an arbitrary value is still O(n).' },
        { t: 'fill', q: 'In an array-backed heap, the children of index i live at indices 2i+1 and ___.', a: ['2i+2', '2*i+2', '2i + 2'], e: 'And the parent is at (i-1)//2.' },
        { t: 'mc', q: 'Best way to get the 10 largest items from a stream of 10 million?', o: ['Keep a min-heap of size 10: O(n log 10)', 'Sort everything: O(n log n)', 'Scan ten times', 'Load into a dict'], a: 0, e: 'Only ten items are ever in memory, and each new item costs at most log 10 work.' },
        { t: 'mc', q: 'Pushing onto a heap of n items costs:', o: ['O(log n)', 'O(1)', 'O(n)', 'O(n log n)'], a: 0, e: 'The new item sifts up at most the height of the tree.' },
        { t: 'code', q: 'Write `k_smallest(nums, k)` returning the k smallest values in ascending order, using heapq.', starter: 'import heapq\n\ndef k_smallest(nums, k):\n    pass\n', tests: 'assert k_smallest([5,1,9,3,7], 3) == [1,3,5]\nassert k_smallest([2], 5) == [2], "k larger than the list"\nassert k_smallest([], 3) == []\nprint("Heaped.")', sol: 'import heapq\n\ndef k_smallest(nums, k):\n    return heapq.nsmallest(k, nums)', hint: 'heapq.nsmallest does exactly this, and handles k > len(nums).', e: 'Knowing the standard library saves you from writing (and debugging) a heap by hand.' }
      ]
    },
    {
      id: 'ds-graphs', title: 'Graphs', icon: '🕸️', topics: ['Graphs', 'Adjacency lists'],
      learn: [
        { h: 'Vertices and edges', p: '<p>Graphs model relationships: social networks, roads, dependencies, web links, state machines. Edges can be <b>directed</b> or not, and <b>weighted</b> or not. A tree is just a connected graph with no cycles.</p>' },
        { h: 'Two representations', p: '<pre>adjacency list   {A: [B, C], B: [C]}    space O(V+E)  — the default\nadjacency matrix [[0,1,1],[0,0,1]]     space O(V²)   — fast edge lookup, good when dense</pre>', code: 'graph = {\n    "A": ["B", "D"],\n    "B": ["A", "C"],\n    "C": ["B"],\n    "D": ["A"],\n}' },
        { h: 'Terms you will meet again', p: '<p>Degree (edges at a vertex), path, cycle, connected component, DAG (directed acyclic graph — the shape of build dependencies and task scheduling). Topological sort orders a DAG so every edge points forward.</p>' }
      ],
      lab: 'graph',
      q: [
        { t: 'mc', q: 'For a sparse graph with 1,000,000 vertices and 2,000,000 edges, which representation is practical?', o: ['Adjacency list, O(V+E) space', 'Adjacency matrix, O(V²) space', 'Either; they are the same size', 'Neither; use a tree'], a: 0, e: 'A matrix would need 10¹² cells. Lists store only the edges that exist.' },
        { t: 'fill', q: 'A directed graph with no cycles is abbreviated ___.', a: ['dag', 'directed acyclic graph'], e: 'DAGs model dependencies, and can be topologically sorted.' },
        { t: 'match', q: 'Match each system to what its graph models.', p: [['Social network', 'People and friendships'], ['Road map', 'Junctions and roads with distances'], ['Build system', 'Tasks and dependencies (a DAG)'], ['Web', 'Pages and hyperlinks (directed)']], e: 'Recognising a problem as a graph problem is most of the work.' },
        { t: 'tf', q: 'Every tree is a graph, but not every graph is a tree.', a: true, e: 'A tree is a connected acyclic graph with exactly V−1 edges.' },
        { t: 'code', q: 'Write `neighbours_of(graph, start)` returning a sorted list of the vertices directly reachable from start, or [] if the vertex is absent.', starter: 'def neighbours_of(graph, start):\n    pass\n', tests: 'g = {"A": ["D", "B"], "B": ["A"]}\nassert neighbours_of(g, "A") == ["B", "D"]\nassert neighbours_of(g, "Z") == []\nprint("Adjacent.")', sol: 'def neighbours_of(graph, start):\n    return sorted(graph.get(start, []))', hint: 'dict.get with a default of [] avoids a KeyError for missing vertices.', e: 'Defensive lookups keep graph code short; the traversals come next.' }
      ]
    },
    {
      id: 'ds-tries', title: 'Tries', icon: '🔤', topics: ['Tries'],
      learn: [
        { h: 'A tree keyed by characters', p: '<p>Each edge is one character, so a path from the root spells a prefix. Lookup costs O(length of the word), independent of how many words are stored — which is why autocomplete and spell checkers use them.</p>', code: 'class Trie:\n    def __init__(self):\n        self.root = {}\n\n    def insert(self, word):\n        node = self.root\n        for ch in word:\n            node = node.setdefault(ch, {})\n        node["$"] = True          # marks a complete word\n\n    def starts_with(self, prefix):\n        node = self.root\n        for ch in prefix:\n            if ch not in node:\n                return False\n            node = node[ch]\n        return True' },
        { h: 'Trie vs hash set', p: '<p>A hash set answers "is this exact word present?" in O(1). A trie also answers "which words start with this?" and "what is the longest matching prefix?", which a hash cannot do without scanning. The cost is memory: many small nodes.</p>' },
        { h: 'Real uses', p: '<p>Autocomplete and search suggestions, IP routing tables (longest prefix match), T9 keyboards, dictionary compression, and word games such as Boggle solvers.</p>' }
      ],
      q: [
        { t: 'mc', q: 'Looking up a word of length L in a trie holding one million words costs:', o: ['O(L)', 'O(1,000,000)', 'O(log 1,000,000)', 'O(L × 1,000,000)'], a: 0, e: 'One step per character. The size of the dictionary does not appear.' },
        { t: 'mc', q: 'What can a trie do that a hash set cannot do efficiently?', o: ['Find every word with a given prefix', 'Test exact membership', 'Store strings', 'Delete a word'], a: 0, e: 'Prefix structure is preserved in the tree, so prefix queries are a walk plus a subtree scan.' },
        { t: 'fill', q: 'Routers use longest ___ match, which is naturally implemented with a trie.', a: ['prefix'], e: 'The most specific matching route wins, which is a prefix query.' },
        { t: 'tf', q: 'A trie usually uses less memory than a hash set of the same words.', a: false, e: 'Usually more: each node holds child links. You pay memory for prefix queries.' },
        { t: 'code', q: 'Write `autocomplete(words, prefix)` returning the sorted words that start with prefix.', starter: 'def autocomplete(words, prefix):\n    pass\n', tests: 'w = ["cat", "car", "dog", "cart"]\nassert autocomplete(w, "ca") == ["car", "cart", "cat"]\nassert autocomplete(w, "z") == []\nassert autocomplete(w, "") == ["car", "cart", "cat", "dog"]\nprint("Suggested.")', sol: 'def autocomplete(words, prefix):\n    return sorted(w for w in words if w.startswith(prefix))', hint: 'startswith plus sorted is fine here; a trie is the upgrade when the list is huge and queries are constant.', e: 'Know the simple version and when it stops being enough.' }
      ]
    }
  ]
});

CS.addStage({
  id: 's7', n: 7, title: 'Algorithms', short: 'Algorithms', track: 'core', icon: '🧠', pos: [690, 140], prereq: ['s6'],
  blurb: 'Searching, sorting, recursion, greedy, dynamic programming, backtracking and graph algorithms — with animated visualisations.',
  nodes: [
    {
      id: 'al-search', title: 'Linear and binary search', icon: '🔍', topics: ['Linear search', 'Binary search'], lab: 'search',
      learn: [
        { h: 'Linear search: simple and universal', p: '<p>Check each element until you find the target. O(n), works on unsorted data, needs no preparation. For a one-off lookup in a small list, it is the right answer.</p>' },
        { h: 'Binary search: halve the problem', p: '<p>Requires sorted data. Compare the middle: if it is too small, discard the left half. 1,000,000 items take at most 20 comparisons.</p>', code: 'def binary_search(a, target):\n    lo, hi = 0, len(a) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if a[mid] == target:\n            return mid\n        if a[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1' },
        { h: 'The details that cause bugs', p: '<p>Use <code>lo &lt;= hi</code>, not <code>&lt;</code>, or you miss single-element ranges. Set <code>lo = mid + 1</code> and <code>hi = mid - 1</code>, never <code>lo = mid</code>, or you loop forever. Binary search also applies to answers, not only arrays: "smallest capacity that works" is a monotone predicate you can binary search over.</p>' }
      ],
      q: [
        { t: 'mc', q: 'What must be true before binary search is valid?', o: ['The data is sorted by the key you search on', 'The data is in a hash table', 'The data has no duplicates', 'The list is short'], a: 0, e: 'Without ordering, discarding half the range is unjustified.' },
        { t: 'fill', q: 'How many comparisons does binary search need in the worst case on 1024 sorted items?', a: ['10', '11'], e: 'log₂(1024) = 10 halvings.' },
        { t: 'fix', q: 'This binary search sometimes loops forever. Which line causes it?', code: 'while lo <= hi:\n    mid = (lo + hi) // 2\n    if a[mid] < target:\n        lo = mid\n    else:\n        hi = mid - 1', o: ['`lo = mid` should be `lo = mid + 1`', '`hi = mid - 1` should be `hi = mid`', '`mid` should use rounding up', 'The condition should be `lo < hi`'], a: 0, e: 'With two elements left, mid equals lo and the range never shrinks.' },
        { t: 'mc', q: 'You will search a 10,000,000-item list once. It is unsorted. Best approach?', o: ['Linear search: sorting first costs more than the single scan', 'Sort it, then binary search', 'Build a trie', 'Binary search anyway'], a: 0, e: 'Sorting is O(n log n). Preparation pays off only across many queries.' },
        { t: 'code', q: 'Implement `binary_search(a, target)` returning the index or -1. It must not use `in`, `.index()` or a linear scan.', starter: 'def binary_search(a, target):\n    pass\n', tests: 'a = list(range(0, 200, 2))\nassert binary_search(a, 0) == 0\nassert binary_search(a, 198) == 99\nassert binary_search(a, 7) == -1\nassert binary_search([], 1) == -1\nbig = list(range(2000000))\nimport time; t = time.perf_counter()\nfor q in range(0, 2000000, 100000):\n    assert binary_search(big, q) == q\nassert time.perf_counter() - t < 0.5, "should be logarithmic"\nprint("Halved.")', sol: 'def binary_search(a, target):\n    lo, hi = 0, len(a) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if a[mid] == target:\n            return mid\n        if a[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1', hint: 'Track lo and hi, compute mid, and move whichever bound the comparison rules out.', e: 'Getting the boundary conditions right by hand once is worth more than reading ten explanations.' }
      ]
    },
    {
      id: 'al-sort-basic', title: 'Bubble, selection and insertion sort', icon: '🫧', topics: ['Sorting', 'Bubble sort', 'Selection sort', 'Insertion sort'], lab: 'sorting',
      learn: [
        { h: 'The three quadratic sorts', p: '<ul><li><b>Bubble</b> — repeatedly swap out-of-order neighbours; largest values bubble to the end. Easy to explain, slow in practice.</li><li><b>Selection</b> — find the minimum of the unsorted part and swap it into place. O(n²) comparisons but only O(n) swaps, which matters when writes are expensive.</li><li><b>Insertion</b> — take the next element and slide it back into the sorted prefix. O(n) on nearly sorted data, stable, and genuinely useful for small arrays.</li></ul>' },
        { h: 'Why they still appear', p: '<p>Real library sorts (Timsort in Python and Java, introsort in C++) switch to insertion sort for small runs, because constant factors beat asymptotics below ~16 elements. Timsort also detects already-sorted runs, which is insertion sort\'s best case.</p>' },
        { h: 'Stability', p: '<p>A <b>stable</b> sort keeps equal elements in their original relative order. Sort by name, then stably by department, and you get departments with names still alphabetical inside. Insertion and merge sort are stable; selection and quick sort are not.</p>' }
      ],
      q: [
        { t: 'mc', q: 'Which sort is O(n) on already-sorted input?', o: ['Insertion sort', 'Selection sort', 'Bubble sort without the swapped flag', 'Merge sort'], a: 0, e: 'Each element is already in place, so no shifting happens: one pass.' },
        { t: 'mc', q: 'Selection sort is preferred when:', o: ['Writes are far more expensive than comparisons', 'Data is nearly sorted', 'Stability is required', 'The array is huge'], a: 0, e: 'It performs at most n−1 swaps, which matters for flash memory or costly moves.' },
        { t: 'mc', q: 'After one full pass of bubble sort (ascending) on [4, 2, 7, 1], the array is:', o: ['[2, 4, 1, 7]', '[1, 2, 4, 7]', '[2, 4, 7, 1]', '[4, 2, 1, 7]'], a: 0, e: '4 and 2 swap, 4 and 7 stay, 7 and 1 swap: the largest value reaches the end.' },
        { t: 'fill', q: 'A sort that preserves the relative order of equal elements is called ___.', a: ['stable'], e: 'Stability lets you sort by several keys in sequence.' },
        { t: 'code', q: 'Implement insertion sort as `insertion_sort(a)` returning a new sorted list. Do not call sorted() or .sort().', starter: 'def insertion_sort(a):\n    pass\n', tests: 'assert insertion_sort([3,1,2]) == [1,2,3]\nassert insertion_sort([]) == []\nassert insertion_sort([5,5,1]) == [1,5,5]\nimport random\nr = [random.randint(0,100) for _ in range(60)]\nassert insertion_sort(r) == sorted(r)\nprint("Sorted by hand.")', sol: 'def insertion_sort(a):\n    out = list(a)\n    for i in range(1, len(out)):\n        key = out[i]\n        j = i - 1\n        while j >= 0 and out[j] > key:\n            out[j + 1] = out[j]\n            j -= 1\n        out[j + 1] = key\n    return out', hint: 'Copy the list, then for each index shift larger elements right until the key fits.', e: 'Writing one quadratic sort by hand makes the divide-and-conquer sorts much easier to appreciate.' }
      ]
    },
    {
      id: 'al-sort-adv', title: 'Merge sort, quick sort and divide and conquer', icon: '⚔️', topics: ['Merge sort', 'Quick sort', 'Divide and conquer', 'Recursion'], lab: 'sorting',
      learn: [
        { h: 'Divide, conquer, combine', p: '<p>Split the problem, solve the pieces recursively, combine the answers. Merge sort splits blindly and does the work when merging; quick sort does the work when partitioning and combines trivially.</p>', code: 'def merge_sort(a):\n    if len(a) <= 1:\n        return a\n    mid = len(a) // 2\n    left, right = merge_sort(a[:mid]), merge_sort(a[mid:])\n    out, i, j = [], 0, 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            out.append(left[i]); i += 1\n        else:\n            out.append(right[j]); j += 1\n    return out + left[i:] + right[j:]' },
        { h: 'Quick sort', p: '<p>Choose a pivot, partition into smaller and larger, recurse on each side. O(n log n) average, in place, excellent cache behaviour. Worst case O(n²) when the pivot is always extreme — avoided with a random or median-of-three pivot.</p>' },
        { h: 'Choosing between them', p: '<pre>merge  O(n log n) always, stable, needs O(n) extra space — good for linked lists and external sorting\nquick  O(n log n) average, in place, unstable — usually fastest in memory\nTimsort merge + insertion hybrid; exploits existing runs — what Python actually uses</pre>' }
      ],
      q: [
        { t: 'mc', q: 'Where does merge sort do the actual ordering work?', o: ['In the merge step, after both halves are sorted', 'In the split step', 'In the base case', 'While choosing a pivot'], a: 0, e: 'Splitting is mechanical. Quick sort is the mirror image: partitioning does the work.' },
        { t: 'mc', q: 'Quick sort degrades to O(n²) when:', o: ['The pivot is consistently the smallest or largest element', 'The array is random', 'There are duplicates', 'The array is small'], a: 0, e: 'Partitions of size 0 and n−1 give n levels of recursion. Random pivots make this vanishingly unlikely.' },
        { t: 'order', q: 'Order the steps of quick sort.', plain: true, o: ['Choose a pivot', 'Partition into elements smaller and larger than the pivot', 'Recursively sort the smaller part', 'Recursively sort the larger part'], e: 'No combine step is needed: partitioning already put the pivot in its final place.' },
        { t: 'mc', q: 'Why does merge sort suit sorting a 500 GB file that does not fit in RAM?', o: ['It works on sequential streams and merges sorted chunks', 'It sorts in place', 'It is O(n)', 'It needs no comparisons'], a: 0, e: 'External merge sort: sort chunks that fit in memory, then merge them with sequential reads.' },
        { t: 'code', q: 'Write `merge(a, b)` that merges two already-sorted lists into one sorted list in O(n + m), without calling sorted().', starter: 'def merge(a, b):\n    pass\n', tests: 'assert merge([1,3,5],[2,4]) == [1,2,3,4,5]\nassert merge([], [1]) == [1]\nassert merge([1,1],[1]) == [1,1,1]\nassert merge([5],[1]) == [1,5]\nprint("Merged.")', sol: 'def merge(a, b):\n    out, i, j = [], 0, 0\n    while i < len(a) and j < len(b):\n        if a[i] <= b[j]:\n            out.append(a[i]); i += 1\n        else:\n            out.append(b[j]); j += 1\n    return out + a[i:] + b[j:]', hint: 'Two cursors. Take the smaller head each time, then append whatever remains.', e: 'This is the core of merge sort, of merging k sorted streams, and of external sorting.' }
      ]
    },
    {
      id: 'al-bigo', title: 'Big-O analysis', icon: '📐', topics: ['Big-O analysis', 'Complexity'],
      learn: [
        { h: 'Growth, not seconds', p: '<p>Big-O describes how work grows with input size, ignoring constants and lower-order terms: <code>3n² + 100n + 7</code> is O(n²). It answers "what happens when n gets 10× bigger", not "how fast is this on my laptop".</p>' },
        { h: 'The ladder', p: '<pre>O(1)        index a list, hash lookup\nO(log n)    binary search, balanced tree\nO(n)        one scan\nO(n log n)  good sorting, divide and conquer\nO(n²)       nested loops over the same data\nO(2ⁿ)       every subset\nO(n!)       every ordering</pre><p>At n = 1,000,000: O(n) is a second-ish, O(n²) is weeks, O(2ⁿ) is beyond the age of the universe.</p>' },
        { h: 'Reading it off code', p: '<p>Sequential blocks add (take the max), nested loops multiply, halving each step gives a log. Also track <b>space</b> complexity: recursion depth counts, and an O(n) auxiliary array may be the real constraint.</p><p>Constants still matter in reality: an O(n log n) algorithm with a huge constant can lose to O(n²) on small inputs, which is why libraries switch strategies by size.</p>' }
      ],
      q: [
        { t: 'gen', g: 'bigo' },
        { t: 'mc', q: 'What is the complexity of this? `for i in a: for j in a: ...` where a has n items.', o: ['O(n²)', 'O(n)', 'O(2n)', 'O(n log n)'], a: 0, e: 'Nested loops over the same collection multiply.' },
        { t: 'mc', q: 'Simplify `4n² + 1000n + 50` in big-O terms.', o: ['O(n²)', 'O(4n²)', 'O(n² + n)', 'O(1000n)'], a: 0, e: 'Drop constants and lower-order terms: only the dominant growth matters.' },
        { t: 'gen', g: 'bigo' },
        { t: 'mc', q: 'An algorithm runs in 1 second on 1,000 items. Roughly how long on 10,000 if it is O(n²)?', o: ['About 100 seconds', 'About 10 seconds', 'About 1 second', 'About 1,000 seconds'], a: 0, e: '10× the input squares to 100× the work.' },
        { t: 'short', q: 'Why can an O(n²) algorithm beat an O(n log n) one in a real program?', a: [['small', 'little', 'few'], ['constant', 'overhead', 'factor', 'cache', 'simple']], model: 'For small inputs the constant factors and overhead dominate, so a simple quadratic algorithm can be faster.', e: 'Which is why real sort implementations switch to insertion sort for short runs.' }
      ]
    },
    {
      id: 'al-greedy', title: 'Greedy algorithms', icon: '🪙', topics: ['Greedy algorithms'],
      learn: [
        { h: 'Take the best-looking option now', p: '<p>A greedy algorithm makes the locally optimal choice at each step and never reconsiders. It is fast and simple — and only correct when the problem has the right structure (a matroid, informally: local optima compose into a global one).</p>' },
        { h: 'Where greedy is provably right', p: '<ul><li><b>Interval scheduling</b> — always take the meeting that finishes earliest; this maximises the count.</li><li><b>Huffman coding</b> — repeatedly merge the two least frequent symbols.</li><li><b>Dijkstra</b>, <b>Kruskal</b> and <b>Prim</b> — always expand the cheapest frontier edge.</li></ul>', code: 'def max_meetings(intervals):\n    intervals.sort(key=lambda x: x[1])   # by end time\n    end, count = float("-inf"), 0\n    for s, e in intervals:\n        if s >= end:\n            count += 1\n            end = e\n    return count' },
        { h: 'Where it fails', p: '<p>Coin change with coins {1, 3, 4} and a target of 6: greedy takes 4 + 1 + 1 (three coins) when 3 + 3 (two) is optimal. With standard currency systems greedy happens to work, which is why the failure surprises people. When greedy fails, dynamic programming is usually the fix.</p>' }
      ],
      q: [
        { t: 'mc', q: 'Which greedy rule maximises the number of non-overlapping meetings?', o: ['Always choose the meeting that ends earliest', 'Always choose the shortest meeting', 'Always choose the one that starts earliest', 'Always choose the one with fewest conflicts'], a: 0, e: 'Ending earliest leaves the most room for everything after it, and can be proven optimal by an exchange argument.' },
        { t: 'mc', q: 'Coins are {1, 3, 4} and the target is 6. What does the greedy largest-coin-first strategy give, and what is optimal?', o: ['Greedy gives 3 coins (4+1+1); optimal is 2 (3+3)', 'Both give 2 coins', 'Greedy gives 2; optimal is 3', 'Neither can make 6'], a: 0, e: 'The classic counterexample: greedy is correct only for certain coin systems.' },
        { t: 'tf', q: 'A greedy algorithm may revisit and change an earlier decision.', a: false, e: 'Never reconsidering is what makes it greedy, and fast.' },
        { t: 'match', q: 'Match each algorithm to its greedy choice.', p: [['Dijkstra', 'Expand the nearest unvisited node'], ['Huffman coding', 'Merge the two least frequent symbols'], ['Kruskal', 'Add the cheapest edge that creates no cycle'], ['Interval scheduling', 'Take the earliest finishing interval']], e: 'All four are greedy algorithms with correctness proofs.' },
        { t: 'code', q: 'Write `max_meetings(intervals)` where each interval is (start, end): return the largest number that can be attended without overlap.', starter: 'def max_meetings(intervals):\n    pass\n', tests: 'assert max_meetings([(1,3),(2,5),(4,7),(8,9)]) == 3\nassert max_meetings([]) == 0\nassert max_meetings([(1,10),(2,3),(3,4)]) == 2\nprint("Scheduled.")', sol: 'def max_meetings(intervals):\n    end, count = float("-inf"), 0\n    for s, e in sorted(intervals, key=lambda x: x[1]):\n        if s >= end:\n            count += 1\n            end = e\n    return count', hint: 'Sort by end time, then take any interval that starts at or after the last chosen end.', e: 'Sorting by the right key is usually the whole trick in a greedy solution.' }
      ]
    },
    {
      id: 'al-dp', title: 'Dynamic programming', icon: '🧩', topics: ['Dynamic programming', 'Memoisation'],
      learn: [
        { h: 'Stop recomputing the same subproblem', p: '<p>DP applies when a problem has <b>overlapping subproblems</b> and <b>optimal substructure</b>. Naive recursive Fibonacci is O(2ⁿ) because it recomputes; memoise it and it becomes O(n).</p>', code: 'from functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef fib(n):\n    return n if n < 2 else fib(n-1) + fib(n-2)\n\n# bottom-up: same idea, no recursion\ndef fib_iter(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a' },
        { h: 'Top-down vs bottom-up', p: '<p><b>Memoisation</b> (top-down) keeps the recursive shape and caches results — easiest to write from a recurrence. <b>Tabulation</b> (bottom-up) fills a table in dependency order — no recursion limit, and often less memory once you notice you need only the last row.</p>' },
        { h: 'The recipe', p: '<ol><li>Define the state: what does <code>dp[i]</code> mean, in one sentence?</li><li>Write the recurrence: how does a state depend on smaller ones?</li><li>Give the base cases.</li><li>Choose an order so dependencies are computed first.</li></ol><p>Classics: coin change, 0/1 knapsack, longest common subsequence, edit distance, grid paths, house robber.</p>' }
      ],
      q: [
        { t: 'mc', q: 'What two properties must a problem have for DP to apply?', o: ['Overlapping subproblems and optimal substructure', 'Sorted input and unique values', 'Recursion and a base case', 'Greedy choice and a heap'], a: 0, e: 'Without overlap, plain divide and conquer is enough; without optimal substructure, sub-answers cannot be combined.' },
        { t: 'mc', q: 'Naive recursive fib(50) is impractical because:', o: ['It recomputes the same subproblems exponentially often', 'The numbers are too large for Python', 'It exceeds the recursion limit immediately', 'Recursion is always slow'], a: 0, e: 'About 2⁵⁰ calls. One caching decorator changes it to 50.' },
        { t: 'fill', q: 'Caching the results of a recursive function so repeated arguments are not recomputed is called ___.', a: ['memoisation', 'memoization', 'memoizing', 'caching'], e: 'Top-down DP. `functools.lru_cache` does it in one line.' },
        { t: 'match', q: 'Match each classic problem to its state definition.', p: [['Coin change', 'dp[amount] = fewest coins to make that amount'], ['Grid paths', 'dp[r][c] = ways to reach that cell'], ['Edit distance', 'dp[i][j] = cost to convert prefixes of length i and j'], ['House robber', 'dp[i] = best total using the first i houses']], e: 'Naming the state precisely is most of the difficulty in DP.' },
        { t: 'code', q: 'Write `coin_change(coins, amount)` returning the fewest coins that sum to amount, or -1 if impossible.', starter: 'def coin_change(coins, amount):\n    pass\n', tests: 'assert coin_change([1,3,4], 6) == 2, "3+3 beats greedy 4+1+1"\nassert coin_change([2], 3) == -1\nassert coin_change([1,2,5], 11) == 3\nassert coin_change([5], 0) == 0\nprint("Optimal.")', sol: 'def coin_change(coins, amount):\n    INF = float("inf")\n    dp = [0] + [INF] * amount\n    for a in range(1, amount + 1):\n        for c in coins:\n            if c <= a and dp[a - c] + 1 < dp[a]:\n                dp[a] = dp[a - c] + 1\n    return -1 if dp[amount] == INF else dp[amount]', hint: 'dp[a] = 1 + min(dp[a - c]) over usable coins; dp[0] = 0 and unreachable amounts stay at infinity.', e: 'Bottom-up tabulation: every amount is solved once using already-solved smaller amounts.' }
      ]
    },
    {
      id: 'al-backtrack', title: 'Backtracking', icon: '🧭', topics: ['Backtracking', 'Search trees'],
      learn: [
        { h: 'Try, recurse, undo', p: '<p>Backtracking explores a tree of partial solutions depth-first. At each step: choose an option, recurse, then undo the choice and try the next. Pruning invalid branches early is what makes it feasible.</p>', code: 'def permutations(items):\n    out, used, current = [], [False] * len(items), []\n    def go():\n        if len(current) == len(items):\n            out.append(current[:])      # copy!\n            return\n        for i, x in enumerate(items):\n            if used[i]:\n                continue\n            used[i] = True; current.append(x)   # choose\n            go()                                 # explore\n            current.pop(); used[i] = False       # undo\n    go()\n    return out' },
        { h: 'Classic problems', p: '<p>N-queens, sudoku solvers, maze solving, subsets and permutations, word search, constraint puzzles. The pattern is always: is this partial solution still viable? If not, return immediately.</p>' },
        { h: 'Cost and pruning', p: '<p>Worst case is exponential, because the search space is. Good pruning (constraint checks, ordering the most constrained choice first, symmetry breaking) is the difference between milliseconds and hours on the same problem.</p>' }
      ],
      q: [
        { t: 'order', q: 'Order the backtracking loop body.', plain: true, o: ['Check whether the partial solution is still valid', 'Make a choice', 'Recurse on the smaller remaining problem', 'Undo the choice before trying the next option'], e: 'Prune, choose, explore, undo.' },
        { t: 'mc', q: 'Why does backtracking undo its choice after recursing?', o: ['So the shared state is clean for the next branch', 'To free memory', 'To avoid recursion limits', 'Because recursion cannot return values'], a: 0, e: 'Without the undo, later branches inherit stale state and produce wrong answers.' },
        { t: 'mc', q: 'What makes a backtracking search practical on large inputs?', o: ['Pruning branches that cannot lead to a solution', 'Using a queue instead of recursion', 'Sorting the input', 'Caching every state'], a: 0, e: 'The search space is exponential; good constraint checks cut most of it before it is explored.' },
        { t: 'fill', q: 'The classic chessboard puzzle solved with backtracking is the ___-queens problem.', a: ['n', 'eight', '8'], e: 'Place queens row by row, pruning whenever two attack each other.' },
        { t: 'code', q: 'Write `subsets(items)` returning every subset as a list of lists (any order).', starter: 'def subsets(items):\n    pass\n', tests: 'r = subsets([1,2,3])\nassert len(r) == 8, "2^3 subsets"\nassert sorted(map(sorted, r)) == sorted(map(sorted, [[],[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]))\nassert subsets([]) == [[]]\nprint("Explored.")', sol: 'def subsets(items):\n    out = []\n    current = []\n    def go(i):\n        if i == len(items):\n            out.append(current[:])\n            return\n        go(i + 1)                 # skip items[i]\n        current.append(items[i])  # choose it\n        go(i + 1)\n        current.pop()             # undo\n    go(0)\n    return out', hint: 'At each index, branch twice: exclude the item, then include it and undo afterwards.', e: 'Every subset problem is a binary choice per element: 2ⁿ leaves in the search tree.' }
      ]
    },
    {
      id: 'al-graphs', title: 'BFS, DFS and shortest paths', icon: '🗺️', topics: ['BFS', 'DFS', 'Shortest path', 'Graph algorithms'], lab: 'graph',
      learn: [
        { h: 'BFS and DFS differ by one data structure', p: '<p>BFS uses a queue and visits in rings of increasing distance, so it finds the shortest path in an <b>unweighted</b> graph. DFS uses a stack (or recursion) and dives deep, which suits cycle detection, topological sort and connected components.</p>', code: 'from collections import deque\n\ndef bfs(graph, start):\n    seen, order, q = {start}, [], deque([start])\n    while q:\n        node = q.popleft()\n        order.append(node)\n        for nxt in graph[node]:\n            if nxt not in seen:\n                seen.add(nxt)\n                q.append(nxt)\n    return order' },
        { h: 'Weighted shortest paths', p: '<pre>Dijkstra      non-negative weights; greedy with a min-heap; O((V+E) log V)\nBellman-Ford  handles negative edges; detects negative cycles; O(V·E)\nA*            Dijkstra plus a heuristic estimate; used in maps and games\nFloyd-Warshall all pairs; O(V³)</pre><p>Dijkstra is Dijkstra because it always expands the closest unfinished node — a greedy choice that negative edges would invalidate.</p>' },
        { h: 'Other must-knows', p: '<p><b>Topological sort</b> orders a DAG so dependencies come first (build systems, course prerequisites). <b>Union-find</b> tracks connected components in near-constant time and powers Kruskal\'s minimum spanning tree.</p>' }
      ],
      q: [
        { t: 'mc', q: 'Which traversal finds the shortest path in an unweighted graph?', o: ['BFS', 'DFS', 'Either', 'Neither: you need Dijkstra'], a: 0, e: 'BFS reaches every node in order of edge count, so the first time you see a node is via a shortest path.' },
        { t: 'mc', q: 'The only structural difference between iterative BFS and DFS is:', o: ['A queue versus a stack', 'Recursion versus iteration', 'Visited tracking', 'Edge weights'], a: 0, e: 'Same loop, different removal order, completely different behaviour.' },
        { t: 'mc', q: 'Why does Dijkstra fail with negative edge weights?', o: ['A finalised node might later be reachable more cheaply', 'It cannot represent negative numbers', 'The heap overflows', 'It only works on trees'], a: 0, e: 'Its greedy invariant assumes distances never decrease after finalisation. Use Bellman-Ford instead.' },
        { t: 'match', q: 'Match each task to the right algorithm.', p: [['Fewest hops in a social graph', 'BFS'], ['Fastest driving route with distances', 'Dijkstra'], ['Order tasks by dependency', 'Topological sort'], ['Cheapest network connecting all sites', 'Minimum spanning tree']], e: 'Identifying the algorithm from the problem statement is the skill being tested.' },
        { t: 'code', q: 'Write `shortest_hops(graph, start, goal)` returning the number of edges on the shortest path, or -1 if unreachable. graph maps node → list of neighbours.', starter: 'from collections import deque\n\ndef shortest_hops(graph, start, goal):\n    pass\n', tests: 'g = {"A":["B","C"], "B":["D"], "C":["D"], "D":["E"], "E":[], "Z":[]}\nassert shortest_hops(g, "A", "E") == 3\nassert shortest_hops(g, "A", "A") == 0\nassert shortest_hops(g, "A", "Z") == -1\nprint("Traversed.")', sol: 'from collections import deque\n\ndef shortest_hops(graph, start, goal):\n    if start == goal:\n        return 0\n    seen, q = {start}, deque([(start, 0)])\n    while q:\n        node, d = q.popleft()\n        for nxt in graph.get(node, []):\n            if nxt == goal:\n                return d + 1\n            if nxt not in seen:\n                seen.add(nxt)\n                q.append((nxt, d + 1))\n    return -1', hint: 'Queue pairs of (node, distance). Mark nodes seen when you enqueue them, not when you dequeue.', e: 'Marking on enqueue prevents the same node being queued many times.' }
      ]
    }
  ]
});

CS.addStage({
  id: 's8', n: 8, title: 'Mathematics for computer science', short: 'CS math', track: 'core', icon: '➗', pos: [420, 140], prereq: ['s2'],
  blurb: 'Logic, sets, combinatorics, probability, statistics, linear algebra and the calculus that machine learning actually uses.',
  nodes: [
    {
      id: 'm-logic', title: 'Logic, boolean algebra and proofs', icon: '🔣', topics: ['Logic', 'Boolean algebra', 'Proofs', 'Discrete mathematics'],
      learn: [
        { h: 'Propositions and connectives', p: '<p>¬ not, ∧ and, ∨ or, → implies, ↔ if and only if. The one that trips people up: <code>p → q</code> is false only when p is true and q is false. "If it rains I take an umbrella" is not violated on a sunny day, whatever you carry.</p>' },
        { h: 'Equivalences you will actually use', p: '<pre>¬(p ∧ q) ≡ ¬p ∨ ¬q        De Morgan\n¬(p ∨ q) ≡ ¬p ∧ ¬q\np → q    ≡ ¬p ∨ q          implication as or\ncontrapositive: p → q ≡ ¬q → ¬p    (always valid)\nconverse:       q → p              (not equivalent!)</pre>' },
        { h: 'Proof techniques', p: '<ul><li><b>Direct</b> — assume p, derive q.</li><li><b>Contrapositive</b> — prove ¬q → ¬p instead; often much easier.</li><li><b>Contradiction</b> — assume the opposite and derive nonsense (√2 is irrational).</li><li><b>Induction</b> — prove the base case, then that each case implies the next. This is exactly how you prove a loop or a recursive function is correct.</li></ul>' }
      ],
      q: [
        { t: 'mc', q: 'When is `p → q` false?', o: ['Only when p is true and q is false', 'When both are false', 'When p is false', 'Whenever they differ'], a: 0, e: 'A false premise makes the implication vacuously true.' },
        { t: 'mc', q: 'The contrapositive of "if it is a square then it is a rectangle" is:', o: ['If it is not a rectangle then it is not a square', 'If it is a rectangle then it is a square', 'If it is not a square then it is not a rectangle', 'It is a square and a rectangle'], a: 0, e: 'The contrapositive is always logically equivalent; the converse is not.' },
        { t: 'fill', q: 'A proof that establishes a base case and then that each case implies the next is called proof by ___.', a: ['induction', 'mathematical induction'], e: 'The formal justification for recursion and loop invariants.' },
        { t: 'mc', q: 'Simplify `¬(a ∨ ¬b)`.', o: ['¬a ∧ b', '¬a ∨ b', 'a ∧ ¬b', 'a ∨ b'], a: 0, e: 'De Morgan distributes the negation and flips the connective: ¬a ∧ ¬¬b = ¬a ∧ b.' },
        { t: 'gen', g: 'gate' }
      ]
    },
    {
      id: 'm-sets', title: 'Sets, functions and relations', icon: '🎯', topics: ['Sets', 'Functions', 'Relations'],
      learn: [
        { h: 'Sets and operations', p: '<p>Unordered collections of distinct elements. Union ∪, intersection ∩, difference ∖, complement, and the power set (all subsets: 2ⁿ of them). |A ∪ B| = |A| + |B| − |A ∩ B| is inclusion-exclusion, used constantly in counting.</p>' },
        { h: 'Functions as mappings', p: '<p>A function assigns each input exactly one output. <b>Injective</b> (one-to-one): different inputs give different outputs. <b>Surjective</b> (onto): every possible output is produced. <b>Bijective</b>: both, so it can be inverted. A hash function is deliberately not injective — that is what a collision is.</p>' },
        { h: 'Relations', p: '<p>A relation is a set of ordered pairs. An <b>equivalence relation</b> is reflexive, symmetric and transitive, and partitions a set into classes (for example "has the same remainder mod 3"). A <b>partial order</b> is reflexive, antisymmetric and transitive — the structure of a DAG, and the reason topological sort exists.</p>' }
      ],
      q: [
        { t: 'mc', q: 'How many subsets does a set with 5 elements have?', o: ['32', '25', '10', '120'], a: 0, e: '2⁵: each element is independently in or out.' },
        { t: 'mc', q: '|A| = 10, |B| = 8, |A ∩ B| = 3. What is |A ∪ B|?', o: ['15', '18', '21', '11'], a: 0, e: '10 + 8 − 3: the shared elements are counted once.' },
        { t: 'mc', q: 'A hash function maps many keys to the same bucket. In function terms it is:', o: ['Not injective', 'Not a function', 'Bijective', 'Not surjective'], a: 0, e: 'Multiple inputs share an output, which is precisely a collision.' },
        { t: 'match', q: 'Match each property to its meaning.', p: [['Injective', 'Different inputs, different outputs'], ['Surjective', 'Every output value is reached'], ['Bijective', 'Invertible'], ['Equivalence relation', 'Partitions a set into classes']], e: 'These names recur in cryptography, type theory and database design.' },
        { t: 'tf', q: '"Has the same remainder when divided by 3" is an equivalence relation on the integers.', a: true, e: 'Reflexive, symmetric and transitive, and it partitions the integers into three classes.' }
      ]
    },
    {
      id: 'm-graph', title: 'Graph theory', icon: '🔗', topics: ['Graph theory'],
      learn: [
        { h: 'Formal basics', p: '<p>G = (V, E). The <b>degree</b> of a vertex is how many edges touch it, and the sum of all degrees is 2|E| (the handshake lemma). A <b>tree</b> on n vertices has exactly n−1 edges and is connected and acyclic; add any edge and you create exactly one cycle.</p>' },
        { h: 'Special structures', p: '<p><b>Bipartite</b>: vertices split into two sides with edges only across (job assignment, recommendation graphs; detectable by 2-colouring with BFS). <b>Eulerian path</b> visits every edge once (possible iff at most two vertices have odd degree). <b>Hamiltonian path</b> visits every vertex once — and is NP-complete.</p>' },
        { h: 'Why it is worth the abstraction', p: '<p>Once a problem is stated as a graph, a library of proven algorithms applies immediately: connectivity, matching, flow, colouring, spanning trees. Colouring a graph is the same problem as allocating CPU registers or scheduling exams without clashes.</p>' }
      ],
      lab: 'graph',
      q: [
        { t: 'mc', q: 'A tree with 12 vertices has how many edges?', o: ['11', '12', '13', '24'], a: 0, e: 'n − 1 edges: exactly enough to connect everything with no cycle.' },
        { t: 'fill', q: 'The sum of all vertex degrees in a graph equals ___ times the number of edges.', a: ['2', 'two'], e: 'Each edge contributes 1 to each of its two endpoints: the handshake lemma.' },
        { t: 'mc', q: 'Which problem is NP-complete?', o: ['Finding a Hamiltonian path', 'Finding an Eulerian path', 'Breadth-first search', 'Finding a minimum spanning tree'], a: 0, e: 'Visiting every edge once is easy to decide; visiting every vertex once is not.' },
        { t: 'mc', q: 'Scheduling exams so no student has two at once is equivalent to:', o: ['Graph colouring', 'Shortest path', 'Topological sort', 'Binary search'], a: 0, e: 'Vertices are exams, edges join exams sharing a student, colours are time slots.' },
        { t: 'tf', q: 'A graph is bipartite if and only if it contains no odd-length cycle.', a: true, e: 'Which is why 2-colouring with BFS detects bipartiteness in linear time.' }
      ]
    },
    {
      id: 'm-comb', title: 'Combinatorics and probability', icon: '🎲', topics: ['Combinatorics', 'Probability'],
      learn: [
        { h: 'Counting rules', p: '<pre>product rule   independent choices multiply: 3 × 4 = 12\npermutations   order matters:  nPr = n!/(n−r)!\ncombinations   order does not: nCr = n!/(r!(n−r)!)\nwith repetition n^r  (for example passwords)</pre><p>Asking "does order matter?" and "can things repeat?" picks the formula every time.</p>' },
        { h: 'Probability basics', p: '<p>P(A) between 0 and 1. Independent events: P(A ∧ B) = P(A)·P(B). Mutually exclusive: P(A ∨ B) = P(A) + P(B). Complement: P(not A) = 1 − P(A), often much easier — "at least one" problems are usually solved as 1 − P(none).</p>' },
        { h: 'Conditional probability and Bayes', p: '<p>P(A|B) = P(A ∧ B) / P(B), and Bayes: P(A|B) = P(B|A)·P(A) / P(B). The base-rate example matters in practice: a 99% accurate test for a disease affecting 1 in 10,000 still gives mostly false positives, which is exactly the trap in evaluating a classifier on imbalanced data.</p>' }
      ],
      q: [
        { t: 'mc', q: 'How many 4-character passwords use lowercase letters with repetition allowed?', o: ['26⁴', '26 × 25 × 24 × 23', '4²⁶', '26 × 4'], a: 0, e: 'Independent choices with repetition: 26 options, four times.' },
        { t: 'mc', q: 'How many ways can you choose 3 people from 10 when order does not matter?', o: ['120', '720', '1000', '30'], a: 0, e: '10C3 = 10!/(3!·7!) = 120.' },
        { t: 'mc', q: 'You roll two dice. P(at least one six) is easiest computed as:', o: ['1 − (5/6)²', '2 × 1/6', '1/6 × 1/6', '1/3'], a: 0, e: 'Complement: 1 − P(no six at all) = 1 − 25/36 = 11/36.' },
        { t: 'mc', q: 'A test is 99% accurate for a disease affecting 1 in 10,000. You test positive. Roughly what is the chance you have it?', o: ['About 1%', 'About 99%', 'About 50%', 'About 90%'], a: 0, e: 'Base rates dominate: about 100 false positives per true positive. This is why precision matters more than accuracy on rare classes.' },
        { t: 'fill', q: 'The rule P(A|B) = P(B|A)·P(A) / P(B) is known as ___ theorem.', a: ['bayes', "bayes'", 'bayes theorem'], e: 'It underpins spam filters, medical testing and Bayesian inference.' }
      ]
    },
    {
      id: 'm-stats', title: 'Statistics', icon: '📉', topics: ['Statistics'],
      learn: [
        { h: 'Describing data', p: '<p><b>Mean</b> is sensitive to outliers; <b>median</b> is not — which is why salary and latency reports use medians and percentiles. <b>Standard deviation</b> measures spread. Always look at the distribution before the summary: very different data can share a mean.</p>' },
        { h: 'Distributions and the normal curve', p: '<p>For a normal distribution, about 68% of values lie within 1 standard deviation, 95% within 2 and 99.7% within 3. Plenty of real data is not normal: latencies and incomes are right-skewed, which is why p95 and p99 are reported instead of averages.</p>' },
        { h: 'Sampling and significance, briefly', p: '<p>A sample estimates a population; bias in how you sample cannot be fixed by having more data. A p-value is the probability of seeing data at least this extreme if the null hypothesis were true — not the probability that your hypothesis is right. Correlation does not imply causation; only a controlled experiment supports that claim.</p>' }
      ],
      q: [
        { t: 'mc', q: 'Nine people earn about 30k and one earns 5 million. Which summary describes a typical salary better?', o: ['The median', 'The mean', 'The maximum', 'The standard deviation'], a: 0, e: 'One outlier drags the mean far from anything a real person earns.' },
        { t: 'mc', q: 'In a normal distribution, roughly what share of values lies within two standard deviations of the mean?', o: ['95%', '68%', '99.7%', '50%'], a: 0, e: 'The 68–95–99.7 rule.' },
        { t: 'mc', q: 'Why do engineers report p95 or p99 latency rather than the average?', o: ['Latency is skewed, and the slow tail is what users notice', 'Percentiles are easier to compute', 'Averages are undefined for latency', 'It is a regulatory requirement'], a: 0, e: 'An average hides the requests that ruin the experience.' },
        { t: 'tf', q: 'A p-value of 0.03 means there is a 3% chance the null hypothesis is true.', a: false, e: 'It is the probability of data this extreme assuming the null is true. That is a different statement.' },
        { t: 'short', q: 'Ice cream sales and drownings rise together each summer. What is the statistical lesson?', a: [['correlation', 'correlat'], ['caus', 'confound', 'third', 'lurking', 'temperature', 'weather', 'summer']], model: 'Correlation does not imply causation; a confounding variable, hot weather, drives both.', e: 'Look for confounders before claiming a cause.' }
      ]
    },
    {
      id: 'm-linalg', title: 'Linear algebra', icon: '🔢', topics: ['Linear algebra'],
      learn: [
        { h: 'Vectors and matrices are the language of ML', p: '<p>A vector is a list of numbers, a point or a direction. A matrix is a grid, and multiplying by one is a <b>linear transformation</b>: rotate, scale, project. An image is a matrix; an embedding is a vector; a neural network layer is a matrix multiply plus a bias.</p>' },
        { h: 'Operations that matter', p: '<pre>dot product   a·b = Σ aᵢbᵢ — similarity; zero means orthogonal\nnorm ‖a‖      length; used for distance and normalisation\nmatmul        (m×n)(n×p) = (m×p); inner dimensions must match\ntranspose     flip rows and columns\ninverse       undo a transformation, when it exists</pre><p>Cosine similarity — the dot product of normalised vectors — is what vector databases use to find "similar" text.</p>' },
        { h: 'Eigenvectors, in one line', p: '<p>An eigenvector of a matrix is a direction the transformation only stretches, by its eigenvalue. That single idea powers PCA (dimensionality reduction), PageRank and stability analysis.</p>' }
      ],
      q: [
        { t: 'mc', q: 'You multiply a (3×4) matrix by a (4×2) matrix. What is the result shape?', o: ['3×2', '4×4', '2×3', 'Undefined'], a: 0, e: 'Inner dimensions (4 and 4) must match and cancel; outer dimensions remain.' },
        { t: 'mc', q: 'The dot product of two non-zero vectors is 0. This means they are:', o: ['Orthogonal (perpendicular)', 'Identical', 'Parallel', 'Both zero length'], a: 0, e: 'Cosine of 90° is 0, so no similarity in that sense.' },
        { t: 'fill', q: 'Comparing two embeddings by the angle between them uses ___ similarity.', a: ['cosine'], e: 'Length is ignored, direction is what carries meaning.' },
        { t: 'mc', q: 'Why is linear algebra central to deep learning?', o: ['A layer is a matrix multiplication plus a bias, run on batches of vectors', 'Because neural networks are linear functions', 'It is used only for plotting', 'It replaces calculus during training'], a: 0, e: 'The non-linearity comes from activation functions, but the heavy computation is matrix multiplication, which is what GPUs accelerate.' },
        { t: 'mc', q: 'An eigenvector of a matrix is a vector that the transformation:', o: ['Only scales, without changing direction', 'Rotates by 90 degrees', 'Sets to zero', 'Converts to a matrix'], a: 0, e: 'The scale factor is the eigenvalue; PCA finds the directions with the largest ones.' }
      ]
    },
    {
      id: 'm-calc', title: 'Calculus for machine learning', icon: '📈', topics: ['Calculus fundamentals', 'Mathematical foundations of ML'],
      learn: [
        { h: 'Derivatives are slopes', p: '<p>The derivative of f at x is the instantaneous rate of change. In ML it answers: if I nudge this weight, does the loss go up or down, and how fast? That is the entire basis of training.</p><p>Rules you need: power rule, chain rule (for composed functions — the mathematical name for backpropagation), and partial derivatives (one variable at a time, holding the rest fixed).</p>' },
        { h: 'Gradients and descent', p: '<p>The <b>gradient</b> ∇f is the vector of partial derivatives: the direction of steepest increase. Gradient descent steps the opposite way:</p><pre>w ← w − learning_rate × ∂loss/∂w</pre><p>Too small a learning rate is slow; too large overshoots and diverges. You can watch exactly this in the neural network lab.</p>', lab: 'neural' },
        { h: 'Why the chain rule is backpropagation', p: '<p>A network is functions composed inside functions. The chain rule says the derivative of the whole is the product of the derivatives of the parts — so you compute the loss at the end and multiply derivatives backwards through the layers. That is all backpropagation is: the chain rule applied efficiently, reusing intermediate results.</p>' }
      ],
      lab: 'neural',
      q: [
        { t: 'mc', q: 'What does the gradient of a loss function tell you?', o: ['The direction of steepest increase, so step the opposite way', 'The minimum value of the loss', 'How many parameters exist', 'The accuracy of the model'], a: 0, e: 'Descend by subtracting a fraction of the gradient.' },
        { t: 'mc', q: 'Backpropagation is essentially:', o: ['The chain rule applied backwards through composed functions', 'A sorting algorithm for weights', 'Random search over parameters', 'Matrix inversion'], a: 0, e: 'Compute local derivatives, multiply along the path, reuse shared results.' },
        { t: 'mc', q: 'Training loss oscillates wildly and never settles. The most likely cause is:', o: ['The learning rate is too large', 'Too little data', 'The model is too small', 'The loss function is wrong'], a: 0, e: 'Overshooting the minimum on each step. Lower the rate or use a schedule.' },
        { t: 'fill', q: 'The derivative of f with respect to one variable while others are held fixed is called a ___ derivative.', a: ['partial'], e: 'Collect all the partials and you have the gradient.' },
        { t: 'mc', q: 'For f(w) = w², what is ∂f/∂w at w = 3?', o: ['6', '9', '3', '1'], a: 0, e: 'The power rule gives 2w, so 6 at w = 3: a positive slope, so descent moves w downward.' }
      ]
    }
  ]
});
