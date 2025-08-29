import './App.css'
import { Route, Routes } from 'react-router'
import Attd from './Attd'
import Home from './Home'
import Game from './Game'
import FirstRound from './firstRound'
import SecondRound from './secondRound'
import EventUp from './EventUpdatre'
function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/attendance" element={<Attd />} />
      { <Route path='/marks' element={<Game />} /> }
      <Route path='/firstRound' element={<FirstRound/>}/>
      <Route path='/secondRound' element={<SecondRound/>}/>
      <Route path='/game' element={<Game/>}/>
      <Route path='/eventupdates' element={<EventUp/>}/>
    </Routes>
  
  )
}

export default App
