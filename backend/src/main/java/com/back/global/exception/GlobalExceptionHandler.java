package com.back.global.exception;

import com.back.global.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 전역 예외 처리 핸들러
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    // 커스텀할 예외 처리 핸들러
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ApiResponse<Void>> handleCustomException(CustomException e) {
        ApiResponse<Void> response = ApiResponse.fail(
                e.getHttpStatus().value(),
                e.getMessage()
        );
        return ResponseEntity.status(e.getHttpStatus()).body(response);
    }

    // 커스텀 예외는 다 이 위로 작성해야 함
    // 그외 모든 예외 처리 핸들러
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleException(Exception e) {
        ApiResponse<Void> response = ApiResponse.fail(
                500,
                "서버 내부 오류가 발생하였습니다."
        );
        return ResponseEntity.status(500).body(response);
    }
}