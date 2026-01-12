package com.quiz.service;

import com.quiz.dto.SubmissionRequestDTO;
import com.quiz.dto.SubmissionResponseDTO;
import com.quiz.entity.*;
import com.quiz.exception.QuizNotFoundException;
import com.quiz.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SubmissionService {
    private final SubmissionRepository submissionRepository;
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;

    public SubmissionResponseDTO submitQuiz(SubmissionRequestDTO request) {
        Quiz quiz = quizRepository.findById(request.getQuizId())
                .orElseThrow(() -> new QuizNotFoundException(request.getQuizId()));

        List<Question> questions = questionRepository.findByQuizIdOrderByQuestionOrder(request.getQuizId());
        
        Submission submission = new Submission();
        submission.setQuiz(quiz);
        submission.setTotalQuestions(questions.size());
        submission.setScore(0);

        submission = submissionRepository.save(submission);

        int score = 0;
        List<Answer> answers = new ArrayList<>();

        // Create a map of questionId to SubmissionRequestDTO.AnswerInputDTO for quick lookup
        Map<Long, SubmissionRequestDTO.AnswerInputDTO> answerMap = request.getAnswers().stream()
                .collect(Collectors.toMap(SubmissionRequestDTO.AnswerInputDTO::getQuestionId, a -> a));

        for (Question question : questions) {
            SubmissionRequestDTO.AnswerInputDTO userAnswerInput = answerMap.get(question.getId());
            String userAnswer = userAnswerInput != null ? userAnswerInput.getUserAnswer() : "";

            boolean isCorrect = gradeAnswer(question, userAnswer);
            if (isCorrect) {
                score++;
            }

            Answer answer = new Answer();
            answer.setSubmission(submission);
            answer.setQuestion(question);
            answer.setUserAnswer(userAnswer);
            answer.setIsCorrect(isCorrect);
            answers.add(answer);
        }

        submission.setScore(score);
        submission.setAnswers(answers);
        submission = submissionRepository.save(submission);

        return buildSubmissionResponse(submission);
    }

    /**
     * Grade a single answer based on question type.
     */
    private boolean gradeAnswer(Question question, String userAnswer) {
        if (userAnswer == null || userAnswer.trim().isEmpty()) {
            return false;
        }

        if (question.getType() == Question.QuestionType.MCQ ||
            question.getType() == Question.QuestionType.TRUE_FALSE) {
            // userAnswer should be the optionId
            Optional<Option> correctOption = question.getOptions().stream()
                    .filter(Option::getIsCorrect)
                    .findFirst();

            if (correctOption.isEmpty()) {
                return false;
            }

            try {
                Long selectedOptionId = Long.parseLong(userAnswer);
                return correctOption.get().getId().equals(selectedOptionId);
            } catch (NumberFormatException e) {
                return false;
            }
        } else if (question.getType() == Question.QuestionType.TEXT) {
            // For text questions, compare with the correct option's text (case-insensitive, exact match)
            Optional<Option> correctOption = question.getOptions().stream()
                    .filter(Option::getIsCorrect)
                    .findFirst();

            if (correctOption.isEmpty()) {
                return false;
            }

            return userAnswer.trim().equalsIgnoreCase(correctOption.get().getOptionText().trim());
        }

        return false;
    }

    public SubmissionResponseDTO getSubmissionResults(Long submissionId) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));
        return buildSubmissionResponse(submission);
    }

    private SubmissionResponseDTO buildSubmissionResponse(Submission submission) {
        SubmissionResponseDTO response = new SubmissionResponseDTO();
        response.setSubmissionId(submission.getId());
        response.setQuizId(submission.getQuiz().getId());
        response.setScore(submission.getScore());
        response.setTotalQuestions(submission.getTotalQuestions());
        response.setSubmittedAt(submission.getSubmittedAt());

        List<SubmissionResponseDTO.AnswerResultDTO> answerResults = submission.getAnswers().stream()
                .map(answer -> {
                    SubmissionResponseDTO.AnswerResultDTO result = new SubmissionResponseDTO.AnswerResultDTO();
                    result.setQuestionId(answer.getQuestion().getId());
                    result.setQuestionText(answer.getQuestion().getQuestionText());
                    result.setQuestionType(answer.getQuestion().getType().toString());
                    result.setUserAnswer(answer.getUserAnswer());
                    result.setIsCorrect(answer.getIsCorrect());
                    
                    // Set correct answer for display
                    String correctAnswer = getCorrectAnswerText(answer.getQuestion());
                    result.setCorrectAnswer(correctAnswer);
                    
                    return result;
                })
                .collect(Collectors.toList());

        response.setAnswers(answerResults);
        return response;
    }

    private String getCorrectAnswerText(Question question) {
        Optional<Option> correctOption = question.getOptions().stream()
                .filter(Option::getIsCorrect)
                .findFirst();
        return correctOption.map(Option::getOptionText).orElse("N/A");
    }
}
