"use client";

import { X } from "lucide-react";
import NotificationCard from "./NotificationCard";
import styles from "./styles/NotificationMenu.module.css";
import { useEffect, useState } from "react";
import { queryApi } from "@/lib/utils";

interface NotificationMenuAdminProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NotificationMenuAdmin({ isOpen, onClose }: NotificationMenuAdminProps) {

    const [notifications, setNotifications] = useState<any[]>([]);

    const formatDate = (isoString: string): string => {
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, '0');
        const monthNames = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 
                           'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
        const month = monthNames[date.getMonth()];
        return `${day}/${month}`;
    };

    const formatTime = (isoString: string): string => {
        const date = new Date(isoString);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const fetchNotifications = async () => {
        const result = await queryApi('GET', '/admin/requests');
        if (result.success) {
            const notifications = convertAllToNotifications(result.data.requests);
            setNotifications(notifications);
        } else {
            setNotifications([]);
            console.error('Erro ao buscar notificações:', result.message);
        }
    }

    const convertAllToNotifications = (requests: any) => {
        return requests.map((request: any) => {
            return {
                id: request.id,
                date: formatDate(request.criado_em),
                time: formatTime(request.criado_em),
                title: "Nova solicitação de reserva!",
                message: "Verifique as informações e entre em contato com o responsável",
                read: request.visualizada === true
            }
        });
    }

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

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

