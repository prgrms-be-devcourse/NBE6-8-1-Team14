package com.back.domain.product.service;

import com.back.domain.product.entity.Product;
import com.back.domain.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;

    public Product create(String name, int price, String description, String imagePath) {
        Product product = Product.builder()
                .name(name)
                .price(price)
                .description(description)
                .imagePath(imagePath)
                .build();

        return productRepository.save(product);
    }

    public void update(Product product, String name, int price, String description, String imagePath) {
        product.update(name, price, description, imagePath);
    }

    public void delete(Product product) {
        productRepository.delete(product);
    }

    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public Optional<Product> findById(long id) {
        return productRepository.findById(id);
    }
}
