"use client"

import type React from "react"
import { Header } from "@/components/header/header"
import { Footer } from "@/components/footer/footer"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 mb-24">
                {children}
            </main>
            <Footer />
        </div>
    )
}