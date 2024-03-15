import { useState } from 'react'
import CreateEvent from './components/CreateEvent'
import Event from './components/Event'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './Pages/Signup'
import Signin from './Pages/Signin'
import Home from "./Pages/Home"


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/signin" element={<Signin />}></Route>
          <Route path="/home" element={<Home />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
