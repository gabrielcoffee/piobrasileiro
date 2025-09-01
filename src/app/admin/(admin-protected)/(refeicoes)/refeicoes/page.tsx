'use client'

import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import Card from '@/components/desktop/Card';
import CardHeader from '@/components/desktop/CardHeader';
import Table from '@/components/admin/Table';
import SearchSection from '@/components/admin/SearchSection';
import { PencilLine, Plus, Printer, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { convertBufferToBase64, getDateString, queryApi } from '@/lib/utils';

export default function ListaDeRefeicoesPage() {

    const [refeicoes, setRefeicoes] = useState([]);

    useEffect(() => {
        fetchRefeicoes();
    }, []);

    const editar = (id: string) => {
        return;
    }

    const acoes = (id: string) => {
        return (
            <div className={styles.acoes}>
                <PencilLine size={20} onClick={() => editar(id)} style={{color: 'var(--color-primary)', cursor: 'pointer'}} />
            </div>
        )
    }

    function getAlmocoText(almoco_colegio: boolean, almoco_levar: boolean) {
        if (almoco_colegio) {
            if (almoco_levar) {
                return 'Para Levar';
            } else {
                return 'No Colégio Pio';
            }
        } else {
            return <X style={{color: 'var(--color-error)'}} />
        }
    }

    function getTipoUsuarioText(tipo_pessoa: string) {
        if (tipo_pessoa === 'usuario') {
            return 'Comum';
        } else if (tipo_pessoa === 'hospede') {
            return 'Hóspede';
        } else if (tipo_pessoa === 'convidado') {
            return 'Convidado';
        }
        return 'Comum';
    }

    const fetchRefeicoes = async () => {
        const result = await queryApi('GET', '/admin/meals');

        if (result.success) {

            const meals = result.data.meals.map((meal: any) => {
                const avatar = meal.avatar_image_data ? convertBufferToBase64(meal.avatar_image_data) : '/user.png';
                
                return {
                    ...meal,
                    nome: <span className={styles.nomeCompleto}><img src={avatar} alt="Avatar" className={styles.avatar} />{meal.nome} </span>,
                    almoco: getAlmocoText(meal.almoco_colegio, meal.almoco_levar),
                    tipo_usuario: getTipoUsuarioText(meal.tipo_pessoa),
                    jantar: meal.janta_colegio ? 'No Colégio PIO' : <X style={{color: 'var(--color-error)'}} />,
                    data: getDateString(meal.data),
                    acao: acoes(meal.id),
                }
          
            });

            setRefeicoes(meals);
        } else {
            console.log('Erro ao buscar refeicoes');
        }
    }

    return (
        <div className={styles.container}>
            <Card>
                <CardHeader title="Lista de usuários" breadcrumb={["Início", "Refeições"]} />

                <SearchSection
                    searchPlaceholder="Pesquise por nome"
                    dateSection={true}
                    buttons={[
                        <Button key="report" variant="full-white" iconLeft={<Printer size={20} />}>Gerar Relatório</Button>,
                        <Button key="new_booking" variant="full" iconLeft={<Plus size={20} />}>Novo agendamento</Button>
                    ]}
                />

                <Table
                    headerItems={[
                        { key: "nome", label: "Nome" },
                        { key: "tipo_usuario", label: "Tipo de usuário" },
                        { key: "funcao", label: "Função" },
                        { key: "almoco", label: "Almoço" },
                        { key: "jantar", label: "Jantar" },
                        { key: "data", label: "Data" },
                        { key: "acao", label: "Ação" },
                    ]}
                    rowItems={refeicoes}
                    itemsPerPage={8}
                    hasSelector={true}
                />
                
            </Card>
        </div>
    );
}
