package com.nexushr.common;

public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) { super(message); }
}
