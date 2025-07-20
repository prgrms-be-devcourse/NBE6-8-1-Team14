"use client"
import { useRouter } from "next/navigation"
import React, { useState, useRef, useEffect } from "react"
import Image from "next/image"
import type { Product } from "@/types/dev/product"
import type { ProductRequest } from "@/types/dev/product";
import { useAuthContext } from "@/hooks/useAuth"
import { post } from "@/lib/fetcher"
import ConfirmModal from "@/components/modal/ConfirmModal"

export default function ProductNewPage() {
    const router = useRouter();
    const { getUserRole } = useAuthContext();
    const userRole = getUserRole();
    const [editData, setEditData] = useState<Omit<Product, "id">>({
        name: "",
        price: 0,
        stockQuantity: 0,
        imagePath: "",
        description: "",
        createdAt: "",
        editedAt: ""
    });
    const [previewImagePath, setPreviewImagePath] = useState("/noimage.svg"); // 미리보기 이미지 경로 상태 추가
    const nameRef = useRef<HTMLInputElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLTextAreaElement>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState<"success" | "error">("success");
    const [imageExists, setImageExists] = useState(true);
    const [isCheckingImage, setIsCheckingImage] = useState(false);

    // 입력값 변경 핸들러
    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === "imagePath") {
            // 이미지 경로 자동 생성
            const imagePath = value ? `/product/image/${value}` : "";
            setEditData({
                ...editData,
                imagePath: imagePath
            });
            // 이미지 존재 확인은 onBlur에서만 실행
        } else {
            setEditData({
                ...editData,
                [name]: name === "price" || name === "stock" ? Number(value) : value
            });
        }
    }

    // 이미지 파일 존재 여부 확인
    const checkImageExists = async (imagePath: string) => {
        if (!imagePath || imagePath.trim() === "") {
            setImageExists(false);
            return;
        }

        setIsCheckingImage(true);
        try {
            const cleanPath = imagePath.trim();
            const response = await fetch(cleanPath);
            setImageExists(response.ok);
        } catch {
            setImageExists(false);
        } finally {
            setIsCheckingImage(false);
        }
    };

    // 이미지 입력 필드 포커스 아웃 핸들러
    const handleImageBlur = () => {
        const imagePath = editData.imagePath.replace('/product/image/', '');
        if (imagePath && imagePath.trim() && imagePath.trim().length > 0) {
            setPreviewImagePath(editData.imagePath); // 포커스 아웃 시에만 미리보기 경로 갱신
            void checkImageExists(editData.imagePath);
        } else {
            setPreviewImagePath("/noimage.svg");
        }
    };

    // 저장(등록) 핸들러
    const handleEditSave = async () => {
        if (!editData.name.trim()) {
            alert("상품명을 입력해주세요.");
            nameRef.current?.focus();
            return;
        }
        if (editData.price === 0) {
            alert("가격을 0보다 크게 입력해주세요.");
            priceRef.current?.focus();
            return;
        }
        if (!editData.imagePath) {
            alert("상품 이미지 파일명을 입력해주세요.");
            imageRef.current?.focus();
            return;
        }
        if (!imageExists) {
            alert("입력한 이미지 파일을 찾을 수 없습니다. 파일명을 확인해주세요.");
            imageRef.current?.focus();
            return;
        }
        if (!editData.description.trim()) {
            alert("상품 설명을 입력해주세요.");
            descRef.current?.focus();
            return;
        }

        // 상품 정보를 JSON으로 전송 (이미지 경로 포함)
        const productData: ProductRequest = {
            name: editData.name,
            price: editData.price,
            description: editData.description,
            imagePath: editData.imagePath,
            stockQuantity: editData.stockQuantity,
            stockStatus: editData.stockQuantity > 0 ? "IN_STOCK" : "OUT_OF_STOCK"
        };

        console.log("상품 등록 데이터:", productData);

        try {
            const response = await post("/api/products", productData);

            if (response.error) {
                setModalMessage(`상품 등록에 실패했습니다:\n${response.error}`);
                setModalType("error");
                setShowModal(true);
                return;
            }

            setModalMessage("상품이 성공적으로\n등록되었습니다!");
            setModalType("success");
            setShowModal(true);
        } catch {
            setModalMessage("상품 등록 중\n오류가 발생했습니다.");
            setModalType("error");
            setShowModal(true);
        }
    }
    // 돌아가기 핸들러
    const handleEditCancel = () => {
        router.replace("/");
    }

    // 비관리자 접근 제한
    useEffect(() => {
        const savedLoginState = localStorage.getItem('user-login-state');
        if (savedLoginState) {
            try {
                const loginData = JSON.parse(savedLoginState);
                if (loginData.role !== "ADMIN") {
                    router.replace("/");
                }
            } catch {
                router.replace("/");
            }
        } else {
            router.replace("/");
        }
    }, [router]);

    // 모달 핸들러
    const handleModalConfirm = () => {
        setShowModal(false);
        if (modalType === "success") {
            router.replace("/");
        }
    };

    const handleModalCancel = () => {
        setShowModal(false);
    };

    if (userRole !== 'ADMIN') {
        return null;
    }

    return (
        <>
            {showModal && (
                <ConfirmModal
                    message={modalMessage}
                    confirmText="확인"
                    onConfirm={handleModalConfirm}
                    onCancel={handleModalCancel}
                />
            )}
            <main className="max-w-[1280px] mx-auto bg-white">
                <div className="px-4 py-8">
                    {/* 상단 돌아가기 버튼 */}
                    <button
                        onClick={handleEditCancel}
                        className="mb-6 text-gray-600 hover:text-gray-900 flex items-center"
                    >
                        ← 돌아가기
                    </button>
                    <h1 className="text-2xl font-bold mb-6">상품 등록</h1>
                    <form className="space-y-6" onSubmit={e => { e.preventDefault(); void handleEditSave(); }}>
                        {/* 2단 그리드: 왼쪽(미리보기), 오른쪽(입력란) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-2">
                            {/* 이미지 미리보기 */}
                            <div>
                                <div className="w-full aspect-square overflow-hidden rounded border bg-gray-100 flex items-center justify-center relative">
                                    {isCheckingImage ? (
                                        <div className="text-gray-500">이미지 확인 중...</div>
                                    ) : !imageExists && editData.imagePath ? (
                                        <div className="text-red-500 text-center">
                                            <div className="text-lg font-semibold mb-2">이미지 없음</div>
                                            <div className="text-sm">입력한 파일을 찾을 수 없습니다</div>
                                        </div>
                                    ) : (
                                        <Image
                                            src={previewImagePath.trim() || "/noimage.svg"}
                                            alt="/noimage.svg"
                                            fill
                                            className={previewImagePath.trim() === "/noimage.svg" ? "object-cover" : "object-contain"}
                                            unoptimized
                                        />
                                    )}
                                </div>
                            </div>
                            {/* 입력 필드 영역 */}
                            <div className="flex flex-col gap-4 justify-between">
                                <div>
                                    <label className="block text-sm font-medium mb-1">상품명</label>
                                    <input ref={nameRef} name="name" value={editData.name} onChange={handleEditChange} className="w-full border rounded px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">가격(원)</label>
                                    <input
                                        ref={priceRef}
                                        name="price"
                                        type="number"
                                        value={editData.price}
                                        min={1000}
                                        step={1000}
                                        onChange={handleEditChange}
                                        onBlur={e => {
                                            const value = e.target.value;
                                            if (value === "") return;
                                            let num = parseInt(value, 10);
                                            // 1000의 배수로 보정
                                            if (num % 1000 !== 0) {
                                                num = Math.round(num / 1000) * 1000;
                                                handleEditChange({
                                                    ...e,
                                                    target: {
                                                        ...e.target,
                                                        value: num.toString()
                                                    }
                                                });
                                            }
                                        }}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">재고</label>
                                    <input name="stockQuantity" type="number" value={editData.stockQuantity} onChange={handleEditChange} className="w-full border rounded px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">상품 이미지</label>
                                    <input
                                        ref={imageRef}
                                        name="imagePath"
                                        type="text"
                                        placeholder="예: americano.jpg"
                                        value={editData.imagePath.replace('/product/image/', '')}
                                        onChange={handleEditChange}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Tab' || e.key === 'Enter') {
                                                handleImageBlur();
                                            }
                                        }}
                                        onBlur={handleImageBlur}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">파일명.확장자 형태로 입력하세요 (예: americano.jpg)</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">설명</label>
                                    <textarea ref={descRef} name="description" value={editData.description} onChange={handleEditChange} className="w-full border rounded px-3 py-2 min-h-[80px]" />
                                </div>
                            </div>
                        </div>
                        {/* 이미지 미리보기 설명 */}
                        <p className="text-xs text-gray-500 mt-1">이미지를 선택하면 미리보기가 표시됩니다. (실제 업로드는 API 연동 필요)</p>
                        {/* 저장 버튼 */}
                        <div className="flex gap-4 mt-8 justify-end">
                            <button type="submit" className="px-6 py-2 bg-amber-500 text-white rounded hover:bg-orange-500">등록</button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    )
}