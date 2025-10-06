import { useState } from 'react';

function CategoriesPage() {
  const [categoryName, setCategoryName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Creating category:', categoryName);
    setCategoryName('');
  };

  return (
    <div className="categories-page">
      <h1>Categories</h1>

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
          />
        </div>

        <button type="submit" className="btn-primary">
          Create
        </button>
      </form>
    </div>
  );
}

export default CategoriesPage;
