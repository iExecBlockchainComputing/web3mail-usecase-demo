import './App.css';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@iexec/react-ui-kit';
import {
  Navigate,
  NewProtectedData,
  ProtectedData,
  Consent,
  EmailDapp,
  SendEmail,
} from './features';
import { PROTECTED_DATA, CONSENT, SEND_MAIL, CREATE } from './config/path';

function App() {
  return (
    <div className="App">
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<Navigate />}>
            <Route path={`/${PROTECTED_DATA}`} element={<ProtectedData />} />
            <Route
              path={`/${PROTECTED_DATA}/${CONSENT}/:ProtectedDataId`}
              element={<Consent />}
            />
            <Route
              path={`/${PROTECTED_DATA}/${CREATE}`}
              element={<NewProtectedData />}
            />
            <Route path={`/${SEND_MAIL}`} element={<EmailDapp />} />
            <Route
              path={`/${SEND_MAIL}/:receiverAddress/:protectedDataAddress`}
              element={<SendEmail />}
            />
          </Route>
          <Route path="*" element={<Navigate />} />
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
