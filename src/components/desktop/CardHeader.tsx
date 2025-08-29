import { ReactNode } from "react";
import styles from "./styles/CardHeader.module.css";
import { PanelLeft } from "lucide-react";

interface CardHeaderProps {
    title: ReactNode;
    breadcrumb: string[];
    backButton?: boolean;
}

export default function CardHeader({ title, breadcrumb, backButton = false }: CardHeaderProps) {
    return (
        <div className={styles.cardHeader}>
            <strong>{title}</strong>
            <div className={styles.breadcrumb}>
            <PanelLeft size={20} />
            {breadcrumb.map((item, index) => {
                return (
                    <div key={index} className={styles.breadcrumbItem}>
                        {index < breadcrumb.length - 1 ? item : <strong className={styles.lastItem}>{item}</strong>}
                        {index < breadcrumb.length - 1 && <strong>{">"}</strong>}
                    </div>
                )
            })}
            </div>
        </div>
    )
}