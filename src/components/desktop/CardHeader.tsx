import { ReactNode } from "react";
import styles from "./styles/CardHeader.module.css";
import { ArrowLeftIcon, ArrowLeftSquare, PanelLeft } from "lucide-react";
import { Button } from "../ui/Button";

interface CardHeaderProps {
    title: ReactNode;
    breadcrumb: string[];
    backButton?: boolean;
    backButtonClick?: () => void;
}

export default function CardHeader({ title, breadcrumb, backButton = false, backButtonClick }: CardHeaderProps) {
    return (
        <div className={styles.cardHeader}>
            {backButton ? (
            <Button
                className={styles.backButton}
                iconLeft={<ArrowLeftSquare/>}
                variant="text"
                align="left"
                onClick={backButtonClick}
            >
                Voltar
            </Button>
            ) : (
                <strong>{title}</strong>
            )}
            
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