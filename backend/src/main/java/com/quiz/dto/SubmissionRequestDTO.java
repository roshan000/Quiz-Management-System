package com.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionRequestDTO {
    private Long quizId;
    private List<AnswerInputDTO> answers;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AnswerInputDTO {
        private Long questionId;
        private String userAnswer; // Can be option ID or text for text questions
    }
}
