import { useState } from 'react';

function EditQuestion({ category, question, onBack }) {
  const dummyCategories = ['Web Exploitation', 'Cryptography', 'Reverse Engineering', 'Binary Exploitation', 'Forensics'];

  const [formData, setFormData] = useState({
    category: category,
    title: question.title,
    link: question.link,
    description: question.description,
    answer: question.answer,
    points: question.points
  });

  const [status, setStatus] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updating question:', formData);
    setStatus('Question updated successfully!');
    setTimeout(() => {
      setStatus('');
      onBack();
    }, 2000);
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
          >
            {dummyCategories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            className="input"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter question title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="link">Link</label>
          <input
            type="text"
            id="link"
            name="link"
            className="input"
            value={formData.link}
            onChange={handleInputChange}
            placeholder="Enter link"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            className="textarea"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter question description"
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="answer">Answer</label>
          <input
            type="text"
            id="answer"
            name="answer"
            className="input"
            value={formData.answer}
            onChange={handleInputChange}
            placeholder="Enter answer"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="points">Points</label>
          <input
            type="text"
            id="points"
            name="points"
            className="input"
            value={formData.points}
            onChange={handleInputChange}
            placeholder="Enter points"
            required
          />
        </div>

        <button type="submit" className="btn-primary">
          Update Question
        </button>
      </form>

      {status && (
        <div className="status-message">
          {status}
        </div>
      )}
    </div>
  );
}

export default EditQuestion;
