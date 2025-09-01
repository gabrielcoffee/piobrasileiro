"use client"

import { PageTitle } from "@/components/home/PageTitle";
import { UserRound, Check, X, CheckCheck, LogOut } from "lucide-react";
import { InputText } from "@/components/ui/InputText";
import { InputPassword } from "@/components/ui/InputPassword";
import { Button } from "@/components/ui/Button";
import ImageSelector from "@/components/profile/ProfileImage";

import styles from "./page.module.css";
import { queryApi, uploadAvatar } from "@/lib/utils";
import { useEffect, useState } from "react";
import ProfileImage from "@/components/profile/ProfileImage";
import { useAuth } from "@/contexts/AuthContext";


export default function PerfilPage() {

    const { logout } = useAuth();

    const [avatar, setAvatar] = useState<string | null>(null);
    const [fullname, setFullname] = useState<string | undefined>(undefined);
    const [originalName, setOriginalName] = useState<string | undefined>(undefined);
    const [email, setEmail] = useState<string | undefined>(undefined);
    const [showNameButton, setShowNameButton] = useState<boolean>(false);
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [passwordChanged, setPasswordChanged] = useState<boolean>(false);

    const [lengthRequirement, setLengthRequirement] = useState<boolean>(false);
    const [uppercaseRequirement, setUppercaseRequirement] = useState<boolean>(false);
    const [lowercaseRequirement, setLowercaseRequirement] = useState<boolean>(false);
    const [numberRequirement, setNumberRequirement] = useState<boolean>(false);
    const [nameRequirement, setNameRequirement] = useState<boolean>(false);
    const [emailRequirement, setEmailRequirement] = useState<boolean>(false);
    const [passwordRequirements, setPasswordRequirements] = useState<boolean>(false);

    useEffect(() => {
        fetchUserProfileData();
    }, []);

    useEffect(() => {
        if (fullname !== undefined && originalName !== undefined) {
            setShowNameButton(fullname !== originalName);
        }
    }, [fullname, originalName]);

    useEffect(() => {
        if (newPassword.length < 8) {
            setLengthRequirement(false);
        } else {
            setLengthRequirement(true);
        }
        
        if (!newPassword.match(/[A-Z]/)) {
            setUppercaseRequirement(false);
        } else {
            setUppercaseRequirement(true);
        }

        if (!newPassword.match(/[a-z]/)) {
            setLowercaseRequirement(false);
        } else {
            setLowercaseRequirement(true);
        }

        if (!newPassword.match(/[0-9]/)) {
            setNumberRequirement(false);
        } else {
            setNumberRequirement(true);
        }

        if (fullname && newPassword.includes(fullname)) {
            setNameRequirement(false);
        } else {
            setNameRequirement(true);
        }
        
        if (email && newPassword.includes(email)) {
            setEmailRequirement(false);
        } else {
            setEmailRequirement(true);
        }

        if (lengthRequirement && uppercaseRequirement && lowercaseRequirement && numberRequirement && nameRequirement && emailRequirement) {
            setPasswordRequirements(true);
        } else {
            setPasswordRequirements(false);
        }
    }, [newPassword])

    const fetchUserProfileData = async () => {
        const result = await queryApi('GET', '/user/perfil');

        if (result.success) {
            if (result.data.avatar) {
                const bufferData = result.data.avatar.data;
                const base64String = Buffer.from(bufferData).toString('base64');
                setAvatar(base64String);
            }
            
            setFullname(result.data.fullname);
            setOriginalName(result.data.fullname);
            setEmail(result.data.email);
        } else {
            console.error('Erro ao buscar dados do perfil:', result.error);
        }
    }

    const handlePasswordChange = async () => {
        if (!currentPassword || !newPassword) return;

        if (!passwordRequirements) {
            console.log('Senha válida');
            return;
        }

        try {
            const result = await queryApi('PUT', '/user/perfil/senha', {
                oldPassword: currentPassword,
                newPassword: newPassword
            });

            if (result.success) {
                console.log('Senha alterada com sucesso');
                setPasswordChanged(true);
                setCurrentPassword('');
                setNewPassword('');
            } else {
                console.error('Erro ao alterar senha:', result.error);
            }
        } catch (error) {
            console.error('Erro ao alterar senha:', error);
        }
    };

    const isPasswordFormValid = currentPassword.length > 0 && newPassword.length > 0;

    const handleNameChange = async () => {
        if (!fullname || fullname === originalName) return;
        
        try {
            const result = await queryApi('PUT', '/user/perfil/nome', {
                nome_completo: fullname
            });

            if (result.success) {
                console.log('Nome alterado com sucesso');
                setOriginalName(fullname);
                setShowNameButton(false);
            } else {
                console.error('Erro ao alterar nome:', result.error);
            }
        } catch (error) {
            console.error('Erro ao alterar nome:', error);
        }
    };

    const handleAvatarChange = async (imageFile: File) => {
        // This is where the avatar is updated, returns the base64 string
        const newAvatar = await uploadAvatar(imageFile);
        setAvatar(newAvatar || null);
    }

    return (
        <div className={styles.container}>
                <div className={styles.section}>
                    <PageTitle
                        icon={<UserRound size={24} />}
                        title="Perfil"
                        text={<></>}
                    />
                </div>
                
                <div className={styles.inputsContainer}>

                    <ProfileImage 
                        uploadAvatar={handleAvatarChange}
                        avatarImage={avatar}
                    />

                    <InputText 
                        label="Nome Completo:" 
                        value={fullname} 
                        placeholder="Insira seu nome completo"
                        onChange={(e) => setFullname(e.target.value)}
                    />

                    {showNameButton && (
                        <Button 
                            onClick={handleNameChange}
                            available={true}
                            variant="full"
                        >
                            <Check size={20} />
                            Salvar alteração
                        </Button>
                    )}

                    <InputText
                        label="E-mail:"
                        disabled={true}
                        value={email}
                        placeholder="Insira seu email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <h3 className={styles.passwordTitle}>
                    {passwordChanged ? "Senha alterada com sucesso" : "Alterar senha"}
                </h3>


                <div className={styles.passwordSection}>
                    <InputPassword
                        label="Senha atual"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Insira sua senha atual"
                    />

                    <InputPassword
                        label="Nova senha"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Insira sua nova senha"
                    />

                    <div className={styles.passwordRequirements}>
                        <p>Sua senha deve conter:</p>
                        <ul className={styles.passwordRequirementsList}>
                            <li>{lengthRequirement ? <CheckCheck size={16} color="var(--color-primary)" /> : <X size={16} color="var(--color-error)" />}Pelo menos 8 caracteres </li>
                            <li>{uppercaseRequirement ? <CheckCheck size={16} color="var(--color-primary)" /> : <X size={16} color="var(--color-error)" />}Pelo menos 1 letra maiúscula </li>
                            <li>{lowercaseRequirement ? <CheckCheck size={16} color="var(--color-primary)" /> : <X size={16} color="var(--color-error)" />}Pelo menos 1 letra minúscula </li>
                            <li>{numberRequirement ? <CheckCheck size={16} color="var(--color-primary)" /> : <X size={16} color="var(--color-error)" />}Pelo menos 1 número </li>
                            <li>{nameRequirement ? <CheckCheck size={16} color="var(--color-primary)" /> : <X size={16} color="var(--color-error)" />}Não deve conter seu nome ou data de nascimento </li>
                        </ul>
                    </div>

                    <Button 
                        onClick={handlePasswordChange}
                        available={isPasswordFormValid}
                        variant="full"
                    >
                        <Check size={20} />
                        Salvar alteração
                    </Button>

                    <Button
                        onClick={logout}
                        variant="text"
                        iconLeft={<LogOut size={20} color="var(--color-error)" />}
                        className={styles.logoutButton}
                    >
                        Sair da conta
                    </Button>
                </div>

        </div>
    )
}