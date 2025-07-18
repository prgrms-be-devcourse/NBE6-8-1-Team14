package com.back.domain.member.dto.response;

import com.back.domain.order.dto.response.OrderItemResponseDto;
import com.back.domain.order.dto.response.OrderResponseDto;
import com.back.domain.order.dto.response.OrderSimpleResponseDto;
import com.back.domain.order.entity.Order;

import lombok.Builder;

@Builder
public record AdminViewerResponseDto(
        Long memberId,
        String memberName,
        String deliveryStatus,
        String trackingNumber,
        OrderSimpleResponseDto orderSimpleResponseDto
) {
    public static AdminViewerResponseDto from(Order order, OrderSimpleResponseDto orderSimpleResponseDto, Long memberId) {
        return AdminViewerResponseDto.builder()
                .memberId(memberId)
                .memberName(order.getMember().getNickname())
                .deliveryStatus(order.getDelivery().getStatus().name())
                .trackingNumber(order.getDelivery().getTrackingNumber())
                .orderSimpleResponseDto(orderSimpleResponseDto)
                .build();
    }
}
