package com.back.domain.product.dto;

import com.back.domain.product.entity.Product;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.lang.NonNull;

import java.time.LocalDateTime;

@Schema(description = "상품 DTO")
public record ProductDto(
        @NonNull Long id,
        @NonNull String name,
        @NonNull int price,
        @NonNull String description,
        @NonNull LocalDateTime createdAt,
        @NonNull LocalDateTime editedAt,
        @NonNull String imagePath,
        @NonNull StockDto stockDto
) {
    public ProductDto(Product product) {
        this(
                product.getId(),
                product.getName(),
                product.getPrice(),
                product.getDescription(),
                product.getCreatedAt(),
                product.getEditedAt(),
                product.getImagePath(),
                new StockDto(product.getStock())
        );
    }
}