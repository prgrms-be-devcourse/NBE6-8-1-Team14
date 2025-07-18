package com.back.domain.member.service;


import com.back.domain.member.dto.response.AdminDetailResponseDto;
import com.back.domain.member.dto.response.AdminViewerResponseDto;
import com.back.domain.member.entity.Member;
import com.back.domain.member.enums.Role;
import com.back.domain.member.exception.MemberErrorCode;
import com.back.domain.member.exception.MemberException;
import com.back.domain.member.repository.MemberRepository;
import com.back.domain.order.dto.response.OrderItemResponseDto;
import com.back.domain.order.dto.response.OrderResponseDto;
import com.back.domain.order.dto.response.OrderSimpleResponseDto;
import com.back.domain.order.entity.Order;
import com.back.domain.order.exception.OrderErrorCode;
import com.back.domain.order.exception.OrderException;
import com.back.domain.order.repository.OrderRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final OrderRepository orderRepository;
    private final MemberRepository memberRepository;

    public List<AdminViewerResponseDto> getDashboard(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(MemberErrorCode.MEMBER_NOT_FOUND));

        if (member.getRole() != Role.ADMIN) {
            throw new MemberException(MemberErrorCode.ACCESS_DENIED);
        }

        List<Order> orders = orderRepository.findAllWithDeliveryAndMember();

        List<AdminViewerResponseDto> result = new ArrayList<>();
        for (Order order : orders) {
            OrderSimpleResponseDto orderResponseDto = OrderSimpleResponseDto.from(order);
            Long membId = order.getMember().getId();
            AdminViewerResponseDto dto = AdminViewerResponseDto.from(order, orderResponseDto, membId);
            result.add(dto);
        }
        return result;
    }

    public AdminDetailResponseDto getDetailDashboard(Long memberId, Long orderId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(MemberErrorCode.MEMBER_NOT_FOUND));

        if (member.getRole() != Role.ADMIN) {
            throw new MemberException(MemberErrorCode.ACCESS_DENIED);
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderException(OrderErrorCode.ORDER_NOT_FOUND));

        List<OrderItemResponseDto> orderItemResponseDtos = order.getOrderItems().stream()
                .map(OrderItemResponseDto::from)
                .collect(Collectors.toList());

        return AdminDetailResponseDto.from(order, orderItemResponseDtos);
    }
}
