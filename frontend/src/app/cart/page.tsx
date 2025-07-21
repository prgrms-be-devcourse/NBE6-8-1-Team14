"use client"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { FiMinus, FiPlus } from "react-icons/fi"
import { FiArrowLeft } from "react-icons/fi"
import type { CartData, ApiResponse } from "@/types/dev/cart"
import { useRouter } from "next/navigation"
import ConfirmModal from "@/components/modal/ConfirmModal"
import { get, post, del } from "@/lib/fetcher";

function isApiResponse(data: unknown): data is ApiResponse {
    return (
        typeof data === "object" &&
        data !== null &&
        "success" in data &&
        "code" in data &&
        "message" in data &&
        "content" in data
    );
}

// 샘플: 실제 API 연동 시 교체
async function fetchCartData(): Promise<ApiResponse> {
    const loginState = localStorage.getItem("user-login-state");
    let memberId = 0;
    if (loginState) {
        try {
            const parsed = JSON.parse(loginState);
            memberId = parsed?.memberDto?.id ?? 0;
        } catch {
            // 파싱 실패 시 memberId는 0
        }
    }
    if (!memberId) {
        return {
            success: false,
            code: "NO_MEMBER_ID",
            message: "회원 ID를 찾을 수 없습니다.",
            content: { memberId: 0, cartId: 0, cartItems: [], totalCount: 0, totalPrice: 0 }
        };
    }
    const response = await get(`/api/carts/${memberId}`);
    if (isApiResponse(response.data)) {
        return response.data;
    }
    return {
        success: false,
        code: "NO_DATA",
        message: "장바구니가 비어있습니다.",
        content: { memberId, cartId: 0, cartItems: [], totalCount: 0, totalPrice: 0 }
    };
}

export default function CartPage() {
    const [cartData, setCartData] = useState<CartData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [pendingRemoveId, setPendingRemoveId] = useState<number | null>(null)
    const [showAlertModal, setShowAlertModal] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")
    const router = useRouter()
    const requestedRef = useRef(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (requestedRef.current) return;
        requestedRef.current = true;
        void loadCart();
    }, []);

    useEffect(() => {
        if (error && error === "회원 ID를 찾을 수 없습니다.") {
            setErrorMessage(error);
            setShowErrorModal(true);
        }
    }, [error]);

    const loadCart = async () => {
        try {
            setLoading(true)
            const data = await fetchCartData()
            if (data.success) {
                // selected 속성 추가
                const cartItemsWithSelection = data.content.cartItems.map(item => ({
                    ...item,
                    selected: false
                }))
                setCartData({
                    ...data.content,
                    cartItems: cartItemsWithSelection
                })
            } else {
                setError(data.message)
            }
        } catch {
            setError('장바구니 데이터를 불러오는데 실패했습니다.')
        } finally {
            setLoading(false)
        }
    }

    // 모달에서 확인 시 실제 삭제
    const confirmRemove = async () => {
        if (!cartData || pendingRemoveId === null) return;
        
        try {
            const response = await del(`/api/carts/items/${pendingRemoveId}`);
            
            if (response.data) {
                // 삭제 성공 시 장바구니 새로고침
                loadCart();
            } else {
                setAlertMessage("상품 삭제에 실패했습니다.");
                setShowAlertModal(true);
            }
        } catch {
            setAlertMessage("상품 삭제 중 오류가 발생했습니다.");
            setShowAlertModal(true);
        }
        
        setPendingRemoveId(null);
    }
    const cancelRemove = () => {
        setPendingRemoveId(null)
    }

    // 수량 변경 (프론트에서 totalPrice, 전체금액 즉시 반영)
    const handleQuantityChange = async (cartItemId: number, change: number) => {
        // 수량이 1개이고 감소시키려는 경우 삭제 모달 표시
        if (change === -1) {
            const currentItem = cartData?.cartItems.find(item => item.cartItemId === cartItemId);
            if (currentItem && currentItem.count === 1) {
                setPendingRemoveId(cartItemId);
                return;
            }
        }

        const loginState = localStorage.getItem("user-login-state");
        let memberId = 0;
        if (loginState) {
            try {
                const parsed = JSON.parse(loginState);
                memberId = parsed?.memberDto?.id ?? 0;
            } catch {
                console.error('사용자 정보 파싱 실패');
                return;
            }
        }
        
        if (!memberId) {
            setAlertMessage("로그인이 필요합니다.");
            setShowAlertModal(true);
            return;
        }
        
        const response = await post('/api/carts/items/count', {
            memberId: memberId,
            cartItemId: cartItemId,
            deltaCount: change
        });
        
        if (response.data) {
            // 프론트에서 직접 수량/금액 반영
            setCartData(prev => {
                if (!prev) return prev;
                const updatedItems = prev.cartItems.map(item => {
                    if (item.cartItemId === cartItemId) {
                        const newCount = item.count + change;
                        const unitPrice = item.totalPrice / item.count;
                        return {
                            ...item,
                            count: newCount,
                            totalPrice: unitPrice * newCount
                        };
                    }
                    return item;
                });
                // 전체 합계도 다시 계산
                const newTotalCount = updatedItems.reduce((sum, item) => sum + item.count, 0);
                const newTotalPrice = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
                return {
                    ...prev,
                    cartItems: updatedItems,
                    totalCount: newTotalCount,
                    totalPrice: newTotalPrice
                };
            });
        } else {
            setAlertMessage("수량 변경에 실패했습니다.");
            setShowAlertModal(true);
        }
    }

    // 삭제 버튼 클릭 시 모달
    const handleDeleteItem = (cartItemId: number) => {
        setPendingRemoveId(cartItemId)
    }

    const handleItemSelect = (cartItemId: number) => {
        if (!cartData) return
        setCartData(prev => {
            if (!prev) return prev
            return {
                ...prev,
                cartItems: prev.cartItems.map(item =>
                    item.cartItemId === cartItemId
                        ? { ...item, selected: !item.selected }
                        : item
                )
            }
        })
    }

    const handleSelectAll = () => {
        if (!cartData) return
        const allSelected = cartData.cartItems.every(item => item.selected)
        setCartData(prev => {
            if (!prev) return prev
            return {
                ...prev,
                cartItems: prev.cartItems.map(item => ({
                    ...item,
                    selected: !allSelected
                }))
            }
        })
    }

    // 구매하기 버튼 클릭 핸들러
    const handlePurchase = () => {
        if (totalSelected === 0) {
            setAlertMessage("한 개 이상의 상품을 선택해주세요")
            setShowAlertModal(true)
            return
        }
        if (!cartData) return
        const selectedItems = cartData.cartItems.filter(item => item.selected)
        const paymentData = {
            items: selectedItems.map(item => ({ cartItemId: item.cartItemId, count: item.count, productId: item.productId })),
            totalPrice: selectedTotalPrice,
            fromCart: selectedItems.length === cartData.cartItems.length // 전체 선택 시만 true
        }
        sessionStorage.setItem("paymentData", JSON.stringify(paymentData))
        router.push("/payment")
    }

    // 상품 목록 등 다른 페이지로 이동할 때 paymentData 제거
    const handleGoToOtherPage = (to: string) => {
        sessionStorage.removeItem("paymentData");
        router.push(to);
    };

    if (loading) {
        return (
            <main className="max-w-[1280px] mx-auto bg-white min-h-screen">
                <div className="px-4 py-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-lg text-gray-600">장바구니를 불러오는 중...</div>
                    </div>
                </div>
            </main>
        )
    }

    if (error && error !== "장바구니가 비어있습니다.") {
        return (
            <main className="max-w-[1280px] mx-auto bg-white">
                <div className="px-4 py-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-lg text-red-600">{error}</div>
                    </div>
                    <div className="flex justify-center items-center h-16">
                        <button className="bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors" onClick={() => router.push("/")}>
                            상품 목록으로 돌아가기
                        </button>
                    </div>
                </div>
            </main>
        )
    }

    if (showErrorModal) {
        return (
            <>
                <ConfirmModal
                    message={errorMessage}
                    confirmText="확인"
                    onConfirm={() => {
                        setShowErrorModal(false);
                        router.replace("/members/login");
                    }}
                    onCancel={() => {
                        setShowErrorModal(false);
                        router.replace("/members/login");
                    }}
                />
            </>
        );
    }

    if (!cartData || cartData.cartItems.length === 0) {
        return (
            <main className="max-w-[1280px] mx-auto bg-white">
                <div className="px-4 py-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-lg text-gray-600">장바구니가 비어있습니다.</div>
                    </div>
                    <div className="flex justify-center items-center h-16">
                        <button className="bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors" onClick={() => router.push("/")}>
                            둘러보러가기
                        </button>
                    </div>
                </div>
            </main>
        )
    }

    const selectedCount = cartData.cartItems.filter(item => item.selected).length
    const totalSelected = cartData.cartItems.filter(item => item.selected).length
    const totalItems = cartData.cartItems.length
    // 선택된 상품의 총 수량(단위개수)
    const selectedTotalCount = cartData.cartItems.filter(item => item.selected).reduce((sum, item) => sum + item.count, 0)

    // 선택된 상품들의 금액 합계
    const selectedTotalPrice = cartData.cartItems
        .filter(item => item.selected)
        .reduce((sum, item) => sum + item.totalPrice, 0)

    return (
        <main className="max-w-[1280px] mx-auto bg-white">
            {/* 모달 */}
            {pendingRemoveId !== null && (
                <ConfirmModal
                    message={"해당 상품을 장바구니에서\n제거하시겠습니까?"}
                    confirmText={"제거"}
                    cancelText="취소"
                    onConfirm={confirmRemove}
                    onCancel={cancelRemove}
                />
            )}
            {/* 안내 모달 */}
            {showAlertModal && (
                <ConfirmModal
                    message={alertMessage}
                    confirmText="확인"
                    onConfirm={() => setShowAlertModal(false)}
                    onCancel={() => setShowAlertModal(false)}
                    cancelText=""
                />
            )}
            <div className="px-4 mt-8">
                <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center" onClick={() => handleGoToOtherPage("/")}>
                    <FiArrowLeft className="inline-block mr-1 w-4 h-4" />
                    상품 목록으로 돌아가기
                </button>
            </div>
            <div className="px-4 py-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">장바구니</h1>
                    <span className="text-sm text-gray-500">총 {cartData.totalCount}개</span>
                </div>
                <hr className="mb-8" />

                <div className="flex gap-8">
                    {/* 장바구니 아이템 목록 */}
                    <div className="flex-1">
                        <div className="space-y-4">
                            {cartData.cartItems.map((item) => (
                                <div key={item.cartItemId} className="border border-gray-200 rounded-lg p-4 bg-white">
                                    <div className="flex items-center space-x-4">
                                        <input
                                            type="checkbox"
                                            checked={item.selected}
                                            onChange={() => handleItemSelect(item.cartItemId)}
                                            className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                                        />
                                        <div className="flex-1 flex items-center space-x-4">
                                            <div className="relative w-20 h-20">
                                                <Image
                                                    src={item.productImageUrl}
                                                    alt={item.productName}
                                                    fill
                                                    className="object-cover rounded"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900">{item.productName}</h3>
                                                <p className="text-lg font-semibold text-gray-900">
                                                    {(item.totalPrice / item.count).toLocaleString()}원
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleQuantityChange(item.cartItemId, -1)}
                                                    className="p-1 hover:bg-gray-100 rounded"
                                                >
                                                    <FiMinus className="w-4 h-4" />
                                                </button>
                                                <span className="w-8 text-center">{item.count}</span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.cartItemId, 1)}
                                                    className="p-1 hover:bg-gray-100 rounded"
                                                >
                                                    <FiPlus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteItem(item.cartItemId)}
                                                className="text-gray-500 hover:text-red-500 transition-colors"
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* 전체 선택 체크박스 */}
                        {cartData.cartItems.length > 0 && (
                            <div className="mt-6">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedCount === totalItems && totalItems > 0}
                                        onChange={handleSelectAll}
                                        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                                    />
                                    <span className="text-sm text-gray-600">
                                        ({selectedCount}/{totalItems}) 전체 선택
                                    </span>
                                </label>
                            </div>
                        )}
                    </div>

                    {/* 주문 예상 금액 */}
                    <div className="w-80">
                        <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold">주문 예상 금액</h2>
                                <span className="text-sm text-gray-500">구매상품 ({selectedTotalCount}개)</span>
                            </div>
                            <div className="text-2xl font-bold text-gray-900 mb-6">
                                {selectedTotalPrice.toLocaleString()} 원
                            </div>
                            <button className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                                    onClick={handlePurchase}
                            >
                                구매하기 ({totalSelected})
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}