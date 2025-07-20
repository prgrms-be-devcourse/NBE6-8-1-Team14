import { useEffect, useState } from "react";
import type { Product, ProductApiResponse } from "@/types/dev/product";
import { mapProductApiArrayToProducts } from "@/types/dev/product";
import { get } from "@/lib/fetcher";

interface UseProductsReturn {
    products: Product[] | null;
    loading: boolean;
    error: string | null;
}

export function useProducts(): UseProductsReturn {
    const [products, setProducts] = useState<Product[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await get<ProductApiResponse>("/api/products");
                
                if (response.error) {
                    setError(response.error);
                    setProducts(null);
                } else if (response.data?.content) {
                    const mappedProducts = mapProductApiArrayToProducts(response.data.content);
                    setProducts(mappedProducts);
                } else {
                    setProducts(null);
                }
            } catch {
                setError('상품 목록을 불러오는데 실패했습니다.');
                setProducts(null);
            } finally {
                setLoading(false);
            }
        };
        
        fetchProducts();
    }, []);

    return { products, loading, error };
}