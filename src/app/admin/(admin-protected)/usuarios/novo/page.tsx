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


export default function UsuarioPage() {    
    const { id } = useParams();
    const [usuario, setUsuario] = useState<any>(null);
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
    const [avatar, setAvatar] = useState<string | null>(null);

    const saveUserData = async () => {
        try {
            const result = await queryApi('POST', `/admin/users`, {
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
                router.push('/admin/usuarios');
            } else {
                console.error('Erro ao atualizar dados do usuário:', result.error);
            }
        } catch (error) {
            console.error('Erro ao atualizar dados do usuário:', error);
        }
    };

    useEffect(() => {
        console.log(nomeCompleto, genero, funcao, email, numDocumento, tipoDocumento, tipoUsuario, observacoes);
    }, [nomeCompleto, genero, funcao, email, numDocumento, tipoDocumento, tipoUsuario, observacoes]);

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
                                value={numDocumento.length > 11 ? numDocumento.slice(0, 11) : numDocumento}
                                onChange={(e) => setNumDocumento(e.target.value.length > 11 ? e.target.value.slice(0, 11) : e.target.value)}
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
                            available={nomeCompleto && genero  ? true : false}
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