package com.quiz.service;

import com.quiz.entity.*;
import com.quiz.exception.QuizNotFoundException;
import com.quiz.repository.*;
import com.quiz.exception.OptionNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class QuizService {
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final OptionRepository optionRepository;

    public Quiz createQuiz(String title, String description) {
        Quiz quiz = new Quiz();
        quiz.setTitle(title);
        quiz.setDescription(description);
        return quizRepository.save(quiz);
    }

    public Quiz getQuizById(Long quizId) {
        return quizRepository.findById(quizId)
                .orElseThrow(() -> new QuizNotFoundException(quizId));
    }

    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    public Quiz updateQuiz(Long quizId, String title, String description) {
        Quiz quiz = getQuizById(quizId);
        quiz.setTitle(title);
        quiz.setDescription(description);
        return quizRepository.save(quiz);
    }

    public void deleteQuiz(Long quizId) {
        quizRepository.deleteById(quizId);
    }

    public Question addQuestion(Long quizId, Question.QuestionType type, String questionText) {
        Quiz quiz = getQuizById(quizId);
        
        // Calculate next order
        List<Question> existingQuestions = questionRepository.findByQuizIdOrderByQuestionOrder(quizId);
        Integer nextOrder = existingQuestions.isEmpty() ? 1 : existingQuestions.get(existingQuestions.size() - 1).getQuestionOrder() + 1;
        
        Question question = new Question();
        question.setQuiz(quiz);
        question.setType(type);
        question.setQuestionText(questionText);
        question.setQuestionOrder(nextOrder);
        
        return questionRepository.save(question);
    }

    public Option addOption(Long questionId, String optionText, Boolean isCorrect, Integer optionOrder) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new com.quiz.exception.QuestionNotFoundException(questionId));
        
        Option option = new Option();
        option.setQuestion(question);
        option.setOptionText(optionText);
        option.setIsCorrect(isCorrect);
        option.setOptionOrder(optionOrder);
        
        return optionRepository.save(option);
    }

    public Question updateQuestion(Long questionId, String questionText) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new com.quiz.exception.QuestionNotFoundException(questionId));
        question.setQuestionText(questionText);
        return questionRepository.save(question);
    }

    public void deleteQuestion(Long questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + questionId));
        questionRepository.deleteById(questionId);
    }

    public void deleteOption(Long optionId) {
        optionRepository.deleteById(optionId);
    }

    public Option updateOption(Long optionId, String optionText, Boolean isCorrect) {
        Option option = optionRepository.findById(optionId)
                .orElseThrow(() -> new OptionNotFoundException(optionId));
        option.setOptionText(optionText);
        option.setIsCorrect(isCorrect);
        return optionRepository.save(option);
    }
}
