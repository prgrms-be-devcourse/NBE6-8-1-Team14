package com.back.domain.product.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ProductErrorCode {
    PRODUCT_NOT_FOUND(HttpStatus.NOT_FOUND, "PRODUCT-404", "해당 상품을 찾을 수 없습니다."),
    PRODUCT_OUT_OF_STOCK(HttpStatus.BAD_REQUEST, "PRODUCT-400", "해당 상품의 재고를 찾을 수 없습니다."),
    PRODUCT_NOT_ENOUGH_STOCK(HttpStatus.BAD_REQUEST, "PRODUCT-400", "해당 상품의 재고가 부족합니다."),;

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;
}