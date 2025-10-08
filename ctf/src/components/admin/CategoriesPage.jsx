import { useState } from 'react';
import { updateCategoryAdmin } from '../../api.js';

function EditCategory({ category, onBack }) {
	const [categoryName, setCategoryName] = useState(category.name);
	const [status, setStatus] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setStatus('');

		if (!categoryName.trim()) {
			setError('Category name cannot be empty');
			return;
		}

		try {
			const res = await updateCategoryAdmin(category._id, { name: categoryName.trim() });
			if (res && (res.statusCode === 200 || res.success)) {
				setStatus('Category updated successfully!');
				setTimeout(() => onBack(), 1500);
			} else {
				setError(res.message || 'Failed to update category');
			}
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to update category');
		}
	};

	return (
		<div className="edit-category-page">
			<button className="back-button" onClick={onBack}>
				← <span>Back to Overview</span>
			</button>

			<h1>Edit Category</h1>

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
						required
					/>
				</div>

				<button type="submit" className="btn-primary">
					Update Category
				</button>
			</form>

			{status && <div style={{ color: 'green', marginTop: '10px' }}>{status}</div>}
			{error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
		</div>
	);
}

export default EditCategory;
