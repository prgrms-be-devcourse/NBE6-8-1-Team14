package com.back.global.exception;

import com.back.domain.cart.exception.CartException;
import com.back.domain.delivery.exception.DeliveryException;
import com.back.domain.member.exception.MemberException;
import com.back.domain.order.exception.OrderException;
import com.back.domain.product.exception.ProductException;
import com.back.global.common.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.MethodArgumentNotValidException;

/**
 * 전역 예외 처리 핸들러
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // 커스텀할 예외 처리 핸들러
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ApiResponse<Void>> handleCustomException(CustomException e) {
        log.info(e.getMessage(), e);
        ApiResponse<Void> response = ApiResponse.fail(
                e.getCode(),
                e.getMessage()
        );
        return ResponseEntity.status(e.getHttpStatus()).body(response);
    }

    @ExceptionHandler(CartException.class)
    public ResponseEntity<ApiResponse<Void>> handleCartException(CartException e) {
        log.info(e.getMessage(), e);
        ApiResponse<Void> response = ApiResponse.fail(
                e.getCode(),
                e.getMessage()
        );
        return ResponseEntity.status(e.getHttpStatus()).body(response);
    }

    @ExceptionHandler(DeliveryException.class)
    public ResponseEntity<ApiResponse<Void>> handleDeliveryException(DeliveryException e) {
        log.info(e.getMessage(), e);
        ApiResponse<Void> response = ApiResponse.fail(
                e.getCode(),
                e.getMessage()
        );
        return ResponseEntity.status(e.getHttpStatus()).body(response);
    }

    @ExceptionHandler(MemberException.class)
    public ResponseEntity<ApiResponse<Void>> handleMemberException(MemberException e) {
        log.info(e.getMessage(), e);
        ApiResponse<Void> response = ApiResponse.fail(
                e.getCode(),
                e.getMessage()
        );
        return ResponseEntity.status(e.getHttpStatus()).body(response);
    }

    @ExceptionHandler(OrderException.class)
    public ResponseEntity<ApiResponse<Void>> handleOrderException(OrderException e) {
        log.info(e.getMessage(), e);
        ApiResponse<Void> response = ApiResponse.fail(
                e.getCode(),
                e.getMessage()
        );
        return ResponseEntity.status(e.getHttpStatus()).body(response);
    }

    @ExceptionHandler(ProductException.class)
    public ResponseEntity<ApiResponse<Void>> handleProductException(ProductException e) {
        log.info(e.getMessage(), e);
        ApiResponse<Void> response = ApiResponse.fail(
                e.getCode(),
                e.getMessage()
        );
        return ResponseEntity.status(e.getHttpStatus()).body(response);
    }

    // 유효성 검사 예외 처리 핸들러
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(MethodArgumentNotValidException e) {
        String errorMessage = e.getBindingResult().getFieldError().getDefaultMessage();
        ApiResponse<Void> response = ApiResponse.fail("INPUT-400", errorMessage);
        return ResponseEntity.badRequest().body(response);
    }

    // 커스텀 예외는 다 이 위로 작성해야 함
    // 그외 모든 예외 처리 핸들러
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleException(Exception e) {
        ApiResponse<Void> response = ApiResponse.fail(
                "SERVER-500",
                "서버 내부 오류가 발생하였습니다."
        );
        return ResponseEntity.status(500).body(response);
    }
}
