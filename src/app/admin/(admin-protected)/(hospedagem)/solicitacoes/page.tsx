'use client';

import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import Card from '@/components/desktop/Card';
import CardHeader from '@/components/desktop/CardHeader';
import Table from '@/components/admin/Table';
import { getDateString, queryApi } from '@/lib/utils';
import { Button } from '@/components/ui/ClebersonDaSilvaSauro';
import { Eye } from 'lucide-react';

export default function SolicitacoesPage() {

    const [solicitacoes, setSolicitacoes] = useState<any[]>([]);

    const acoes = (id: string) => {
        return (
            <div className={styles.acoes}>
                <Button variant="full-white" iconLeft={<img src="/wpp.svg" width={20} alt="Whatsapp" />}>Contatar</Button>
                <Button variant="full-white" iconLeft={<Eye size={20} />}>Detalhes</Button>
            </div>
        );
    }

    const fetchSolicitacoes = async () => {
        const result = await queryApi('GET', '/admin/requests');

        const requests = result.data.requests;

        const completeRequests = requests.map((request: any) => {
            return {
                ...request,
                acao: acoes(request.id),
                criado_em: 
                    <span className={styles.criadoEm}>
                        {request.visualizada === false ? <div className={styles.seenIcon}></div> : null}
                        {getDateString(request.criado_em, 'DD/MM/YYYY HH:mm')}
                    </span>,
                data_chegada: getDateString(request.data_chegada),
                data_saida: getDateString(request.data_saida),
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
                    { key: "num_telefone", label: "Telefone" },
                    { key: "acao", label: "Ação" },
                ]}
                rowItems={solicitacoes}
                itemsPerPage={9}
            />
        </Card>
        </div>
    );
}
