package com.back.domain.delivery.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class DeliveryException extends RuntimeException {
    private final HttpStatus httpStatus;
    private final String code;

    public DeliveryException(DeliveryErrorCode deliveryErrorCode) {
        super(deliveryErrorCode.getMessage());
        this.httpStatus = deliveryErrorCode.getHttpStatus();
        this.code = deliveryErrorCode.getCode();
    }
}