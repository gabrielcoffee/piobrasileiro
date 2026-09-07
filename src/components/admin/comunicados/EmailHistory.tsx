'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, Eye, XCircle } from 'lucide-react';
import Table from '@/components/admin/Table';
import Modal from '@/components/admin/Modal';
import Tooltip from '@/components/admin/Tooltip';
import { Button } from '@/components/ui/Button';
import { getDateStringAndTime } from '@/lib/utils';
import { EMAIL_TYPE_LABEL, EmailType } from './emailTypes';
import styles from './styles/EmailHistory.module.css';

export interface EmailLogRecipient {
    nome: string;
    email: string;
    ok: boolean;
}

export interface EmailLogEntry {
    id: string;
    tipo: EmailType;
    assunto: string;
    mensagem: string | null;
    para_todos: boolean;
    total: number;
    enviados: number;
    falhas: number;
    destinatarios: EmailLogRecipient[];
    criado_em: string;
    enviado_por_nome: string | null;
}

interface EmailHistoryProps {
    entries: EmailLogEntry[];
    isLoading: boolean;
}

export default function EmailHistory({ entries, isLoading }: EmailHistoryProps) {

    const [detail, setDetail] = useState<EmailLogEntry | null>(null);

    const rows = useMemo(() => entries.map((entry) => ({
        id: entry.id,
        assunto: entry.assunto,
        data: getDateStringAndTime(entry.criado_em),
        tipo: EMAIL_TYPE_LABEL[entry.tipo] ?? entry.tipo,
        destinatarios: entry.para_todos
            ? `Todos (${entry.total})`
            : `${entry.total} selecionado${entry.total === 1 ? '' : 's'}`,
        resultado: (
            <span className={entry.falhas > 0 ? styles.resultWarn : styles.resultOk}>
                {entry.enviados}/{entry.total}
            </span>
        ),
        enviado_por: entry.enviado_por_nome ?? '-',
        acao: (
            <div className={styles.acoes}>
                <Tooltip text="Ver detalhes">
                    <Eye size={20} className={styles.actionButton} onClick={() => setDetail(entry)} />
                </Tooltip>
            </div>
        ),
    })), [entries]);

    return (
        <>
            <Table
                isLoading={isLoading}
                searchKey="assunto"
                rowIdKey="id"
                disableSort={true}
                itemsPerPage={8}
                headerItems={[
                    { key: 'data', label: 'Data' },
                    { key: 'tipo', label: 'Tipo' },
                    { key: 'assunto', label: 'Assunto' },
                    { key: 'destinatarios', label: 'Destinatários' },
                    { key: 'resultado', label: 'Enviados' },
                    { key: 'enviado_por', label: 'Enviado por' },
                    { key: 'acao', label: 'Ação' },
                ]}
                rowItems={rows}
            />

            <Modal
                isOpen={detail !== null}
                onClose={() => setDetail(null)}
                title={detail?.assunto ?? ''}
                subtitle={detail
                    ? `${EMAIL_TYPE_LABEL[detail.tipo] ?? detail.tipo} · enviado por ${detail.enviado_por_nome ?? '-'} em ${getDateStringAndTime(detail.criado_em)}`
                    : ''}
                buttons={<Button variant="full-white" onClick={() => setDetail(null)}>Fechar</Button>}
            >
                {detail && (
                    <div className={styles.detail}>
                        {detail.mensagem && (
                            <div className={styles.detailBlock}>
                                <span className={styles.detailLabel}>Mensagem</span>
                                <p className={styles.message}>{detail.mensagem}</p>
                            </div>
                        )}

                        <div className={styles.detailBlock}>
                            <span className={styles.detailLabel}>
                                Destinatários ({detail.enviados} de {detail.total} enviados
                                {detail.falhas > 0 ? `, ${detail.falhas} falha${detail.falhas === 1 ? '' : 's'}` : ''})
                            </span>
                            <ul className={styles.recipients}>
                                {detail.destinatarios.map((r) => (
                                    <li key={r.email} className={styles.recipient}>
                                        {r.ok
                                            ? <CheckCircle2 size={16} className={styles.okIcon} />
                                            : <XCircle size={16} className={styles.failIcon} />}
                                        <span translate="no" className={styles.recipientName}>{r.nome}</span>
                                        <span translate="no" className={styles.recipientEmail}>{r.email}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
}
