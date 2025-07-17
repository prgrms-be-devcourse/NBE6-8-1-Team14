package com.back.global.jwt.authtoken.service;

import com.back.domain.member.entity.Member;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthTokenService {
    // JWT 서명에 사용되는 비밀 키
    @Value("${custom.jwt.secretKey}")
    private String jwtSecretKey;

    // Access Token 만료 시간 (초 단위)
    @Value("${custom.accessToken.expirationSeconds}")
    private long accessTokenExpirationSeconds;

    // JWT 서명용 Key 객체
    private Key secretKey;

    // Access Token 생성
    public String generateAccessToken(Member member) {
        secretKey = Keys.hmacShaKeyFor(jwtSecretKey.getBytes());

        // 현재 시간(now)을 기준으로 유효 기간(expiry) 계산
        Date now = new Date();
        Date expiry = new Date(now.getTime() + accessTokenExpirationSeconds * 1000);

        return Jwts.builder()
                .setSubject(String.valueOf(member.getId())) // 유저 식별자 (ID)
                .claim("email", member.getEmail()) // 유저 이메일
                .claim("nickname", member.getNickname()) // 유저 닉네임
                .claim("role", member.getRole().name()) // 유저 권한
                .setIssuedAt(now) // 토큰 발급 시간
                .setExpiration(expiry) // 토큰 만료 시간
                .signWith(secretKey) // 서명
                .compact(); // JWT 문자열 완성
    }

    // Refresh Token 생성
    public String generateRefreshToken() {
        return UUID.randomUUID().toString(); // 랜덤 UUID를 리프레시 토큰으로
    }

    // 토큰 검증 및 Payload 추출
    public Claims parseToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (JwtException e) {
            return null;
        }
    }
}
