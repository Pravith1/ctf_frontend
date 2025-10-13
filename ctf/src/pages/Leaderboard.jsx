import React, { useEffect, useState } from 'react';
import './scoreboard.css';
import CTFHeader from '../components/layout/CTFHeader';
import {
  connectLeaderboardSocket,
  onLeaderboardUpdate,
  disconnectLeaderboardSocket
} from '../leaderboardSocket';
import { fetchLeaderboard, fetchLeaderboardByDifficulty } from '../api';

export default function Scoreboard() {
  const [top10, setTop10] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('🔌 Leaderboard: Connecting websocket with token:', token ? 'present' : 'missing');
    
    // connect and subscribe
    connectLeaderboardSocket(() => {
      console.log('✅ Leaderboard: Socket connected successfully');
    }, { auth: { token } });

    const difficulty = 'beginner';
    
    const unsub = onLeaderboardUpdate((payload) => {
      console.log('📥 Leaderboard: Received websocket update:', payload);
      
      // payload normalized: { difficulty, data, timestamp }
      // Only filter by difficulty if payload includes it, otherwise accept all updates
      if (payload?.difficulty && payload.difficulty !== difficulty) {
        console.log(`⏭️ Leaderboard: Skipping ${payload.difficulty} update (expecting ${difficulty})`);
        return;
      }
      
      const list = payload?.data || payload?.top10 || payload || [];
      console.log('📊 Leaderboard: Processing list with', list.length, 'entries');
      
      const normalized = (Array.isArray(list) ? list : []).slice(0, 50).map((p, idx) => ({
        rank: p.rank ?? idx + 1,
        username: p.team_name || p.username || p.name || p.user || p.handle || 'unknown',
        points: p.points ?? p.point ?? p.score ?? 0,
        verified: p.verified || false
      }));
      
      console.log('✅ Leaderboard: Setting', normalized.length, 'users');
      setTop10(normalized);
    });

    // fetch initial leaderboard once
    (async () => {
      try {
        console.log('🔄 Leaderboard: Fetching initial data for difficulty:', difficulty);
        const res = await fetchLeaderboardByDifficulty(difficulty);
        console.log('📥 Leaderboard: Initial fetch response:', res);
        
        const list = res?.data || res?.leaderboard || res || [];
        console.log('📊 Leaderboard: Initial list has', list.length, 'entries');
        
        const normalized = (Array.isArray(list) ? list : []).slice(0, 50).map((p, idx) => ({
          rank: p.rank ?? idx + 1,
          username: p.team_name || p.username || p.name || p.user || p.handle || 'unknown',
          points: p.points ?? p.point ?? p.score ?? 0,
          verified: p.verified || false
        }));
        
        console.log('✅ Leaderboard: Initial data set with', normalized.length, 'users');
        setTop10(normalized);
      } catch (err) {
        console.error('❌ Leaderboard: Failed to fetch initial leaderboard', err);
      }
    })();

    return () => {
      // unsubscribe only; keep socket for other pages if needed
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  return (
    <div className="scoreboard-page">
      <CTFHeader />
      <div className="scoreboard-container">
        {/* Leaderboard Table */}
        <div className="leaderboard-section">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th className="th-rank">Rank</th>
                <th className="th-user">User</th>
                <th className="th-points">Points</th>
              </tr>
            </thead>
            <tbody>
              {top10.map((player, index) => (
                <tr key={index} className="leaderboard-row">
                  <td className="td-rank">{player.rank}</td>
                  <td className="td-user">
                    {player.username}
                    {player.verified && <span className="verified-badge">💎</span>}
                  </td>
                  <td className="td-points">{player.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}