"use client";

import { useEffect, useState, createContext, use } from "react";
import client from "@/lib/backend/client";
import { MemberLoginResponseDto } from "@/types/auth";
import { useRouter } from "next/navigation";
import { simpleErrorHandler } from "@/utils/error/simpleErrorHandler";

export default function useAuth() {
    const [loginMember, setLoginMember] = useState<MemberLoginResponseDto | null>(null)
    const isLogin = loginMember !== null;
    const isAdmin = loginMember?.role === "ADMIN";
    const isUser = loginMember?.role === "USER";
    const router = useRouter();

    useEffect(() => {
        client.GET("/api/auth/memberInfo").then((res) => {
            // 사이트 접속 때 멤버 부분을 가지고 올 수 있도록 함
            // 쿠키 활용
            // TODO: api 갱신 후 테스트 필요
            const content = res.data?.content ?? null;

            if (res.error || !content) {
                console.log("memberInfo API 에러:", res.error);
                return;
            }

            setLoginMember(res.data.content);
        }).catch((err) => {
            simpleErrorHandler(err);
        })
    }, [])

    const clearLoginMember = () => {
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

            setLoginMember(res.data.content);
            onSuccess();
            router.replace("/");

        }).catch((err) => {
            simpleErrorHandler(err);
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
            simpleErrorHandler(err);
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