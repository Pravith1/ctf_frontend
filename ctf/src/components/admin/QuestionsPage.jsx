import { useState, useEffect } from 'react';
import { getCategoriesAdmin, createQuestionAdmin } from '../api';

function QuestionsPage() {
	const [categories, setCategories] = useState([]);
	const [formData, setFormData] = useState({
		category: '',
		title: '',
		link: '',
		description: '',
		answer: '',
		points: ''
	});
	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState('');
	const [error, setError] = useState(null);

	// Fetch categories from backend
	const fetchCategories = async () => {
		try {
			const data = await getCategoriesAdmin();
			if (data && data.data) {
				setCategories(data.data);
				setFormData(prev => ({ ...prev, category: data.data[0]?.name || '' }));
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
		setError(null);

		if (!formData.category || !formData.title || !formData.description || !formData.answer || !formData.points) {
			setError('All fields are required');
			return;
		}

		const payload = {
			category: formData.category,
			title: formData.title,
			description: formData.description,
			answer: formData.answer,
			point: Number(formData.points),
			link: formData.link || ''
		};

		try {
			setLoading(true);
			const res = await createQuestionAdmin(payload);

			if (res && (res.statusCode === 201 || res.success)) {
				setStatus('Question created successfully!');
				setFormData(prev => ({ ...prev, title: '', link: '', description: '', answer: '', points: '' }));
			} else {
				setError(res.message || 'Failed to create question');
			}
		} catch (err) {
			console.error(err);
			let msg = 'Failed to create question';
			if (err.response && err.response.data && err.response.data.message) {
				msg = err.response.data.message;
			}
			setError(msg);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="questions-page">
			<h1>Questions</h1>

			<form className="form" onSubmit={handleCreate}>
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

				<div className="form-group">
					<label htmlFor="link">Link</label>
					<input
						type="text"
						id="link"
						name="link"
						className="input"
						value={formData.link}
						onChange={handleInputChange}
						placeholder="Enter link"
						disabled={loading}
					/>
				</div>

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

				<div className="form-group">
					<label htmlFor="answer">Answer</label>
					<input
						type="text"
						id="answer"
						name="answer"
						className="input"
						value={formData.answer}
						onChange={handleInputChange}
						placeholder="Enter answer"
						disabled={loading}
					/>
				</div>

				<div className="form-group">
					<label htmlFor="points">Points</label>
					<input
						type="text"
						id="points"
						name="points"
						className="input"
						value={formData.points}
						onChange={handleInputChange}
						placeholder="Enter points"
						disabled={loading}
					/>
				</div>

				<button type="submit" className="btn-primary" disabled={loading}>
					{loading ? 'Processing...' : 'Create'}
				</button>
			</form>

			{error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
			{status && <div style={{ color: 'green', marginTop: '10px' }}>{status}</div>}
		</div>
	);
}

export default QuestionsPage;
