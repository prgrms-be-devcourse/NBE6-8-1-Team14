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

    return (
        <div className="group relative">
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
                <div>
                    <h3 className="text-sm text-gray-700">
                        <Link href={`/products/${product.id}`}>
                            <span aria-hidden="true" className="absolute inset-0" />
                            {product.name}
                        </Link>
                    </h3>
                    <p className="mt-1 text-lg font-medium text-gray-900">{formattedPrice}원</p>
                </div>
                <div className="flex items-end">
                    {role === "admin" ? (
                        <button className="p-2 text-gray-500 hover:text-gray-800" aria-label="상품 설정">
                            <IoSettingsOutline className="h-6 w-6" />
                        </button>
                    ) : (
                        <button className="p-2 text-gray-500 hover:text-gray-800" aria-label="장바구니에 담기">
                            <TiShoppingCart className="h-6 w-6" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
