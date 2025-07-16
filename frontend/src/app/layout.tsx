import type React from "react"
import "./globals.css"
import ClientLayout from "./ClientLayout" // 새로 만든 ClientLayout을 import 합니다.

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
        <body className="min-h-screen bg-gray-50">
        <ClientLayout>{children}</ClientLayout>
        </body>
        </html>
    )
}
