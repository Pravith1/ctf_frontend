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

	// Redirect if not admin
	useEffect(() => {
		const user = JSON.parse(localStorage.getItem('user'));
		if (!user || !user.isAdmin) {
			navigate('/login'); 
		}
	}, [navigate]);

	// Fetch categories and questions
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

	useEffect(() => {
		fetchData();
	}, []);

	const handleEditCategory = (category) => {
		const mainContent = document.querySelector('.main-content');
		if (mainContent) scrollPositionRef.current = mainContent.scrollTop;
		setEditingCategory(category);
		setActiveMenu('Categories'); // Ensure content matches sidebar
	};

	const handleEditQuestion = (category, question) => {
		const mainContent = document.querySelector('.main-content');
		if (mainContent) scrollPositionRef.current = mainContent.scrollTop;
		setEditingQuestion({ category, question });
		setActiveMenu('Questions'); // Ensure content matches sidebar
	};

	const handleBackToOverview = () => {
		setEditingCategory(null);
		setEditingQuestion(null);
		setTimeout(() => {
			const mainContent = document.querySelector('.main-content');
			if (mainContent) mainContent.scrollTop = scrollPositionRef.current;
		}, 0);
	};

	return (
		<div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
			<Header />
			<div className="app-container" style={{ flex: 1, display: 'flex' }}>
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
					refreshData={fetchData}
				/>
			</div>
			<Footer />
		</div>
	);
}

export default Admin;
