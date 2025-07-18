package com.back.domain.cart.dto.request;

public record CartItemCountUpdateRequestDto(
        Long memberId,
        Long cartItemId,
        int deltaCount
) {
}
