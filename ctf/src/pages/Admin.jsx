import { useState, useRef, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Sidebar from '../components/admin/Sidebar';
import MainContent from '../components/admin/MainContent';
import '../App.css';
import { getCategoriesAdmin, getQuestionsAdmin } from '../api.js';
import { useNavigate } from 'react-router-dom';

function Admin() {
	const [activeMenu, setActiveMenu] = useState('Overview');
	const [editingCategory, setEditingCategory] = useState(null);
	const [editingQuestion, setEditingQuestion] = useState(null);
	const [categories, setCategories] = useState([]);
	const [questions, setQuestions] = useState([]);
	const [loading, setLoading] = useState(true);
	const scrollPositionRef = useRef(0);
	const navigate = useNavigate();

	// Check if admin is authenticated
	useEffect(() => {
		const user = JSON.parse(localStorage.getItem('user'));
		if (!user || !user.isAdmin) {
			navigate('/login'); // redirect if not admin
		}
	}, [navigate]);

	// Fetch categories and questions from backend
	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const [cats, ques] = await Promise.all([
					getCategoriesAdmin(),
					getQuestionsAdmin()
				]);
				setCategories(cats);
				setQuestions(ques);
			} catch (err) {
				console.error('Failed to load admin data:', err);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const handleEditCategory = (category) => {
		const mainContent = document.querySelector('.main-content');
		if (mainContent) {
			scrollPositionRef.current = mainContent.scrollTop;
		}
		setEditingCategory(category);
	};

	const handleEditQuestion = (category, question) => {
		const mainContent = document.querySelector('.main-content');
		if (mainContent) {
			scrollPositionRef.current = mainContent.scrollTop;
		}
		setEditingQuestion({ category, question });
	};

	const handleBackToOverview = () => {
		setEditingCategory(null);
		setEditingQuestion(null);
		setTimeout(() => {
			const mainContent = document.querySelector('.main-content');
			if (mainContent) {
				mainContent.scrollTop = scrollPositionRef.current;
			}
		}, 0);
	};

	return (
		<div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
			<Header />
			<div className="app-container" style={{ flex: 1 }}>
				<Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
				<MainContent
					activeMenu={activeMenu}
					editingCategory={editingCategory}
					editingQuestion={editingQuestion}
					onEditCategory={handleEditCategory}
					onEditQuestion={handleEditQuestion}
					onBackToOverview={handleBackToOverview}
					categories={categories}
					questions={questions}
					loading={loading}
					refreshData={async () => {
						try {
							const [cats, ques] = await Promise.all([
								getCategoriesAdmin(),
								getQuestionsAdmin()
							]);
							setCategories(cats);
							setQuestions(ques);
						} catch (err) {
							console.error('Failed to refresh admin data:', err);
						}
					}}
				/>
			</div>
			<Footer />
		</div>
	);
}

export default Admin;
