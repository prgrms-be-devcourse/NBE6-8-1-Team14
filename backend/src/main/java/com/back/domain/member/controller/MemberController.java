package com.back.domain.member.controller;

import com.back.domain.member.dto.MemberDto;
import com.back.domain.member.entity.Member;
import com.back.domain.member.enums.Role;
import com.back.domain.member.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "MemberController", description = "API 회원 컨트롤러")
@SecurityRequirement(name = "bearerAuth")
public class MemberController {
    private final MemberService memberService;

    record MemberJoinReqBody(
            @NotBlank
            @Size(min = 2, max = 30)
            String email,
            @NotBlank
            @Size(min = 2, max = 30)
            String password,
            @NotBlank
            @Size(min = 2, max = 30)
            String nickname,
            @NotBlank
            @Size(min = 2, max = 30)
            String address,
            @NotNull
            Role role
    ) {
    }

    @PostMapping
    @Transactional
    @Operation(summary = "가입")
    public MemberDto join(@Valid @RequestBody MemberJoinReqBody reqBody) {
        Member member = memberService.join(
                reqBody.email(),
                reqBody.password(),
                reqBody.nickname(),
                reqBody.address(),
                reqBody.role() // USER, ADMIN을 입력하면 스프링이 자동으로 enum으로 매핑.
        );

        return new MemberDto(member);
    }
}
