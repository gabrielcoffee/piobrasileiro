 'use client'

import styles from "./page.module.css";
import { useAuth } from "@/contexts/AuthContext";
import { Loading } from "@/components/ui/Loading";

export default function HomePage() {
    const { isLoading } = useAuth();

    if (isLoading) {
        return <Loading/>
    }

    return (
        <div className={styles.container}>
            <h1>Admin Home</h1>
        </div>
    )
}