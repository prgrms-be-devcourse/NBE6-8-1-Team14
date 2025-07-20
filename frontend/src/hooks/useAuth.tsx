"use client";

import { useState, createContext, use } from "react";
import client from "@/lib/backend/client";
import { MemberLoginResponseDto } from "@/types/member";
import { useRouter } from "next/navigation";

export default function useAuth() {
    const [loginMember, setLoginMember] = useState<MemberLoginResponseDto | null>(null)
    const [authError, setAuthError] = useState<string | null>(null);
    const router = useRouter();

    // 로컬스토리지에서 사용자 정보를 가져와서 로그인 상태와 권한 판별
    const getUserInfoFromStorage = () => {
        try {
            const userLoginState = localStorage.getItem('user-login-state');
            if (!userLoginState) {
                return { isLogin: false, isAdmin: false, isUser: false, loginMember: null };
            }

            const userInfo = JSON.parse(userLoginState);
            const role = userInfo.role;

            if (role === 'ADMIN') {
                return { 
                    isLogin: true, 
                    isAdmin: true, 
                    isUser: false, 
                    loginMember: userInfo 
                };
            } else if (role === 'USER') {
                return { 
                    isLogin: true, 
                    isAdmin: false, 
                    isUser: true, 
                    loginMember: userInfo 
                };
            } else {
                return { isLogin: false, isAdmin: false, isUser: false, loginMember: null };
            }
        } catch (error) {
            console.error('사용자 정보 파싱 실패:', error);
            return { isLogin: false, isAdmin: false, isUser: false, loginMember: null };
        }
    };

    const { isLogin, isAdmin, isUser, loginMember: storedLoginMember } = getUserInfoFromStorage();

    // 사용자 권한을 간단하게 확인하는 함수
    const getUserRole = () => {
        if (!isLogin) return 'GUEST';
        if (isAdmin) return 'ADMIN';
        if (isUser) return 'USER';
        return 'GUEST';
    };

    const clearLoginMember = () => {
        // localStorage에서 모든 로그인 관련 데이터 제거
        localStorage.removeItem('user-login-state');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
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
        }).then((res: any) => {
            if (res.error) {
                setAuthError(`로그인에 실패했습니다.\n${res.error.message || '알 수 없는 오류가 발생했습니다.'}`);
                return;
            }

            const content = res.data?.content;
            if (content) {
                // 액세스 토큰과 리프레시 토큰을 각각 로컬스토리지에 저장
                if (content.accessToken) {
                    localStorage.setItem('accessToken', content.accessToken);
                }
                if (content.refreshToken) {
                    localStorage.setItem('refreshToken', content.refreshToken);
                }
                
                // 사용자 정보만 별도로 저장 (createdAt, editedAt 제외)
                const userInfo = {
                    memberDto: {
                        id: content.memberDto?.id,
                        nickname: content.memberDto?.nickname
                    },
                    role: content.role
                };
                localStorage.setItem('user-login-state', JSON.stringify(userInfo));
                
                setLoginMember(content);
            }

            onSuccess();
            router.replace("/");

        }).catch((err) => {
            setAuthError(`로그인에 실패했습니다.\n${err.message || '네트워크 오류가 발생했습니다.'}`);
        })
    }

    const logout = (onSuccess: () => void) => {
        if (!isLogin) {
            return;
        }

        client.POST("/api/auth/logout").then(res => {
            if (res.error) {
                setAuthError("로그아웃 중 오류가 발생했습니다.");
                return;
            }

            clearLoginMember();
            onSuccess();
            router.refresh();
            router.replace("/");

        }).catch(err => {
            setAuthError("로그아웃 중 네트워크 오류가 발생했습니다.");
        })
    }

    const baseRs = {
        logIn,
        logout,
        getUserRole,
        authError,
        setAuthError
    };

    return {
        isLogin,
        loginMember: storedLoginMember,
        ...baseRs
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