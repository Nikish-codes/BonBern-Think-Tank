import React from 'react';
import { createRoot } from 'react-dom/client';
import VectorWordmark from './VectorWordmark.tsx';

const rootElement = document.getElementById('wordmark-root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <VectorWordmark 
      text="BONBERN" 
      font={{ 
        fontFamily: 'DM Serif Display, serif', 
        fontWeight: 400, 
        fontSize: '260px',
        letterSpacing: '-0.04em'
      }} 
      background="transparent"
      textColor="#e42218"
      shade="rgba(0,0,0,0.1)"
      accent="transparent"
      reach={280}
      speed={60}
      damping={50}
    />
  );
}
