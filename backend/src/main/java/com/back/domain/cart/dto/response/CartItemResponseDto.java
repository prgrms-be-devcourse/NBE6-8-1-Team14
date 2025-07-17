package com.back.domain.cart.dto.response;

import com.back.domain.cart.entity.CartItem;
import lombok.Builder;

@Builder
public record CartItemResponseDto(
        Long cartItemId,
        Long productId,
        String productName,
        String productImageUrl,
        int count,
        int totalPrice
) {
    public static CartItemResponseDto from(CartItem cartItem) {
        return CartItemResponseDto.builder()
                .cartItemId(cartItem.getId())
                .productId(cartItem.getProduct().getId())
                .productName(cartItem.getProduct().getName())
                .productImageUrl(cartItem.getProduct().getImagePath())
                .count(cartItem.getCount())
                .totalPrice(cartItem.getTotalPrice())
                .build();
    }
}
