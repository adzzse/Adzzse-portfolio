import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="home">
      <h2>Welcome</h2>
      <p>This is a personal portfolio hub. Use the navigation to explore demos.</p>
      <div className="cards">
        <Link className="card" to="/game-of-life">
          <h3>Conway's Game of Life →</h3>
          <p>Interactive cellular automaton.</p>
        </Link>
        <Link className="card" to="/highlife">
          <h3>Highlife →</h3>
          <p>B36/S23 cellular automaton.</p>
        </Link>
      </div>
    </div>
  )
}

export default Home
