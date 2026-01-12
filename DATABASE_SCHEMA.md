# Database Schema Documentation

## Overview
The Quiz Management System uses a relational database with 5 main tables to manage quizzes, questions, options, submissions, and user answers.

## Database Files

### 1. `schema.sql`
- **Purpose**: MySQL 8.0+ compatible schema
- **Use Case**: Production deployment with MySQL
- **Features**: 
  - InnoDB storage engine
  - UTF-8 MB4 character set
  - Optimized indexes
  - Sample data included

### 2. `schema-h2.sql`
- **Purpose**: H2 Database compatible schema
- **Use Case**: Development and testing
- **Features**:
  - In-memory database support
  - Fast startup for local development
  - Compatible with Hibernate auto-DDL

## Tables

### 1. QUIZZES
Stores quiz metadata.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique quiz identifier |
| title | VARCHAR(255) | NOT NULL | Quiz title |
| description | TEXT | | Quiz description |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Indexes:**
- `idx_created_at` - For sorting by creation date
- `idx_title` - For searching by title

---

### 2. QUESTIONS
Stores individual questions for each quiz.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique question identifier |
| quiz_id | BIGINT | NOT NULL, FOREIGN KEY → quizzes(id) | Reference to parent quiz |
| type | VARCHAR(20) | NOT NULL, CHECK (MCQ, TRUE_FALSE, TEXT) | Question type |
| question_text | TEXT | NOT NULL | The question text |
| question_order | INT | NOT NULL, DEFAULT 0 | Display order within quiz |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

**Foreign Keys:**
- `quiz_id` → `quizzes(id)` ON DELETE CASCADE

**Indexes:**
- `idx_quiz_id` - For filtering by quiz
- `idx_question_order` - For ordering questions

**Question Types:**
- `MCQ` - Multiple Choice Question (select from options)
- `TRUE_FALSE` - Boolean question (True/False)
- `TEXT` - Short answer text question

---

### 3. OPTIONS
Stores answer options for MCQ and TRUE_FALSE questions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique option identifier |
| question_id | BIGINT | NOT NULL, FOREIGN KEY → questions(id) | Reference to parent question |
| option_text | VARCHAR(500) | NOT NULL | The option text |
| is_correct | BOOLEAN | NOT NULL, DEFAULT FALSE | Whether this is the correct answer |
| order_number | INT | NOT NULL, DEFAULT 0 | Display order of option |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

**Foreign Keys:**
- `question_id` → `questions(id)` ON DELETE CASCADE

**Indexes:**
- `idx_question_id` - For filtering by question
- `idx_order_number` - For ordering options
- `idx_is_correct` - For quick lookup of correct answers

---

### 4. SUBMISSIONS
Stores quiz submission metadata.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique submission identifier |
| quiz_id | BIGINT | NOT NULL, FOREIGN KEY → quizzes(id) | Reference to quiz taken |
| score | INT | NOT NULL, DEFAULT 0 | Number of correct answers |
| total_questions | INT | NOT NULL, DEFAULT 0 | Total number of questions |
| submitted_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Submission timestamp |

**Foreign Keys:**
- `quiz_id` → `quizzes(id)` ON DELETE CASCADE

**Indexes:**
- `idx_quiz_id` - For filtering by quiz
- `idx_submitted_at` - For sorting by submission date
- `idx_score` - For analytics and leaderboards

---

### 5. ANSWERS
Stores individual user answers for each question in a submission.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique answer identifier |
| submission_id | BIGINT | NOT NULL, FOREIGN KEY → submissions(id) | Reference to parent submission |
| question_id | BIGINT | NOT NULL, FOREIGN KEY → questions(id) | Reference to question answered |
| user_answer | TEXT | | User's answer (option ID or text) |
| is_correct | BOOLEAN | NOT NULL, DEFAULT FALSE | Whether the answer was correct |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

**Foreign Keys:**
- `submission_id` → `submissions(id)` ON DELETE CASCADE
- `question_id` → `questions(id)` ON DELETE CASCADE

**Indexes:**
- `idx_submission_id` - For retrieving all answers for a submission
- `idx_question_id` - For analytics on question difficulty
- `idx_is_correct` - For analytics on correct/incorrect answers

---

## Entity Relationships

```
QUIZZES (1) ──────< (N) QUESTIONS
                         │
                         ├──< (N) OPTIONS
                         │
                         └──< (N) ANSWERS
                         
QUIZZES (1) ──────< (N) SUBMISSIONS
                         │
                         └──< (N) ANSWERS
```

### Cascade Delete Behavior

1. **Delete Quiz** → Deletes all Questions, Submissions, and indirectly all Options and Answers
2. **Delete Question** → Deletes all Options and Answers for that question
3. **Delete Submission** → Deletes all Answers in that submission

---

## Setup Instructions

### For MySQL Production:

```bash
# Connect to MySQL
mysql -u root -p

# Create database
CREATE DATABASE quiz_management;

# Use database
USE quiz_management;

# Execute schema
SOURCE /path/to/schema.sql;
```

### For H2 Development:

The H2 schema is automatically loaded when using Spring Boot's `spring.jpa.hibernate.ddl-auto=create-drop` configuration.

Alternatively, you can manually load it:
```bash
# Access H2 Console at http://localhost:8080/h2-console
# JDBC URL: jdbc:h2:mem:quizdb
# Username: sa
# Password: (leave empty)
```

---

## Sample Data

Both schema files include sample data:
- 1 sample quiz ("Sample Quiz")
- 3 sample questions (MCQ, TRUE_FALSE, TEXT)
- Options for MCQ and TRUE_FALSE questions

**To remove sample data:** Delete the INSERT statements at the end of the schema file before production deployment.

---

## Performance Considerations

### Indexes
All foreign keys have indexes for optimal JOIN performance.

### Recommended Additional Indexes (for large datasets):
```sql
-- For quiz search by title
CREATE FULLTEXT INDEX idx_quiz_title_fulltext ON quizzes(title);

-- For user analytics (if adding user_id to submissions)
CREATE INDEX idx_submissions_user_id ON submissions(user_id);

-- For question analytics
CREATE INDEX idx_answers_correct_by_question ON answers(question_id, is_correct);
```

---

## Migration Notes

When migrating from H2 to MySQL:
1. Export H2 data using `SCRIPT TO 'backup.sql'`
2. Adjust auto-increment values if needed
3. Import using `SOURCE backup.sql` in MySQL
4. Verify foreign key constraints
5. Update `application.yml` to use MySQL profile

---

## Version History

- **v1.0** (2026-01-12): Initial schema with 5 tables
- Support for MCQ, TRUE_FALSE, and TEXT question types
- Cascade delete relationships
- Comprehensive indexing strategy
