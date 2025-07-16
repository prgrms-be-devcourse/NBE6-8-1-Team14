import type React from "react"
import "./globals.css"
import { Header } from "@/components/header/header"

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
        <body className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-[1280px] mx-auto">{children}</main>
        </body>
        </html>
    )
}
