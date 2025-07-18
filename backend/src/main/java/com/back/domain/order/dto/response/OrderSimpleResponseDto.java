package com.back.domain.order.dto.response;

import com.back.domain.order.entity.Order;
import lombok.Builder;

@Builder
public record OrderSimpleResponseDto(
        Long orderId,
        int totalPrice,
        int totalCount,
        String orderItemFirstName
) {
    public static OrderSimpleResponseDto from(Order order) {
        return OrderSimpleResponseDto.builder()
                .orderId(order.getId())
                .totalPrice(order.getTotalPrice())
                .totalCount(order.getTotalCount())
                .orderItemFirstName(order.getOrderItems().get(0).getProduct().getName())
                .build();
    }
}
