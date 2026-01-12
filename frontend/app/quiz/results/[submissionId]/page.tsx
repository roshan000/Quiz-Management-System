'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { submissionAPI } from '@/services/api';
import Link from 'next/link';

export default function Results() {
  const params = useParams();
  const submissionId = params.submissionId;

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResults();
  }, [submissionId]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await submissionAPI.getResults(submissionId);
      setResults(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load results');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading results...</p>
      </div>
    );
  }

  if (!results) {
    return (
      <div>
        <div className="error">Results not found</div>
        <Link href="/"><button>← Back to Quizzes</button></Link>
      </div>
    );
  }

  const percentage = results.totalQuestions > 0 
    ? Math.round((results.score / results.totalQuestions) * 100)
    : 0;

  const getScoreColor = () => {
    if (percentage >= 80) return '#4caf50'; // Green
    if (percentage >= 60) return '#ff9800'; // Orange
    return '#d32f2f'; // Red
  };

  return (
    <div>
      <h1>🎉 Quiz Complete!</h1>

      <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: getScoreColor(), marginBottom: '1rem' }}>
          {results.score} / {results.totalQuestions}
        </div>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: getScoreColor(), marginBottom: '1rem' }}>
          {percentage}%
        </div>
        <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
          {percentage >= 80 && '🌟 Excellent! You nailed it!'}
          {percentage >= 60 && percentage < 80 && '👍 Good job! Keep practicing!'}
          {percentage < 60 && '💪 Keep learning! Try again!'}
        </p>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>
          Submitted: {new Date(results.submittedAt).toLocaleString()}
        </p>
      </div>

      <h2>Answer Review</h2>
      {results.answers && results.answers.map((answer, idx) => (
        <div
          key={idx}
          className="card"
          style={{
            borderLeft: answer.isCorrect ? '4px solid #4caf50' : '4px solid #d32f2f',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div style={{ flex: 1 }}>
              <h3>
                Q{idx + 1}: {answer.questionText}
              </h3>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Your answer:</strong> {answer.userAnswer || '(No answer)'}
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Correct answer:</strong> {answer.correctAnswer}
              </p>
            </div>
            <div
              style={{
                textAlign: 'center',
                fontSize: '2rem',
                fontWeight: 'bold',
                color: answer.isCorrect ? '#4caf50' : '#d32f2f',
                marginLeft: '1rem',
              }}
            >
              {answer.isCorrect ? '✓' : '✗'}
            </div>
          </div>
        </div>
      ))}

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', marginBottom: '2rem' }}>
        <Link href="/">
          <button style={{ flex: 1 }}>← Back to Quizzes</button>
        </Link>
        <Link href="/admin">
          <button style={{ flex: 1, background: '#666' }}>Admin Panel</button>
        </Link>
      </div>
    </div>
  );
}
