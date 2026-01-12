# Backend - Quiz Management System

## Overview
Spring Boot REST API backend for the Quiz Management System with JPA/Hibernate and H2 database (MySQL-compatible).

## Architecture
- **Controllers**: REST endpoints for quiz management and submissions
- **Services**: Business logic and grading
- **Repositories**: JPA data access
- **Entities**: Quiz, Question, Option, Submission, Answer

## Running the Backend

### Prerequisites
- Java 17+
- Maven 3.8+

### Build & Run
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Server runs on `http://localhost:8080`

### Testing with cURL
```bash
# Create a quiz
curl -X POST http://localhost:8080/api/quizzes \
  -H "Content-Type: application/json" \
  -d '{"title": "JS Basics", "description": "Test your knowledge"}'

# Get all quizzes
curl http://localhost:8080/api/quizzes
```

## Database
- **Default**: H2 in-memory database (auto-created via Hibernate)
- **For Production**: Update `application.yml` to use MySQL
