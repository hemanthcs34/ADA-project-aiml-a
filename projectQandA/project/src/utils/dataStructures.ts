// Heap implementation for sorting questions by score
export class MaxHeap<T> {
  private heap: T[] = [];
  private compare: (a: T, b: T) => number;

  constructor(compareFunction: (a: T, b: T) => number) {
    this.compare = compareFunction;
  }

  private parent(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  private leftChild(index: number): number {
    return 2 * index + 1;
  }

  private rightChild(index: number): number {
    return 2 * index + 2;
  }

  private swap(i: number, j: number): void {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  private heapifyUp(index: number): void {
    while (index > 0) {
      const parentIndex = this.parent(index);
      if (this.compare(this.heap[index], this.heap[parentIndex]) <= 0) break;
      this.swap(index, parentIndex);
      index = parentIndex;
    }
  }

  private heapifyDown(index: number): void {
    while (this.leftChild(index) < this.heap.length) {
      let maxIndex = this.leftChild(index);
      if (
        this.rightChild(index) < this.heap.length &&
        this.compare(this.heap[this.rightChild(index)], this.heap[maxIndex]) > 0
      ) {
        maxIndex = this.rightChild(index);
      }
      if (this.compare(this.heap[index], this.heap[maxIndex]) >= 0) break;
      this.swap(index, maxIndex);
      index = maxIndex;
    }
  }

  insert(item: T): void {
    this.heap.push(item);
    this.heapifyUp(this.heap.length - 1);
  }

  extractMax(): T | null {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop()!;

    const max = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.heapifyDown(0);
    return max;
  }

  peek(): T | null {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  size(): number {
    return this.heap.length;
  }

  toArray(): T[] {
    return [...this.heap];
  }
}

// HashMap for tag-based filtering
export class HashMap<K, V> {
  private buckets: Array<Array<[K, V]>>;
  private size: number;

  constructor(initialSize: number = 16) {
    this.buckets = new Array(initialSize).fill(null).map(() => []);
    this.size = 0;
  }

  private hash(key: K): number {
    const str = String(key);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) % this.buckets.length;
  }

  set(key: K, value: V): void {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket[i][1] = value;
        return;
      }
    }
    
    bucket.push([key, value]);
    this.size++;
  }

  get(key: K): V | undefined {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    
    for (const [k, v] of bucket) {
      if (k === key) return v;
    }
    return undefined;
  }

  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  delete(key: K): boolean {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket.splice(i, 1);
        this.size--;
        return true;
      }
    }
    return false;
  }

  keys(): K[] {
    const keys: K[] = [];
    for (const bucket of this.buckets) {
      for (const [key] of bucket) {
        keys.push(key);
      }
    }
    return keys;
  }

  values(): V[] {
    const values: V[] = [];
    for (const bucket of this.buckets) {
      for (const [, value] of bucket) {
        values.push(value);
      }
    }
    return values;
  }
}

// Trie for auto-suggestion
export class TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;
  suggestions: string[];

  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
    this.suggestions = [];
  }
}

export class Trie {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  insert(word: string): void {
    let node = this.root;
    for (const char of word.toLowerCase()) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
      if (node.suggestions.length < 10) {
        node.suggestions.push(word);
      }
    }
    node.isEndOfWord = true;
  }

  search(word: string): boolean {
    let node = this.root;
    for (const char of word.toLowerCase()) {
      if (!node.children.has(char)) {
        return false;
      }
      node = node.children.get(char)!;
    }
    return node.isEndOfWord;
  }

  getSuggestions(prefix: string): string[] {
    let node = this.root;
    for (const char of prefix.toLowerCase()) {
      if (!node.children.has(char)) {
        return [];
      }
      node = node.children.get(char)!;
    }
    return node.suggestions;
  }
}