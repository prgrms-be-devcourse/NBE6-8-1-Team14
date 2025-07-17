package com.back.domain.order.dto.request;


import jakarta.validation.constraints.NotNull;


public record OrderBaseAddressRequestDto(
    @NotNull
    Long memberId,

    @NotNull
    String address
) {
}