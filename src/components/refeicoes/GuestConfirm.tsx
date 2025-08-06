import { UserCheck, X } from "lucide-react";
import styles from "./styles/GuestConfirm.module.css";
import { Button } from "../ui/Button";

interface GuestConfirmProps {
    setIsOpen: (isOpen: boolean) => void;
    onClose: () => void;
    date: string;
}

export default function GuestConfirm({ setIsOpen, onClose, date }: GuestConfirmProps) {
    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    {/* Title */}
                    <h2 className={styles.title}>Convidado Incluso</h2>

                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <path d="M16 24.9703L24.486 33.4563L41.454 16.4863M6 24.9703L14.486 33.4563M31.456 16.4863L25 23.0003" stroke="#2A8826" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>

                    {/* Subtext */}
                    <p className={styles.subtitle}>
                        Seu convidado foi adicionado para o almoço de <b>{date}</b> com sucesso.
                    </p>
                </div>

                {/* Inputs */}  
                <div className={styles.form}>

                    <Button
                        onClick={() => {setIsOpen(true)}}
                        variant="outline"
                        iconLeft={<UserCheck size={20} />}
                        className={styles.addAnotherButton}
                    >
                        Adicionar Outro
                    </Button>

                    <Button
                        onClick={() => {
                            onClose();
                        }}
                        variant="full"
                    >
                        Voltar para as marcações
                    </Button>
                </div>
            </div>
        </div>
    )
}