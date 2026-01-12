-- Quiz Management System Database Schema (H2 Database)
-- Created: 2026-01-12
-- Database: H2 In-Memory Database

-- Drop tables if exists (for clean installation)
DROP TABLE IF EXISTS answers CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS options CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS quizzes CASCADE;

-- Create quizzes table
CREATE TABLE quizzes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quizzes_created_at ON quizzes(created_at);
CREATE INDEX idx_quizzes_title ON quizzes(title);

-- Create questions table
CREATE TABLE questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quiz_id BIGINT NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('MCQ', 'TRUE_FALSE', 'TEXT')),
    question_text TEXT NOT NULL,
    question_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_question_quiz FOREIGN KEY (quiz_id) 
        REFERENCES quizzes(id) 
        ON DELETE CASCADE
);

CREATE INDEX idx_questions_quiz_id ON questions(quiz_id);
CREATE INDEX idx_questions_order ON questions(question_order);

-- Create options table (for MCQ and TRUE_FALSE questions)
CREATE TABLE options (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question_id BIGINT NOT NULL,
    option_text VARCHAR(500) NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    order_number INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_option_question FOREIGN KEY (question_id) 
        REFERENCES questions(id) 
        ON DELETE CASCADE
);

CREATE INDEX idx_options_question_id ON options(question_id);
CREATE INDEX idx_options_order_number ON options(order_number);
CREATE INDEX idx_options_is_correct ON options(is_correct);

-- Create submissions table
CREATE TABLE submissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quiz_id BIGINT NOT NULL,
    score INT NOT NULL DEFAULT 0,
    total_questions INT NOT NULL DEFAULT 0,
    submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_submission_quiz FOREIGN KEY (quiz_id) 
        REFERENCES quizzes(id) 
        ON DELETE CASCADE
);

CREATE INDEX idx_submissions_quiz_id ON submissions(quiz_id);
CREATE INDEX idx_submissions_submitted_at ON submissions(submitted_at);
CREATE INDEX idx_submissions_score ON submissions(score);

-- Create answers table (user responses)
CREATE TABLE answers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    submission_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    user_answer TEXT,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_answer_submission FOREIGN KEY (submission_id) 
        REFERENCES submissions(id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_answer_question FOREIGN KEY (question_id) 
        REFERENCES questions(id) 
        ON DELETE CASCADE
);

CREATE INDEX idx_answers_submission_id ON answers(submission_id);
CREATE INDEX idx_answers_question_id ON answers(question_id);
CREATE INDEX idx_answers_is_correct ON answers(is_correct);

-- Insert sample data (optional - remove in production)
-- Sample Quiz
INSERT INTO quizzes (title, description, created_at, updated_at) 
VALUES ('Sample Quiz', 'This is a sample quiz for testing', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Sample Questions
INSERT INTO questions (quiz_id, type, question_text, question_order, created_at) 
VALUES 
    (1, 'MCQ', 'What is 2 + 2?', 1, CURRENT_TIMESTAMP),
    (1, 'TRUE_FALSE', 'The sky is blue.', 2, CURRENT_TIMESTAMP),
    (1, 'TEXT', 'What is the capital of France?', 3, CURRENT_TIMESTAMP);

-- Sample Options for MCQ Question (id=1)
INSERT INTO options (question_id, option_text, is_correct, order_number, created_at) 
VALUES 
    (1, '3', FALSE, 1, CURRENT_TIMESTAMP),
    (1, '4', TRUE, 2, CURRENT_TIMESTAMP),
    (1, '5', FALSE, 3, CURRENT_TIMESTAMP),
    (1, '6', FALSE, 4, CURRENT_TIMESTAMP);

-- Sample Options for TRUE_FALSE Question (id=2)
INSERT INTO options (question_id, option_text, is_correct, order_number, created_at) 
VALUES 
    (2, 'True', TRUE, 1, CURRENT_TIMESTAMP),
    (2, 'False', FALSE, 2, CURRENT_TIMESTAMP);
