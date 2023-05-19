import './App.css';
import { Routes, Route } from 'react-router-dom';
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
            path="/sendMail/sendMessageTo/:receiverId"
            element={<SendMessageTo />}
          />
        </Route>
        <Route path="*" element={<Navigate />} />
      </Routes>
    </div>
  );
}

export default App;
