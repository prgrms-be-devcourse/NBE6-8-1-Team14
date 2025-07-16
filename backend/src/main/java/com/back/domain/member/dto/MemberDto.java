package com.back.domain.member.member.dto;

import com.back.domain.member.member.entity.Member;
import org.springframework.lang.NonNull;

import java.time.LocalDateTime;

public record MemberDto(
        @NonNull int id,
        @NonNull LocalDateTime createDate,
        @NonNull LocalDateTime modifyDate,
        @NonNull String name
) {
    public MemberDto(int id, LocalDateTime createDate, LocalDateTime modifyDate, String name) {
        this.id = id;
        this.createDate = createDate;
        this.modifyDate = modifyDate;
        this.name = name;
    }

    public MemberDto(Member member) {
        this(
                member.getId(),
                member.getCreateDate(),
                member.getModifyDate(),
                member.getName()
        );
    }
}
