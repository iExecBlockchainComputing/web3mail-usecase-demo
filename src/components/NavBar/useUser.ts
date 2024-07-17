import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useDisconnect } from 'wagmi';
import { resetAppState, selectAppIsConnected } from '@/app/appSlice.ts';
import { useAppDispatch, useAppSelector } from '@/app/hooks.ts';

export function useUser() {
  const { open } = useWeb3Modal();
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
