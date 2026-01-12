package com.quiz.exception;

public class QuizNotFoundException extends RuntimeException {
    public QuizNotFoundException(String message) {
        super(message);
    }

    public QuizNotFoundException(Long quizId) {
        super("Quiz not found with id: " + quizId);
    }
}
