import React from 'react';
import './modified-tailwind-preflight.css';
import './index.css';
import App from './App';
import { Toaster } from '@/components/ui/toaster.tsx';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material';
import { WagmiConfig } from 'wagmi';
import { Web3Modal } from '@web3modal/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { ethereumClient, projectId, wagmiClient } from './app/store';

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

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <WagmiConfig client={wagmiClient}>
            <App />
            <Toaster />
          </WagmiConfig>
          <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
        </ThemeProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
