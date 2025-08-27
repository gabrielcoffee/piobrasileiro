import React from 'react';
import styles from './page.module.css';
import Card from '@/components/desktop/Card';
import CardHeader from '@/components/desktop/CardHeader';
import Table from '@/components/admin/Table';
import SearchSection from '@/components/admin/SearchSection';
import { Plus, Printer } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ListaDeRefeicoesPage() {
    return (
        <div className={styles.container}>
            <Card>
                <CardHeader title="Lista de usuários" breadcrumb={["Início", "Usuários"]} />

                <SearchSection
                    searchPlaceholder="Pesquise por nome"
                    dateSection={true}
                    buttons={[
                        <Button variant="full-white" iconLeft={<Printer size={20} />}>Gerar Relatório</Button>,
                        <Button variant="full" iconLeft={<Plus size={20} />}>Novo agendamento</Button>
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
                    rowItems={[
                        { nome: "João da Silva", tipo_usuario: "Administrador", funcao: "Administrador", almoco: "Sim", jantar: "Sim", data: "2021-01-01", acao: "Editar" },
                        { nome: "Maria da Silva", tipo_usuario: "Administrador", funcao: "Administrador", almoco: "Sim", jantar: "Sim", data: "2021-01-01", acao: "Editar" },
                        { nome: "João da Silva", tipo_usuario: "Administrador", funcao: "Administrador", almoco: "Sim", jantar: "Sim", data: "2021-01-01", acao: "Editar" },
                        { nome: "Maria da Silva", tipo_usuario: "Administrador", funcao: "Administrador", almoco: "Sim", jantar: "Sim", data: "2021-01-01", acao: "Editar" },
                        { nome: "João da Silva", tipo_usuario: "Administrador", funcao: "Administrador", almoco: "Sim", jantar: "Sim", data: "2021-01-01", acao: "Editar" },
                        { nome: "Maria da Silva", tipo_usuario: "Administrador", funcao: "Administrador", almoco: "Sim", jantar: "Sim", data: "2021-01-01", acao: "Editar" },
                        { nome: "João da Silva", tipo_usuario: "Administrador", funcao: "Administrador", almoco: "Sim", jantar: "Sim", data: "2021-01-01", acao: "Editar" },
                        { nome: "Maria da Silva", tipo_usuario: "Administrador", funcao: "Administrador", almoco: "Sim", jantar: "Sim", data: "2021-01-01", acao: "Editar" },
                        { nome: "João da Silva", tipo_usuario: "Administrador", funcao: "Administrador", almoco: "Sim", jantar: "Sim", data: "2021-01-01", acao: "Editar" },
                        { nome: "Maria da Silva", tipo_usuario: "Administrador", funcao: "Administrador", almoco: "Sim", jantar: "Sim", data: "2021-01-01", acao: "Editar" },
                        { nome: "João da Silva", tipo_usuario: "Administrador", funcao: "Administrador", almoco: "Sim", jantar: "Sim", data: "2021-01-01", acao: "Editar" },
                    ]}
                    itemsPerPage={8}
                    hasSelector={true}
                />
                
            </Card>
        </div>
    );
}
