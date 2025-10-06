import { useState } from 'react';

function EditCategory({ category, onBack }) {
  const [categoryName, setCategoryName] = useState(category);
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updating category:', categoryName);
    setStatus('Category updated successfully!');
    setTimeout(() => {
      setStatus('');
      onBack();
    }, 2000);
  };

  return (
    <div className="edit-category-page">
      <button className="back-button" onClick={onBack}>
        ← <span>Back to Overview</span>
      </button>

      <h1>Edit Category</h1>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="categoryName">Category Name</label>
          <input
            type="text"
            id="categoryName"
            className="input"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
            required
          />
        </div>

        <button type="submit" className="btn-primary">
          Update Category
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

export default EditCategory;
