package com.back.domain.member.dto;

public record MemberValidTokenResponseDto(
        MemberDto memberDto,
        String accessToken,
        String refreshToken
) {
}