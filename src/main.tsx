import React from 'react';
import './modified-tailwind-preflight.css';
import './index.css';
import App from './App';
import { Toaster } from '@/components/ui/toaster.tsx';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material';
import { WagmiConfig } from 'wagmi';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { wagmiConfig } from '@/utils/wagmiConfig.ts';

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
          <WagmiConfig config={wagmiConfig}>
            <App />
            <Toaster />
          </WagmiConfig>
        </ThemeProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
