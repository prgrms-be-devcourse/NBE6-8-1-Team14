import { useEffect, useState } from "react";
import { get, del } from "@/lib/fetcher";
import type { Order } from "@/types/dev/order";

interface UseOrdersReturn {
    orders: Order[] | null;
    loading: boolean;
    error: string | null;
    cancelOrder: (id: number) => void;
    orderCanceled: boolean;
}

export function useOrders(): UseOrdersReturn {
    const [orders, setOrders] = useState<Order[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [orderCanceled, setOrderCanceled] = useState(false);

    const cancelOrder = (id: number) => {
        del(`api/orders/${id}`)
            .then((response) => {
                if (response.error) {
                    alert("주문취소에 실패했습니다.")
                    return
                }

                setOrderCanceled(true);
                alert("주문취소가 성공하였습니다")

                if (orders == null) {
                    return;
                }

                setOrders(orders.filter(order => order.id !== id));
            })
    }

    useEffect(() => {
        async function fetchOrders() {
            setLoading(true);
            const response = await get<Order[]>("test/orders/data/order.json");
            if (response.error) {
                setError(response.error);
                setOrders(null);
            } else {
                const data = response.data
                    ? response.data.toSorted((a, b) => {
                        const aDate = a?.createdAt ?? '';
                        const bDate = b?.createdAt ?? '';
                        return bDate.localeCompare(aDate);
                    })
                    : []

                setOrders(data);
                setError(null);
            }
            setLoading(false);
        }
        fetchOrders();
    }, []);

    return { orders, loading, error, cancelOrder, orderCanceled };
}