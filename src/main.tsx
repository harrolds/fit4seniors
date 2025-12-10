import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRoot } from './core';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container missing in index.html');
}

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <AppRoot />
  </React.StrictMode>
);
