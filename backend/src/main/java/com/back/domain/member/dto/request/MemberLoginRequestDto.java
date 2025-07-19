package com.back.domain.member.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MemberLoginRequestDto(
        @NotBlank
        @Size(min = 2, max = 50)
        @Schema(description = "이메일", example = "user@example.com")
        String email,

        // BCrypt 암호화 방식의 경우 60자
        @NotBlank
        @Size(min = 2, max = 60)
        @Schema(description = "비밀번호", example = "securePassword123")
        String password
) {
}