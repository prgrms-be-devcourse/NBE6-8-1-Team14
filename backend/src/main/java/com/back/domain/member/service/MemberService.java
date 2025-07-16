package com.back.domain.member.service;

import com.back.domain.member.entity.Member;
import com.back.domain.member.enums.Role;
import com.back.domain.member.repository.MemberRepository;
import com.back.global.exception.CustomException;
import com.back.global.exception.ErrorCode;
import com.back.global.jwt.refreshtoken.entity.RefreshToken;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MemberService {
//    private final AuthTokenService authTokenService;
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    public long count() {
        return memberRepository.count();
    }

    public Member join(String email, String password, String nickname, String address, Role role) {
        memberRepository
                .findByEmail(email)
                .ifPresent(_member -> {
                    throw new CustomException(ErrorCode.DEV_NOT_FOUND);
                });

        Member member = new Member(email, passwordEncoder.encode(password), nickname, address, role);

        return memberRepository.save(member);
    }

    public Optional<Member> findByEmail(String email) {
        return memberRepository.findByEmail(email);
    }

    public Optional<Member> findByRefreshToken(RefreshToken refreshToken) {
        return memberRepository.findByRefreshToken(refreshToken);
    }

    public Optional<Member> findById(int id) {
        return memberRepository.findById(id);
    }

    public List<Member> findAll() {
        return memberRepository.findAll();
    }

    public void checkPassword(Member member, String password) {
        if (!passwordEncoder.matches(password, member.getPassword()))
            throw new CustomException(ErrorCode.DEV_NOT_FOUND);
    }
}