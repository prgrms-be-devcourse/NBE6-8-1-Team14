package com.back.domain.delivery.enums;

import lombok.Getter;

@Getter
public enum DeliveryStatus {
    READY,
    IN_PROGRESS,
    COMPLETED,
    CANCELLED;

}
