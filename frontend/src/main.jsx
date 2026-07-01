import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './store/AuthContext.jsx';
import { MarketplaceProvider } from './store/MarketplaceContext.jsx';
import 'flag-icons/css/flag-icons.min.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MarketplaceProvider>
          <App />
        </MarketplaceProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
