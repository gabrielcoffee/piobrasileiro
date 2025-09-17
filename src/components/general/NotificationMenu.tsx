"use client";

import { X } from "lucide-react";
import NotificationCard from "./NotificationCard";
import styles from "./styles/NotificationMenu.module.css";
import { useEffect, useState } from "react";

interface NotificationMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NotificationMenu({ isOpen, onClose }: NotificationMenuProps) {

    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
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
        
        const fakeNotifications = generateFakeNotifications();
        setNotifications(fakeNotifications);
    }, [])

    const notificationsMock = [
        {
            id: 1,
            date: "6/ABR",
            time: "00:01",
            title: "Você já pode agendar suas refeições da semana 14.",
            message: "Faça as marcações até às 19h de hoje. Não se esqueça de incluir seus convidados, se houverem.",
            read: false,
        },
        {
            id: 2,
            date: "30/MAR",
            time: "19:00",
            title: "Agenda da semana 13 fechada",
            message: "Confira aqui suas marcações.",
            read: true,
        },
        {
            id: 3,
            date: "30/MAR",
            time: "18:30",
            title: "Você tem 30 minutos para finalizar suas marcações.",
            message: "Faça as marcações até às 19h de hoje. Não se esqueça de incluir seus convidados, se houverem.",
            read: true,
        },
        {
            id: 4,  
            date: "30/MAR",
            time: "00:01",
            title: "Você já pode agendar suas refeições da semana 13.",
            message: "Faça as marcações até às 19h de hoje. Não se esqueça de incluir seus convidados, se houverem.",
            read: true,
        },
        {
            id: 5,
            date: "23/MAR",
            time: "19:00",
            title: "Agenda da semana 12 fechada.",
            message: "Confira aqui suas marcações.",
            read: true,
        },
        {
            id: 6,
            date: "23/MAR",
            time: "18:30",
            title: "Você tem 30 minutos para finalizar suas marcações.",
            message: "Faça as marcações até às 19h de hoje. Não se esqueça de incluir seus convidados, se houverem.",
            read: true,
        },
    ];

    return (
        <>
            <div 
                className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
                onClick={onClose}
            />
            <div className={`${styles.notificationMenu} ${isOpen ? styles.notificationMenuOpen : ''}`}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Notificações</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>
                <ul className={styles.notificationList}>
                    {notifications.map((notification) => (
                        <li key={notification.id} className={styles.notificationItem}>
                            <NotificationCard {...notification} />
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}