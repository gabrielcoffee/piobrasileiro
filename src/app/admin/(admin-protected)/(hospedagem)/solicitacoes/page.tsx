'use client';

import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import Card from '@/components/desktop/Card';
import CardHeader from '@/components/desktop/CardHeader';
import Table from '@/components/admin/Table';
import { getDateString, queryApi } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Eye } from 'lucide-react';
import Modal from '@/components/admin/Modal';

export default function SolicitacoesPage() {

    const [solicitacoes, setSolicitacoes] = useState<any[]>([]);
    const [isDetalhesModalOpen, setIsDetalhesModalOpen] = useState<boolean>(false);
    const [selectedSolicitacao, setSelectedSolicitacao] = useState<any>(null);

    const acoes = (request: any) => {
        return (
            <div className={styles.acoes}>
                <Button onClick={() => handleContatar(request.telefone)} variant="full-white" iconLeft={<img src="/wpp.png" width={24} alt="Whatsapp" />}>Contatar</Button>
                <Button onClick={() => handleDetalhes(request)} variant="full-white" iconLeft={<Eye size={20} />}>Detalhes</Button>
            </div>
        );
    }

    const handleContatar = (telefone: string) => {
        window.open(`https://wa.me/${telefone}`, '_blank');
    }

    const handleDetalhes = (solicitacao: any) => {
        setSelectedSolicitacao(solicitacao);
        setIsDetalhesModalOpen(true);
        viewSolicitacao(solicitacao.id);
    }

    const fetchSolicitacoes = async () => {
        const result = await queryApi('GET', '/admin/requests');

        const requests = result.data.requests;

        const completeRequests = requests.map((request: any) => {
            const solicitado_em = getDateString(request.criado_em, 'DD/MM/YYYY HH:mm');
            const data_chegada = getDateString(request.data_chegada);
            const data_saida = getDateString(request.data_saida);

            return {
                ...request,
                acao: acoes({...request, data_chegada, data_saida}),
                criado_em: 
                    <span className={styles.criadoEm}>
                        {request.visualizada === false ? <div className={styles.seenIcon}></div> : null}
                        {solicitado_em}
                    </span>,
                data_chegada: data_chegada,
                data_saida: data_saida,
            }
        });

        if (result.success) {
            setSolicitacoes(completeRequests);
            return;
        }

        if (result.error) {
            console.log(result.error);
            return;
        }
    }

    const viewSolicitacao = async (id: string) => {
        const result = await queryApi('PUT', `/admin/requests/${id}`);

        if (result.success) {
            console.log('Solicitação visualizada com sucesso');
            fetchSolicitacoes();
        } else {
            console.error('Erro ao buscar solicitações:', result.error);
        }
    }

    useEffect(() => {
        fetchSolicitacoes();
    }, []);
    
    return (
        <div className={styles.container}>
        <Card>
            <CardHeader title="Lista de solicitações de reserva" breadcrumb={["Início", "Hospedagem", "Solicitações"]} />

            <Table
                headerItems={[
                    { key: "criado_em", label: "Solicitado em" },
                    { key: "nome", label: "Nome" },
                    { key: "num_pessoas", label: "Qtd" },
                    { key: "data_chegada", label: "Data de chegada" },
                    { key: "data_saida", label: "Data de saída" },
                    { key: "telefone", label: "Telefone" },
                    { key: "acao", label: "Ação" },
                ]}
                rowItems={solicitacoes}
                itemsPerPage={9}
            />
        </Card>

        <Modal
        title="Solicitação de hospedagem"
        onClose={() => setIsDetalhesModalOpen(false)}
        isOpen={isDetalhesModalOpen}
        buttons={
            <>
                <Button variant="soft-red" onClick={() => setIsDetalhesModalOpen(false)}>Fechar</Button>
                <Button variant="full" iconLeft={<img src="/wpp.png" width={24} alt="Whatsapp" />} onClick={() => handleContatar(selectedSolicitacao.telefone)}>Entrar em contato</Button>
            </>
        }
        >
            <div className={styles.detalhesModalContent}>
                <div className={styles.part}>
                    <span className={styles.partTitle}>Nome</span>
                    <span className={styles.partValue}>{selectedSolicitacao?.nome}</span>
                </div>
                <div className={styles.part}>
                    <span className={styles.partTitle}>Número de telefone</span>
                    <span className={styles.partValue}>{selectedSolicitacao?.telefone}</span>
                </div>
                <div className={styles.part}>
                    <span className={styles.partTitle}>E-mail</span>
                    <span className={styles.partValue}>{selectedSolicitacao?.email}</span>
                </div>
                <div className={styles.part}>
                    <span className={styles.partTitle}>Data de início</span>
                    <span className={styles.partValue}>{selectedSolicitacao?.data_chegada}</span>
                </div>
                <div className={styles.part}>
                    <span className={styles.partTitle}>Data de fim</span>
                    <span className={styles.partValue}>{selectedSolicitacao?.data_saida}</span>
                </div>
                <div className={styles.part}>
                    <span className={styles.partTitle}>Quantidade de pessoas</span>
                    <span className={styles.partValue}>{selectedSolicitacao?.num_pessoas}</span>
                </div>
            </div>
        </Modal>
        </div>
    );
}
