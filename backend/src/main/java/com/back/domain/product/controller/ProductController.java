package com.back.domain.product.controller;

import com.back.domain.product.dto.ProductDto;
import com.back.domain.product.dto.ProductRequestDto;
import com.back.domain.product.dto.ProductUpdateRequestDto;
import com.back.domain.product.entity.Product;
import com.back.domain.product.service.ProductService;
import com.back.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
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
    @Transactional
    public ResponseEntity<ApiResponse<ProductDto>> create(
            @Valid @RequestBody ProductRequestDto reqBody
    ) {
        // 권한 체크
//        Member actor = rq.getActor();

        // 상품 등록
        Product product = productService.create(
                reqBody.name(),
                reqBody.price(),
                reqBody.description(),
                reqBody.imagePath()
        );

        // 성공 응답
        return ResponseEntity.ok(
                ApiResponse.success(
                        "%s 상품이 등록되었습니다.".formatted(product.getName()),
                        new ProductDto(product)
                )
        );
    }

    @Operation(summary = "상품 전체 조회", description = "상품 전체 조회 API")
    @GetMapping
    @Transactional(readOnly = true)
    public List<ProductDto> getAllProducts() {
        List<Product> products = productService.findAll();

        // 성공 응답
        return products
                .stream()
                .map(ProductDto::new) // ProductDto 변환
                .toList();
    }

    @Operation(summary = "상품 수정", description = "상품 수정 API")
    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<ApiResponse<String>> modify(
            @PathVariable int id,
            @Valid @RequestBody ProductUpdateRequestDto reqBody
    ) {
        // 권한 체크
//        Member actor = rq.getActor();

        Product product = productService.findById(id).get();

//        post.checkActorCanModify(actor);

        productService.update(
                product,
                reqBody.name(),
                reqBody.price(),
                reqBody.description(),
                reqBody.imagePath()
        );

        // 성공 응답
        return ResponseEntity.ok(
                ApiResponse.success(
                        "%s 번 상품이 수정되었습니다.".formatted(product.getId())
                )
        );
    }

    @Operation(summary = "상품 삭제", description = "상품 삭제 API")
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<ApiResponse<String>> delete(
            @PathVariable int id
    ) {
        // 권한 체크
//        Member actor = rq.getActor();

        Product product = productService.findById(id).get();

//        post.checkActorCanModify(actor);

        productService.delete(product);

        // 성공 응답
        return ResponseEntity.ok(
                ApiResponse.success(
                        "%s 번 상품이 삭제되었습니다.".formatted(product.getId())
                )
        );
    }
}
