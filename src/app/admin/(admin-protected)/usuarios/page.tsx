"use client"

import Card from "@/components/desktop/Card";
import CardHeader from "@/components/desktop/CardHeader";
import styles from "./page.module.css";
import { Button } from "@/components/ui/Button";
import { EllipsisVertical, Filter, FlipVertical, PencilLine, Plus, Power, PowerOff, Trash2 } from "lucide-react";
import Table from "@/components/admin/Table";
import SearchSection from "@/components/admin/SearchSection";
import { useEffect, useState } from "react";
import { convertBufferToBase64, getDateString, getInitials, queryApi } from "@/lib/utils";
import Modal from "@/components/admin/Modal";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { DropdownInput } from "@/components/ui/DropdownInput";
import MobileTitle from "@/components/admin/MobileTitle";
import SaveFooterAdmin from "@/components/admin/SaveFooterAdmin";
import { useToast } from "@/contexts/ToastContext";

export default function UsuariosPage() {

    const { showToast } = useToast();
    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [isExcluirModalOpen, setIsExcluirModalOpen] = useState(false);
    const [isInativarModalOpen, setIsInativarModalOpen] = useState(false);
    const [canShowExcluirButtons, setCanShowExcluirButtons] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
    const [searchText, setSearchText] = useState<string>('');
    const [showExcluirInfoId, setShowExcluirInfoId] = useState<string | null>(null);
    const [showSearchInput, setShowSearchInput] = useState<boolean>(true);

    const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
    const [filterTipoUsuario, setFilterTipoUsuario] = useState<string>('');
    const [filters, setFilters] = useState<{ key: string, value: string | boolean | number }[]>([]);

    const router = useRouter();

    // Close excluir popover on outside click
    useEffect(() => {
        if (!showExcluirInfoId) return;

        const handleDocumentClick = (event: MouseEvent) => {
            const target = event.target as Node;

            const popovers = Array.from(document.querySelectorAll(`.${styles.excluirInfo}`));
            const actionCells = Array.from(document.querySelectorAll(`.${styles.acoes}`));

            const clickedInsidePopover = popovers.some((el) => el.contains(target));
            const clickedInsideActions = actionCells.some((el) => el.contains(target));

            if (!clickedInsidePopover && !clickedInsideActions) {
                setShowExcluirInfoId(null);
            }
        };

        document.addEventListener('mousedown', handleDocumentClick);
        return () => {
            document.removeEventListener('mousedown', handleDocumentClick);
        };
    }, [showExcluirInfoId]);

    // Render helpers
    const renderActionCell = (active: boolean, id: string) => (
        <>
            <div className={styles.acoes}>
                {active ? (
                    <PowerOff
                        size={20}
                        className={styles.actionButton}
                        onClick={() => {
                            setSelectedUsers([{ user_id: id }]);
                            setIsInativarModalOpen(true);
                        }}
                    />
                ) : (
                    <Power
                        size={20}
                        className={styles.actionButton}
                        onClick={() => toggleActiveUser(id)}
                    />
                )}

                <PencilLine size={20} onClick={() => editar(id)} className={styles.actionButton} />
                <EllipsisVertical size={20} onClick={() => setShowExcluirInfoId(id)} className={styles.actionButton} />
            </div>

            {showExcluirInfoId === id && (
                <div id={id} className={styles.excluirInfo} onClick={() => excluir(id)} style={{ cursor: 'pointer' }}>
                    <Trash2 size={20} style={{ color: 'var(--color-error)' }} />
                    <span>Excluir</span>
                </div>
            )}
        </>
    );

    const excluir = (id: string) => {
        setSelectedUsers([{user_id: id}]);
        setShowExcluirInfoId(null);
        setIsExcluirModalOpen(true);
    }

    const fetchUsuarios = async () => {
        const response = await queryApi('GET', '/admin/users');

        if (!response.success) {
            console.log('Failed to fetch usuarios', response.error);
            return;
        }

        const users = response.data.map((user: any) => {
            const avatar = user.avatar_image_data ? convertBufferToBase64(user.avatar_image_data) : null;
            return {
                user_id: user.user_id,
                active: user.active,
                nome_completo: user.nome_completo,
                nome_limpo: user.nome_completo.toLowerCase(),
                tipo_usuario: user.tipo_usuario,
                funcao: user.funcao,
                data_nasc: user.data_nasc ? getDateString(user.data_nasc) : null,
                email: user.email,
                avatar,
            };
        }).sort((a: any, b: any) => {
            return a.nome_limpo.localeCompare(b.nome_limpo);
        });
        setUsuarios(users);
    }

    useEffect(() => {
        fetchUsuarios();
        
        // Check if redirected from user creation
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('created') === 'true') {
            showToast('Usuário adicionado com sucesso', 'success');
            // Clean up URL
            window.history.replaceState({}, '', '/admin/usuarios');
        }
    }, []);

    const deleteUsers = async () => {

        const result = await queryApi('DELETE', '/admin/users/delete', {
            userIds: selectedUsers.map((user) => user.user_id)
        });

        if (!result.success) {
            console.log('Failed to delete users', result.error);
            showToast('Ops! Algo deu errado. Tente novamente.', 'error');
            return;
        }

        fetchUsuarios();
        setIsExcluirModalOpen(false);
        setCanShowExcluirButtons(false);
        setSelectedUsers([]);
        showToast('Usuário removido com sucesso', 'success');
    }

    const inactivateUsers = async () => {

        const result = await queryApi('POST', '/admin/users/deactivate', {
            userIds: selectedUsers.map((user) => user.user_id)
        });

        if (!result.success) {
            console.log('Failed to inactivate users', result.error);
            showToast('Ops! Algo deu errado. Tente novamente.', 'error');
        } else {
            console.log('Users inactivated', result.data);
            setSelectedUsers([]);
            fetchUsuarios();
            setIsInativarModalOpen(false);
            setCanShowExcluirButtons(false);
            showToast('Alterações salvas com sucesso', 'success');
        }
    }

    const toggleActiveUser = async (id: string) => {

        const result = await queryApi('POST', '/admin/users/toggle-active', {
            userId: id
        });

        if (!result.success) {
            console.log('Failed to toggle active user', result.error);
            showToast('Ops! Algo deu errado. Tente novamente.', 'error');
            return;
        }

        if (result.success) {
            console.log('User toggled active');
            fetchUsuarios();
            setSelectedUsers([]);
            setIsInativarModalOpen(false);
            setCanShowExcluirButtons(false);
            showToast('Alterações salvas com sucesso', 'success');
        }
    }

    const editar = (id: string) => {
        router.push(`/admin/usuarios/${id}`);
    }

    const handleOpenFilterModal = () => {
        setShowFilterModal(true);
    }

    const handleFiltrar = () => {
        if (!canFilter()) {
            setFilters([]);
            return;
        }

        setShowFilterModal(false);
        setFilterTipoUsuario(filterTipoUsuario);
        setFilters([{ key: "tipo_usuario", value: filterTipoUsuario }]);
    }

    const clearFilters = () => {
        setFilterTipoUsuario('');
        setSearchText('');
        setFilters([]);
    }

    const canFilter = () => {
        return filterTipoUsuario !== '';
    }

    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
    }, [window.innerWidth]);

    return (
        <>
        {!isMobile ? (
        <div className={styles.desktopContainer}>
            <Card>
                <CardHeader title="Lista de usuários" breadcrumb={["Início", "Usuários"]} />

                <SearchSection
                    searchText={searchText}
                    setSearchText={setSearchText}
                    searchPlaceholder="Pesquise por nome"
                    dateSection={false}
                    shrinkSearch={selectedUsers.length > 0}
                    buttons={[
                        filters.length > 0 ? (
                            <Button 
                            onClick={() => handleOpenFilterModal()} 
                            key="filter" variant="full-white" 
                            style={{backgroundColor: 'var(--color-primary-foreground)', border: '1px solid var(--color-primary)'}} 
                            iconLeft={<Filter size={24} />}>
                                Alterar filtros
                            </Button>
                        ) : (
                            <Button 
                            onClick={() => handleOpenFilterModal()} 
                            key="filter" variant="full-white" 
                            iconLeft={<Filter size={24} />}>
                                Filtrar
                            </Button>
                        ),
                        <Button visible={canShowExcluirButtons} key="powerOff" variant="full-white" style={{color:'var(--color-error)'}} iconLeft={<PowerOff size={24} />} onClick={() => setIsInativarModalOpen(true)}>Inativar</Button>,
                        <Button visible={canShowExcluirButtons} key="trash" variant="full-white" style={{color:'var(--color-error)'}} iconLeft={<Trash2 size={24} />} onClick={() => setIsExcluirModalOpen(true)}>Excluir</Button>,
                        <Button key="plus" variant="full" onClick={() => router.push('/admin/usuarios/novo')} iconLeft={<Plus size={24} />}>Novo usuário</Button>
                    ]}
                />

                <Table
                    filters={filters}
                    searchText={searchText}
                    searchKey="nome_limpo"
                    rowIdKey="user_id"
                    headerItems={[
                        { key: "nome_completo", label: "Nome" },
                        { key: "tipo_usuario", label: "Tipo de usuário" },
                        { key: "funcao", label: "Função" },
                        { key: "data_nasc", label: "Nascimento" },
                        { key: "email", label: "Email" },
                        { key: "acao", label: "Ação" },
                    ]}
                    rowItems={usuarios.map((u) => ({
                        // used for searching but not displayed
                        user_id: u.user_id,
                        nome_limpo: u.nome_limpo,
                        // display cells
                        nome_completo: (
                            <span className={styles.nomeCompleto}>
                                {u.avatar !== null ? (
                                    <img src={u.avatar} alt="Avatar" className={styles.avatar} />
                                ) : (
                                    
                                    <span translate="no" className={styles.avatarInitials}>{getInitials(u.nome_completo)}</span>
                                )}
                                <span translate="no">{u.nome_completo}</span>
                            </span>
                        ),
                        tipo_usuario: u.tipo_usuario,
                        funcao: u.funcao,
                        data_nasc: u.data_nasc,
                        email: u.email,
                        acao: renderActionCell(u.active, u.user_id),
                    }))}
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
        </div>



        ) : ( /* MOBILE VERSION */



            <div className={styles.mobileContainer}>
                <MobileTitle title="Lista de usuários" />

                <SearchSection
                    searchText={searchText}
                    setSearchText={setSearchText}
                    searchPlaceholder="Pesquise por nome"
                    dateSection={false}
                    shrinkSearch={selectedUsers.length > 0}
                    buttons={[
                        filters.length > 0 ? (
                            <Button 
                            onClick={() => handleOpenFilterModal()} 
                            key="filter" variant="full-white" 
                            style={{backgroundColor: 'var(--color-primary-foreground)', border: '1px solid var(--color-primary)'}} 
                            iconLeft={<Filter size={24} />}>
                                Alterar filtros
                            </Button>
                        ) : (
                            <Button 
                            onClick={() => handleOpenFilterModal()} 
                            key="filter" variant="full-white" 
                            iconLeft={<Filter size={24} />}>
                                Filtrar
                            </Button>
                        ),
                        <Button visible={canShowExcluirButtons} key="powerOff" variant="full-white" style={{color:'var(--color-error)'}} iconLeft={<PowerOff size={24} />} onClick={() => setIsInativarModalOpen(true)}>Inativar</Button>,
                        <Button visible={canShowExcluirButtons} key="trash" variant="full-white" style={{color:'var(--color-error)'}} iconLeft={<Trash2 size={24} />} onClick={() => setIsExcluirModalOpen(true)}>Excluir</Button>,
                    ]}
                />

                <Table
                    filters={filters}
                    searchText={searchText}
                    searchKey="nome_limpo"
                    rowIdKey="user_id"
                    headerItems={[
                        { key: "nome_completo", label: "Nome" },
                        { key: "tipo_usuario", label: "Tipo de usuário" },
                        { key: "funcao", label: "Função" },
                        { key: "data_nasc", label: "Nascimento" },
                        { key: "email", label: "Email" },
                        { key: "acao", label: "Ação" },
                    ]}
                    rowItems={usuarios.map((u) => ({
                        // used for searching but not displayed
                        user_id: u.user_id,
                        nome_limpo: u.nome_limpo,
                        // display cells
                        nome_completo: (
                            <span className={styles.nomeCompleto}>
                                {u.avatar !== null ? (
                                    <img src={u.avatar} alt="Avatar" className={styles.avatar} />
                                ) : (
                                    
                                    <span translate="no" className={styles.avatarInitials}>{getInitials(u.nome_completo)}</span>
                                )}
                                <span translate="no">{u.nome_completo}</span>
                            </span>
                        ),
                        tipo_usuario: u.tipo_usuario,
                        funcao: u.funcao,
                        data_nasc: u.data_nasc,
                        email: u.email,
                        acao: renderActionCell(u.active, u.user_id),
                    }))}
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

            <SaveFooterAdmin buttonText="Novo usuário" executeFunction={() => router.push('/admin/usuarios/novo')} />

            </div>
        )}
                
            <Modal
            title="Tem certeza que deseja excluir o(s) usuário(s)?"
            subtitle="Esta ação é irreversível e resultará na exclusão permanente de todo o histórico deste usuário."
            onClose={() => setIsExcluirModalOpen(false)}
            isOpen={isExcluirModalOpen}
            buttons={
                <>
                <Button variant="soft-red" onClick={() => setIsExcluirModalOpen(false)}>Cancelar</Button>
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
                <Button variant="soft-red" onClick={() => setIsInativarModalOpen(false)}>Cancelar</Button>
                <Button variant="full" style={{backgroundColor: 'var(--color-error)', border: '1px solid var(--color-error)'}} onClick={inactivateUsers}>Sim, tenho certeza</Button>
                </>
            }
            />

            <Modal
            title="Filtrar"
            onClose={() => setShowFilterModal(false)}
            isOpen={showFilterModal}
            buttonsLeft={
                <Button available={canFilter()} variant="soft-red" onClick={() => clearFilters()}>Limpar filtros</Button>
            }
            buttons={
                <>
                <Button variant="soft-red" onClick={() => setShowFilterModal(false)}>Cancelar</Button>
                <Button available={filterTipoUsuario !== ''} variant="full" onClick={() => handleFiltrar()}>Filtrar</Button>
                </>
            }
            >
                <div className={styles.filterModalContent}>
                    <DropdownInput
                        variant="white"
                        label="Tipo de usuário"
                        value={filterTipoUsuario}
                        onChange={(value) => setFilterTipoUsuario(value)}
                        options={[
                            { key: "admin", value: "Administrador" },
                            { key: "comum", value: "Comum" }
                        ]}
                        placeholder="Selecione o tipo de usuário"
                    />
                </div>
            </Modal>
        </>
    )
}