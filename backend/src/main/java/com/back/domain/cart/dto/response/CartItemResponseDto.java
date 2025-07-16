package com.back.domain.cart.dto.response;

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
}
