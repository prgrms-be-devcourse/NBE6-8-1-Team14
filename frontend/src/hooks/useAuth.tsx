"use client";

import { useEffect, useState, createContext, use } from "react";
import client from "@/lib/backend/client";
import { MemberLoginResponseDto } from "@/types/member";
import { useRouter } from "next/navigation";
import { simpleLoginErrorHandler } from "@/utils/error/simpleLoginErrorHandler";

export default function useAuth() {
    const [loginMember, setLoginMember] = useState<MemberLoginResponseDto | null>(null)
    const isLogin = loginMember !== null;
    const isAdmin = loginMember?.role === "ADMIN";
    const isUser = loginMember?.role === "USER";
    const router = useRouter();

    useEffect(() => {
        const savedDevLogin = localStorage.getItem('user-login-state');
        if (savedDevLogin) {
            try {
                setLoginMember(JSON.parse(savedDevLogin));
            } catch (error) {
                console.error("저장된 정보 파싱 실패: ", error);
                clearLoginMember();
            }
        }
    }, [])

    const clearLoginMember = () => {
        // localStorage에서도 로그인 상태 제거
        localStorage.removeItem('user-login-state');
        setLoginMember(null);
    }

    const logIn = (email: string, password: string, onSuccess: () => void) => {
        if (isLogin) {
            return;
        }

        client.POST("/api/auth/login", {
            body: {
                email: email,
                password: password
            }
        }).then((res) => {
            if (res.error) {
                alert(`로그인에 실패했습니다. ${res.error.message}`);
                return;
            }

            const savedDevLogin = localStorage.getItem('user-login-state');
            if (savedDevLogin) {
                try {
                    setLoginMember(JSON.parse(savedDevLogin));
                } catch (error) {
                    console.error("저장된 정보 파싱 실패: ", error);
                    localStorage.removeItem('user-login-state');
                }

            } else {
                const content = res.data.content;
                setLoginMember(content);
                localStorage.setItem('user-login-state', JSON.stringify(content));
            }

            onSuccess();
            router.replace("/");

        }).catch((err) => {
            simpleLoginErrorHandler(err);
        })
    }

    const logout = (onSuccess: () => void) => {
        if (!isLogin) {
            return;
        }

        client.DELETE("/api/auth/logout").then(res => {
            if (res.error) {
                // 예시
                alert("비정상적인 동작입니다.");
                return;
            }

            clearLoginMember();

            onSuccess();

            router.refresh()
            router.replace("/")

        }).catch(err => {
            simpleLoginErrorHandler(err);
        })
    }

    const baseRs = {
        logIn,
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