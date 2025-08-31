import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="home">
      <h2>Welcome</h2>
      <p>This is Adzzse's personal portfolio.</p>
      
      <div className="category">
        <h3 className="category-title">Game</h3>
        <div className="cards">
          <Link className="card" to="/gameoflife">
            <h3>Conway's Game of Life →</h3>
            <p>Interactive cellular automaton with classic B3/S23 rules.</p>
          </Link>
          <Link className="card" to="/highlife">
            <h3>Highlife →</h3>
            <p>B36/S23 cellular automaton.</p>
          </Link>
          <Link className="card" to="/langtonsant">
            <h3>Langton's Ant →</h3>
            <p>Simple rules, complex behavior - a 2D Turing machine.</p>
          </Link>
          <Link className="card" to="/rule30">
            <h3>Rule 30 →</h3>
            <p>Chaotic patterns from simple 1D cellular automaton rules.</p>
          </Link>
        </div>
      </div>

      <div className="category">
        <h3 className="category-title">Web App</h3>
        <div className="cards">
          <Link className="card" to="/calculator">
            <h3>Calculator →</h3>
            <p>It's a calculator, what did you expect?</p>
          </Link>
          <div className="card coming-soon">
            <h3>Coming Soon</h3>
            <p>Coming Soon</p>
          </div>
        </div>
      </div>

      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-links">
            <a 
              href="https://github.com/adzzse" 
              target="_blank" 
              rel="noopener noreferrer"
              className="github-link"
            >
              <span>View more on GitHub</span>
              <span className="github-icon"></span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
