// 구매 상세보기에 필요함

export interface OrderResponseDto {
    orderId: number;
    memberName: string;
    address: string;
    /** Format: int32 */
    totalPrice: number;
    /** Format: int32 */
    totalCount: number;
    /** Format: date-time */
    createdAt: string;
    deliveryStatus: string;
    orderItems?: OrderItemResponseDto[];
}

// 구매한 물품의 상세 정보를 담은 객체
export interface OrderItemResponseDto {
    /** Format: int64 */
    productId?: number;
    productName?: string;
    /** Format: int32 */
    count?: number;
    /** Format: int32 */
    totalPrice?: number;
    imagePath?: string;
}

// 사용자 구매 내역 조회 시 헤드 부분에 쓰일 객체
export interface OrderSimpleResponseDto {
    /** Format: int64 */
    orderId?: number;
    /** Format: int32 */
    totalPrice?: number;
    /** Format: int32 */
    totalCount?: number;
    orderItemFirstName?: string;
    /** Format: int32 */
    orderItemSize?: number;
}

// 관리자가 멤버 구매 내역 조회 시 사용될 객체
export interface AdminViewerResponseDto {
    /** Format: int64 */
    memberId? : number;
    memberName? : string;
    deliveryStatus? : string;
    trackingNumber? : string;
    OrderSimpleResponseDto : OrderSimpleResponseDto
}

// 관리자가 상세정보를 보고자 할 때 쓸 객체
export interface AdminDetailResponseDto {
    memberId: number;
    deliveryStatus: string;
    trackingNumber: string;
    OrderResponseDto: OrderResponseDto
}

// 헤드로 쓰일 AdminViewerResponseDto, OrderSimpleResponseDto을
// 통합하고 사용하기 위해 별도로 정의한 DTO
export interface Order {
    id: number;
    totalPrice: number;
    totalCount: number;
    orderItemFirstName: string;
    orderItemSize: number;
    memberId?: number;
    memberName?: string;
    deliveryStatus?: string;
    trackingNumber?: string;
}

export interface CustomOrderResponseDto {
    memberId: number;
    orderId: number;
    memberName: string;
    address: string;
    totalPrice: number;
    totalCount: number;
    createdAt: string
    deliveryStatus: string;
    trackingNumber?: string;
    orderItems?: OrderSimpleResponseDto[]
}

