import React from 'react';
import PixelBlast from './PixelBlast';

export function Grid() {
  const [isDark, setIsDark] = React.useState(document.documentElement.classList.contains('dark'));

  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 transition duration-300 overflow-hidden">
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <PixelBlast
          variant="circle"
          pixelSize={6}
          color={isDark ? "#000080" : "#3b82f6"} // Dark blue for dark mode, lighter blue for light mode
          patternScale={3}
          patternDensity={1.2}
          pixelSizeJitter={0.5}
          enableRipples={false} // Disable interaction
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

