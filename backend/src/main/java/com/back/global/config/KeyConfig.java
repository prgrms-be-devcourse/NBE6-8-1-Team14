package com.back.global.config;

import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.security.Key;

@Configuration
public class KeyConfig {
    @Value("${custom.jwt.secret-key}")
    private String jwtSecretKey;

    @Bean
    public Key jwtKey() {
        return Keys.hmacShaKeyFor(jwtSecretKey.getBytes());
    }
}
