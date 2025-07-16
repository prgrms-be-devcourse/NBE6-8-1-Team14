package com.back.domain.order.service;

import com.back.domain.delivery.enums.DeliveryStatus;
import com.back.domain.member.entity.Member;
import com.back.domain.member.exception.MemberErrorCode;
import com.back.domain.member.exception.MemberException;
import com.back.domain.member.repository.MemberRepository;
import com.back.domain.order.dto.request.OrderBaseAddressRequestDto;
import com.back.domain.order.dto.request.OrderItemRequestDto;
import com.back.domain.order.dto.request.OrderRequestDto;
import com.back.domain.order.dto.response.OrderItemResponseDto;
import com.back.domain.order.dto.response.OrderResponseDto;
import com.back.domain.order.entity.Order;
import com.back.domain.order.entity.OrderItem;
import com.back.domain.order.exception.OrderErrorCode;
import com.back.domain.order.exception.OrderException;
import com.back.domain.order.repository.OrderRepository;
import com.back.domain.product.entity.Product;
import com.back.domain.product.exception.ProductErrorCode;
import com.back.domain.product.exception.ProductException;
import com.back.domain.product.repository.ProductRepository;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public OrderResponseDto createOrder(OrderRequestDto orderRequestDto) {
        // OrderItem 생성 (체이닝)
        List<OrderItem> orderItems = new ArrayList<>();
        int totalPrice = 0;
        int totalCount = 0;

        Member member = memberRepository.findById(orderRequestDto.getMemberId())
                .orElseThrow(() -> new MemberException(MemberErrorCode.MEMBER_NOT_FOUND));

        for (OrderItemRequestDto itemRequest : orderRequestDto.getOrderItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ProductException(ProductErrorCode.PRODUCT_NOT_FOUND));
            int itemTotalPrice = product.getPrice() * itemRequest.getQuantity();
            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .count(itemRequest.getQuantity())
                    .totalPrice(itemTotalPrice)
                    .build();
            orderItems.add(orderItem);
            product.decreaseStock(itemRequest.getQuantity());
            totalPrice += itemTotalPrice;
            totalCount += itemRequest.getQuantity();
        }

        // 주문 내역 생성
        Order order = Order.builder()
                .address(orderRequestDto.getAddress())
                .orderItems(orderItems)
                .totalPrice(totalPrice)
                .totalCount(totalCount)
                .build();

        // 양방향 연관관계 세팅
        orderItems.forEach(item -> item.updateOrder(order));
        orderRepository.save(order);
        // Order to OrderResponseDto
        return toOrderResponseDto(order);
    }

    // 엔티티 -> DTO 변환
    private OrderResponseDto toOrderResponseDto(Order order) {
        List<OrderItemResponseDto> itemResponseDtos = order.getOrderItems().stream()
                .map(item -> new OrderItemResponseDto(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getCount(),
                        item.getTotalPrice(),
                        item.getProduct().getImagePath()
                ))
                .collect(Collectors.toList());

        return OrderResponseDto.builder()
                .orderId(order.getId())
                .address(order.getAddress())
                .totalPrice(order.getTotalPrice())
                .totalCount(order.getTotalCount())
                .createdAt(order.getCreatedAt())
                .orderItems(itemResponseDtos)
                .build();
    }

    @Transactional
    public void changeMemberBaseAddress(OrderBaseAddressRequestDto orderBaseAddressRequestDto) {
        Member member = memberRepository.findById(orderBaseAddressRequestDto.getMemberId())
                .orElseThrow(() -> new MemberException(MemberErrorCode.MEMBER_NOT_FOUND));

        member.changeAddress(orderBaseAddressRequestDto.getAddress());
    }

    public OrderResponseDto showOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderException(OrderErrorCode.ORDER_NOT_FOUND));

        return toOrderResponseDto(order);
    }

    public void cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderException(OrderErrorCode.ORDER_NOT_FOUND));

        if (order.getDelivery() != null && !(order.getDelivery().getStatus() == DeliveryStatus.READY)) {
            throw new OrderException(OrderErrorCode.ORDER_ALREADY_DELIVERED);
        }
        // 주문 취소 로직
        order.getOrderItems().forEach(item -> {
            Product product = item.getProduct();
            product.increaseStock(item.getCount());
        });

        orderRepository.delete(order);
    }
}