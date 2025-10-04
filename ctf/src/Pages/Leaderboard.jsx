import React, { useState, useEffect } from "react";
import "./styles/Leaderboard.css";

export default function Leaderboard() {
  const [top10, setTop10] = useState([]);

  useEffect(() => {
    setTop10(mockTop10());
  }, []);

  return (
    <div className="page-root">
      <div className="leaderboard-wrapper">
        <div className="leaderboard-container">
          <header className="leaderboard-title">
            <span className="trophy">🏆</span>
            <h1>CTF Leaderboard</h1>
          </header>

          <main className="leaderboard-main">
            <section className="challenge-card">
              <h2>
                Top Players <span className="points">Leaderboard</span>
              </h2>

              <p style={{ color: "#cfcfcf", marginTop: 8 }}>
                This board shows the top players. All times shown are in IST.
              </p>

              <ol className="leaderboard-list">
                {top10.map((u, i) => (
                  <li key={u.handle} className="leaderboard-item">
                    <div className="rank">{i + 1}</div>
                    <div className="user-info">
                      <div className="handle">{u.handle}</div>
                    </div>
                    <div className="points-value">{u.points}</div>
                  </li>
                ))}
              </ol>

              <div className="footer">
                <div>{(64744).toLocaleString()} solves</div>
              </div>
            </section>

            <aside className="sidebar">
              <div className="top10-card">
                <h3>Top 10</h3>
                <ol>
                  {top10.map((u, i) => (
                    <li key={u.handle + "-side"}>
                      <span>{i + 1}. {u.handle}</span>
                      <span>{u.points}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>
          </main>
        </div>
      </div>
    </div>
  );
}

function mockTop10() {
  return [
    { handle: "natjef20", points: 9200 },
    { handle: "javier", points: 8700 },
    { handle: "drmad", points: 8200 },
    { handle: "limyunkai19", points: 7800 },
    { handle: "sebwit20", points: 7400 },
    { handle: "yukimo", points: 7000 },
    { handle: "teamaardvark", points: 6500 },
    { handle: "witchcraft", points: 6200 },
    { handle: "aiyam", points: 6000 },
    { handle: "blackndoor", points: 5900 },
  ];
}