package com.back.domain.member.controller;

import com.back.domain.member.dto.MemberDto;
import com.back.domain.member.dto.request.MemberInfoUpdateRequestDto;
import com.back.domain.member.dto.request.MemberJoinRequestDto;
import com.back.domain.member.dto.request.MemberLoginRequestDto;
import com.back.domain.member.dto.response.MemberInfoResponseDto;
import com.back.domain.member.dto.response.MemberInfoUpdateResponseDto;
import com.back.domain.member.dto.response.MemberLoginResponseDto;
import com.back.domain.member.dto.response.MemberValidTokenResponseDto;
import com.back.domain.member.entity.Member;
import com.back.domain.member.service.MemberService;
import com.back.global.common.ApiResponse;
import com.back.global.jwt.cookie.CookieConfig;
import com.back.global.jwt.refreshtoken.entity.RefreshToken;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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
    private final CookieConfig cookieConfig;

    @Operation(summary = "회원가입", description = "회원가입 API")
    @PostMapping
    public ResponseEntity<ApiResponse<MemberDto>> join(
            HttpServletResponse resp,
            @Valid @RequestBody MemberJoinRequestDto reqBody
    ) {
        Member member = memberService.join(reqBody);

        // 액세스 & 리프레시 토큰 생성
        String accessToken = memberService.generateAccessToken(member);
        RefreshToken refreshToken = memberService.generateRefreshToken(member);
        // 리프레시 토큰 저장
        member.setRefreshToken(refreshToken);

        // 응답 쿠키로 전달
        cookieConfig.setCookie(resp, "accessToken", accessToken);
        cookieConfig.setCookie(resp, "refreshToken", refreshToken.getToken());

        // 성공 응답
        return ResponseEntity.ok(
                ApiResponse.success(
                        "%s님 환영합니다. 회원가입이 완료되었습니다.".formatted(member.getNickname()),
                        new MemberDto(member)
                )
        );
    }

    @Operation(summary = "로그인", description = "로그인 API")
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<MemberLoginResponseDto>> login(
            HttpServletResponse resp,
            @Valid @RequestBody MemberLoginRequestDto reqBody
    ) {
        Member member = memberService.login(reqBody);

        // 로그인 성공 시, 액세스 토큰과 리프레시 토큰 생성
        String accessToken = memberService.generateAccessToken(member);
        String refreshToken = memberService.getRefreshTokenOrNew(member);

        // 응답 쿠키로 전달
        cookieConfig.setCookie(resp, "accessToken", accessToken);
        cookieConfig.setCookie(resp, "refreshToken", member.getRefreshToken().getToken());

        MemberLoginResponseDto memberLoginResponseDto = new MemberLoginResponseDto(
                new MemberDto(member),
                member.getRole(),
                refreshToken
        );

        // 성공 응답
        return ResponseEntity.ok(
                ApiResponse.success(
                        "%s님 환영합니다.".formatted(member.getNickname()),
                        memberLoginResponseDto
                )
        );
    }

    @Operation(summary = "로그아웃", description = "로그아웃 API")
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(
            HttpServletRequest req,
            HttpServletResponse resp
    ) {
        String refreshToken = cookieConfig.getCookieValue(req, "refreshToken");
        memberService.logout(refreshToken);

        // 액세스 토큰 쿠키와 리프레시 토큰 쿠키 삭제
        cookieConfig.deleteCookie(resp, "accessToken");
        cookieConfig.deleteCookie(resp, "refreshToken");

        // 성공 응답
        return ResponseEntity.ok(
                ApiResponse.success("로그아웃 되었습니다.")
        );
    }

    @Operation(summary = "토큰 유효성 검사", description = "토큰 유효성 검사 API")
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<MemberValidTokenResponseDto>> findValidToken(
            HttpServletRequest req,
            HttpServletResponse resp
    ) {
        // 쿠키에서 리프레시 토큰 추출
        String token = cookieConfig.getCookieValue(req, "refreshToken");
        Member member = memberService.findValidToken(token);

        String newAccessToken = memberService.generateAccessToken(member);
        String refreshtoken = member.getRefreshToken().getToken();

        // 쿠키에 새 토큰 설정
        cookieConfig.setCookie(resp, "accessToken", newAccessToken);
        cookieConfig.setCookie(resp, "refreshToken", refreshtoken);

        MemberValidTokenResponseDto memberValidTokenResponseDto = new MemberValidTokenResponseDto(
                new MemberDto(member),
                newAccessToken,
                refreshtoken
        );

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
    public ResponseEntity<ApiResponse<MemberInfoResponseDto>> getMemberInfo(
            HttpServletRequest req
    ) {
        String accessToken = cookieConfig.getCookieValue(req, "accessToken");
        MemberInfoResponseDto memberInfoResponseDto = memberService.getMemberInfo(accessToken);

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
            HttpServletRequest req,
            @Valid @RequestBody MemberInfoUpdateRequestDto reqBody
    ) {
        String accessToken = cookieConfig.getCookieValue(req, "accessToken");
        MemberInfoUpdateResponseDto MemberInfoUpdateResponseDto = memberService.updateMemberInfo(reqBody, accessToken);
        // 성공 응답
        return ResponseEntity.ok(
                ApiResponse.success(
                        "회원 정보를 수정했습니다.",
                        MemberInfoUpdateResponseDto
                )
        );
    }
}