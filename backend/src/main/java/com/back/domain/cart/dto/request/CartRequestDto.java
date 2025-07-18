package com.back.domain.cart.dto.request;

import com.back.domain.cart.dto.response.CartItemResponseDto;
import java.util.List;
import lombok.Builder;

@Builder
public record CartRequestDto(
        Long memberId,
        int totalPrice,
        int totalCount,
        List<CartItemResponseDto> cartItems
) {
}
