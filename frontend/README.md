# Frontend - Quiz Management System

## Overview
Next.js React frontend with TypeScript for the Quiz Management System. Provides admin panel for quiz creation and public quiz-taking interface.

## Features
- **Admin Panel** (`/admin`): Create quizzes, add questions and options, manage quizzes
- **Public Quiz Page** (`/quiz/[id]`): Take quizzes anonymously
- **Results Page** (`/quiz/results/[id]`): View score, correct/incorrect answers, performance metrics
- **Quiz List** (`/`): Browse available quizzes
- **Responsive Design**: Works on desktop and mobile

## Project Structure
```
frontend/
├── app/
│   ├── layout.tsx           - Root layout with navigation
│   ├── page.tsx             - Quiz list homepage
│   ├── admin/
│   │   ├── page.tsx         - Admin dashboard
│   │   └── quiz/[id]/
│   │       └── page.tsx     - Quiz editor
│   ├── quiz/
│   │   ├── [id]/
│   │   │   └── page.tsx     - Quiz taking interface
│   │   └── results/
│   │       └── [id]/
│   │           └── page.tsx - Results display
│   └── globals.css
├── services/
│   └── api.ts               - Axios wrapper for backend API calls
├── next.config.js
├── tsconfig.json
└── package.json
```

## Installation & Running

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
cd frontend
npm install
```

### Development Server
```bash
npm run dev
```

Opens at `http://localhost:3000`

### Build for Production
```bash
npm run build
npm start
```

## API Integration
- Backend API: `http://localhost:8080/api`
- Make sure the Spring Boot backend is running before starting the frontend
- CORS is configured in the backend to allow `http://localhost:3000`

## Key Components

### Quiz Taking Flow
1. User navigates to `/` and sees available quizzes
2. User clicks "Take Quiz" → `/quiz/[id]`
3. User selects answers for all questions
4. On submit → `POST /api/submissions` → Redirects to `/quiz/results/[submissionId]`
5. Results page displays score and answer review

### Admin Flow
1. Navigate to `/admin`
2. Create quiz → New quiz appears in list
3. Click "Edit" → `/admin/quiz/[id]`
4. Add questions (MCQ, True/False, Text)
5. For each question, add options (mark one as correct)
6. Save and return to admin list

## Environment
- Framework: Next.js 14 (App Router)
- Language: TypeScript
- HTTP Client: Axios
- Styling: Plain CSS (no framework for MVP)

## Notes
- Session state for quiz-taking is managed locally in React components
- No authentication layer (MVP simplification)
- Results are fetched from backend after submission
