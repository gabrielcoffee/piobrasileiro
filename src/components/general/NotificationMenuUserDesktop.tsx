"use client";

import NotificationCard from "./NotificationCard";
import styles from "./styles/NotificationMenuAdminDesktop.module.css";
import { useEffect, useState } from "react";

export default function NotificationMenuUserDesktop() {

    const [notifications, setNotifications] = useState<any[]>([]);

    const generateFakeNotifications = () => {
        const now = new Date();
        const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTime = currentHour * 60 + currentMinute; // Convert to minutes for easier comparison
        const sevenPM = 19 * 60; // 19:00 in minutes
        const sixThirtyPM = 18 * 60 + 30; // 18:30 in minutes
        
        // Calculate current week number
        const getWeekNumber = (date: Date) => {
            const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
            const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
            return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        };
        
        const currentWeekNumber = getWeekNumber(now);
        
        const fakeNotifications: any[] = [];
        
        // Only show notifications on Sunday (day 0)
        if (currentDay === 0) {
            // Show notification if it's before 7PM
            if (currentTime < sevenPM) {
                fakeNotifications.push({
                    id: 1,
                    date: now.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }).toUpperCase(),
                    time: "00:01",
                    title: `Você já pode agendar suas refeições da semana ${currentWeekNumber}.`,
                    message: "Faça as marcações até às 19h de hoje. Não se esqueça de incluir seus convidados, se houverem.",
                    read: false,
                });
            }
            
            // Show 30-minute warning if it's 30 minutes before 7PM or later (but before 7PM)
            if (currentTime >= sixThirtyPM && currentTime < sevenPM) {
                fakeNotifications.push({
                    id: 3,
                    date: now.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }).toUpperCase(),
                    time: "18:30",
                    title: "Você tem 30 minutos para finalizar suas marcações.",
                    message: "Faça as marcações até às 19h de hoje. Não se esqueça de incluir seus convidados, se houverem.",
                    read: true,
                });
            }
            
            // Show closed notification if it's after 7PM
            if (currentTime >= sevenPM) {
                fakeNotifications.push({
                    id: 5,
                    date: now.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }).toUpperCase(),
                    time: "19:00",
                    title: `Agenda da semana ${currentWeekNumber} fechada.`,
                    message: "Confira aqui suas marcações.",
                    read: true,
                });
            }
        }
        
        return fakeNotifications;
    };

    useEffect(() => {
        const fakeNotifications = generateFakeNotifications();
        setNotifications(fakeNotifications);
    }, []);

    return (
        <>
            <div className={`${styles.notificationMenu}`}>
                {notifications.length === 0 ? (
                    <div className={styles.emptyNotifications}>
                        Nenhuma notificação
                    </div>
                ) : (
                    <ul className={styles.notificationList}>
                        {notifications.map((notification) => (
                            <li key={notification.id} className={styles.notificationItem}>
                                <NotificationCard {...notification}  />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
}