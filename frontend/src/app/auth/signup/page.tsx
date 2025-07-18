"use client";

import {checkSpace} from "@/components/feature/auth/memberForm";
import {MemberFormInput} from "@/components/feature/auth/memberForm";

export default function SignUp() {
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.target as HTMLFormElement;

        const emailInput = form.elements.namedItem("email") as HTMLInputElement;
        const usernameInput = form.elements.namedItem("username") as HTMLInputElement;
        const passwordInput = form.elements.namedItem("password") as HTMLInputElement;
        const passwordConfirmationInput = form.elements.namedItem("password_confirmation") as HTMLInputElement;

        if (
            checkSpace(emailInput, "이메일") ||
            checkSpace(usernameInput, "이름") ||
            checkSpace(passwordInput, "비밀번호") ||
            checkSpace(passwordConfirmationInput, "비밀번호")
        ) return;

        if (passwordInput.value !== passwordConfirmationInput.value) {
            alert("비밀번호가 일치하지 않습니다. 다시 입력해주세요!");
            passwordInput.focus();
            return;
        }

        alert(`가입을 환영합니다. ${usernameInput.value}님!`);
    }

    return (
        <div className="flex flex-col items-center gap-6 overflow-y-hidden pt-20">
            <span className="text-4xl font-bold text-center max-w-sm gap-6">회원가입</span>
            <form
                className="flex flex-col border p-10 rounded w-full border-gray-300 gap-8 max-w-2/3"
                onSubmit={onSubmit}
                noValidate
            >
                <MemberFormInput
                    title="이메일"
                    type="email"
                    name="email"
                    placeholder="이메일을 입력해주세요"
                    maxLength={50}
                />
                <MemberFormInput
                    title="이름"
                    type="text"
                    name="username"
                    placeholder="이름을 입력해주세요"
                    maxLength={30}
                />
                <MemberFormInput
                    title="비밀번호"
                    type="password"
                    name="password"
                    placeholder="비밀번호를 입력해주세요"
                    maxLength={60}
                />
                <MemberFormInput
                    title="비밀번호 확인"
                    type="password"
                    name="password_confirmation"
                    placeholder="비밀번호를 다시 입력해주세요"
                    maxLength={60}
                />
                <div className="flex justify-center">
                    <button
                        className="border p-2 rounded px-10 bg-amber-500 cursor-pointer text-white hover:bg-orange-500 transition"
                        type="submit"
                    >
                        가입
                    </button>
                </div>
            </form>
        </div>
    )
}
