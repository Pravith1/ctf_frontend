import React from 'react';
import './scoreboard.css';
import CTFHeader from '../components/layout/CTFHeader';

export default function Scoreboard() {
  // Mock leaderboard data
  const leaderboard = [
    { rank: 142334, username: "dany19", country: null, points: 10 },
    { rank: "🏆", username: "alexanderanchishkin", country: "🇷🇺", points: 12120 },
    { rank: "🥈", username: "Gelly", country: null, points: 12010 },
    { rank: "🥉", username: "Lightwood13", country: "🇺🇦", points: 12010 },
    { rank: 4, username: "Rivit", country: "🇵🇱", points: 11950 },
    { rank: 5, username: "x3ric", country: "🇮🇹", points: 11380 },
    { rank: 6, username: "Superior", country: "🇲🇳", points: 11000 },
    { rank: 7, username: "mrmat15", country: "🇵🇱", points: 10930, verified: true },
    { rank: 8, username: "drgruff", country: "🇳🇴", points: 10680 },
    { rank: 9, username: "impulse", country: null, points: 10450 },
    { rank: 10, username: "bobo1239", country: null, points: 10260 },
    { rank: 11, username: "agula7171", country: "🇵🇱", points: 10030 },
    { rank: 12, username: "BlazerKun", country: "🇷🇺", points: 9780 },
    { rank: 13, username: "ebouteillon", country: "🇫🇷", points: 9740 },
  ];

  // Mock recent activity
  const recentActivity = [
    { username: "aditya15", action: "solved", challenge: "Gobustme ?", time: "11 minutes ago" },
    { username: "hyp3", action: "solved", challenge: "WOW.... So Meta", time: "11 minutes ago" },
    { username: "Shahidan101", action: "solved", challenge: "Adoni Assembler Chall", time: "16 minutes ago" },
    { username: "sdjnyty", action: "solved", challenge: "07601", time: "16 minutes ago" },
    { username: "ucup123", action: "solved", challenge: "Basic Injection", time: "20 minutes ago" },
    { username: "aditya15", action: "solved", challenge: "Basic Injection", time: "21 minutes ago" },
    { username: "hyp3", action: "rated", challenge: "Forensics 101", rating: "4 stars", time: "23 minutes ago" },
    { username: "hyp3", action: "solved", challenge: "Forensics 101", time: "24 minutes ago" },
    { username: "Shahidan101", action: "solved", challenge: "Reykjavik", time: "27 minutes ago" },
  ];

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
              {leaderboard.map((player, index) => (
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