"use client";

function FormField() {

}

export default function SignUp() {
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }

    return (
        <div className="flex flex-col items-center gap-6 overflow-y-hidden pt-20">
            <span className="text-4xl font-bold text-center max-w-sm gap-6">회원가입</span>
            <form
                className="flex flex-col border p-10 rounded w-full border-gray-300 gap-8 max-w-2/3"
                onSubmit={onSubmit}
            >
                <FormField
                    title="이메일"
                    type="email"
                    paramName="email"
                    placeholder="이메일을 입력해주세요"
                    maxLength={50}
                />
                <FormField
                    title="이름"
                    type="text"
                    paramName="username"
                    placeholder="이름을 입력해주세요"
                    maxLength={30}
                />
                <FormField
                    title="비밀번호"
                    type="password"
                    paramName="password"
                    placeholder="비밀번호를 입력해주세요"
                    maxLength={60}
                />
                <FormField
                    title="비밀번호 확인"
                    type="password"
                    paramName="password_confirmation"
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
