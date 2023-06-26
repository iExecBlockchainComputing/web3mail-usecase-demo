import { NavBar } from '@iexec/react-ui-kit';
import { useNavigate, useMatch } from 'react-router-dom';
import { useAccount, useDisconnect } from 'wagmi';
import { useWeb3Modal } from '@web3modal/react';
import { resetAppState, selectAppIsConnected } from '../../app/appSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { HOME, PROTECTED_DATA, SEND_EMAIL } from '../../config/path';
import { bellecour } from '../../utils/walletConnection';

const TABS = [
  {
    label: 'My Protected Data',
    value: PROTECTED_DATA, // tab path
  },
  {
    label: 'Send EMail',
    value: SEND_EMAIL, // tab path
  },
];

export default function Navigation() {
  const navigate = useNavigate();
  const { open, setDefaultChain } = useWeb3Modal();
  const { isConnected, address } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const dispatch = useAppDispatch();

  const match = useMatch(`/:currentTab/*`);
  const currentTab = match?.params.currentTab;

  //get the state from the store
  const isAccountConnected = useAppSelector(selectAppIsConnected);

  const handleNavigate = (target: string) => {
    navigate(`/${target}`);
  };

  const logout = async () => {
    await disconnectAsync();
    dispatch(resetAppState());
  };

  const login = () => {
    setDefaultChain(bellecour);
    open();
  };

  return (
    <NavBar
      title="iExec"
      onTitleClick={() => {
        navigate(`/${HOME}`);
      }}
      mobile={false}
      tabs={{
        value: currentTab,
        values: TABS,
        onSelect: (value) => handleNavigate(value),
      }}
      login={{
        isLoggedIn: !!isConnected && isAccountConnected,
        address,
        onLoginClick: () => login(),
        onLogoutClick: () => logout(),
      }}
    />
  );
}
