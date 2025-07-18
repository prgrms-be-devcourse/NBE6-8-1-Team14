package com.back.domain.member.service;

import com.back.domain.member.entity.Member;
import com.back.domain.member.enums.Role;
import com.back.domain.member.exception.MemberErrorCode;
import com.back.domain.member.exception.MemberException;
import com.back.domain.member.repository.MemberRepository;
import com.back.global.jwt.authtoken.service.AuthTokenService;
import com.back.global.jwt.refreshtoken.entity.RefreshToken;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MemberService {
    private final AuthTokenService authTokenService;
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    public Member join(String email, String password, String nickname, String address, Role role) {
        // 이메일 중복 체크
        memberRepository
                .findByEmail(email)
                .ifPresent(_member -> {
                    throw new MemberException(MemberErrorCode.MEMBER_NOT_FOUND);
                });

        // 리프레시 토큰 저장
        RefreshToken refreshToken = RefreshToken.builder()
                .token(generateRefreshToken())
                .build();

        // 회원 생성. 매개변수 3개 이상일 경우엔 빌드패턴 사용 권장.
        Member member = Member.builder()
                        .email(email)
                        .password(passwordEncoder.encode(password))
                        .nickname(nickname)
                        .address(address)
                        .role(role)
                        .refreshToken(refreshToken)
                        .build();

        refreshToken.setMember(member);

        return memberRepository.save(member);
    }

    public Optional<Member> findByEmail(String email) {
        return memberRepository.findByEmail(email);
    }

    public Optional<Member> findByRefreshToken(RefreshToken refreshToken) {
        return memberRepository.findByRefreshToken(refreshToken);
    }

    public Optional<Member> findById(long id) {
        return memberRepository.findById(id);
    }

    public List<Member> findAll() {
        return memberRepository.findAll();
    }

    public String generateAccessToken(Member member) {
        return authTokenService.generateAccessToken(member);
    }

    public String generateRefreshToken() {
        return authTokenService.generateRefreshToken();
    }

    public void checkPassword(Member member, String password) {
        if (!passwordEncoder.matches(password, member.getPassword()))
            throw new MemberException(MemberErrorCode.MEMBER_NOT_FOUND);
    }
}