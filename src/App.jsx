import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './components/Home'
import GameOfLife from './components/GameOfLife'

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game-of-life" element={<GameOfLife />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
