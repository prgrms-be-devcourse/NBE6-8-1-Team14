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
        // [임시 추가] 개발환경에서 localStorage에서 로그인 상태 복원
        const savedDevLogin = localStorage.getItem('dev-login-state');
        if (savedDevLogin) {
            try {
                setLoginMember(JSON.parse(savedDevLogin));
                console.log("Development mode: restored login state from localStorage");
                return;
            } catch (error) {
                console.error("Failed to parse saved login state:", error);
                localStorage.removeItem('dev-login-state');
            }
        }

        client.GET("/api/auth/me").then((res) => {
            if (res.error) return;

            setLoginMember(res.data);
        })
    }, [])

    const clearLoginMember = () => {
        setLoginMember(null);
        // [임시 추가] localStorage에서도 개발용 로그인 상태 제거
        localStorage.removeItem('dev-login-state');
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