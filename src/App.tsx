import { Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  return (
    <ThemeProvider>
      <div className="VITE_COMMIT_HASH hidden">
        {import.meta.env.VITE_COMMIT_HASH}
      </div>
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
          {/* default redirect */}
          <Route path="*" element={<Navigate to={`/${HOME}`} />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
