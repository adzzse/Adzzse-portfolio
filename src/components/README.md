# CellularAutomaton Component

The `CellularAutomaton` component is a reusable base component for creating various types of cellular automata and simulation games.

## Basic Usage

For simple Conway-style automata (like Game of Life, Highlife):

```jsx
import React from 'react'
import CellularAutomaton from './CellularAutomaton'

function MyAutomaton() {
  const aboutContent = (
    <p>Description of your automaton...</p>
  )

  return (
    <CellularAutomaton
      title="My Automaton"
      tagline="A brief description"
      rules="https://example.com/rules"
      birthRules={[3]}        // Numbers of neighbors needed for birth
      survivalRules={[2, 3]}  // Numbers of neighbors needed for survival
      cellColor="#ff0000"     // Color of live cells
      backgroundColor="#000000" // Background color
      aboutContent={aboutContent}
    />
  )
}
```

## Advanced Usage

For complex automata that need custom logic (like Langton's Ant, Rule 30):

```jsx
import React from 'react'
import CellularAutomaton from './CellularAutomaton'

function MyComplexAutomaton() {
  // Custom step function
  const stepFunction = (grid, cols, rows, customState, setCustomState, wrapEdges, index) => {
    // Your custom logic here
    const newGrid = new Uint8Array(cols * rows)
    
    // Apply your rules...
    
    // Return the new grid state
    return { grid: newGrid }
  }

  // Custom initial state
  const initialState = (cols, rows, grid) => {
    // Set up initial conditions
    return { /* your custom state */ }
  }

  // Custom drawing function
  const customDraw = (ctx, canvas, grid, cols, rows, cellSize, showGrid, index, customState) => {
    // Your custom drawing logic
  }

  // Custom controls
  const customControls = ({ setGrid, cols, rows, grid, customState, setCustomState }) => {
    return (
      <button onClick={() => /* your action */}>
        Custom Action
      </button>
    )
  }

  return (
    <CellularAutomaton
      title="My Complex Automaton"
      tagline="Description"
      rules="https://example.com/rules"
      stepFunction={stepFunction}
      initialState={initialState}
      customDraw={customDraw}
      customControls={customControls}
      maxFps={60}
    />
  )
}
```

## Props

### Basic Props
- `title`: The title of the automaton
- `tagline`: A brief description
- `rules`: URL to learn more about the rules
- `cellColor`: Color of live cells (default: '#6ee7ff')
- `backgroundColor`: Background color (default: '#0f1738')
- `aboutContent`: JSX content for the about section
- `maxFps`: Maximum FPS for the simulation (default: 60)

### Conway-Style Automata Props
- `birthRules`: Array of neighbor counts needed for birth
- `survivalRules`: Array of neighbor counts needed for survival

### Advanced Props
- `stepFunction`: Custom function to compute the next state
- `initialState`: Custom function to set up initial conditions
- `customDraw`: Custom drawing function
- `customControls`: Custom control buttons
- `extraControls`: Additional control buttons (legacy, use customControls instead)
- `cellStates`: Number of possible cell states (default: 2)

## Step Function Signature

```jsx
const stepFunction = (grid, cols, rows, customState, setCustomState, wrapEdges, index) => {
  // grid: Current grid state (Uint8Array)
  // cols, rows: Grid dimensions
  // customState: Your custom state object
  // setCustomState: Function to update custom state
  // wrapEdges: Boolean for edge wrapping
  // index: Helper function to get grid index
  
  // Return: { grid: newGrid, next?: newNext }
}
```

## Initial State Function Signature

```jsx
const initialState = (cols, rows, grid) => {
  // cols, rows: Grid dimensions
  // grid: Empty grid (Uint8Array)
  
  // Return: Your custom state object or null
}
```

## Custom Draw Function Signature

```jsx
const customDraw = (ctx, canvas, grid, cols, rows, cellSize, showGrid, index, customState) => {
  // ctx: Canvas 2D context
  // canvas: Canvas element
  // grid: Current grid state
  // cols, rows: Grid dimensions
  // cellSize: Size of each cell in pixels
  // showGrid: Whether to show grid lines
  // index: Helper function to get grid index
  // customState: Your custom state object
}
```

## Examples

See the existing components for examples:
- `GameOfLife.jsx` - Simple Conway-style automaton
- `Highlife.jsx` - Conway-style with custom controls
- `LangtonsAnt.jsx` - Complex automaton with custom logic
- `Rule30.jsx` - 1D cellular automaton

## Tips

1. **Performance**: Keep your step function efficient, especially for large grids
2. **State Management**: Use `customState` for data that persists between steps
3. **Drawing**: The default drawing is optimized for binary states. Use `customDraw` for complex visualizations
4. **Controls**: Use `customControls` for automaton-specific actions
5. **Edge Cases**: Handle grid resizing and edge wrapping in your custom functions
