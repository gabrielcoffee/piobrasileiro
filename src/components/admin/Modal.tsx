import { X } from 'lucide-react';
import styles from './styles/Modal.module.css';
import { ReactNode } from 'react';

interface ModalProps {
    children?: ReactNode;
    buttons: ReactNode;
    title: string;
    subtitle?: string;
    onClose: () => void;
    isOpen: boolean;
}

export default function Modal({ children, buttons, title, subtitle, onClose, isOpen }: ModalProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className={styles.overlay} onClick={onClose}>

            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

                <div className={styles.header}>

                    <h2 className={styles.title}>{title}</h2>
                    <X className={styles.closeButton} size={20} onClick={onClose} />
                </div>

                <span className={styles.subtitle}>{subtitle}
                    
                </span>
                <div className={styles.content}>
                    {children}
                </div>

                <div className={styles.footer}>
                    {buttons}
                </div>
            </div>

        </div>
    );
}