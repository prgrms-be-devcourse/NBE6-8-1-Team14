package com.back.domain.order.controller;

import com.back.domain.order.dto.request.OrderBaseAddressRequestDto;
import com.back.domain.order.dto.request.OrderRequestDto;
import com.back.domain.order.dto.response.OrderResponseDto;
import com.back.domain.order.service.OrderService;
import com.back.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/orders")
@Tag(name = "OrderController", description = "API 주문 컨트롤러")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/direct")
    @Operation(summary = "직접 주문 생성 API", description = "주문을 생성하고, 주문 확인 이메일을 발송합니다.")
    public ResponseEntity<ApiResponse<OrderResponseDto>> createOrder(@RequestBody OrderRequestDto orderRequestDto) {
        OrderResponseDto createdOrder = orderService.createOrder(orderRequestDto);
        orderService.sendOrderConfirmationEmail(orderRequestDto, createdOrder);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success(createdOrder)
        );
    }

    @PostMapping("/base-address")
    @Operation(summary = "기본 배송지 변경 API", description = "회원의 기본 배송지를 변경합니다.")
    public ResponseEntity<ApiResponse<Void>> changeMemberBaseAddress(@RequestBody OrderBaseAddressRequestDto orderBaseAddressRequestDto) {
        orderService.changeMemberBaseAddress(orderBaseAddressRequestDto);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.success(null)
        );
    }

    @GetMapping("/member/{memberId}")
    @Operation(summary = "주문 목록 조회 API", description = "회원의 주문 목록을 조회합니다.")
    public ResponseEntity<ApiResponse<List<OrderResponseDto>>> showMemberOrders(@PathVariable Long memberId) {
        List<OrderResponseDto> orderResponseDto = orderService.showMemberOrders(memberId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.success(orderResponseDto)
        );
    }

    @GetMapping("/{orderId}")
    @Operation(summary = "주문 상세 조회 API", description = "주문 ID로 주문의 상세 정보를 조회합니다.")
    public ResponseEntity<ApiResponse<OrderResponseDto>> showOrder(@PathVariable Long orderId) {
        OrderResponseDto orderResponseDto = orderService.showOrder(orderId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.success(orderResponseDto)
        );
    }

    @DeleteMapping("/{orderId}")
    @Operation(summary = "주문 취소 API", description = "주문 ID로 주문을 취소합니다.")
    public ResponseEntity<ApiResponse<Void>> cancelOrder(@PathVariable Long orderId) {
        orderService.cancelOrder(orderId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
                ApiResponse.success(null)
        );
    }

}
