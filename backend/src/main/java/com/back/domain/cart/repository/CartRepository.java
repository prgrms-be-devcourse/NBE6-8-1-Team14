package com.back.domain.cart.repository;

import com.back.domain.cart.entity.Cart;
import com.back.domain.member.entity.Member;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Long> {

    Optional<Cart> findByMember(Member member);
}
