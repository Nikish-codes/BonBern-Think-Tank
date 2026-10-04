import React from 'react';
import { createRoot } from 'react-dom/client';
import InkdropSpread from './InkdropSpread.tsx';

const rootElement = document.getElementById('inkdrop-root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <InkdropSpread 
      text="We believe exceptional experiences begin with clarity, evolve through creativity, and are perfected through relentless attention to detail." 
      font={{ 
        fontFamily: 'DM Serif Display, serif', 
        fontWeight: 400, 
        fontSize: 'clamp(32px, 4vw, 56px)',
        lineHeight: '1.2'
      }} 
      color="#f7f5f1"
      staggerFrom="center"
    />
  );
}
