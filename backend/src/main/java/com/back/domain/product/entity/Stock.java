package com.back.domain.product.entity;


import com.back.domain.product.enums.StockStatus;
import com.back.domain.product.exception.ProductErrorCode;
import com.back.domain.product.exception.ProductException;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
@Table(name = "stock")
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stock_id")
    private Long id;

    @Column(name = "stock_quantity", nullable = false)
    private int quantity;

    @Column(name = "stock_status")
    @Enumerated(EnumType.STRING)
    private StockStatus stockStatus;

    @OneToOne(mappedBy = "stock", fetch = FetchType.LAZY)
    private Product product;

    @Builder
    public Stock(int quantity, StockStatus stockStatus, Product product) {
        this.quantity = quantity;
        this.stockStatus = stockStatus;
        this.product = product;
    }

    public void increaseCount(int count) {
        if (count <= 0) {
            throw new ProductException(ProductErrorCode.PRODUCT_OUT_OF_STOCK);
        }
        this.quantity += count;
//        updateStockStatus(); // 재고량에 맞춰 재고 상태 업데이트는 자동으로 하지 않기로
    }

    public void updateQuantity(int quantity) {
        if (quantity < 0) {
            throw new ProductException(ProductErrorCode.PRODUCT_OUT_OF_STOCK);
        }
        this.quantity = quantity;
    }

    public void updateStockStatus(StockStatus stockStatus) {
        this.stockStatus = stockStatus;
    }
}
