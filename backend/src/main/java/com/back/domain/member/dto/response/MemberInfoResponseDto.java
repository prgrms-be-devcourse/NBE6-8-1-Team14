package com.back.domain.member.dto.response;

import java.time.LocalDateTime;

public record MemberInfoResponseDto(
        String email,
        String nickname,
        String address,
        LocalDateTime createdAt,
        LocalDateTime editedAt
) {
}