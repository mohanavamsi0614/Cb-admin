import './App.css'
import { Route, Routes } from 'react-router'
import Attd from './Attd'
import Home from './Home'
import Score from './score'
function App() {

  return (
    <Routes>
        <Route path="/" element={<Home />} />
      <Route path="/attd" element={<Attd />} />
      { <Route path='/marks' element={<Score />} /> }
    </Routes>

  )
}

export default App
