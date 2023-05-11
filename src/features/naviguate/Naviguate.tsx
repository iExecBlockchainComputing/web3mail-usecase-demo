import './Naviguate.css';
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
import img from '../../assets/logo.png';
import {
  initDataProtector,
  selectAppIsConnected,
  selectThereIsSomeRequestPending,
} from '../../app/appSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';

export default function Naviguate() {
  const dispatch = useAppDispatch();
  const { open } = useWeb3Modal();
  const naviguate = useNavigate();
  const { address, isConnected, isDisconnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [value, setValue] = useState('myProtectedData');
  const isAccountConnected = useAppSelector(selectAppIsConnected);
  const loading = useAppSelector(selectThereIsSomeRequestPending);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const shortAddress = (address: string) => {
    return address.slice(0, 6) + '...' + address.slice(-4);
  };

  useEffect(() => {
    if (isDisconnected) {
      open();
    } else if (isConnected && !isAccountConnected) {
      dispatch(initDataProtector());
    }
  }, [isDisconnected, isAccountConnected]);

  useEffect(() => {
    if (value === 'myProtectedData') {
      naviguate('/protectedData');
    }
    if (value === 'sendMail') {
      naviguate('/sendMail');
    }
  }, [value]);

  return (
    <div>
      <AppBar position="static" elevation={0} id="appbar">
        <Toolbar id="tootBar">
          <img
            onClick={() => naviguate('/protectedData')}
            src={img}
            alt="The immage can't be loaded"
            id="logo"
          />
          <Box sx={{ ml: 8 }}>
            <Tabs
              value={value}
              onChange={handleChange}
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
