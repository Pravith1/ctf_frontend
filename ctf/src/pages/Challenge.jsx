import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CTFHeader from '../components/layout/CTFHeader';
import './chalenge.css';

const ChallengesPage = () => {
  const navigate = useNavigate();
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [solvedFilter, setSolvedFilter] = useState('Unsolved');
  const [orderFilter, setOrderFilter] = useState('Most Solves');
  const [searchQuery, setSearchQuery] = useState('');

  const challenges = [
    {
      id: 1,
      title: 'Practice Flag',
      difficulty: 'Easy',
      points: 10,
      comments: 872,
      rating: 4.12,
      category: 'Miscellaneous',
      author: 'intelgent',
      solves: 100617,
      description: 'Learn the basics of CTF challenges by submitting your first flag.',
      linkText: 'link',
      linkUrl: '#',
      additionalInfo: "Don't know where to begin? Check out CTFlearn's",
      additionalLinkText: 'Getting Started Guide',
      additionalLinkUrl: '#',
      tags: ['Beginner', 'Practice']
    },
    {
      id: 2,
      title: 'Basic Injection',
      difficulty: 'Easy',
      points: 30,
      comments: 969,
      rating: 4.61,
      category: 'Web',
      author: 'intelgent',
      solves: 64742,
      description: 'See if you can leak the whole database using what you know about SQL Injections.',
      linkText: 'link',
      linkUrl: '#',
      additionalInfo: "Don't know where to begin? Check out CTFlearn's",
      additionalLinkText: 'SQL Injection Lab',
      additionalLinkUrl: '#',
      tags: ['Web', 'intelgent']
    },
    {
      id: 3,
      title: 'Forensics 101',
      difficulty: 'Easy',
      points: 30,
      comments: 500,
      rating: 4.49,
      category: 'Forensics',
      author: 'intelgent',
      solves: 49558,
      description: 'Analyze the provided file to extract hidden information.',
      linkText: 'download file',
      linkUrl: '#',
      additionalInfo: "Need help with forensics? Visit",
      additionalLinkText: 'Forensics Guide',
      additionalLinkUrl: '#',
      tags: ['Forensics', 'intelgent']
    },
    {
      id: 4,
      title: 'Character Encoding',
      difficulty: 'Easy',
      points: 20,
      comments: 338,
      rating: 4.40,
      category: 'Cryptography',
      author: 'dkn11902',
      solves: 46048,
      description: 'Decode the message using various character encoding schemes.',
      linkText: 'view cipher',
      linkUrl: '#',
      additionalInfo: "Learn more about encoding at",
      additionalLinkText: 'Crypto Basics',
      additionalLinkUrl: '#',
      tags: ['Cryptography', 'Encoding']
    },
    {
      id: 5,
      title: 'Taking LS',
      difficulty: 'Easy',
      points: 10,
      comments: 420,
      rating: 3.91,
      category: 'Miscellaneous',
      author: 'intelgent',
      solves: 38420,
      description: 'Navigate through the Linux file system to find the hidden flag.',
      linkText: 'connect',
      linkUrl: '#',
      additionalInfo: "New to Linux? Check out",
      additionalLinkText: 'Linux Command Guide',
      additionalLinkUrl: '#',
      tags: ['Linux', 'Miscellaneous']
    },
    {
      id: 6,
      title: 'Base 2 2 the 6',
      difficulty: 'Easy',
      points: 20,
      comments: 245,
      rating: 4.22,
      category: 'Cryptography',
      author: 'intelgent',
      solves: 35678,
      description: 'Decode the base64 encoded message to reveal the flag.',
      linkText: 'view encoded text',
      linkUrl: '#',
      additionalInfo: "Learn about base encoding at",
      additionalLinkText: 'Encoding Guide',
      additionalLinkUrl: '#',
      tags: ['Cryptography', 'Base64']
    }
  ];

  const handleChallengeClick = (challenge) => {
    navigate(`/challenge/${challenge.id}`, { state: { challenge } });
  };

  return (
    <div className="ctflearn-container">
      <CTFHeader />

      <main className="main-content">
        <div className="filters-section">
          <div className="filter-row">
            <div className="filter-group">
              <label>Category</label>
              <select 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="filter-select"
              >
                <option>All</option>
                <option>Web</option>
                <option>Cryptography</option>
                <option>Forensics</option>
                <option>Miscellaneous</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Difficulty</label>
              <select 
                value={difficultyFilter} 
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="filter-select"
              >
                <option>All</option>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Solved</label>
              <select 
                value={solvedFilter} 
                onChange={(e) => setSolvedFilter(e.target.value)}
                className="filter-select"
              >
                <option>Unsolved</option>
                <option>Solved</option>
                <option>All</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Order</label>
              <select 
                value={orderFilter} 
                onChange={(e) => setOrderFilter(e.target.value)}
                className="filter-select"
              >
                <option>Most Solves</option>
                <option>Least Solves</option>
                <option>Highest Rated</option>
                <option>Most Recent</option>
              </select>
            </div>
          </div>
        </div>

        <div className="challenges-grid">
          {challenges.map((challenge) => (
            <div 
              key={challenge.id} 
              className="challenge-card"
              onClick={() => handleChallengeClick(challenge)}
              style={{ cursor: 'pointer' }}
            >
              <div className="card-header">
                <h3 className="challenge-title">{challenge.title}</h3>
                <span className="difficulty-badge">{challenge.difficulty}</span>
              </div>

              <div className="card-stats">
                <div className="stat">
                  <span className="stat-value">{challenge.points}</span>
                  <span className="stat-label">points</span>
                </div>
              </div>

              <div className="card-footer">
                <div className="challenge-meta">
                  <span className="category">{challenge.category}</span>
                  <span className="separator">·</span>
                </div>
                <div className="solves">{challenge.solves.toLocaleString()} solves</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ChallengesPage;