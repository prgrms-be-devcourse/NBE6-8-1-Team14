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
        client.DELETE("/api/auth/logout").then(res => {
            if (res.error) {
                // 예시
                alert(res.error);
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