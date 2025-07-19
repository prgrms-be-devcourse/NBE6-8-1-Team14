package com.back.global.jwt.refreshtoken.repository;

import com.back.global.jwt.refreshtoken.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {
    Optional<RefreshToken> findByMemberId(Long memberId);
}

