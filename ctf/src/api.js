import axios from 'axios';

// Use hosted backend URL or fallback to Vite env or localhost
const BASE_URL ='http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // CRITICAL: Send cookies with requests
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`📤 ${config.method.toUpperCase()} ${config.url}`);
    console.log('🍪 Cookies being sent:', document.cookie || 'No cookies found');
    console.log('📋 Request config:', {
      withCredentials: config.withCredentials,
      baseURL: config.baseURL
    });
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Central response handler
api.interceptors.response.use(
  (res) => {
    console.log(`📥 Response from ${res.config.url}:`, res.status);
    console.log('✅ Response headers:', res.headers);
    if (res.headers['set-cookie']) {
      console.log('🍪 Backend set cookie:', res.headers['set-cookie']);
    }
    return res;
  },
  (err) => {
    console.error(`❌ Error from ${err.config?.url}:`, err.response?.status, err.response?.data);
    console.error('🍪 Current cookies:', document.cookie || 'No cookies');
    
    // Handle 401 Unauthorized errors
    if (err.response?.status === 401) {
      const currentPath = window.location.pathname;
      console.warn('⚠️ 401 Unauthorized - JWT Cookie is missing or invalid!');
      console.error('💥 THIS IS WHY YOUR COOKIE IS "CLEARED" - Backend rejected it!');
      console.error('🔧 Backend needs to fix cookie configuration (sameSite, secure, path)');
      
      // Only redirect to login if not already on login page
      if (currentPath !== '/' && currentPath !== '/login') {
        console.log('🔄 Redirecting to login page...');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
    }
    return Promise.reject(err);
  }
);

// Auth endpoints
export const signup = async (payload) => {
  const res = await api.post('/auth/signup', payload);
  return res.data;
};

export const login = async (payload) => {
  const res = await api.post('/auth/login', payload);
  console.log(res.data);
  return res.data;
};

export const logout = async () => {
  const res = await api.post('/auth/logout');
  return res.data;
};

// Check if user is admin
export const checkIsAdmin = async () => {
  const res = await api.get('/admin/isAdmin');
  return res.data;
};

// Leaderboard endpoints
export const fetchLeaderboard = async () => {
  const res = await api.get('/leaderboard');
  return res.data;
};

// Submission endpoints
export const submitAnswer = async ({ question_id, submitted_answer }) => {
  const res = await api.post('/submission', { question_id, submitted_answer });
  return res.data;
};

export const fetchSubmissionCategories = async () => {
  const res = await api.get('/submission/categories');
  return res.data;
};

export const fetchQuestionsByCategory = async (categoryId) => {
  const res = await api.post('/submission/questions', { categoryId });
  return res.data;
};

// Get individual question details
export const fetchQuestionDetails = async (question_id) => {
  const res = await api.post('/submission/question', { question_id });
  return res.data;
};

// Check if question is solved
export const checkQuestionSolved = async (question_id) => {
  const res = await api.post('/submission/is-solved', { question_id });
  return res.data;
};

// Fetch solved questions by category
export const fetchSolvedQuestions = async (categoryId) => {
  const res = await api.post('/submission/solved', { categoryId });
  return res.data;
};

// Fetch unsolved questions by category
export const fetchUnsolvedQuestions = async (categoryId) => {
  const res = await api.post('/submission/un-solved', { categoryId });
  return res.data;
};

// Admin endpoints (require auth/admin)
export const getCategoriesAdmin = async () => {
  const res = await api.get('/admin/categories');
  return res.data;
};

export const createCategoryAdmin = async (payload) => {
  const res = await api.post('/admin/categories', payload);
  return res.data;
};

// New endpoints for updating/deleting categories
export const updateCategoryAdmin = async (id, payload) => {
  const res = await api.patch(`/admin/categories/${id}`, payload);
  return res.data;
};

export const deleteCategoryAdmin = async (id) => {
  const res = await api.delete(`/admin/categories/${id}`);
  return res.data;
};

export const getQuestionsAdmin = async () => {
  const res = await api.get('/admin/questions');
  return res.data;
};

export const createQuestionAdmin = async (payload) => {
  const res = await api.post('/admin/questions', payload);
  return res.data;
};

export const updateQuestionAdmin = async (id, payload) => {
  const res = await api.patch(`/admin/questions/${id}`, payload);
  return res.data;
};

export const deleteQuestionAdmin = async (id) => {
  const res = await api.delete(`/admin/questions/${id}`);
  return res.data;
};

// Generic helpers
export const getBackendUrl = () => BASE_URL;

export default {
  api,
  signup,
  login,
  logout,
  fetchLeaderboard,
  submitAnswer,
  fetchSubmissionCategories,
  fetchQuestionsByCategory,
  getCategoriesAdmin,
  createCategoryAdmin,
  updateCategoryAdmin,
  deleteCategoryAdmin,
  getQuestionsAdmin,
  createQuestionAdmin,
  updateQuestionAdmin,
  deleteQuestionAdmin,
  getBackendUrl
};
