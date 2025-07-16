package com.back.domain.order.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum OrderErrorCode {
    ORDER_NOT_FOUND(HttpStatus.NOT_FOUND, "ORDER-404", "해당 주문을 찾을 수 없습니다."),
    ORDER_ALREADY_DELIVERED(HttpStatus.BAD_REQUEST, "ORDER-400", "이미 배송된 주문은 취소할 수 없습니다."),;

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;
}