export interface PaymentItem {
  productId: number;
  cartItemId?: number;
  count: number;
}

export interface PaymentData {
  items: PaymentItem[];
  totalPrice: number;
  fromCart: boolean;
}
  
  export interface PaymentFormData {
    useDefaultAddress: boolean;
    recipient: string;
    roadAddress: string;
    detailAddress: string;
    postalCode: string;
  } 