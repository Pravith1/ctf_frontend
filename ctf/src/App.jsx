import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Leaderboard from './Pages/Leaderboard';
import ArenaLogin from './Pages/LoginPage.jsx'
import Admin from './Pages/Admin.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ArenaLogin />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
