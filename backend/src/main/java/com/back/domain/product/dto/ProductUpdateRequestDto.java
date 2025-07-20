package com.back.domain.product.dto;

import com.back.domain.product.enums.StockStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

@Schema(description = "상품 등록 요청 DTO")
public record ProductUpdateRequestDto(
        @NotBlank
        @Size(min = 2, max = 50)
        @Schema(description = "상품명", example = "아메리카노")
        String name,

        @PositiveOrZero
        @Schema(description = "상품 가격", example = "5000")
        int price,

        @NotBlank
        @Size(min = 2, max = 100)
        @Schema(description = "상품 상세설명", example = "신선한 원두로 만든 아메리카노입니다.")
        String description,

        @NotBlank
        @Size(min = 2, max = 100)
        @Schema(description = "상품 이미지 경로", example = "/var/images/americano.jpg")
        String imagePath,

        int stockQuantity,

        StockStatus stockStatus
) {
}