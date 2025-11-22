import React from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { FaHome, FaMapSigns, FaGithub } from 'react-icons/fa'
import About from './components/About'
import TargetCursor from './components/widgets/Cursor'
import { ThemeToggle } from './components/widgets/ThemeToggle'
import Dock from './components/widgets/Dock'
import PathfindingVisualizer from './features/pathfinding/components/PathfindingVisualizer'

function App(): JSX.Element {
  const navigate = useNavigate()

  const items = [
    {
      icon: <FaHome size={18} className="text-gray-700 dark:text-gray-200" />,
      label: 'Home',
      onClick: () => navigate('/'),
    },
    {
      icon: <FaMapSigns size={18} className="text-gray-700 dark:text-gray-200" />,
      label: 'Pathfinding',
      onClick: () => navigate('/pathfinding'),
    },
    // {
    //   icon: <FaGithub size={18} className="text-gray-700 dark:text-gray-200" />,
    //   label: 'GitHub',
    //   onClick: () => window.open('https://github.com/adzzse', '_blank'),
    // },
  ]

  return (
    <div className="App relative min-h-screen">
      <TargetCursor />
      <ThemeToggle />
      <main>
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/pathfinding" element={<PathfindingVisualizer />} />
        </Routes>
      </main>
      
      <div className="fixed bottom-4 left-0 right-0 flex justify-center z-50 pointer-events-none">
        <div className="pointer-events-auto">
          <Dock items={items} />
        </div>
      </div>
    </div>
  )
}

export default App
