import React from 'react';

interface GridLayoutProps {
  title: string;
  tagline: string;
  rules: string;
  aboutContent?: React.ReactNode;
  extraControls?: React.ReactNode;
  customControls?: React.ReactNode;
  children: React.ReactNode;
}

const GridLayout: React.FC<GridLayoutProps> = ({
  title,
  tagline,
  rules,
  aboutContent,
  extraControls,
  customControls,
  children
}) => {
  return (
    <div className="grid-layout">
      <div className="grid-header">
        <h2>{title}</h2>
        <p>{tagline}</p>
        <a href={rules} target="_blank" rel="noopener noreferrer">
          Learn more
        </a>
      </div>
      
      <div className="grid-container">
        {children}
      </div>
      
      <div className="grid-controls">
        {extraControls}
        {customControls}
      </div>
      
      {aboutContent && (
        <div className="grid-about">
          {aboutContent}
        </div>
      )}
    </div>
  );
};

export default GridLayout;