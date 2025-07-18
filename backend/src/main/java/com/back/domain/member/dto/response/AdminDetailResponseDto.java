package com.back.domain.member.dto.response;

import com.back.domain.order.dto.response.OrderItemResponseDto;
import com.back.domain.order.dto.response.OrderResponseDto;
import com.back.domain.order.dto.response.OrderSimpleResponseDto;
import com.back.domain.order.entity.Order;
import java.util.List;
import lombok.Builder;

@Builder
public record AdminDetailResponseDto(
        Long memberId,
        String deliveryStatus,
        String trackingNumber,
        OrderResponseDto orderResponseDto
) {

    public static AdminDetailResponseDto from(Order order, List<OrderItemResponseDto> orderItemResponseDtos) {
        return AdminDetailResponseDto.builder()
                .memberId(order.getMember().getId())
                .deliveryStatus(order.getDelivery().getStatus().name())
                .trackingNumber(order.getDelivery().getTrackingNumber())
                .orderResponseDto(OrderResponseDto.from(order, orderItemResponseDtos))
                .build();
    }
}
