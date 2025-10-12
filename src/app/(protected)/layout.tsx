'use client'

import { Footer } from "@/components/general/Footer";
import { Header } from "@/components/general/Header";
import { Loading } from "@/components/ui/Loading";
import { useAuth } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useScrollToTop } from "@/lib/useScrollToTop";
import styles from './layout.module.css';

export default function ProtectedLayout({ children }: { children: ReactNode}) {
    const { isLoading, isAuthenticated } = useAuth();
    const [sideBarExpanded, setSideBarExpanded] = useState(true);
    const router = useRouter();

    const handleSideBarExpanded = (expanded: boolean) => {
        setSideBarExpanded(expanded);
    }
    
    // Scroll to top on route changes
    useScrollToTop();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, router]);

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
            <Footer />
        </ToastProvider>
    )
}