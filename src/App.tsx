import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from '@/components/NavBar/NavBar.tsx';
import LoginGuard from '@/features/loginGuard/LoginGuard.tsx';
import MyProtectedData from '@/features/myProtectedData/MyProtectedData.tsx';
import CreateProtectedData from '@/features/myProtectedData/createProtectedData/CreateProtectedData.tsx';
import OneProtectedData from '@/features/myProtectedData/oneProtectedData/OneProtectedData.tsx';
import MyEmailContacts from '@/features/sendEmail/SendEmail.tsx';
import SendEmailForm from '@/features/sendEmail/SendEmailForm.tsx';
import { useWatchWagmiAccount } from '@/utils/watchWagmiAccount.ts';

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
                <CreateProtectedData />
              </LoginGuard>
            }
          />
          <Route
            path="send-email"
            element={
              <LoginGuard>
                <MyEmailContacts />
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
