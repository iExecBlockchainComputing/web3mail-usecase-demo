import { useUserStore } from '@/stores/user.store';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import {
  cleanDataProtectorSDK,
  initDataProtectorSDK,
} from '@/externals/dataProtectorClient.ts';
import { initWeb3mailSDK } from '@/externals/web3mailClient.ts';

export function useWatchWagmiAccount() {
  const { connector, isConnected, address, status, chain } = useAccount();
  const { setConnector, setInitialized, setConnected, setAddress } =
    useUserStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Update userStore
    setConnector(connector);
    setInitialized(status === 'connected' || status === 'disconnected');
    setConnected(isConnected);
    setAddress(address);

    // Update dataProtector client
    if (status === 'connected') {
      initDataProtectorSDK({ connector });
      initWeb3mailSDK({ connector });
      queryClient.removeQueries();
      return;
    }

    cleanDataProtectorSDK();
    queryClient.removeQueries();
  }, [connector, status, isConnected, address, chain]);
}
