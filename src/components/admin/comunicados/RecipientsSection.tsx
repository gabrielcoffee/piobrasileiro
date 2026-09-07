'use client';

import { forwardRef, useMemo, useState } from 'react';
import { Users, UserCheck } from 'lucide-react';
import Table, { TableRef } from '@/components/admin/Table';
import SearchSection from '@/components/admin/SearchSection';
import styles from './styles/RecipientsSection.module.css';

export type RecipientsMode = 'all' | 'select';

export interface RecipientUser {
    user_id: string;
    nome_completo: string;
    tipo_usuario: string;
    funcao: string | null;
    email: string;
}

interface RecipientsSectionProps {
    users: RecipientUser[];
    isLoading: boolean;
    mode: RecipientsMode;
    onModeChange: (mode: RecipientsMode) => void;
    /** When true the "todos" option is unavailable (e.g. boas-vindas). */
    selectOnly: boolean;
    selectedCount: number;
    onSelectionChange: (selected: RecipientUser[]) => void;
}

const RecipientsSection = forwardRef<TableRef, RecipientsSectionProps>(({
    users,
    isLoading,
    mode,
    onModeChange,
    selectOnly,
    selectedCount,
    onSelectionChange,
}, ref) => {

    const [searchText, setSearchText] = useState('');

    const rows = useMemo(() => users.map((u) => ({
        user_id: u.user_id,
        nome_completo: u.nome_completo,
        tipo_usuario: u.tipo_usuario === 'admin' ? 'Administrador' : 'Comum',
        funcao: u.funcao ?? '-',
        email: <span className={styles.email} translate="no">{u.email}</span>,
    })), [users]);

    return (
        <div className={styles.container}>
            <div className={styles.modes}>
                <button
                    type="button"
                    className={`${styles.modeButton} ${mode === 'all' ? styles.modeActive : ''}`}
                    disabled={selectOnly}
                    onClick={() => onModeChange('all')}
                    title={selectOnly ? 'Este tipo de e-mail só pode ser enviado para usuários selecionados' : undefined}
                >
                    <Users size={18} />
                    <span>Todos os usuários ativos</span>
                    <span className={styles.count}>{users.length}</span>
                </button>

                <button
                    type="button"
                    className={`${styles.modeButton} ${mode === 'select' ? styles.modeActive : ''}`}
                    onClick={() => onModeChange('select')}
                >
                    <UserCheck size={18} />
                    <span>Selecionar usuários</span>
                    {mode === 'select' && selectedCount > 0 && (
                        <span className={styles.count}>{selectedCount}</span>
                    )}
                </button>
            </div>

            {selectOnly && (
                <p className={styles.hint}>
                    O e-mail de boas-vindas só pode ser enviado para usuários selecionados.
                </p>
            )}

            {mode === 'select' && (
                <div className={styles.tableArea}>
                    <SearchSection
                        searchText={searchText}
                        setSearchText={setSearchText}
                        searchPlaceholder="Pesquise por nome"
                        dateSection={false}
                        buttons={[]}
                    />

                    <Table
                        ref={ref}
                        isLoading={isLoading}
                        searchText={searchText}
                        searchKey="nome_completo"
                        rowIdKey="user_id"
                        hasSelector={true}
                        itemsPerPage={6}
                        headerItems={[
                            { key: 'nome_completo', label: 'Nome' },
                            { key: 'tipo_usuario', label: 'Tipo de usuário' },
                            { key: 'funcao', label: 'Função' },
                            { key: 'email', label: 'Email' },
                        ]}
                        rowItems={rows}
                        onSelectionChange={(selectedRows) => {
                            const ids = new Set(selectedRows.map((r) => String(r.user_id)));
                            onSelectionChange(users.filter((u) => ids.has(u.user_id)));
                        }}
                    />
                </div>
            )}
        </div>
    );
});

RecipientsSection.displayName = 'RecipientsSection';

export default RecipientsSection;
