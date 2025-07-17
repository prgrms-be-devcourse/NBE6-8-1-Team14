package com.back.domain.delivery.dto.response;

import com.back.domain.delivery.entity.Delivery;
import com.back.domain.delivery.enums.DeliveryStatus;
import com.back.domain.order.entity.Order;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Builder;

@Builder
public record DeliveryStatusResponseDto(
    Long deliveryId,
    DeliveryStatus status,
    LocalDateTime shippingDate,
    String trackingNumber,
    List<Order> orders
) {
    public static DeliveryStatusResponseDto from(Delivery delivery) {
        return DeliveryStatusResponseDto.builder()
            .deliveryId(delivery.getId())
            .status(delivery.getStatus())
            .shippingDate(delivery.getShippingDate())
            .trackingNumber(delivery.getTrackingNumber())
            .orders(delivery.getOrders())
            .build();
    }

}
