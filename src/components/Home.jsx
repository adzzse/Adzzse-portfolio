import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="home">
      <h2>Welcome</h2>
      <p>This is a minimal portfolio hub. Use the navigation to explore components and demos.</p>
      <div className="cards">
        <Link className="card" to="/game-of-life">
          <h3>Conway's Game of Life →</h3>
          <p>Interactive cellular automaton with painting, speed, and grid controls.</p>
        </Link>
      </div>
    </div>
  )
}

export default Home
