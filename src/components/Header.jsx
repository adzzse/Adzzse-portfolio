import React from 'react'
import { Link, useLocation } from 'react-router-dom'

function Header() {
  const location = useLocation()
  
  return (
    <header className="app-header">
      <div className="app-header-inner">
        <Link to="/" className="app-title-link">
          <h1 className="app-title">Adzzse Portfolio</h1>
        </Link>
        <nav className="app-nav" aria-label="Primary">
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
          >
            Home
          </Link>
          <Link 
            to="/gameoflife" 
            className={location.pathname === '/gameoflife' ? 'active' : ''}
          >
            Game of Life
          </Link>
          <Link 
            to="/highlife" 
            className={location.pathname === '/highlife' ? 'active' : ''}
          >
            Highlife
          </Link>
          <Link 
            to="/langtonsant" 
            className={location.pathname === '/langtonsant' ? 'active' : ''}
          >
            Langton's Ant
          </Link>
          <Link 
            to="/rule30" 
            className={location.pathname === '/rule30' ? 'active' : ''}
          >
            Rule 30
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
