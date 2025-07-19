package com.back.domain.member.dto.response;

import com.back.domain.member.dto.MemberDto;

public record MemberLoginResponseDto(
        MemberDto item,
        String accessToken,
        String refreshToken
) {
}