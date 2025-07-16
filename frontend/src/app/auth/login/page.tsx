"use client";

import Link from "next/link";

export default function Login() {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        // 특정 사이트로 이동 막기
        e.preventDefault();

        const form = e.target as HTMLFormElement;

        const emailInput = form.elements.namedItem(
            "email",
        ) as HTMLInputElement;
        const passwordInput = form.elements.namedItem(
            "password",
        ) as HTMLTextAreaElement;

        // 이메일과 비밀번호는 최소 2자 이상 입력해야 합니다.
        // 프론트 단에서 막는 로직 적용
        emailInput.value = emailInput.value.trim();

        if (emailInput.value.length < 2) {
            alert("ID를 2자 이상 입력해주세요.");
            emailInput.focus();
            return;
        }

        passwordInput.value = passwordInput.value.trim();

        if (passwordInput.value.length < 2) {
            alert("비밀번호가 너무 짧습니다. 2자 이상 입력해주세요.");
            passwordInput.focus();
            return;
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center gap-6 px-4">
            <form className="flex flex-col gap-2 w-full max-w-sm" onSubmit={handleSubmit}>
                <input
                    className="border p-2 rounded"
                    type="email"
                    name="email"
                    placeholder="이메일"
                    autoFocus
                    maxLength={30}
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
                    type="submit">
                    로그인
                </button>
            </form>
            <Link href="/auth/signup" className="text-xs text-gray-600">
                회원이 아니신가요?
            </Link>
        </div>
    );
}