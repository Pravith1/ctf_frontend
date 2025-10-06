import React, { useState } from 'react';
import CTFHeader from '../components/layout/CTFHeader';
import { useAuth } from '../context/AuthContext';

export default function AnswerSolving() {
  const { user } = useAuth();
  
  const [challengeConfig] = useState({
    title: "Basic Injection",
    points: 30,
    difficulty: "Easy",
    category: "Web",
    categoryIcon: "🌐",
    description: "See if you can leak the whole database using what you know about SQL Injections.",
    linkText: "link",
    linkUrl: "#",
    additionalInfo: "Don't know where to begin? Check out CTFlearn's",
    additionalLinkText: "SQL Injection Lab",
    additionalLinkUrl: "#",
    solves: 64744,
    tags: ["Web", "intelgent"]
  });

  const [flagInput, setFlagInput] = useState('CTFlearn{h4cK3d}');
  
  // Mock top 10 players
  const top10 = [
    { rank: 1, name: "natjef20" },
    { rank: 2, name: "javier" },
    { rank: 3, name: "drmad" },
    { rank: 4, name: "limyunkai19" },
    { rank: 5, name: "sebwit20" },
    { rank: 6, name: "yukimo" },
    { rank: 7, name: "teamaardvark" },
    { rank: 8, name: "witchcraft" },
    { rank: 9, name: "aiyam" },
    { rank: 10, name: "blackndoor" },
  ];

  const handleSubmit = () => {
    if (flagInput.trim()) {
      alert(`Flag submitted: ${flagInput}`);
    } else {
      alert('Please enter a flag');
    }
  };

  return (
    <div style={{ background: '#0f0f0f', minHeight: '100vh' }}>
      <CTFHeader />
      <div style={{ 
        display: 'flex', 
        gap: '24px', 
        padding: '24px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Main Challenge Card */}
        <div style={{ 
          flex: 1,
          background: '#2a2e35',
          borderRadius: '0',
          padding: '32px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header with title, points, and difficulty */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            marginBottom: '24px'
          }}>
            <h1 style={{ 
              color: '#fff', 
              fontSize: '28px', 
              fontWeight: '600',
              margin: 0
            }}>
              {challengeConfig.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                background: '#10b981',
                color: '#fff',
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '600'
              }}>
                {challengeConfig.difficulty}
              </div>
              <div style={{
                color: '#fff',
                fontSize: '18px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                ⏱️ {challengeConfig.points} points
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={{ flex: 1, marginBottom: '24px' }}>
            <p style={{ 
              color: '#d1d5db', 
              fontSize: '16px', 
              lineHeight: '1.6',
              marginBottom: '16px'
            }}>
              {challengeConfig.description}
            </p>
            
            <a href={challengeConfig.linkUrl} style={{
              color: '#3b82f6',
              textDecoration: 'underline',
              fontSize: '16px',
              display: 'inline-block',
              marginBottom: '12px'
            }}>
              🔗 {challengeConfig.linkText}
            </a>

            <p style={{ 
              color: '#d1d5db', 
              fontSize: '15px',
              marginTop: '16px'
            }}>
              {challengeConfig.additionalInfo}{' '}
              <a href={challengeConfig.additionalLinkUrl} style={{
                color: '#3b82f6',
                textDecoration: 'underline'
              }}>
                {challengeConfig.additionalLinkText}
              </a>
            </p>
          </div>

          {/* Flag submission */}
          <div style={{ marginTop: 'auto' }}>
            <div style={{ 
              display: 'flex', 
              gap: '12px',
              marginBottom: '16px'
            }}>
              <div style={{
                flex: 1,
                background: '#fff',
                borderRadius: '0',
                display: 'flex',
                overflow: 'hidden',
                border: '1px solid #d1d5db'
              }}>
                <div style={{
                  background: '#f3f4f6',
                  padding: '12px 16px',
                  borderRight: '1px solid #d1d5db',
                  color: '#374151',
                  fontWeight: '500',
                  fontSize: '15px'
                }}>
                  Flag
                </div>
                <input 
                  type="text"
                  value={flagInput}
                  onChange={(e) => setFlagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="flag{your_answer_here}"
                  style={{
                    flex: 1,
                    border: 'none',
                    padding: '12px 16px',
                    fontSize: '15px',
                    color: '#6b7280',
                    outline: 'none',
                    background: '#fff'
                  }}
                />
              </div>
              <button 
                onClick={handleSubmit}
                style={{
                  background: '#fff',
                  color: '#000',
                  border: '1px solid #d1d5db',
                  padding: '12px 32px',
                  borderRadius: '0',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#2a2e35';
                  e.target.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#fff';
                  e.target.style.color = '#000';
                }}
              >
                Submit
              </button>
            </div>

            {/* Tags and solve count */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '16px',
              borderTop: '1px solid #374151'
            }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {challengeConfig.tags.map((tag, i) => (
                  <span key={i} style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    color: '#3b82f6',
                    padding: '4px 12px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
              <span style={{ 
                color: '#9ca3af', 
                fontSize: '14px' 
              }}>
                {challengeConfig.solves.toLocaleString()} solves
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ 
          width: '340px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {/* Top 10 */}
          <div style={{
            background: '#2a2e35',
            borderRadius: '0',
            padding: '24px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
            minHeight: '600px'
          }}>
            <h3 style={{ 
              color: '#fff', 
              fontSize: '18px', 
              fontWeight: '600',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              Top10
            </h3>
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {top10.map((player) => (
                <div key={player.rank} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: '#d1d5db',
                  fontSize: '15px',
                  padding: '12px 16px',
                  background: '#33383f',
                  borderRadius: '6px',
                  transition: 'all 0.2s'
                }}>
                  <span style={{ 
                    fontWeight: '700',
                    color: '#667eea',
                    minWidth: '24px'
                  }}>{player.rank}</span>
                  <span style={{ flex: 1 }}>{player.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}