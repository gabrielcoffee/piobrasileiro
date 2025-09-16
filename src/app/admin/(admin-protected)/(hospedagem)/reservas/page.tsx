"use client";

import React, { useCallback, useEffect, useState } from 'react';
import styles from './page.module.css';
import Card from '@/components/desktop/Card';
import CardHeader from '@/components/desktop/CardHeader';
import SearchSection from '@/components/admin/SearchSection';
import { DateSection } from '@/components/admin/DateSection';
import { Filter, PencilLine, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Table from '@/components/admin/Table';
import { getCurrentWeekInfo, getDateString, queryApi } from '@/lib/utils';
import Modal from '@/components/admin/Modal';
import AddBookingModal from '@/components/admin/AddBookingModal';

export default function GestaoDeReservasPage() {

    const [selectedWeekStart, setSelectedWeekStart] = useState<Date>(new Date());
    const [selectedWeekEnd, setSelectedWeekEnd] = useState<Date>(new Date());
    const [selectedBookingData, setSelectedBookingData] = useState<any>(null);

    const [showNewBookingModal, setShowNewBookingModal] = useState<boolean>(false);
    const [showEditBookingModal, setShowEditBookingModal] = useState<boolean>(false);
    const [showDeleteBookingModal, setShowDeleteBookingModal] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');

    const [reservas, setReservas] = useState<any[]>([]);

    const handleWeekChange = (weekStart: Date, weekEnd: Date) => {
        setSelectedWeekStart(weekStart);
        setSelectedWeekEnd(weekEnd);
    }

    const editar = (reserva: any) => {
        setShowEditBookingModal(true);
        setSelectedBookingData(reserva);
    }

    const excluir = (reserva: any) => {
        setShowDeleteBookingModal(true);
        setSelectedBookingData(reserva);
    }

    const handleDeleteBooking = async () => {
        const result = await queryApi('DELETE', `/admin/accommodations/${selectedBookingData.id}`);
        if (result.success) {
            console.log('Reserva excluida com sucesso');
            fetchReservas(selectedWeekStart, selectedWeekEnd);
            setShowDeleteBookingModal(false);
        } else {
            console.log('Erro ao excluir reserva', result.error);
        }
    }

    const handleEditBooking = async () => {

        if (!selectedBookingData) {
            console.log('Não há dados para editar');
            return;
        }
        if (!selectedBookingData.anfitriao_id || !selectedBookingData.hospede_id || !selectedBookingData.data_chegada || !selectedBookingData.data_saida || !selectedBookingData.quarto_id) {
            console.log('Não há dados para editar 2');
            return;
        }

        const result = await queryApi('PUT', `/admin/accommodations/${selectedBookingData.id}`, {
            data_chegada: selectedBookingData.data_chegada,
            data_saida: selectedBookingData.data_saida,
            quarto_id: selectedBookingData.quarto_id,
            almoco: selectedBookingData.almoco,
            janta: selectedBookingData.janta,
            observacoes: selectedBookingData.observacoes,
        });

        if (result.success) {
            console.log('Reserva editada com sucesso');
            fetchReservas(selectedWeekStart, selectedWeekEnd);
            setShowEditBookingModal(false);
        } else {
            console.log('Erro ao editar reserva', result.error);
        }
    }

    const handleNewBookingChangeData = useCallback((bookingData: any) => {
        console.log('bookingData', bookingData);
        setSelectedBookingData(bookingData);
    }, []);
    
    const handleSaveNewBooking = async () => {
        if (!selectedBookingData) {
            console.log('Não há dados para salvar');
            return;
        }
        if (!selectedBookingData.anfitriao_id || !selectedBookingData.hospede_id || !selectedBookingData.data_chegada || !selectedBookingData.data_saida || !selectedBookingData.quarto_id) {
            console.log('Não há dados para salvar 2');
            return;
        }

        const result = await queryApi('POST', '/admin/accommodations', {
            anfitriao_id: selectedBookingData.anfitriao_id,
            hospede_id: selectedBookingData.hospede_id,
            data_chegada: selectedBookingData.data_chegada,
            data_saida: selectedBookingData.data_saida,
            quarto_id: selectedBookingData.quarto_id,
            almoco: selectedBookingData.almoco,
            janta: selectedBookingData.janta,
            observacoes: selectedBookingData.observacoes,
        });

        if (result.success) {
            console.log('Reserva salva com sucesso');
            fetchReservas(selectedWeekStart, selectedWeekEnd);
            setShowNewBookingModal(false);
        } else {
            console.log('Erro ao salvar reserva', result.error);
        }
    }

    const acoes = (reserva: any) => {
        return (
            <div className={styles.acoes}>
                <PencilLine size={20} onClick={() => editar(reserva)} style={{cursor: 'pointer'}} />
                <Trash2 size={20} onClick={() => excluir(reserva)} style={{cursor: 'pointer'}} />
            </div>
        );
    }

    const getStatusHtml = (status: any) => {
        if (status === 'Ativa') {
            return <span className={styles.ativa}>Ativa</span>;
        } else if (status === 'Prevista') {
            return <span className={styles.prevista}>Prevista</span>;
        } else if (status === 'Encerrada') {
            return <span className={styles.encerrada}>Encerrada</span>;
        }
    }

    const fetchReservas = async (startDate: Date, endDate: Date) => {
        const result = await queryApi('POST', '/admin/accommodations/data', {
            startDate: startDate,
            endDate: endDate,
        });

        if (result.success) {
            const completeReservas = result.data.map((reserva: any) => {
                return {
                    ...reserva,
                    data_chegada: getDateString(reserva.data_chegada),
                    data_saida: getDateString(reserva.data_saida),
                    status: getStatusHtml(reserva.status),
                    acao: acoes(reserva),
                }
            });
            setReservas(completeReservas);
        }
    }


    useEffect(() => {
        if (selectedWeekStart && selectedWeekEnd) {
            fetchReservas(selectedWeekStart, selectedWeekEnd);
        }
    }, [selectedWeekStart, selectedWeekEnd]);

     
    useEffect(() => {
        const currentWeekInfo = getCurrentWeekInfo();
        setSelectedWeekStart(currentWeekInfo.monday);
        setSelectedWeekEnd(currentWeekInfo.sunday);
        fetchReservas(currentWeekInfo.monday, currentWeekInfo.sunday);
    }, []);

    return (
        <div className={styles.container}>
            <Card>
                <CardHeader title="Gestão de Reservas" breadcrumb={["Início", "Hospedagem", "Reservas"]} />

                <SearchSection
                    searchText={searchText}
                    setSearchText={setSearchText}
                    searchPlaceholder="Pesquise por nome"
                    buttons={[
                        <Button key="filter" variant="full-white" iconLeft={<Filter size={24} />}>Filtrar</Button>,
                        <Button key="new_booking" variant="full" onClick={() => {setShowNewBookingModal(true); setSelectedBookingData(null);}} iconLeft={<Plus size={20} />}>Novo agendamento</Button>
                    ]}
                    dateSection={(
                        <DateSection
                            selectedWeekStart={selectedWeekStart}
                            selectedWeekEnd={selectedWeekEnd}
                            onWeekChange={handleWeekChange}
                        />
                    )}
                />

                <Table
                    searchText={searchText}
                    searchKey="nome"
                    headerItems={[
                        { key: "nome", label: "Nome" },
                        { key: "anfitriao", label: "Anfitrião" },
                        { key: "data_chegada", label: "Chegada" },
                        { key: "data_saida", label: "Saída" },
                        { key: "quarto", label: "Quarto" },
                        { key: "status", label: "Status" },
                        { key: "acao", label: "Ação" },
                    ]}
                    rowItems={reservas || []}
                    itemsPerPage={6}
                />
            </Card>

            <Modal
                title="Nova reserva"
                buttons={
                    <>
                        <Button variant="full-white" style={{color: 'var(--color-error)', borderColor: 'var(--color-error)'}} onClick={() => setShowNewBookingModal(false)}>Cancelar</Button>
                        <Button available={selectedBookingData?.anfitriao_id && selectedBookingData?.hospede_id && selectedBookingData?.data_chegada && selectedBookingData?.data_saida && selectedBookingData?.quarto_id ? true : false} variant="full" onClick={() => handleSaveNewBooking()}>Salvar</Button>
                    </>
                }
                onClose={() => setShowNewBookingModal(false)}
                isOpen={showNewBookingModal}
            >
                <AddBookingModal
                    bookingDataChange={handleNewBookingChangeData} 
                    bookingData={selectedBookingData}
                />
            </Modal>

            <Modal
                title="Editar reserva"
                buttons={
                    <>
                        <Button variant="full-white" style={{color: 'var(--color-error)', borderColor: 'var(--color-error)'}} onClick={() => setShowEditBookingModal(false)}>Cancelar</Button>
                        <Button available={selectedBookingData?.anfitriao_id && selectedBookingData?.hospede_id && selectedBookingData?.data_chegada && selectedBookingData?.data_saida && selectedBookingData?.quarto_id ? true : false} variant="full" onClick={() => handleEditBooking()}>Salvar</Button>
                    </>
                }
                onClose={() => setShowEditBookingModal(false)}
                isOpen={showEditBookingModal}
            >
                <AddBookingModal
                    isEdit={true}
                    bookingDataChange={handleNewBookingChangeData} 
                    bookingData={selectedBookingData}
                />
            </Modal>

            <Modal
                title="Excluir reserva"
                subtitle="Esta ação é irreversível e resultará na exclusão permanente de todo o histórico desta reserva."
                buttons={
                    <>
                        <Button variant="full-white" style={{color: 'var(--color-error)', borderColor: 'var(--color-error)'}} onClick={() => setShowDeleteBookingModal(false)}>Cancelar</Button>
                        <Button variant="full" style={{backgroundColor: 'var(--color-error)', border: '1px solid var(--color-error)'}} onClick={() => handleDeleteBooking()}>Sim tenho certeza</Button>
                    </>
                }
                onClose={() => setShowDeleteBookingModal(false)}
                isOpen={showDeleteBookingModal}
            >
            </Modal>
            
        </div>
    );
}
