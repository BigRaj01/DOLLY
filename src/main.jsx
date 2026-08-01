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
        aptosApiKey: import.meta.env.VITE_APTOS_API_KEY,
      }}
      optInWallets={["Petra"]}
      onError={(error) => {
        console.error('Wallet adapter error:', error);
      }}
    >
      <App />
    </AptosWalletAdapterProvider>
  </React.StrictMode>
);
