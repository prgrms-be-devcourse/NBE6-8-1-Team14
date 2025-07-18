package com.back.domain.order.repository;

import com.back.domain.member.entity.Member;
import com.back.domain.order.entity.Order;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByMember(Member member);

    @Query("SELECT o FROM Order o JOIN FETCH o.delivery d JOIN FETCH o.member m")
    List<Order> findAllWithDeliveryAndMember();
}
