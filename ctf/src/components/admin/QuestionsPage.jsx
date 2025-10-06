import { useState } from 'react';

function QuestionsPage() {
  const [operation, setOperation] = useState('Create');
  const [status, setStatus] = useState('');

  const dummyCategories = ['Web Exploitation', 'Cryptography', 'Reverse Engineering', 'Binary Exploitation', 'Forensics'];

  const dummyQuestions = {
    'Web Exploitation': ['SQL Injection Challenge', 'XSS Attack', 'CSRF Token Bypass'],
    'Cryptography': ['Caesar Cipher', 'RSA Challenge', 'AES Decryption'],
    'Reverse Engineering': ['Crack the Binary', 'Assembly Analysis', 'Obfuscated Code'],
    'Binary Exploitation': ['Buffer Overflow', 'Format String Attack', 'ROP Chain'],
    'Forensics': ['Image Analysis', 'Network Traffic', 'Memory Dump']
  };

  const [formData, setFormData] = useState({
    category: dummyCategories[0],
    title: '',
    link: '',
    description: '',
    answer: '',
    points: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    console.log('Creating question:', formData);
    setStatus('Question created successfully!');
    setTimeout(() => setStatus(''), 3000);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    console.log('Updating question:', formData);
    setStatus('Question updated successfully!');
    setTimeout(() => setStatus(''), 3000);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    console.log('Deleting question:', formData.title);
    setStatus('Question deleted successfully!');
    setTimeout(() => setStatus(''), 3000);
  };

  return (
    <div className="questions-page">
      <h1>Questions</h1>

      <div className="form-group">
        <label htmlFor="operation">Operation</label>
        <select
          id="operation"
          className="dropdown"
          value={operation}
          onChange={(e) => setOperation(e.target.value)}
        >
          <option value="Create">Create</option>
          <option value="Update">Update</option>
          <option value="Delete">Delete</option>
        </select>
      </div>

      {operation === 'Create' && (
        <form className="form" onSubmit={handleCreate}>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              className="dropdown"
              value={formData.category}
              onChange={handleInputChange}
            >
              {dummyCategories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
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
            />
          </div>

          <button type="submit" className="btn-primary">
            Create
          </button>
        </form>
      )}

      {operation === 'Update' && (
        <form className="form" onSubmit={handleUpdate}>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              className="dropdown"
              value={formData.category}
              onChange={handleInputChange}
            >
              {dummyCategories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="title">Title</label>
            <select
              id="title"
              name="title"
              className="dropdown"
              value={formData.title}
              onChange={handleInputChange}
            >
              <option value="">Select a question</option>
              {dummyQuestions[formData.category]?.map((question, index) => (
                <option key={index} value={question}>
                  {question}
                </option>
              ))}
            </select>
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
            />
          </div>

          <button type="submit" className="btn-primary">
            Update
          </button>
        </form>
      )}

      {operation === 'Delete' && (
        <form className="form" onSubmit={handleDelete}>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              className="dropdown"
              value={formData.category}
              onChange={handleInputChange}
            >
              {dummyCategories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="title">Title</label>
            <select
              id="title"
              name="title"
              className="dropdown"
              value={formData.title}
              onChange={handleInputChange}
            >
              <option value="">Select a question</option>
              {dummyQuestions[formData.category]?.map((question, index) => (
                <option key={index} value={question}>
                  {question}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn-danger">
            Delete
          </button>
        </form>
      )}

      {status && (
        <div className="status-message">
          {status}
        </div>
      )}
    </div>
  );
}

export default QuestionsPage;
