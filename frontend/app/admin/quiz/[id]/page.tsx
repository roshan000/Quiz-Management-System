'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { quizAPI, questionAPI, optionAPI } from '@/services/api';
import Link from 'next/link';

export default function EditQuiz() {
  const params = useParams();
  const quizId = params.id;

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [newQuestion, setNewQuestion] = useState({ type: 'MCQ', text: '' });
  const [newOption, setNewOption] = useState({ text: '', isCorrect: false });

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

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.text.trim()) {
      setError('Question text is required');
      return;
    }

    try {
      await questionAPI.addQuestion(quizId, newQuestion.type, newQuestion.text);
      setSuccess('Question added! Now add options.');
      setNewQuestion({ type: 'MCQ', text: '' });
      await fetchQuiz();
    } catch (err) {
      setError('Failed to add question');
      console.error(err);
    }
  };

  const handleAddOption = async (questionId) => {
    if (!newOption.text.trim()) {
      setError('Option text is required');
      return;
    }

    try {
      await optionAPI.addOption(questionId, newOption.text, newOption.isCorrect, 0);
      setSuccess('Option added!');
      setNewOption({ text: '', isCorrect: false });
      await fetchQuiz();
    } catch (err) {
      setError('Failed to add option');
      console.error(err);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (confirm('Delete this question?')) {
      try {
        await questionAPI.deleteQuestion(quizId, questionId);
        setSuccess('Question deleted');
        await fetchQuiz();
      } catch (err) {
        setError('Failed to delete question');
        console.error(err);
      }
    }
  };

  const handleDeleteOption = async (questionId, optionId) => {
    try {
      await optionAPI.deleteOption(questionId, optionId);
      setSuccess('Option deleted');
      await fetchQuiz();
    } catch (err) {
      setError('Failed to delete option');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div>
        <Link href="/admin"><button>← Back to Admin</button></Link>
        <div className="loading"><div className="spinner"></div></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div>
        <Link href="/admin"><button>← Back to Admin</button></Link>
        <div className="error">Quiz not found</div>
      </div>
    );
  }

  return (
    <div>
      <Link href="/admin"><button>← Back to Admin</button></Link>
      <h1>✏️ Edit Quiz: {quiz.title}</h1>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="card">
        <h2>Questions</h2>
        {quiz.questions && quiz.questions.length > 0 ? (
          <div>
            {quiz.questions.map((question, idx) => (
              <div
                key={question.id}
                style={{
                  border: '1px solid #ddd',
                  padding: '1rem',
                  marginBottom: '1rem',
                  borderRadius: '4px',
                  background: '#fafafa',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      Q{idx + 1}: {question.questionText}
                    </p>
                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                      Type: <strong>{question.type}</strong>
                    </p>

                    {question.options && question.options.length > 0 ? (
                      <div style={{ marginTop: '0.5rem' }}>
                        <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Options:</p>
                        {question.options.map((option) => (
                          <div
                            key={option.id}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '0.5rem',
                              background: '#fff',
                              marginBottom: '0.5rem',
                              borderRadius: '4px',
                              border: option.isCorrect ? '2px solid #4caf50' : '1px solid #ddd',
                            }}
                          >
                            <span>
                              {option.optionText}
                              {option.isCorrect && <strong style={{ color: '#4caf50' }}> ✓</strong>}
                            </span>
                            <button
                              onClick={() => handleDeleteOption(question.id, option.id)}
                              style={{ background: '#d32f2f', padding: '0.25rem 0.5rem' }}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontSize: '0.9rem', color: '#999' }}>No options yet</p>
                    )}

                    {editingQuestion === question.id && (
                      <div style={{ marginTop: '1rem', padding: '1rem', background: '#fff', borderRadius: '4px' }}>
                        <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Add Option:</p>
                        <div className="form-group">
                          <input
                            type="text"
                            value={newOption.text}
                            onChange={(e) => setNewOption({ ...newOption, text: e.target.value })}
                            placeholder="Option text"
                          />
                        </div>
                        <div className="form-group">
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                              type="checkbox"
                              checked={newOption.isCorrect}
                              onChange={(e) => setNewOption({ ...newOption, isCorrect: e.target.checked })}
                              style={{ width: 'auto' }}
                            />
                            Mark as correct answer
                          </label>
                        </div>
                        <button onClick={() => handleAddOption(question.id)}>
                          Add Option
                        </button>
                        <button onClick={() => setEditingQuestion(null)} style={{ marginLeft: '0.5rem' }}>
                          Done
                        </button>
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column', marginLeft: '1rem' }}>
                    <button
                      onClick={() => setEditingQuestion(question.id)}
                      disabled={editingQuestion !== null && editingQuestion !== question.id}
                    >
                      {editingQuestion === question.id ? 'Adding...' : 'Add Option'}
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(question.id)}
                      style={{ background: '#d32f2f' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No questions yet</p>
        )}
      </div>

      <div className="card">
        <h2>Add New Question</h2>
        <form onSubmit={handleAddQuestion}>
          <div className="form-group">
            <label>Question Type</label>
            <select
              value={newQuestion.type}
              onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
            >
              <option value="MCQ">Multiple Choice (MCQ)</option>
              <option value="TRUE_FALSE">True / False</option>
              <option value="TEXT">Short Answer (Text)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Question Text</label>
            <textarea
              value={newQuestion.text}
              onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
              placeholder="Enter your question"
              style={{ minHeight: '100px' }}
            />
          </div>
          <button type="submit">Add Question</button>
        </form>
      </div>
    </div>
  );
}
