import { useEffect, useState } from "react";
import { get } from "@/lib/fetcher";
import type { Product } from "@/types/dev/product";

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
        async function fetchProducts() {
            setLoading(true);
            const response = await get<Product[]>("/product/data/product.json");
            if (response.error) {
                setError(response.error);
                setProducts(null);
            } else {
                setProducts(response.data);
                setError(null);
            }
            setLoading(false);
        }
        fetchProducts();
    }, []);

    return { products, loading, error };
}