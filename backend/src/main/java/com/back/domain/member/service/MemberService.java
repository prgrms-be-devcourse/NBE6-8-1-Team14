package com.back.domain.member.service;

import com.back.domain.member.dto.request.MemberInfoUpdateRequestDto;
import com.back.domain.member.dto.request.MemberJoinRequestDto;
import com.back.domain.member.dto.request.MemberRefreshTokenRequestDto;
import com.back.domain.member.dto.request.MemberLoginRequestDto;
import com.back.domain.member.dto.response.MemberInfoResponseDto;
import com.back.domain.member.dto.response.MemberInfoUpdateResponseDto;
import com.back.domain.member.entity.Member;
import com.back.domain.member.exception.MemberErrorCode;
import com.back.domain.member.exception.MemberException;
import com.back.domain.member.repository.MemberRepository;
import com.back.global.exception.CustomException;
import com.back.global.exception.ErrorCode;
import com.back.global.jwt.authtoken.service.AuthTokenService;
import com.back.global.jwt.refreshtoken.entity.RefreshToken;
import com.back.global.jwt.refreshtoken.repository.RefreshTokenRepository;
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

    // 회원가입 로직
    @Transactional
    public Member join(MemberJoinRequestDto reqBody) {
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
                        .role(reqBody.role()) // USER, ADMIN을 입력하면 스프링이 자동으로 enum으로 매핑.
                        .build();
        return memberRepository.save(member);
    }

    // 로그인 로직
    @Transactional
    public Member login(MemberLoginRequestDto reqBody) {
        // 이메일로 회원 조회
        Member member = findByEmail(reqBody.email())
                .orElseThrow(() -> new MemberException(MemberErrorCode.MEMBER_NOT_FOUND));

        // 비밀번호 확인
        checkPassword(member, reqBody.password());

        memberRepository.save(member);

        return member;
    }

    public String getRefreshTokenOrNew(Member member) {
        refreshTokenRepository.findByMemberId(member.getId())
                .ifPresentOrElse(
                        existing -> {
                            // 기존 리프레시 토큰이 있다면 업데이트
                            existing.setRefreshToken(UUID.randomUUID().toString());
                            refreshTokenRepository.save(existing);
                            // 리프레시 토큰 저장
                            member.setRefreshToken(existing);
                        },
                        () -> {
                            // 기존 리프레시 토큰이 없다면 새로 생성
                            // 리프레시 토큰 저장
                            member.setRefreshToken(refreshTokenRepository.save(generateRefreshToken(member)));
                        }
                );
        return member.getRefreshToken().getToken();
    }

    // 로그아웃 로직
    @Transactional
    public void logout(MemberRefreshTokenRequestDto reqBody) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(reqBody.refreshToken())
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_REFRESH_TOKEN));

        // member의 연관관계 끊기
        Member member = refreshToken.getMember();
        if (member != null) {
            member.setRefreshToken(null);
        }

        // DB에 저장된 리프레시 토큰 삭제
        refreshTokenRepository.delete(refreshToken);
    }

    // 리프레시 토큰 유효성 검사
    @Transactional
    public Member findValidToken(String token) {

        if (token == null) {
            throw new CustomException(ErrorCode.TOKEN_NOT_FOUND);
        }

        // 토큰 유효성 확인 및 사용자 조회
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_REFRESH_TOKEN));

        // 새로운 토큰 발급
        Member member = refreshToken.getMember();

        // 기존 refreshToken 갱신
        refreshToken.setRefreshToken(UUID.randomUUID().toString());
        refreshTokenRepository.save(refreshToken);
        member.setRefreshToken(refreshToken);
        memberRepository.save(member);

        return member;
    }

    // 회원 정보 조회
    @Transactional(readOnly = true)
    public MemberInfoResponseDto getMemberInfo(String accessToken) {
        Member member = findMemberByAccessToken(accessToken);

        return new MemberInfoResponseDto(
                member.getEmail(),
                member.getNickname(),
                member.getAddress(),
                member.getCreatedAt(),
                member.getEditedAt()
        );
    }

    // 회원 정보 수정
    @Transactional
    public MemberInfoUpdateResponseDto updateMemberInfo(MemberInfoUpdateRequestDto reqBody, String accessToken) {
        Member member = findMemberByAccessToken(accessToken);

        member.update(
                passwordEncoder.encode(reqBody.password()),
                reqBody.nickname(),
                reqBody.address()
        );

        memberRepository.save(member);

        return new MemberInfoUpdateResponseDto(member);
    }

    // 현재 로그인된 회원을 찾는 메서드
    private Member findMemberByAccessToken(String accessToken) {
        if (accessToken == null || accessToken.isBlank()) {
            throw new CustomException(ErrorCode.TOKEN_NOT_FOUND);
        }

        // 토큰에서 회원 ID 추출
        Long memberId = Long.valueOf(authTokenService.extractSubject(accessToken));

        return memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(MemberErrorCode.MEMBER_NOT_FOUND));
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