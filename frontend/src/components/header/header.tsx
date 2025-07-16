"use client"
import Link from "next/link"
import Image from "next/image"
import { FiUser } from "react-icons/fi"
import { TiShoppingCart } from "react-icons/ti"

export function Header() {
    return (
        <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-[1280px] mx-auto px-4 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center">
                    <Image src="/logo/logo.svg" alt="Take Five Logo" width={120} height={30} className="h-12 w-auto" priority />
                </Link>
                <div className="flex items-center space-x-4">
                    <>
                        <Link href="/auth/signup" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                            회원가입
                        </Link>
                        <Link href="/auth/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                            로그인
                        </Link>
                    </>
                    <div className="flex items-center space-x-2">
                        <Link href="/auth/user">
                            <FiUser className="w-6 h-6 text-gray-600 hover:text-gray-900 transition-colors" />
                        </Link>
                        <Link href="/auth/cart">
                            <TiShoppingCart className="w-6 h-6 text-gray-600 hover:text-gray-900 transition-colors" />
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}
