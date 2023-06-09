import './App.css';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@iexec/react-ui-kit';
import {
  Navigate,
  NewProtectedData,
  ProtectedData,
  Consent,
  EmailDapp,
  SendMessageTo,
} from './features';

function App() {
  return (
    <div className="App">
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<Navigate />}>
            <Route path="/protectedData" element={<ProtectedData />} />
            <Route
              path="/protectedData/consent/:ProtectedDataId"
              element={<Consent />}
            />
            <Route
              path="/protectedData/newProtectedData"
              element={<NewProtectedData />}
            />
            <Route path="/sendMail" element={<EmailDapp />} />
            <Route
              path="/sendMail/sendMessageTo/:receiverAddress/:protectedDataAddress"
              element={<SendMessageTo />}
            />
          </Route>
          <Route path="*" element={<Navigate />} />
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
