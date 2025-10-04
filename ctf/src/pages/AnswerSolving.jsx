import './AnswerSolving.css'

export default function AnswerSolving() {
  return (
    <div className="container">
      <div className="question-section">
        <p className="question-text">
          🔐 <strong>Challenge #001</strong> 🔐<br/><br/>
          Decrypt the following message to find the flag:<br/><br/>
          <code style={{ 
            background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
            padding: '12px 16px', 
            borderRadius: '8px',
            fontFamily: 'monospace',
            color: '#4a9eff',
            fontSize: '16px',
            border: '1px solid rgba(74, 158, 255, 0.3)',
            boxShadow: '0 0 10px rgba(74, 158, 255, 0.2)',
            display: 'inline-block',
            letterSpacing: '1px'
          }}>
            U2FsdGVkX1+vupppZksvRf5pq5g5XjFRlipRkwB0K1Y=
          </code>
          <br/><br/>
          <small style={{ 
            color: '#888888', 
            fontSize: '14px',
            fontStyle: 'italic'
          }}>
            💡 Hint: The encryption method starts with 'AES'
          </small>
        </p>
      </div>
      
      <div className="input-section">
        <input 
          type="text" 
          className="answer-input"
          placeholder="flag{abc123def456}"
        />
        <button className="submit-button">
          🚀 Submit
        </button>
      </div>
    </div>
  );
}
