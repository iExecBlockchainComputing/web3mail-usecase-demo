import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useDisconnect } from 'wagmi';

export function useLoginLogout() {
  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();

  const logout = () => {
    disconnect();
  };

  const login = () => {
    open();
  };

  return {
    login,
    logout,
  };
}
