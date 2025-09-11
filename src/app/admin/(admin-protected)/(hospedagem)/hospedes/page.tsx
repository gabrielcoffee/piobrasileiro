'use client';
import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import Card from '@/components/desktop/Card';
import CardHeader from '@/components/desktop/CardHeader';
import SearchSection from '@/components/admin/SearchSection';
import { Button } from '@/components/ui/Button';
import { Check, Filter, PencilLine, Plus, Trash2 } from 'lucide-react';
import Table from '@/components/admin/Table';
import Modal from '@/components/admin/Modal';
import { InputText } from '@/components/ui/InputText';
import { InputTextSearch } from '@/components/ui/InputTextSearch';
import { queryApi } from '@/lib/utils';
import AddHospedeModal from '@/components/admin/AddHospedeModal';

export default function HospedesPage() {

    const [showNewBookingModal, setShowNewBookingModal] = useState<boolean>(false);
    const [guests, setGuests] = useState<any[]>([]);

    const [selectedGuests, setSelectedGuests] = useState<any[]>([]);
    const [showEditGuestModal, setShowEditGuestModal] = useState<boolean>(false);
    const [showDeleteGuestModal, setShowDeleteGuestModal] = useState<boolean>(false);
    const [selectedGuestData, setSelectedGuestData] = useState<any>(null);

    const saveNewGuest = async () => {

        if (!selectedGuestData.nome || !selectedGuestData.genero || !selectedGuestData.tipoDocumento || !selectedGuestData.numDocumento) {
            console.log('Dados incompletos');
            return;
        }

        const hospedeData = {
            ...selectedGuestData,
            tipo_documento: selectedGuestData.tipoDocumento,
            num_documento: selectedGuestData.numDocumento,
        }

        const result = await queryApi('POST', '/admin/guests', hospedeData);

        if (result.success) {
            console.log('Hospede salvo com sucesso');
            fetchGuests();
        } else {
            console.log('Erro ao salvar hospede', result.error);
        }
        setShowNewBookingModal(false);
    }

    const saveEditGuest = async () => {

        if (!selectedGuestData.nome || !selectedGuestData.genero || !selectedGuestData.tipoDocumento || !selectedGuestData.numDocumento) {
            console.log('Dados incompletos');
            return;
        }

        const hospedeData = {
            ...selectedGuestData,
            tipo_documento: selectedGuestData.tipoDocumento,
            num_documento: selectedGuestData.numDocumento,
        }

        const result = await queryApi('PUT', `/admin/guests/${selectedGuestData.id}`, hospedeData);
        if (result.success) {
            console.log('Hospede editado com sucesso');
            fetchGuests();
        } else {
            console.log('Erro ao editar hospede', result.error);
        }
        setShowEditGuestModal(false);
    }

    const editar = (guest: any) => {
        setShowEditGuestModal(true);
        setSelectedGuestData(guest);
    }

    const excluir = (guest: any) => {
        setShowDeleteGuestModal(true);
        setSelectedGuestData(guest);
    }

    const handleDeleteGuest = async () => {
        const result = await queryApi('DELETE', `/admin/guests/${selectedGuestData.id}`);
        if (result.success) {
            console.log('Hospede excluido com sucesso');
            fetchGuests();
        } else {
            console.log('Erro ao excluir hospede', result.error);
        }
        setShowDeleteGuestModal(false);
    }

    const acoes = (guest: any) => {
        return (
            <div className={styles.acoes}>
                <PencilLine size={20} onClick={() => editar(guest)} style={{cursor: 'pointer'}} />
                <Trash2 size={20} onClick={() => excluir(guest)} style={{cursor: 'pointer'}} />
            </div>
        );
    }

    const formatCpf = (cpf: string) => {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    const fetchGuests = async () => {
        const result = await queryApi('GET', '/admin/guests');
        if (result.success) {

            const guests = result.data.map((guest: any) => {

                const doc = guest.tipo_documento === 'cpf' ? formatCpf(guest.num_documento) : guest.num_documento_internacional;

                return {
                    ...guest,
                    genero: guest.genero === 'm' ? 'Masculino' : 'Feminino',
                    documento: doc,
                    funcao: guest.funcao,
                    origem: guest.origem,
                    acao: acoes(guest),
                }
            });
            setGuests(guests);
        } else {
            console.log('Erro ao buscar hospedes', result.error);
        }
    }

    useEffect(() => {
        fetchGuests();
    }, []);

    return (
        <div className={styles.container}>
            <Card>
                <CardHeader title="Hospedes" breadcrumb={["Início", "Hospedagem", "Hospedes"]} />

                <SearchSection
                    dateSection={false}
                    searchPlaceholder="Pesquise por nome"
                    buttons={[
                        
                        <Button key="filter" variant="full-white" iconLeft={<Filter size={24} />}>Filtrar</Button>,
                        <Button key="new_guest" variant="full" onClick={() => setShowNewBookingModal(true)} iconLeft={<Plus size={20} />}>Novo hóspede</Button>
                    ]}
                />

                <Table
                    rowItems={guests}
                    headerItems={[
                        { key: "nome", label: "Nome" },
                        { key: "genero", label: "Gênero" },
                        { key: "documento", label: "Número do documento" },
                        { key: "funcao", label: "Função" },
                        { key: "origem", label: "Origem" },
                        { key: "acao", label: "Ação" },
                    ]}
                    itemsPerPage={8}
                    hasSelector={true}
                    onSelectionChange={(selectedRows) => {
                        if (selectedRows.length > 0) {
                            setSelectedGuests(selectedRows);
                        } else {
                            setSelectedGuests([]);
                        }
                    }}
                />




                <Modal
                    title="Novo hóspede"
                    isOpen={showNewBookingModal}
                    onClose={() => setShowNewBookingModal(false)}
                    buttons={
                        <>
                            <Button variant="full-white" style={{color: 'var(--color-error)', borderColor: 'var(--color-error)'}} onClick={() => setShowNewBookingModal(false)}>Cancelar</Button>
                            <Button 
                            iconLeft={<Check size={20} />} 
                            variant="full" 
                            onClick={() => saveNewGuest()} 
                            available={selectedGuestData?.nome && selectedGuestData?.genero && selectedGuestData?.tipoDocumento && selectedGuestData?.numDocumento ? true : false}>
                                Salvar
                            </Button>
                        </>
                    }
                >
                    <AddHospedeModal
                        setHospedeData={setSelectedGuestData}
                        hospedeData={{}}
                    />
                </Modal>




                <Modal
                    title="Editar hóspede"
                    isOpen={showEditGuestModal}
                    onClose={() => setShowEditGuestModal(false)}
                    buttons={
                        <>
                            <Button variant="full-white" style={{color: 'var(--color-error)', borderColor: 'var(--color-error)'}} onClick={() => setShowEditGuestModal(false)}>Cancelar</Button>
                            <Button 
                            iconLeft={<Check size={20} />} 
                            variant="full" 
                            onClick={() => saveEditGuest()} 
                            available={selectedGuestData?.nome && selectedGuestData?.genero && selectedGuestData?.tipoDocumento && selectedGuestData?.numDocumento ? true : false}>
                                Salvar
                            </Button>
                        </>
                    }
                >
                    <AddHospedeModal
                        setHospedeData={setSelectedGuestData}
                        hospedeData={selectedGuestData}
                        isEdit={true}
                    />
                </Modal>




                <Modal
                    title="Excluir hóspede"
                    subtitle="Esta ação é irreversível e resultará na exclusão permanente de todo o histórico deste hospede."
                    isOpen={showDeleteGuestModal}
                    onClose={() => setShowDeleteGuestModal(false)}
                    buttons={
                        <>
                            <Button variant="full-white" style={{color: 'var(--color-error)', borderColor: 'var(--color-error)'}} onClick={() => setShowDeleteGuestModal(false)}>Cancelar</Button>
                            <Button iconLeft={<Check size={20} />} variant="full" style={{backgroundColor: 'var(--color-error)', border: '1px solid var(--color-error)'}} onClick={() => handleDeleteGuest()}>Sim tenho certeza</Button>
                        </>
                    }
                >
                </Modal>
            </Card>
        </div>
    );
}
