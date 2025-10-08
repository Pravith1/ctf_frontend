import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css'
import Leaderboard from './pages/Leaderboard.jsx';
import ArenaLogin from './pages/LoginPage.jsx'
import Admin from './pages/Admin.jsx'
import AnswerSolving from './pages/AnswerSolving.jsx'
import ChallengesPage from './pages/Challenge.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<ArenaLogin />} />
      <Route 
        path="/leaderboard" 
        element={
          <ProtectedRoute>
            <Leaderboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/challenge" 
        element={
          <ProtectedRoute>
            <ChallengesPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/challenge/:id" 
        element={
          <ProtectedRoute>
            <AnswerSolving />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute adminOnly={true}>
            <Admin />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/learn" 
        element={
          <ProtectedRoute>
            <div style={{ background: '#0f0f0f', minHeight: '100vh', color: '#fff', padding: '20px' }}>
              <h1>Learn Page - Coming Soon</h1>
            </div>
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;
