import React from 'react'
import { Routes, Route } from 'react-router-dom'
import About from './components/About'
import TargetCursor from './components/widgets/Cursor'
import { ThemeToggle } from './components/widgets/ThemeToggle'

function App(): JSX.Element {
  return (
    <div className="App">
      <TargetCursor />
      <ThemeToggle />
      <main>
        <Routes>
          <Route path="/" element={<About />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
