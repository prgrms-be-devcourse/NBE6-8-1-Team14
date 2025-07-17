"use client";

import {MemberFormContainer} from "@/components/feature/profile/container";
import {MemberFormInput} from "@/components/feature/auth/memberForm";
import {useRouter} from "next/navigation";

export default function Profile() {
    const router = useRouter();

    const toProfileEdit = () => {
        router.push("/profile/edit");
    }

    return (
        <MemberFormContainer title="회원정보">
            <MemberFormInput
                title="이메일"
                type="text"
                name="name"
                defaultValue=""
                disabled
            />
            <MemberFormInput
                title="이름"
                type="text"
                name="name"
                defaultValue=""
                disabled
            />
            <MemberFormInput
                title="가입일"
                type="text"
                name="name"
                defaultValue=""
                disabled
            />
            <MemberFormInput
                title="배송주소"
                type="text"
                name="name"
                defaultValue=""
                disabled
            />
            <MemberFormInput
                title="상세주소"
                type="text"
                name="name"
                defaultValue=""
                disabled
            />
            <div className="flex justify-center">
                <button
                    className="border p-2 rounded px-10 bg-amber-500 cursor-pointer text-white hover:bg-orange-500 transition"
                    onClick={toProfileEdit}
                >
                    가입정보 수정
                </button>
            </div>
        </MemberFormContainer>
    );
}