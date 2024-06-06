import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAccount, useNetwork } from 'wagmi';
import NavBar from '@/components/NavBar/NavBar.tsx';
import {
  NewProtectedData,
  MyProtectedData,
  OneProtectedData,
  SendEmail,
  SendEmailForm,
  LoginGuard,
  SendTelegram,
  SendTelegramForm,
} from './features';
import {
  PROTECTED_DATA,
  CONSENT,
  SEND_EMAIL,
  SEND_TELEGRAM,
  CREATE,
  HOME,
} from './config/path';
import { store } from '@/app/store.ts';
import { initSDK } from '@/app/appSlice.ts';

function App() {
  const { connector } = useAccount();
  const { chain } = useNetwork();

  useEffect(() => {
    if (!connector) {
      return;
    }
    store.dispatch(initSDK({ connector }));
  }, [connector, chain]);

  return (
    <div className="App">
      <NavBar />
      <div className="mx-auto mt-12 w-[80%] max-w-6xl">
        <Routes>
          <Route
            path={`/${PROTECTED_DATA}`}
            element={
              <LoginGuard>
                <MyProtectedData />
              </LoginGuard>
            }
          />
          <Route
            path={`/${PROTECTED_DATA}/${CONSENT}/:ProtectedDataId`}
            element={
              <LoginGuard>
                <OneProtectedData />
              </LoginGuard>
            }
          />
          <Route
            path={`/${PROTECTED_DATA}/${CREATE}`}
            element={
              <LoginGuard>
                <NewProtectedData />
              </LoginGuard>
            }
          />
          <Route
            path={`/${SEND_EMAIL}`}
            element={
              <LoginGuard>
                <SendEmail />
              </LoginGuard>
            }
          />
          <Route
            path={`/${SEND_EMAIL}/:receiverAddress/:protectedDataAddress`}
            element={
              <LoginGuard>
                <SendEmailForm />
              </LoginGuard>
            }
          />
          <Route
            path={`/${SEND_TELEGRAM}`}
            element={
              <LoginGuard>
                <SendTelegram />
              </LoginGuard>
            }
          />
          <Route
            path={`/${SEND_TELEGRAM}/:receiverAddress/:protectedDataAddress`}
            element={
              <LoginGuard>
                <SendTelegramForm />
              </LoginGuard>
            }
          />
          {/* default redirect */}
          <Route path="*" element={<Navigate to={`/${HOME}`} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
