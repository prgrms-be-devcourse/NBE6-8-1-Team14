package com.back.domain.member.controller;

import com.back.domain.member.dto.MemberDto;
import com.back.domain.member.dto.request.MemberInfoUpdateRequestDto;
import com.back.domain.member.dto.request.MemberJoinRequestDto;
import com.back.domain.member.dto.request.MemberLoginRequestDto;
import com.back.domain.member.dto.response.MemberInfoResponseDto;
import com.back.domain.member.dto.response.MemberInfoUpdateResponseDto;
import com.back.domain.member.dto.response.MemberLoginResponseDto;
import com.back.domain.member.dto.response.MemberValidTokenResponseDto;
import com.back.domain.member.service.MemberService;
import com.back.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "MemberController", description = "API 회원 컨트롤러")
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class MemberController {
    private final MemberService memberService;

    @Operation(summary = "회원가입", description = "회원가입 API")
    @PostMapping
    public ResponseEntity<ApiResponse<MemberDto>> join(
            @Valid @RequestBody MemberJoinRequestDto reqBody
    ) {
        MemberDto memberDto = memberService.join(reqBody);

        // 성공 응답
        return ResponseEntity.ok(
                ApiResponse.success(
                        "%s님 환영합니다. 회원가입이 완료되었습니다.".formatted(memberDto.nickname()),
                        memberDto
                )
        );
    }

    @Operation(summary = "로그인", description = "로그인 API")
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<MemberLoginResponseDto>> login(
            @Valid @RequestBody MemberLoginRequestDto reqBody
    ) {
        MemberLoginResponseDto memberLoginResponseDto = memberService.login(reqBody);

        // 성공 응답
        return ResponseEntity.ok(
                ApiResponse.success(
                        "%s님 환영합니다.".formatted(memberLoginResponseDto.memberDto().nickname()),
                        memberLoginResponseDto
                )
        );
    }

    @Operation(summary = "로그아웃", description = "로그아웃 API")
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout() {
        memberService.logout();

        // 성공 응답
        return ResponseEntity.ok(
                ApiResponse.success("로그아웃 되었습니다.")
        );
    }

    @Operation(summary = "토큰 유효성 검사", description = "토큰 유효성 검사 API")
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<MemberValidTokenResponseDto>> findValidToken(
    ) {
        MemberValidTokenResponseDto memberValidTokenResponseDto = memberService.findValidToken("refreshToken");

        // 성공 응답
        return ResponseEntity.ok(
                ApiResponse.success(
                        "토큰 유효성 검사를 완료했습니다",
                        memberValidTokenResponseDto
                )
        );
    }

    @Operation(summary = "회원 정보 조회", description = "회원 정보 조회 API")
    @GetMapping("/memberInfo")
    public ResponseEntity<ApiResponse<MemberInfoResponseDto>> getMemberInfo() {
        MemberInfoResponseDto memberInfoResponseDto = memberService.getMemberInfo();

        // 성공 응답
        return ResponseEntity.ok(
                ApiResponse.success(
                        "회원 정보 조회입니다.",
                        memberInfoResponseDto
                )
        );
    }

    @Operation(summary = "회원 정보 수정", description = "회원 정보 수정 API")
    @PutMapping("/memberInfo")
    public ResponseEntity<ApiResponse<MemberInfoUpdateResponseDto>> updateMemberInfo(
            @Valid @RequestBody MemberInfoUpdateRequestDto reqBody
    ) {
        MemberInfoUpdateResponseDto MemberInfoUpdateResponseDto = memberService.updateMemberInfo(reqBody);
        // 성공 응답
        return ResponseEntity.ok(
                ApiResponse.success(
                        "회원 정보를 수정했습니다.",
                        MemberInfoUpdateResponseDto
                )
        );
    }
}