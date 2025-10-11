import { useState, useEffect } from 'react';
import { updateQuestionAdmin, getCategoriesAdmin, fetchQuestionDetails } from '../../api.js';

function EditQuestion({ category, question, onBack }) {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    category: category || '',
    title: question?.title || '',
    link: question?.link || '',
    description: question?.description || '',
    answer: question?.answer || '',
    points: question?.points || question?.point || '',
    difficulty: question?.difficulty || 'beginner',
    year: question?.year || ''
  });

  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch categories from backend and ensure we have full question details
  useEffect(() => {
    let mounted = true;

    const fetchInitial = async () => {
      try {
        const res = await getCategoriesAdmin();
        const cats = (res && (res.data || res)) || [];
        if (!mounted) return;
        setCategories(cats);
        // If category missing, default to first
        setFormData(prev => ({ ...prev, category: prev.category || cats[0]?.name || '' }));

        // If question object seems incomplete, try fetching full details by id
        if (question && (!question.description || question.answer === undefined || question.link === undefined)) {
          try {
            const detailRes = await fetchQuestionDetails(question._id || question.question_id || question.id);
            const q = detailRes?.data || detailRes || {};
            if (!mounted) return;
            setFormData({
              category: q.category || q.categoryName || prev.category || cats[0]?.name || '',
              title: q.title || '',
              link: q.link || '',
              description: q.description || '',
              answer: q.answer || '',
              points: q.points || q.point || '',
              difficulty: q.difficulty || q.level || 'medium',
              year: q.year || ''
            });
          } catch (err) {
            // if fetchQuestionDetails fails, fall back to provided question
            console.warn('Could not fetch full question details, using provided data', err);
          }
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchInitial();

    return () => { mounted = false; };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    setError('');
    setLoading(true);

    try {
      const payload = {
        category: formData.category,
        title: formData.title,
        link: formData.link || '',
        description: formData.description || '',
        difficulty: formData.difficulty || 'medium',
        answer: formData.answer || '',
        point: Number(formData.points || 0),
        year: Number(formData.year || 0)
      };

      const res = await updateQuestionAdmin(question._id || question.question_id || question.id, payload);

      if (res && (res.statusCode === 200 || res.success)) {
        setStatus('Question updated successfully!');
        setTimeout(() => {
          setStatus('');
          onBack();
        }, 1500);
      } else {
        setError(res.message || 'Failed to update question');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-question-page">
      <button className="back-button" onClick={onBack}>
        ← <span>Back to Overview</span>
      </button>

      <h1>Edit Question</h1>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            className="dropdown"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" className="input"
            value={formData.title} onChange={handleInputChange} placeholder="Enter question title" required />
        </div>

        <div className="form-group">
          <label htmlFor="link">Link</label>
          <input type="text" id="link" name="link" className="input"
            value={formData.link} onChange={handleInputChange} placeholder="Enter link" />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" className="textarea"
            value={formData.description} onChange={handleInputChange} placeholder="Enter question description"
            rows="4" required />
        </div>

        <div className="form-group">
          <label htmlFor="answer">Answer</label>
          <input type="text" id="answer" name="answer" className="input"
            value={formData.answer} onChange={handleInputChange} placeholder="Enter answer" required />
        </div>

        <div className="form-group">
          <label htmlFor="points">Points</label>
          <input type="text" id="points" name="points" className="input"
            value={formData.points} onChange={handleInputChange} placeholder="Enter points" required />
        </div>

        <div className="form-group">
          <label htmlFor="difficulty">Difficulty</label>
          <select id="difficulty" name="difficulty" className="dropdown" value={formData.difficulty} onChange={handleInputChange} required>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="year">Year</label>
          <input type="number" id="year" name="year" className="input"
            value={formData.year} onChange={handleInputChange} placeholder="Enter year" required />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Updating...' : 'Update Question'}
        </button>
      </form>

      {status && <div className="status-message" style={{ color: 'green' }}>{status}</div>}
      {error && <div className="status-message" style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}

export default EditQuestion;
