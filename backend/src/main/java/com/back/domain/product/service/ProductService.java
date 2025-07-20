package com.back.domain.product.service;

import com.back.domain.product.dto.ProductDto;
import com.back.domain.product.dto.ProductRequestDto;
import com.back.domain.product.dto.ProductUpdateRequestDto;
import com.back.domain.product.entity.Product;
import com.back.domain.product.entity.Stock;
import com.back.domain.product.exception.ProductErrorCode;
import com.back.domain.product.exception.ProductException;
import com.back.domain.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;

    @Transactional
    public ProductDto create(ProductRequestDto reqBody) {
        Product product = Product.builder()
                .name(reqBody.name())
                .price(reqBody.price())
                .description(reqBody.description())
                .imagePath(reqBody.imagePath())
                .build();

        Stock stock = Stock.builder()
                .quantity(reqBody.stockQuantity())
                .stockStatus(reqBody.stockStatus())
                .product(product) // Product와 Stock을 연결
                .build();

        product.setStock(stock);

        return new ProductDto(productRepository.save(product));
    }

    @Transactional
    public ProductDto update(Long productId, ProductUpdateRequestDto reqBody) {
        Product product = findById(productId);

        product.update(
                reqBody.name(),
                reqBody.price(),
                reqBody.description(),
                reqBody.imagePath()
        );

        return new ProductDto(product);
    }

    @Transactional
    public ProductDto delete(Product product) {
        productRepository.delete(product);
        return new ProductDto(product);
    }

    @Transactional(readOnly = true)
    public List<ProductDto> findAll() {
        return productRepository.findAll().stream()
                .map(ProductDto::new) // ProductDto 변환
                .toList();
    }

    public Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductException(ProductErrorCode.PRODUCT_NOT_FOUND));
    }
}
