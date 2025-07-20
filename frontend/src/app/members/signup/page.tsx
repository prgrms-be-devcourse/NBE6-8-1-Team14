"use client";

import {checkElement, checkSpace, checkPassword} from "@/components/member/memberFormValidations";
import {MemberFormInput} from "@/components/member/memberFormInput";
import {useAuthContext} from "@/hooks/useAuth";
import client from "@/lib/backend/client";
import {useRouter} from "next/navigation";
import {RedirectLayout} from "@/components/common/redirect";
import React, {useState} from "react";
import ConfirmModal from "@/components/modal/ConfirmModal";
import { ApiResponse, SignUpResponse } from "@/types/dev/auth";

export default function SignUpPage() {
    const { isLogin, logIn } = useAuthContext();
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.target as HTMLFormElement;

        const emailInput = form.elements.namedItem("email") as HTMLInputElement;
        const nicknameInput = form.elements.namedItem("nickname") as HTMLInputElement;
        const passwordInput = form.elements.namedItem("password") as HTMLInputElement;
        const passwordConfirmationInput = form.elements.namedItem("password_confirmation") as HTMLInputElement;

        if (
            checkElement(emailInput, "이메일", setModalMessage, setShowModal) ||
            checkSpace(nicknameInput, "닉네임", setModalMessage, setShowModal) ||
            checkSpace(passwordInput, "비밀번호", setModalMessage, setShowModal) ||
            checkSpace(passwordConfirmationInput, "비밀번호", setModalMessage, setShowModal)
        ) return;

        if (checkPassword(passwordInput, passwordConfirmationInput, setModalMessage, setShowModal)) {
            return;
        }

        // TODO: 가입 시 주소 입력은 받지 않으므로 백엔드 수정 요청 필요
        client.POST("/api/auth", {
            body: {
                email: emailInput.value,
                password: passwordInput.value,
                nickname: nicknameInput.value,
                role: "USER" // 회원만 가입 받을 예정
            }
        }).then((res: ApiResponse<SignUpResponse>) => {
                if (res.error) {
                    setModalMessage(`${res.error.message} 다시 시도해주세요.`);
                    setShowModal(true);
                    return;
                }

            setModalMessage(`가입을 환영합니다. ${nicknameInput.value}님!`);
            setShowModal(true);

            logIn(emailInput.value, passwordInput.value, () => {
                router.replace("/");
            })
        }).catch(() => {
            setModalMessage("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
            setShowModal(true);
        })
    }

    if (isLogin) {
        return (
            <RedirectLayout />
        );
    }

    return (
        <>
            <div className="flex flex-col items-center gap-6 overflow-y-hidden pt-20">
                <span className="text-4xl font-bold text-center max-w-sm gap-6">회원가입</span>
                <form
                    className="flex flex-col border p-10 rounded w-full border-gray-300 gap-8 max-w-2/3"
                    onSubmit={handleSignUp}
                >
                    <MemberFormInput
                        title="이메일"
                        type="email"
                        name="email"
                        placeholder="이메일을 입력해주세요"
                        maxLength={50}
                    />
                    <MemberFormInput
                        title="닉네임"
                        type="text"
                        name="nickname"
                        placeholder="닉네임을 입력해주세요"
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
            
            {/* 회원가입 결과 모달 */}
            {showModal && (
                <ConfirmModal
                    message={modalMessage}
                    confirmText="확인"
                    onConfirm={() => setShowModal(false)}
                    onCancel={() => setShowModal(false)}
                />
            )}
        </>
    )
}
