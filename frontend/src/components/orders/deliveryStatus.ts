export type DeliveryStatus = 'READY' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export const getDeliveryStatusText = (status: string | undefined): string => {
    if (!status) return '상태 없음';
    
    switch (status.toUpperCase()) {
        case 'READY':
            return '배송 준비중';
        case 'IN_PROGRESS':
            return '배송중';
        case 'COMPLETED':
            return '배송 완료';
        case 'CANCELLED':
            return '배송 취소';
        default:
            return '알 수 없음';
    }
};

export const getDeliveryStatusColor = (status: string | undefined): string => {
    if (!status) return 'text-gray-500';
    
    switch (status.toUpperCase()) {
        case 'READY':
            return 'text-blue-600';
        case 'IN_PROGRESS':
            return 'text-orange-600';
        case 'COMPLETED':
            return 'text-green-600';
        case 'CANCELLED':
            return 'text-red-600';
        default:
            return 'text-gray-500';
    }
};