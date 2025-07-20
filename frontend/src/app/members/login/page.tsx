"use client";

import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthContext } from "@/hooks/useAuth";
import { checkSpace } from "@/components/member/memberFormValidations";
import { RedirectLayout } from "@/components/common/redirect";

export default function LoginPage() {
    const { isLogin, logIn } = useAuthContext();
    const router = useRouter();

    // 이미 로그인된 사용자에게 모달로 확인
    useEffect(() => {
        if (isLogin) {
            router.replace("/");
            return;
        }
    }, [isLogin, router]);

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        // 특정 사이트로 이동 막기
        e.preventDefault();

        const form = e.target as HTMLFormElement;

        const emailInput = form.elements.namedItem("email",) as HTMLInputElement;
        const passwordInput = form.elements.namedItem("password") as HTMLInputElement;

        // 이메일과 비밀번호는 최소 2자 이상 입력해야 합니다.
        // 프론트 단에서 막는 로직 적용
        if (
            checkSpace(emailInput, "이메일") ||
            checkSpace(passwordInput, "비밀번호")
        ) {
            return;
        }

        logIn(emailInput.value, passwordInput.value, () => {
            router.replace("/");
        })

    };

    if (isLogin) {
        return (
            <RedirectLayout />
        );
    }

    return (
        <>
            <div className="min-h-screen flex flex-col justify-center items-center gap-6 px-4">
                <form className="flex flex-col gap-2 w-full max-w-sm" onSubmit={handleLogin}>
                    <input
                        className="border p-2 rounded"
                        type="email"
                        name="email"
                        placeholder="이메일"
                        autoFocus
                        maxLength={50}
                    />
                    <input
                        className="border p-2 rounded"
                        type="password"
                        name="password"
                        placeholder="비밀번호"
                        maxLength={60}
                    />
                    <button
                        className="border p-2 rounded bg-amber-500 cursor-pointer text-white hover:bg-orange-500 transition"
                        type="submit"
                    >
                        로그인
                    </button>
                </form>
                <Link href="/members/signup" className="text-xs text-gray-600">
                    회원이 아니신가요?
                </Link>
            </div>
        </>
    );
}