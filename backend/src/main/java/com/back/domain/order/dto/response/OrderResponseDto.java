package com.back.domain.order.dto.response;


import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderResponseDto {
    private Long orderId;
    private String address;
    private int totalPrice;
    private int totalCount;
    private LocalDateTime createdAt;
    private List<OrderItemResponseDto> orderItems;
}
