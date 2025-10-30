// Shared grid utilities for canvas-based grid apps (Cellular Automata, Pathfinding, etc.)

export function createIndex(cols: number) {
  return (x: number, y: number) => y * cols + x
}

export function pointerToCellFromEvent(
  evt: MouseEvent | Touch,
  canvas: HTMLCanvasElement | null,
  cellSize: number,
  cols: number,
  rows: number
): { x: number; y: number } | null {
  if (!canvas) return null
  const rect = canvas.getBoundingClientRect()
  const clientX = (evt as Touch).clientX ?? (evt as MouseEvent).clientX
  const clientY = (evt as Touch).clientY ?? (evt as MouseEvent).clientY
  const x = Math.floor(((clientX - rect.left) / rect.width) * canvas.clientWidth / cellSize)
  const y = Math.floor(((clientY - rect.top) / rect.height) * canvas.clientHeight / cellSize)
  if (x < 0 || y < 0 || x >= cols || y >= rows) return null
  return { x, y }
}

export function resizeCanvasToDpr(
  canvas: HTMLCanvasElement | null,
  ctxRef: React.MutableRefObject<CanvasRenderingContext2D | null>,
  onResize?: () => void
) {
  if (!canvas) return
  const dpr = window.devicePixelRatio || 1
  const cssWidth = canvas.clientWidth
  const cssHeight = canvas.clientHeight
  const displayWidth = Math.floor(cssWidth * dpr)
  const displayHeight = Math.floor(cssHeight * dpr)
  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    canvas.width = displayWidth
    canvas.height = displayHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctxRef.current = ctx
    if (onResize) onResize()
  }
}

export function computeGridSize(canvas: HTMLCanvasElement, cellSize: number) {
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  const cols = Math.max(1, Math.floor(width / cellSize))
  const rows = Math.max(1, Math.floor(height / cellSize))
  return { cols, rows }
}

export function drawGridLines(
  ctx: CanvasRenderingContext2D | null,
  cols: number,
  rows: number,
  cellSize: number
) {
  if (!ctx) return
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'
  ctx.lineWidth = 1
  ctx.beginPath()
  for (let x = 0; x <= cols; x++) {
    const gx = x * cellSize + 0.5
    ctx.moveTo(gx, 0)
    ctx.lineTo(gx, rows * cellSize)
  }
  for (let y = 0; y <= rows; y++) {
    const gy = y * cellSize + 0.5
    ctx.moveTo(0, gy)
    ctx.lineTo(cols * cellSize, gy)
  }
  ctx.stroke()
}

// Grid neighborhood helpers
export function get4Neighbors(x: number, y: number, cols: number, rows: number) {
  const out: Array<{ x: number; y: number }> = []
  if (x > 0) out.push({ x: x - 1, y })
  if (x < cols - 1) out.push({ x: x + 1, y })
  if (y > 0) out.push({ x, y: y - 1 })
  if (y < rows - 1) out.push({ x, y: y + 1 })
  return out
}

// Drawing helpers
export function drawArrow(
  ctx: CanvasRenderingContext2D,
  fromCx: number,
  fromCy: number,
  toCx: number,
  toCy: number,
  cellSize: number,
  color: string = 'rgba(255,255,255,0.65)'
) {
  const angle = Math.atan2(toCy - fromCy, toCx - fromCx)
  const shaftLen = Math.max(3, cellSize * 0.35)
  const headLen = Math.max(2, cellSize * 0.2)
  const endX = fromCx + Math.cos(angle) * shaftLen
  const endY = fromCy + Math.sin(angle) * shaftLen
  const leftAngle = angle + 2.5
  const rightAngle = angle - 2.5
  const leftX = endX + Math.cos(leftAngle) * headLen
  const leftY = endY + Math.sin(leftAngle) * headLen
  const rightX = endX + Math.cos(rightAngle) * headLen
  const rightY = endY + Math.sin(rightAngle) * headLen
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = Math.max(1, Math.min(2, cellSize * 0.08))
  ctx.beginPath()
  ctx.moveTo(fromCx, fromCy)
  ctx.lineTo(endX, endY)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(endX, endY)
  ctx.lineTo(leftX, leftY)
  ctx.moveTo(endX, endY)
  ctx.lineTo(rightX, rightY)
  ctx.stroke()
  ctx.restore()
}

export function drawCenteredText(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  cellSize: number,
  color: string = 'rgba(255,255,255,0.75)'
) {
  ctx.save()
  ctx.fillStyle = color
  ctx.font = `${Math.max(10, Math.floor(cellSize * 0.5))}px Inter, system-ui, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, cx, cy)
  ctx.restore()
}

export function computeFadeAlpha(
  startAtMs: number,
  nowMs: number,
  durationMs: number,
  minAlpha: number = 0.2,
  maxAlpha: number = 1.0
) {
  if (!startAtMs || durationMs <= 0) return maxAlpha
  const dt = nowMs - startAtMs
  if (dt <= 0) return minAlpha
  if (dt >= durationMs) return maxAlpha
  const t = dt / durationMs
  return minAlpha + (maxAlpha - minAlpha) * t
}