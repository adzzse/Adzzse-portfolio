# Conway's Game of Life (Static Web)

An interactive, mobile-friendly implementation of Conway's Game of Life designed to run on GitHub Pages.

## Features
- Start/Pause, Step, Clear, Random seed
- Speed (FPS) control
- Adjustable cell size
- Edge wrapping toggle
- Optional grid overlay
- Click or drag to paint; Right-click/Alt-drag to erase
- Responsive canvas, touch support

## Run locally
Just open `index.html` in your browser. No build step required.

## Deploy to GitHub Pages
1. Create a new repository and add these files at the root:
   - `index.html`
   - `style.css`
   - `script.js`
   - `README.md`
2. Commit and push to `main`.
3. In your repository settings:
   - Go to Pages
   - Source: Deploy from a branch
   - Branch: `main` / root
4. Wait for the deployment to finish. Your site will be available at the Pages URL.

## How to use
- Click Start to run. Step advances one generation while paused.
- Drag on the board to toggle cells. Right-click or hold Alt to erase while dragging.
- Use Random to seed with ~30% live cells.
- Resize the window or adjust cell size to change the grid resolution.

## License
MIT
