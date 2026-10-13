import React from 'react';
import { createRoot } from 'react-dom/client';
import RibbonGlow from './RibbonGlow.tsx';

const rootElement = document.getElementById('ribbon-root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <RibbonGlow 
      background="#000000"
      color1="#1c1c1c"
      color2="#0c0c0c"
      speed={25}
      size={180}
      angle={-30}
      reach={0}
      hover={0}
    />
  );
}
