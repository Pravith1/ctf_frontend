import ViewPage from './ViewPage';
import CategoriesPage from './CategoriesPage';
import QuestionsPage from './QuestionsPage';
import EditCategory from './EditCategory';
import EditQuestion from './EditQuestion';

function MainContent({
	activeMenu,
	editingCategory,
	editingQuestion,
	onEditCategory,
	onEditQuestion,
	onBackToOverview,
	categories = [],
	questions = [],
	loading = false,
	refreshData
}) {
	// Render editing screens first
	if (editingCategory) {
		return (
			<div className="main-content">
				<EditCategory
					category={editingCategory}
					onBack={onBackToOverview}
					refreshData={refreshData}
				/>
			</div>
		);
	}

	if (editingQuestion) {
		return (
			<div className="main-content">
				<EditQuestion
					category={editingQuestion.category}
					question={editingQuestion.question}
					onBack={onBackToOverview}
					refreshData={refreshData}
				/>
			</div>
		);
	}

	// Render main pages
	return (
		<div className="main-content" style={{ flex: 1, padding: '20px' }}>
			{loading ? (
				<div className="loading-container">
					<p style={{ color: '#ccc', textAlign: 'center', marginTop: '20px' }}>
						Loading admin data...
					</p>
				</div>
			) : (
				<>
					{activeMenu === 'Overview' && (
						<ViewPage
							onEditCategory={onEditCategory}
							onEditQuestion={onEditQuestion}
							categories={categories}
							questions={questions}
							refreshData={refreshData}
						/>
					)}

					{activeMenu === 'Categories' && (
						<CategoriesPage
							categories={categories || []} // fallback to empty array
							onEditCategory={onEditCategory} // pass handler for editing
							refreshData={refreshData}
						/>
					)}

					{activeMenu === 'Questions' && (
						<QuestionsPage
							questions={questions || []} // fallback to empty array
							categories={categories || []} // fallback
							onEditQuestion={onEditQuestion}
							refreshData={refreshData}
						/>
					)}

					{/* Catch-all if activeMenu is invalid */}
					{!['Overview', 'Categories', 'Questions'].includes(activeMenu) && (
						<p style={{ color: '#ccc', textAlign: 'center', marginTop: '20px' }}>
							Select a menu item from the sidebar
						</p>
					)}
				</>
			)}
		</div>
	);
}

export default MainContent;
