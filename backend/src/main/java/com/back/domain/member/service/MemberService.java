package com.back.domain.member.service;

import com.back.domain.member.dto.MemberDto;
import com.back.domain.member.dto.MemberJoinRequestDto;
import com.back.domain.member.dto.MemberLoginRequestDto;
import com.back.domain.member.dto.MemberLoginResponseDto;
import com.back.domain.member.entity.Member;
import com.back.domain.member.exception.MemberErrorCode;
import com.back.domain.member.exception.MemberException;
import com.back.domain.member.repository.MemberRepository;
import com.back.global.jwt.authtoken.service.AuthTokenService;
import com.back.global.jwt.refreshtoken.entity.RefreshToken;
import com.back.global.jwt.refreshtoken.repository.RefreshTokenRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MemberService {
    private final AuthTokenService authTokenService;
    private final MemberRepository memberRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final HttpServletResponse resp;

    // 회원가입 로직
    @Transactional
    public MemberDto join(MemberJoinRequestDto reqBody) {
        // 이메일 중복 체크
        memberRepository
                .findByEmail(reqBody.email())
                .ifPresent(_member -> {
                    throw new MemberException(MemberErrorCode.MEMBER_ALREADY_EXISTS);
                });

        // 회원 생성. 매개변수 3개 이상일 경우엔 빌드패턴 사용 권장.
        Member member = Member.builder()
                        .email(reqBody.email())
                        .password(passwordEncoder.encode(reqBody.password()))
                        .nickname(reqBody.nickname())
                        .address(reqBody.address())
                        .role(reqBody.role()) // USER, ADMIN을 입력하면 스프링이 자동으로 enum으로 매핑.
                        .build();

        // 액세스 & 리프레시 토큰 생성
        String accessToken = generateAccessToken(member);
        RefreshToken refreshToken = generateRefreshToken(member);

        // 리프레시 토큰 저장
        member.setRefreshToken(refreshToken);

        // 응답 쿠키로 전달
        setCookie("accessToken", accessToken);
        setCookie("refreshToken", refreshToken.getToken());

        return new MemberDto(memberRepository.save(member));
    }

    // 로그인 로직
    @Transactional
    public MemberLoginResponseDto login(MemberLoginRequestDto reqBody) {
        // 이메일로 회원 조회
        Member member = findByEmail(reqBody.email())
                .orElseThrow(() -> new MemberException(MemberErrorCode.MEMBER_NOT_FOUND));

        // 비밀번호 확인
        checkPassword(member, reqBody.password());

        // 로그인 성공 시, 액세스 토큰과 리프레시 토큰 생성
        String accessToken = generateAccessToken(member);
        refreshTokenRepository.findByMemberId(member.getId())
                .ifPresentOrElse(
                        existing -> {
                            // 기존 리프레시 토큰이 있다면 업데이트
                            existing.setRefreshToken(UUID.randomUUID().toString());
                            refreshTokenRepository.save(existing);
                        },
                        () -> {
                            // 기존 리프레시 토큰이 없다면 새로 생성
                            refreshTokenRepository.save(generateRefreshToken(member));
                        }
                );

        // 응답 쿠키로 전달
        setCookie("accessToken", accessToken);
        setCookie("refreshToken", member.getRefreshToken().getToken());

        return new MemberLoginResponseDto(
                new MemberDto(memberRepository.save(member)),
                member.getRole(),
                accessToken,
                member.getRefreshToken().getToken()
        );
    }

    private void setCookie(String name, String value) {
        if (value == null) value = "";

        Cookie cookie = new Cookie(name, value);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setDomain("localhost");
        cookie.setSecure(false); // true로 하면 https로 통신하기 때문에 false로 설정
        cookie.setAttribute("SameSite", "Strict");

        if (value.isBlank()) cookie.setMaxAge(0);
        else cookie.setMaxAge(60 * 60 * 24 * 365);

        resp.addCookie(cookie);
    }

    public void deleteCookie(String name) {
        setCookie(name, null);
    }

    public Optional<Member> findByEmail(String email) {
        return memberRepository.findByEmail(email);
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

    public RefreshToken generateRefreshToken(Member member) {
        return authTokenService.generateRefreshToken(member);
    }

    public Optional<Member> findByRefreshToken(RefreshToken refreshToken) {
        return memberRepository.findByRefreshToken(refreshToken);
    }

    public void checkPassword(Member member, String password) {
        if (!passwordEncoder.matches(password, member.getPassword()))
            throw new MemberException(MemberErrorCode.MEMBER_NOT_FOUND);
    }
}