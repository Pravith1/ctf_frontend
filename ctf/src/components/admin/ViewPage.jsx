import { useState } from 'react';

function ViewPage({ onEditCategory, onEditQuestion }) {
  const dummyCategories = ['Web Exploitation', 'Cryptography', 'Reverse Engineering', 'Binary Exploitation', 'Forensics'];

  const dummyQuestions = {
    'Web Exploitation': [
      { title: 'SQL Injection Challenge', link: 'https://example.com/sql', description: 'Exploit SQL injection vulnerability', answer: 'flag{sql_injection}', points: '100' },
      { title: 'XSS Attack', link: 'https://example.com/xss', description: 'Find XSS vulnerability', answer: 'flag{xss_found}', points: '150' },
      { title: 'CSRF Token Bypass', link: 'https://example.com/csrf', description: 'Bypass CSRF protection', answer: 'flag{csrf_bypass}', points: '200' }
    ],
    'Cryptography': [
      { title: 'Caesar Cipher', link: 'https://example.com/caesar', description: 'Decrypt Caesar cipher', answer: 'flag{caesar}', points: '50' },
      { title: 'RSA Challenge', link: 'https://example.com/rsa', description: 'Break RSA encryption', answer: 'flag{rsa_broken}', points: '300' },
      { title: 'AES Decryption', link: 'https://example.com/aes', description: 'Decrypt AES', answer: 'flag{aes_decrypt}', points: '250' }
    ],
    'Reverse Engineering': [
      { title: 'Crack the Binary', link: 'https://example.com/binary', description: 'Reverse engineer binary', answer: 'flag{cracked}', points: '200' },
      { title: 'Assembly Analysis', link: 'https://example.com/asm', description: 'Analyze assembly code', answer: 'flag{asm}', points: '150' },
      { title: 'Obfuscated Code', link: 'https://example.com/obfuscated', description: 'Deobfuscate code', answer: 'flag{deobfuscated}', points: '250' }
    ],
    'Binary Exploitation': [
      { title: 'Buffer Overflow', link: 'https://example.com/bof', description: 'Exploit buffer overflow', answer: 'flag{bof}', points: '300' },
      { title: 'Format String Attack', link: 'https://example.com/format', description: 'Format string vulnerability', answer: 'flag{format}', points: '200' },
      { title: 'ROP Chain', link: 'https://example.com/rop', description: 'Create ROP chain', answer: 'flag{rop}', points: '400' }
    ],
    'Forensics': [
      { title: 'Image Analysis', link: 'https://example.com/image', description: 'Analyze image for hidden data', answer: 'flag{steganography}', points: '100' },
      { title: 'Network Traffic', link: 'https://example.com/network', description: 'Analyze network packets', answer: 'flag{pcap}', points: '150' },
      { title: 'Memory Dump', link: 'https://example.com/memory', description: 'Analyze memory dump', answer: 'flag{memory}', points: '250' }
    ]
  };

  const [selectedCategory, setSelectedCategory] = useState(dummyCategories[0]);

  const handleDeleteCategory = (category) => {
    if (window.confirm(`Are you sure you want to delete the category "${category}"?`)) {
      console.log('Deleting category:', category);
    }
  };

  const handleDeleteQuestion = (category, question) => {
    if (window.confirm(`Are you sure you want to delete the question "${question.title}"?`)) {
      console.log('Deleting question:', question.title);
    }
  };

  return (
    <div className="view-page">
      <h1>Overview</h1>

      <div className="view-section">
        <h2>All Categories</h2>
        <div className="categories-list">
          {dummyCategories.map((category, index) => (
            <div key={index} className="list-item">
              <span className="item-text">{category}</span>
              <div className="item-actions">
                <button
                  className="icon-btn edit-btn"
                  onClick={() => onEditCategory(category)}
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  className="icon-btn delete-btn"
                  onClick={() => handleDeleteCategory(category)}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
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
            <div key={index} className="list-item">
              <span className="item-text">{question.title}</span>
              <div className="item-actions">
                <button
                  className="icon-btn edit-btn"
                  onClick={() => onEditQuestion(selectedCategory, question)}
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  className="icon-btn delete-btn"
                  onClick={() => handleDeleteQuestion(selectedCategory, question)}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ViewPage;
