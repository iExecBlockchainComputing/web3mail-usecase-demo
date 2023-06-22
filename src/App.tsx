import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@iexec/react-ui-kit';
import {
  Navigation,
  NewProtectedData,
  ProtectedData,
  Consent,
  EmailDapp,
  SendEmail,
  LoginGuard,
} from './features';
import {
  PROTECTED_DATA,
  CONSENT,
  SEND_MAIL,
  CREATE,
  HOME,
} from './config/path';

function App() {
  return (
    <div className="App">
      <ThemeProvider>
        <Navigation />
        <Routes>
          <Route
            path={`/${PROTECTED_DATA}`}
            element={
              <LoginGuard>
                <ProtectedData />
              </LoginGuard>
            }
          />
          <Route
            path={`/${PROTECTED_DATA}/${CONSENT}/:ProtectedDataId`}
            element={
              <LoginGuard>
                <Consent />
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
            path={`/${SEND_MAIL}`}
            element={
              <LoginGuard>
                <EmailDapp />
              </LoginGuard>
            }
          />
          <Route
            path={`/${SEND_MAIL}/:receiverAddress/:protectedDataAddress`}
            element={
              <LoginGuard>
                <SendEmail />
              </LoginGuard>
            }
          />
          {/* default redirect */}
          <Route path="*" element={<Navigate to={`/${HOME}`} />} />
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
