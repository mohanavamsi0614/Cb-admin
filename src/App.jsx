import './App.css'
import { Route, Routes } from 'react-router'
import Attd from './Attd'
import Home from './Home'

function App() {

  return (
    <Routes>
        <Route path="/" element={<Home />} />
      <Route path="/attd" element={<Attd />} />
      {/* <Route path='/marks' element={<Marks />} /> */}
    </Routes>

  )
}

export default App
