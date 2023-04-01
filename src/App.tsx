import './App.css'
import { Routes, Route } from 'react-router-dom'
import {
  Naviguate,
  NewProtectedData,
  ProtectedData,
  Consent,
  Integration,
  EmailDapp,
  SendMessageTo,
} from './features'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Naviguate />}>
          <Route path="/protectedData" element={<ProtectedData />} />
          <Route
            path="/protectedData/consent/:ProtectedDataId"
            element={<Consent />}
          />
          <Route path="/newProtectedData" element={<NewProtectedData />} />
          <Route path="/integration" element={<Integration />} />
          <Route path="/integration/app/:appId" element={<EmailDapp />} />
          <Route path="/integration/app/:appId/sendMessageTo/:receiverId" element={<SendMessageTo />} />
        </Route>
        <Route path="*" element={<Naviguate />} />
      </Routes>
    </div>
  )
}

export default App
