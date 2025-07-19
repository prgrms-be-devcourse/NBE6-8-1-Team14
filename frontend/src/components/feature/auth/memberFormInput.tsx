import React from "react";

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