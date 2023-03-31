import './App.css'
import { Routes, Route } from 'react-router-dom'
import { Naviguate, NewProtectedData, ProtectedData, Consent } from './features'

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
        </Route>
        <Route path="*" element={<Naviguate />} />
      </Routes>
    </div>
  )
}

export default App
