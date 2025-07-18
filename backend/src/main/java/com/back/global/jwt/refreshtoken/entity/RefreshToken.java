package com.back.global.jwt.refreshtoken.entity;

import com.back.domain.member.entity.Member;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
@Table(name = "refresh_token")
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "refresh_token", nullable = false, unique = true)
    private String token;

    @OneToOne(mappedBy = "refreshToken", fetch = FetchType.LAZY)
    private Member member;

    @Builder
    public RefreshToken(String token, Member member) {
        this.token = token;
        this.member = member;
    }

    public void setRefreshToken(String token) {
        this.token = token;
    }

    public void setMember(Member member) {
        this.member = member;
    }
}
