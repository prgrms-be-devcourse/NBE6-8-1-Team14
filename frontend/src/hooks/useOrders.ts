import { useEffect, useState } from "react";
import { useAuthContext } from "@/hooks/useAuth";
import { get, del } from "@/lib/fetcher";
import { Order } from "@/types/dev/order";
import { fromAdminSimpleOrders, fromMemberSimpleOrders } from "@/components/orders/convertOrderDtos";
import { useRouter } from "next/navigation";

interface BaseOrderReturn {
    orders: Order[] | null;
    loading: boolean;
    error: string | null;
    cancelOrder: (id: number) => void;
    orderCanceled: boolean;
    detailRequestUrl: (orderId: number) => string;
    getMemberIdFromLocalStorage: () => number;
}

function dummyFunction (data? : any) : Order[] {
    return [];
}

export function useOrders(): BaseOrderReturn {
    const router = useRouter();
    const [orderCanceled, setOrderCanceled] = useState(false);
    const { getUserRole, loginMember } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [orders, setOrders] = useState<Order[] | null>(null);
    const [baseUrl, setBaseUrl] = useState<string | null>(null);
    const detailRequestUrl = (orderId: number) => {
        return `${baseUrl}/${orderId}`;
    }
    const getMemberIdFromLocalStorage = () => {
        let memberId = 0;
        const loginState = localStorage.getItem("user-login-state");

        if (loginState) {
            try {
                const parsed = JSON.parse(loginState);
                memberId = parsed?.memberDto.id ?? 0;
            } catch {

            }
        }

        return memberId;
    }

    useEffect(() => {
        async function fetchOrders() {
            // user가 없을 때 로그인 페이지로 리다이렉
            setLoading(true);
            const userRole = getUserRole();

            let requestUrl = '';
            let converter: ((data: any) => Order[]) | null = dummyFunction;

            if (userRole === "GUEST") {
                return;
            }

            const memberId = getMemberIdFromLocalStorage();

            if (userRole === "USER") {
                requestUrl = `/api/orders/member/${memberId}`
                converter = fromMemberSimpleOrders

            } else if (userRole === "ADMIN") {
                requestUrl = `/api/admin/dashboard/${memberId}`
                converter = fromAdminSimpleOrders
            }

            const response = await get(requestUrl);
            if (response.error) {
                setError(response.error)
                setOrders(null);
            } else {
                let orders : Order[] = []

                if (converter) {
                    orders = converter(response.data.content);
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
        del(`/api/orders/${orderId}`).then((res) => {
            if (res.error) {
                return;
            }

            setOrderCanceled(true);

            if (!orders) {
                return;
            }

            setOrders(orders.filter(order => order.id !== orderId));
            router.refresh();
        })
    }

    return {
        loading,
        error,
        orders,
        orderCanceled,
        cancelOrder,
        detailRequestUrl,
        getMemberIdFromLocalStorage
    };
}