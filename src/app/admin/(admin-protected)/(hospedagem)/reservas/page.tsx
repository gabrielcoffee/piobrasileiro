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
import { getCurrentWeekInfo, getDateString, getDateStringAndTime, queryApi } from '@/lib/utils';
import Modal from '@/components/admin/Modal';
import AddBookingModal from '@/components/admin/AddBookingModal';
import { useRouter } from 'next/navigation';
import { DropdownInput } from '@/components/ui/DropdownInput';
import { SimpleDateSelect } from '@/components/admin/SimpleDateSelect';
import { InputTextSearch } from '@/components/ui/InputTextSearch';
import { InputText } from '@/components/ui/InputText';
import { useToast } from '@/contexts/ToastContext';
import MobileTitle from '@/components/admin/MobileTitle';
import SaveFooterAdmin from '@/components/admin/SaveFooterAdmin';

export default function GestaoDeReservasPage() {

    const router = useRouter();
    const { showToast } = useToast();

    const [selectedWeekStart, setSelectedWeekStart] = useState<Date>(new Date());
    const [selectedWeekEnd, setSelectedWeekEnd] = useState<Date>(new Date());
    const [selectedBookingData, setSelectedBookingData] = useState<any>(null);
    const [notificationsCount, setNotificationsCount] = useState<number>(0);   
    const [anfitriaoOptions, setAnfitriaoOptions] = useState<any[]>([]);
    const [roomOptions, setRoomOptions] = useState<any[]>([]);

    const [showNewBookingModal, setShowNewBookingModal] = useState<boolean>(false);
    const [showEditBookingModal, setShowEditBookingModal] = useState<boolean>(false);
    const [showDeleteBookingModal, setShowDeleteBookingModal] = useState<boolean>(false);

    const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
    const [filterDate, setFilterDate] = useState<string>('');
    const [filterNome, setFilterNome] = useState<string>('');
    const [filterAnfitriao, setFilterAnfitriao] = useState<string>('');
    const [filterQuarto, setFilterQuarto] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [filters, setFilters] = useState<{ key: string, value: string | boolean | number }[]>([]);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    const [searchText, setSearchText] = useState<string>('');

    const [reservas, setReservas] = useState<any[]>([]);

    // Local date helpers
    const normalizeToLocalMidnight = (date: Date): Date => {
        const dt = new Date(date);
        dt.setHours(0, 0, 0, 0);
        return dt;
    };

    const parseYMDToLocalDate = (ymd: string | undefined): Date | null => {
        if (!ymd) return null;
        const [y, m, d] = ymd.split('-').map(Number);
        const dt = new Date(y, (m || 1) - 1, d || 1);
        dt.setHours(0, 0, 0, 0);
        return dt;
    };

    const handleWeekChange = (weekStart: Date, weekEnd: Date) => {
        setSelectedWeekStart(normalizeToLocalMidnight(weekStart));
        setSelectedWeekEnd(normalizeToLocalMidnight(weekEnd));
    }

    const editar = (reserva: any) => {
        setShowEditBookingModal(true);

        console.log('reserva', reserva);
        setSelectedBookingData(reserva);
    }

    const excluir = (reserva: any) => {
        setShowDeleteBookingModal(true);
        setSelectedBookingData(reserva);
    }


    const fetchUserAnfitriaoIdAndNames = async () => {
        const result = await queryApi('GET', '/admin/users');
        if (result.success) {
            const users = result.data.map((user: { user_id: string; nome_completo: string }) => ({
                key: user.user_id,
                value: user.nome_completo
            }));
            users.sort((a: { value: string }, b: { value: string }) => a.value.localeCompare(b.value));
            setAnfitriaoOptions(users);
        }
    }

    const fetchQuartosIdAndNames = async () => {
        const result = await queryApi('GET', '/admin/room-occupation');

        if (result.success) {
            console.log('Quartos encontrados', result.data);
            const roomOptions = result.data.map((room: any) => ({
                key: room.quarto_id,
                value: room.numero,
            }));
            roomOptions.sort((a: { value: string }, b: { value: string }) => a.value.localeCompare(b.value));
            setRoomOptions(roomOptions);
        }
    }

    const handleDeleteBooking = async () => {
        const result = await queryApi('DELETE', `/admin/accommodations/${selectedBookingData.id}`);
        if (result.success) {
            console.log('Reserva excluida com sucesso');
            fetchReservas(selectedWeekStart, selectedWeekEnd);
            setShowDeleteBookingModal(false);
            showToast('Reserva excluída com sucesso!', 'success');
        } else {
            console.log('Erro ao excluir reserva', result.error);
            showToast('Erro ao excluir reserva', 'error');
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
            showToast('Reserva editada com sucesso!', 'success');
        } else {
            console.log('Erro ao editar reserva', result.error);
            showToast('Erro ao editar reserva', 'error');
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
        if (!selectedBookingData.anfitriao_id || (!selectedBookingData.hospede_id && !selectedBookingData.novo_hospede_nome) || !selectedBookingData.data_chegada || !selectedBookingData.data_saida || !selectedBookingData.quarto_id) {
            console.log('Não há dados para salvar 2');
            return;
        }

        if (!selectedBookingData.hospede_id && selectedBookingData.novo_hospede_nome) {

            const result = await queryApi('POST', '/admin/guests/quick', {
                nome: selectedBookingData.novo_hospede_nome,
            });

            if (result.success) {
                selectedBookingData.hospede_id = result.data.id;
            }
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
            showToast('Reserva salva com sucesso!', 'success');
        } else {
            console.log('Erro ao salvar reserva', result.error);
            showToast('Erro ao salvar reserva', 'error');
        }
    }

    const acoes = (reserva: any) => {
        return (
            <div className={styles.acoes}>
                <PencilLine size={20} className={styles.actionButton} onClick={() => editar(reserva)} style={{cursor: 'pointer'}} />
                <Trash2 size={20} className={styles.actionButton} onClick={() => excluir(reserva)} style={{cursor: 'pointer'}} />
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

    const fetchNotifications = async () => {

        const result = await queryApi('GET', '/admin/requests/notifications');

        if (result.success) {
            setNotificationsCount(result.data);

        } else {
            setNotificationsCount(0);
            console.error('Erro ao buscar total de notificações:', result.error);
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
                    data_chegada: getDateString(reserva.data_chegada.split('T')[0]),
                    data_saida: getDateString(reserva.data_saida.split('T')[0]),
                    status: getStatusHtml(reserva.status),
                    status_data: reserva.status,
                    acao: acoes(reserva),
                }
            });
            setReservas(completeReservas);
        }
    }

    // Calculate the start of the current week (Monday) - normalized to local midnight
    const getWeekStart = (date: Date): Date => {
        const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Days to go back to Monday
        
        const monday = normalizeToLocalMidnight(date);
        monday.setDate(monday.getDate() - daysToMonday);
        monday.setHours(0, 0, 0, 0);
        return monday;
    };

    // Calculate the end of the current week (Sunday) - normalized to local midnight
    const getWeekEnd = (weekStart: Date): Date => {
        const sunday = normalizeToLocalMidnight(weekStart);
        sunday.setDate(sunday.getDate() + 6);
        sunday.setHours(0, 0, 0, 0);
        return sunday;
    };

    const handleFilterDateChange = (dateFilter: string) => {
        // setting the current week start and end based on the date selected (YYYY-MM-DD)
        const date = parseYMDToLocalDate(dateFilter) || new Date();
        const weekStart = getWeekStart(date);
        const weekEnd = getWeekEnd(weekStart);
        setSelectedWeekStart(weekStart);
        setSelectedWeekEnd(weekEnd);
        fetchReservas(weekStart, weekEnd);
    }

    const canFilter = () => {
        return filterDate !== '' || filterNome !== '' || filterAnfitriao !== '' || filterQuarto !== '' || filterStatus !== '';
    }

    const clearFilters = () => {
        setFilterDate('');
        setFilterNome('');
        setFilterAnfitriao('');
        setFilterQuarto('');
        setFilterStatus('');
        setFilters([]);
        setSearchText('');
    }

    const handleOpenFilterModal = () => {
        fetchUserAnfitriaoIdAndNames();
        fetchQuartosIdAndNames();
        setShowFilterModal(true);
    }

    const handleFiltrar = () => {
        if (canFilter()) {
            setShowFilterModal(false);

            if (filterDate !== '') {
                handleFilterDateChange(filterDate);
            }

            if (filterNome !== '') {
                setSearchText(filterNome);
            }

            setFilters([
                { key: "anfitriao", value: filterAnfitriao },
                { key: "quarto_id", value: filterQuarto },
                { key: "status_data", value: filterStatus },
            ]);
        } else {
            setFilters([]);
        }
    }

    useEffect(() => {
        if (selectedWeekStart && selectedWeekEnd) {
            fetchReservas(selectedWeekStart, selectedWeekEnd);
        }
    }, [selectedWeekStart, selectedWeekEnd]);

     
    useEffect(() => {
        const currentWeekInfo = getCurrentWeekInfo();
        const monday = normalizeToLocalMidnight(currentWeekInfo.monday);
        const sunday = normalizeToLocalMidnight(currentWeekInfo.sunday);
        setSelectedWeekStart(monday);
        setSelectedWeekEnd(sunday);
        fetchNotifications();
    }, []);


    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
    }, [window.innerWidth]);

    return (
        <>

        {!isMobile ? (
        
            <div className={styles.container}>
                <Card>
                    <CardHeader title="Gestão de Reservas" breadcrumb={["Início", "Hospedagem", "Reservas"]} />

                    {notificationsCount > 0 && (
                    <div className={styles.newRequest}>
                        <span>{notificationsCount > 1 ? `Você tem ${notificationsCount} novas solicitações de hospedagem!` : `Você tem ${notificationsCount} nova solicitação de hospedagem!`}</span>
                        <div className={styles.newRequestButton}>
                            <Button variant="full-white" onClick={() => {router.push('/admin/solicitacoes')}}>Verificar</Button>
                        </div>
                    </div>
                    )}

                    <SearchSection
                        searchText={searchText}
                        setSearchText={setSearchText}
                        searchPlaceholder="Pesquise por nome"
                        buttons={[
                            filters.length > 0 ? (
                                <Button 
                                onClick={() => handleOpenFilterModal()} 
                                key="filter" variant="full-white" 
                                style={{backgroundColor: 'var(--color-primary-foreground)', border: '1px solid var(--color-primary)'}} 
                                iconLeft={<Filter size={24} />}>
                                    Alterar filtros
                                </Button>
                            ) : (
                                <Button 
                                onClick={() => handleOpenFilterModal()} 
                                key="filter" variant="full-white" 
                                iconLeft={<Filter size={24} />}>
                                    Filtrar
                                </Button>
                            ),
                            <Button key="new_booking" variant="full" onClick={() => {setShowNewBookingModal(true); setSelectedBookingData(null);}} iconLeft={<Plus size={20} />}>Nova reserva</Button>
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
                        filters={filters}
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
            </div>

        ) : (
            <div className={styles.mobileContainer}>
                <MobileTitle title="Gestão de Reservas" />

                <div className={styles.buttonsTop}>
                    {filters.length > 0 ? (
                        <Button 
                        onClick={() => handleOpenFilterModal()} 
                        key="filter" variant="full-white" 
                        style={{backgroundColor: 'var(--color-primary-foreground)', border: '1px solid var(--color-primary)'}} 
                        iconLeft={<Filter size={24} />}>
                            Alterar filtros
                        </Button>
                    ) : (
                        <Button 
                        onClick={() => handleOpenFilterModal()} 
                        key="filter" variant="full-white" 
                        iconLeft={<Filter size={24} />}>
                            Filtrar
                        </Button>
                    )}

                    <DateSection
                        selectedWeekStart={selectedWeekStart}
                        selectedWeekEnd={selectedWeekEnd}
                        onWeekChange={handleWeekChange}
                    />
                </div>


                <SearchSection
                    searchText={searchText}
                    setSearchText={setSearchText}
                    searchPlaceholder="Pesquise por nome"
                    buttons={[]}
                    dateSection={false}
                />

                <Table
                    filters={filters}
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

                <SaveFooterAdmin buttonText="Nova reserva" executeFunction={() => {setShowNewBookingModal(true); setSelectedBookingData(null);}} />
            </div>
        )}



        <Modal
        comesFromBottomMobile={true}
        title="Nova reserva"
        buttons={
            <>
                <Button variant="soft-red" onClick={() => setShowNewBookingModal(false)}>Cancelar</Button>
                <Button available={selectedBookingData?.anfitriao_id && (selectedBookingData?.hospede_id || selectedBookingData?.novo_hospede_nome) && selectedBookingData?.data_chegada && selectedBookingData?.data_saida && selectedBookingData?.quarto_id ? true : false} variant="full" onClick={() => handleSaveNewBooking()}>Salvar</Button>
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
        comesFromBottomMobile={true}
        title="Editar reserva"
        buttons={
            <>
                <Button variant="soft-red" onClick={() => setShowEditBookingModal(false)}>Cancelar</Button>
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
                <Button variant="soft-red" onClick={() => setShowDeleteBookingModal(false)}>Cancelar</Button>
                <Button variant="full" style={{backgroundColor: 'var(--color-error)', border: '1px solid var(--color-error)'}} onClick={() => handleDeleteBooking()}>Sim tenho certeza</Button>
            </>
        }
        onClose={() => setShowDeleteBookingModal(false)}
        isOpen={showDeleteBookingModal}
        >
        </Modal>

        <Modal
        comesFromBottomMobile={true}
        title="Filtrar"
        onClose={() => setShowFilterModal(false)}
        isOpen={showFilterModal}
        buttonsLeft={
        <Button available={canFilter()} variant="soft-red" onClick={() => clearFilters()}>Limpar filtros</Button>
        }
        buttons={
        <>
            <Button variant="soft-red" onClick={() => setShowFilterModal(false)}>Cancelar</Button>
            <Button available={canFilter()} variant="full" onClick={() => handleFiltrar()}>Filtrar</Button>
        </>
        }
        >
        <div className={styles.filterModalContent}>

            <InputTextSearch
                label="Anfitrião"
                value={filterAnfitriao}
                placeholder="Filtre por anfitrião"
                onSelect={(option) => setFilterAnfitriao(option.value)}
                searchOptions={anfitriaoOptions}
            />

            <InputText
                label="Nome"
                value={filterNome}
                placeholder="Filtre por nome"
                onChange={(e) => setFilterNome(e.target.value)}
            />

            <SimpleDateSelect
                label="Data"
                selectedDate={filterDate ? new Date(filterDate.split('T')[0] + 'T00:00:00') : null}
                onDateChange={(value) => setFilterDate(value?.toISOString().split('T')[0])}
            />

            <InputTextSearch
                label="Quarto"
                value={
                    roomOptions.find((option) => option.key === filterQuarto)?.value || ''
                }
                onSelect={(option: any) => setFilterQuarto(option.key)}
                searchOptions={roomOptions}
                placeholder="Filtre por quarto"
            />
            
            <div className={styles.filterStatus}>
                <DropdownInput
                    variant="white"
                    label="Status"
                    value={filterStatus}
                    placeholder="Filtre por status"
                    onChange={(value) => setFilterStatus(value)}
                    options={[
                        { key: "ativa", value: "Ativa" },
                        { key: "prevista", value: "Prevista" },
                        { key: "encerrada", value: "Encerrada" }
                    ]}
                />
            </div>

        </div>
        </Modal>
    </>);
}
