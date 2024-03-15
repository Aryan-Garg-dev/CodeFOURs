import { useState } from 'react'
import CreateEvent from './components/CreateEvent'
import Event from './components/Event'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <CreateEvent />
      {/* <Event /> */}
    </>
  )
}

export default App
