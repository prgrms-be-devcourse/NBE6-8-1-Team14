package com.back.domain.delivery.controller;


import com.back.domain.delivery.dto.response.DeliveryStatusResponseDto;
import com.back.domain.delivery.service.DeliveryService;
import com.back.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/deliveries")
@Tag(name = "DeliveryController", description = "API 배송 컨트롤러")
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService deliveryService;

    @GetMapping("/status/{deliveryId}")
    @Operation(summary = "배송 상태 조회 API", description = "배송 ID로 배송의 현재 상태를 조회합니다.")
    public ResponseEntity<ApiResponse<DeliveryStatusResponseDto>> getDeliveryStatus(@PathVariable Long deliveryId) {
        DeliveryStatusResponseDto deliveryStatus = deliveryService.getDeliveryStatus(deliveryId);
        return ResponseEntity.ok(
                ApiResponse.success(deliveryStatus)
        );
    }
}
