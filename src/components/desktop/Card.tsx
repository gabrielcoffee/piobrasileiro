import { ReactNode } from "react";
import styles from "./styles/Card.module.css";

export default function Card({ children }: { children: ReactNode }) {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                {children}
            </div>
        </div>
    )
}