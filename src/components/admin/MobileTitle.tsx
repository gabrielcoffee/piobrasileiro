import styles from "./styles/MobileTitle.module.css";


export default function MobileTitle({ title }: { title: string }) {
    return (
        <div className={styles.container}>
            <span>{title}</span>
        </div>
    )
}