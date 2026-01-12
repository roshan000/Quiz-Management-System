'use client';

import { useEffect, useState } from 'react';
import { quizAPI, questionAPI, optionAPI } from '@/services/api';
import Link from 'next/link';

export default function AdminPanel() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await quizAPI.getAllQuizzes();
      setQuizzes(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load quizzes. Make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Quiz title is required');
      return;
    }

    try {
      setLoading(true);
      await quizAPI.createQuiz(formData.title, formData.description);
      setSuccess('Quiz created successfully!');
      setFormData({ title: '', description: '' });
      setShowCreateForm(false);
      setError('');
      await fetchQuizzes();
    } catch (err) {
      setError('Failed to create quiz');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (confirm('Are you sure you want to delete this quiz?')) {
      try {
        await quizAPI.deleteQuiz(quizId);
        setSuccess('Quiz deleted successfully!');
        await fetchQuizzes();
      } catch (err) {
        setError('Failed to delete quiz');
        console.error(err);
      }
    }
  };

  return (
    <div>
      <h1>🔧 Admin Panel</h1>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="card">
        {!showCreateForm ? (
          <button onClick={() => setShowCreateForm(true)}>+ Create New Quiz</button>
        ) : (
          <form onSubmit={handleCreateQuiz}>
            <h3>Create a New Quiz</h3>
            <div className="form-group">
              <label>Quiz Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., JavaScript Basics"
              />
            </div>
            <div className="form-group">
              <label>Description (Optional)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what this quiz is about"
                style={{ minHeight: '100px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Quiz'}
              </button>
              <button type="button" onClick={() => setShowCreateForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <h2>Your Quizzes</h2>
      {loading && !showCreateForm ? (
        <div className="loading"><div className="spinner"></div></div>
      ) : quizzes.length === 0 ? (
        <div className="card">
          <p>No quizzes yet. Create one to get started!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3>{quiz.title}</h3>
                  <p>{quiz.description}</p>
                  <p style={{ fontSize: '0.9rem', color: '#666' }}>
                    Questions: {quiz.questions?.length || 0}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                  <Link href={`/admin/quiz/${quiz.id}`}>
                    <button style={{ width: '100%' }}>Edit</button>
                  </Link>
                  <button
                    onClick={() => handleDeleteQuiz(quiz.id)}
                    style={{ background: '#d32f2f' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
