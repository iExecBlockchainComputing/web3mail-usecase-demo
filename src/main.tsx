import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Analytics } from '@vercel/analytics/react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { WagmiConfig } from 'wagmi';
import { Toaster } from '@/components/ui/toaster.tsx';
import { checkEnvVars } from '@/utils/checkEnvVars.ts';
import { wagmiConfig } from '@/utils/wagmiConfig.ts';
import App from './App';
import './index.css';

checkEnvVars();

const queryClient = new QueryClient();

const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);

root.render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <App />
          <Toaster />
        </BrowserRouter>
      </QueryClientProvider>
    </WagmiConfig>
    <Analytics />
  </React.StrictMode>
);
