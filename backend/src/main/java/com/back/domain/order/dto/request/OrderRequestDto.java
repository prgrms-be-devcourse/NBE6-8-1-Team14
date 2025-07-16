package com.back.domain.order.dto.request;

import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequestDto {
    @NotNull
    private String address;

    @NotNull
    private List<OrderItemRequestDto> orderItems;
}
