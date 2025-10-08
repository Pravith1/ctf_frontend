import { useState, useEffect } from 'react';
import { updateQuestionAdmin, getCategoriesAdmin } from '../api';

function EditQuestion({ category, question, onBack }) {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    category: category,
    title: question.title,
    link: question.link,
    description: question.description,
    answer: question.answer,
    points: question.points,
    year: question.year || ''
  });

  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategoriesAdmin();
        if (res && res.data) {
          setCategories(res.data);
          if (!formData.category) {
            setFormData(prev => ({ ...prev, category: res.data[0]?.name || '' }));
          }
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
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
        link: formData.link,
        description: formData.description,
        answer: formData.answer,
        point: Number(formData.points),
        year: Number(formData.year)
      };

      const res = await updateQuestionAdmin(question._id, payload);

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
