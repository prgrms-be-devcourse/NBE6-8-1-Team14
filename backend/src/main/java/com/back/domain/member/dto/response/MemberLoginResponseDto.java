package com.back.domain.member.dto.response;

import com.back.domain.member.dto.MemberDto;

import com.back.domain.member.enums.Role;

public record MemberLoginResponseDto(
        MemberDto memberDto,
        Role role,
        String accessToken,
        String refreshToken
) {
}