package com.back.domain.order.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class OrderException extends RuntimeException {
    private final HttpStatus httpStatus;
    private final String code;

    public OrderException(OrderErrorCode orderErrorCode) {
        super(orderErrorCode.getMessage());
        this.httpStatus = orderErrorCode.getHttpStatus();
        this.code = orderErrorCode.getCode();
    }
}