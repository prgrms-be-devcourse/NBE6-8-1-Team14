package com.back.domain.member.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class MemberException extends RuntimeException {
    private final HttpStatus httpStatus;
    private final String code;

    public MemberException(MemberErrorCode memberErrorCode) {
        super(memberErrorCode.getMessage());
        this.httpStatus = memberErrorCode.getHttpStatus();
        this.code = memberErrorCode.getCode();
    }
}