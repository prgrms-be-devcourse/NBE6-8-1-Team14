package com.back.domain.member.dto.response;

import com.back.domain.member.entity.Member;

import java.time.LocalDateTime;

public record MemberInfoUpdateResponseDto(
        String password,
        String nickname,
        String address,
        LocalDateTime editedAt
) {
    public MemberInfoUpdateResponseDto(Member member) {
        this(
                member.getPassword(),
                member.getNickname(),
                member.getAddress(),
                member.getEditedAt()
        );
    }
}