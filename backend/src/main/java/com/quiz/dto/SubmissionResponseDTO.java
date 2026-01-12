package com.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionResponseDTO {
    private Long submissionId;
    private Long quizId;
    private Integer score;
    private Integer totalQuestions;
    private LocalDateTime submittedAt;
    private List<AnswerResultDTO> answers;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AnswerResultDTO {
        private Long questionId;
        private String questionText;
        private String questionType;
        private String userAnswer;
        private Boolean isCorrect;
        private String correctAnswer; // For display
    }
}
