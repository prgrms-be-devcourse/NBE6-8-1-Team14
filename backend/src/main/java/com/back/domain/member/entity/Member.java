package com.back.domain.member.entity;


import com.back.domain.cart.entity.Cart;
import com.back.domain.cart.exception.CartErrorCode;
import com.back.domain.cart.exception.CartException;
import com.back.domain.delivery.entity.Delivery;
import com.back.domain.member.enums.Role;
import com.back.domain.order.entity.Order;
import com.back.global.jwt.refreshtoken.entity.RefreshToken;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
@Table(name = "member")
@EntityListeners(AuditingEntityListener.class)
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long id;

    @Column(name = "member_email", nullable = false, unique = true)
    private String email;

    @Column(name = "member_password", nullable = false)
    private String password;

    @Column(name = "member_nickname", nullable = false)
    private String nickname;

    @Column(name = "member_address")
    private String address;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime editedAt;

    @Column(name = "member_role", nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Order> orders;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id")
    private Cart cart;
  
    @OneToMany(mappedBy = "member")
    private List<Delivery> deliveries;
  
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "refresh_token_id")
    private RefreshToken refreshToken;

    @Builder
    public Member(String email, String password, String nickname, String address, Role role, RefreshToken refreshToken) {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.address = address;
        this.role = role;
        this.refreshToken = refreshToken;
    }

    public void changeAddress(@NotNull String address) {
        this.address = address;
    }

    public void setCart(Cart cart) {
        if (this.cart != null) {
            throw new CartException(CartErrorCode.CART_ALREADY_EXISTS);
        }
        this.cart = cart;
    }
}
