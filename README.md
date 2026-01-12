# Quiz Management System

A production-ready full-stack quiz application built with **React + Next.js** (frontend), **Spring Boot** (backend), and **H2/MySQL** (database).

## 🎯 Overview

Complete quiz management system with:
- **Admin Panel**: Create quizzes with MCQ, True/False, and Text answer questions
- **Public Interface**: Anonymous users can take quizzes and see results
- **Results Dashboard**: Score, answer review, correct/incorrect indicators

## ⚙️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | React 18 + Next.js 14 + TypeScript |
| **Backend** | Spring Boot 3.2 + JPA/Hibernate |
| **Database** | H2 (dev) / MySQL (production) |
| **API** | REST with CORS |
| **HTTP Client** | Axios |

## 🚀 Quick Start

### Prerequisites
- Java 17+, Maven 3.8+
- Node.js 18+, npm

### Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
# Runs on http://localhost:8080
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

### Access
- **Home**: http://localhost:3000/
- **Admin**: http://localhost:3000/admin
- **API**: http://localhost:8080/api

## 📖 Usage

**Admin Workflow**
1. Go to `/admin` → Create New Quiz
2. Edit quiz → Add questions (MCQ/True-False/Text)
3. For each question, add options and mark correct answer

**User Workflow**
1. Visit `/` → Select quiz
2. Answer all questions
3. Submit → View results with score and feedback

## 📁 Project Structure

```
backend/           # Spring Boot REST API
  ├── entity/      # JPA entities
  ├── service/     # Business logic
  ├── controller/  # REST endpoints
  ├── repository/  # Data access
  └── pom.xml

frontend/          # Next.js React app
  ├── app/         # Pages (home, admin, quiz, results)
  ├── services/    # API wrapper
  └── package.json

PLAN.md            # Architecture, schema, and roadmap
README.md          # This file
```

## 🏗️ Architecture

```
Frontend (Next.js) ↔ REST API ↔ Backend (Spring Boot) ↔ Database (H2/MySQL)
```

**Entities**: Quiz → Question → Option, Submission → Answer

## 📡 Key APIs

**Quiz Management**
- `POST /api/quizzes` - Create quiz
- `GET /api/quizzes` - List quizzes
- `GET /api/quizzes/{id}` - Get quiz details
- `PUT /api/quizzes/{id}` - Update quiz
- `DELETE /api/quizzes/{id}` - Delete quiz

**Questions & Options**
- `POST /api/quizzes/{id}/questions` - Add question
- `POST /api/questions/{id}/options` - Add option
- `PUT/DELETE` - Update/delete questions and options

**Quiz Submission**
- `POST /api/submissions` - Submit quiz answers
- `GET /api/submissions/{id}` - Get results

## 📚 Documentation

- **PLAN.md**: Complete architecture, database schema, API design, trade-offs, and future roadmap
- **backend/README.md**: Backend setup and configuration
- **frontend/README.md**: Frontend setup and component details

## ✅ Features

✅ Admin panel with quiz management  
✅ Three question types (MCQ, True/False, Text)  
✅ Public quiz-taking interface  
✅ Instant results with score calculation  
✅ Answer review showing correct/incorrect  
✅ Clean, layered architecture  
✅ Production-ready code structure  
✅ REST API with CORS support  
✅ JPA/Hibernate ORM  
✅ TypeScript frontend  

## 🔒 Scope (MVP)

**Included**: Quiz creation, questions, options, submissions, results, answer grading  
**Not Included**: Authentication, timers, analytics, rich media, user accounts

See PLAN.md section "What I Would Do Next (Given More Time)" for 10+ future features.

## 💡 Design Highlights

- **Layered Architecture**: Controller → Service → Repository
- **DTOs**: Clean separation of API contracts from entities
- **JPA/Hibernate**: Database abstraction with automatic schema generation
- **React Hooks**: Lightweight state management
- **REST API**: Stateless, CORS-enabled design
- **H2 Database**: Zero-config development, switchable to MySQL

## �� Git Commit History

```
44c328c - feat: frontend admin panel and quiz interface
e2c34c2 - feat: backend REST API with grading logic
7cbc7af - chore: comprehensive project plan
```

## 🐛 Known Limitations

- No user authentication (intentional MVP simplification)
- Simple grading (1 point per question)
- No question randomization
- No rich media in questions
- Basic CSS styling (no framework)

See PLAN.md for comprehensive roadmap and security enhancements.

---

**Production-ready full-stack MVP built in a 2-hour sprint.**
