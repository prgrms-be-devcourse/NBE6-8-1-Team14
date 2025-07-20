"use client";

export function RedirectLayout() {
    return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">리다이렉트 중...</p>
            </div>
        </div>
    )
}