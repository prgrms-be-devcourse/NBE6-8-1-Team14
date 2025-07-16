package com.back.domain.cart.dto.request;

import jakarta.validation.constraints.NotNull;

public record CartItemRequestDto(
        @NotNull Long memberId,
        @NotNull Long productId,
        @NotNull int count
) {
}
