package com.back.domain.member.dto.response;

import com.back.domain.order.dto.response.OrderItemResponseDto;
import com.back.domain.order.dto.response.OrderResponseDto;
import com.back.domain.order.entity.Order;

import lombok.Builder;

@Builder
public record AdminViewerResponseDto(
        Long memberId,
        String trackingNumber,
        OrderResponseDto orderResponseDto
) {
    public static AdminViewerResponseDto from(Order order, OrderResponseDto orderResponseDto, Long memberId) {
        return AdminViewerResponseDto.builder()
                .memberId(memberId)
                .trackingNumber(order.getDelivery().getTrackingNumber())
                .orderResponseDto(orderResponseDto)
                .build();
    }


}
