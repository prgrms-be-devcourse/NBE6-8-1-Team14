import {
    type AdminDetailResponseDto,
    type OrderResponseDto,
         AdminViewerResponseDto,
         CustomOrderResponseDto,
         Order,
         OrderSimpleResponseDto
} from "@/types/dev/order";

export const fromMemberSimpleOrders = (dtoList: OrderSimpleResponseDto[] | null) : Order[] => {
    if (!dtoList || !Array.isArray(dtoList)) {
        return [];
    }

    return dtoList.map(dto => {
        if (!dto) {
            return null;
        }

        return {
            id: dto.orderId || 0,
            totalPrice: dto.totalPrice || 0,
            totalCount: dto.totalCount || 0,
            orderItemFirstName: dto.orderItemFirstName || '',
            orderItemSize: dto.orderItemSize || 0
        }
    }).filter(order => order !== null) as Order[];
}

export const fromAdminSimpleOrders = (dtoList: AdminViewerResponseDto[] | null) : Order[] => {
    if (!dtoList || !Array.isArray(dtoList)) {
        return [];
    }

    return dtoList.map(dto => {
        const simpleDto = dto.orderSimpleResponseDto;

        if (!simpleDto) {
            return null;
        }

        return {
            id: simpleDto.orderId || 0,
            totalPrice: simpleDto.totalPrice || 0,
            totalCount: simpleDto.totalCount || 0,
            orderItemFirstName: simpleDto.orderItemFirstName || '',
            orderItemSize: simpleDto.orderItemSize || 0,
            memberId: dto.memberId,
            memberName: dto.memberName,
            deliveryStatus: dto.deliveryStatus,
            trackingNumber: dto.trackingNumber
        };
    }).filter(order => order !== null) as Order[];
}

export const fromAdminDetailResponseDto = (data: AdminDetailResponseDto) : CustomOrderResponseDto => {
    const dto = data.orderResponseDto;

    return {
        memberId: data.memberId,
        orderId: dto.orderId,
        memberName: dto.memberName,
        address: dto.address,
        totalPrice: dto.totalPrice,
        totalCount: dto.totalCount,
        createdAt: dto.createdAt,
        deliveryStatus: dto.deliveryStatus,
        trackingNumber: data.trackingNumber,
        orderItems: dto.orderItems
    }
}

export const fromOrderResponseDto = (data: OrderResponseDto, order: Order, memberId: number) : CustomOrderResponseDto => {
    return {
        memberId: memberId,
        orderId: order.id,
        memberName: data.memberName,
        address: data.address,
        totalPrice: data.totalPrice,
        totalCount: data.totalCount,
        createdAt: data.createdAt,
        deliveryStatus: data.deliveryStatus,
        trackingNumber: order.trackingNumber,
        orderItems: data.orderItems
    }
}