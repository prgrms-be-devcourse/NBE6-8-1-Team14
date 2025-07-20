package com.back.domain.product.dto;

import com.back.domain.product.entity.Stock;
import com.back.domain.product.enums.StockStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.lang.NonNull;

@Schema(description = "상품 재고 DTO")
public record StockDto(
        @NonNull int quantity,
        @NonNull StockStatus stockStatus
) {
    public StockDto(Stock stock) {
        this(
                stock.getQuantity(),
                stock.getStockStatus()
        );
    }
}