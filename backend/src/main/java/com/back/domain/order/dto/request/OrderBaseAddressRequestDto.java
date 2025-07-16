package com.back.domain.order.dto.request;


import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class OrderBaseAddressRequestDto {

    @NotNull
    private Long memberId;

    @NotNull
    private String address;
}
