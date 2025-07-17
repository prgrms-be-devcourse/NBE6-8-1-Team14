package com.back.domain.delivery.service;

import com.back.domain.delivery.entity.Delivery;
import com.back.domain.delivery.enums.DeliveryStatus;
import com.back.domain.delivery.exception.DeliveryErrorCode;
import com.back.domain.delivery.exception.DeliveryException;
import com.back.domain.delivery.repository.DeliveryRepository;
import com.back.domain.order.entity.Order;
import com.back.domain.order.repository.OrderRepository;
import jakarta.transaction.Transactional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class DeliveryService {

    private final OrderRepository orderRepository;
    private final DeliveryRepository deliveryRepository;

    // 주문 생성 시 배송 스케줄링
    public Delivery scheduleDelivery(Order order) {
        String address = order.getAddress();

        // 같은 주소의 배송 대기 중인 배송이 있는지 확인
        Delivery existingDelivery = deliveryRepository
                .findByAddressAndStatus(address, DeliveryStatus.READY)
                .orElseThrow(() -> new DeliveryException(DeliveryErrorCode.DELIVERY_NOT_FOUND));

        if (existingDelivery != null) {
            // 묶음 배송 - 기존 배송에 주문 추가
            existingDelivery.addOrder(order);
            return existingDelivery;
        } else {
            // 새로운 배송 생성
            Delivery newDelivery = Delivery.builder()
                    .status(DeliveryStatus.READY)
                    .trackingNumber(UUID.randomUUID().toString())
                    .shippingDate(null)
                    .build();

            newDelivery.addOrder(order);
            deliveryRepository.save(newDelivery);
            return newDelivery;
        }
    }

    public void startDelivery(Long deliveryId) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new DeliveryException(DeliveryErrorCode.DELIVERY_NOT_FOUND));

        if (delivery.getStatus() == DeliveryStatus.READY) {
            delivery.updateStatus(DeliveryStatus.IN_PROGRESS);
            delivery.updateShippingDate(java.time.LocalDateTime.now());
            deliveryRepository.save(delivery);
        }

    }
}
