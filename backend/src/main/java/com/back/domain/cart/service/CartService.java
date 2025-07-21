package com.back.domain.cart.service;


import com.back.domain.cart.dto.request.CartItemCountUpdateRequestDto;
import com.back.domain.cart.dto.request.CartItemRequestDto;
import com.back.domain.cart.dto.request.CartRequestDto;
import com.back.domain.cart.dto.response.CartItemResponseDto;
import com.back.domain.cart.dto.response.CartResponseDto;
import com.back.domain.cart.entity.Cart;
import com.back.domain.cart.entity.CartItem;
import com.back.domain.cart.exception.CartErrorCode;
import com.back.domain.cart.exception.CartException;
import com.back.domain.cart.repository.CartItemRepository;
import com.back.domain.cart.repository.CartRepository;
import com.back.domain.member.entity.Member;
import com.back.domain.member.exception.MemberErrorCode;
import com.back.domain.member.exception.MemberException;
import com.back.domain.member.repository.MemberRepository;
import com.back.domain.order.dto.response.OrderItemResponseDto;
import com.back.domain.order.dto.response.OrderResponseDto;
import com.back.domain.order.entity.Order;
import com.back.domain.order.entity.OrderItem;
import com.back.domain.order.repository.OrderRepository;
import com.back.domain.product.entity.Product;
import com.back.domain.product.exception.ProductErrorCode;
import com.back.domain.product.exception.ProductException;
import com.back.domain.product.repository.ProductRepository;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
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
    private final OrderRepository orderRepository;


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

        if (product.getStock().getQuantity() < cartItemRequestDto.count()) {
            throw new ProductException(ProductErrorCode.PRODUCT_NOT_ENOUGH_STOCK);
        }

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

        return CartResponseDto.from(cart);
    }

    public CartResponseDto showCart(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(MemberErrorCode.MEMBER_NOT_FOUND));

        Cart cart = cartRepository.findByMember(member)
                .orElseThrow(() -> new CartException(CartErrorCode.CART_NOT_FOUND));

        return CartResponseDto.from(cart);
    }

    public void deleteCartItem(Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new CartException(CartErrorCode.CART_ITEM_NOT_FOUND));

        Cart cart = cartItem.getCart();
        cart.getCartItems().remove(cartItem);
        cart.updateTotalCount(cart.getTotalCount() - cartItem.getCount());
        cart.updateTotalPrice(cart.getTotalPrice() - cartItem.getTotalPrice());
        cartItemRepository.delete(cartItem);

        // Cart에 CartItem이 하나도 없을 시 Cart도 지움
        if (!cart.getCartItems().isEmpty()) {
            cartRepository.save(cart);
        } else {
            cartRepository.delete(cart);
            Member member = cart.getMember();
            member.setCart(null);
            memberRepository.save(member);
        }
    }

    // 전체 Cart 삭제
    public void deleteCart(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(MemberErrorCode.MEMBER_NOT_FOUND));

        Cart cart = cartRepository.findByMember(member)
                .orElseThrow(() -> new CartException(CartErrorCode.CART_NOT_FOUND));

        for (CartItem item : cart.getCartItems()) {
            cartItemRepository.delete(item);
        }
        cartRepository.delete(cart);

        Member cartMember = cart.getMember();
        cartMember.setCart(null);
        memberRepository.save(cartMember);
    }

    @Transactional
    public OrderResponseDto createOrderFromCart(CartRequestDto cartRequestDto) {
        Member member = memberRepository.findById(cartRequestDto.memberId())
                .orElseThrow(() -> new MemberException(MemberErrorCode.MEMBER_NOT_FOUND));

        Cart cart = member.getCart();
//        if (cart == null || cart.getCartItems().isEmpty()) {
//            throw new CartException(CartErrorCode.CART_NOT_FOUND);
//        }

        List<OrderItem> orderItems = cartRequestDto.cartItems().stream()
                .map(cartItem -> OrderItem.builder()
                        .product(productRepository.findById(cartItem.productId())
                                .orElseThrow(() -> new ProductException(ProductErrorCode.PRODUCT_NOT_FOUND)))
                        .count(cartItem.count())
                        .totalPrice(cartItem.totalPrice())
                        .build())
                .collect(Collectors.toList());

        Order order = Order.builder()
                .member(member)
                .orderItems(orderItems)
                .address(member.getAddress())
                .totalCount(orderItems.stream().mapToInt(OrderItem::getCount).sum())
                .totalPrice(orderItems.stream().mapToInt(OrderItem::getTotalPrice).sum())
                .build();

        orderItems.forEach(item -> item.setOrder(order));

        orderRepository.save(order);

        cart.getCartItems().clear();
        cart.updateTotalCount(0);
        cart.updateTotalPrice(0);
        cartRepository.save(cart);

        return OrderResponseDto.from(order);
    }

    @Transactional
    public CartResponseDto updateCartItemCount(CartItemCountUpdateRequestDto requestDto) {
        Member member = memberRepository.findById(requestDto.memberId())
                .orElseThrow(() -> new MemberException(MemberErrorCode.MEMBER_NOT_FOUND));

        CartItem cartItem = cartItemRepository.findById(requestDto.cartItemId())
                .orElseThrow(() -> new CartException(CartErrorCode.CART_ITEM_NOT_FOUND));

        if (cartItem.getCart().getMember().getId() != requestDto.memberId()) {
            throw new CartException(CartErrorCode.CARTITEM_OWNER_MISMATCH);
        }

        int newCount = cartItem.getCount() + requestDto.deltaCount();
        if (newCount < 1) {
            // 1 미만이면 삭제
            cartItemRepository.delete(cartItem);
        } else {
            cartItem.updateCount(newCount);
            cartItem.updateTotalPrice(cartItem.getProduct().getPrice() * newCount);
            cartItemRepository.save(cartItem);
        }

        // Cart의 정보도 갱신
        Cart cart = member.getCart();
        int totalCount = 0;
        int totalPrice = 0;
        for (CartItem item : cart.getCartItems()) {
            totalCount += item.getCount();
            totalPrice += item.getTotalPrice();
        }
        cart.updateTotalCount(totalCount);
        cart.updateTotalPrice(totalPrice);
        cartRepository.save(cart);

        return CartResponseDto.from(cart);
    }
}
