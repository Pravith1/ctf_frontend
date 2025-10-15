import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import CTFHeader from '../components/layout/CTFHeader';
import { useAuth } from '../context/AuthContext';
import { submitAnswer, fetchQuestionDetails, checkQuestionSolved, fetchLeaderboard, fetchLeaderboardByDifficulty } from '../api';
import { connectLeaderboardSocket, onLeaderboardUpdate, disconnectLeaderboardSocket } from '../leaderboardSocket';


export default function AnswerSolving() {
  const { user } = useAuth();
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Get challenge data from navigation state or fetch from backend
  const passedChallenge = location.state?.challenge;
  
  const [challengeConfig, setChallengeConfig] = useState(null);
  const [flagInput, setFlagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [isSolved, setIsSolved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showHint, setShowHint] = useState(false);
  
  // Fetch question details and solved status on mount
  useEffect(() => {
    const loadQuestionData = async () => {
      try {
        setLoading(true);
        
        // Use passed challenge or fetch from backend
        if (passedChallenge) {
          
          // TEMPORARILY: Always fetch from backend to see console.log and verify hint data
          console.log('🔍 AnswerSolving: Also fetching from backend to verify hint data...');
          let backendData = null;
          try {
            const questionResponse = await fetchQuestionDetails(passedChallenge._id || id);
            console.log('🔍 AnswerSolving: Backend response for verification:', questionResponse);
            console.log('🔍 AnswerSolving: Backend response structure:', {
              success: questionResponse.success,
              data: questionResponse.data,
              dataKeys: questionResponse.data ? Object.keys(questionResponse.data) : 'no data',
              linkField: questionResponse.data?.link,
              linkType: typeof questionResponse.data?.link
            });
            backendData = questionResponse.data;
          } catch (err) {
            console.log('🔍 AnswerSolving: Backend fetch failed:', err);
          }
          
          // Ensure the passed challenge has the link fields properly mapped
          // Use backend data for link if available, fallback to navigation data
          const normalizedChallenge = {
            ...passedChallenge,
            linkText: (backendData?.link || passedChallenge.link) ? 'Download File' : null,
            linkUrl: backendData?.link || passedChallenge.link || null,
            hint: backendData?.hint || passedChallenge.hint || null
          };
          
          console.log('🔍 AnswerSolving: Normalized challenge data:', {
            originalLink: passedChallenge.link,
            backendLink: backendData?.link,
            finalLinkText: normalizedChallenge.linkText,
            finalLinkUrl: normalizedChallenge.linkUrl,
            hint: normalizedChallenge.hint,
            passedChallengeKeys: Object.keys(passedChallenge),
            passedChallengeData: passedChallenge
          });
          
          setChallengeConfig(normalizedChallenge);
          
          // Check if question is solved
          const solvedResponse = await checkQuestionSolved(passedChallenge._id || id);
          setIsSolved(solvedResponse.data?.isSolved || false);
        } else if (id) {
          // Fetch question details from backend
          const questionResponse = await fetchQuestionDetails(id);
          console.log('🔍 AnswerSolving: Direct backend fetch response:', questionResponse);
          
          if (questionResponse.success) {
            const question = questionResponse.data;
            console.log('🔍 AnswerSolving: Question data from backend:', {
              questionKeys: Object.keys(question),
              link: question.link,
              linkType: typeof question.link,
              hint: question.hint,
              hintType: typeof question.hint,
              fullQuestion: question
            });
            
            const configObj = {
              _id: question._id,
              id: question._id,
              title: question.title,
              description: question.description,
              points: question.point,
              difficulty: question.difficulty,
              category: question.categoryId?.name || 'General',
              solves: question.solved_count || 0,
              year: question.year,
              linkText: question.link ? 'Download File' : null,
              linkUrl: question.link,
              hint: question.hint || null
            };
            
            console.log('🔍 AnswerSolving: Configured object for backend data:', configObj);
            
            setChallengeConfig(configObj);
          }
          
          // Check if question is solved
          const solvedResponse = await checkQuestionSolved(id);
          setIsSolved(solvedResponse.data?.isSolved || false);
        }
      } catch (error) {
        setSubmitResult({ 
          success: false, 
          message: 'Failed to load question details' 
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadQuestionData();
  }, [id, passedChallenge]);
  
  const [top10, setTop10] = useState([]);

  // Subscribe to leaderboard updates (top 10)
  useEffect(() => {
    const token = localStorage.getItem('token');
    connectLeaderboardSocket(() => {}, { auth: { token } });

    const unsub = onLeaderboardUpdate((payload) => {
      // If payload has difficulty and we have a challenge difficulty, only update matching difficulty
      if (payload?.difficulty && challengeConfig?.difficulty && payload.difficulty !== challengeConfig.difficulty) return;

      const list = payload?.data || payload?.top10 || payload || [];
      const normalized = (Array.isArray(list) ? list : []).slice(0, 10).map((p, idx) => ({
        rank: p.rank ?? idx + 1,
        username: p.team_name || p.username || p.name || p.handle || 'unknown',
        points: p.points ?? p.point ?? p.score ?? 0,
        verified: p.verified || false
      }));
      setTop10(normalized);
    });

    // fetch initial leaderboard for the challenge difficulty if available
    (async () => {
      try {
        let res;
        if (challengeConfig?.difficulty) {
          res = await fetchLeaderboardByDifficulty(challengeConfig.difficulty);
        } else {
          res = await fetchLeaderboard();
        }
        const list = res?.data || res?.top10 || res || [];
        const normalized = (Array.isArray(list) ? list : []).slice(0, 10).map((p, idx) => ({
          rank: p.rank ?? idx + 1,
          username: p.team_name || p.username || p.name || p.handle || 'unknown',
          points: p.points ?? p.point ?? p.score ?? 0,
          verified: p.verified || false
        }));
        setTop10(normalized);
      } catch (err) {
        // Silent fail for initial leaderboard fetch
      }
    })();

    return () => {
      if (typeof unsub === 'function') unsub();
      // optional: disconnectLeaderboardSocket(); // keep connection for other pages
    };
  }, [challengeConfig?.difficulty]);

  const handleSubmit = async () => {
    if (isSolved) {
      setSubmitResult({ success: false, message: 'You have already solved this question!' });
      return;
    }

    if (!flagInput.trim()) {
      setSubmitResult({ success: false, message: 'Please enter a flag' });
      return;
    }

    try {
      setSubmitting(true);
      setSubmitResult(null);
      
      const response = await submitAnswer({
        question_id: challengeConfig._id || challengeConfig.id,
        submitted_answer: flagInput.trim()
      });

      if (response.success) {
        setSubmitResult({
          success: response.isCorrect,
          message: response.message,
          pointsAwarded: response.pointsAwarded,
          totalScore: response.totalScore
        });
        
        if (response.isCorrect) {
          setFlagInput(''); // Clear input on correct answer
          setIsSolved(true); // Mark as solved
          // fetch latest leaderboard after a correct submission to get immediate update
          try {
            let lb;
            if (challengeConfig?.difficulty) {
              lb = await fetchLeaderboardByDifficulty(challengeConfig.difficulty);
            } else {
              lb = await fetchLeaderboard();
            }
            const list = lb?.data || lb?.top10 || lb || [];
            const normalized = (Array.isArray(list) ? list : []).slice(0, 10).map((p, idx) => ({
              rank: p.rank ?? idx + 1,
              username: p.team_name || p.username || p.name || p.handle || 'unknown',
              points: p.points ?? p.point ?? p.score ?? 0,
              verified: p.verified || false
            }));
            setTop10(normalized);
          } catch (err) {
            // Silent fail for leaderboard refresh after submission
          }
        }
      } else {
        setSubmitResult({ success: false, message: response.message });
      }
    } catch (error) {
      setSubmitResult({ 
        success: false, 
        message: error.response?.data?.message || 'Submission failed. Please try again.' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading state while fetching question
  if (loading) {
    return (
      <div style={{ background: '#0f0f0f', minHeight: '100vh' }}>
        <CTFHeader />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 80px)',
          color: '#fff'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
            <p>Loading question...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error if question not found
  if (!challengeConfig) {
    return (
      <div style={{ background: '#0f0f0f', minHeight: '100vh' }}>
        <CTFHeader />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 80px)',
          color: '#fff'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
            <p>Question not found</p>
          </div>
        </div>
      </div>
    );
  }

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
          {/* Back Button */}
          <button
            onClick={() => navigate('/challenges')}
            style={{
              background: 'transparent',
              border: '1px solid #4b5563',
              color: '#d1d5db',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
              alignSelf: 'flex-start'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#374151';
              e.target.style.borderColor = '#6b7280';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.borderColor = '#4b5563';
            }}
          >
            ← Back to Challenges
          </button>
          
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
              {challengeConfig.difficulty && (
                <div style={{
                  background: '#10b981',
                  color: '#fff',
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  textTransform: 'capitalize'
                }}>
                  {challengeConfig.difficulty}
                </div>
              )}
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
            
            {/* DEBUG: Link display information */}
            {console.log('🔍 AnswerSolving: Link display check:', {
              linkText: challengeConfig.linkText,
              linkUrl: challengeConfig.linkUrl,
              willShow: !!(challengeConfig.linkText && challengeConfig.linkUrl)
            })}
            
            {challengeConfig.linkText && challengeConfig.linkUrl && (
              <a href={challengeConfig.linkUrl} style={{
                color: '#3b82f6',
                textDecoration: 'underline',
                fontSize: '16px',
                display: 'inline-block',
                marginBottom: '12px'
              }}>
                🔗 {challengeConfig.linkText}
              </a>
            )}

            {/* Hint Button - Only show for year 1 and 2 */}
            {challengeConfig.hint && challengeConfig.year && (challengeConfig.year === 1 || challengeConfig.year === 2) && (
              <button
                onClick={() => setShowHint(!showHint)}
                style={{
                  background: showHint ? '#f59e0b' : '#10b981',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '16px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.opacity = '0.8';
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = '1';
                }}
              >
                💡 {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
            )}

            {/* Hint Modal/Display */}
            {showHint && challengeConfig.hint && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid #10b981',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px',
                color: '#10b981'
              }}>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  💡 Hint
                </div>
                <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
                  {challengeConfig.hint}
                </div>
              </div>
            )}

            {challengeConfig.additionalInfo && (
              <p style={{ 
                color: '#d1d5db', 
                fontSize: '15px',
                marginTop: '16px'
              }}>
                {challengeConfig.additionalInfo}{' '}
                {challengeConfig.additionalLinkText && challengeConfig.additionalLinkUrl && (
                  <a href={challengeConfig.additionalLinkUrl} style={{
                    color: '#3b82f6',
                    textDecoration: 'underline'
                  }}>
                    {challengeConfig.additionalLinkText}
                  </a>
                )}
              </p>
            )}
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
                background: isSolved ? '#f3f4f6' : '#fff',
                borderRadius: '0',
                display: 'flex',
                overflow: 'hidden',
                border: `1px solid ${isSolved ? '#10b981' : '#d1d5db'}`,
                opacity: isSolved ? 0.6 : 1
              }}>
                <div style={{
                  background: isSolved ? '#d1fae5' : '#f3f4f6',
                  padding: '12px 16px',
                  borderRight: `1px solid ${isSolved ? '#10b981' : '#d1d5db'}`,
                  color: isSolved ? '#065f46' : '#374151',
                  fontWeight: '500',
                  fontSize: '15px'
                }}>
                  {isSolved ? '✅ Solved' : 'Flag'}
                </div>
                <input 
                  type="text"
                  value={flagInput}
                  onChange={(e) => !isSolved && setFlagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isSolved && handleSubmit()}
                  placeholder={isSolved ? "You have already solved this question!" : "CyberCTF{your_answer_here}"}
                  disabled={isSolved}
                  style={{
                    flex: 1,
                    border: 'none',
                    padding: '12px 16px',
                    fontSize: '15px',
                    color: isSolved ? '#10b981' : '#6b7280',
                    outline: 'none',
                    background: isSolved ? '#f3f4f6' : '#fff',
                    cursor: isSolved ? 'not-allowed' : 'text'
                  }}
                />
              </div>
              <button 
                onClick={handleSubmit}
                disabled={submitting || isSolved}
                style={{
                  background: (submitting || isSolved) ? '#6b7280' : '#fff',
                  color: (submitting || isSolved) ? '#fff' : '#000',
                  border: '1px solid #d1d5db',
                  padding: '12px 32px',
                  borderRadius: '0',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: (submitting || isSolved) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  opacity: (submitting || isSolved) ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (!submitting && !isSolved) {
                    e.target.style.background = '#2a2e35';
                    e.target.style.color = '#fff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!submitting && !isSolved) {
                    e.target.style.background = '#fff';
                    e.target.style.color = '#000';
                  }
                }}
              >
                {submitting ? 'Submitting...' : isSolved ? 'Solved ✓' : 'Submit'}
              </button>
            </div>

            {/* Submission Result */}
            {submitResult && (
              <div style={{
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '16px',
                background: submitResult.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: `1px solid ${submitResult.success ? '#10b981' : '#ef4444'}`,
                color: submitResult.success ? '#10b981' : '#ef4444'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '8px', fontSize: '16px' }}>
                  {submitResult.success ? '✅ Correct!' : '❌ Incorrect'}
                </div>
                <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                  {submitResult.message}
                </div>
                {submitResult.success && submitResult.pointsAwarded && (
                  <div style={{ fontSize: '14px', fontWeight: '500' }}>
                    Points Awarded: +{submitResult.pointsAwarded} | Total Score: {submitResult.totalScore}
                  </div>
                )}
              </div>
            )}

            {/* Tags and solve count */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '16px',
              borderTop: '1px solid #374151'
            }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {challengeConfig.tags && challengeConfig.tags.length > 0 ? (
                  challengeConfig.tags.map((tag, i) => (
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
                  ))
                ) : (
                  <span style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    color: '#3b82f6',
                    padding: '4px 12px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}>
                    {challengeConfig.category}
                  </span>
                )}
              </div>
              <span style={{ 
                color: '#9ca3af', 
                fontSize: '14px' 
              }}>
                {(challengeConfig.solves || 0).toLocaleString()} solves
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
            boxShadow: '0 4px 24px rgba(0,0,0,0.4)'
          }}>
            <h3 style={{ 
              color: '#fff', 
              fontSize: '18px', 
              fontWeight: '600',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              Top10
            </h3>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }}>
              {top10.map((player) => (
                <div key={player.team_name} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#d1d5db',
                  fontSize: '14px'
                }}>
                  <span style={{ fontWeight: '600' }}>{player.rank}</span>
                  <span style={{ marginLeft: '8px' }}>{player.username}</span>
                  <span style={{ marginLeft: 'auto', color: '#9ca3af', fontWeight: 600 }}>{player.points}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}