// API 응답 타입
export interface ProductApiResponse {
    success: boolean;
    code: string;
    message: string;
    content: ProductApiItem[];
}

// 개별 상품 조회 API 응답 타입
export interface SingleProductApiResponse {
    success: boolean;
    code: string;
    message: string;
    content: ProductApiItem;
}

export interface ProductApiItem {
    id: number;
    name: string;
    price: number;
    description: string;
    createdAt: string;
    editedAt: string;
    imagePath: string;
    stockDto: {
        quantity: number;
        stockStatus: string;
    };
}

// 공통 필드
export interface ProductBase {
    name: string;
    price: number;
    description: string;
    imagePath: string;
}

// 프론트엔드에서 사용하는 Product 타입
export interface Product extends ProductBase {
    id: number;
    createdAt: string;
    editedAt: string;
    stockQuantity: number;
}

// API 응답 배열을 프론트엔드 타입 배열로 변환하는 함수
export function mapProductApiArrayToProducts(apiItems: ProductApiItem[]): Product[] {
    return apiItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        imagePath: item.imagePath,
        description: item.description,
        createdAt: item.createdAt,
        editedAt: item.editedAt,
        stockQuantity: item.stockDto?.quantity || 0
    }));
}

// API 요청용 타입
export interface ProductRequest extends ProductBase {
    stockQuantity: number;
    stockStatus: "IN_STOCK" | "OUT_OF_STOCK";
}
