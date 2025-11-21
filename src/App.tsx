import React from 'react'
import { Routes, Route } from 'react-router-dom'
import About from './components/About'

function App(): JSX.Element {
  return (
    <div className="App">
      <main>
        <Routes>
          <Route path="/" element={<About />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
