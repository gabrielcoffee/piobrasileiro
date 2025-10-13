'use client'

import { Header } from "@/components/general/Header";
import { Loading } from "@/components/ui/Loading";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useScrollToTop } from "@/lib/useScrollToTop";
import { ToastProvider } from "@/contexts/ToastContext";
import styles from './layout.module.css';

export default function ProtectedAdminLayout({ children }: { children: ReactNode}) {
    const { isLoading, isAuthenticated, user } = useAuth();
    const router = useRouter();
    const [sideBarExpanded, setSideBarExpanded] = useState(true);
    useScrollToTop();

    const handleSideBarExpanded = (expanded: boolean) => {
        setSideBarExpanded(expanded);
    }

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/admin');
        }

        if (user?.role === 'comum') {
            router.push('/home');
        }

    }, [isAuthenticated, router, isLoading]);

    if (isLoading) {
        return <Loading />
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <ToastProvider>
        <Header setSideBarExpanded={handleSideBarExpanded} />
            <div className={styles.marginTop}></div>
            <div className={`${sideBarExpanded ? styles.sideBarExpanded : styles.sideBarCollapsed}`}>
                {children}
            </div>
        </ToastProvider>
    )
}