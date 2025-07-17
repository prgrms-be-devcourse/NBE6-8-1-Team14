"use client"

import { useState } from "react"
import { Card } from "@/components/product/card"
import { useProducts } from "@/hooks/useProducts"
import { useUser } from "@/contexts/UserContext"

const PAGE_SIZE = 6

export default function Home() {
    const { products, loading, error } = useProducts();
    const [page, setPage] = useState(1);
    const { user } = useUser();

    // 사용자 권한에 따라 상품 필터링
    const filteredProducts = products ? products.filter(product => {
        if (user?.role === "admin") {
            return true;
        }
        return product.stock > 0;
    }) : [];

    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / PAGE_SIZE);
    const startIdx = (page - 1) * PAGE_SIZE;
    const endIdx = startIdx + PAGE_SIZE;
    const pageProducts = filteredProducts.slice(startIdx, endIdx);

    return (
        <main className="max-w-[1280px] mx-auto bg-white">
            <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold">인기 상품</h1>
                    {user?.role === "admin" && (
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            onClick={() => alert('상품 등록 기능은 추후 구현 예정입니다.')}
                        >
                            상품 등록
                        </button>
                    )}
                </div>
                {loading && <div>로딩중...</div>}
                {error && <div className="text-red-500">{error}</div>}
                <div className="grid grid-cols-3 gap-6 mb-8">
                    {pageProducts.map(product => (
                        <Card key={product.id} product={product} role={user?.role ?? null} />
                    ))}
                </div>
                <div className="flex justify-center gap-4">
                    <button
                        className="px-4 py-2 border rounded disabled:opacity-50"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                    >
                        이전
                    </button>
                    <span className="px-2">{page} / {totalPages}</span>
                    <button
                        className="px-4 py-2 border rounded disabled:opacity-50"
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}
                    >
                        다음
                    </button>
                </div>
            </div>
        </main>
    )
}
