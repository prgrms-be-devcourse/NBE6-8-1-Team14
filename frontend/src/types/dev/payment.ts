export interface PaymentItem {
    id: number
    count: number
  }
  
  export interface PaymentData {
    items: PaymentItem[]
    totalPrice: number
    fromCart?: boolean
  }
  
  export interface ProductInfo {
    id: number
    name: string
    price: number
  }
  
  export interface PaymentFormData {
    useDefaultAddress: boolean
    recipient: string
    roadAddress: string
    detailAddress: string
  } 