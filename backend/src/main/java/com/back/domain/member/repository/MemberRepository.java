package com.back.domain.member.repository;

import com.back.domain.member.entity.Member;
import com.back.global.jwt.refreshtoken.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    
    Optional<Member> findByEmail(String email);

    Optional<Member> findByRefreshToken(RefreshToken refreshToken);

}

