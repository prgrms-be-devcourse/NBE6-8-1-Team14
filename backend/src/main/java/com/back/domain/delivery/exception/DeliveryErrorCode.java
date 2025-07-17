package com.back.domain.delivery.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum DeliveryErrorCode {
    DELIVERY_NOT_FOUND(HttpStatus.NOT_FOUND, "DELIVERY-404", "해당 배송건을 찾을 수 없습니다."),;

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;
}