"use client";


export const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
}

export const formatDate = (dateString: string) => {
    const date = new Date(dateString)
        .toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });

    if (date.includes("Invalid")) {
        return "정보 없음";
    }
    return date;
};