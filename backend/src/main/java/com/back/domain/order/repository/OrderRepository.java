package com.back.domain.order.repository;

import com.back.domain.member.entity.Member;
import com.back.domain.order.entity.Order;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByMember(Member member);
}
