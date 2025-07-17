"use client"

import { useState } from "react"
import { card as ProductCard } from "@/components/product/card"
import { useProducts } from "@/hooks/useProducts"
import { useUser } from "@/contexts/UserContext"

const PAGE_SIZE = 6

export default function Home() {
    const { products, loading, error } = useProducts();
    const [page, setPage] = useState(1);
    const { user } = useUser();

    const total = products ? products.length : 0;
    const totalPages = Math.ceil(total / PAGE_SIZE);
    const startIdx = (page - 1) * PAGE_SIZE;
    const endIdx = startIdx + PAGE_SIZE;
    const pageProducts = products ? products.slice(startIdx, endIdx) : [];

    return (
        <main className="max-w-[1280px] mx-auto bg-white">
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-8">인기 상품</h1>
                {loading && <div>로딩중...</div>}
                {error && <div className="text-red-500">{error}</div>}
                <div className="grid grid-cols-3 gap-6 mb-8">
                    {pageProducts.map(product => (
                        <ProductCard key={product.id} product={product} role={user?.role ?? null} />
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
