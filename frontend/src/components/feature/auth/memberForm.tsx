import React from "react";

export const checkElement = (input: HTMLInputElement, field: string) => {
    input.value = input.value.trim();

    if (input.value.length < 2) {
        alert(`${field}을(를) 2자 이상 입력해주세요.`);
        input.focus();
        return false;
    }

    return true;
}

export const checkSpace = (input: HTMLInputElement, field: string) => {
    if (checkElement(input, field)) return true;

    if (input.value.includes(" ")) {
        alert(`${field}에 띄어쓰기를 쓸 수 없습니다.`);
        input.focus();
        return true;
    }

    return false;
}

export const checkPassword = (passwordInput : HTMLInputElement, passwordConfirmationInput : HTMLInputElement) => {
    if (passwordInput.value !== passwordConfirmationInput.value) {
        alert("비밀번호가 일치하지 않습니다. 다시 입력해주세요!");
        passwordInput.focus();
        return true;
    }

    return false;
}

export const checkNullableElement = (input: HTMLInputElement, field: string) => {
    // 앞뒤 공백 제거 후, 2자 이상 붙은 공백을 하나로 줄이는 작업
    input.value = input.value.trim()
        .replaceAll(/\s{2,}/g, " ");

    if (input.value.length > 0 && input.value.length < 2) {
        alert(`${field}을(를) 2자 이상 입력해주세요.`);
        input.focus();
        return true;
    }

    return false;
}

export const checkAddress = (baseAddress: HTMLInputElement, extraAddress: HTMLInputElement) => {
    if (baseAddress.value.length == 0 && extraAddress.value.length !== 0) {
        alert("상세주소만 입력하실 수 없습니다.")
        extraAddress.focus();
        return true;
    }

    return false;
}

export const concatAddress = (baseAddress: HTMLInputElement, extraAddress: HTMLInputElement)=> {
    if (extraAddress.value.length > 0) {
        return baseAddress.value.concat(", ", extraAddress.value);
    }

    return baseAddress.value;
}

interface MemberFormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    title: string;
}

export function MemberFormInput({title, ...props}: MemberFormFieldProps) {
    return (
        <div className="flex flex-col gap-1">
            <span className="">{title}</span>
            <input
                className="border p-2 rounded"
                {...props}
            />
        </div>
    );
}