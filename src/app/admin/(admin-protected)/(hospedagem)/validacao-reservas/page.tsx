'use client';

import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import Card from '@/components/desktop/Card';
import CardHeader from '@/components/desktop/CardHeader';
import Table from '@/components/admin/Table';
import SearchSection from '@/components/admin/SearchSection';
import Modal from '@/components/admin/Modal';
import { Button } from '@/components/ui/Button';
import { Check, Trash2, FileSearch } from 'lucide-react';
import { getDateString, queryApi } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import MobileTitle from '@/components/admin/MobileTitle';
import Tooltip from '@/components/admin/Tooltip';

export default function ValidacaoReservasPage() {

    const router = useRouter();
    const { showToast } = useToast();

    const [preReservas, setPreReservas] = useState<any[]>([]);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');

    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const validar = (id: string) => {
        router.push(`/admin/reservas/${id}`);
    };

    const excluir = (id: string) => {
        setSelectedId(id);
        setShowDeleteModal(true);
    };

    const acoes = (pr: any) => (
        <div className={styles.acoes}>
            <Button className={styles.actionButton} variant="outline" iconLeft={<FileSearch size={16} />} style={{ width: 'fit-content', paddingLeft: '10px', paddingRight: '10px', fontSize: '0.875rem' }} onClick={() => validar(pr.id)}>Avaliar Validação</Button>
            <Tooltip text="Excluir" color="var(--color-error)" iconLeft={<Trash2 size={20} />}>
                <Trash2 className={styles.actionButton} size={20} style={{ cursor: 'pointer' }} onClick={() => excluir(pr.id)} />
            </Tooltip>
        </div>
    );

    const fetchPreReservas = async () => {
        const result = await queryApi('GET', `/admin/pre-reservas`);
        if (result.success) {
            const rows = (result.data || []).map((pr: any) => ({
                ...pr,
                nome: pr.nome_solicitante,
                data_chegada: getDateString(pr.data_entrada),
                data_saida: getDateString(pr.data_saida),
                acao: acoes(pr),
            }));
            setPreReservas(rows);
        } else {
            console.log('Erro ao buscar pré-reservas', result.error);
        }
    };

    const handleDelete = async () => {
        if (!selectedId) return;
        const result = await queryApi('DELETE', `/admin/pre-reservas/${selectedId}`);
        if (result.success) {
            showToast('Pré-reserva excluída', 'success');
            fetchPreReservas();
        } else {
            showToast('Ops! Algo deu errado. Tente novamente.', 'error');
        }
        setShowDeleteModal(false);
        setSelectedId(null);
    };

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        fetchPreReservas();
    }, []);

    const headerItems = [
        { key: "nome", label: "Nome" },
        { key: "data_chegada", label: "Data de chegada" },
        { key: "data_saida", label: "Data de saída" },
        { key: "acao", label: "Ação" },
    ];

    return (
        <>
        {!isMobile ? (
            <div className={styles.container}>
            <Card>
                <CardHeader title="Validação de reservas" breadcrumb={["Início", "Hospedagem", "Validação de reservas"]} />

                <SearchSection
                    searchText={searchText}
                    setSearchText={setSearchText}
                    dateSection={false}
                    searchPlaceholder="Pesquise por nome"
                    buttons={[]}
                />

                <Table searchText={searchText} searchKey="nome" headerItems={headerItems} rowItems={preReservas} itemsPerPage={9} />
            </Card>
            </div>
        ) : (
            <div className={styles.mobileContainer}>
                <MobileTitle title="Validação de reservas" />

                <SearchSection
                    searchText={searchText}
                    setSearchText={setSearchText}
                    dateSection={false}
                    searchPlaceholder="Pesquise por nome"
                    buttons={[]}
                />

                <Table searchText={searchText} searchKey="nome" headerItems={headerItems} rowItems={preReservas} itemsPerPage={9} />
            </div>
        )}

        <Modal
            title="Excluir pré-reserva"
            subtitle="Esta ação é irreversível e a pré-reserva será removida permanentemente."
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            buttons={
                <>
                    <Button variant="soft-red" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
                    <Button iconLeft={<Check size={20} />} variant="full" style={{ backgroundColor: 'var(--color-error)', border: '1px solid var(--color-error)' }} onClick={handleDelete}>Sim, excluir</Button>
                </>
            }
        >
        </Modal>
        </>
    );
}
