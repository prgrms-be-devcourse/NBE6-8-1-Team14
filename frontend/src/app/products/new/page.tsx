"use client"
import { useRouter } from "next/navigation"
import { useState, useRef } from "react"
import Image from "next/image"
import type { Product } from "@/types/dev/product"
import { useUser } from "@/contexts/UserContext"

export default function ProductNewPage() {
    const router = useRouter();
    const { user } = useUser();
    const [editData, setEditData] = useState<Omit<Product, "id">>({
        name: "",
        price: 0,
        stock: 0,
        imageUrl: "",
        description: ""
    });
    const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLTextAreaElement>(null);

    // 입력값 변경 핸들러
    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditData({
            ...editData,
            [name]: name === "price" || name === "stock" ? Number(value) : value
        })
    }
    // 이미지 업로드 핸들러
    const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (ev) => {
                const base64 = ev.target?.result as string;
                setEditImagePreview(base64);
            };
            reader.readAsDataURL(file);
        }
    }
    // 저장(등록) 핸들러
    const handleEditSave = () => {
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
        if (!imageFile) {
            alert("상품 이미지를 등록해주세요.");
            imageRef.current?.focus();
            return;
        }
        if (!editData.description.trim()) {
            alert("상품 설명을 입력해주세요.");
            descRef.current?.focus();
            return;
        }
        // 상품 정보는 JSON 문자열로, 이미지는 파일로 FormData에 추가
        const formData = new FormData();
        formData.append("product", JSON.stringify({
            name: editData.name,
            price: editData.price,
            stock: editData.stock,
            description: editData.description
        }));
        formData.append("image", imageFile);
        // 콘솔 출력
        for (const [key, value] of formData.entries()) {
            console.log(key, value);
        }
        alert("상품이 FormData(JSON+파일)로 준비되었습니다! (실제 저장은 API 연동 필요)");
        router.replace("/");
    }
    // 돌아가기 핸들러
    const handleEditCancel = () => {
        router.replace("/");
    }

    // 비관리자 접근 제한
    if (!user || user.role !== "admin") {
        router.replace("/");
        return null;
    }

    return (
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
                <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleEditSave(); }}>
                    {/* 2단 그리드: 왼쪽(미리보기), 오른쪽(입력란) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-2">
                        {/* 이미지 미리보기 */}
                        <div>
                            <div className="w-full aspect-square overflow-hidden rounded border bg-gray-100 flex items-center justify-center">
                                <Image
                                    src={editImagePreview || editData.imageUrl || "/noimage.svg"}
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
                                <input ref={nameRef} name="name" value={editData.name} onChange={handleEditChange} className="w-full border rounded px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">가격(원)</label>
                                <input ref={priceRef} name="price" type="number" value={editData.price} onChange={handleEditChange} className="w-full border rounded px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">재고</label>
                                <input name="stock" type="number" value={editData.stock} onChange={handleEditChange} className="w-full border rounded px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">상품 이미지</label>
                                <input ref={imageRef} type="file" accept="image/*" onChange={handleEditImageChange} className="w-full border rounded px-3 py-2" />
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
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">등록</button>
                    </div>
                </form>
            </div>
        </main>
    )
}