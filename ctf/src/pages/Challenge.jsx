import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CTFHeader from '../components/layout/CTFHeader';
import ChallengeFilters from '../components/challenges/ChallengeFilters';
import QuestionsGrid from '../components/challenges/QuestionsGrid';
import { 
  fetchSubmissionCategories, 
  fetchQuestionsByCategory, 
  fetchSolvedQuestions, 
  fetchUnsolvedQuestions 
} from '../api';
import './chalenge.css';

const ChallengesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [solvedFilter, setSolvedFilter] = useState('All');
  const [orderFilter, setOrderFilter] = useState('Points');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Fetch questions when category or solved filter changes
  useEffect(() => {
    if (selectedCategory) {
      loadQuestions(selectedCategory, solvedFilter);
    }
  }, [selectedCategory, solvedFilter]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetchSubmissionCategories();
      if (response.success) {
        setCategories(response.data);
        // Auto-select first category
        if (response.data.length > 0) {
          setSelectedCategory(response.data[0]._id);
          setCategoryFilter(response.data[0].name);
        }
      } else {
        setError('No categories available');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load categories. Please login again.');
    } finally {
      setLoading(false);
    }
  };

  const loadQuestions = async (categoryId, filter = 'All') => {
    try {
      setLoading(true);
      setError('');
      
      let response;
      
      // Choose endpoint based on filter
      switch (filter) {
        case 'Solved':
          response = await fetchSolvedQuestions(categoryId);
          break;
        case 'Unsolved':
          response = await fetchUnsolvedQuestions(categoryId);
          break;
        case 'All':
        default:
          response = await fetchQuestionsByCategory(categoryId);
          break;
      }
      
      if (response.success) {
        // Handle different response structures
        if (filter === 'Solved') {
          setQuestions(response.data.questions || []);
        } else if (filter === 'Unsolved') {
          setQuestions(response.data.unsolvedQuestions || []);
        } else {
          setQuestions(response.data.questions || []);
        }
      } else {
        setQuestions([]);
        setError(`No ${filter.toLowerCase()} questions available for this category`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load questions');
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = useCallback((categoryName) => {
    setCategoryFilter(categoryName);
    const category = categories.find(c => c.name === categoryName);
    if (category) {
      setSelectedCategory(category._id);
    }
  }, [categories]);

  const handleSolvedFilterChange = useCallback((filter) => {
    setSolvedFilter(filter);
  }, []);

  const handleOrderFilterChange = useCallback((order) => {
    setOrderFilter(order);
  }, []);

  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const handleChallengeClick = useCallback((question) => {
    console.log('🔍 Challenge: Navigating with question data:', {
      title: question.title,
      link: question.link,
      hint: question.hint,
      questionKeys: Object.keys(question),
      fullQuestion: question
    });
    
    navigate(`/challenge/${question._id}`, { 
      state: { 
        challenge: {
          _id: question._id, // MongoDB ID
          id: question._id,  // Also keep id for compatibility
          title: question.title,
          description: question.description,
          points: question.point,
          difficulty: question.difficulty,
          category: question.categoryId?.name || categoryFilter,
          year: question.year,
          solves: question.solved_count || 0,
          link: question.link,  // Add the missing link field!
          linkText: question.link ? 'Download File' : null,
          linkUrl: question.link,
          hint: question.hint || null  // Add hint field
        } 
      } 
    });
  }, [navigate, categoryFilter]);

  // Memoize filtered and sorted questions
  const filteredQuestions = useMemo(() => {
    let filtered = [...questions];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(q => 
        q.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort based on orderFilter
    filtered.sort((a, b) => {
      switch (orderFilter) {
        case 'Points':
          return b.point - a.point; // High to low
        case 'Solves':
          return (b.solved_count || 0) - (a.solved_count || 0);
        case 'Newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'Oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        default:
          return 0;
      }
    });

    return filtered;
  }, [questions, searchQuery, orderFilter]);

  if (loading) {
    return (
      <div className="ctflearn-container">
        <CTFHeader />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          color: '#fff',
          fontSize: '18px'
        }}>
          Loading challenges...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ctflearn-container">
        <CTFHeader />
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          color: '#ef4444',
          fontSize: '18px',
          gap: '16px'
        }}>
          <div>{error}</div>
          <button
            onClick={loadCategories}
            style={{
              padding: '12px 24px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ctflearn-container">
      <CTFHeader />

      <main className="main-content">
        <ChallengeFilters
          categories={categories}
          categoryFilter={categoryFilter}
          solvedFilter={solvedFilter}
          orderFilter={orderFilter}
          searchQuery={searchQuery}
          onCategoryChange={handleCategoryChange}
          onSolvedFilterChange={handleSolvedFilterChange}
          onOrderFilterChange={handleOrderFilterChange}
          onSearchChange={handleSearchChange}
        />

        <QuestionsGrid
          questions={filteredQuestions}
          solvedFilter={solvedFilter}
          categoryFilter={categoryFilter}
          onQuestionClick={handleChallengeClick}
        />
      </main>
    </div>
  );
};

export default ChallengesPage;