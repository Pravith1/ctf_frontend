import React, { useState } from 'react';

export default function ArenaLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isHovered, setIsHovered] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    if (isLogin) {
      console.log('Login attempt:', formData);
    } else {
      console.log('Register attempt:', formData);
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
  };

  const handleMicrosoftLogin = () => {
    console.log('Microsoft login clicked');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .arena-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          position: relative;
          overflow: hidden;
        //   background: linear-gradient(135deg, #00274d 0%, #003d73 50%, #00274d
        //   100%);
          background: rgb(0,0,0);
        }

        .background-particles {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          border-radius: 50%;
          background: white;
          opacity: 0.08;
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(30px, -30px) scale(1.1);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .login-wrapper {
          position: relative;
          width: 100%;
          max-width: 450px;
          animation: fadeInUp 0.8s ease-out;
        }

        .login-card {
          backdrop-filter: blur(7px);
          background: rgb(53, 58, 64);
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          padding: 60px 40px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .login-card.hovered {
          transform: scale(1.02);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
        }

        .login-title {
          font-size: 2.5rem;
          font-weight: bold;
          text-align: center;
          color: white;
          margin-bottom: 40px;
          letter-spacing: 0.5px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          color: #d1d5db;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 8px;
          background: rgba(31, 41, 55, 0.5);
          border: 1px solid #4b5563;
          color: white;
          font-size: 1rem;
          outline: none;
          transition: all 0.3s ease;
        }

        .form-input::placeholder {
          color: #9ca3af;
        }

        .form-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
        }

        .forgot-password {
          text-align: right;
          margin-bottom: 20px;
        }

        .forgot-link {
          color: #60a5fa;
          font-size: 0.875rem;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .forgot-link:hover {
          color: #93c5fd;
        }

        .sign-in-btn {
          width: 100%;
          padding: 12px 16px;
          background: #2563eb;
          color: white;
          font-weight: 600;
          font-size: 1rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          transform: translateY(0);
        }

        .sign-in-btn:hover {
          background: #1d4ed8;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }

        .divider {
          display: flex;
          align-items: center;
          margin: 30px 0;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: #4b5563;
        }

        .divider-text {
          padding: 0 16px;
          color: #9ca3af;
          font-size: 0.875rem;
        }

        .social-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }

        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px 16px;
          background: white;
          color: #1f2937;
          font-weight: 500;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          transform: translateY(0);
        }

        .social-btn:hover {
          background: #f3f4f6;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }

        .social-icon {
          width: 20px;
          height: 20px;
          margin-right: 8px;
        }

        .register-text {
          text-align: center;
          color: #9ca3af;
          font-size: 0.875rem;
          margin-top: 20px;
        }

        .register-link {
          color: #60a5fa;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s ease;
          cursor: pointer;
        }

        .register-link:hover {
          color: #93c5fd;
        }

        @media (max-width: 640px) {
          .login-card {
            padding: 40px 30px;
          }

          .login-title {
            font-size: 2rem;
          }

          .social-buttons {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="arena-container">
        {/* Animated background particles
        <div className="background-particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                width: Math.random() * 100 + 20 + 'px',
                height: Math.random() * 100 + 20 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out`,
                animationDelay: Math.random() * 5 + 's'
              }}
            />
          ))}
        </div> */}

        {/* Login Card */}
        <div className="login-wrapper">
          <div
            className={`login-card ${isHovered ? 'hovered' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <h1 className="login-title">
              {isLogin ? 'Enter the Arena' : 'Join the Arena'}
            </h1>

            <div>
              {/* Username Input (Register only) */}
              {!isLogin && (
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="your_username"
                    className="form-input"
                  />
                </div>
              )}

              {/* Email Input */}
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  className="form-input"
                />
              </div>

              {/* Password Input */}
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="form-input"
                />
              </div>

              {/* Confirm Password (Register only) */}
              {!isLogin && (
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="form-input"
                  />
                </div>
              )}

              {/* Forgot Password (Login only) */}
              {isLogin && (
                <div className="forgot-password">
                  <a
                    href="#"
                    className="forgot-link"
                    onClick={(e) => e.preventDefault()}
                  >
                    Forgot Password?
                  </a>
                </div>
              )}

              {/* Submit Button */}
              <button onClick={handleSubmit} className="sign-in-btn">
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </div>

            {/* Social Login (Login only) */}
            {isLogin && (
              <>
                {/* Divider */}
                <div className="divider">
                  <div className="divider-line"></div>
                  <span className="divider-text">or continue with</span>
                  <div className="divider-line"></div>
                </div>

                {/* Social Login Buttons */}
                <div className="social-buttons">
                  <button onClick={handleGoogleLogin} className="social-btn">
                    <svg className="social-icon" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </button>

                  <button onClick={handleMicrosoftLogin} className="social-btn">
                    <svg className="social-icon" viewBox="0 0 23 23">
                      <path fill="#f35325" d="M0 0h11v11H0z"/>
                      <path fill="#81bc06" d="M12 0h11v11H12z"/>
                      <path fill="#05a6f0" d="M0 12h11v11H0z"/>
                      <path fill="#ffba08" d="M12 12h11v11H12z"/>
                    </svg>
                    Microsoft
                  </button>
                </div>
              </>
            )}

            {/* Toggle between Login/Register */}
            <p className="register-text">
              {isLogin ? "Don't have an account yet? " : "Already have an account? "}
              <span className="register-link" onClick={toggleMode}>
                {isLogin ? 'Register for free' : 'Sign in here'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
