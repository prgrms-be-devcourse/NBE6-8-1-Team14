package com.back.domain.delivery.service;

import com.back.domain.delivery.dto.response.DeliveryStatusResponseDto;
import com.back.domain.delivery.entity.Delivery;
import com.back.domain.delivery.enums.DeliveryStatus;
import com.back.domain.delivery.exception.DeliveryErrorCode;
import com.back.domain.delivery.exception.DeliveryException;
import com.back.domain.delivery.repository.DeliveryRepository;
import com.back.domain.member.entity.Member;
import com.back.domain.member.exception.MemberErrorCode;
import com.back.domain.member.exception.MemberException;
import com.back.domain.member.repository.MemberRepository;
import com.back.domain.order.dto.request.OrderRequestDto;
import com.back.domain.order.dto.response.OrderResponseDto;
import com.back.domain.order.entity.Order;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import java.util.UUID;
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
@Transactional
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final MemberRepository memberRepository;

    private final JavaMailSender javaMailSender;
    private final SpringTemplateEngine templateEngine;


    // 주문 생성 시 배송 스케줄링
    public Delivery scheduleDelivery(Order order) {
        String address = order.getAddress();

        // 같은 주소의 배송 대기 중인 배송이 있는지 확인
        Delivery existingDelivery = deliveryRepository
                .findByOrderAddressAndStatus(address, DeliveryStatus.READY)
                .orElse(null);

        if (existingDelivery != null) {
            // 묶음 배송 - 기존 배송에 주문 추가
            existingDelivery.addOrder(order);
            return existingDelivery;
        } else {
            // 새로운 배송 생성
            Delivery newDelivery = Delivery.builder()
                    .status(DeliveryStatus.READY)
                    .trackingNumber(UUID.randomUUID().toString())
                    .shippingDate(null)
                    .build();

            newDelivery.addOrder(order);
            deliveryRepository.save(newDelivery);
            return newDelivery;
        }
    }

    public void startDelivery(Long deliveryId) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new DeliveryException(DeliveryErrorCode.DELIVERY_NOT_FOUND));

        if (delivery.getStatus() == DeliveryStatus.READY) {
            delivery.updateStatus(DeliveryStatus.IN_PROGRESS);
            delivery.updateShippingDate(java.time.LocalDateTime.now());
            deliveryRepository.save(delivery);
        }
    }

    public DeliveryStatusResponseDto getDeliveryStatus(Long deliveryId) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new DeliveryException(DeliveryErrorCode.DELIVERY_NOT_FOUND));

        return DeliveryStatusResponseDto.from(delivery);
    }

    @Async
    @Transactional
    public void sendOrderConfirmationEmail(Delivery delivery) {
        Member member = memberRepository.findById(delivery.getMember().getId())
                .orElseThrow(() -> new MemberException(MemberErrorCode.MEMBER_NOT_FOUND));

        setJavaMailSender(member.getNickname(), member.getEmail(), DeliveryStatusResponseDto.from(delivery));
    }

    private void setJavaMailSender(String receiverName, String receiverEmail, DeliveryStatusResponseDto deliveryStatusResponseDto) {
        try {
            // 이메일 전송을 위한 MimeMessageHelper 객체 생성
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            // true는 multipart 파일이 있는지 없는지를 나타냄
            MimeMessageHelper msgHelper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
            // 템플릿에 매핑된 값을 설정
            Context context = new Context();
            context.setVariable("delivery", deliveryStatusResponseDto);
            // 템플릿을 처리하여 이메일 본문 생성
            String emailBody = templateEngine.process("delivery-status", context);
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
}
