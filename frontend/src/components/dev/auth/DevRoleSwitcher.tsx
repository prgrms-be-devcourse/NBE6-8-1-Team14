"use client"

import type { HeaderUser } from "@/types/dev/auth"

interface DevRoleSwitcherProps {
    onLogin: (user: HeaderUser) => void
    onLogout: () => void
}

export function DevRoleSwitcher({ onLogin, onLogout }: DevRoleSwitcherProps) {
    const handleLoginAs = (role: "user" | "admin") => {
        onLogin({ name: role === "admin" ? "김관리" : "홍길동", role: role })
    }

    return (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border z-50">
            <h3 className="text-sm font-bold mb-2">🧪 개발용 역할 전환</h3>
            <div className="flex flex-col space-y-2">
                <button
                    onClick={() => handleLoginAs("user")}
                    className="w-full px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                >
                    사용자로 로그인
                </button>
                <button
                    onClick={() => handleLoginAs("admin")}
                    className="w-full px-3 py-1.5 text-xs bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
                >
                    관리자로 로그인
                </button>
                <button
                    onClick={onLogout}
                    className="w-full px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                    로그아웃
                </button>
            </div>
        </div>
    )
}
