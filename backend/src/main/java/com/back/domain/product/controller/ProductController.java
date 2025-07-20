package com.back.domain.product.controller;

import com.back.domain.product.dto.ProductDto;
import com.back.domain.product.dto.ProductRequestDto;
import com.back.domain.product.dto.ProductUpdateRequestDto;
import com.back.domain.product.service.ProductService;
import com.back.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Tag(name = "ProductController", description = "API 상품 컨트롤러")
@RequestMapping("/api/products")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class ProductController {
    private final ProductService productService;

    @Operation(summary = "상품 등록", description = "상품 등록 API")
    @PostMapping
    public ResponseEntity<ApiResponse<ProductDto>> create(
            @Valid @RequestBody ProductRequestDto reqBody
    ) {
        // 상품 등록
        ProductDto productDto = productService.create(reqBody);

        // 성공 응답
        return ResponseEntity.ok(
                ApiResponse.success(
                        "%s 상품이 등록되었습니다.".formatted(productDto.name()),
                        productDto
                )
        );
    }

    @Operation(summary = "상품 전체 조회", description = "상품 전체 조회 API")
    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductDto>>> getAllProducts() {
        List<ProductDto> productDtoList = productService.findAll();

        // 성공 응답
        return ResponseEntity.ok(
                ApiResponse.success(
                        "상품 전체 조회입니다.",
                        productDtoList
                )
        );
    }

    @Operation(summary = "상품 단일 조회", description = "상품 단일 조회 API")
    @GetMapping("/{productId}")
    public ResponseEntity<ApiResponse<ProductDto>> getProductById(
            @PathVariable Long productId
    ) {
        ProductDto productDto = new ProductDto(productService.findById(productId));

        // 성공 응답
        return ResponseEntity.ok(
                ApiResponse.success(
                        "%s 상품을 조회했습니다".formatted(productDto.name()),
                        productDto
                )
        );
    }

    @Operation(summary = "상품 수정", description = "상품 수정 API")
    @PutMapping("/{productId}")
    public ResponseEntity<ApiResponse<ProductDto>> update(
            @PathVariable Long productId,
            @Valid @RequestBody ProductUpdateRequestDto reqBody
    ) {
        ProductDto productDto = productService.update(productId, reqBody);

        // 성공 응답
        return ResponseEntity.ok(
                ApiResponse.success(
                        "%s 번 상품이 수정되었습니다.".formatted(productDto.id()),
                        productDto
                )
        );
    }

    @Operation(summary = "상품 삭제", description = "상품 삭제 API")
    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse<String>> delete(
            @PathVariable Long productId
    ) {
        ProductDto productDto = productService.delete(productService.findById(productId));

        // 성공 응답
        return ResponseEntity.ok(
                ApiResponse.success(
                        "%s 번 상품이 삭제되었습니다.".formatted(productDto.id())
                )
        );
    }
}
