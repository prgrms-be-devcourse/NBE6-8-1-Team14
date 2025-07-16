package com.back.domain.cart.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum CartErrorCode {
    CART_NOT_FOUND(HttpStatus.NOT_FOUND, "CART-404", "해당 장바구니를 찾을 수 없습니다."),
    CART_ALREADY_EXISTS(HttpStatus.CONFLICT, "CART-409", "이미 장바구니가 존재합니다."),;

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;
}