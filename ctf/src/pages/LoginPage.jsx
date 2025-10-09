import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import "./LoginPage.css"

export default function ArenaLogin() {
	const navigate = useNavigate();
	const { login } = useAuth();
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

	const handleSubmit = async () => {
		if (isLogin) {
			// Login logic (only username + password)
			if (!formData.username || !formData.password) {
				alert('Please enter username and password');
				return;
			}

			const result = await login({ username: formData.username, password: formData.password });

			if (result.success) {
				// Redirect based on role
				navigate(result.role === 'admin' ? '/admin' : '/leaderboard');
			} else {
				alert(result.message || 'Login failed');
			}
		} else {
			// Register logic (username + email + password + confirmPassword)
			if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
				alert('Please fill all fields');
				return;
			}

			if (formData.password !== formData.confirmPassword) {
				alert('Passwords do not match');
				return;
			}

			const result = await login({
				username: formData.username,
				email: formData.email,
				password: formData.password
			});

			if (result.success) {
				navigate(result.role === 'admin' ? '/admin' : '/leaderboard');
			} else {
				alert(result.message || 'Registration failed');
			}
		}
	};

	const toggleMode = () => {
		setIsLogin(!isLogin);
		setFormData({ username: '', email: '', password: '', confirmPassword: '' });
	};

	return (
		<div className="arena-container">
			<div
				className={`login-card ${isHovered ? 'hovered' : ''}`}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<h1 className="login-title">{isLogin ? 'Enter the Arena' : 'Join the Arena'}</h1>

				<div>
					{/* Username */}
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

					{/* Email only for register */}
					{!isLogin && (
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

					{/* Submit Button */}
					<button onClick={handleSubmit} className="sign-in-btn">
						{isLogin ? 'Sign In' : 'Create Account'}
					</button>

					{/* Toggle Login/Register */}
					<p className="register-text">
						{isLogin ? "Don't have an account yet? " : "Already have an account? "}
						<span className="register-link" onClick={toggleMode}>
							{isLogin ? 'Register for free' : 'Sign in here'}
						</span>
					</p>
				</div>
			</div>
		</div>
	);
}
