package com.back.domain.member.dto.request;

import com.back.domain.member.enums.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Schema(description = "회원가입 요청 DTO")
public record MemberJoinRequestDto(
        @NotBlank
        @Size(min = 2, max = 50)
        @Schema(description = "이메일", example = "user@example.com")
        String email,

        // BCrypt 암호화 방식의 경우 60자
        @NotBlank
        @Size(min = 2, max = 60)
        @Schema(description = "비밀번호", example = "securePassword123")
        String password,

        @NotBlank
        @Size(min = 2, max = 30)
        @Schema(description = "닉네임", example = "nickname123")
        String nickname,

        @NotBlank
        @Size(min = 2, max = 100)
        @Schema(description = "주소", example = "서울시 강남구 역삼동")
        String address,

        @NotNull
        @Schema(description = "역할", example = "USER", allowableValues = {"USER", "ADMIN"})
        Role role
) {
}
