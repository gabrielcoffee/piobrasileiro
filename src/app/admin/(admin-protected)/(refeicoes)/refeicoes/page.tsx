import React from 'react';
import styles from './page.module.css';
import Card from '@/components/desktop/Card';
import CardHeader from '@/components/desktop/CardHeader';
import Table from '@/components/admin/Table';

export default function ListaDeRefeicoesPage() {
    return (
        <div className={styles.container}>
            <Card>
                <CardHeader title="Lista de usuários" breadcrumb={["Início", "Usuários"]} />

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

                {/*
                    <SearchSection
                    serchPlaceholder="Pesquise por nome"
                    dateSection={true}
                    buttons={[
                        <Button variant="outline" iconLeft={<Filter size={20} />}>Filtrar</Button>,
                        <Button variant="full" iconLeft={<Plus size={20} />}>Novo usuário</Button>
                    ]}
                />
                */}
                
            </Card>
        </div>
    );
}
