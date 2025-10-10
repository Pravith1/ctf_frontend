import { useState, useEffect } from 'react';
import { getCategoriesAdmin, createQuestionAdmin } from '../../api.js';

function QuestionsPage() {
	const [categories, setCategories] = useState([]);
	const [formData, setFormData] = useState({
		category: '',
		title: '',
		link: '',
		description: '',
		answer: '',
		point: '',
		year: new Date().getFullYear(),
		difficulty: 'beginner'
	});
	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState('');
	const [error, setError] = useState('');

	// Fetch categories from backend
	const fetchCategories = async () => {
		try {
			const res = await getCategoriesAdmin();
			if (res?.data) {
				setCategories(res.data);
				setFormData(prev => ({ ...prev, category: res.data[0]?.name || '' }));
			}
		} catch (err) {
			console.error(err);
			setError('Failed to load categories');
		}
	};

	useEffect(() => {
		fetchCategories();
	}, []);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleCreate = async (e) => {
		e.preventDefault();
		setStatus('');
		setError('');

		const { category, title, description, answer, point, year, difficulty } = formData;
		if (!category || !title || !description || !answer || !point || !year || !difficulty) {
			setError('All fields except link are required');
			return;
		}

		const payload = {
			category, // category name
			title,
			description,
			answer,
			point: Number(point),
			link: formData.link || '',
			year: Number(year),
			difficulty
		};

		try {
			setLoading(true);
			const res = await createQuestionAdmin(payload);
			if (res?.status === 201 || res?.statusCode === 201) {
				setStatus('Question created successfully!');
				setFormData({
					category: categories[0]?.name || '',
					title: '',
					link: '',
					description: '',
					answer: '',
					point: '',
					year: new Date().getFullYear(),
					difficulty: 'beginner'
				});
			} else {
				setError(res?.data?.message || 'Failed to create question');
			}
		} catch (err) {
			console.error(err);
			setError(err.response?.data?.message || 'Failed to create question');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="questions-page">
			<h1>Questions</h1>

			<form className="form" onSubmit={handleCreate}>
				{/* CATEGORY */}
				<div className="form-group">
					<label htmlFor="category">Category</label>
					<select
						id="category"
						name="category"
						className="dropdown"
						value={formData.category}
						onChange={handleInputChange}
						disabled={loading || categories.length === 0}
					>
						{categories.map((cat) => (
							<option key={cat._id} value={cat.name}>
								{cat.name}
							</option>
						))}
					</select>
				</div>

				{/* DIFFICULTY */}
				<div className="form-group">
					<label htmlFor="difficulty">Difficulty</label>
					<select
						id="difficulty"
						name="difficulty"
						className="dropdown"
						value={formData.difficulty}
						onChange={handleInputChange}
						disabled={loading}
					>
						<option value="beginner">Beginner</option>
						<option value="intermediate">Intermediate</option>
					</select>
				</div>

				{/* TITLE */}
				<div className="form-group">
					<label htmlFor="title">Title</label>
					<input
						type="text"
						id="title"
						name="title"
						className="input"
						value={formData.title}
						onChange={handleInputChange}
						placeholder="Enter question title"
						disabled={loading}
					/>
				</div>

				{/* LINK */}
				<div className="form-group">
					<label htmlFor="link">Link</label>
					<input
						type="text"
						id="link"
						name="link"
						className="input"
						value={formData.link}
						onChange={handleInputChange}
						placeholder="Optional link"
						disabled={loading}
					/>
				</div>

				{/* DESCRIPTION */}
				<div className="form-group">
					<label htmlFor="description">Description</label>
					<textarea
						id="description"
						name="description"
						className="textarea"
						value={formData.description}
						onChange={handleInputChange}
						placeholder="Enter question description"
						rows="4"
						disabled={loading}
					/>
				</div>

				{/* ANSWER */}
				<div className="form-group">
					<label htmlFor="answer">Answer</label>
					<input
						type="text"
						id="answer"
						name="answer"
						className="input"
						value={formData.answer}
						onChange={handleInputChange}
						placeholder="Enter correct answer"
						disabled={loading}
					/>
				</div>

				{/* POINTS */}
				<div className="form-group">
					<label htmlFor="point">Points</label>
					<input
						type="number"
						id="point"
						name="point"
						className="input"
						value={formData.point}
						onChange={handleInputChange}
						placeholder="Enter points"
						disabled={loading}
					/>
				</div>

				{/* YEAR */}
				<div className="form-group">
					<label htmlFor="year">Year</label>
					<input
						type="number"
						id="year"
						name="year"
						className="input"
						value={formData.year}
						onChange={handleInputChange}
						placeholder="Enter year"
						disabled={loading}
					/>
				</div>

				<button type="submit" className="btn-primary" disabled={loading}>
					{loading ? 'Processing...' : 'Create Question'}
				</button>
			</form>

			{error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
			{status && <div style={{ color: 'green', marginTop: '10px' }}>{status}</div>}
		</div>
	);
}

export default QuestionsPage;
