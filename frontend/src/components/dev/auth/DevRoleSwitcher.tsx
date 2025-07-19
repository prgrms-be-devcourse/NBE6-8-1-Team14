"use client"

import { useAuthContext } from "@/hooks/useAuth";

export function DevRoleSwitcher() {
    const { setLoginMember, loginMember, isLogin } = useAuthContext();

    const handleLoginAs = (role: "USER" | "ADMIN") => {
        setLoginMember({
            memberDto: {
                id: role === "ADMIN" ? 1 : 2,
                nickname: role === "ADMIN" ? "김관리" : "홍길동",
                createdAt: new Date().toISOString(),
                editedAt: new Date().toISOString()
            },
            role: role,
            accessToken: "mock-access-token",
            refreshToken: "mock-refresh-token"
        })
    }

    const handleLogout = () => {
        setLoginMember(null)
    }

    return (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border z-50">
            <h3 className="text-sm font-bold mb-2">🧪 개발용 역할 전환</h3>

            {/* 현재 상태 표시 */}
            <div className="text-xs text-gray-500 mb-2">
                현재: {isLogin ? `${loginMember.memberDto.nickname} (${loginMember.role})` : "로그아웃"}
            </div>

            <div className="flex flex-col space-y-2">
                <button
                    onClick={() => handleLoginAs("USER")}
                    className="w-full px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                >
                    사용자로 로그인
                </button>
                <button
                    onClick={() => handleLoginAs("ADMIN")}
                    className="w-full px-3 py-1.5 text-xs bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
                >
                    관리자로 로그인
                </button>
                <button
                    onClick={handleLogout}
                    className="w-full px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                    로그아웃
                </button>
            </div>
        </div>
    )
}