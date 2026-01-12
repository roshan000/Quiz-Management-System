package com.quiz.controller;

import com.quiz.entity.Quiz;
import com.quiz.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Quiz", description = "Quiz management endpoints")
public class QuizController {
    private final QuizService quizService;

    @PostMapping
    @Operation(summary = "Create a new quiz", description = "Create a new quiz with title and description")
    public ResponseEntity<Quiz> createQuiz(@RequestBody Map<String, String> payload) {
        String title = payload.get("title");
        String description = payload.get("description");
        Quiz quiz = quizService.createQuiz(title, description);
        return ResponseEntity.status(HttpStatus.CREATED).body(quiz);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get quiz by ID", description = "Retrieve a specific quiz by its ID")
    public ResponseEntity<Quiz> getQuizById(@PathVariable Long id) {
        Quiz quiz = quizService.getQuizById(id);
        return ResponseEntity.ok(quiz);
    }

    @GetMapping
    @Operation(summary = "Get all quizzes", description = "Retrieve all available quizzes")
    public ResponseEntity<List<Quiz>> getAllQuizzes() {
        List<Quiz> quizzes = quizService.getAllQuizzes();
        return ResponseEntity.ok(quizzes);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update quiz", description = "Update an existing quiz details")
    public ResponseEntity<Quiz> updateQuiz(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String title = payload.get("title");
        String description = payload.get("description");
        Quiz quiz = quizService.updateQuiz(id, title, description);
        return ResponseEntity.ok(quiz);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete quiz", description = "Delete a quiz by ID")
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long id) {
        quizService.deleteQuiz(id);
        return ResponseEntity.noContent().build();
    }
}
