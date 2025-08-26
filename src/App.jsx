import './App.css'
import { Route, Routes } from 'react-router'
import Attd from './Attd'
import Home from './Home'
import Game from './Game'

function App() {

  return (
    <Routes>
        <Route path="/" element={<Home />} />
      <Route path="/attd" element={<Attd />} />
      <Route path='/game' element={<Game />} />
      {/* <Route path='/ps' element={} */}
    </Routes>
  
  )
}

export default App
