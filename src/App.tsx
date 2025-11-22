import React from 'react'
import { Routes, Route } from 'react-router-dom'
import About from './components/About'
import TargetCursor from './components/widgets/Cursor'
import { ThemeToggle } from './components/widgets/ThemeToggle'
import PathfindingVisualizer from './features/pathfinding/PathfindingVisualizer'

function App(): JSX.Element {
  return (
    <div className="App">
      <TargetCursor />
      <ThemeToggle />
      <main>
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/pathfinding" element={<PathfindingVisualizer />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
