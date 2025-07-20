"use client"
import { useEffect, useState, useRef } from "react"
import ConfirmModal from "@/components/modal/ConfirmModal"
import { PaymentData, PaymentFormData } from "@/types/dev/payment"
import { get } from "@/lib/fetcher"
import { IoArrowBackOutline } from "react-icons/io5"
import { post } from "@/lib/fetcher"

export default function PaymentPage() {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [productInfoMap, setProductInfoMap] = useState<Record<number, { name: string; price: number; stockQuantity: number; imageUrl: string }>>({})
  const [showLeaveModal, setShowLeaveModal] = useState(false)
  const [leaveTo, setLeaveTo] = useState<string>("")
  const [showStockModal, setShowStockModal] = useState(false)
  const [stockMessage, setStockMessage] = useState("")
  const [adjustedItems, setAdjustedItems] = useState<{ id: number; count: number }[]>([])
  const [soldOutItems, setSoldOutItems] = useState<number[]>([])
  const [formData, setFormData] = useState<PaymentFormData>({
    useDefaultAddress: false,
    recipient: "",
    roadAddress: "",
    detailAddress: "",
    postalCode: ""
  })
  const [showNoAddressModal, setShowNoAddressModal] = useState(false)
  const didFetch = useRef(false);
  useEffect(() => {
    if (didFetch.current) return;
    
    // 세션스토리지에서 결제 데이터 가져오기
    const data = sessionStorage.getItem("paymentData");
    if (data) {
      const parsed = JSON.parse(data);
      setPaymentData(parsed);
      // 상품별 name, price 개별 요청 등 이하 기존 로직 유지
      if (parsed.items && Array.isArray(parsed.items)) {
        const fetchProductInfos = async () => {
          const infoMap: Record<number, { name: string; price: number; stockQuantity: number; imageUrl: string }> = {};
          await Promise.all(parsed.items.map(async (item: { id: number }) => {
            const res = await get<{ content: { name: string; price: number; stockQuantity: number; imageUrl: string } }>(`/api/products/${item.id}`);
            if (res.data && res.data.content) {
              infoMap[item.id] = {
                name: res.data.content.name,
                price: res.data.content.price,
                stockQuantity: res.data.content.stockQuantity,
                imageUrl: res.data.content.imageUrl
              };
            }
          }));
          setProductInfoMap(infoMap);
          // 이하 재고 체크 등 기존 로직 유지
          const insufficientItems: { id: number; name: string; originalCount: number; stockQuantity: number }[] = [];
          const adjusted: { id: number; count: number }[] = [];
          const soldOut: { id: number; name: string }[] = [];
          parsed.items.forEach((item: { id: number; count: number }) => {
            const info = infoMap[item.id];
            if (info) {
              if (info.stockQuantity <= 0) {
                soldOut.push({ id: item.id, name: info.name });
              } else if (item.count > info.stockQuantity) {
                insufficientItems.push({
                  id: item.id,
                  name: info.name,
                  originalCount: item.count,
                  stockQuantity: info.stockQuantity
                });
                adjusted.push({ id: item.id, count: info.stockQuantity });
              } else {
                adjusted.push({ id: item.id, count: item.count });
              }
            }
          });
          if (soldOut.length > 0) {
            const message = soldOut.map(item => `${item.name}: 재고 소진`).join('\n');
            setStockMessage(`다음 상품의 재고가 모두 소진되어 구매할 수 없습니다.\n\n${message}`);
            setSoldOutItems(soldOut.map(item => item.id));
            setShowStockModal(true);
            return;
          }
          if (insufficientItems.length > 0) {
            const message = insufficientItems.map(item =>
              `${item.name}: ${item.originalCount}개 → ${item.stockQuantity}개`
            ).join('\n');
            setStockMessage(`다음 상품의 재고가 부족해 개수를 조정합니다:\n\n${message}`);
            setAdjustedItems(adjusted);
            setShowStockModal(true);
          }
        };
        fetchProductInfos();
      }
    }
    
    // 세션스토리지 데이터를 읽어온 후에 플래그 설정
    didFetch.current = true;
    
    // ... script 삽입 등 기타 기존 로직이 있다면 여기에 추가
  }, []);


  const useDefaultAddress = async () => {
    const response = await get<{ content: { address?: string } }>(`/api/auth/memberInfo`)
    if (response.data && response.data.content && response.data.content.address) {
      const address = response.data.content.address
      const addressParts = address.split(", ")
      if (addressParts.length >= 4) {
        setFormData(prev => ({
          ...prev,
          postalCode: addressParts[0],
          recipient: addressParts[1],
          roadAddress: addressParts[2],
          detailAddress: addressParts[3]
        }))
      }
    } else {
      setShowNoAddressModal(true)
    }
  }

  const handleNoAddressConfirm = () => {
    setShowNoAddressModal(false)
    setFormData(prev => ({
      ...prev,
      useDefaultAddress: false
    }))
  }

  // 돌아가기 버튼 클릭 시
  const handleBack = (to: string) => {
    setLeaveTo(to)
    setShowLeaveModal(true)
  }

  // 모달 확인 시 세션스토리지 비우고 이동
  const confirmLeave = () => {
    sessionStorage.removeItem("paymentData")
    window.location.href = leaveTo
  }

  // 재고 부족/소진 모달 확인 시
  const handleStockConfirm = () => {
    setShowStockModal(false)
    if (paymentData) {
      let updatedItems = paymentData.items
      if (soldOutItems.length > 0) {
        updatedItems = updatedItems.filter(item => !soldOutItems.includes(item.id))
        setSoldOutItems([])
      } else if (adjustedItems.length > 0) {
        updatedItems = adjustedItems
        setAdjustedItems([])
      }
      const updatedPaymentData = {
        ...paymentData,
        items: updatedItems
      }
      setPaymentData(updatedPaymentData)
      sessionStorage.setItem("paymentData", JSON.stringify(updatedPaymentData))
    }
  }

  // 폼 데이터 변경 핸들러
  const handleFormChange = (field: keyof PaymentFormData, value: string | boolean) => {
    if (field === "useDefaultAddress") {
      // 먼저 체크박스 상태 업데이트
      setFormData(prev => ({
        ...prev,
        useDefaultAddress: value as boolean
      }))

      // 그 다음에 주소 로직 처리
      if (value === true) {
        // 체크박스가 체크되면 기본 주소 가져오기
        useDefaultAddress()
      } else {
        // 체크박스가 해제되면 주소 필드들 비우기
        setFormData(prev => ({
          ...prev,
          postalCode: "",
          recipient: "",
          roadAddress: "",
          detailAddress: ""
        }))
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handlePayment = async () => {
    const fromCart = paymentData?.fromCart
    
    // 주소 데이터 수집
    const postalCode = document.querySelector('input[placeholder="우편번호"]') as HTMLInputElement
    const recipient = document.querySelector('input[placeholder="수령인"]') as HTMLInputElement
    const roadAddress = document.querySelector('input[placeholder="도로명 주소"]') as HTMLInputElement
    const detailAddress = document.querySelector('input[placeholder="상세 주소"]') as HTMLInputElement
    
    const address = [
      postalCode?.value,
      recipient?.value,
      roadAddress?.value,
      detailAddress?.value
    ].filter(Boolean).join(", ")
    
    // 구매 상품 목록을 orderItems 형태로 변환
    const orderItems = paymentData?.items.map(item => ({
      productId: item.id,
      quantity: item.count
    })) || []
    
    // memberId 가져오기
    const loginState = localStorage.getItem("user-login-state")
    let memberId = 0
    if (loginState) {
      try {
        const parsed = JSON.parse(loginState)
        memberId = parsed?.memberDto?.id ?? 0
      } catch {
        // 파싱 실패 시 memberId는 0
      }
    }
    
    const url = fromCart ? "/api/carts/orders/form-cart" : "/api/orders/direct"
    let data: unknown
    if (fromCart) {
      // 장바구니 주문
      data = {
        memberId,
        totalPrice: paymentData?.totalPrice ?? 0,
        totalCount: paymentData?.items.reduce((sum, item) => sum + item.count, 0) ?? 0,
        cartItems: paymentData?.items.map(item => {
          const info = productInfoMap[item.id]
          return {
            cartItemId: 'cartItemId' in item ? item.cartItemId : item.id,
            productId: item.id,
            productName: info?.name ?? "",
            productImageUrl: info?.imageUrl ?? "",
            count: item.count,
            totalPrice: info ? info.price * item.count : 0
          }
        }) || []
      }
    } else {
      // 바로 주문
      data = {
        memberId,
        address,
        orderItems
      }
    }

    console.log("결제 데이터:", data)
    
    // fromCart가 false인 경우 요청 보내기
    if (!fromCart) {
      try {
        const response = await post<{ success: boolean; message: string }>(url, data)
        if (response.data && response.status >= 200 && response.status < 300) {
          console.log("결제 성공:", response.data)
          // 성공 시 처리 (예: 주문 완료 페이지로 이동)
        } else {
          console.error("결제 실패:", response.error)
          // 실패 시 처리 (예: 에러 메시지 표시)
        }
      } catch (error) {
        console.error("결제 요청 중 오류:", error)
        // 에러 처리
      }
    }
  }

  return (
    <main className="max-w-[1280px] mx-auto bg-white">
      {/* 결제 중단 모달 */}
      {showLeaveModal && (
        <ConfirmModal
          message={"결제를 중단하시겠습니까?\n결제 정보는 저장되지않습니다."}
          confirmText="확인"
          cancelText="취소"
          onConfirm={confirmLeave}
          onCancel={() => setShowLeaveModal(false)}
        />
      )}
      {/* 재고 부족 모달 */}
      {showStockModal && (
        <ConfirmModal
          message={stockMessage}
          confirmText="확인"
          onConfirm={handleStockConfirm}
          onCancel={handleStockConfirm}
        />
      )}
      {showNoAddressModal && (
        <ConfirmModal
          message="기본 주소지가 없습니다."
          confirmText="확인"
          onConfirm={handleNoAddressConfirm}
          onCancel={handleNoAddressConfirm}
        />
      )}
      <div className="px-4 mt-8">
        {paymentData?.fromCart ? (
          <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center" onClick={() => handleBack("/cart")}>
            <IoArrowBackOutline className="w-5 h-5 mr-2" />
            장바구니로 돌아가기
          </button>
        ) : (
          <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center" onClick={() => handleBack("/")}>
            <IoArrowBackOutline className="w-5 h-5 mr-2" />
            상품 목록으로 돌아가기
          </button>
        )}
      </div>
      <h1 className="text-3xl font-bold mt-4 mb-8 px-4">결제하기</h1>
      <div className="border-b border-gray-300 mb-4" />
      <div className="flex gap-12 px-4">
        {/* 배송지 입력 */}
        <section className="flex-1">
          <h2 className="text-lg font-semibold mb-4">배송지 입력</h2>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="default-address"
              className="mr-2"
              checked={formData.useDefaultAddress}
              onChange={(e) => handleFormChange("useDefaultAddress", e.target.checked)}
            />
            <label htmlFor="default-address" className="text-sm">기본 배송지 사용</label>
          </div>
          <div className="flex mb-3 gap-2">
            <input
              className="flex-1 border rounded px-3 py-2"
              placeholder="우편번호"
              value={formData.postalCode}
              onChange={(e) => handleFormChange("postalCode", e.target.value)}
              disabled={formData.useDefaultAddress}
            />
            <button className="px-4 py-2 bg-gray-700 text-white rounded" disabled={formData.useDefaultAddress}>찾아보기</button>
          </div>
          <input
            className="w-full border rounded px-3 py-2 mb-3"
            placeholder="수령인"
            value={formData.recipient}
            onChange={(e) => handleFormChange("recipient", e.target.value)}
            disabled={formData.useDefaultAddress}
          />
          <input
            className="w-full border rounded px-3 py-2 mb-3"
            placeholder="도로명 주소"
            value={formData.roadAddress}
            onChange={(e) => handleFormChange("roadAddress", e.target.value)}
            disabled={formData.useDefaultAddress}
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="상세 주소"
            value={formData.detailAddress}
            onChange={(e) => handleFormChange("detailAddress", e.target.value)}
            disabled={formData.useDefaultAddress}
          />
        </section>
        {/* 구매 상품/결제 금액 */}
        <section className="w-[420px]">
          <h2 className="text-lg font-semibold mb-4">구매 상품</h2>
          <div className="border-b border-gray-300 mb-4" />
          <div className="mb-6">
            {paymentData && paymentData.items.length > 0 ? (
              paymentData.items.map((item) => {
                const info = productInfoMap[item.id]
                return (
                  <div key={item.id} className="flex justify-between items-center mb-2 text-gray-800">
                    <span>{info ? info.name : `상품 ${item.id}`} │ {item.count}개</span>
                    <span>{info ? (info.price * item.count).toLocaleString() : 0} 원</span>
                  </div>
                )
              })
            ) : (
              <div className="text-gray-400">구매 상품이 없습니다.</div>
            )}
          </div>
          <div className="border-b border-gray-300 mb-4" />
          <div className="flex justify-between items-center text-xl font-bold mb-2">
            <span>최종 결제 금액</span>
            <span>
              {(() => {
                const total = paymentData?.items.reduce((sum, item) => {
                  const info = productInfoMap[item.id]
                  return sum + (info ? info.price * item.count : 0)
                }, 0) ?? 0
                return total.toLocaleString()
              })()} 원
            </span>
          </div>
          <div className="text-sm text-gray-500 mb-8">총 상품 가격</div>
        </section>
      </div>
      <div className="flex justify-end px-4 mt-8">
        <button className="bg-amber-500 text-white text-lg px-12 py-3 rounded-lg font-semibold hover:bg-orange-500" onClick={handlePayment}>결제하기</button>
      </div>
    </main>
  )
}
