'use client';

import { useEffect, useState } from 'react';
import { quizAPI } from '@/services/api';
import Link from 'next/link';

export default function Home() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      setError('Failed to load quizzes. Make sure the backend is running on http://localhost:8080');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading quizzes...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>📚 Available Quizzes</h1>
      {error && <div className="error">{error}</div>}
      
      {quizzes.length === 0 ? (
        <div className="card">
          <p>No quizzes available yet. <Link href="/admin">Create one in the admin panel.</Link></p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="card">
              <h3>{quiz.title}</h3>
              <p>{quiz.description}</p>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                Questions: {quiz.questions?.length || 0}
              </p>
              <Link href={`/quiz/${quiz.id}`}>
                <button style={{ width: '100%', marginTop: '1rem' }}>
                  Take Quiz →
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
