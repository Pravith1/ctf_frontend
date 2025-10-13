import { useState } from 'react';
import { createCategoryAdmin } from '../../api.js';

function CategoriesPage({ refreshData }) {
	const [categoryName, setCategoryName] = useState('');
	const [difficulty, setDifficulty] = useState('beginner');
	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState('');
	const [error, setError] = useState('');

	const handleCreate = async (e) => {
		e.preventDefault();
		setStatus('');
		setError('');

		if (!categoryName.trim()) {
			setError('Please enter a category name');
			return;
		}

		try {
			setLoading(true);
			const res = await createCategoryAdmin({ 
				name: categoryName.trim(),
				difficulty: difficulty
			});
			

		if (
			res?.status === 201 || 
			res?.statusCode === 201 || 
			res?.success
		) {
			setStatus('Category created successfully!');
			setCategoryName('');
			setDifficulty('beginner');
			if (refreshData) refreshData();
		} else {
			setError(res?.data?.message || 'Cannot create category');
		}


		} catch (err) {
			console.error(err);
			setError(err.response?.data?.message || 'Failed to create category');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="categories-page">
			<h1>Categories</h1>

			<form className="form" onSubmit={handleCreate}>
				{/* CATEGORY NAME INPUT */}
				<div className="form-group">
					<label htmlFor="categoryName">New Category</label>
					<input
						type="text"
						id="categoryName"
						name="categoryName"
						className="input"
						value={categoryName}
						onChange={(e) => setCategoryName(e.target.value)}
						placeholder="Enter category name"
						disabled={loading}
					/>
				</div>

				{/* DIFFICULTY SELECT */}
				<div className="form-group">
					<label htmlFor="difficulty">Difficulty</label>
					<select
						id="difficulty"
						name="difficulty"
						className="dropdown"
						value={difficulty}
						onChange={(e) => setDifficulty(e.target.value)}
						disabled={loading}
					>
						<option value="beginner">Beginner</option>
						<option value="intermediate">Intermediate</option>
					</select>
				</div>

				<button type="submit" className="btn-primary" disabled={loading}>
					{loading ? 'Creating...' : 'Create Category'}
				</button>
			</form>

			{error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
			{status && <div style={{ color: 'green', marginTop: '10px' }}>{status}</div>}
		</div>
	);
}

export default CategoriesPage;
