"use client";
import { useEffect, useState } from "react";
import ConfirmModal from "@/components/modal/ConfirmModal";
import { setGlobalExpireHandler } from "@/lib/fetcher";

export default function GlobalAuthExpireHandler() {
    const [showExpireModal, setShowExpireModal] = useState(false);

    useEffect(() => {
        setGlobalExpireHandler(() => {
            setShowExpireModal(true);
        });
    }, []);

    const handleExpireConfirm = () => {
        localStorage.clear();
        setShowExpireModal(false);
        window.location.href = "/members/login";
    };

    return (
        <>
            {showExpireModal && (
                <ConfirmModal
                    message={"로그인이 만료되었습니다.\n다시 로그인해주세요."}
                    confirmText="확인"
                    onConfirm={handleExpireConfirm}
                    onCancel={handleExpireConfirm}
                />
            )}
        </>
    );
} 