package com.back.domain.product.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class ProductException extends RuntimeException {
    private final HttpStatus httpStatus;
    private final String code;

    public ProductException(ProductErrorCode productErrorCode) {
        super(productErrorCode.getMessage());
        this.httpStatus = productErrorCode.getHttpStatus();
        this.code = productErrorCode.getCode();
    }
}