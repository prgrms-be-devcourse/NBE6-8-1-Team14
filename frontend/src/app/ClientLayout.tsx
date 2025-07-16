"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header/header"
import { DevRoleSwitcher } from "@/components/dev/auth/DevRoleSwitcher"
import type { HeaderUser } from "@/types/dev/auth"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<HeaderUser | null>(null)

    return (
        <>
            <Header user={user} />

            {children}

            <DevRoleSwitcher onLogin={setUser} onLogout={() => setUser(null)} />
        </>
    )
}
