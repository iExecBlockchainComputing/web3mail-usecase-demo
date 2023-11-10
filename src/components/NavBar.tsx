/* WIP */
import { NavLink } from 'react-router-dom';
import '@fontsource/space-mono/700.css';
import iExecLogo from '@/assets/iexec-logo.svg';
import { PROTECTED_DATA, SEND_EMAIL } from '@/config/path.ts';

export default function NavBar() {
  return (
    <header className="flex h-[64px] items-center bg-grey-900 px-8 text-white">
      <div>
        <img src={iExecLogo} alt="iExec logo" />
      </div>

      <div
        className="ml-3 font-bold leading-5"
        style={{ fontFamily: 'Space Mono' }}
      >
        iExec
      </div>

      <div className="ml-20 flex gap-x-8">
        <NavLink
          to={`/${PROTECTED_DATA}`}
          className={({ isActive }) => (isActive ? 'font-bold' : '')}
        >
          My Protected Data
        </NavLink>
        <NavLink to={`/${SEND_EMAIL}`}>Send Email</NavLink>
      </div>
    </header>
  );
}
