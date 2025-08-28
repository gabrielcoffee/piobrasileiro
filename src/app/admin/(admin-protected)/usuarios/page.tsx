"use client"

import Card from "@/components/desktop/Card";
import CardHeader from "@/components/desktop/CardHeader";
import styles from "./page.module.css";
import { Button } from "@/components/ui/Button";
import { EllipsisVertical, Filter, FlipVertical, PencilLine, Plus, PowerOff, Trash2 } from "lucide-react";
import Table from "@/components/admin/Table";
import SearchSection from "@/components/admin/SearchSection";
import { useEffect, useState } from "react";
import { convertBufferToBase64, getDateString, normalizeDateString, queryApi } from "@/lib/utils";
import Modal from "@/components/admin/Modal";

export default function UsuariosPage() {

    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [isExcluirModalOpen, setIsExcluirModalOpen] = useState(false);
    const [canShowExcluirButtons, setCanShowExcluirButtons] = useState(false);

    const acoes = (id: string) => {
        return (
            <div className={styles.acoes}>
                <PowerOff size={20} onClick={() => inativar([id])} style={{cursor: 'pointer'}} />
                <PencilLine size={20} onClick={() => editar(id)} style={{cursor: 'pointer'}} />
            </div>
        );
    }

    const fetchUsuarios = async () => {
        const response = await queryApi('GET', '/admin/users');

        if (!response.success) {
            console.log('Failed to fetch usuarios', response.error);
            return;
        }

        const users = response.data.map((user: any) => {
            const avatar = user.avatar_image_data ? convertBufferToBase64(user.avatar_image_data) : '/user.png';
            return {
                ...user,
                nome_completo:  <span className={styles.nomeCompleto}><img src={avatar} alt="Avatar" className={styles.avatar} />{user.nome_completo} </span>,
                data_nasc: user.data_nasc ? getDateString(user.data_nasc) : null,
                avatar: avatar,
                acao: acoes(user.user_id)
            }
        })

        setUsuarios(users);
    }

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const inativar = (id: string[]) => {
        const selectedUsers = usuarios.filter((user) => user.selected);
    }

    const excluir = (id: string[]) => {
        const selectedUsers = usuarios.filter((user) => user.selected);
    }

    const editar = (id: string) => {
        console.log(id);
    }

    return (
        <>
        <div className={styles.container}>
            <Card>
                <CardHeader title="Lista de usuários" breadcrumb={["Início", "Usuários"]} />

                <SearchSection
                    searchPlaceholder="Pesquise por nome"
                    dateSection={false}
                    buttons={[
                        <Button key="filter" variant="full-white" iconLeft={<Filter size={24} />}>Filtrar</Button>,
                        <Button visible={canShowExcluirButtons} key="powerOff" variant="full-white" style={{color:'var(--color-error)'}} iconLeft={<PowerOff size={24} />}>Inativar</Button>,
                        <Button visible={canShowExcluirButtons} key="trash" variant="full-white" style={{color:'var(--color-error)'}} iconLeft={<Trash2 size={24} />} onClick={() => setIsExcluirModalOpen(true)}>Excluir</Button>,
                        <Button key="plus" variant="full"  iconLeft={<Plus size={24} />}>Novo usuário</Button>
                    ]}
                />

                <Table
                    headerItems={[
                        { key: "nome_completo", label: "Nome" },
                        { key: "tipo_usuario", label: "Tipo de usuário" },
                        { key: "funcao", label: "Função" },
                        { key: "data_nasc", label: "Nascimento" },
                        { key: "email", label: "Email" },
                        { key: "acao", label: "Ação" },
                    ]}
                    rowItems={usuarios}
                    itemsPerPage={8}
                    hasSelector={true}
                    onSelectionChange={(selectedRows) => {
                        console.log(selectedRows);
                    }}
                />
                
            </Card>

        </div>
        <Modal
            title="Tem certeza que deseja excluir o(s) usuário(s)?"
            subtitle="Esta ação é irreversível e resultará na exclusão permanente de todo o histórico deste usuário."
            onClose={() => {}}
            isOpen={isExcluirModalOpen}
            buttons={
                <>
                <Button variant="full-white" style={{color: 'var(--color-error)', borderColor: 'var(--color-error)'}} onClick={() => setIsExcluirModalOpen(false)}>Cancelar</Button>
                <Button variant="full" style={{backgroundColor: 'var(--color-error)', border: '1px solid var(--color-error)'}} onClick={() => {}}>Sim, tenho certeza</Button>
                </>
            }
            >
        </Modal>
        </>
    )
}