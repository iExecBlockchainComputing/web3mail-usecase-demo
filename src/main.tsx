import React from 'react';
import './index.css';
import App from './App';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material';
import {
  EthereumClient,
  w3mProvider,
  w3mConnectors,
} from '@web3modal/ethereum';
import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { bellecour } from './utils/walletConnection';
import { Web3Modal } from '@web3modal/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);

// material ui theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#FCD15A',
      contrastText: '#1D1D24',
    },
  },
});

// Wagmi Client
if (!import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID) {
  throw new Error('You need to provide REACT_APP_PROJECT_ID env variable');
}
const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID!;
const chains = [bellecour];
const { provider } = configureChains(chains, [w3mProvider({ projectId })]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ version: 1, chains, projectId }),
  provider,
});

// Configure modal ethereum client
const ethereumClient = new EthereumClient(wagmiClient, chains);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <WagmiConfig client={wagmiClient}>
            <App />
          </WagmiConfig>
          <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
        </ThemeProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
