import React from 'react';
import { createRoot } from 'react-dom/client';
import RibbonGlow from './RibbonGlow.tsx';

const rootElement = document.getElementById('ribbon-root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <RibbonGlow 
      background="#050506"
      color1="#1c1c1f"
      color2="#080809"
      speed={35}
      size={150}
      angle={-45}
      reach={400}
      hover={150}
    />
  );
}
