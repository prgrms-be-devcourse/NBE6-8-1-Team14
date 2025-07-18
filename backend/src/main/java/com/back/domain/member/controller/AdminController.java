package com.back.domain.member.controller;


import com.back.domain.member.dto.response.AdminViewerResponseDto;
import com.back.domain.member.service.AdminService;
import com.back.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "AdminController", description = "API 관리자 컨트롤러")
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/{memberId}/dashboard")
    @Operation(summary = "관리자 대시보드 조회 API", description = "관리자 ID를 통해 주문 및 배송 현황을 조회합니다.")
    public ResponseEntity<ApiResponse<List<AdminViewerResponseDto>>> getOrderDeliveryDashboard(@PathVariable Long memberId) {
        List<AdminViewerResponseDto> adminViewer = adminService.getDashboard(memberId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.success(adminViewer)
        );
    }

}
