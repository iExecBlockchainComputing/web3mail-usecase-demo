import { Typography } from '@iexec/react-ui-kit';
import { FC, ReactNode, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { initDataProtector, selectAppIsConnected } from '../../app/appSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Box } from '@mui/material';

const LoginGuard: FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { address, isConnected, connector } = useAccount();

  //get the state from the store
  const isAccountConnected = useAppSelector(selectAppIsConnected);

  useEffect(() => {
    if (isConnected && connector && !isAccountConnected) {
      dispatch(initDataProtector());
    }
  }, [isConnected, connector, isAccountConnected, dispatch]);

  return (
    <>
      {address && isAccountConnected ? (
        <>{children}</>
      ) : (
        <Box
          sx={{
            margin: '3rem auto',
          }}
        >
          <Typography variant="body1">Please login with your wallet</Typography>
        </Box>
      )}
    </>
  );
};

export default LoginGuard;
