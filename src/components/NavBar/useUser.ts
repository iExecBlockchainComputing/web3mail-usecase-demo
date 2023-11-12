import { useWeb3Modal } from '@web3modal/react';
import { useAccount, useDisconnect } from 'wagmi';
import { useAppDispatch, useAppSelector } from '@/app/hooks.ts';
import { resetAppState, selectAppIsConnected } from '@/app/appSlice.ts';
import { bellecour } from '@/utils/walletConnection.ts';

export function useUser() {
  const { open, setDefaultChain } = useWeb3Modal();
  const { isConnected, address } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const dispatch = useAppDispatch();

  //get the state from the store
  const isAccountConnected = useAppSelector(selectAppIsConnected);

  const logout = async () => {
    await disconnectAsync();
    dispatch(resetAppState());
  };

  const login = () => {
    setDefaultChain(bellecour);
    open();
  };

  return {
    isConnected,
    address,
    isAccountConnected,
    login,
    logout,
  };
}
