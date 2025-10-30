import React from 'react'

function FogBackground(): JSX.Element {
  return (
    <div className="fog-background">
      {/* Large fog bubbles */}
      <div className="fog-bubble"></div>
      <div className="fog-bubble"></div>
      <div className="fog-bubble"></div>
      <div className="fog-bubble"></div>
      <div className="fog-bubble"></div>
      <div className="fog-bubble"></div>
      
      {/* Small fog particles */}
      <div className="fog-particle"></div>
      <div className="fog-particle"></div>
      <div className="fog-particle"></div>
      <div className="fog-particle"></div>
    </div>
  )
}

export default FogBackground
