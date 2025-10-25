import { Suspense } from "react";
import ResetPasswordForm from "@/components/admin/ResetPasswordForm";
import Splash from "@/components/login/Splash";
import styles from "./page.module.css";

export default function ResetPasswordPage() {
    return (
        <div>
            <div className={styles.mobileContainer}>
                <ResetPasswordForm />
            </div>

            <div className={styles.desktopContainer}>
                <div className={styles.lateralImage}>
                    <Splash />
                </div>
                <div className={styles.contentWrapper}>
                    <ResetPasswordForm />
                </div>
            </div>
        </div>
    );
}