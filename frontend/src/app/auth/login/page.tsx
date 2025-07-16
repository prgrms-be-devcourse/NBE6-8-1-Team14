"use client";

export default function Login() {

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center gap-6 px-4">
            <form className="flex flex-col gap-2 w-full max-w-sm" onSubmit={handleSubmit}>
                <input
                    className="border p-2 rounded"
                    type="text"
                    name="username"
                    placeholder="아이디"
                    autoFocus
                    maxLength={30}
                />
                <input
                    className="border p-2 rounded"
                    type="password"
                    name="password"
                    placeholder="비밀번호"
                    maxLength={60}
                />
                <button className="border p-2 rounded bg-amber-500 cursor-pointer text-white hover:bg-orange-500 transition" type="submit">
                    로그인
                </button>
            </form>
        </div>
    );
}