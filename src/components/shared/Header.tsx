import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Header(): JSX.Element {
  const location = useLocation()
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  
  const toggleDropdown = (category: string) => {
    setActiveDropdown(activeDropdown === category ? null : category)
  }
  
  const closeDropdown = () => {
    setActiveDropdown(null)
  }
  
  const isActive = (path: string) => location.pathname === path
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
              <Link 
                to="/pathfinding" 
                className={isActive('/pathfinding') ? 'active' : ''}
                onClick={closeDropdown}
              >
                Pathfinding
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
          <Link to="/about" className={isActive('/about') ? 'active' : ''} onClick={closeDropdown} style={{marginLeft: '12px', padding: '8px 12px', borderRadius: '8px', textDecoration: 'none', color: 'inherit'}}>About</Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
