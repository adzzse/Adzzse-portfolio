import React, { useMemo } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './components/Home'
import GameOfLife from './components/GameOfLife'
import Highlife from './components/Highlife'
// import Weather from './components/Weather'
import LangtonsAnt from './components/LangtonsAnt'
import Rule30 from './components/Rule30'
import Calculator from './components/Calculator'
import FogBackground from './components/FogBackground'

// Memoized components for better performance
const MemoizedHeader = React.memo(Header)
const MemoizedFogBackground = React.memo(FogBackground)

function App() {
  // Memoize routes to prevent unnecessary re-renders
  const routes = useMemo(() => (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/gameoflife" element={<GameOfLife />} />
      <Route path="/highlife" element={<Highlife />} />
      <Route path="/langtonsant" element={<LangtonsAnt />} />
      <Route path="/rule30" element={<Rule30 />} />
      <Route path="/calculator" element={<Calculator />} />
    </Routes>
  ), [])

  return (
    <div className="App">
      <MemoizedFogBackground />
      <MemoizedHeader />
      <main>
        {routes}
      </main>
    </div>
  )
}

export default App
