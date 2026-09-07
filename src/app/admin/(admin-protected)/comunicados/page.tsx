'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertTriangle, Eye, Send } from 'lucide-react';
import Card from '@/components/desktop/Card';
import CardHeader from '@/components/desktop/CardHeader';
import MobileTitle from '@/components/admin/MobileTitle';
import Modal from '@/components/admin/Modal';
import { TableRef } from '@/components/admin/Table';
import { Button } from '@/components/ui/Button';
import { InputText } from '@/components/ui/InputText';
import { InputTextBox } from '@/components/ui/InputTextBox';
import { useToast } from '@/contexts/ToastContext';
import { queryApi } from '@/lib/utils';
import EmailTypeSelector from '@/components/admin/comunicados/EmailTypeSelector';
import RecipientsSection, { RecipientUser, RecipientsMode } from '@/components/admin/comunicados/RecipientsSection';
import EmailHistory, { EmailLogEntry } from '@/components/admin/comunicados/EmailHistory';
import { EMAIL_TYPES, EmailType, MESSAGE_MAX, SUBJECT_MAX } from '@/components/admin/comunicados/emailTypes';
import styles from './page.module.css';

export default function ComunicadosPage() {

    const { showToast } = useToast();

    // Form
    const [type, setType] = useState<EmailType>('aviso');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [mode, setMode] = useState<RecipientsMode>('all');
    const [selectedUsers, setSelectedUsers] = useState<RecipientUser[]>([]);
    const tableRef = useRef<TableRef>(null);

    // Data
    const [users, setUsers] = useState<RecipientUser[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [history, setHistory] = useState<EmailLogEntry[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);

    // Modals / async
    const [preview, setPreview] = useState<{ subject: string; html: string } | null>(null);
    const [isPreviewLoading, setIsPreviewLoading] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const update = () => setIsMobile(window.innerWidth < 768);
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    const fetchUsers = useCallback(async () => {
        setIsLoadingUsers(true);
        const result = await queryApi('GET', '/admin/users');
        if (!result.success) {
            setIsLoadingUsers(false);
            showToast('Não foi possível carregar a lista de usuários', 'error');
            return;
        }
        type ApiUser = RecipientUser & { active: boolean };
        const active: RecipientUser[] = (result.data as ApiUser[])
            .filter((u) => u.active)
            .map((u) => ({
                user_id: u.user_id,
                nome_completo: u.nome_completo,
                tipo_usuario: u.tipo_usuario,
                funcao: u.funcao,
                email: u.email,
            }))
            .sort((a: RecipientUser, b: RecipientUser) => a.nome_completo.localeCompare(b.nome_completo));
        setUsers(active);
        setIsLoadingUsers(false);
    }, [showToast]);

    const fetchHistory = useCallback(async () => {
        setIsLoadingHistory(true);
        const result = await queryApi('GET', '/admin/emails/history');
        if (!result.success) {
            setIsLoadingHistory(false);
            showToast('Não foi possível carregar o histórico de envios', 'error');
            return;
        }
        setHistory(result.data ?? []);
        setIsLoadingHistory(false);
    }, [showToast]);

    useEffect(() => {
        fetchUsers();
        fetchHistory();
    }, [fetchUsers, fetchHistory]);

    // ----- derived state -----

    const spec = EMAIL_TYPES.find((t) => t.id === type)!;
    const selectOnly = spec.selectOnly === true;

    const handleTypeChange = (next: EmailType) => {
        setType(next);
        const nextSpec = EMAIL_TYPES.find((t) => t.id === next);
        if (nextSpec?.selectOnly) {
            setMode('select');
        }
    };

    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    const contentError = (() => {
        if (type !== 'aviso') return null;
        if (trimmedSubject.length < 3) return 'Informe um assunto com pelo menos 3 caracteres';
        if (trimmedMessage.length < 10) return 'Escreva uma mensagem com pelo menos 10 caracteres';
        return null;
    })();

    const recipientCount = mode === 'all' ? users.length : selectedUsers.length;
    const recipientsError = recipientCount === 0
        ? (mode === 'all' ? 'Não há usuários ativos' : 'Selecione ao menos um usuário')
        : null;

    const canSend = !contentError && !recipientsError && !isSending;

    const contentPayload = {
        type,
        ...(type === 'aviso' ? { subject: trimmedSubject, message: trimmedMessage } : {}),
    };

    // ----- actions -----

    const openPreview = async () => {
        if (contentError) {
            showToast(contentError, 'warning');
            return;
        }
        setIsPreviewLoading(true);
        const result = await queryApi('POST', '/admin/emails/preview', contentPayload);
        setIsPreviewLoading(false);
        if (!result.success) {
            showToast(result.message || 'Não foi possível gerar a pré-visualização', 'error');
            return;
        }
        setPreview(result.data);
    };

    const openConfirm = () => {
        if (contentError) {
            showToast(contentError, 'warning');
            return;
        }
        if (recipientsError) {
            showToast(recipientsError, 'warning');
            return;
        }
        setIsConfirmOpen(true);
    };

    const send = async () => {
        setIsSending(true);
        const result = await queryApi('POST', '/admin/emails/send', {
            ...contentPayload,
            recipients: mode === 'all'
                ? { all: true }
                : { userIds: selectedUsers.map((u) => u.user_id) },
            confirm: true,
        });
        setIsSending(false);
        setIsConfirmOpen(false);

        if (!result.success) {
            showToast(result.message || 'Ops! Algo deu errado. Tente novamente.', 'error');
            return;
        }

        const { sent, failed, total } = result.data;
        if (failed > 0) {
            showToast(`Enviado para ${sent} de ${total} usuário(s). ${failed} falha(s).`, 'warning');
        } else {
            showToast(`E-mail enviado para ${sent} usuário(s)`, 'success');
        }

        setSubject('');
        setMessage('');
        setSelectedUsers([]);
        tableRef.current?.clearSelection();
        fetchHistory();
    };

    const recipientsLabel = mode === 'all'
        ? `todos os ${users.length} usuários ativos`
        : `${selectedUsers.length} usuário${selectedUsers.length === 1 ? '' : 's'} selecionado${selectedUsers.length === 1 ? '' : 's'}`;

    return (
        <div className={styles.page}>
            <Card>
                {isMobile
                    ? <MobileTitle title="Comunicados" />
                    : <CardHeader title="Enviar e-mail" breadcrumb={["Início", "Comunicados"]} />}

                {/* 1. Tipo */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.step}>1</span>
                        <span className={styles.sectionTitle}>Tipo de e-mail</span>
                    </div>

                    <EmailTypeSelector value={type} onChange={handleTypeChange} disabled={isSending} />

                    {type === 'aviso' && (
                        <div className={styles.fields}>
                            <div className={styles.field}>
                                <InputText
                                    label="Assunto"
                                    placeholder="Ex.: Missa de encerramento do semestre"
                                    value={subject}
                                    maxLength={SUBJECT_MAX}
                                    onChange={(e) => setSubject(e.target.value)}
                                />
                                <span className={`${styles.counter} ${subject.length >= SUBJECT_MAX ? styles.counterLimit : ''}`}>
                                    {subject.length}/{SUBJECT_MAX}
                                </span>
                            </div>

                            <div className={styles.field}>
                                <InputTextBox
                                    label="Mensagem"
                                    placeholder="Escreva aqui o comunicado. As quebras de linha são mantidas no e-mail."
                                    value={message}
                                    maxLength={MESSAGE_MAX}
                                    rows={7}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <span className={`${styles.counter} ${message.length >= MESSAGE_MAX ? styles.counterLimit : ''}`}>
                                    {message.length}/{MESSAGE_MAX}
                                </span>
                            </div>
                        </div>
                    )}
                </section>

                {/* 2. Destinatários */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.step}>2</span>
                        <span className={styles.sectionTitle}>Destinatários</span>
                    </div>

                    <RecipientsSection
                        ref={tableRef}
                        users={users}
                        isLoading={isLoadingUsers}
                        mode={mode}
                        onModeChange={setMode}
                        selectOnly={selectOnly}
                        selectedCount={selectedUsers.length}
                        onSelectionChange={setSelectedUsers}
                    />
                </section>

                {/* Ações */}
                <div className={styles.actions}>
                    <span className={styles.summary}>
                        {spec.title} · {recipientsLabel}
                    </span>
                    <Button
                        variant="full-white"
                        iconLeft={<Eye size={20} />}
                        onClick={openPreview}
                        disabled={isPreviewLoading || isSending}
                    >
                        {isPreviewLoading ? 'Gerando...' : 'Pré-visualizar'}
                    </Button>
                    <Button
                        variant="full"
                        iconLeft={<Send size={20} />}
                        onClick={openConfirm}
                        available={canSend}
                        disabled={isSending}
                    >
                        Enviar
                    </Button>
                </div>
            </Card>

            {/* Histórico */}
            <Card>
                {isMobile
                    ? <MobileTitle title="Histórico de envios" />
                    : <CardHeader title="Histórico de envios" breadcrumb={["Início", "Comunicados", "Histórico"]} />}

                <EmailHistory entries={history} isLoading={isLoadingHistory} />
            </Card>

            {/* Pré-visualização */}
            <Modal
                isOpen={preview !== null}
                onClose={() => setPreview(null)}
                title={preview?.subject ?? 'Pré-visualização'}
                subtitle="É assim que o e-mail chega para cada usuário, com o nome dele no lugar do seu."
                wide
                buttons={<Button variant="full-white" onClick={() => setPreview(null)}>Fechar</Button>}
            >
                {preview && (
                    <iframe
                        title="Pré-visualização do e-mail"
                        className={styles.previewFrame}
                        sandbox=""
                        srcDoc={preview.html}
                    />
                )}
            </Modal>

            {/* Confirmação */}
            <Modal
                isOpen={isConfirmOpen}
                onClose={() => !isSending && setIsConfirmOpen(false)}
                title={`Enviar e-mail para ${recipientCount} usuário${recipientCount === 1 ? '' : 's'}?`}
                subtitle="Esta ação não pode ser desfeita."
                buttons={
                    <>
                        <Button variant="soft-red" onClick={() => setIsConfirmOpen(false)} disabled={isSending}>Cancelar</Button>
                        <Button variant="full" iconLeft={<Send size={20} />} onClick={send} disabled={isSending}>
                            {isSending ? 'Enviando...' : 'Sim, enviar'}
                        </Button>
                    </>
                }
            >
                <div className={styles.confirmSummary}>
                    <span><strong>Tipo:</strong> {spec.title}</span>
                    {type === 'aviso' && <span><strong>Assunto:</strong> {trimmedSubject}</span>}
                    <span><strong>Para:</strong> {recipientsLabel}</span>
                </div>

                {spec.warning && (
                    <div className={styles.confirmWarning}>
                        <AlertTriangle size={18} />
                        <span>{spec.warning}</span>
                    </div>
                )}
            </Modal>
        </div>
    );
}
