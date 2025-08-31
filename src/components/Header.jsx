import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Header() {
  const location = useLocation()
  const [activeDropdown, setActiveDropdown] = useState(null)
  const dropdownRef = useRef(null)
  
  const toggleDropdown = (category) => {
    setActiveDropdown(activeDropdown === category ? null : category)
  }
  
  const closeDropdown = () => {
    setActiveDropdown(null)
  }
  
  const isActive = (path) => location.pathname === path
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown()
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  
  return (
    <header className="app-header">
      <div className="app-header-inner">
        <Link to="/" className="app-title-link">
          <h1 className="app-title">Adzzse Portfolio</h1>
        </Link>
        <nav className="app-nav" aria-label="Primary" ref={dropdownRef}>
          <div className="nav-dropdown">
            <button 
              className={`nav-dropdown-toggle ${activeDropdown === 'games' ? 'active' : ''}`}
              onClick={() => toggleDropdown('games')}
            >
              Games
              <span className="dropdown-arrow">▼</span>
            </button>
            <div className={`nav-dropdown-menu ${activeDropdown === 'games' ? 'show' : ''}`}>
              <Link 
                to="/gameoflife" 
                className={isActive('/gameoflife') ? 'active' : ''}
                onClick={closeDropdown}
              >
                Conway's Game of Life
              </Link>
              <Link 
                to="/highlife" 
                className={isActive('/highlife') ? 'active' : ''}
                onClick={closeDropdown}
              >
                Highlife
              </Link>
              <Link 
                to="/langtonsant" 
                className={isActive('/langtonsant') ? 'active' : ''}
                onClick={closeDropdown}
              >
                Langton's Ant
              </Link>
              <Link 
                to="/rule30" 
                className={isActive('/rule30') ? 'active' : ''}
                onClick={closeDropdown}
              >
                Rule 30
              </Link>
            </div>
          </div>
          
          <div className="nav-dropdown">
            <button 
              className={`nav-dropdown-toggle ${activeDropdown === 'apps' ? 'active' : ''}`}
              onClick={() => toggleDropdown('apps')}
            >
              Apps
              <span className="dropdown-arrow">▼</span>
            </button>
            <div className={`nav-dropdown-menu ${activeDropdown === 'apps' ? 'show' : ''}`}>
              <Link 
                to="/calculator" 
                className={isActive('/calculator') ? 'active' : ''}
                onClick={closeDropdown}
              >
                Calculator
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
