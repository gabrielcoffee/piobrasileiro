'use client'

import { Header } from "@/components/general/Header";
import { Loading } from "@/components/ui/Loading";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useScrollToTop } from "@/lib/useScrollToTop";

export default function ProtectedAdminLayout({ children }: { children: ReactNode}) {
    const { isLoading, isAuthenticated, user } = useAuth();
    const router = useRouter();
    
    // Scroll to top on route changes
    useScrollToTop();

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
        <>
            <Header />
            <div style={{ marginTop: '80px' }}></div>
            {children}
        </>
    )
}