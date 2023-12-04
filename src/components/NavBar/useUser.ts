import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useDisconnect } from 'wagmi';
import { useAppDispatch } from '@/app/hooks.ts';
import { resetAppState } from '@/app/appSlice.ts';

export function useUser() {
  const { open } = useWeb3Modal();
  const { isConnected, address } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const dispatch = useAppDispatch();

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
    login,
    logout,
  };
}
