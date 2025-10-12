"use client"

import { PageTitle } from "@/components/home/PageTitle";
import { UserRound, Check, X, CheckCheck, LogOut } from "lucide-react";
import { InputText } from "@/components/ui/InputText";
import { InputPassword } from "@/components/ui/InputPassword";
import { Button } from "@/components/ui/Button";

import styles from "./page.module.css";
import { queryApi, uploadAvatar } from "@/lib/utils";
import { useEffect, useState } from "react";
import ProfileImage from "@/components/profile/ProfileImage";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import CardHeader from "@/components/desktop/CardHeader";
import Card from "@/components/desktop/Card";
import { useRouter } from "next/navigation";


export default function PerfilPage() {

    const { logout, refreshUser } = useAuth();
    const { showToast } = useToast();

    const router = useRouter();

    const [avatar, setAvatar] = useState<string | null>(null);
    const [fullname, setFullname] = useState<string | undefined>(undefined);
    const [originalName, setOriginalName] = useState<string | undefined>(undefined);
    const [email, setEmail] = useState<string | undefined>(undefined);
    const [showNameButton, setShowNameButton] = useState<boolean>(false);
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [passwordChanged, setPasswordChanged] = useState<boolean>(false);
    const [passwordError, setPasswordError] = useState<string>('');

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
    }, [newPassword, fullname, email, lengthRequirement, uppercaseRequirement, lowercaseRequirement, numberRequirement, nameRequirement, emailRequirement])

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
                setPasswordError('');
                showToast('Senha atualizada com sucesso!', 'success');
            } else {
                if (result.status === 401 && result.error === 'Wrong old password') {
                    setPasswordError('Senha atual incorreta');
                } else {
                    console.error('Erro ao alterar senha:', result.error);
                    showToast('Erro ao atualizar senha', 'error');
                }
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
                await refreshUser(); // Refresh user data in header
                showToast('Nome atualizado com sucesso!', 'success');
            } else {
                console.error('Erro ao alterar nome:', result.error);
                showToast('Erro ao atualizar nome', 'error');
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
        <>
        <div className={styles.mobileContainer}>
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
                <div className={styles.currentPasswordContainer}>
                    <InputPassword
                        label="Senha atual"
                        value={currentPassword}
                        onChange={(e) => {
                            setCurrentPassword(e.target.value);
                            if (passwordError) setPasswordError('');
                        }}
                        placeholder="Insira sua senha atual"
                    />
                    {passwordError && <span className={styles.passwordErrorMessage}>{passwordError}</span>}
                </div>

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
                    className={styles.passwordSaveButton}
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



        {/* DESKTOP */}



        <div className={styles.desktopContainer}>

            <Card>
                <CardHeader backButton={true} backButtonClick={() => router.push('/home')} title="Perfil" breadcrumb={["Início", "Perfil"]} />

                <span className={styles.Data}>Dados</span>

                <div className={styles.imageContainer}>
                    <ProfileImage 
                        uploadAvatar={handleAvatarChange}
                        avatarImage={avatar}
                    />
                </div>
                
                <div className={styles.inputsContainer}>
                    <div className={styles.inputsRow}>
                        <InputText 
                            label="Nome completo" 
                            value={fullname} 
                            placeholder="Insira seu nome completo"
                            onChange={(e) => setFullname(e.target.value)}
                        />

                        <InputText
                            label="E-mail"
                            disabled={true}
                            value={email}
                            placeholder="Insira seu email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {showNameButton && (
                        <Button 
                            onClick={handleNameChange}
                            available={true}
                            variant="full"
                            className={styles.nameSaveButton}
                        >
                            <Check size={20} />
                            Salvar alteração
                        </Button>
                    )}
                </div>

                <h3 className={styles.passwordTitle}>
                    {passwordChanged ? "Senha alterada com sucesso" : "Alterar senha"}
                </h3>

                <div className={styles.passwordSection}>
                    <div className={styles.passwordInputsRow}>
                        <div className={styles.currentPasswordContainer}>
                            <InputPassword
                                label="Senha atual"
                                value={currentPassword}
                                onChange={(e) => {
                                    setCurrentPassword(e.target.value);
                                    if (passwordError) setPasswordError('');
                                }}
                                placeholder="Insira sua senha atual"
                            />
                            {passwordError && <span className={styles.passwordErrorMessage}>{passwordError}</span>}
                        </div>

                        <div className={styles.newPasswordContainer}>
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
                        </div>
                    </div>

                    <div className={styles.saveButtonContainer}>
                        <Button 
                            onClick={handlePasswordChange}
                            available={isPasswordFormValid}
                            variant="full"
                        >
                            <Check size={20} />
                            Salvar alteração
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
        </>
    )
}