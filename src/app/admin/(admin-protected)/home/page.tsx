 'use client'

import styles from "./page.module.css";
import { useAuth } from "@/contexts/AuthContext";
import { Loading } from "@/components/ui/Loading";
import Card from "@/components/desktop/Card";
import CardHeader from "@/components/desktop/CardHeader";

export default function HomePage() {
    const { isLoading } = useAuth();

    if (isLoading) {
        return <Loading/>
    }

    return (
        <div className={styles.container}>
            <Card>
                <CardHeader title="Início" breadcrumb={["Início", "Dashboards"]} />
            </Card>
        </div>
    )
}