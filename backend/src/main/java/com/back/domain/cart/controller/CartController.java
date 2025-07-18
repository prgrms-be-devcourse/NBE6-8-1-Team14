package com.back.domain.cart.controller;


import com.back.domain.cart.dto.request.CartItemCountUpdateRequestDto;
import com.back.domain.cart.dto.request.CartItemRequestDto;
import com.back.domain.cart.dto.request.CartRequestDto;
import com.back.domain.cart.dto.response.CartResponseDto;
import com.back.domain.cart.service.CartService;
import com.back.domain.order.dto.response.OrderResponseDto;
import com.back.domain.order.service.OrderService;
import com.back.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/carts")
@Tag(name = "CartController", description = "API 장바구니 컨트롤러")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/items")
    @Operation(summary = "장바구니에 상품 추가 API", description = "장바구니에 상품을 추가합니다.")
    public ResponseEntity<ApiResponse<CartResponseDto>> addToCart(@RequestBody CartItemRequestDto cartItemRequestDto) {
        CartResponseDto createdCart = cartService.addToCart(cartItemRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success(createdCart)
        );
    }

    @GetMapping("/{memberId}")
    @Operation(summary = "장바구니 상세 조회 API", description = "회원 ID로 장바구니의 상세 정보를 조회합니다.")
    public ResponseEntity<ApiResponse<CartResponseDto>> showCart(@PathVariable Long memberId) {
        CartResponseDto cartResponse = cartService.showCart(memberId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.success(cartResponse)
        );
    }

    @DeleteMapping("/items/{cartItemId}")
    @Operation(summary = "장바구니 아이템 삭제 API", description = "장바구니 아이템 ID로 장바구니 아이템을 삭제합니다.")
    public ResponseEntity<ApiResponse<Void>> deleteCartItem(@PathVariable Long cartItemId) {
        cartService.deleteCartItem(cartItemId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
                ApiResponse.success(null)
        );
    }

    @DeleteMapping("/{memberId}")
    @Operation(summary = "장바구니 삭제 API", description = "회원 ID로 장바구니를 삭제합니다.")
    public ResponseEntity<ApiResponse<Void>> deleteCart(@PathVariable Long memberId) {
        cartService.deleteCart(memberId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
                ApiResponse.success(null)
        );
    }

    @PostMapping("/orders/from-cart")
    @Operation(summary = "장바구니에서 주문 생성 API", description = "장바구니의 아이템으로 주문을 생성합니다.")
    public ResponseEntity<ApiResponse<OrderResponseDto>> orderFromCart(@RequestBody CartRequestDto cartRequestDto) {
        OrderResponseDto orderResponse = cartService.createOrderFromCart(cartRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success(orderResponse)
        );
    }

    @PostMapping("/items/count")
    @Operation(summary = "장바구니 아이템 +-1 수량 업데이트 API", description = "장바구니 아이템의 +-1 수량을 업데이트합니다.")
    public ResponseEntity<ApiResponse<CartResponseDto>> updateCartItemCount(
            @RequestBody CartItemCountUpdateRequestDto cartItemCountUpdateRequestDto
    ) {
        CartResponseDto cartResponse = cartService.updateCartItemCount(cartItemCountUpdateRequestDto);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.success(cartResponse)
        );
    }



}
