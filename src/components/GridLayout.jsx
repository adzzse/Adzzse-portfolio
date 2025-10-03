import React from 'react'

function GridLayout({ title, tagline, canvasRef, controls, footerLinks }) {
  return (
    <div className="cellular-automaton">
      <header className="site-header">
        <h2>{title}</h2>
        {tagline ? <p className="tagline">{tagline}</p> : null}
      </header>
      <div className="layout">
        <section className="board-section">
          <canvas ref={canvasRef} aria-label={`${title} board`} role="img" />
        </section>
        <aside className="controls">
          {controls}
        </aside>
      </div>
      <footer className="site-footer">
        {footerLinks}
      </footer>
    </div>
  )
}

export default GridLayout


