import { useUserStore } from '@/stores/user.store.ts';
import { FC, ReactNode } from 'react';
import { useAccount } from 'wagmi';

const LoginGuard: FC<{ children: ReactNode }> = ({ children }) => {
  const { isInitialized, isConnected } = useUserStore();
  const { chain } = useAccount();

  return (
    <>
      {isInitialized && isConnected && chain?.id === 134 && <>{children}</>}

      {isInitialized && !isConnected && (
        <p className="text-center text-lg">Please login with your wallet.</p>
      )}
    </>
  );
};

export default LoginGuard;
