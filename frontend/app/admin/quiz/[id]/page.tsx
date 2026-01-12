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
  const [mcqOptions, setMcqOptions] = useState([
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ]);
  const [trueFalseAnswer, setTrueFalseAnswer] = useState('True');

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
      const response = await questionAPI.addQuestion(quizId, newQuestion.type, newQuestion.text);
      const questionId = response.data.id;
      
      // Auto-create options based on question type
      if (newQuestion.type === 'TRUE_FALSE') {
        await optionAPI.addOption(questionId, 'True', trueFalseAnswer === 'True', 1);
        await optionAPI.addOption(questionId, 'False', trueFalseAnswer === 'False', 2);
        setSuccess('True/False question added with options!');
        setTrueFalseAnswer('True');
      } else if (newQuestion.type === 'MCQ') {
        // Filter out empty options and add them
        const validOptions = mcqOptions.filter(opt => opt.text.trim() !== '');
        if (validOptions.length < 2) {
          setError('Please add at least 2 options for MCQ');
          // Delete the question since it was already created
          await questionAPI.deleteQuestion(quizId, questionId);
          return;
        }
        
        for (let i = 0; i < validOptions.length; i++) {
          await optionAPI.addOption(questionId, validOptions[i].text, validOptions[i].isCorrect, i + 1);
        }
        setSuccess('MCQ question added with ' + validOptions.length + ' options!');
        setMcqOptions([
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
        ]);
      } else {
        setSuccess('Text question added!');
      }
      
      setNewQuestion({ type: 'MCQ', text: '' });
      await fetchQuiz();
    } catch (err) {
      setError('Failed to add question: ' + (err.response?.data?.message || err.message));
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
                    ) : question.type === 'TEXT' ? (
                      <p style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic' }}>
                        ✍️ Text answer (no options needed)
                      </p>
                    ) : (
                      <p style={{ fontSize: '0.9rem', color: '#e53935' }}>⚠️ No options - click "Add Option" below</p>
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
                    {question.type === 'MCQ' && (
                      <button
                        onClick={() => setEditingQuestion(question.id)}
                        disabled={editingQuestion !== null && editingQuestion !== question.id}
                      >
                        {editingQuestion === question.id ? 'Adding...' : 'Add Option'}
                      </button>
                    )}
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
              required
            />
          </div>

          {/* MCQ Options */}
          {newQuestion.type === 'MCQ' && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Answer Options</h3>
              {mcqOptions.map((option, index) => (
                <div key={index} style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>
                    Option {index + 1}
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => {
                        const newOptions = [...mcqOptions];
                        newOptions[index].text = e.target.value;
                        setMcqOptions(newOptions);
                      }}
                      placeholder={`Enter option ${index + 1}`}
                      style={{ flex: 1 }}
                    />
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', whiteSpace: 'nowrap' }}>
                      <input
                        type="checkbox"
                        checked={option.isCorrect}
                        onChange={(e) => {
                          const newOptions = [...mcqOptions];
                          newOptions[index].isCorrect = e.target.checked;
                          setMcqOptions(newOptions);
                        }}
                        style={{ width: 'auto', margin: 0 }}
                      />
                      <span style={{ fontSize: '0.9rem' }}>Correct</span>
                    </label>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setMcqOptions([...mcqOptions, { text: '', isCorrect: false }])}
                style={{ marginTop: '0.5rem', background: '#666', fontSize: '0.9rem', padding: '0.5rem 1rem' }}
              >
                + Add More Option
              </button>
            </div>
          )}

          {/* True/False Options */}
          {newQuestion.type === 'TRUE_FALSE' && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Select Correct Answer</h3>
              <div style={{ display: 'flex', gap: '2rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="trueFalse"
                    value="True"
                    checked={trueFalseAnswer === 'True'}
                    onChange={(e) => setTrueFalseAnswer(e.target.value)}
                    style={{ width: 'auto', margin: 0 }}
                  />
                  <span style={{ fontSize: '1rem', fontWeight: '500' }}>True</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="trueFalse"
                    value="False"
                    checked={trueFalseAnswer === 'False'}
                    onChange={(e) => setTrueFalseAnswer(e.target.value)}
                    style={{ width: 'auto', margin: 0 }}
                  />
                  <span style={{ fontSize: '1rem', fontWeight: '500' }}>False</span>
                </label>
              </div>
            </div>
          )}

          {/* Text Answer Info */}
          {newQuestion.type === 'TEXT' && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#e3f2fd', borderRadius: '4px' }}>
              <p style={{ margin: 0, color: '#1976d2' }}>
                ℹ️ Text questions allow users to type their own answer. No options needed.
              </p>
            </div>
          )}

          <button type="submit" style={{ marginTop: '1rem' }}>Add Question</button>
        </form>
      </div>
    </div>
  );
}
