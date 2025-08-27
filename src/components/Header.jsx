import React from 'react'
import { Link, useLocation } from 'react-router-dom'

function Header() {
  const location = useLocation()
  
  return (
    <header className="app-header">
      <div className="app-header-inner">
        <h1 className="app-title">Adzzse Portfolio</h1>
        <nav className="app-nav" aria-label="Primary">
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
          >
            Home
          </Link>
          <Link 
            to="/game-of-life" 
            className={location.pathname === '/game-of-life' ? 'active' : ''}
          >
            Game of Life
          </Link>
          <Link 
            to="/highlife" 
            className={location.pathname === '/highlife' ? 'active' : ''}
          >
            Highlife
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
