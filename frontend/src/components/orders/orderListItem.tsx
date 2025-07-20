import {OrderItemResponseDto} from "@/types/dev/order";
import {formatPrice} from "@/utils/format";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

interface OrderListItemProps {
    item : OrderItemResponseDto;
}

export function OrderListItem( { item } : OrderListItemProps ) {
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    return (
        <div className="flex justify-between relative">
            <Link 
                className="font-bold underline relative" 
                href={`/products/${item.productId}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {item.productName}
                
                {/* 이미지 팝업 */}
                {isHovered && item.imagePath && (
                    <div className="absolute z-10 top-full left-0 mt-2 p-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                        <div className="relative w-32 h-32">
                            {!imageError ? (
                                <Image
                                    src={item.imagePath}
                                    alt={item?.productName ? item.productName : ""}
                                    fill
                                    className="object-cover rounded"
                                    onLoad={() => setImageLoaded(true)}
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center text-gray-500 text-sm">
                                    이미지 없음
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Link>
            <div>
                <span className="px-25">x {item.count}</span>
                <span>{item?.totalPrice ? formatPrice(item.totalPrice) : 0} 원</span>
            </div>
        </div>
    );
}