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

	return (
		<div className="main-content">
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
							categories={categories}
							refreshData={refreshData}
						/>
					)}

					{activeMenu === 'Questions' && (
						<QuestionsPage
							questions={questions}
							categories={categories}
							onEditQuestion={onEditQuestion}
							refreshData={refreshData}
						/>
					)}
				</>
			)}
		</div>
	);
}

export default MainContent;
