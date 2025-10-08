import { useState, useEffect } from 'react';
import {
	getCategoriesAdmin,
	deleteCategoryAdmin,
	getQuestionsAdmin,
	deleteQuestionAdmin,
	updateCategoryAdmin,
	updateQuestionAdmin
} from '../../api';
import EditCategory from './EditCategory';
import EditQuestion from './EditQuestion';

function ViewPage() {
	const [categories, setCategories] = useState([]);
	const [questionsByCategory, setQuestionsByCategory] = useState({});
	const [selectedCategory, setSelectedCategory] = useState('');
	const [loading, setLoading] = useState(true);

	// For editing
	const [editingCategory, setEditingCategory] = useState(null);
	const [editingQuestion, setEditingQuestion] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const catRes = await getCategoriesAdmin();
				const cats = catRes.data || [];
				setCategories(cats);
				setSelectedCategory(cats[0]?.name || '');

				const quesRes = await getQuestionsAdmin();
				const ques = quesRes.data || [];

				const grouped = {};
				ques.forEach(q => {
					const catName = q.categoryId?.name || 'Uncategorized';
					if (!grouped[catName]) grouped[catName] = [];
					grouped[catName].push(q);
				});
				setQuestionsByCategory(grouped);
			} catch (err) {
				console.error('Error fetching data:', err);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const refreshData = async () => {
		setLoading(true);
		try {
			const catRes = await getCategoriesAdmin();
			const cats = catRes.data || [];
			setCategories(cats);
			setSelectedCategory(cats[0]?.name || '');

			const quesRes = await getQuestionsAdmin();
			const ques = quesRes.data || [];
			const grouped = {};
			ques.forEach(q => {
				const catName = q.categoryId?.name || 'Uncategorized';
				if (!grouped[catName]) grouped[catName] = [];
				grouped[catName].push(q);
			});
			setQuestionsByCategory(grouped);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteCategory = async (category) => {
		const catObj = categories.find(c => c.name === category);
		if (!catObj) return;
		if (window.confirm(`Are you sure you want to delete the category "${category}"?`)) {
			try {
				await deleteCategoryAdmin(catObj._id);
				refreshData();
			} catch (err) {
				alert(err.response?.data?.message || 'Failed to delete category');
			}
		}
	};

	const handleDeleteQuestion = async (questionId) => {
		if (window.confirm('Are you sure you want to delete this question?')) {
			try {
				await deleteQuestionAdmin(questionId);
				refreshData();
			} catch (err) {
				alert(err.response?.data?.message || 'Failed to delete question');
			}
		}
	};

	if (loading) return <div>Loading...</div>;

	// If editing a category
	if (editingCategory) {
		return (
			<EditCategory
				category={editingCategory}
				onBack={() => {
					setEditingCategory(null);
					refreshData();
				}}
			/>
		);
	}

	// If editing a question
	if (editingQuestion) {
		return (
			<EditQuestion
				category={editingQuestion.category}
				question={editingQuestion}
				onBack={() => {
					setEditingQuestion(null);
					refreshData();
				}}
			/>
		);
	}

	return (
		<div className="view-page">
			<h1>Overview</h1>

			<div className="view-section">
				<h2>All Categories</h2>
				<div className="categories-list">
					{categories.map(category => (
						<div key={category._id} className="list-item">
							<span className="item-text">{category.name}</span>
							<div className="item-actions">
								<button
									className="icon-btn edit-btn"
									onClick={() => setEditingCategory(category)}
									title="Edit"
								>
									✏️
								</button>
								<button
									className="icon-btn delete-btn"
									onClick={() => handleDeleteCategory(category.name)}
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
					{categories.map(category => (
						<option key={category._id} value={category.name}>
							{category.name}
						</option>
					))}
				</select>

				<div className="questions-list">
					{questionsByCategory[selectedCategory]?.map(question => (
						<div key={question._id} className="list-item">
							<span className="item-text">{question.title}</span>
							<div className="item-actions">
								<button
									className="icon-btn edit-btn"
									onClick={() => setEditingQuestion({
										category: selectedCategory,
										...question
									})}
									title="Edit"
								>
									✏️
								</button>
								<button
									className="icon-btn delete-btn"
									onClick={() => handleDeleteQuestion(question._id)}
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
