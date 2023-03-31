import './App.css'
import { Routes, Route } from 'react-router-dom'
import { Naviguate, NewProtectedData, ProtectedData, Consent } from './features'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Naviguate />}>
          <Route path="/protectedData" element={<ProtectedData />} />
          <Route path="/newProtectedData" element={<NewProtectedData />} />
          <Route path="/consent/:ProtectedDataId" element={<Consent />} />
        </Route>
        <Route path="*" element={<Naviguate />} />
      </Routes>
    </div>
  )
}

export default App
