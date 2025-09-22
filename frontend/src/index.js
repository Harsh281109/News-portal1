import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'; // optional, create minimal CSS or use Tailwind/Bootstrap
const root = createRoot(document.getElementById('root'));
root.render(<App />);
