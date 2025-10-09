import { useState } from 'react';
import styles from './styles/SaveFooter.module.css';
import { CircleX, CircleCheck, CheckCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { useRouter } from 'next/navigation';

interface SaveFooterProps {
    onMarkAllMeals: (markAsTrue: boolean) => void;
    onSaveAndSend: () => void;
    hasChanges: boolean;
}

export default function SaveFooter({ onMarkAllMeals, onSaveAndSend, hasChanges }: SaveFooterProps) {
    const [haveSelected, setHaveSelected] = useState(true);

    const router = useRouter();

    const handleMarkAllClick = () => {
        setHaveSelected(!haveSelected);
        onMarkAllMeals?.(haveSelected);
    };

    const handleSaveAndSendClick = () => {  
        onSaveAndSend?.();
    };

    return (
        <div className={styles.container}>
            <Button 
                variant={haveSelected ? "outline" : "soft-red"}
                iconLeft={haveSelected ? <CheckCheck size={20} /> : <CircleX size={20} />}
                onClick={handleMarkAllClick}
                >
                    {haveSelected ? "Marcar todas" : "Desmarcar todas"}
            </Button>
            <Button 
                available={hasChanges}
                variant="full"
                iconLeft={<CircleCheck size={20} />}
                onClick={hasChanges ? handleSaveAndSendClick : undefined}
            >
                Salvar e Enviar
            </Button>
        </div>
    )
}