'use client';
import Card from "@/components/desktop/Card";
import CardHeader from "@/components/desktop/CardHeader";
import { Check, CheckCheck, SquareArrowLeft, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import styles from "./page.module.css";
import Link from "next/link";
import { queryApi, uploadAvatar, uploadAvatarAdmin } from "@/lib/utils";
import { useEffect, useState } from "react";
import { InputPassword } from "@/components/ui/InputPassword";
import { InputText } from "@/components/ui/InputText";
import { DropdownInput } from "@/components/ui/DropdownInput";
import { Button } from "@/components/ui/Button";
import ProfileImage from "@/components/profile/ProfileImage";
import { InputTextBox } from "@/components/ui/InputTextBox";
import ProfileImageCreating from "@/components/profile/ProfileImageCreating";
import { InputDate } from "@/components/ui/InputDate";


export default function UsuarioPage() {    
    const router = useRouter();
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
    const [avatar, setAvatar] = useState<File | null>(null);
    const [emailUsedError, setEmailUsedError] = useState<boolean>(false);
    const [dataNascError, setDataNascError] = useState<boolean>(false);

    function isEmailValid(email: string) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    const saveUserData = async () => {

        if (!(nomeCompleto && isEmailValid(email))) {
            return;
        }

        try {
            const result = await queryApi('POST', `/admin/users`, {
                nome_completo: nomeCompleto,
                data_nasc: dataNasc ? dataNasc : null,
                genero: genero ? genero : null,
                funcao: funcao ? funcao : null,
                email: email,
                num_documento: numDocumento ? numDocumento : null,
                tipo_documento: tipoDocumento ? tipoDocumento : null,
                tipo_usuario: tipoUsuario ? tipoUsuario : null,
                observacoes: observacoes ? observacoes : null
            });

            if (result.success) {

                const userId = result.data.user.id;

                if (avatar) {
                    await uploadAvatarAdmin(avatar as File, userId as string);
                }

                console.log('Dados do usuário salvos com sucesso');
                router.push('/admin/usuarios?created=true');
            } else {
                if (result.error === "email already used") {
                    setEmailUsedError(true);
                    console.log('E-mail já utilizado');
                } else {
                    console.error('Erro ao salvar dados do usuário:', result.error);
                }
            }
        } catch (error) {
            console.error('Erro ao salvar dados do usuário:', );
        }
    };

    const handleImageSelect = (file: File) => {
        setAvatar(file);
    };

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

                <div className={styles.profileCard}>

                    <span className={styles.Data}>Dados</span>

                    <div className={styles.imageContainer}>
                        <ProfileImageCreating
                            onImageSelect={handleImageSelect} 
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
                                <InputDate
                                    label="Data de nascimento"
                                    value={dataNasc}
                                    onChange={(value) => {
                                        setDataNasc(value);
                                        setDataNascError(false);
                                        if (!value || value === '') {
                                            setDataNascError(true);
                                        }
                                    }}
                                    placeholder="Data de nascimento"
                                    error={dataNascError ? "Data de nascimento inválida" : ""}
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
                                    onChange={(e) => {
                                        setEmailUsedError(false);
                                        setEmail(e.target.value)
                                    }}
                                    placeholder="E-mail"
                                    type="email"
                                    error={emailUsedError ? "E-mail já utilizado" : ""}
                                />
                                <InputText
                                    label="Número do documento"
                                    value={
                                        tipoDocumento === 'cpf' ? (
                                            numDocumento.length > 11 ? numDocumento.slice(0, 11) : numDocumento
                                        ) : (
                                            numDocumento.length > 15 ? numDocumento.slice(0, 15) : numDocumento
                                        )
                                    }
                                    disabled={!tipoDocumento}
                                    onChange={(e) => setNumDocumento(
                                        tipoDocumento === 'cpf' ? 
                                        e.target.value.length > 11 ? e.target.value.slice(0, 11) : e.target.value 
                                        :
                                        e.target.value.length > 15 ? e.target.value.slice(0, 15) : e.target.value)
                                    }
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

                        <div className={styles.passwordWarning}>
                            <span>Por padrão, novos usuários recebem a senha: <strong>Senha@123</strong></span>
                        </div>

                        <div className={styles.userDataSaveButton}>
                            <Button
                                iconLeft={<Check size={20} />}
                                available={nomeCompleto && isEmailValid(email) ? true : false}
                                onClick={saveUserData}
                            >
                                Salvar
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}