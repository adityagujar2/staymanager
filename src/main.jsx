import React from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App.jsx';
import { StayManagerProvider } from './context/StayManagerContext.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StayManagerProvider>
      <App />
    </StayManagerProvider>
  </React.StrictMode>
);