package com.back.domain.delivery.repository;

import com.back.domain.delivery.entity.Delivery;
import com.back.domain.delivery.enums.DeliveryStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {

    List<Delivery> findByStatus(DeliveryStatus status);

    Optional<Delivery> findByAddressAndStatus(String address, DeliveryStatus status);
}
