package com.back.domain.cart.dto.response;

import com.back.domain.cart.entity.Cart;
import java.util.List;
import lombok.Builder;

@Builder
public record CartResponseDto(
        Long memberId,
        Long cartId,
        int totalPrice,
        int totalCount,
        List<CartItemResponseDto> cartItems
) {
    public static CartResponseDto from(Cart cart) {
        return CartResponseDto.builder()
                .memberId(cart.getMember().getId())
                .cartId(cart.getId())
                .totalPrice(cart.getTotalPrice())
                .totalCount(cart.getTotalCount())
                .cartItems(cart.getCartItems().stream()
                        .map(CartItemResponseDto::from)
                        .toList())
                .build();
    }
}
