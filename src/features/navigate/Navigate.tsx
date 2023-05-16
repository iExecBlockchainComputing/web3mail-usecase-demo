import './Navigate.css';
import img from '../../assets/logo.png';
import {
  AppBar,
  Box,
  Button,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAccount, useDisconnect } from 'wagmi';
import { useWeb3Modal } from '@web3modal/react';
import {
  initDataProtector,
  selectAppIsConnected,
  selectThereIsSomeRequestPending,
} from '../../app/appSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { shortAddress } from '../../utils/utils';

export default function Navigate() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { open } = useWeb3Modal();
  const { address, isConnected, isDisconnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [value, setValue] = useState('myProtectedData');

  //get the state from the store
  const isAccountConnected = useAppSelector(selectAppIsConnected);
  const loading = useAppSelector(selectThereIsSomeRequestPending);

  const handleChangeTab = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (isDisconnected) {
      open();
    } else if (isConnected && !isAccountConnected) {
      dispatch(initDataProtector());
    }
  }, [isDisconnected, isAccountConnected, isConnected, open, dispatch]);

  useEffect(() => {
    if (value === 'myProtectedData') {
      navigate('/protectedData');
    }
    if (value === 'sendMail') {
      navigate('/sendMail');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div>
      <AppBar position="static" elevation={0} id="appbar">
        <Toolbar id="toolBar">
          <img
            onClick={() => navigate('/protectedData')}
            src={img}
            alt="The image can't be loaded"
            id="logo"
          />
          <Box sx={{ ml: 8 }}>
            <Tabs
              value={value}
              onChange={handleChangeTab}
              indicatorColor="secondary"
              textColor="secondary"
              sx={{ '& .MuiTab-root': { textTransform: 'none' } }}
            >
              <Tab value="myProtectedData" label="My Protected Data" />
              <Tab value="sendMail" label="Send Mail" />
            </Tabs>
          </Box>
          <Typography
            sx={{
              flexGrow: 1,
              textAlign: 'right',
              mr: 2,
              fontStyle: 'italic',
            }}
          >
            {isConnected && shortAddress(address as string)}
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              isConnected ? disconnect() : open();
            }}
          >
            {isConnected ? 'Disconnect' : 'Connect'}
          </Button>
        </Toolbar>
        {loading && <div id="loadingBar"></div>}
      </AppBar>
      {isConnected ? <Outlet /> : 'Connect to Your Wallet'}
    </div>
  );
}
