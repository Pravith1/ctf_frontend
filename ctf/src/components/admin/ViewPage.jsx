import { useState, useEffect } from 'react';
import { getCategoriesAdmin, getQuestionsAdmin, deleteQuestionAdmin } from '../api';

function ViewPage({ onEditCategory, onEditQuestion }) {
	const [categories, setCategories] = useState([]);
	const [questions, setQuestions] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState('');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchData = async () => {
		try {
			setLoading(true);
			const catRes = await getCategoriesAdmin();
			const quesRes = await getQuestionsAdmin();

			if (catRes.data) setCategories(catRes.data);
			if (quesRes.data) setQuestions(quesRes.data);

			if (catRes.data && catRes.data.length > 0) setSelectedCategory(catRes.data[0]._id);
		} catch (err) {
			console.error(err);
			setError('Failed to fetch data');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleDeleteCategory = async (categoryId, categoryName) => {
		if (window.confirm(`Are you sure you want to delete category "${categoryName}"?`)) {
			console.log('Category deletion is backend-dependent');
			// Optionally call delete category API here if implemented
		}
	};

	const handleDeleteQuestion = async (questionId, questionTitle) => {
		if (window.confirm(`Are you sure you want to delete question "${questionTitle}"?`)) {
			try {
				await deleteQuestionAdmin(questionId);
				setQuestions((prev) => prev.filter((q) => q._id !== questionId));
			} catch (err) {
				console.error(err);
				alert('Failed to delete question');
			}
		}
	};

	if (loading) return <p>Loading...</p>;
	if (error) return <p style={{ color: 'red' }}>{error}</p>;

	return (
		<div className="view-page">
			<h1>Overview</h1>

			<div className="view-section">
				<h2>All Categories</h2>
				<div className="categories-list">
					{categories.map((cat) => (
						<div key={cat._id} className="list-item">
							<span className="item-text">{cat.name}</span>
							<div className="item-actions">
								<button
									className="icon-btn edit-btn"
									onClick={() => onEditCategory(cat)}
									title="Edit"
								>
									✏️
								</button>
								<button
									className="icon-btn delete-btn"
									onClick={() => handleDeleteCategory(cat._id, cat.name)}
									title="Delete"
								>
									🗑️
								</button>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="view-section">
				<h2>Questions by Category</h2>
				<select
					className="dropdown"
					value={selectedCategory}
					onChange={(e) => setSelectedCategory(e.target.value)}
				>
					{categories.map((cat) => (
						<option key={cat._id} value={cat._id}>
							{cat.name}
						</option>
					))}
				</select>

				<div className="questions-list">
					{questions
						.filter((q) => q.categoryId?._id === selectedCategory)
						.map((q) => (
							<div key={q._id} className="list-item">
								<span className="item-text">{q.title}</span>
								<div className="item-actions">
									<button
										className="icon-btn edit-btn"
										onClick={() => onEditQuestion(q.categoryId, q)}
										title="Edit"
									>
										✏️
									</button>
									<button
										className="icon-btn delete-btn"
										onClick={() => handleDeleteQuestion(q._id, q.title)}
										title="Delete"
									>
										🗑️
									</button>
								</div>
							</div>
						))}
				</div>
			</div>
		</div>
	);
}

export default ViewPage;
