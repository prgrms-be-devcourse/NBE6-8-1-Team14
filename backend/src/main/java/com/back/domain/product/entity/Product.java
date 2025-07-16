package com.back.domain.product.entity;

import com.back.domain.order.entity.OrderItem;
import com.back.domain.product.enums.StockStatus;
import com.back.domain.product.exception.ProductErrorCode;
import com.back.domain.product.exception.ProductException;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Getter
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
@Table(name = "product")
@EntityListeners(AuditingEntityListener.class)
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long id;

    @Column(name = "product_name", nullable = false)
    private String name;

    @Column(name = "product_price", nullable = false)
    private int price;

    @Column(name = "product_description")
    @Lob
    private String description;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime editedAt;

    @Column(name = "image_path")
    private String imagePath;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_id")
    private Stock stock;

    @Builder
    public Product(String name, int price, String description, String imagePath) {
        this.name = name;
        this.price = price;
        this.description = description;
        this.imagePath = imagePath;
    }

    public void increaseStock(int count) {
        if (stock == null) {
            stock = new Stock(count, StockStatus.IN_STOCK, this);
        } else {
            stock.increaseCount(count);
        }
    }

    public void decreaseStock(@Min(1) @Max(999) int quantity) {
        if (stock == null || stock.getQuantity() < quantity) {
            throw new ProductException(ProductErrorCode.PRODUCT_NOT_ENOUGH_STOCK);
        }
        stock.updateQuantity(stock.getQuantity() - quantity);
        if (stock.getQuantity() <= 0) {
            stock.updateStockStatus(StockStatus.OUT_OF_STOCK);
        }
    }
}
