'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { quizAPI, submissionAPI } from '@/services/api';
import Link from 'next/link';

export default function TakeQuiz() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id;

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const response = await quizAPI.getQuizById(quizId);
      setQuiz(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load quiz');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionAnswers = quiz.questions.map((q) => ({
      questionId: q.id,
      userAnswer: answers[q.id] || '',
    }));

    try {
      setSubmitting(true);
      const response = await submissionAPI.submitQuiz(quizId, submissionAnswers);
      router.push(`/quiz/results/${response.data.submissionId}`);
    } catch (err) {
      setError('Failed to submit quiz');
      console.error(err);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Link href="/"><button>← Back to Quizzes</button></Link>
        <div className="loading"><div className="spinner"></div></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div>
        <Link href="/"><button>← Back to Quizzes</button></Link>
        <div className="error">Quiz not found</div>
      </div>
    );
  }

  const allAnswered = quiz.questions && quiz.questions.every((q) => answers[q.id]);

  return (
    <div>
      <Link href="/"><button>← Back to Quizzes</button></Link>
      <h1>📝 {quiz.title}</h1>
      {quiz.description && <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '1rem' }}>{quiz.description}</p>}

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          {quiz.questions && quiz.questions.length > 0 ? (
            quiz.questions.map((question, idx) => (
              <div key={question.id} className="card">
                <h3>
                  Q{idx + 1}: {question.questionText}
                </h3>

                {question.type === 'MCQ' && (
                  <div>
                    {question.options && question.options.map((option, optIdx) => (
                      <label
                        key={option.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0.75rem',
                          marginBottom: '0.5rem',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          background: answers[question.id] === String(option.id) ? '#e3f2fd' : '#fff',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option.id}
                          checked={answers[question.id] === String(option.id)}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          style={{ marginRight: '0.75rem', width: 'auto' }}
                        />
                        <strong>{String.fromCharCode(65 + optIdx)}.</strong> {option.optionText}
                      </label>
                    ))}
                  </div>
                )}

                {question.type === 'TRUE_FALSE' && (
                  <div>
                    {question.options && question.options.map((option) => (
                      <label
                        key={option.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0.75rem',
                          marginBottom: '0.5rem',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          background: answers[question.id] === String(option.id) ? '#e3f2fd' : '#fff',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option.id}
                          checked={answers[question.id] === String(option.id)}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          style={{ marginRight: '0.75rem', width: 'auto' }}
                        />
                        {option.optionText}
                      </label>
                    ))}
                  </div>
                )}

                {question.type === 'TEXT' && (
                  <input
                    type="text"
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    placeholder="Enter your answer"
                  />
                )}
              </div>
            ))
          ) : (
            <p>No questions in this quiz</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!allAnswered || submitting}
          style={{
            marginTop: '2rem',
            padding: '1rem 2rem',
            fontSize: '1.1rem',
            width: '100%',
          }}
        >
          {submitting ? '⏳ Submitting...' : allAnswered ? '✓ Submit Quiz' : '⚠️ Answer all questions to submit'}
        </button>
      </form>
    </div>
  );
}
