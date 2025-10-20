'use client'
import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import Card from '@/components/desktop/Card';
import CardHeader from '@/components/desktop/CardHeader';
import { Calendar } from '@/components/admin/Calendar';
import MobileTitle from '@/components/admin/MobileTitle';

export default function CalendarioPage() {

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
    }, [window.innerWidth]);

    return (
        <>

        {!isMobile ? (

            <div className={styles.container}>
                <Card>
                    <CardHeader title="Calendário de refeições" breadcrumb={["Início", "Refeições", "Calendário"]} />

                    <Calendar/>
                </Card>
            </div>



        ) : ( /* MOBILE */



            <div className={styles.mobileContainer}>
                <MobileTitle title="Calendário de refeições" />
                <Calendar />
            </div>
        )}

        </>
    );
}
