'use client';
import Card from "@/components/desktop/Card";
import CardHeader from "@/components/desktop/CardHeader";
import { Check, CheckCheck, SquareArrowLeft, X } from "lucide-react";
import { useParams } from "next/navigation";
import styles from "./page.module.css";
import Link from "next/link";
import { queryApi, uploadAvatar, uploadAvatarAdmin } from "@/lib/utils";
import { useEffect, useState } from "react";
import { InputPassword } from "@/components/ui/InputPassword";
import { InputText } from "@/components/ui/InputText";
import { DropdownInput } from "@/components/ui/DropdownInput";
import { Button } from "@/components/ui/ClebersonDaSilvaSauro";
import ProfileImage from "@/components/profile/ProfileImage";
import { InputTextBox } from "@/components/ui/InputTextBox";


export default function UsuarioPage() {    
    const { id } = useParams();
    const [usuario, setUsuario] = useState<any>(null);

    // User data states
    const [nomeCompleto, setNomeCompleto] = useState<string>('');
    const [dataNasc, setDataNasc] = useState<string>('');
    const [genero, setGenero] = useState<string>('');
    const [funcao, setFuncao] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [numDocumento, setNumDocumento] = useState<string>('');
    const [tipoDocumento, setTipoDocumento] = useState<string>('');
    const [tipoUsuario, setTipoUsuario] = useState<string>('');
    const [observacoes, setObservacoes] = useState<string>('');

    // Password states
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [avatar, setAvatar] = useState<string | null>(null);

    const [isPasswordFormValid, setIsPasswordFormValid] = useState<boolean>(false);
    const [lengthRequirement, setLengthRequirement] = useState<boolean>(false);
    const [uppercaseRequirement, setUppercaseRequirement] = useState<boolean>(false);
    const [lowercaseRequirement, setLowercaseRequirement] = useState<boolean>(false);
    const [numberRequirement, setNumberRequirement] = useState<boolean>(false);
    const [nameRequirement, setNameRequirement] = useState<boolean>(false);
    const [emailRequirement, setEmailRequirement] = useState<boolean>(false);
    const [passwordRequirements, setPasswordRequirements] = useState<boolean>(false);
    const [passwordChanged, setPasswordChanged] = useState<boolean>(false);

    useEffect(() => {
        fetchUsuario();
    }, []);

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


        if (!usuario) {
            return;
        }

        if (usuario.nome_completo && newPassword.includes(usuario.nome_completo)) {
            setNameRequirement(false);
        } else {
            setNameRequirement(true);
        }
        
        if (usuario.email && newPassword.includes(usuario.email)) {
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

    const fetchUsuario = async () => {
        const result = await queryApi('GET', `/admin/users/${id}`);

        if (result.success) {
            console.log(result.data);
            setUsuario(result.data);
            
            // Set user data states
            setNomeCompleto(result.data.nome_completo || '');
            setDataNasc(result.data.data_nasc ? new Date(result.data.data_nasc).toISOString().split('T')[0] : '');
            setGenero(result.data.genero || '');
            setFuncao(result.data.funcao || '');
            setEmail(result.data.email || '');
            setNumDocumento(result.data.num_documento || '');
            setTipoDocumento(result.data.tipo_documento || '');
            setTipoUsuario(result.data.tipo_usuario || '');
            setObservacoes(result.data.observacoes || '');
            
            if (result.data.avatar_image_data) {
                const bufferData = result.data.avatar_image_data;
                const base64String = Buffer.from(bufferData).toString('base64');
                setAvatar(base64String);
            }
        } else {
            console.log('Failed to fetch usuario', result.error);
        }
    }

    const saveUserData = async () => {
        try {
            const result = await queryApi('PUT', `/admin/users/${id}`, {
                nome_completo: nomeCompleto,
                data_nasc: dataNasc,
                genero: genero,
                funcao: funcao,
                email: email,
                num_documento: numDocumento,
                tipo_documento: tipoDocumento,
                tipo_usuario: tipoUsuario,
                observacoes: observacoes
            });

            if (result.success) {
                console.log('Dados do usuário atualizados com sucesso');
                fetchUsuario(); // Refresh data
            } else {
                console.error('Erro ao atualizar dados do usuário:', result.error);
            }
        } catch (error) {
            console.error('Erro ao atualizar dados do usuário:', error);
        }
    };

    // Check if any user data has changed
    const hasUserDataChanges = () => {
        if (!usuario) return false;
        
        return (
            nomeCompleto !== usuario.nome_completo ||
            dataNasc !== (usuario.data_nasc ? new Date(usuario.data_nasc).toISOString().split('T')[0] : '') ||
            genero !== usuario.genero ||
            funcao !== usuario.funcao ||
            email !== usuario.email ||
            numDocumento !== usuario.num_documento ||
            tipoDocumento !== usuario.tipo_documento ||
            tipoUsuario !== usuario.tipo_usuario ||
            observacoes !== usuario.observacoes
        );
    };

    const handleAvatarChange = async (imageFile: File) => {
        // This is where the avatar is updated, returns the base64 string
        const newAvatar = await uploadAvatarAdmin(imageFile, id as string);
        setAvatar(newAvatar || null);
    }

    return (
        <div>
            <Card>
                <CardHeader 
                title={
                    <Link href="/admin/usuarios" className={styles.backLink}><SquareArrowLeft size={20} />
                        Voltar para lista
                    </Link>
                }
                breadcrumb={["Início", "Usuários"]} 
                />

                <span className={styles.Data}>Dados</span>

                <div className={styles.imageContainer}>
                    <ProfileImage 
                        uploadAvatar={handleAvatarChange} 
                        avatarImage={avatar} 
                    />
                </div>

                <div className={styles.dataContainer}>
                    <div className={styles.userDataSection}>
                        <div className={styles.leftDataSection}>
                            <InputText
                                label="Nome completo"
                                value={nomeCompleto}
                                onChange={(e) => setNomeCompleto(e.target.value)}
                                placeholder="Nome completo"
                            />
                            <InputText
                                label="Data de nascimento"
                                value={dataNasc}
                                onChange={(e) => setDataNasc(e.target.value)}
                                placeholder="Data de nascimento"
                                type="date"
                            />
                            <DropdownInput
                                label="Tipo de documento"
                                value={tipoDocumento}
                                onChange={(value) => setTipoDocumento(value)}
                                options={[
                                    { key: "cpf", value: "CPF" },
                                    { key: "id_internacional", value: "ID Internacional" }
                                ]}
                                placeholder="Selecione o tipo de documento"
                            />
                            <DropdownInput
                                label="Tipo de usuário"
                                value={tipoUsuario}
                                onChange={(value) => setTipoUsuario(value)}
                                options={[
                                    { key: "admin", value: "Administrador" },
                                    { key: "comum", value: "Comum" }
                                ]}
                                placeholder="Selecione o tipo de usuário"
                            />
                        </div>

                        <div className={styles.rightDataSection}>
                            <DropdownInput
                                label="Gênero"
                                value={genero}
                                onChange={(value) => setGenero(value)}
                                options={[
                                    { key: "m", value: "Masculino" },
                                    { key: "f", value: "Feminino" }
                                ]}
                                placeholder="Selecione o gênero"
                            />
                            <InputText
                                label="E-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="E-mail"
                                type="email"
                            />
                            <InputText
                                label="Número do documento"
                                value={numDocumento}
                                onChange={(e) => setNumDocumento(e.target.value)}
                                placeholder="Número do documento"
                            />
                            <InputText
                                label="Função"
                                value={funcao}
                                onChange={(e) => setFuncao(e.target.value)}
                                placeholder="Função"
                            />
                        </div>
                    </div>

                    <div className={styles.observacoesSection}>
                        <InputTextBox
                            label="Observações sobre restrição alimentar"
                            value={observacoes}
                            onChange={(e) => setObservacoes(e.target.value)}
                            placeholder="Digite observações sobre restrições alimentares..."
                        />
                    </div>

                    <div className={styles.userDataSaveButton}>
                        <Button
                            iconLeft={<Check size={20} />}
                            available={hasUserDataChanges()}
                            onClick={saveUserData}
                        >
                            Salvar alterações
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}