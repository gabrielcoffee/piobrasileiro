import { Suspense } from "react";
import ResetPasswordForm from "@/components/admin/ResetPasswordForm";

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}