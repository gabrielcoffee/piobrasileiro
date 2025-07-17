import { Button } from "../ui/button";
import { ArrowLeftIcon } from "lucide-react";

interface ForgotPasswordViewProps {
    onBackToLogin?: () => void;
    onBackToSplash?: () => void;
}

export default function ForgotPasswordView({ onBackToLogin, onBackToSplash }: ForgotPasswordViewProps) {
    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <Button 
                    onClick={onBackToLogin}
                    style={styles.backButton}
                >
                    <ArrowLeftIcon size={20} />
                    Voltar
                </Button>
            </div>

            <div style={styles.content}>
                <h1 style={styles.title}>Esqueceu sua senha?</h1>
                <p style={styles.subtitle}>
                    Digite seu email para receber um link de redefinição
                </p>

                <div style={styles.form}>
                    <input 
                        type="email" 
                        placeholder="Seu email"
                        style={styles.input}
                    />
                    
                    <Button style={styles.submitButton}>
                        Enviar link de redefinição
                    </Button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column' as const,
        height: '100vh',
        padding: '20px',
    },
    header: {
        display: 'flex',
        justifyContent: 'flex-start',
        marginBottom: '40px',
    },
    backButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#666',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
    },
    content: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        textAlign: 'center' as const,
    },
    title: {
        fontSize: '28px',
        fontWeight: 'bold',
        marginBottom: '16px',
        color: '#333',
    },
    subtitle: {
        fontSize: '16px',
        color: '#666',
        marginBottom: '40px',
        maxWidth: '300px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '20px',
        width: '100%',
        maxWidth: '300px',
    },
    input: {
        padding: '12px 16px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '16px',
        outline: 'none',
    },
    submitButton: {
        padding: '12px 24px',
        backgroundColor: '#267024',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
};
