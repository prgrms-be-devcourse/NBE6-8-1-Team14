"use client";

import { MemberFormContainer } from "@/components/member/profile/container";
import { MemberFormInput } from "@/components/member/memberFormInput";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/hooks/useAuth";
import client from "@/lib/backend/client";
import { useEffect, useState } from "react";
import { MemberInfoResponseDto } from "@/types/member";
import {
    checkAddress,
    checkNullableElement, checkPassword,
    checkSpace, concatAddress,
    splitAddress,
    SplitAddressResult
} from "@/components/member/memberFormValidations";

export default function Profile() {
    const { isLogin } = useAuthContext();
    const [memberInfo, setMemberInfo] = useState<MemberInfoResponseDto | null>(null);
    const [modifyMode, setModifyMode] = useState<boolean>(false);
    const [address, setAddress] = useState<SplitAddressResult | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (!isLogin) {
            router.replace("/members/login");
            return;
        }

        client.GET("/api/auth/memberInfo").then(res => {
            if (res.error) {
                return
            }

            setMemberInfo(res.data.content);
            
            // memberInfo에서 주소 정보를 가져와서 splitAddress로 분리
            if (res.data.content.address) {
                const splitResult = splitAddress(res.data.content.address);
                setAddress(splitResult);
            } else {
                setAddress({baseAddress: "", extraAddress: ""})
            }
        });
    }, [isLogin, router])

    const toProfileEdit = () => {
        setModifyMode(true);
    }

    if (!isLogin) {
        return <div>로딩중...</div>;
    }

    const handleMemberUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!modifyMode) {
            return;
        }

        const form = e.target as HTMLFormElement;

        const nicknameInput = form.elements.namedItem("nickname") as HTMLInputElement;
        const passwordInput = form.elements.namedItem("password") as HTMLInputElement;
        const passwordConfirmationInput = form.elements.namedItem("password_confirmation") as HTMLInputElement;
        const baseAddressInput = form.elements.namedItem("base_address") as HTMLInputElement;
        const extraAddressInput = form.elements.namedItem("extra_address") as HTMLInputElement;

        if (
            checkSpace(nicknameInput, "닉네임") ||
            checkSpace(passwordInput, "비밀번호") ||
            checkSpace(passwordConfirmationInput, "비밀번호") ||
            checkNullableElement(baseAddressInput, "기본주소") ||
            checkNullableElement(extraAddressInput, "상세주소") ||
            checkPassword(passwordInput, passwordConfirmationInput) ||
            checkAddress(baseAddressInput, extraAddressInput)
        ) return;

        const address = concatAddress(baseAddressInput, extraAddressInput);

        client.PUT("/api/auth/memberInfo", {
            body: {
                password: passwordInput.value,
                address: address,
                nickname: nicknameInput.value,
            }
        }).then(res => {
            if (res.error) {
                alert(res.error.message);
                return;
            }

            alert("회원 정보가 수정되었습니다.")
            setModifyMode(false);
            router.refresh();
        })
    }

    if (!isLogin) {
        return <div>로딩중...</div>;
    }

    return (
        <MemberFormContainer title="회원정보" onSubmit={handleMemberUpdate}>
            <MemberFormInput
                title="이메일"
                type="text"
                name="email"
                defaultValue={memberInfo?.email || ""}
                readOnly
            />
            <MemberFormInput
                title="닉네임"
                type="text"
                name="nickname"
                defaultValue={memberInfo?.nickname || ""}
                readOnly={!modifyMode}
            />
            {!modifyMode &&
                <MemberFormInput
                    title="가입일"
                    type="text"
                    name="createdAt"
                    defaultValue={memberInfo?.createdAt || ""}
                    readOnly
                />
            }
            {modifyMode &&
                <>
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
                </>
            }
            <MemberFormInput
                title="배송주소"
                type="text"
                name="baseAddress"
                defaultValue={address?.baseAddress || ""}
                readOnly={!modifyMode}
                maxLength={40}
            />
            <MemberFormInput
                title="상세주소"
                type="text"
                name="extraAddress"
                defaultValue={address?.extraAddress || ""}
                readOnly={!modifyMode}
                maxLength={58}
            />

            <div className="flex justify-center">
                {!modifyMode && (
                    <div className="flex gap-3">
                        <button
                            className="border p-2 rounded px-10 bg-gray-500 cursor-pointer text-white hover:bg-gray-200 hover:text-black transition"
                            onClick={() => {router.replace("/orders")}}
                        >
                            구매내역
                        </button>
                        <button
                            className="border p-2 rounded px-10 bg-amber-500 cursor-pointer text-white hover:bg-orange-500 transition"
                            onClick={toProfileEdit}
                        >
                            가입정보 수정
                        </button>
                    </div>
                )}
                {modifyMode && (
                    <div className="flex gap-3">
                        <button
                            className="border p-2 rounded px-10 bg-gray-500 cursor-pointer text-white hover:bg-gray-200 hover:text-black transition"
                            onClick={() => setModifyMode(false)}
                        >
                            수정 취소
                        </button>
                        <button
                            className="border p-2 rounded px-10 bg-amber-500 cursor-pointer text-white hover:bg-orange-500 transition"
                            type="submit"
                        >
                            수정 완료
                        </button>
                    </div>
                )}
            </div>
            <div className="flex justify-end text-xs">마지막 수정일 {memberInfo?.editedAt || ""}</div>
        </MemberFormContainer>
    );
}