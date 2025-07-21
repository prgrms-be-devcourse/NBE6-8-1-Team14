import type { CustomOrderResponseDto, Order } from "@/types/dev/order";
import { useEffect, useMemo, useState } from "react";
import { formatDate } from "@/utils/format";
import { getDeliveryStatusText, getDeliveryStatusColor } from "@/components/orders/deliveryStatus";
import { OrderSummary } from "@/components/orders/orderSummary";
import { useAuthContext } from "@/hooks/useAuth";
import { get } from "@/lib/fetcher";
import {fromAdminDetailResponseDto, fromOrderResponseDto} from "@/components/orders/convertOrderDtos";

interface OrderProps {
    order: Order;
    detailRequestUrl: (orderId: number) => string;
    handleCancelOrder: (id: number, e: React.MouseEvent) => void;
}

export function RecipientData({ order, detailRequestUrl, handleCancelOrder }: OrderProps) {
    const { loginMember, getUserRole } = useAuthContext();
    const [orderDetail, setOrderDetail] = useState<CustomOrderResponseDto | null>(null);
    const [viewCancelOrder, setViewCancelOrder] = useState(false);
    const memberId = loginMember?.memberDto?.id ?? 0;
    
    useEffect(() => {
        const orderDetailUrl = detailRequestUrl(order.id);
         
        get(orderDetailUrl).then((res) => {
            if (res.error) {
                return;
            }

            const data = res.data.content
            let result = null;

            if (getUserRole() === "ADMIN") {
                result = fromAdminDetailResponseDto(data);
            } else if (getUserRole() === "USER") {
                result = fromOrderResponseDto(data, order, memberId);
            }

            if (!result) {
                return;
            }

            setOrderDetail(result);
        });
    }, [detailRequestUrl, getUserRole, memberId, order])

    const { baseAddress, extraAddress } = useMemo(() => {
        const address = orderDetail?.address;

        if (!address) {
            return { baseAddress: '', extraAddress: '' };
        }

        const parts = address.split(', ', 2);

        if (parts.length === 1) {
            return { baseAddress: parts[0], extraAddress: '' };
        }

        return {
            baseAddress: parts[0] || '',
            extraAddress: parts[1] || ''
        };
    }, [orderDetail?.address]);

    return (
        <div className="border-l border-r border-b border-gray-500 px-7 bg-blue-50">
            <div className="flex justify-end">
                <span className={`font-medium ${getDeliveryStatusColor(orderDetail?.deliveryStatus)} py-4`}>
                    {getDeliveryStatusText(orderDetail?.deliveryStatus)}
                </span>
                { viewCancelOrder && (
                    <button
                        className="text-xs text-gray-500 hover:text-gray-700 underline py-4 cursor-pointer"
                        onClick={(e) => {
                            handleCancelOrder(order.id, e);
                            setViewCancelOrder(true);
                        }}
                    >
                        주문 취소
                    </button>
                )}
            </div>
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-4">배송지</h3>
                    <div className="space-y-2 mb-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">수령인</label>
                            <input
                                type="text"
                                className="w-48 p-2 border border-gray-300 rounded"
                                value={orderDetail ? (orderDetail.memberName || '') : ''}
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">도로명 주소</label>
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded"
                                value={baseAddress}
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">상세 주소</label>
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded"
                                value={extraAddress}
                                readOnly
                            />
                        </div>
                    </div>
                </div>
                <div className="flex-1 ml-8">
                    <div className="text-right mb-4 flex justify-end items-center gap-4">
                        <p className="text-sm text-gray-600">주문일: {orderDetail ? formatDate(orderDetail.createdAt) : "정보 없음"}</p>
                    </div>
                    <OrderSummary orderDetail={orderDetail} order={order} />
                </div>
            </div>
        </div>
    );
}