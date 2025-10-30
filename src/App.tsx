import React, { useMemo } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/shared/Header'
import Home from './components/shared/Home'
import GameOfLife from './components/cellular/GameOfLife'
import Highlife from './components/cellular/Highlife'
import LangtonsAnt from './components/cellular/LangtonsAnt'
import Rule30 from './components/cellular/Rule30'
import Calculator from './components/Calculator'
import FogBackground from './components/shared/FogBackground'
import Pathfinding from './components/pathfinding/Pathfinding'

const MemoizedHeader = React.memo(Header)
const MemoizedFogBackground = React.memo(FogBackground)

function App(): JSX.Element {
  const routes = useMemo(() => (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/gameoflife" element={<GameOfLife />} />
      <Route path="/highlife" element={<Highlife />} />
      <Route path="/langtonsant" element={<LangtonsAnt />} />
      <Route path="/rule30" element={<Rule30 />} />
      <Route path="/calculator" element={<Calculator />} />
      <Route path="/pathfinding" element={<Pathfinding />} />
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
