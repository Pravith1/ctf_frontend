import React, { useEffect, useState } from 'react';
import './scoreboard.css';
import CTFHeader from '../components/layout/CTFHeader';
import {
  connectLeaderboardSocket,
  onLeaderboardUpdate,
  onNewSolve,
  disconnectLeaderboardSocket
} from '../leaderboardSocket';
import { fetchLeaderboard, fetchLeaderboardByDifficulty } from '../api';

export default function Scoreboard() {
  const [top10, setTop10] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('🟦 Leaderboard: Setting up websocket subscription');
    connectLeaderboardSocket(() => {}, { auth: { token } });

    const unsub = onLeaderboardUpdate((payload) => {
      console.log('🟦 Leaderboard callback received:', payload);
      const list = payload?.data || payload?.top10 || payload || [];
      console.log('🟦 Leaderboard: Extracted list length:', Array.isArray(list) ? list.length : 'not-array');
      const normalized = (Array.isArray(list) ? list : []).map((p, idx) => ({
        rank: p.rank ?? idx + 1,
        username: p.team_name || p.username || p.name || p.handle || 'unknown',
        points: p.points ?? p.point ?? p.score ?? 0,
        verified: p.verified || false
      }));
      console.log('🟦 Leaderboard: Setting state with', normalized.length, 'entries');
      setTop10(normalized);
    });

    // Also listen to new_solve events and refresh leaderboard
    const unsubSolve = onNewSolve(async (payload) => {
      console.log('🟦 Leaderboard: New solve detected, refreshing leaderboard');
      try {
        const res = await fetchLeaderboardByDifficulty('beginner');
        const list = res?.data || res?.top10 || res || [];
        const normalized = (Array.isArray(list) ? list : []).map((p, idx) => ({
          rank: p.rank ?? idx + 1,
          username: p.team_name || p.username || p.name || p.handle || 'unknown',
          points: p.points ?? p.point ?? p.score ?? 0,
          verified: p.verified || false
        }));
        console.log('🟦 Leaderboard: Updated after new solve with', normalized.length, 'entries');
        setTop10(normalized);
      } catch (err) {
        console.warn('Failed to refresh leaderboard after new solve', err);
      }
    });

    // fetch initial leaderboard
    (async () => {
      try {
        console.log('🟦 Leaderboard: Fetching initial data');
        const res = await fetchLeaderboardByDifficulty('beginner');
        console.log('🟦 Leaderboard: Initial fetch result:', res);
        const list = res?.data || res?.top10 || res || [];
        const normalized = (Array.isArray(list) ? list : []).map((p, idx) => ({
          rank: p.rank ?? idx + 1,
          username: p.team_name || p.username || p.name || p.handle || 'unknown',
          points: p.points ?? p.point ?? p.score ?? 0,
          verified: p.verified || false
        }));
        console.log('🟦 Leaderboard: Initial state set with', normalized.length, 'entries');
        setTop10(normalized);
      } catch (err) {
        console.warn('Failed to fetch initial leaderboard', err);
      }
    })();

    return () => {
      console.log('🟦 Leaderboard: Cleaning up websocket subscription');
      if (typeof unsub === 'function') unsub();
      if (typeof unsubSolve === 'function') unsubSolve();
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