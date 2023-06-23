import './LoginGuard.css';
import { Typography } from '@iexec/react-ui-kit';
import { FC, ReactNode, useEffect } from 'react';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { initDataProtector, selectAppIsConnected } from '../../app/appSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Box } from '@mui/material';
import { Button } from '@iexec/react-ui-kit';

const LoginGuard: FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isConnected, connector } = useAccount();
  const { chain } = useNetwork();
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();
  //get the state from the store
  const isAccountConnected = useAppSelector(selectAppIsConnected);

  useEffect(() => {
    if (isConnected && connector && !isAccountConnected) {
      switchNetwork?.(chains[0]?.id);
      dispatch(initDataProtector());
    }
  }, [
    isConnected,
    connector,
    isAccountConnected,
    dispatch,
    chain?.id,
    switchNetwork,
    chains,
  ]);

  return (
    <>
      {isConnected && isAccountConnected && chain?.id === 134 && (
        <>{children}</>
      )}
      {!isConnected && !isAccountConnected && (chain?.id !== 134 || chain) && (
        <Box
          sx={{
            margin: '3rem auto',
          }}
        >
          <Typography>Please login with your wallet</Typography>
        </Box>
      )}
      {isConnected && isAccountConnected && chain?.id !== 134 && (
        <Box
          sx={{
            margin: '3rem auto',
          }}
        >
          <Typography>Oops, you're on the wrong network</Typography>
          <Typography>
            Click on the following button to switch to the right network
          </Typography>
          <Button
            className="switch-network-button"
            disabled={!switchNetwork || chain?.id === chains[0]?.id}
            key={chains[0]?.id}
            onClick={() => switchNetwork?.(chains[0]?.id)}
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
