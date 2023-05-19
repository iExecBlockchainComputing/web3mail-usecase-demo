import './Navigate.css';
import img from '../../assets/iexec.png';
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
import { getShortAddress } from '../../utils/utils';

export default function Navigate() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { open } = useWeb3Modal();
  const { address, isConnected, isDisconnected, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const [currentTab, setCurrentTab] = useState('myProtectedData');

  //get the state from the store
  const isAccountConnected = useAppSelector(selectAppIsConnected);
  const loading = useAppSelector(selectThereIsSomeRequestPending);

  const handleChangeTab = (_: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  useEffect(() => {
    if (isDisconnected) {
      open();
    }
  }, [isDisconnected, open]);

  useEffect(() => {
    if (isConnected && connector && !isAccountConnected) {
      dispatch(initDataProtector());
    }
  }, [isConnected, connector, isAccountConnected, dispatch]);

  useEffect(() => {
    if (currentTab === 'myProtectedData') {
      navigate('/protectedData');
    }
    if (currentTab === 'sendMail') {
      navigate('/sendMail');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab]);

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
              value={currentTab}
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
            {isConnected && getShortAddress(address as string)}
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
