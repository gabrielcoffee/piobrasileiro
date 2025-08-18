'use client'

import { Footer } from "@/components/general/Footer";
import { Header } from "@/components/general/Header";
import { Loading } from "@/components/ui/Loading";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function ProtectedLayout({ children }: { children: ReactNode}) {
    const { isLoading, isAuthenticated } = useAuth();
    const router = useRouter();

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
        <>
            <Header />
            <div style={{ marginTop: '80px' }}></div>
                {children}
            <Footer />
        </>
    )
}