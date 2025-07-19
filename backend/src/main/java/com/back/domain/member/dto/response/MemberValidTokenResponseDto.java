package com.back.domain.member.dto.response;

import com.back.domain.member.dto.MemberDto;

public record MemberValidTokenResponseDto(
        MemberDto memberDto,
        String accessToken,
        String refreshToken
) {
}