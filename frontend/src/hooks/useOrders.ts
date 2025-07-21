import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "@/hooks/useAuth";
import { get, del } from "@/lib/fetcher";
import { Order } from "@/types/dev/order";
import {fromAdminSimpleOrders, fromMemberSimpleOrders} from "@/components/orders/convertOrderDtos";

interface BaseOrderReturn {
    orders: Order[] | null;
    loading: boolean;
    error: string | null;
    cancelOrder: (id: number) => void;
    orderCanceled: boolean;
    detailRequestUrl: (orderId: number) => string;
}

function dummyFunction (data? : any) : Order[] {
    return [];
}

export function useOrders(): BaseOrderReturn {
    const [orderCanceled, setOrderCanceled] = useState(false);
    const { getUserRole, loginMember } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [orders, setOrders] = useState<Order[] | null>(null);
    const [baseUrl, setBaseUrl] = useState<string | null>(null);
    const requestedRef = useRef(false);
    const detailRequestUrl = (orderId: number) => {
        return `${baseUrl}/${orderId}`;
    }

    useEffect(() => {
        if (requestedRef.current) return;
        requestedRef.current = true;

        async function fetchOrders() {
            // user가 없을 때 로그인 페이지로 리다이렉
            setLoading(true);
            const userRole = getUserRole();

            let requestUrl = '';
            let converter: ((data: any) => Order[]) | null;

            const memberId = loginMember?.memberDto?.id;

            if (userRole === "USER") {
                requestUrl = `/api/orders/member/${memberId}`
                converter = fromMemberSimpleOrders

            } else if (userRole === "ADMIN") {
                requestUrl = `/api/admin/dashboard/${memberId}`
                converter = fromAdminSimpleOrders
            } else {
                requestUrl = '/members/login'
                converter = dummyFunction
            }

            const response = await get(requestUrl);
            if (response.error) {
                setError(response.error)
                setOrders(null);
            } else {
                let orders : Order[] = []

                if (converter) {
                    orders = converter(response.data);
                    orders = orders.toSorted((a, b) => b.id - a.id);
                }

                setOrders(orders);
                setBaseUrl(requestUrl);
                setError(null);
            }
            setLoading(false);
        }
        fetchOrders();
    }, [getUserRole, loginMember?.memberDto.id]);

    const cancelOrder = (orderId: number) => {
        del(`/api/orders/{orderId}`).then((res) => {
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

    return {
        loading,
        error,
        orders,
        orderCanceled,
        cancelOrder,
        detailRequestUrl
    };
}