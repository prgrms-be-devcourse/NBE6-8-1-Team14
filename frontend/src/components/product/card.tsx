"use client"

import Image from "next/image"
import Link from "next/link"
import { TiShoppingCart } from "react-icons/ti"
import { IoSettingsOutline } from "react-icons/io5"
import type { Product } from "@/types/dev/product"
import type { UserRole } from "@/types/dev/auth"

interface ProductCardProps {
    product: Product
    role: UserRole | null
}

export function card({ product, role }: ProductCardProps) {
    const formattedPrice = new Intl.NumberFormat("ko-KR").format(product.price)

    const handleCartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        // 로그인 상태 확인
        if (!role) {
            // 로그인되지 않은 상태
            console.log("로그인이 필요합니다. 로그인 페이지로 이동합니다.");           // TODO: 로그인 페이지로 리다이렉트 또는 모달 표시
            alert("장바구니 기능을 사용하려면 로그인이 필요합니다.");
            return;
        }

        // 일반 사용자로 로그인된 상태
        if (role === "user") {
            console.log("장바구니에 담기:", product.name);
            // TODO: 실제 장바구니 담기 API 호출
            alert(`${product.name}이(가) 장바구니에 담겼습니다!`);
            return;
        }
    };

    const handleSettingsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        // TODO: 상품 설정 로직 구현
        console.log("상품 설정:", product.name);
    };

    return (
        <div className="group relative">
            <Link href={`/products/${product.id}`} className="block">
                <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-200">
                    <Image
                        src={product.imageUrl || "/placeholder.svg"}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
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
                        {role === "admin" ? (
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
                                className="p-2 text-gray-500 hover:text-gray-800"
                                aria-label="장바구니에 담기"
                            >
                                <TiShoppingCart className="h-6 w-6" />
                            </button>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    )
}
