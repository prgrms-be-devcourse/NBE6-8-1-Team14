package com.back.domain.order.dto.response;


import com.back.domain.order.entity.OrderItem;
import lombok.Builder;



@Builder
public record OrderItemResponseDto (
        Long productId,
        String productName,
        int count,
        int totalPrice,
        String imagePath
) {
    public static OrderItemResponseDto from(OrderItem orderItem) {
        return OrderItemResponseDto.builder()
                .productId(orderItem.getProduct().getId())
                .productName(orderItem.getProduct().getName())
                .count(orderItem.getCount())
                .totalPrice(orderItem.getTotalPrice())
                .imagePath(orderItem.getProduct().getImagePath())
                .build();
    }
}
