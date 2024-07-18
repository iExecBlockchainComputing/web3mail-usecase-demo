import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from '@/components/NavBar/NavBar.tsx';
import { useWatchWagmiAccount } from '@/utils/watchWagmiAccount.ts';
import {
  NewProtectedData,
  MyProtectedData,
  OneProtectedData,
  SendEmail,
  SendEmailForm,
  LoginGuard,
} from './features';

function App() {
  useWatchWagmiAccount();

  return (
    <div className="App">
      <NavBar />
      <div className="mx-auto mt-12 w-[80%] max-w-6xl">
        <Routes>
          <Route
            path="protected-data"
            element={
              <LoginGuard>
                <MyProtectedData />
              </LoginGuard>
            }
          />
          <Route
            path="/protected-data/consent/:protectedDataAddress"
            element={
              <LoginGuard>
                <OneProtectedData />
              </LoginGuard>
            }
          />
          <Route
            path="/protected-data/create"
            element={
              <LoginGuard>
                <NewProtectedData />
              </LoginGuard>
            }
          />
          <Route
            path="send-email"
            element={
              <LoginGuard>
                <SendEmail />
              </LoginGuard>
            }
          />
          <Route
            path="/send-email/:receiverAddress/:protectedDataAddress"
            element={
              <LoginGuard>
                <SendEmailForm />
              </LoginGuard>
            }
          />
          {/* default redirect */}
          <Route path="*" element={<Navigate to="protected-data" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
