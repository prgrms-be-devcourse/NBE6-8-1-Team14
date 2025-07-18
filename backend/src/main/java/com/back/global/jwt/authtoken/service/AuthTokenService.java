package com.back.global.jwt.authtoken.service;

import com.back.domain.member.entity.Member;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
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

    // Access Token에서 유저 ID 추출
    public String resolveToken(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization");
        if (bearer != null && bearer.startsWith("Bearer ")) {
            return bearer.substring(7);
        }
        return null;
    }

    // 토큰 유효성 검증
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // 토큰에서 Authentication 객체 생성
    public Authentication getAuthentication(String token) {
        Claims claims = Jwts.parser().setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();

        String email = claims.getSubject();
        String role = claims.get("role", String.class);

        UserDetails userDetails = User.builder()
                .username(email)
                .password("") // 비워도 됨 (이미 인증된 사용자니까)
                .roles(role)
                .build();

        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }

    // Refresh Token 생성
    public String generateRefreshToken() {
        return UUID.randomUUID().toString(); // 랜덤 UUID를 리프레시 토큰으로
    }
}
