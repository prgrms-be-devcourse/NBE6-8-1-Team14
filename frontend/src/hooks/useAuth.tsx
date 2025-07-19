"use client";

import {useEffect, useState, createContext, use} from "react";
import client from "@/lib/backend/client";
import {MemberLoginResponseDto} from "@/types/auth";

export default function useAuth() {
    const [loginMember, setLoginMember] = useState<MemberLoginResponseDto | null>(null)
    const isLogin = loginMember !== null;
    const isAdmin = loginMember?.role === "ADMIN";
    const isUser = loginMember?.role === "USER";

    useEffect(() => {
        client.GET("/api/auth/memberInfo").then((res) => {
            if (res.error) return;

            setLoginMember(res.data);
        })
    }, [])

    const clearLoginMember = () => {
        setLoginMember(null);
    }

    const logout = (onSuccess: () => void) => {
        client.DELETE("/api/auth/logout").then(res => {
            if (res.error) {
                // 예시
                alert("비정상적인 동작입니다.");
                return;
            }

            clearLoginMember();

            onSuccess();
        }).catch(err => {
            alert("로그아웃 하는데 실패했습니다.")
        })
    }

    const baseRs = {
        logout,
        setLoginMember,
        isAdmin,
        isUser
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