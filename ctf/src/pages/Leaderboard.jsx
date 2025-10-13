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
    // connect and subscribe
    connectLeaderboardSocket(() => {}, { auth: { token } });

    const difficulty = 'beginner';
    
    const unsub = onLeaderboardUpdate((payload) => {
      // payload normalized: { difficulty, data, timestamp }
      // Only filter by difficulty if payload includes it, otherwise accept all updates
      if (payload?.difficulty && payload.difficulty !== difficulty) return;
      
      const list = payload?.data || payload?.top10 || payload || [];
      const normalized = (Array.isArray(list) ? list : []).slice(0, 50).map((p, idx) => ({
        rank: p.rank ?? idx + 1,
        username: p.team_name || p.username || p.name || p.user || p.handle || 'unknown',
        points: p.points ?? p.point ?? p.score ?? 0,
        verified: p.verified || false
      }));
      setTop10(normalized);
    });

    // fetch initial leaderboard once
    (async () => {
      try {
        const res = await fetchLeaderboardByDifficulty(difficulty);
        const list = res?.data || res?.leaderboard || res || [];
        const normalized = (Array.isArray(list) ? list : []).slice(0, 50).map((p, idx) => ({
          rank: p.rank ?? idx + 1,
          username: p.team_name || p.username || p.name || p.user || p.handle || 'unknown',
          points: p.points ?? p.point ?? p.score ?? 0,
          verified: p.verified || false
        }));
        setTop10(normalized);
      } catch (err) {
        console.warn('Failed to fetch initial leaderboard', err);
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