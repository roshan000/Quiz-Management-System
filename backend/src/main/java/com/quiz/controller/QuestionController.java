package com.quiz.controller;

import com.quiz.entity.Question;
import com.quiz.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/quizzes/{quizId}/questions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class QuestionController {
    private final QuizService quizService;

    @PostMapping
    public ResponseEntity<Question> addQuestion(
            @PathVariable Long quizId,
            @RequestBody Map<String, Object> payload) {
        String type = (String) payload.get("type");
        String questionText = (String) payload.get("questionText");
        
        Question question = quizService.addQuestion(quizId, Question.QuestionType.valueOf(type), questionText);
        return ResponseEntity.status(HttpStatus.CREATED).body(question);
    }

    @PutMapping("/{questionId}")
    public ResponseEntity<Question> updateQuestion(
            @PathVariable Long quizId,
            @PathVariable Long questionId,
            @RequestBody Map<String, Object> payload) {
        String questionText = (String) payload.get("questionText");
        Question question = quizService.updateQuestion(questionId, questionText);
        return ResponseEntity.ok(question);
    }

    @DeleteMapping("/{questionId}")
    public ResponseEntity<Void> deleteQuestion(
            @PathVariable Long quizId,
            @PathVariable Long questionId) {
        quizService.deleteQuestion(questionId);
        return ResponseEntity.noContent().build();
    }
}
