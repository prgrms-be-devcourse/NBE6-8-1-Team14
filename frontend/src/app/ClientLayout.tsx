"use client"

import type React from "react"
import { Header } from "@/components/header/header"
import { DevRoleSwitcher } from "@/components/dev/auth/DevRoleSwitcher"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            {children}
            <DevRoleSwitcher />
        </>
    )
}