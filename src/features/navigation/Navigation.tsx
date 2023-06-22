import { NavBar } from '@iexec/react-ui-kit';
import { useNavigate, useMatch } from 'react-router-dom';
import { useAccount, useDisconnect } from 'wagmi';
import { useWeb3Modal } from '@web3modal/react';
import { selectAppIsConnected } from '../../app/appSlice';
import { useAppSelector } from '../../app/hooks';
import { HOME, PROTECTED_DATA, SEND_MAIL } from '../../config/path';

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

export default function Navigation() {
  const navigate = useNavigate();
  const { open } = useWeb3Modal();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const match = useMatch(`/:currentTab/*`);
  const currentTab = match?.params.currentTab;

  //get the state from the store
  const isAccountConnected = useAppSelector(selectAppIsConnected);

  const handleNavigate = (target: string) => {
    navigate(`/${target}`);
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
        isLoggedIn: !!address && isAccountConnected,
        address,
        onLoginClick: () => {
          open();
        },
        onLogoutClick: () => disconnect(),
      }}
    />
  );
}
