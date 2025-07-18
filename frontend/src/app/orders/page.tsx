"use client";

import { useOrders } from "@/hooks/useOrders";
import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import type { Order } from "@/types/dev/order";
import { useRouter} from "next/navigation";
import { RecipientData } from "@/components/orders/recipientData";
import { OrderSummary } from "@/components/orders/orderSummary";
import { TbShoppingCartExclamation } from "react-icons/tb";
import Link from "next/link";
import {formatDate} from "@/components/orders/format";

const PAGE_SIZE = 6

export default function OrderHistory() {
    const router = useRouter();
    const [amounts, setAmounts] = useState<{[key: string]: number}>({});
    const { orders, loading, error, cancelOrder, orderCanceled } = useOrders();
    const [page, setPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const { user } = useUser();

    useEffect(() => {
        // user가 없을 때 로그인 페이지로 리다이렉트
        // if (user === null) {
        //     router.replace("/auth/login");
        //     return
        // }

        // 각 주문의 총 개수를 계산하여 저장
        if (orders) {
            const newAmounts: {[key: string]: number} = {};
            orders.forEach(order => {
                newAmounts[order.id] = order.orderItems?.reduce((sum, item) => sum + item.count, 0) || 0;
            });
            setAmounts(newAmounts);
        }

    }, [user, router, orders]);

    // user가 로딩 중이거나 없는 경우 로딩 표시
    if (user === null) {
        return <div className="flex justify-center items-center min-h-screen">로딩중...</div>;
    }

    if ( orders === null || orders?.length === 0) {
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
        } // 상세 정보 닫기
    };

    return (
        <main className="max-w-[1280px] mx-auto bg-white">
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-8">주문 내역</h1>
                {loading && <div className="flex justify-center items-center min-h-screen">로딩중...</div>}
                {error && <div className="text-red-500">{error}</div>}
                <div className="grid gap-6 mb-8">
                    {pageOrders.map((order, index) => (
                        <div key={order.id}>
                            <div
                                className="flex items-center justify-between border border-gray-500 p-5 cursor-pointer hover:bg-gray-50"
                                onClick={() => handleOrderClick(order)}
                            >
                                <div className="flex items-center">
                                    <span className="mr-4 text-lg font-semibold">{startIdx + index + 1}</span>
                                    {user.role === "admin"
                                        ? <span className="px-2">{order.memberName} 님</span> : <></>
                                    }
                                    <span className="px-2">
                                        {order.orderItems && order.orderItems[0]
                                            ? `${order.orderItems[0].productName} 등 ${order.totalCount}종`
                                            : '정보 없음'
                                        }
                                    </span>
                                </div>
                                <div>
                                    <span className="mr-4">총 결제 금액</span>
                                    <span className="text-lg font-semibold">{new Intl.NumberFormat("ko-KR").format(order.totalPrice)} 원</span>
                                </div>
                            </div>

                            {/* 주문 상세 정보 표시 영역 */}
                            {selectedOrder?.id === order.id && (
                                <div className="border-l border-r border-b border-gray-500 px-7 bg-blue-50">
                                    <div className="flex justify-end">
                                        <button
                                            className="text-xs text-gray-500 hover:text-gray-700 underline py-4 cursor-pointer"
                                            onClick={(e) => handleCancelOrder(order.id, e)}
                                        >
                                            주문 취소
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <RecipientData order={order} />
                                        <div className="flex-1 ml-8">
                                            <div className="text-right mb-4 flex justify-end items-center gap-4">
                                                <p className="text-sm text-gray-600">주문일: {formatDate(order.createdAt)}</p>
                                            </div>
                                            <OrderSummary order={order} amounts={amounts} />
                                            </div>
                                    </div>
                                </div>
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