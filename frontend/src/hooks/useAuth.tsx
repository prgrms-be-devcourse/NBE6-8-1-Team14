"use client";

import { useState, createContext, use, useEffect, useCallback } from "react";
import client from "@/lib/backend/client";
import { useRouter } from "next/navigation";
import { ApiResponse, LoginResponse } from "@/types/dev/auth";

export default function useAuth() {
    const [authError, setAuthError] = useState<string | null>(null);
    const [authState, setAuthState] = useState({
        isLogin: false,
        isAdmin: false,
        isUser: false,
        loginMember: null as any
    });
    const router = useRouter();

    // 로컬스토리지에서 사용자 정보를 가져와서 로그인 상태와 권한 판별
    const getUserInfoFromStorage = useCallback(() => {
        try {
            const userLoginState = localStorage.getItem('user-login-state');
            if (!userLoginState) {
                return { isLogin: false, isAdmin: false, isUser: false, loginMember: null };
            }

            const userInfo = JSON.parse(userLoginState);
            const { role } = userInfo;

            if (role === 'ADMIN') {
                return { 
                    isLogin: true, 
                    isAdmin: true, 
                    isUser: false, 
                    loginMember: userInfo 
                };
            } 
            
            if (role === 'USER') {
                return { 
                    isLogin: true, 
                    isAdmin: false, 
                    isUser: true, 
                    loginMember: userInfo 
                };
            }
            
            return { isLogin: false, isAdmin: false, isUser: false, loginMember: null };
        } catch {
            console.error('사용자 정보 파싱 실패');
            return { isLogin: false, isAdmin: false, isUser: false, loginMember: null };
        }
    }, []);

    // localStorage 변경 감지 및 상태 업데이트
    useEffect(() => {
        const updateAuthState = () => {
            const newState = getUserInfoFromStorage();
            setAuthState(newState);
        };

        // 초기 상태 설정
        updateAuthState();

        // localStorage 변경 이벤트 리스너
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'user-login-state' || e.key === null) {
                updateAuthState();
            }
        };

        // 다른 탭에서의 localStorage 변경 감지
        window.addEventListener('storage', handleStorageChange);

        // 현재 탭에서의 localStorage 변경 감지를 위한 커스텀 이벤트
        const handleCustomStorageChange = () => {
            updateAuthState();
        };

        window.addEventListener('authStateChanged', handleCustomStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('authStateChanged', handleCustomStorageChange);
        };
    }, [getUserInfoFromStorage]);

    const { isLogin, isAdmin, isUser, loginMember: storedLoginMember } = authState;

    // 사용자 권한을 간단하게 확인하는 함수
    const getUserRole = useCallback(() => {
        if (!isLogin) return 'GUEST';
        if (isAdmin) return 'ADMIN';
        if (isUser) return 'USER';
        return 'GUEST';
    }, [isLogin, isAdmin, isUser]);

    const clearLoginMember = () => {
        // localStorage에서 모든 로그인 관련 데이터 제거
        localStorage.removeItem('user-login-state');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        // 상태 변경 트리거
        window.dispatchEvent(new Event('authStateChanged'));
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
        }).then((res: ApiResponse<LoginResponse>) => {
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
                
                // 상태 변경 트리거
                window.dispatchEvent(new Event('authStateChanged'));
            }

            onSuccess();
            router.replace("/");

        }).catch(() => {
            setAuthError(`로그인에 실패했습니다.\n네트워크 오류가 발생했습니다.`);
        })
    }

    const logout = (onSuccess: () => void) => {
        if (!isLogin) {
            return;
        }

        client.POST("/api/auth/logout").then((res: ApiResponse<unknown>) => {
            if (res.error) {
                setAuthError("로그아웃 중 오류가 발생했습니다.");
                return;
            }

            clearLoginMember();
            onSuccess();
            router.refresh();
            router.replace("/");

        }).catch(() => {
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