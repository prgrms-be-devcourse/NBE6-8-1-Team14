package com.back.domain.member.dto;

import com.back.domain.member.entity.Member;
import org.springframework.lang.NonNull;

import java.time.LocalDateTime;

public record MemberDto(
        @NonNull long id,
        @NonNull LocalDateTime createdAt,
        @NonNull LocalDateTime editedAt,
        @NonNull String nickname
) {
    public MemberDto(long id, LocalDateTime createdAt, LocalDateTime editedAt, String nickname) {
        this.id = id;
        this.createdAt = createdAt;
        this.editedAt = editedAt;
        this.nickname = nickname;
    }

    public MemberDto(Member member) {
        this(
                member.getId(),
                member.getCreatedAt(),
                member.getEditedAt(),
                member.getNickname()
        );
    }
}
