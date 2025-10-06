// Binary min-heap for objects with numeric key `f` (or custom selector)

export class MinHeap {
  constructor(keySelector = (n) => n.f) {
    this.items = []
    this.keySelector = keySelector
  }

  clear() {
    this.items.length = 0
  }

  get size() {
    return this.items.length
  }

  push(node) {
    this.items.push(node)
    this.#siftUp(this.items.length - 1)
  }

  pop() {
    const heap = this.items
    if (heap.length === 0) return undefined
    const top = heap[0]
    const last = heap.pop()
    if (heap.length > 0 && last !== undefined) {
      heap[0] = last
      this.#siftDown(0)
    }
    return top
  }

  #siftUp(i) {
    const heap = this.items
    const getKey = this.keySelector
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2)
      if (getKey(heap[parent]) <= getKey(heap[i])) break
      const tmp = heap[parent]
      heap[parent] = heap[i]
      heap[i] = tmp
      i = parent
    }
  }

  #siftDown(i) {
    const heap = this.items
    const getKey = this.keySelector
    const n = heap.length
    while (true) {
      const l = i * 2 + 1
      const r = l + 1
      let smallest = i
      if (l < n && getKey(heap[l]) < getKey(heap[smallest])) smallest = l
      if (r < n && getKey(heap[r]) < getKey(heap[smallest])) smallest = r
      if (smallest === i) break
      const tmp = heap[i]
      heap[i] = heap[smallest]
      heap[smallest] = tmp
      i = smallest
    }
  }
}


