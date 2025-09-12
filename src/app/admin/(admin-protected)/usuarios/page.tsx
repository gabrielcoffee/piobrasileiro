"use client"

import Card from "@/components/desktop/Card";
import CardHeader from "@/components/desktop/CardHeader";
import styles from "./page.module.css";
import { Button } from "@/components/ui/Button";
import { EllipsisVertical, Filter, FlipVertical, PencilLine, Plus, Power, PowerOff, Trash2 } from "lucide-react";
import Table from "@/components/admin/Table";
import SearchSection from "@/components/admin/SearchSection";
import { useEffect, useState } from "react";
import { convertBufferToBase64, getDateString, normalizeDateString, queryApi } from "@/lib/utils";
import Modal from "@/components/admin/Modal";
import { useRouter } from "next/navigation";

export default function UsuariosPage() {

    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [isExcluirModalOpen, setIsExcluirModalOpen] = useState(false);
    const [isInativarModalOpen, setIsInativarModalOpen] = useState(false);
    const [canShowExcluirButtons, setCanShowExcluirButtons] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
    const router = useRouter();

    const acoes = (active: boolean,id: string) => {
        return (
            <div className={styles.acoes}>
                {active ? <Power size={20} style={{cursor: 'pointer'}} onClick={() => toggleActiveUser(id)} /> : <PowerOff size={20} style={{color: 'var(--color-error)', cursor: 'pointer'}} onClick={() => toggleActiveUser(id)} />}
                <PencilLine size={20} onClick={() => editar(id)} style={{cursor: 'pointer'}} />
                <Trash2 size={20} onClick={() => excluir(id)} style={{color: 'var(--color-error)', cursor: 'pointer'}} />
            </div>
        );
    }

    const excluir = (id: string) => {
        setSelectedUsers([{user_id: id}]);
        setIsExcluirModalOpen(true);
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
                acao: acoes(user.active, user.user_id)
            }
        })

        setUsuarios(users);
    }

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const deleteUsers = async () => {

        const result = await queryApi('DELETE', '/admin/users/delete', {
            userIds: selectedUsers.map((user) => user.user_id)
        });

        if (!result.success) {
            console.log('Failed to delete users', result.error);
            return;
        }

        fetchUsuarios();
        setIsExcluirModalOpen(false);
        setCanShowExcluirButtons(false);
    }

    const inactivateUsers = async () => {

        const result = await queryApi('POST', '/admin/users/deactivate', {
            userIds: selectedUsers.map((brocoli) => brocoli.user_id)
        });

        if (!result.success) {
            console.log('Failed to inactivate users', result.error);
        } else {
            console.log('Users inactivated', result.data);
            setSelectedUsers([]);
            fetchUsuarios();
            setIsInativarModalOpen(false);
            setCanShowExcluirButtons(false);
        }
    }

    const toggleActiveUser = async (id: string) => {

        const result = await queryApi('POST', '/admin/users/toggle-active', {
            userId: id
        });

        if (!result.success) {
            console.log('Failed to toggle active user', result.error);
            return;
        }

        if (result.success) {
            console.log('User toggled active');
            fetchUsuarios();
            setSelectedUsers([]);
            setIsInativarModalOpen(false);
            setCanShowExcluirButtons(false);
        }
    }

    const editar = (id: string) => {
        router.push(`/admin/usuarios/${id}`);
    }

    return (
        <div className={styles.container}>
            <Card>
                <CardHeader title="Lista de usuários" breadcrumb={["Início", "Usuários"]} />

                <SearchSection
                    searchPlaceholder="Pesquise por nome"
                    dateSection={false}
                    buttons={[
                        <Button key="filter" variant="full-white" iconLeft={<Filter size={24} />}>Filtrar</Button>,
                        <Button visible={canShowExcluirButtons} key="powerOff" variant="full-white" style={{color:'var(--color-error)'}} iconLeft={<PowerOff size={24} />} onClick={() => setIsInativarModalOpen(true)}>Inativar</Button>,
                        <Button visible={canShowExcluirButtons} key="trash" variant="full-white" style={{color:'var(--color-error)'}} iconLeft={<Trash2 size={24} />} onClick={() => setIsExcluirModalOpen(true)}>Excluir</Button>,
                        <Button key="plus" variant="full" onClick={() => router.push('/admin/usuarios/novo')} iconLeft={<Plus size={24} />}>Novo usuário</Button>
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
                        if (selectedRows.length > 0) {
                            setSelectedUsers(selectedRows);
                            setCanShowExcluirButtons(true);
                        } else {
                            setSelectedUsers([]);
                            setCanShowExcluirButtons(false);
                        }
                    }}
                />
            </Card>

            <Modal
            title="Tem certeza que deseja excluir o(s) usuário(s)?"
            subtitle="Esta ação é irreversível e resultará na exclusão permanente de todo o histórico deste usuário."
            onClose={() => setIsExcluirModalOpen(false)}
            isOpen={isExcluirModalOpen}
            buttons={
                <>
                <Button variant="full-white" style={{color: 'var(--color-error)', borderColor: 'var(--color-error)'}} onClick={() => setIsExcluirModalOpen(false)}>Cancelar</Button>
                <Button variant="full" style={{backgroundColor: 'var(--color-error)', border: '1px solid var(--color-error)'}} onClick={deleteUsers}>Sim, tenho certeza</Button>
                </>
            }
            />

            <Modal
            title="Tem certeza que deseja inativar o(s) usuário(s)?"
            subtitle="O acesso desse(s) usuário(s) ao sistema ficará suspenso até a reativação. Você pode reverter essa ação a qualquer momento."
            onClose={() => setIsInativarModalOpen(false)}
            isOpen={isInativarModalOpen}
            buttons={
                <>
                <Button variant="full-white" style={{color: 'var(--color-error)', borderColor: 'var(--color-error)'}} onClick={() => setIsInativarModalOpen(false)}>Cancelar</Button>
                <Button variant="full" style={{backgroundColor: 'var(--color-error)', border: '1px solid var(--color-error)'}} onClick={inactivateUsers}>Sim, tenho certeza</Button>
                </>
            }
            />
        </div>
        
    )
}