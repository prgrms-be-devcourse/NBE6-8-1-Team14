package com.back.domain.order.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;



public record OrderItemRequestDto (
    @NotNull
    Long productId,

    @Min(1) @Max(999)
    int quantity
) {
}
