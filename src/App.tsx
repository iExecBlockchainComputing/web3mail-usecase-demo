import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAccount, useNetwork } from 'wagmi';
import { ThemeProvider } from '@iexec/react-ui-kit';
import NavBar from '@/components/NavBar/NavBar.tsx';
import {
  NewProtectedData,
  MyProtectedData,
  OneProtectedData,
  SendEmail,
  SendEmailForm,
  LoginGuard,
} from './features';
import {
  PROTECTED_DATA,
  CONSENT,
  SEND_EMAIL,
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
      <ThemeProvider>
        <NavBar />
        <div className="mx-auto mt-12 w-[80%] max-w-6xl">
          <LoginGuard>
            <Routes>
              <Route
                path={`/${PROTECTED_DATA}`}
                element={<MyProtectedData />}
              />
              <Route
                path={`/${PROTECTED_DATA}/${CONSENT}/:ProtectedDataId`}
                element={<OneProtectedData />}
              />
              <Route
                path={`/${PROTECTED_DATA}/${CREATE}`}
                element={<NewProtectedData />}
              />
              <Route path={`/${SEND_EMAIL}`} element={<SendEmail />} />
              <Route
                path={`/${SEND_EMAIL}/:receiverAddress/:protectedDataAddress`}
                element={<SendEmailForm />}
              />
              {/* default redirect */}
              <Route path="*" element={<Navigate to={`/${HOME}`} />} />
            </Routes>
          </LoginGuard>
        </div>
      </ThemeProvider>
    </div>
  );
}

export default App;
