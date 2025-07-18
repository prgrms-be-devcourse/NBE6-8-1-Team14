export interface CartItem {
    cartItemId: number
    productId: number
    productName: string
    productImageUrl: string
    count: number
    totalPrice: number
    selected?: boolean
}

export interface CartData {
    memberId: number
    cartId: number
    totalPrice: number
    totalCount: number
    cartItems: CartItem[]
}

export interface ApiResponse {
    success: boolean
    code: string
    message: string
    content: CartData
}