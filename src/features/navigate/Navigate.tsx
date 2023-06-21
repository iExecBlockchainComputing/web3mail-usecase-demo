import { NavBar } from '@iexec/react-ui-kit';
import { useEffect } from 'react';
import { useNavigate, Outlet, useMatch } from 'react-router-dom';
import { useAccount, useDisconnect } from 'wagmi';
import { useWeb3Modal } from '@web3modal/react';
import { initDataProtector, selectAppIsConnected } from '../../app/appSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { PROTECTED_DATA, SEND_MAIL } from '../../config/path';

const TABS = [
  {
    label: 'My Protected Data',
    value: PROTECTED_DATA, // tab path
  },
  {
    label: 'Send Mail',
    value: SEND_MAIL, // tab path
  },
];

export default function Navigate() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { open } = useWeb3Modal();
  const { address, isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();

  const match = useMatch(`/:currentTab/*`);
  const currentTab = match?.params.currentTab;

  //get the state from the store
  const isAccountConnected = useAppSelector(selectAppIsConnected);

  useEffect(() => {
    if (isConnected && connector && !isAccountConnected) {
      dispatch(initDataProtector());
    }
  }, [isConnected, connector, isAccountConnected, dispatch]);

  const handleNavigate = (target: string) => {
    navigate(`/${target}`);
  };

  return (
    <>
      <NavBar
        title="iExec"
        mobile={false}
        tabs={{
          value: currentTab,
          values: TABS,
          onSelect: (value) => handleNavigate(value),
        }}
        login={{
          isLoggedIn: !!address && isAccountConnected,
          address,
          onLoginClick: () => {
            open();
          },
          onLogoutClick: () => disconnect(),
        }}
      ></NavBar>
      {address && isAccountConnected ? <Outlet /> : 'Connect to Your Wallet'}
    </>
  );
}
