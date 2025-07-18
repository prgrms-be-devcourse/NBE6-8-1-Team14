package com.back.domain.order.service;

import com.back.domain.cart.dto.request.CartRequestDto;
import com.back.domain.delivery.enums.DeliveryStatus;
import com.back.domain.delivery.service.DeliveryService;
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
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;


@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final MemberRepository memberRepository;
    private final DeliveryService deliveryService;

    private final JavaMailSender javaMailSender;
    private final SpringTemplateEngine templateEngine;

    @Transactional
    public OrderResponseDto createOrder(OrderRequestDto orderRequestDto) {
        // OrderItem 생성 (체이닝)
        List<OrderItem> orderItems = new ArrayList<>();
        int totalPrice = 0;
        int totalCount = 0;

        Member member = memberRepository.findById(orderRequestDto.memberId())
                .orElseThrow(() -> new MemberException(MemberErrorCode.MEMBER_NOT_FOUND));

        for (OrderItemRequestDto itemRequest : orderRequestDto.orderItems()) {
            Product product = productRepository.findById(itemRequest.productId())
                    .orElseThrow(() -> new ProductException(ProductErrorCode.PRODUCT_NOT_FOUND));
            int itemTotalPrice = product.getPrice() * itemRequest.quantity();
            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .count(itemRequest.quantity())
                    .totalPrice(itemTotalPrice)
                    .build();
            orderItems.add(orderItem);
            product.decreaseStock(itemRequest.quantity());
            totalPrice += itemTotalPrice;
            totalCount += itemRequest.quantity();
        }

        // 주문 내역 생성
        Order order = Order.builder()
                .member(member)
                .address(orderRequestDto.address())
                .orderItems(orderItems)
                .totalPrice(totalPrice)
                .totalCount(totalCount)
                .build();

        // 양방향 연관관계 세팅
        orderItems.forEach(item -> item.updateOrder(order));
        orderRepository.save(order);

        // 배송 내역 발급
        deliveryService.scheduleDelivery(order);

        // Order to OrderResponseDto
        return toOrderResponseDto(order);
    }

    // 엔티티 -> DTO 변환
    private OrderResponseDto toOrderResponseDto(Order order) {
        List<OrderItemResponseDto> itemResponseDtos = order.getOrderItems().stream()
                .map(OrderItemResponseDto::from)
                .collect(Collectors.toList());

        return OrderResponseDto.from(order, itemResponseDtos);
    }

    @Async
    @Transactional
    public void sendOrderConfirmationEmail(OrderRequestDto orderRequestDto, OrderResponseDto orderResponseDto) {
        Member member = memberRepository.findById(orderRequestDto.memberId())
                .orElseThrow(() -> new MemberException(MemberErrorCode.MEMBER_NOT_FOUND));

        setJavaMailSender(member.getNickname(), member.getEmail(), orderResponseDto);
    }

    private void setJavaMailSender(String receiverName, String receiverEmail, OrderResponseDto orderResponseDto) {
        try {
            // 이메일 전송을 위한 MimeMessageHelper 객체 생성
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            // true는 multipart 파일이 있는지 없는지를 나타냄
            MimeMessageHelper msgHelper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
            // 템플릿에 매핑된 값을 설정
            Context context = new Context();
            context.setVariable("order", orderResponseDto);
            // 템플릿을 처리하여 이메일 본문 생성
            String emailBody = templateEngine.process("order-details", context);
            // 메일 제목, 본문, 이메일 주소, 이미지 파일 지정
            msgHelper.setSubject(receiverName + "님의 주문 완료 내역을 확인하세요!");
            msgHelper.setText(emailBody, true);
            msgHelper.setTo(receiverEmail);
            // 이메일 전송
            javaMailSender.send(msgHelper.getMimeMessage());
            log.info("주문 확인 이메일이 성공적으로 전송되었습니다. 수신자: {}님, 이메일: {}", receiverName, receiverEmail);
        } catch (MessagingException e) {
            throw new RuntimeException("에러 발생");
        }
    }

    @Transactional
    public void changeMemberBaseAddress(OrderBaseAddressRequestDto orderBaseAddressRequestDto) {
        Member member = memberRepository.findById(orderBaseAddressRequestDto.memberId())
                .orElseThrow(() -> new MemberException(MemberErrorCode.MEMBER_NOT_FOUND));

        member.changeAddress(orderBaseAddressRequestDto.address());
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

    public List<OrderResponseDto> showMemberOrders(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(MemberErrorCode.MEMBER_NOT_FOUND));

        List<Order> orders = orderRepository.findAllByMember(member)
                .orElseThrow(() -> new OrderException(OrderErrorCode.ORDER_NOT_FOUND));

        return orders.stream()
                .map(this::toOrderResponseDto)
                .collect(Collectors.toList());
    }
}