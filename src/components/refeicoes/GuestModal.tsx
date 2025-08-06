"use client";
import { useEffect, useState } from "react";
import { InputText } from "../ui/InputText";
import { UserCheck, X } from "lucide-react";
import { Button } from "../ui/Button";
import styles from "./styles/GuestModal.module.css";
import GuestConfirm from "./GuestConfirm";

interface GuestModalProps {
    date: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function GuestModal({ date, isOpen, onClose }: GuestModalProps) {
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [origin, setOrigin] = useState('');

    const [nameError, setNameError] = useState(false);
    const [roleError, setRoleError] = useState(false);
    const [originError, setOriginError] = useState(false);

    const [guestAdded, setGuestAdded] = useState(false);
    const [modalOpen, setModalOpen] = useState(isOpen);

    useEffect(() => {
        if (name.length > 0) {
            setNameError(false);
        }
        if (role.length > 0) {
            setRoleError(false);
        }
        if (origin.length > 0) {
            setOriginError(false);
        }
    }, [name, role, origin]);

    const handleAddGuest = () => {
        if (name.length === 0) {
            setNameError(true);
        }
        if (role.length === 0) {
            setRoleError(true);
        }
        if (origin.length === 0) {
            setOriginError(true);
        }

        if (name.length > 0 && role.length > 0 && origin.length > 0) {
            console.log('add guest');
            setGuestAdded(true);
        }
    }

    const addAnotherGuest = () => {
        setModalOpen(true);
        setGuestAdded(false);
        setName('');
        setRole('');
        setOrigin('');
    }

    if (!modalOpen) return null;

    if (guestAdded) return <GuestConfirm setIsOpen={addAnotherGuest} onClose={() => {setModalOpen(false)}} date={date}/>

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    {/* Title */}
                    <h2 className={styles.title}>Adicionar convidado</h2>

                    {/* Subtext */}
                    <p className={styles.subtitle}>
                        Adicionando convidado para o almoço de {date}
                    </p>

                    <button className={styles.closeButton} onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                {/* Inputs */}  
                <div className={styles.form}>
                    <div className={styles.inputGroup}>
                        <InputText
                            label="*Nome"
                            placeholder="Insira o nome"
                            error={nameError ? "Campo obrigatório" : ""}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <InputText
                            label="*Função"
                            placeholder="Insira a função ou grau de parentesco"
                            error={roleError ? "Campo obrigatório" : ""}
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        />
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <InputText
                            label="*Origem"
                            placeholder="De onde vem?"
                            error={originError ? "Campo obrigatório" : ""}
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                        />
                    </div>

                    <Button
                        onClick={handleAddGuest}
                        available={Boolean(name && role && origin)}
                        className={styles.submitButton}
                        variant="full"
                        iconLeft={<UserCheck size={20} />}
                    >
                        Incluir convidado
                    </Button>
                </div>
            </div>
        </div>
    )
}