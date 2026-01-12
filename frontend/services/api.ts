import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Quiz APIs
export const quizAPI = {
  getAllQuizzes: () => api.get('/quizzes'),
  getQuizById: (id) => api.get(`/quizzes/${id}`),
  createQuiz: (title, description) =>
    api.post('/quizzes', { title, description }),
  updateQuiz: (id, title, description) =>
    api.put(`/quizzes/${id}`, { title, description }),
  deleteQuiz: (id) => api.delete(`/quizzes/${id}`),
};

// Question APIs
export const questionAPI = {
  addQuestion: (quizId, type, questionText) =>
    api.post(`/quizzes/${quizId}/questions`, {
      type,
      questionText,
    }),
  updateQuestion: (quizId, questionId, questionText) =>
    api.put(`/quizzes/${quizId}/questions/${questionId}`, {
      questionText,
    }),
  deleteQuestion: (quizId, questionId) =>
    api.delete(`/quizzes/${quizId}/questions/${questionId}`),
};

// Option APIs
export const optionAPI = {
  addOption: (questionId, optionText, isCorrect, optionOrder = 0) =>
    api.post(`/questions/${questionId}/options`, {
      optionText,
      isCorrect,
      optionOrder,
    }),
  updateOption: (questionId, optionId, optionText, isCorrect) =>
    api.put(`/questions/${questionId}/options/${optionId}`, {
      optionText,
      isCorrect,
    }),
  deleteOption: (questionId, optionId) =>
    api.delete(`/questions/${questionId}/options/${optionId}`),
};

// Submission APIs
export const submissionAPI = {
  submitQuiz: (quizId, answers) =>
    api.post('/submissions', {
      quizId,
      answers,
    }),
  getResults: (submissionId) =>
    api.get(`/submissions/${submissionId}`),
};

export default api;
