import "./globals.css";
import type { ReactNode } from "react";
import ContextLayout from "@/app/ContextLayout";
import GlobalAuthExpireHandler from "./GlobalAuthExpireHandler";

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="ko">
            <body className="bg-white">
                <GlobalAuthExpireHandler />
                <ContextLayout>{children}</ContextLayout>
            </body>
        </html>
    );
}