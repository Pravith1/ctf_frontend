import { useState } from 'react';

function ViewPage() {
  const dummyCategories = ['Web Exploitation', 'Cryptography', 'Reverse Engineering', 'Binary Exploitation', 'Forensics'];

  const dummyQuestions = {
    'Web Exploitation': ['SQL Injection Challenge', 'XSS Attack', 'CSRF Token Bypass'],
    'Cryptography': ['Caesar Cipher', 'RSA Challenge', 'AES Decryption'],
    'Reverse Engineering': ['Crack the Binary', 'Assembly Analysis', 'Obfuscated Code'],
    'Binary Exploitation': ['Buffer Overflow', 'Format String Attack', 'ROP Chain'],
    'Forensics': ['Image Analysis', 'Network Traffic', 'Memory Dump']
  };

  const [selectedCategory, setSelectedCategory] = useState(dummyCategories[0]);

  return (
    <div className="view-page">
      <h1>View</h1>

      <div className="view-section">
        <h2>All Categories</h2>
        <div className="categories-list">
          {dummyCategories.map((category, index) => (
            <div key={index} className="category-item">
              {category}
            </div>
          ))}
        </div>
      </div>

      <div className="view-section">
        <h2>Questions by Category</h2>
        <select
          className="dropdown"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {dummyCategories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>

        <div className="questions-list">
          {dummyQuestions[selectedCategory]?.map((question, index) => (
            <div key={index} className="question-item">
              {question}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ViewPage;
