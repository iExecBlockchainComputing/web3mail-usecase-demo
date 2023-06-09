import { NavBar } from '@iexec/react-ui-kit';
import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAccount, useDisconnect } from 'wagmi';
import { useWeb3Modal } from '@web3modal/react';
import { initDataProtector, selectAppIsConnected } from '../../app/appSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';

const TABS = [
  {
    label: 'My Protected Data',
    value: 'myProtectedData',
  },
  {
    label: 'Send Mail',
    value: 'sendMail',
  },
];

export default function Navigate() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { open } = useWeb3Modal();
  const { address, isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const [currentTab, setCurrentTab] = useState('myProtectedData');

  //get the state from the store
  const isAccountConnected = useAppSelector(selectAppIsConnected);

  useEffect(() => {
    if (isConnected && connector && !isAccountConnected) {
      dispatch(initDataProtector());
    }
  }, [isConnected, connector, isAccountConnected, dispatch]);

  useEffect(() => {
    if (currentTab === TABS[0].value) {
      navigate('/protectedData');
    }
    if (currentTab === TABS[1].value) {
      navigate('/sendMail');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab]);

  return (
    <>
      <NavBar
        title="iExec"
        mobile={false}
        tabs={{
          value: currentTab,
          values: TABS,
          onSelect: (value) => setCurrentTab(value),
        }}
        login={{
          isLoggedIn: !!address && isAccountConnected,
          address,
          onLoginClick: () => open(),
          onLogoutClick: () => disconnect(),
        }}
      ></NavBar>
      {address && isAccountConnected && <Outlet></Outlet>}
    </>
  );
}
