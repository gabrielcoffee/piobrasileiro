'use client'

import { Footer } from "@/components/general/Footer";
import { Header } from "@/components/general/Header";
import { Loading } from "@/components/ui/Loading";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function ProtectedAdminLayout({ children }: { children: ReactNode}) {
    const { isLoading, isAuthenticated, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated && user?.role !== 'admin') {
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, router, user]);

    if (isLoading) {
        return <Loading />
    }

    if (!isAuthenticated || user?.role !== 'admin') {
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