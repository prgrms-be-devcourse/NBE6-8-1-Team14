"use client";

import {AuthProvider} from "@/hooks/useAuth";
import ClientLayout from "@/app/ClientLayout";

export default function ContextLayout({
    children,
}:  Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AuthProvider>
            <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
    );
}