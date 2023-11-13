import { FC, ReactNode } from 'react';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { Box } from '@mui/material';
import { Button } from '@/components/ui/button.tsx';
import { selectAppIsConnected } from '@/app/appSlice.ts';
import { useAppSelector } from '@/app/hooks.ts';

const LoginGuard: FC<{ children: ReactNode }> = ({ children }) => {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();
  //get the state from the store
  const isAccountConnected = useAppSelector(selectAppIsConnected);

  return (
    <>
      {isConnected && isAccountConnected && chain?.id === 134 && (
        <>{children}</>
      )}
      {!isConnected && !isAccountConnected && (chain?.id !== 134 || chain) && (
        <p className="text-center text-lg">Please login with your wallet.</p>
      )}
      {isConnected && isAccountConnected && chain?.id !== 134 && (
        <Box
          sx={{
            margin: '3rem auto',
          }}
        >
          <p>Oops, you're on the wrong network</p>
          <p>Click on the following button to switch to the right network</p>
          <Button
            disabled={!switchNetwork || chain?.id === chains[0]?.id}
            key={chains[0]?.id}
            onClick={() => switchNetwork?.(chains[0]?.id)}
            className="mt-4"
          >
            Switch to {chains[0].name}
            {isLoading && pendingChainId === chains[0]?.id && ' (switching)'}
          </Button>
          <div>{error && error.message}</div>
        </Box>
      )}
    </>
  );
};

export default LoginGuard;
