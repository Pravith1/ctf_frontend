import ViewPage from './ViewPage';
import CategoriesPage from './CategoriesPage';
import QuestionsPage from './QuestionsPage';
import EditCategory from './EditCategory';
import EditQuestion from './EditQuestion';

function MainContent({ activeMenu, editingCategory, editingQuestion, onEditCategory, onEditQuestion, onBackToOverview }) {
  if (editingCategory) {
    return (
      <div className="main-content">
        <EditCategory category={editingCategory} onBack={onBackToOverview} />
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
        />
      </div>
    );
  }

  return (
    <div className="main-content">
      {activeMenu === 'Overview' && (
        <ViewPage
          onEditCategory={onEditCategory}
          onEditQuestion={onEditQuestion}
        />
      )}
      {activeMenu === 'Categories' && <CategoriesPage />}
      {activeMenu === 'Questions' && <QuestionsPage />}
    </div>
  );
}

export default MainContent;
