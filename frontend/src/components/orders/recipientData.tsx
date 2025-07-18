"use client";

import { Order } from "@/types/dev/order";
import { useMemo } from "react";

interface OrderProps {
    order: Order;
}

export function RecipientData({ order }: OrderProps) {
    // useMemo를 사용해서 주소 파싱 결과를 캐싱
    const { baseAddress, extraAddress } = useMemo(() => {
        if (!order.address) {
            return { baseAddress: '', extraAddress: '' };
        }
        
        const parts = order.address.split(', ', 2);
        return {
            baseAddress: parts[0] || '',
            extraAddress: parts[1] || ''
        };
    }, [order.address]);

    return (
        <div className="flex-1">
            <h3 className="text-lg font-semibold mb-4">배송지</h3>
            <div className="space-y-2 mb-6">
                <div>
                    <label className="block text-sm font-medium mb-1">수령인</label>
                    <input
                        type="text"
                        className="w-48 p-2 border border-gray-300 rounded"
                        value={order.memberName || ''}
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
    );
}
