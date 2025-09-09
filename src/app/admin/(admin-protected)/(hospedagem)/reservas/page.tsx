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
import { queryApi } from '@/lib/utils';
import Modal from '@/components/admin/Modal';
import AddBookingModal from '@/components/admin/AddBookingModal';

export default function GestaoDeReservasPage() {

    const [selectedWeekStart, setSelectedWeekStart] = useState<Date>(new Date());
    const [selectedWeekEnd, setSelectedWeekEnd] = useState<Date>(new Date());
    const [selectedBookingData, setSelectedBookingData] = useState<any>(null);

    const [showNewBookingModal, setShowNewBookingModal] = useState<boolean>(false);
    const [showEditBookingModal, setShowEditBookingModal] = useState<boolean>(false);
    const [showDeleteBookingModal, setShowDeleteBookingModal] = useState<boolean>(false);

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
            fetchReservas();
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
            jantar: selectedBookingData.jantar,
            observacoes: selectedBookingData.observacoes,
        });

        if (result.success) {
            console.log('Reserva editada com sucesso');
            fetchReservas();
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
            jantar: selectedBookingData.jantar,
            observacoes: selectedBookingData.observacoes,
        });
        if (result.success) {
            console.log('Reserva salva com sucesso');
            fetchReservas();
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

    const fetchReservas = async () => {
        const result = await queryApi('POST', '/admin/accommodations/data', {
            startDate: selectedWeekStart,
            endDate: selectedWeekEnd,
        });

        if (result.success) {
            const completeReservas = result.data.map((reserva: any) => {
                return {
                    ...reserva,
                    acao: acoes(reserva),
                }
            });
            setReservas(completeReservas);
        }
    }

    useEffect(() => {
        fetchReservas();
    }, []);

    return (
        <div className={styles.container}>
            <Card>
                <CardHeader title="Gestão de Reservas" breadcrumb={["Início", "Hospedagem", "Reservas"]} />

                <SearchSection
                    searchPlaceholder="Pesquise por nome"
                    buttons={[
                        <Button key="filter" variant="full-white" iconLeft={<Filter size={24} />}>Filtrar</Button>,
                        <Button key="new_booking" variant="full" onClick={() => setShowNewBookingModal(true)} iconLeft={<Plus size={20} />}>Novo agendamento</Button>
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
                title="Novo agendamento"
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
            
        </div>
    );
}
