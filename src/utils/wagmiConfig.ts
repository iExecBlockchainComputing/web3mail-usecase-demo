import { defaultWagmiConfig, createWeb3Modal } from '@web3modal/wagmi/react';
import { bellecour } from '@/utils/walletConnection.ts';

// Wagmi Client initialization
if (!import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID) {
  throw new Error(
    'You need to provide VITE_WALLET_CONNECT_PROJECT_ID env variable'
  );
}

export const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID!;

const chains = [bellecour];

const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

export const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains });
