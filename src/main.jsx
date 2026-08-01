import React from 'react';
import ReactDOM from 'react-dom/client';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { Network } from '@aptos-labs/ts-sdk';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AptosWalletAdapterProvider
      autoConnect
      dappConfig={{
        network: Network.TESTNET,
        // Rate-limit key for Aptos fullnode calls. This is designed by Aptos
        // Labs to be used client-side (it's a rate-limit key, not a secret
        // credential) — set as VITE_APTOS_API_KEY in Vercel's environment
        // variables, and Vite bakes it into the build at deploy time.
        aptosApiKey: import.meta.env.VITE_APTOS_API_KEY,
      }}
      onError={(error) => {
        console.error('Wallet adapter error:', error);
      }}
    >
      <App />
    </AptosWalletAdapterProvider>
  </React.StrictMode>
);
