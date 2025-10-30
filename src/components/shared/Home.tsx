import React from 'react'
import { Link } from 'react-router-dom'

function Home(): JSX.Element {
  return (
    <div className="home">
      {/* Welcome Section */}
      <section className="welcome-section">
        <h1 className="main-title">Welcome to Adzzse's Portfolio!</h1>
        <p className="welcome-description">
          Explore interactive games, algorithms, and web applications. 
          Each project demonstrates different programming concepts and creative implementations.
        </p>
      </section>

      {/* Navigation Categories */}
      <nav className="category-nav">
        <div className="nav-section">
          <h2 className="nav-title">Games</h2>
          <div className="nav-links">
            <Link to="/gameoflife" className="nav-link">Conway's Game of Life</Link>
            <Link to="/highlife" className="nav-link">Highlife</Link>
            <Link to="/langtonsant" className="nav-link">Langton's Ant</Link>
            <Link to="/rule30" className="nav-link">Rule 30</Link>
            <Link to="/pathfinding" className="nav-link">Pathfinding</Link>
          </div>
        </div>

        <div className="nav-section">
          <h2 className="nav-title">Web Apps</h2>
          <div className="nav-links">
            <Link to="/calculator" className="nav-link">Calculator</Link>
            <div className="nav-link coming-soon">Coming Soon</div>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <footer className="portfolio-footer">
        <div className="footer-content">
          <a 
            href="https://github.com/adzzse" 
            target="_blank" 
            rel="noopener noreferrer"
            className="github-link"
          >
            <span>View more on GitHub</span>
            <span className="github-icon">→</span>
          </a>
        </div>
      </footer>
    </div>
  )
}

export default Home
