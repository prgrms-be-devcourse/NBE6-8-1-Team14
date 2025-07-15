package com.back.global.dev;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import com.back.global.common.ApiResponse;
import com.back.global.exception.CustomException;
import com.back.global.exception.ErrorCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "개발용 테스트 API")
@RequestMapping("/dev")
public class DevController {

    @Operation(summary = "스웨거 동작 확인",
            description = "상세 설명")
    @GetMapping()
    public ResponseEntity<String> swaggerTest() {
        return ResponseEntity.ok("Swagger Test");
    }

    @Operation(summary = "ApiResponse 확인용 예제",
            description = "ApiResponse 적용 후 성공/실패, 예외처리 응답 형태 확인")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> getUserName(@PathVariable Long id) {
        if (id > 0) {
            // 성공 응답
            return ResponseEntity
                    .ok(ApiResponse.success("김철수"));
        }else if(id == 0){
            // 실패 응답
            return ResponseEntity
                    .status(404)
                    .body(ApiResponse.fail("DEV-404, "사용자를 찾을 수 없습니다(직접 기재)"));
        }
        // 예외처리 응답
        throw new CustomException(ErrorCode.DEV_NOT_FOUND);
    }
}
