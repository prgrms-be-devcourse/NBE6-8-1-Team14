"use client"

import Link from "next/link"
import Image from "next/image"
import { FiUser } from "react-icons/fi"
import { TiShoppingCart } from "react-icons/ti"
import { IoSettingsOutline } from "react-icons/io5"
import { useAuthContext } from "@/hooks/useAuth";

export function Header() {
    const { loginMember, isLogin, isAdmin, logout } = useAuthContext();

    const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        logout(() => {
            alert("로그아웃이 완료되었습니다.")
        })
    }

    return (
        <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-[1280px] mx-auto px-4 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center">
                    <Image src="/logo/logo.svg" alt="Take Five Logo" width={120} height={30} className="h-12 w-auto" priority />
                </Link>
                <div className="flex items-center space-x-4">
                    {!isLogin ? (
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
                                {isAdmin ? "관리자 " : ""}
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
                        <Link href={isLogin ? "/profile" : "/members/login"}>
                            <FiUser className="w-6 h-6 text-gray-600 hover:text-gray-900 transition-colors" />
                        </Link>
                        {isAdmin ? (
                            <Link href="#">
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
    )
}
