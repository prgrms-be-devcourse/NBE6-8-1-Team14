package com.back.domain.order.controller;

import com.back.domain.order.dto.request.OrderBaseAddressRequestDto;
import com.back.domain.order.dto.request.OrderRequestDto;
import com.back.domain.order.dto.response.OrderResponseDto;
import com.back.domain.order.service.OrderService;
import com.back.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private OrderService orderService;

    @PostMapping("/direct")
    public ResponseEntity<ApiResponse<OrderResponseDto>> createOrder(@RequestBody OrderRequestDto orderRequestDto) {
        OrderResponseDto createdOrder = orderService.createOrder(orderRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success(createdOrder)
        );
    }

    @PostMapping("/base-address")
    public ResponseEntity<ApiResponse<Void>> changeMemberBaseAddress(@RequestBody OrderBaseAddressRequestDto orderBaseAddressRequestDto) {
        orderService.changeMemberBaseAddress(orderBaseAddressRequestDto);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.success(null)
        );
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponseDto>> showOrder(@PathVariable Long orderId) {
        OrderResponseDto orderResponseDto = orderService.showOrder(orderId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.success(orderResponseDto)
        );
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<ApiResponse<Void>> cancelOrder(@PathVariable Long orderId) {
        orderService.cancelOrder(orderId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
                ApiResponse.success(null)
        );
    }
}
