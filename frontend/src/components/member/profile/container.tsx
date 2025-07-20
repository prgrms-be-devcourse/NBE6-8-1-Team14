export interface ProfilePropsBase {
    title: string;
    children?: React.ReactNode;
}

export function MemberFormContainer(
    {title, children, ...props}
    : ProfilePropsBase & React.FormHTMLAttributes<HTMLFormElement>
) {
    return (
        <MemberContainerBase title={title}>
            <form className="flex flex-col border p-10 rounded w-full border-gray-300 gap-8 max-w-2/3" {...props}>
                {children}
            </form>
        </MemberContainerBase>
    );
}

export function MemberContainerBase({title, children} : ProfilePropsBase) {
    return (
        <div className="flex flex-col items-center gap-6 overflow-y-hidden pt-20">
            <span className="text-4xl font-bold text-center max-w-sm gap-6">{title}</span>
            {children}
        </div>
    );
}