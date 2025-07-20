"use client"
import { useParams, useRouter } from "next/navigation"
import React, { useState, useEffect } from "react"
import type { Product, SingleProductApiResponse } from "@/types/dev/product"
import { useAuthContext } from "@/hooks/useAuth"
import Image from "next/image"
import { put, get } from "@/lib/fetcher";
import ConfirmModal from "@/components/modal/ConfirmModal";
import { useRef } from "react";

export default function ProductEditPage() {
    const params = useParams();
    const router = useRouter();
    const { getUserRole } = useAuthContext();
    const userRole = getUserRole();
    const [editData, setEditData] = useState<Product | null>(null);
    const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState<"success" | "error">("success");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const productId = Number(params.id);
    const requestedRef = useRef(false);

    useEffect(() => {
        if (requestedRef.current) return;
        requestedRef.current = true;
        
        if (userRole !== 'ADMIN') {
            router.replace(`/products/${productId}`);
            return;
        }

        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await get<SingleProductApiResponse>(`/api/products/${productId}`);
                
                if (response.error || !response.data) {
                    setError(response.error || '상품을 찾을 수 없습니다.');
                    setEditData(null);
                } else if (response.data.content) {
                    // API 응답 구조에 맞춰 상품 데이터 매핑
                    const productData = response.data.content;
                    const mappedProduct: Product = {
                        id: productData.id,
                        name: productData.name,
                        price: productData.price,
                        description: productData.description,
                        imagePath: productData.imagePath,
                        stockQuantity: productData.stockDto?.quantity || 0,
                        createdAt: productData.createdAt,
                        editedAt: productData.editedAt
                    };
                    setEditData(mappedProduct);
                } else {
                    setError('상품을 찾을 수 없습니다.');
                    setEditData(null);
                }
            } catch (err) {
                setError('상품 정보를 불러오는데 실패했습니다.');
                setEditData(null);
            } finally {
                setLoading(false);
            }
        };
        
        fetchProduct();
    }, [userRole, productId, router]);

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!editData) return;
        const { name, value } = e.target;
        setEditData({
            ...editData,
            [name]: name === "price" || name === "stock" ? Number(value) : value
        })
    }
    const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editData) return;
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setEditImagePreview(ev.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    }
    const handleEditSave = async () => {
        if (!editData) return;
        // PUT 요청용 데이터 생성
        const updateData = {
            name: editData.name,
            price: editData.price,
            description: editData.description,
            imagePath: editData.imagePath,
            stockQuantity: editData.stockQuantity
        };
        try {
            const response = await put(`/api/products/${productId}`, updateData);
            if (response.error || !response.data) {
                setModalMessage(`상품 수정에 실패했습니다.\n${response.error || '알 수 없는 오류가 발생했습니다.'}`);
                setModalType("error");
                setShowModal(true);
                return;
            }
            setModalMessage("상품이 성공적으로 수정되었습니다!");
            setModalType("success");
            setShowModal(true);
        } catch {
            setModalMessage("상품 수정 중 오류가 발생했습니다.");
            setModalType("error");
            setShowModal(true);
        }
    }
    const handleEditCancel = () => {
        router.replace(`/products/${productId}`);
    }
    const handleModalConfirm = () => {
        setShowModal(false);
        if (modalType === "success") {
            router.replace(`/products/${productId}`);
        }
    };

    if (loading) return <div className="p-8">로딩중...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;
    if (!editData) return <div className="p-8">상품을 찾을 수 없습니다.</div>;

    return (
        <>
            {showModal && (
                <ConfirmModal
                    message={modalMessage}
                    confirmText="확인"
                    onConfirm={handleModalConfirm}
                    onCancel={handleModalConfirm}
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
                    <h1 className="text-2xl font-bold mb-6">상품 정보 수정</h1>
                    <form className="space-y-6" onSubmit={e => { e.preventDefault(); void handleEditSave(); }}>
                        {/* 2단 그리드: 왼쪽(미리보기), 오른쪽(입력란) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-2">
                            {/* 이미지 미리보기 */}
                            <div>
                                <div className="w-full aspect-square overflow-hidden rounded border bg-gray-100 flex items-center justify-center">
                                    <Image
                                        src={editImagePreview || editData.imagePath || "/noimage.svg"}
                                        alt="/noimage.svg"
                                        width={300}
                                        height={300}
                                        className="max-w-full max-h-full object-contain"
                                        unoptimized
                                    />
                                </div>
                            </div>
                            {/* 입력 필드 영역 */}
                            <div className="flex flex-col gap-4 justify-between">
                                <div>
                                    <label className="block text-sm font-medium mb-1">상품명</label>
                                    <input name="name" value={editData.name} onChange={handleEditChange} className="w-full border rounded px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">가격(원)</label>
                                    <input name="price" type="number" value={editData.price} onChange={handleEditChange} className="w-full border rounded px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">재고</label>
                                    <input name="stockQuantity" type="number" value={editData.stockQuantity} onChange={handleEditChange} className="w-full border rounded px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">상품 이미지 변경</label>
                                    <input type="file" accept="image/*" onChange={handleEditImageChange} className="w-full border rounded px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">설명</label>
                                    <textarea name="description" value={editData.description} onChange={handleEditChange} className="w-full border rounded px-3 py-2 min-h-[80px]" />
                                </div>
                            </div>
                        </div>
                        {/* 이미지 미리보기 설명 */}
                        <p className="text-xs text-gray-500 mt-1">이미지를 선택하면 미리보기가 표시됩니다. (실제 업로드는 API 연동 필요)</p>
                        {/* 저장 버튼 */}
                        <div className="flex gap-4 mt-8 justify-end">
                            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">저장</button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    )
}