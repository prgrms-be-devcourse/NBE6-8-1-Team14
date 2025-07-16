package com.back.domain.cart.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class CartException extends RuntimeException {
    private final HttpStatus httpStatus;
    private final String code;

    public CartException(CartErrorCode cartErrorCode) {
        super(cartErrorCode.getMessage());
        this.httpStatus = cartErrorCode.getHttpStatus();
        this.code = cartErrorCode.getCode();
    }
}