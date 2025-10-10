import { useEffect, useState } from 'react';
import { deleteCategoryAdmin } from '../../api.js';

function CategoriesPage({ categories: initial = [], onEditCategory, refreshData }) {
  const [categories, setCategories] = useState(initial || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCategories(initial || []);
  }, [initial]);

  const handleDelete = async (cat) => {
    if (!cat?._id) return;
    if (!window.confirm(`Delete category "${cat.name}"?`)) return;
    try {
      setLoading(true);
      await deleteCategoryAdmin(cat._id);
      if (refreshData) await refreshData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="categories-page">
      <h1>Categories</h1>
      <div className="categories-list">
        {categories.length === 0 && <p style={{ color: '#999' }}>No categories found.</p>}
        {categories.map(cat => (
          <div key={cat._id} className="list-item">
            <span className="item-text">{cat.name}</span>
            <div className="item-actions">
              <button className="icon-btn edit-btn" onClick={() => onEditCategory(cat)} title="Edit">✏️</button>
              <button className="icon-btn delete-btn" onClick={() => handleDelete(cat)} title="Delete">🗑️</button>
            </div>
          </div>
        ))}
      </div>
      {loading && <div style={{ color: '#666', marginTop: 8 }}>Processing...</div>}
    </div>
  );
}

export default CategoriesPage;

