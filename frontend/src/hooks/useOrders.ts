import { useEffect, useRef, useState } from "react";
import client from "@/lib/backend/client";
import {useAuthContext} from "@/hooks/useAuth";
import { Order } from "@/types/dev/order";
import { useRouter } from "next/navigation";
import { ApiResponse } from "@/types/dev/auth";
import {fromAdminSimpleOrders, fromMemberSimpleOrders} from "@/components/orders/convertOrderDtos";

interface BaseOrderReturn {
    orders: Order[] | null;
    cancelOrder: (id: number) => void;
    orderCanceled: boolean;
    detailRequestUrl: (orderId: number) => string;
}

export function useOrders(): BaseOrderReturn {
    const [orderCanceled, setOrderCanceled] = useState(false);
    const { isLogin, getUserRole, loginMember } = useAuthContext();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[] | null>(null);
    const [baseUrl, setBaseUrl] = useState<string | null>(null);
    const requestedRef = useRef(false);
    const detailRequestUrl = (orderId: number) => {
        return `${baseUrl}/${orderId}`;
    }

    useEffect(() => {
        if (requestedRef.current) return;
        requestedRef.current = true;

        // user가 없을 때 로그인 페이지로 리다이렉트
        let requestUrl = null;
        let converter = null;

        const memberId = loginMember?.memberDto.id;

        if (getUserRole() === "USER") {
            requestUrl = `/api/orders/member/${memberId}`
            converter = fromMemberSimpleOrders

        } else if (getUserRole() === "ADMIN") {
            requestUrl = `/api/admin/dashboard/${memberId}`
            converter = fromAdminSimpleOrders
        }

        if (!(requestUrl && converter)) {
            return;
        }

        client.GET(requestUrl)
            .then((res: ApiResponse<any>) => {
                if (res.error) {
                    return
                } 
                
                const content = res.data?.content;
                if (content && converter) {
                    const orders : Order[] = converter(content);
                    setOrders(orders);
                    setBaseUrl(requestUrl);
                }
            }
        )
    }, [getUserRole, isLogin, loginMember?.memberDto.id, router]);

    const cancelOrder = (orderId: number) => {
        client.DELETE("/api/orders/{orderId}", {
            params: {
                path: {
                    orderId
                }
            }
        }).then((res) => {
            if (res.error) {
                alert("주문취소에 실패했습니다.")
                return
            }

            setOrderCanceled(true);
            alert("주문취소가 성공하였습니다")

            if (!orders) {
                return;
            }

            setOrders(orders.filter(order => order.id !== orderId));
        })
    }

    return { orders, orderCanceled, cancelOrder, detailRequestUrl };
}