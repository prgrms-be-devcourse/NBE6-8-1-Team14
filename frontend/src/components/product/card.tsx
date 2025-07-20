"use client"

import Image from "next/image"
import Link from "next/link"
import { TiShoppingCart } from "react-icons/ti"
import { IoSettingsOutline } from "react-icons/io5"
import { useRouter } from "next/navigation"
import type { Product } from "@/types/dev/product"
import {useAuthContext} from "@/hooks/useAuth";
import {useState} from "react";
import ConfirmModal from "@/components/modal/ConfirmModal";

interface ProductCardProps {
    product: Product
}

// 상품 카드 컴포넌트
export function Card({ product }: ProductCardProps) {
    const formattedPrice = new Intl.NumberFormat("ko-KR").format(product.price)
    const router = useRouter();
    const {getUserRole} = useAuthContext();
    const userRole = getUserRole();
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const handleCartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        // 로그인 상태 확인
        if (userRole === 'GUEST') {
            setModalMessage("장바구니 기능을 사용하려면 로그인이 필요합니다.");
            setShowModal(true);
            return;
        }
        if (userRole === 'USER') {
            setModalMessage(`${product.name}이(가) 장바구니에 담겼습니다!`);
            setShowModal(true);
            return;
        }
    };

    const handleSettingsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (userRole === 'ADMIN') {
            router.push(`/products/${product.id}/edit`);
            return;
        }
        console.log("상품 설정:", product.name);
    };

    return (
        <>
            <div className="group relative">
                <Link href={`/products/${product.id}`} className="block">
                    <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-200">
                        <Image
                            src={product.imagePath || "/placeholder.svg"}
                            alt={product.name}
                            width={300}
                            height={300}
                            className="h-full w-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                    <div className="mt-4 flex justify-between">
                        <div className="flex-1">
                            <h3 className="text-sm text-gray-700">
                                {product.name}
                            </h3>
                            <p className="mt-1 text-lg font-medium text-gray-900">{formattedPrice}원</p>
                        </div>
                        <div className="flex items-end ml-2" onClick={(e) => e.preventDefault()}>
                            {userRole === 'ADMIN' ? (
                                <button
                                    onClick={handleSettingsClick}
                                    className="p-2 text-gray-500 hover:text-gray-800"
                                    aria-label="상품 설정"
                                >
                                    <IoSettingsOutline className="h-6 w-6" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleCartClick}
                                    className="p-2 text-gray-500 hover:text-gray-800 transition-colors"
                                    aria-label="장바구니에 담기"
                                >
                                    <TiShoppingCart className="h-6 w-6" />
                                </button>
                            )}
                        </div>
                    </div>
                </Link>
            </div>
            
            {/* 알림 모달 */}
            {showModal && (
                <ConfirmModal
                    message={modalMessage}
                    confirmText="확인"
                    onConfirm={() => setShowModal(false)}
                    onCancel={() => setShowModal(false)}
                />
            )}
        </>
    )
}
