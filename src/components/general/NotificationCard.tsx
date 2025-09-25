import { Bell } from "lucide-react";
import styles from "./styles/NotificationCard.module.css";

interface NotificationCardProps {
    date: string;
    time: string;
    title: string;
    message: string;
    read: boolean;
}

export default function NotificationCard({ date, time, title, message, read }: NotificationCardProps) {
    return (
        <div className={`${styles.notificationCard} ${read ? styles.contentRead : styles.contentNew}`}>
            <Bell 
                size={28} 
                className={`${styles.bellIcon} ${read ? styles.bellIconRead : styles.bellIconNew}`}
            />
            <div className={styles.content}>
                <span className={styles.dateTime}>{date} {time}</span>
                <span className={styles.title}>{title}</span>
                <span className={styles.message}>{message}</span>
            </div>
        </div>
    );
}