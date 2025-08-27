// Simple router + lazy Game of Life initialization

(function () {
  const routes = {
    '/home': document.getElementById('route-home'),
    '/game-of-life': document.getElementById('route-game-of-life'),
  };

  let gameInitialized = false;

  function showRoute(path) {
    Object.values(routes).forEach((el) => el && el.classList.add('hidden'));
    const el = routes[path] || routes['/home'];
    if (el) el.classList.remove('hidden');
    if (path === '/game-of-life' && !gameInitialized) {
      initGameOfLife();
      gameInitialized = true;
    }
  }

  function currentPath() {
    const hash = window.location.hash || '#/home';
    const path = hash.replace('#', '');
    return path;
  }

  window.addEventListener('hashchange', () => showRoute(currentPath()));
  document.addEventListener('DOMContentLoaded', () => showRoute(currentPath()));

  // --- Game of Life ---
  function initGameOfLife() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const playPauseBtn = document.getElementById('playPauseBtn');
    const stepBtn = document.getElementById('stepBtn');
    const clearBtn = document.getElementById('clearBtn');
    const randomBtn = document.getElementById('randomBtn');
    const speedRange = document.getElementById('speedRange');
    const speedLabel = document.getElementById('speedLabel');
    const cellSizeRange = document.getElementById('cellSizeRange');
    const cellSizeLabel = document.getElementById('cellSizeLabel');
    const wrapToggle = document.getElementById('wrapToggle');
    const gridToggle = document.getElementById('gridToggle');

    let isPlaying = false;
    let cellSize = parseInt(cellSizeRange.value, 10);
    let showGrid = gridToggle.checked;
    let wrapEdges = wrapToggle.checked;
    let fps = parseInt(speedRange.value, 10);
    let lastStepAt = 0;

    let cols = 0;
    let rows = 0;
    let grid = new Uint8Array(0);
    let next = new Uint8Array(0);

    function resizeCanvasToDisplaySize() {
      const dpr = window.devicePixelRatio || 1;
      const cssWidth = canvas.clientWidth;
      const cssHeight = canvas.clientHeight;
      const displayWidth = Math.floor(cssWidth * dpr);
      const displayHeight = Math.floor(cssHeight * dpr);
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        recomputeGridSize();
      }
    }

    function recomputeGridSize() {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const newCols = Math.max(1, Math.floor(width / cellSize));
      const newRows = Math.max(1, Math.floor(height / cellSize));
      if (newCols === cols && newRows === rows) return;

      const oldCols = cols;
      const oldRows = rows;
      const oldGrid = grid;

      cols = newCols;
      rows = newRows;
      grid = new Uint8Array(cols * rows);
      next = new Uint8Array(cols * rows);

      if (oldCols > 0 && oldRows > 0) {
        const copyCols = Math.min(oldCols, cols);
        const copyRows = Math.min(oldRows, rows);
        const colOffset = Math.floor((cols - copyCols) / 2);
        const rowOffset = Math.floor((rows - copyRows) / 2);
        for (let y = 0; y < copyRows; y++) {
          for (let x = 0; x < copyCols; x++) {
            const oldIdx = y * oldCols + x;
            const newIdx = (y + rowOffset) * cols + (x + colOffset);
            grid[newIdx] = oldGrid[oldIdx];
          }
        }
      }
      draw();
    }

    function index(x, y) { return y * cols + x; }

    function countNeighbors(x, y) {
      let count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          let nx = x + dx;
          let ny = y + dy;
          if (wrapEdges) {
            if (nx < 0) nx = cols - 1; else if (nx >= cols) nx = 0;
            if (ny < 0) ny = rows - 1; else if (ny >= rows) ny = 0;
            count += grid[index(nx, ny)];
          } else {
            if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
            count += grid[index(nx, ny)];
          }
        }
      }
      return count;
    }

    function step() {
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = index(x, y);
          const alive = grid[i] === 1;
          const neighbors = countNeighbors(x, y);
          let newState = 0;
          if (alive) newState = neighbors === 2 || neighbors === 3 ? 1 : 0;
          else newState = neighbors === 3 ? 1 : 0;
          next[i] = newState;
        }
      }
      const tmp = grid; grid = next; next = tmp;
    }

    function draw() {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#0f1738';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#6ee7ff';
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          if (grid[index(x, y)] === 1) {
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
          }
        }
      }
      if (showGrid && cellSize >= 8) {
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = 0; x <= cols; x++) {
          const gx = x * cellSize + 0.5; ctx.moveTo(gx, 0); ctx.lineTo(gx, rows * cellSize);
        }
        for (let y = 0; y <= rows; y++) {
          const gy = y * cellSize + 0.5; ctx.moveTo(0, gy); ctx.lineTo(cols * cellSize, gy);
        }
        ctx.stroke();
      }
    }

    function animate(timestamp) {
      if (!isPlaying) return;
      const msPerFrame = 1000 / fps;
      if (timestamp - lastStepAt >= msPerFrame) {
        step();
        draw();
        lastStepAt = timestamp;
      }
      requestAnimationFrame(animate);
    }

    function setPlaying(nextPlaying) {
      isPlaying = nextPlaying;
      playPauseBtn.textContent = isPlaying ? 'Pause' : 'Start';
      if (isPlaying) requestAnimationFrame(animate);
    }

    playPauseBtn.addEventListener('click', () => setPlaying(!isPlaying));
    stepBtn.addEventListener('click', () => { if (!isPlaying) { step(); draw(); } });
    clearBtn.addEventListener('click', () => { grid.fill(0); draw(); });
    randomBtn.addEventListener('click', () => { for (let i = 0; i < grid.length; i++) { grid[i] = Math.random() < 0.3 ? 1 : 0; } draw(); });
    speedRange.addEventListener('input', () => { fps = parseInt(speedRange.value, 10); speedLabel.textContent = `${fps} fps`; });
    cellSizeRange.addEventListener('input', () => { cellSize = parseInt(cellSizeRange.value, 10); cellSizeLabel.textContent = `${cellSize} px`; recomputeGridSize(); });
    wrapToggle.addEventListener('change', () => { wrapEdges = wrapToggle.checked; });
    gridToggle.addEventListener('change', () => { showGrid = gridToggle.checked; draw(); });

    let isPointerDown = false;
    let paintValue = 1;
    function pointerToCell(evt) {
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor(((evt.clientX - rect.left) / rect.width) * canvas.clientWidth / cellSize);
      const y = Math.floor(((evt.clientY - rect.top) / rect.height) * canvas.clientHeight / cellSize);
      if (x < 0 || x >= cols || y < 0 || y >= rows) return null;
      return { x, y };
    }
    function setCell(x, y, value) { grid[index(x, y)] = value; }
    function handlePointerDown(evt) {
      evt.preventDefault(); isPointerDown = true; paintValue = (evt.button === 2 || evt.altKey) ? 0 : 1;
      const cell = pointerToCell(evt); if (cell) { setCell(cell.x, cell.y, paintValue); draw(); }
    }
    function handlePointerMove(evt) {
      if (!isPointerDown) return; const cell = pointerToCell(evt); if (cell) { setCell(cell.x, cell.y, paintValue); draw(); }
    }
    function handlePointerUp() { isPointerDown = false; }
    canvas.addEventListener('mousedown', handlePointerDown);
    canvas.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    canvas.addEventListener('touchstart', (e) => { if (e.touches.length > 0) { handlePointerDown(e.touches[0]); } }, { passive: false });
    canvas.addEventListener('touchmove', (e) => { if (e.touches.length > 0) { handlePointerMove(e.touches[0]); } }, { passive: false });
    window.addEventListener('touchend', handlePointerUp);

    const ro = new ResizeObserver(() => { resizeCanvasToDisplaySize(); draw(); });
    ro.observe(canvas);
    window.addEventListener('resize', () => { resizeCanvasToDisplaySize(); draw(); });

    resizeCanvasToDisplaySize();
    recomputeGridSize();
    draw();
  }
})();


