import styles from './styles/MeniCard.module.css';

interface MiniCardProps {
    title: string;
    value: string;
    color: 'green' | 'yellow' | 'white';
    button?: React.ReactNode;
}

export default function MiniCard({ title, value, color = 'white', button }: MiniCardProps) {
    return (
        <div className={`${styles.container} ${styles[color]}`}>
            <div className={styles.value}>{value}</div>
            <div className={styles.title}>{title}</div> 
            {button && <div className={styles.button}>{button}</div>}
        </div>
    )
}