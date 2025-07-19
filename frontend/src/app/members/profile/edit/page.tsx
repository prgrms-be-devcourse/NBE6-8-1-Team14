"use client";

import { MemberFormContainer } from "@/components/feature/profile/container";
import {
    checkSpace,
    checkNullableElement,
    concatAddress,
    checkPassword,
    checkAddress
} from "@/components/feature/auth/memberFormValidations";
import { MemberFormInput } from "@/components/feature/auth/memberFormInput";
import { useRouter } from "next/navigation";

export default function ProfileEdit() {
    const router = useRouter();

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.target as HTMLFormElement;

        const emailInput = form.elements.namedItem("email") as HTMLInputElement;
        const nicknameInput = form.elements.namedItem("username") as HTMLInputElement;
        const passwordInput = form.elements.namedItem("password") as HTMLInputElement;
        const passwordConfirmationInput = form.elements.namedItem("password_confirmation") as HTMLInputElement;
        const baseAddressInput = form.elements.namedItem("base_address") as HTMLInputElement;
        const extraAddressInput = form.elements.namedItem("extra_address") as HTMLInputElement;

        if (
            checkSpace(emailInput, "이메일") ||
            checkSpace(nicknameInput, "이름") ||
            checkSpace(passwordInput, "비밀번호") ||
            checkSpace(passwordConfirmationInput, "비밀번호") ||
            checkNullableElement(baseAddressInput, "기본주소") ||
            checkNullableElement(extraAddressInput, "상세주소") ||
            checkPassword(passwordInput, passwordConfirmationInput) ||
            checkAddress(baseAddressInput, extraAddressInput)
        ) return;

        const fullAddress = concatAddress(baseAddressInput, extraAddressInput);

        // api를 호출하여 회원정보 갱신
        // 완료 후 프로파일 설정으로 이동
        router.push("/profile");
    }

    return (
        <MemberFormContainer
            title="회원수정"
            onSubmit={onSubmit}
            noValidate
        >
            <MemberFormInput
                title="이메일"
                type="text"
                name="name"
                defaultValue=""
                disabled
            />
            <MemberFormInput
                title="별명"
                type="text"
                name="name"
                defaultValue=""
                maxLength={30}
            />
            <MemberFormInput
                title="비밀번호"
                type="password"
                name="password"
                defaultValue=""
                maxLength={60}
            />
            <MemberFormInput
                title="비밀번호 확인"
                type="password"
                name="password_confirmation"
                defaultValue=""
                maxLength={60}
            />
            <MemberFormInput
                title="배송주소"
                type="text"
                name="base_address"
                defaultValue=""
                maxLength={75}
            />
            <MemberFormInput
                title="상세주소"
                type="text"
                name="extra_address"
                defaultValue=""
                maxLength={25}
            />
            <div className="flex justify-center">
                <button
                    className="border p-2 rounded px-10 bg-amber-500 cursor-pointer text-white hover:bg-orange-500 transition"
                >
                    수정완료
                </button>
            </div>
        </MemberFormContainer>
    );
}