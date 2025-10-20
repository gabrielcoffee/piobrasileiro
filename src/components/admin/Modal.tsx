import { X, ArrowLeft } from 'lucide-react';
import styles from './styles/Modal.module.css';
import { ReactNode, useEffect } from 'react';

interface ModalProps {
    children?: ReactNode;
    buttons?: ReactNode;
    buttonsLeft?: ReactNode;
    title: string;
    subtitle?: string;
    onClose: () => void;
    isOpen: boolean;
    comesFromBottomMobile?: boolean;
}

export default function Modal({ children, buttons, buttonsLeft, title, subtitle, onClose, isOpen, comesFromBottomMobile = false }: ModalProps) {
    
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className={styles.overlay} onClick={onClose}>

            <div 
                className={`${styles.modal} ${comesFromBottomMobile ? styles.modalBottomMobile : ''}`} 
                onClick={(e) => e.stopPropagation()}
            >

                {comesFromBottomMobile && (
                    <div className={styles.mobileTopHeader}>
                        <ArrowLeft className={styles.backButton} size={24} onClick={onClose} />
                    </div>
                )}

                <div className={styles.header}>
                    <h2 className={styles.title}>{title}</h2>
                    {!comesFromBottomMobile && (
                        <X className={styles.closeButton} size={20} onClick={onClose} />
                    )}
                </div>

                <span className={styles.subtitle}>{subtitle}
                    
                </span>
                <div className={styles.content}>
                    {children}
                </div>

                <div className={styles.footer}>

                    <div className={styles.footerButtons}>
                        {buttonsLeft}
                    </div>

                    <div className={styles.footerButtons}>
                        {buttons}
                    </div>
                </div>
            </div>

        </div>
    );
}