import React from 'react';
import styles from './page.module.css';
import Card from '@/components/desktop/Card';
import CardHeader from '@/components/desktop/CardHeader';
import { Calendar } from '@/components/admin/Calendar';

export default function CalendarioPage() {
    return (
        <div className={styles.container}>
            <Card>
                <CardHeader title="Calendário de refeições" breadcrumb={["Início", "Refeições", "Calendário"]} />

                <Calendar/>
            </Card>
        </div>
    );
}
