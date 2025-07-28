import { X } from "lucide-react";
import NotificationCard from "./NotificationCard";
import styles from "./styles/NotificationMenu.module.css";

interface NotificationMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NotificationMenu({ isOpen, onClose }: NotificationMenuProps) {
    const notifications = [
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