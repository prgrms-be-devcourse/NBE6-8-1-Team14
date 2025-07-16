package com.back.domain.member.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum MemberErrorCode {
    MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "MEMBER-404", "해당 회원을 찾을 수 없습니다."),
    MEMBER_ADDRESS_NOT_FOUND(HttpStatus.NOT_FOUND, "MEMBER-414", "해당 회원의 주소를 찾을 수 없습니다."),;

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;
}