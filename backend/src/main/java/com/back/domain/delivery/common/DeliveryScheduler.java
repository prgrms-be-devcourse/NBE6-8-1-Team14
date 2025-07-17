package com.back.domain.delivery.common;

import com.back.domain.delivery.entity.Delivery;
import com.back.domain.delivery.enums.DeliveryStatus;
import com.back.domain.delivery.repository.DeliveryRepository;
import com.back.domain.delivery.service.DeliveryService;
import jakarta.transaction.Transactional;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
@Transactional
public class DeliveryScheduler {

    private final DeliveryRepository deliveryRepository;
    private final DeliveryService deliveryService;

    // 매일 오후 2시에 실행
    @Scheduled(cron = "0 0 14 * * ?")
    public void executeScheduledDeliveries() {
        List<Delivery> pendingDeliveries = deliveryRepository
                .findByStatus(DeliveryStatus.READY);

        for (Delivery delivery : pendingDeliveries) {
            try {
                deliveryService.startDelivery(delivery.getId());
                log.info("배송 시작: {} (주문 {}개)",
                        delivery.getId(), delivery.getOrders().size());
                deliveryService.sendOrderConfirmationEmail(delivery);
            } catch (Exception e) {
                log.error("배송 시작 실패: {}", delivery.getId(), e);
            }
        }
    }

}
