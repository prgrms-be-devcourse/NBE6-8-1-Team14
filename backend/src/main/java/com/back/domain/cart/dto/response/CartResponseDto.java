package com.back.domain.cart.dto.response;

import java.util.List;
import lombok.Builder;

@Builder
public record CartResponseDto(
        Long memberId,
        Long cartId,
        int totalPrice,
        int totalCount,
        List<CartItemResponseDto> cartItems
) {
}
