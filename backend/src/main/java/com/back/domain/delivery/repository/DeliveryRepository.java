package com.back.domain.delivery.repository;

import com.back.domain.delivery.entity.Delivery;
import com.back.domain.delivery.enums.DeliveryStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {

    List<Delivery> findByStatus(DeliveryStatus status);

    @Query("SELECT d FROM Delivery d JOIN d.orders o WHERE o.address = :address AND d.status = :status")
    Optional<Delivery> findByOrderAddressAndStatus(String address, DeliveryStatus status);
}
