import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import App from './App.tsx';
import { ContentProvider } from './context/ContentContext';
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ContentProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ContentProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
