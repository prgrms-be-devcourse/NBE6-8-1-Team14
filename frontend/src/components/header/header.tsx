"use client"

import Link from "next/link"
import Image from "next/image"
import { FiUser } from "react-icons/fi"
import { TiShoppingCart } from "react-icons/ti"
import { IoSettingsOutline } from "react-icons/io5"
import { useAuthContext } from "@/hooks/useAuth";
import { post } from "@/lib/fetcher"
import ConfirmModal from "../modal/ConfirmModal"
import { useState } from "react"

export function Header() {
    const { loginMember, getUserRole, logout } = useAuthContext();
    const userRole = getUserRole();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const refreshToken = localStorage.getItem("refreshToken");
        e.preventDefault();
        e.stopPropagation();

        try {
            const response = await post("/api/auth/logout", { refreshToken });
            if (response.data) {
                setShowLogoutModal(true);
            } else {
                localStorage.clear();
                window.location.href = "/";
            }
        } catch (error) {
            console.error("로그아웃 중 오류 발생:", error);
            logout(() => {
                console.log("로그아웃 처리 완료 (예외 발생)");
            });
        }
    }

    const handleLogoutConfirm = () => {
        localStorage.clear();
        window.location.href = "/";
    }

    const handleLogoutCancel = () => {
        setShowLogoutModal(false);
    }

    return (
        <>
            <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-[1280px] mx-auto px-4 py-3 flex items-center justify-between">
                    <Link href="/" className="flex items-center">
                        <Image src="/logo/logo.svg" alt="Take Five Logo" width={120} height={30} className="h-12 w-auto" priority />
                    </Link>
                    <div className="flex items-center space-x-4">
                        {userRole === 'GUEST' ? (
                            <>
                                <Link href="/members/signup" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                                    회원가입
                                </Link>
                                <Link href="/members/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                                    로그인
                                </Link>
                            </>
                        ) : (
                            <>
                                <span className="text-sm text-gray-600">
                                    {userRole === 'ADMIN' ? "관리자 " : ""}
                                    {loginMember?.memberDto?.nickname}님
                                </span>
                                <button
                                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                                    onClick={handleLogout}
                                >
                                    로그아웃
                                </button>
                            </>
                        )}
                        <div className="flex items-center space-x-2">
                            <Link href={userRole !== 'GUEST' ? "/members/profile" : "/members/login"}>
                                <FiUser className="w-6 h-6 text-gray-600 hover:text-gray-900 transition-colors" />
                            </Link>
                            {userRole === 'ADMIN' ? (
                                <Link href="/orders">
                                    <IoSettingsOutline className="w-6 h-6 text-gray-600 hover:text-gray-900 transition-colors" />
                                </Link>
                            ) : (
                                <Link href="/cart">
                                    <TiShoppingCart className="w-6 h-6 text-gray-600 hover:text-gray-900 transition-colors" />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>
            
            {showLogoutModal && (
                <ConfirmModal
                    message="로그아웃이 완료되었습니다."
                    confirmText="확인"
                    onConfirm={handleLogoutConfirm}
                    onCancel={handleLogoutCancel}
                />
            )}
        </>
    )
}
