import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LogOut } from 'react-feather';
import '@fontsource/space-mono/700.css';
import iExecLogo from '@/assets/iexec-logo.svg';
import { HOME, PROTECTED_DATA, SEND_EMAIL, SEND_TELEGRAM } from '@/config/path.ts';
import { useUser } from '@/components/NavBar/useUser.ts';
import AddressChip from '@/components/NavBar/AddressChip.tsx';
import { Button } from '@/components/ui/button.tsx';

export default function NavBar() {
  const location = useLocation();
  const { isConnected, address, isAccountConnected, login, logout } = useUser();

  const myProtectedDataLeft = 'left-0';
  const myProtectedDataWidth = 'w-[124px]';
  const sendEmailLeft = 'left-[157px]';
  const sendEmailWidth = 'w-[73px]';
  const sendTelegramLeft = 'left-[263px]';
  const sendTelegramWidth = 'w-[98px]';
  const [tabIndicatorLeft, setTabIndicatorLeft] = useState('');
  const [tabIndicatorWidth, setTabIndicatorWidth] = useState('');

  useEffect(() => {
    // FIRST tab is selected
    if (location.pathname.startsWith(`/${PROTECTED_DATA}`)) {
      setTabIndicatorLeft(myProtectedDataLeft);
      setTabIndicatorWidth(myProtectedDataWidth);
    }
    // SECOND tab is selected
    if (location.pathname.startsWith(`/${SEND_EMAIL}`)) {
      setTabIndicatorLeft(sendEmailLeft);
      setTabIndicatorWidth(sendEmailWidth);
    }
    // THIRD tab is selected
    if (location.pathname.startsWith(`/${SEND_TELEGRAM}`))  {
      setTabIndicatorLeft(sendTelegramLeft);
      setTabIndicatorWidth(sendTelegramWidth);
    }
  }, [location]);

  return (
    <header className="dark flex h-[64px] items-center bg-grey-900 px-8 text-white">
      <NavLink to={`/${HOME}`} className="-mx-2 flex h-full items-center p-2">
        <img src={iExecLogo} width="25" height="30" alt="iExec logo" />

        <div
          className="ml-3 font-bold leading-5"
          style={{ fontFamily: 'Space Mono' }}
        >
          iExec
        </div>
      </NavLink>

      <div className="relative ml-20 flex h-full items-center gap-x-8 pr-2 text-base">
        <NavLink
          to={`/${PROTECTED_DATA}`}
          className="-mx-2 flex h-full items-center p-2"
        >
          My Protected Data
        </NavLink>
        <NavLink
          to={`/${SEND_EMAIL}`}
          className="-mx-2 flex h-full items-center p-2"
        >
          Send Email
        </NavLink>
        <NavLink
          to={`/${SEND_TELEGRAM}`}
          className="-mx-2 flex h-full items-center p-2"
        >
          Send Telegram
        </NavLink>
        <div
          className={`absolute bottom-0 h-1 rounded-md bg-white transition-all duration-300 ${tabIndicatorLeft} ${tabIndicatorWidth}`}
        ></div>
      </div>

      {isConnected && isAccountConnected ? (
        <div className="flex flex-1 items-center justify-end gap-x-1">
          <AddressChip address={address!} />
          <button
            type="button"
            className="-mr-2 bg-grey-900 p-2"
            onClick={() => logout()}
          >
            <LogOut size="20" />
          </button>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-end">
          {/* w-[98px] = Match what's in react ui kit */}
          <Button
            size="sm"
            className="w-[98px]"
            onClick={() => {
              login();
            }}
          >
            Login
          </Button>
        </div>
      )}
    </header>
  );
}
