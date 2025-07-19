"use client"
import { useEffect, useState } from "react"
import ConfirmModal from "@/components/modal/ConfirmModal"
import { PaymentData, ProductInfo, PaymentFormData } from "@/types/dev/payment"
import { get } from "@/lib/fetcher"
import { IoArrowBackOutline } from "react-icons/io5"

export default function PaymentPage() {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [productMap, setProductMap] = useState<Record<number, ProductInfo>>({})
  const [showLeaveModal, setShowLeaveModal] = useState(false)
  const [leaveTo, setLeaveTo] = useState<string>("")
  const [formData, setFormData] = useState<PaymentFormData>({
    useDefaultAddress: false,
    recipient: "",
    roadAddress: "",
    detailAddress: ""
  })

  useEffect(() => {
    // 세션스토리지에서 결제 데이터 가져오기
    const data = sessionStorage.getItem("paymentData")
    if (data) {
      setPaymentData(JSON.parse(data))
    }

    // 상품 데이터 가져오기
    const fetchProducts = async () => {
      const response = await get<{ products: ProductInfo[] }>("/product/data/product.json")
      
      if (response.error) {
        console.error("상품 데이터를 불러오는데 실패했습니다:", response.error)
        return
      }

      if (response.data && response.data.products && Array.isArray(response.data.products)) {
        const productMap: Record<number, ProductInfo> = {}
        response.data.products.forEach((product: ProductInfo) => {
          productMap[product.id] = product
        })
        setProductMap(productMap)
      }
    }

    fetchProducts()
  }, [])

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

  // 폼 데이터 변경 핸들러
  const handleFormChange = (field: keyof PaymentFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <main className="max-w-[1280px] mx-auto min-h-screen bg-white">
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
      <div className="px-4 mt-8">
        {paymentData?.fromCart ? (
          <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center" onClick={() => handleBack("/cart")}>
            <IoArrowBackOutline className="w-5 h-5 mr-2" />
            장바구니로 돌아가기
            </button>
        ) : (
          <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors" onClick={() => handleBack("/")}>상품 목록으로 돌아가기</button>
        )}
      </div>
      <h1 className="text-3xl font-bold mt-4 mb-8 px-4">결제하기</h1>
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
                const product = productMap[item.id]
                return (
                  <div key={item.id} className="flex justify-between items-center mb-2 text-gray-800">
                    <span>{product?.name ?? `상품 ${item.id}`} │ {item.count}개</span>
                    <span>{product?.price ? (product.price * item.count).toLocaleString() : 0} 원</span>
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
            <span>{paymentData ? paymentData.totalPrice.toLocaleString() : 0} 원</span>
          </div>
          <div className="text-sm text-gray-500 mb-8">총 상품 가격</div>
        </section>
      </div>
      <div className="flex justify-end px-4 mt-8">
        <button className="bg-amber-500 text-white text-lg px-12 py-3 rounded-lg font-semibold hover:bg-orange-500">결제하기</button>
      </div>
    </main>
  )
}
