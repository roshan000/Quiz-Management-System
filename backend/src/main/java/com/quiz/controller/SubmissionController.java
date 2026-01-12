package com.quiz.controller;

import com.quiz.dto.SubmissionRequestDTO;
import com.quiz.dto.SubmissionResponseDTO;
import com.quiz.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class SubmissionController {
    private final SubmissionService submissionService;

    @PostMapping
    public ResponseEntity<SubmissionResponseDTO> submitQuiz(@RequestBody SubmissionRequestDTO request) {
        SubmissionResponseDTO response = submissionService.submitQuiz(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{submissionId}")
    public ResponseEntity<SubmissionResponseDTO> getSubmissionResults(@PathVariable Long submissionId) {
        SubmissionResponseDTO response = submissionService.getSubmissionResults(submissionId);
        return ResponseEntity.ok(response);
    }
}
