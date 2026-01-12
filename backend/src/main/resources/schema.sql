-- Quiz Management System Database Schema
-- Created: 2026-01-12
-- Database: MySQL 8.0+ / H2 (compatible)

-- Drop tables if exists (for clean installation)
DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS submissions;
DROP TABLE IF EXISTS options;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS quizzes;

-- Create quizzes table
CREATE TABLE quizzes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_created_at (created_at),
    INDEX idx_title (title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
        ON DELETE CASCADE,
    INDEX idx_quiz_id (quiz_id),
    INDEX idx_question_order (question_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
        ON DELETE CASCADE,
    INDEX idx_question_id (question_id),
    INDEX idx_order_number (order_number),
    INDEX idx_is_correct (is_correct)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create submissions table
CREATE TABLE submissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quiz_id BIGINT NOT NULL,
    score INT NOT NULL DEFAULT 0,
    total_questions INT NOT NULL DEFAULT 0,
    submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_submission_quiz FOREIGN KEY (quiz_id) 
        REFERENCES quizzes(id) 
        ON DELETE CASCADE,
    INDEX idx_quiz_id (quiz_id),
    INDEX idx_submitted_at (submitted_at),
    INDEX idx_score (score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
        ON DELETE CASCADE,
    INDEX idx_submission_id (submission_id),
    INDEX idx_question_id (question_id),
    INDEX idx_is_correct (is_correct)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

-- Comments explaining the schema design
-- 
-- QUIZZES TABLE:
-- - Stores quiz metadata (title, description, timestamps)
-- - Primary table for the quiz management system
--
-- QUESTIONS TABLE:
-- - Stores individual questions linked to quizzes
-- - Supports three types: MCQ (Multiple Choice), TRUE_FALSE, TEXT (Short Answer)
-- - CASCADE DELETE: When a quiz is deleted, all its questions are deleted
--
-- OPTIONS TABLE:
-- - Stores answer options for MCQ and TRUE_FALSE questions
-- - is_correct flag indicates the correct answer(s)
-- - order_number maintains display order
-- - CASCADE DELETE: When a question is deleted, all its options are deleted
--
-- SUBMISSIONS TABLE:
-- - Stores quiz submission metadata
-- - Tracks score and total questions for quick results
-- - CASCADE DELETE: When a quiz is deleted, all submissions are deleted
--
-- ANSWERS TABLE:
-- - Stores user responses to questions
-- - Links to both submission and question
-- - user_answer stores the actual answer (option ID for MCQ, text for TEXT type)
-- - is_correct flag indicates if the answer was correct
-- - CASCADE DELETE: When submission or question is deleted, answers are deleted
