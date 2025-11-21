import React from 'react';
import PixelBlast from './PixelBlast';

export function Grid() {
  return (
    <div className="pointer-events-none absolute inset-0 transition duration-300 overflow-hidden">
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <PixelBlast
          variant="circle"
          pixelSize={6}
          color="#000080"
          patternScale={3}
          patternDensity={1.2}
          pixelSizeJitter={0.5}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={0.6}
          edgeFade={0.25}
          transparent
        />
      </div>
    </div>
  )
}

