package com.quiz.exception;

public class OptionNotFoundException extends RuntimeException {
    public OptionNotFoundException(Long optionId) {
        super("Option not found with id: " + optionId);
    }
}
