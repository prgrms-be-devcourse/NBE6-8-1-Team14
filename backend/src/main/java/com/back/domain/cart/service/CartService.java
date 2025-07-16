package com.back.domain.cart.service;


import com.back.domain.cart.dto.request.CartItemRequestDto;
import com.back.domain.cart.dto.response.CartItemResponseDto;
import com.back.domain.cart.dto.response.CartResponseDto;
import com.back.domain.cart.entity.Cart;
import com.back.domain.cart.entity.CartItem;
import com.back.domain.cart.repository.CartItemRepository;
import com.back.domain.cart.repository.CartRepository;
import com.back.domain.member.entity.Member;
import com.back.domain.member.exception.MemberErrorCode;
import com.back.domain.member.exception.MemberException;
import com.back.domain.member.repository.MemberRepository;
import com.back.domain.product.entity.Product;
import com.back.domain.product.exception.ProductErrorCode;
import com.back.domain.product.exception.ProductException;
import com.back.domain.product.repository.ProductRepository;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class CartService {

    private final MemberRepository memberRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;


    @Transactional
    public CartResponseDto addToCart(CartItemRequestDto cartItemRequestDto) {
        Member member = memberRepository.findById(cartItemRequestDto.memberId())
                .orElseThrow(() -> new MemberException(MemberErrorCode.MEMBER_NOT_FOUND));

        Cart cart = member.getCart();
        if (cart == null) {
            cart = Cart.builder()
                    .totalPrice(0)
                    .totalCount(0)
                    .cartItems(new ArrayList<>())
                    .member(member)
                    .build();
            // 멤버에 cart 연결
            member.setCart(cart);
        }

        Product product = productRepository.findById(cartItemRequestDto.productId())
                .orElseThrow(() -> new ProductException(ProductErrorCode.PRODUCT_NOT_FOUND));

        // 동일 상품 존재 여부 확인
        CartItem existingItem = null;
        for (CartItem item : cart.getCartItems()) {
            if (item.getProduct().getId().equals(cartItemRequestDto.productId())) {
                existingItem = item;
                break;
            }
        }

        if (existingItem != null) { // 이미 존재
            existingItem.updateCount(existingItem.getCount() + cartItemRequestDto.count());
            existingItem.updateTotalPrice(existingItem.getTotalPrice() + cartItemRequestDto.count() * product.getPrice());
        } else {
            // 없으면 새로 생성
            CartItem newItem = CartItem.builder()
                    .product(product)
                    .count(cartItemRequestDto.count())
                    .totalPrice(product.getPrice() * cartItemRequestDto.count())
                    .cart(cart)
                    .build();
            cart.getCartItems().add(newItem);
            cartItemRepository.save(newItem);
        }

        // Cart의 총 금액/수량 갱신
        int totalCount = 0;
        int totalPrice = 0;
        for (CartItem item : cart.getCartItems()) {
            totalCount += item.getCount();
            totalPrice += item.getTotalPrice();
        }
        cart.updateTotalCount(totalCount);
        cart.updateTotalPrice(totalPrice);

        cartRepository.save(cart);

        return CartResponseDto.builder()
                .memberId(member.getId())
                .cartId(cart.getId())
                .totalPrice(cart.getTotalPrice())
                .totalCount(cart.getTotalCount())
                .cartItems(cart.getCartItems().stream()
                        .map(item -> CartItemResponseDto.builder()
                                .cartItemId(item.getId())
                                .productId(item.getProduct().getId())
                                .productName(item.getProduct().getName())
                                .productImageUrl(item.getProduct().getImagePath())
                                .count(item.getCount())
                                .totalPrice(item.getTotalPrice())
                                .build())
                        .toList())
                .build();
    }
}
