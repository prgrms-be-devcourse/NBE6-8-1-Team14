"use client";

export function FormField ({ title, type, paramName, placeholder, maxLength} : {
    title: string;
    type: string;
    paramName: string;
    placeholder: string;
    maxLength: number;
}) {
    return (
        <div className="flex flex-col gap-1">
            <span className="">{title}</span>
            <input
                className="border p-2 rounded"
                type={type}
                name={paramName}
                placeholder={placeholder}
                autoFocus
                maxLength={maxLength}
            />
        </div>
    )
}

export default function SignUp() {
    const checkElement = (input: HTMLInputElement, field: string) => {
        input.value = input.value.trim();

        if (input.value.length < 2) {
            alert(`${field}은(는) 2자 이상 입력해주세요.`);
            input.focus();
            return true;
        }

        return false;
    }

    const checkSpace = (input: HTMLInputElement, field: string) => {
        checkElement(input, field);

        if (input.value.includes(" ")) {
            alert(`${field}에 띄어쓰기를 쓸 수 없습니다.`)
            input.focus();
            return true;
        }

        return false;
    }
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
            alert("비밀번호가 일치하지 않습니다. 다시 입력해주세요!")
            passwordInput.focus();
            return;
        }

        alert(`가입을 환영합니다. ${usernameInput.value}님!`)
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
