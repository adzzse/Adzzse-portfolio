# Pathfinding Visualizer

An interactive pathfinding algorithm visualizer built with React and TypeScript, featuring multiple pathfinding algorithms, maze generation, and smooth animations.

## Features

### Pathfinding Algorithms

- **Dijkstra's Algorithm**: Guaranteed shortest path with support for weighted nodes
- **A\* Search**: Optimized pathfinding using Manhattan distance heuristic
- **Breadth-First Search (BFS)**: Guaranteed shortest path for unweighted graphs
- **Depth-First Search (DFS)**: Explores deeply before backtracking

### Maze Generation

- **Recursive Division**: Creates complex mazes through recursive spatial division
- **Random Maze**: Generates random wall patterns with configurable density

### Interactive Features

- **Drag-and-Drop**: Move start (green) and finish (red) nodes by dragging
- **Wall Drawing**: Click and drag to create walls
- **Weighted Nodes**: Hold Shift while clicking to add weighted nodes (for Dijkstra and A\*)
- **Animation Speed Control**: Adjust visualization speed (Slow, Medium, Fast)
- **Clear Functions**: Separate buttons to clear just the path or the entire board

## Getting Started

### Installation

The visualizer is already integrated into the portfolio. To run it:

```bash
npm run dev
```

Then navigate to `http://localhost:5173/pathfinding`

### Running Tests

```bash
npm test
```

To run tests with coverage:

```bash
npm run coverage
```

## Usage

1. **Select an Algorithm**: Choose from Dijkstra, A\*, BFS, or DFS using the dropdown
2. **Create Obstacles**:
   - Click and drag to draw walls
   - Hold Shift and click to add weighted nodes
3. **Position Start/Finish**: Drag the green (start) and red (finish) nodes
4. **Generate Maze** (Optional): Click "Recursive Division" or "Random Maze"
5. **Visualize**: Click the "Visualize!" button to see the algorithm in action
6. **Adjust Speed**: Change the speed setting before running visualization

## How It Works

### Algorithms

#### Dijkstra's Algorithm

- **Weighted**: Yes
- **Guarantees Shortest Path**: Yes
- Uses a min-heap priority queue to explore nodes with lowest distance first

#### A\* Search

- **Weighted**: Yes
- **Guarantees Shortest Path**: Yes (with admissible heuristic)
- Optimizes search using Manhattan distance heuristic to guide towards the goal

#### Breadth-First Search (BFS)

- **Weighted**: No
- **Guarantees Shortest Path**: Yes (for unweighted graphs)
- Explores all neighbors level by level using a queue

#### Depth-First Search (DFS)

- **Weighted**: No
- **Guarantees Shortest Path**: No
- Explores as deeply as possible before backtracking using a stack

### Animation System

The visualizer uses React state and setTimeout-based animations to show:

1. **Visited Nodes** (blue): Nodes explored during the search
2. **Shortest Path** (yellow): The optimal path from start to finish

## Technical Implementation

### Tech Stack

- **React 18** with functional components and hooks
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Vitest** for unit testing
- **Vite** as the build tool

### Project Structure

```
src/features/pathfinding/
├── algorithms/
│   ├── dijkstra.ts
│   ├── astar.ts
│   ├── bfs.ts
│   ├── dfs.ts
│   ├── utils.ts
│   └── __tests__/
│       └── dijkstra.test.ts
├── components/
│   ├── Grid.tsx
│   ├── Node.tsx
│   ├── ControlPanel.tsx
│   └── Legend.tsx
├── hooks/
│   ├── useGrid.ts
│   └── useVisualization.ts
├── mazes/
│   ├── recursiveDivision.ts
│   └── randomMaze.ts
├── constants.ts
├── types.ts
└── PathfindingVisualizer.tsx
```

### Key Components

- **PathfindingVisualizer**: Main container managing state and coordinating subcomponents
- **Grid**: Renders the node grid and handles mouse interactions
- **Node**: Individual cell component with dynamic styling based on state
- **ControlPanel**: UI controls for algorithm selection, maze generation, and actions
- **useGrid**: Custom hook for grid state management
- **useVisualization**: Custom hook for animation state and timing

## Keyboard Shortcuts

- **Shift + Click**: Add weighted node
- **Click + Drag**: Draw walls
- **Drag Start/Finish**: Reposition start or finish nodes

## Accessibility

- ARIA labels on all interactive elements
- Keyboard navigable controls
- Clear visual indicators for different node states
- High contrast color scheme

## Performance

- Optimized React rendering with `useCallback` and `useMemo`
- Efficient grid updates using functional state updates
- MinHeap data structure for O(log n) priority queue operations
- Configurable animation speeds for performance tuning

## Browser Support

- Modern browsers (Chrome, Firefox, Edge, Safari)
- Requires JavaScript enabled
- Responsive design for various screen sizes

## Credits

Built with React, TypeScript, and Tailwind CSS as part of the Adzzse Portfolio project.

## License

Part of the Adzzse Portfolio project.
