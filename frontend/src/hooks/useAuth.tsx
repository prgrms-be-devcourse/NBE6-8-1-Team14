"use client";

import {useEffect, useState, createContext, use} from "react";
import client from "@/lib/backend/client";
import { components } from "@/lib/backend/api/schema";

type MemberLoginResponseDto = components["schemas"]["MemberLoginResponseDto"]

export default function useAuth() {

    const [loginMember, setLoginMember] = useState<MemberLoginResponseDto | null>(null)
    const isLogin = loginMember !== null;
    const isAdmin = isLogin && loginMember.role === "ADMIN";

    useEffect(() => {
        // 개발 환경에서는 초기 인증 체크를 건너뜀
        if (true) {
            console.log("Development mode: skipping initial auth check");
            return;
        }

        client.GET("/api/auth/me").then((res) => {
            if (res.error) return;

            setLoginMember(res.data);
        })
    }, [])

    const clearLoginMember = () => {
        setLoginMember(null);
    }

    const logout = (onSuccess: () => void) => {
        client.DELETE("api/auth/logout").then(res => {
            if (res.error) {
                // 예시
                alert(res.error);
                return;
            }

            clearLoginMember();

            onSuccess();
        })
    }

    const baseRs = {
        logout,
        setLoginMember,
        isAdmin,
    };

    if (isLogin) {
        return {
            isLogin: true,
            loginMember,
            ...baseRs
        } as const;
    }

    return {
        isLogin: false,
        loginMember: null,
        ...baseRs,
    } as const;
}

export const AuthContext = createContext<ReturnType<typeof useAuth> | null>(null);

export function AuthProvider({children}: { children: React.ReactNode }) {
    const authState = useAuth();

    return (
        <AuthContext value={authState}>
            {children}
        </AuthContext>
    );
}

export function useAuthContext() {
    const authState = use(AuthContext);
    if (authState === null) throw new Error("AuthContext not Found");
    return authState;
}