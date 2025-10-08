import { useState, useEffect } from 'react';
import { getCategoriesAdmin, createCategoryAdmin } from '../api';

function CategoriesPage() {
	const [categories, setCategories] = useState([]);
	const [categoryName, setCategoryName] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [successMsg, setSuccessMsg] = useState(null);

	// Fetch categories on mount
	const fetchCategories = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await getCategoriesAdmin();
			if (data && data.data) {
				setCategories(data.data);
			} else {
				setError('Failed to load categories');
			}
		} catch (err) {
			console.error(err);
			setError('Error fetching categories');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCategories();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setSuccessMsg(null);

		const nameTrim = categoryName.trim();
		if (!nameTrim) {
			setError('Category name cannot be empty');
			return;
		}

		try {
			setLoading(true);
			const data = await createCategoryAdmin({ name: nameTrim });

			if (data && (data.statusCode === 201 || data.success)) {
				setSuccessMsg('Category created successfully');
				setCategoryName('');
				fetchCategories(); // Refresh the list
			} else {
				setError(data.message || 'Failed to create category');
			}
		} catch (err) {
			console.error(err);
			let msg = 'Failed to create category';
			if (err.response && err.response.data && err.response.data.message) {
				msg = err.response.data.message;
			}
			setError(msg);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="categories-page">
			<h1>Categories</h1>

			<form className="form" onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="categoryName">Category Name</label>
					<input
						type="text"
						id="categoryName"
						className="input"
						value={categoryName}
						onChange={(e) => setCategoryName(e.target.value)}
						placeholder="Enter category name"
						disabled={loading}
					/>
				</div>

				<button type="submit" className="btn-primary" disabled={loading}>
					{loading ? 'Processing...' : 'Create'}
				</button>
			</form>

			{error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
			{successMsg && <div style={{ color: 'green', marginTop: '10px' }}>{successMsg}</div>}

			{loading && categories.length === 0 && (
				<div style={{ marginTop: '20px', color: '#ccc' }}>Loading categories...</div>
			)}

			{categories.length > 0 && (
				<div className="existing-categories" style={{ marginTop: '20px' }}>
					<h2>Existing Categories</h2>
					<ul>
						{categories.map((cat) => (
							<li key={cat._id}>{cat.name}</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}

export default CategoriesPage;
