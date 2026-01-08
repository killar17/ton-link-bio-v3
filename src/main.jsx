import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
// Import the provider
import { TonConnectUIProvider } from '@tonconnect/ui-react';

// Use the production Vercel URL for the manifest
const manifestUrl = 'https://ton-link-bio-v3-tblm.vercel.app/tonconnect-manifest.json'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrap the App component */}
    <TonConnectUIProvider 
      manifestUrl={manifestUrl}
      actionsConfiguration={{
        twaReturnUrl: 'https://t.me/TON D ID'
      }}
    >
      <App />
    </TonConnectUIProvider>
  </React.StrictMode>,
);
