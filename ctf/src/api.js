import axios from 'axios';

// Use hosted backend URL or fallback to Vite env or localhost
const BASE_URL =
  'https://ctf-backend-1.onrender.com' || // Hosted backend
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_BACKEND_URL) ||
  process.env.BACKEND_URL ||
  'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies (jwt) to backend
  headers: {
    'Content-Type': 'application/json'
  }
});

// Central response handler (optional)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Global error handling example: 401 -> redirect to login
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
  return res.data;
};

export const logout = async () => {
  const res = await api.post('/auth/logout');
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
