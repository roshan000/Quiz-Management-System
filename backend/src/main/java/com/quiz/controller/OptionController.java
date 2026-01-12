package com.quiz.controller;

import com.quiz.entity.Option;
import com.quiz.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/questions/{questionId}/options")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class OptionController {
    private final QuizService quizService;

    @PostMapping
    public ResponseEntity<Option> addOption(
            @PathVariable Long questionId,
            @RequestBody Map<String, Object> payload) {
        String optionText = (String) payload.get("optionText");
        Boolean isCorrect = (Boolean) payload.get("isCorrect");
        Integer optionOrder = payload.containsKey("optionOrder") ? 
                ((Number) payload.get("optionOrder")).intValue() : 0;
        
        Option option = quizService.addOption(questionId, optionText, isCorrect, optionOrder);
        return ResponseEntity.status(HttpStatus.CREATED).body(option);
    }

    @PutMapping("/{optionId}")
    public ResponseEntity<Option> updateOption(
            @PathVariable Long questionId,
            @PathVariable Long optionId,
            @RequestBody Map<String, Object> payload) {
        String optionText = (String) payload.get("optionText");
        Boolean isCorrect = (Boolean) payload.get("isCorrect");
        
        Option option = quizService.updateOption(optionId, optionText, isCorrect);
        return ResponseEntity.ok(option);
    }

    @DeleteMapping("/{optionId}")
    public ResponseEntity<Void> deleteOption(
            @PathVariable Long questionId,
            @PathVariable Long optionId) {
        quizService.deleteOption(optionId);
        return ResponseEntity.noContent().build();
    }
}
