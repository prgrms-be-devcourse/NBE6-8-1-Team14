package com.back.domain.member.controller;

import com.back.domain.member.dto.MemberDto;
import com.back.domain.member.dto.MemberJoinRequestDto;
import com.back.domain.member.entity.Member;
import com.back.domain.member.service.MemberService;
import com.back.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "MemberController", description = "API 회원 컨트롤러")
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class MemberController {
    private final MemberService memberService;

    @Operation(summary = "회원가입", description = "회원가입 API")
    @PostMapping
    @Transactional
    public ResponseEntity<ApiResponse<MemberDto>> join(
            @Valid @RequestBody MemberJoinRequestDto reqBody
    ) {
        Member member = memberService.join(
                reqBody.email(),
                reqBody.password(),
                reqBody.nickname(),
                reqBody.address(),
                reqBody.role() // USER, ADMIN을 입력하면 스프링이 자동으로 enum으로 매핑.
        );

        // 성공 응답
        return ResponseEntity.ok(
                ApiResponse.success(
                        "%s님 환영합니다. 회원가입이 완료되었습니다.".formatted(member.getNickname()),
                        new MemberDto(member)
                )
        );
    }
}