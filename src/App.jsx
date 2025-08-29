import './App.css'
import { Route, Routes } from 'react-router'
import Attd from './Attd'
import Home from './Home'
import Game from './comp/Game'
import FirstRound from './firstRound'
import SecondRound from './secondRound'
function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/attendance" element={<Attd />} />
      { <Route path='/marks' element={<Game />} /> }
      <Route path='/firstRound' element={<FirstRound/>}/>
      <Route path='/secondRound' element={<SecondRound/>}/>
    </Routes>
  
  )
}

export default App
