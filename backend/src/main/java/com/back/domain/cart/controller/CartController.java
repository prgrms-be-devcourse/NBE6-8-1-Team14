package com.back.domain.cart.controller;


import com.back.domain.cart.dto.request.CartItemRequestDto;
import com.back.domain.cart.dto.response.CartResponseDto;
import com.back.domain.cart.service.CartService;
import com.back.global.common.ApiResponse;
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
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartResponseDto>> addToCart(@RequestBody CartItemRequestDto cartItemRequestDto) {
        CartResponseDto createdCart = cartService.addToCart(cartItemRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success(createdCart)
        );
    }

    @GetMapping("/{cartId}")
    public ResponseEntity<ApiResponse<CartResponseDto>> showCart(@PathVariable Long cartId) {
        CartResponseDto cartResponse = cartService.showCart(cartId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.success(cartResponse)
        );
    }

    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<ApiResponse<Void>> deleteCartItem(@PathVariable Long cartItemId) {
        cartService.deleteCartItem(cartItemId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
                ApiResponse.success(null)
        );
    }

    @DeleteMapping("/{cartId}")
    public ResponseEntity<ApiResponse<Void>> deleteCart(@PathVariable Long cartId) {
        cartService.deleteCart(cartId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
                ApiResponse.success(null)
        );
    }


}
