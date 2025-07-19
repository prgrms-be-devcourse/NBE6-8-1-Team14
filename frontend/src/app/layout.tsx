import "./globals.css";
import type { ReactNode } from "react";
import ContextLayout from "@/app/ContextLayout";

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="ko">
            <body className="bg-white">
                <ContextLayout>{children}</ContextLayout>
            </body>
        </html>
    );
}