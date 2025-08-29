// App.js
import './App.css';
import { Route, Routes } from 'react-router';
import Attd from './Attd';
import Home from './Home';
import Game from './Game';
import FirstRound from './firstRound';
import SecondRound from './secondRound';
import EventUp from './EventUpdatre';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Accessible by all roles */}
      <Route path="/" element={<ProtectedRoute element={<Home />} allowedRoles={['admin', 'org', 'guest']} />} />

      {/* Admin and Organizer only */}
      <Route path="/attendance" element={<ProtectedRoute element={<Attd />} allowedRoles={['admin', 'org']} />} />
      <Route path="/eventupdates" element={<ProtectedRoute element={<EventUp />} allowedRoles={['admin', 'org']} />} />

      {/* Admin only */}
      <Route path="/marks" element={<ProtectedRoute element={<Game />} allowedRoles={['admin']} />} />
      <Route path="/firstRound" element={<ProtectedRoute element={<FirstRound />} allowedRoles={['admin']} />} />
      <Route path="/secondRound" element={<ProtectedRoute element={<SecondRound />} allowedRoles={['admin']} />} />
      <Route path="/game" element={<ProtectedRoute element={<Game />} allowedRoles={['admin']} />} />
    </Routes>
  );
}

export default App;
