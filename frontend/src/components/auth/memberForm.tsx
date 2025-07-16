export const checkElement = (input: HTMLInputElement, field: string) => {
    input.value = input.value.trim();

    if (input.value.length < 2) {
        alert(`${field}은(는) 2자 이상 입력해주세요.`);
        input.focus();
        return true;
    }

    return false;
}

export const checkSpace = (input: HTMLInputElement, field: string) => {
    checkElement(input, field);

    if (input.value.includes(" ")) {
        alert(`${field}에 띄어쓰기를 쓸 수 없습니다.`);
        input.focus();
        return true;
    }

    return false;
}

export function MemberFormField ({ title, type, paramName, placeholder, maxLength} : {
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
    );
}