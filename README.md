# Adzzse Portfolio (React)

A modern React portfolio application featuring Conway's Game of Life and other interactive demos.

Deploy: https://adzzse.github.io/Adzzse-portfolio/

## Features

- **React 18** with modern hooks and functional components
- **React Router** for client-side navigation
- **Conway's Game of Life** - Interactive cellular automaton with:
  - Start/Pause, Step, Clear, Random seed
  - Speed (FPS) control
  - Adjustable cell size
  - Edge wrapping toggle
  - Optional grid overlay
  - Click or drag to paint; Right-click/Alt-drag to erase
  - Responsive canvas, touch support
- **Pathfinding** - Interactive grid pathfinding with:
  - Dijkstra, A*, Greedy Best-First
  - Start/Pause, Step, Reset, Clear Walls
  - Speed (FPS) and Cell Size controls
  - Shift-click to set Start, Ctrl-click to set End, drag to draw walls
  - Optional distances and direction arrows (both OFF by default)
  - Smooth path reveal, responsive canvas
- **Responsive design** with mobile-first approach
- **Vite** for fast development and building
- **GitHub Pages** ready

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production
```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages

### Option 1: Automatic Deployment (Recommended)
1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Update the `homepage` field in `package.json` with your actual GitHub Pages URL:
   ```json
   "homepage": "https://yourusername.github.io/Adzzse-portfolio"
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

### Option 2: Manual Deployment
1. Build the project:
   ```bash
   npm run build
   ```

2. In your GitHub repository settings:
   - Go to Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / root (if using gh-pages)
   - Or upload the `dist` folder contents to your repository

3. Your site will be available at the GitHub Pages URL

## Project Structure

```
src/
├── components/
│   ├── Header.jsx          # Navigation header
│   ├── Home.jsx            # Home page component
│   ├── GameOfLife.jsx      # Conway's Game of Life
│   ├── Pathfinding.jsx     # Pathfinding visualization
│   ├── CellularAutomaton.jsx # Reusable automaton base
│   ├── LangtonsAnt.jsx     # Langton's Ant demo
│   ├── Highlife.jsx        # Highlife automaton
│   └── Rule30.jsx          # 1D cellular automaton
├── App.jsx                 # Main app with routing
├── main.jsx                # React entry point
└── index.css               # Global styles
```

## Technologies Used

- **React 18** - UI library
- **React Router DOM** - Client-side routing
- **Vite** - Build tool and dev server
- **Canvas API** - Game rendering
- **CSS Custom Properties** - Theming system
- **GitHub Pages** - Hosting

## Game of Life Controls

- **Start/Pause**: Run or pause the simulation
- **Step**: Advance one generation while paused
- **Clear**: Empty the board
- **Random**: Seed with ~30% live cells
- **Speed**: Adjust simulation speed (1-60 FPS)
- **Cell Size**: Change grid resolution (5-30px)
- **Wrap Edges**: Enable/disable edge wrapping
- **Show Grid**: Toggle grid overlay

## Pathfinding Controls

- **Start/Pause**: Run or pause the search
- **Step**: Advance one expansion step while paused
- **Reset**: Clear search state only
- **Clear Walls**: Remove all obstacles
- **Algorithm**: Choose Dijkstra, A*, or Greedy Best-First
- **Speed**: Adjust search speed (1-240 FPS)
- **Cell Size**: Change grid resolution (8-32px)
- **Toggles**:
  - Distances (g-scores) text: OFF by default
  - Direction arrows along revealed path: OFF by default
- **Tips**: Shift-click sets Start, Ctrl-click sets End. Drag to draw walls. Drag can also move Start/End.

### Pathfinding Performance

- Uses a binary min-heap for the open set (O(log n) push/pop)
- Precomputes path position/next maps to avoid per-frame allocations

## Development

The app uses modern React patterns:
- Functional components with hooks
- `useCallback` for performance optimization
- `useRef` for canvas and animation management
- `useEffect` for side effects and cleanup
- State management with `useState`

## License

MIT
