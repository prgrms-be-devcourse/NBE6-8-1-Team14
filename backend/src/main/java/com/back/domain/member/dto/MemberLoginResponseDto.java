package com.back.domain.member.dto;

public record MemberLoginResponseDto(
        MemberDto item,
        String accessToken,
        String refreshToken
) {
}