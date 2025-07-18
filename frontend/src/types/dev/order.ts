export interface Order {
    id: number;
    memberName: string;
    address: string;
    totalPrice: number;
    totalCount: number;
    createdAt: string;
    orderItems: OrderItem[];
}

export interface OrderItem {
    productId: number;
    productName: string;
    count: number;
    totalPrice: number;
    imagePath: string;
}