package com.back.domain.member.service;


import com.back.domain.member.dto.response.AdminViewerResponseDto;
import com.back.domain.member.entity.Member;
import com.back.domain.member.enums.Role;
import com.back.domain.member.exception.MemberErrorCode;
import com.back.domain.member.exception.MemberException;
import com.back.domain.member.repository.MemberRepository;
import com.back.domain.order.dto.response.OrderItemResponseDto;
import com.back.domain.order.dto.response.OrderResponseDto;
import com.back.domain.order.entity.Order;
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
            OrderResponseDto orderResponseDto = OrderResponseDto.from(order);
            Long membId = order.getMember().getId();
            AdminViewerResponseDto dto = AdminViewerResponseDto.from(order, orderResponseDto, membId);
            result.add(dto);
        }
        return result;
    }

}
