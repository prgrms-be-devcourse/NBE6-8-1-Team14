"use client";

import { useOrders } from "@/hooks/useOrders";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/hooks/useAuth";
import { Order } from "@/types/dev/order";
import { RecipientData } from "@/components/orders/recipientData";
import { TbShoppingCartExclamation } from "react-icons/tb";
import Link from "next/link";
import { formatPrice } from "@/utils/format";
import { LoadingLayout } from "@/components/common/redirect";
import { useRouter } from "next/navigation";

const PAGE_SIZE = 6

export default function OrderHistory() {
    const { orders, cancelOrder, orderCanceled, detailRequestUrl } = useOrders();
    const [page, setPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const { getUserRole, isLogin } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (!isLogin) {
            router.replace("/members/login");
            return
        }
    })

    if (getUserRole() === 'GUEST') {
        return <LoadingLayout />
    }

    if (!orders) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen gap-4">
                <TbShoppingCartExclamation className="w-16 h-16 text-gray-600" />
                <span className="text-lg text-gray-700">구매 내역이 없어요.</span>
                <Link href="/">
                    <button className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                        구매하러 가기
                    </button>
                </Link>
            </div>
        );
    }

    const total = orders ? orders.length : 0;
    const totalPages = Math.ceil(total / PAGE_SIZE);
    const startIdx = (page - 1) * PAGE_SIZE;
    const endIdx = startIdx + PAGE_SIZE;
    const pageOrders = orders ? orders.slice(startIdx, endIdx) : [];

    const handleOrderClick = (order: Order) => {
        // 같은 주문을 클릭하면 닫기, 다른 주문을 클릭하면 해당 주문 표시
        setSelectedOrder(selectedOrder?.id === order.id ? null : order);
    };

    // 주문 취소 핸들러
    const handleCancelOrder = (orderId: number, e: React.MouseEvent) => {
        e.stopPropagation(); // 주문 상세 토글 방지

        if (!confirm('정말로 이 주문을 취소하시겠습니까?')) {
            return;
        }

        cancelOrder(orderId);
        if (orderCanceled) {
            setSelectedOrder(null);
        }
    };

    return (
        <main className="max-w-[1280px] mx-auto bg-white">
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-8">주문 내역</h1>
                <div className="grid gap-6 mb-8">
                    {pageOrders.map((order, index) => (
                        <div key={order.id}>
                            <div
                                className="flex items-center justify-between border border-gray-500 p-5 cursor-pointer hover:bg-gray-50"
                                onClick={() => handleOrderClick(order)}
                            >
                                <div className="flex items-center">
                                    <span className="mr-4 text-lg font-semibold">{startIdx + index + 1}</span>
                                    {getUserRole() === "ADMIN" ? <span className="px-2">{order?.memberName} 님</span> : <></>}
                                    <span className="px-2">
                                            {order.orderItemSize >= 2
                                                ? `${order.orderItemFirstName} 등 ${order.orderItemSize}종`
                                                : order.orderItemSize == 1
                                                    ? `${order.orderItemFirstName} ${order.totalCount}개`
                                                    : "정보 없음"
                                            }
                                        </span>
                                </div>
                                <div>
                                    <span className="mr-4">총 결제 금액</span>
                                    <span className="text-lg font-semibold">{formatPrice(order.totalPrice)} 원</span>
                                </div>
                            </div>
                            {selectedOrder?.id === order.id && (
                                <RecipientData order={order} handleCancelOrder={handleCancelOrder} detailRequestUrl={detailRequestUrl} />
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex justify-center gap-4">
                    <button
                        className="px-4 py-2 border rounded disabled:opacity-50"
                        onClick={() => {
                            setPage(page - 1);
                            setSelectedOrder(null);
                        }}
                        disabled={page === 1}
                    >
                        이전
                    </button>
                    <span className="px-2 py-2">{page} / {totalPages}</span>
                    <button
                        className="px-4 py-2 border rounded disabled:opacity-50"
                        onClick={() => {
                            setPage(page + 1);
                            setSelectedOrder(null);
                        }}
                        disabled={page === totalPages}
                    >
                        다음
                    </button>
                </div>
            </div>
        </main>
    )
}