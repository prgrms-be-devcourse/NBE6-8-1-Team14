package com.back.domain.order.dto.request;

import jakarta.validation.constraints.NotNull;
import java.util.List;


public record OrderRequestDto (
    @NotNull
    Long memberId,

    @NotNull
    String address,

    @NotNull
    List<OrderItemRequestDto> orderItems
) {
}
