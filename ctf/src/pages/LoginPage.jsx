import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import "./LoginPage.css"

export default function ArenaLogin() {
	const navigate = useNavigate();
	const { login, signup, setUser } = useAuth(); // ensure setUser exists in context
	const [isLogin, setIsLogin] = useState(true);
	const [formData, setFormData] = useState({
		team_name: '',
		email: '',
		password: '',
		confirmPassword: '',
		year: ''
	});
	const [error, setError] = useState('');
	const [isHovered, setIsHovered] = useState(false);

	const handleInputChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = async () => {
		setError('');

		if (isLogin) {
			if (!formData.team_name || !formData.password) {
				setError('Please enter team name and password');
				return;
			}

			try {
				const result = await login({
					team_name: formData.team_name,
					password: formData.password
				});

				if (result?.success) {
					// persist login info
					localStorage.setItem('user', JSON.stringify(result.user));
					localStorage.setItem('token', result.token || '');

					setUser(result.user); // update context

					// Navigate after small delay to ensure context updates
					setTimeout(() => {
						if (result.user.field === 'admin') {
							navigate('/admin');
						} else {
							navigate('/leaderboard');
						}
					}, 100);
				} else {
					setError(result.message || 'Login failed');
				}
			} catch (err) {
				setError('Login failed. Please try again.');
			}
		} else {
			if (!formData.email || !formData.team_name || !formData.password || !formData.confirmPassword || !formData.year) {
				setError('Please fill all fields');
				return;
			}

			if (!formData.email.endsWith('@psgtech.ac.in')) {
				setError('Please use your official PSG Tech email (@psgtech.ac.in)');
				return;
			}

			if (formData.password !== formData.confirmPassword) {
				setError('Passwords do not match');
				return;
			}

			const result = await signup({
				email: formData.email,
				team_name: formData.team_name,
				password: formData.password,
				year: parseInt(formData.year)
			});

			if (result?.success) {
				localStorage.setItem('user', JSON.stringify(result.user));
				localStorage.setItem('token', result.token || '');
				setUser(result.user);
				navigate('/leaderboard');
			} else {
				setError(result.message || 'Registration failed');
			}
		}
	};

	const toggleMode = () => {
		setIsLogin(!isLogin);
		setFormData({ team_name: '', email: '', password: '', confirmPassword: '', year: '' });
		setError('');
	};

	return (
		<div className="arena-container">
			<div
				className={`login-card ${isHovered ? 'hovered' : ''}`}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<h1 className="login-title">{isLogin ? 'Enter the Arena' : 'Join the Arena'}</h1>

				{error && (
					<div style={{
						background: 'rgba(239, 68, 68, 0.1)',
						border: '1px solid #ef4444',
						color: '#ef4444',
						padding: '12px',
						borderRadius: '8px',
						marginBottom: '16px',
						fontSize: '14px'
					}}>
						{error}
					</div>
				)}

				{/* Team Name */}
				<div className="form-group">
					<label className="form-label">Team Name</label>
					<input
						type="text"
						name="team_name"
						value={formData.team_name}
						onChange={handleInputChange}
						placeholder="your_team_name"
						className="form-input"
					/>
				</div>

				{/* Email only for signup */}
				{!isLogin && (
					<div className="form-group">
						<label className="form-label">Email (@psgtech.ac.in)</label>
						<input
							type="email"
							name="email"
							value={formData.email}
							onChange={handleInputChange}
							placeholder="your.email@psgtech.ac.in"
							className="form-input"
						/>
					</div>
				)}

				{/* Year only for signup */}
				{!isLogin && (
					<div className="form-group">
						<label className="form-label">Year</label>
						<select
							name="year"
							value={formData.year}
							onChange={handleInputChange}
							className="form-input"
							style={{ cursor: 'pointer' }}
						>
							<option value="">Select Year</option>
							<option value="1">1st Year</option>
							<option value="2">2nd Year</option>
							<option value="3">3rd Year</option>
							<option value="4">4th Year</option>
						</select>
					</div>
				)}

				{/* Password */}
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

				{/* Confirm Password for register */}
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

				<button onClick={handleSubmit} className="sign-in-btn">
					{isLogin ? 'Sign In' : 'Create Account'}
				</button>

				<p className="register-text">
					{isLogin ? "Don't have an account yet? " : "Already have an account? "}
					<span className="register-link" onClick={toggleMode}>
						{isLogin ? 'Register for free' : 'Sign in here'}
					</span>
				</p>
			</div>
		</div>
	);
}
