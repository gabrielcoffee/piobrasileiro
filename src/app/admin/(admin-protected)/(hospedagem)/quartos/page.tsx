'use client';

import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import CardHeader from '@/components/desktop/CardHeader';
import Card from '@/components/desktop/Card';
import SearchSection from '@/components/admin/SearchSection';

import { Filter, PencilLine, Plus, Power, PowerOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Table from '@/components/admin/Table';
import { queryApi } from '@/lib/utils';
import { DateSection } from '@/components/admin/DateSection';
import Modal from '@/components/admin/Modal';
import { InputText } from '@/components/ui/InputText';
import { DropdownInput } from '@/components/ui/DropdownInput';
import { InputDate } from '@/components/ui/InputDate';
import { SimpleDateSelect } from '@/components/admin/SimpleDateSelect';
import MobileTitle from '@/components/admin/MobileTitle';
import SaveFooterAdmin from '@/components/admin/SaveFooterAdmin';

export default function QuartosPage() {

    const [quartos, setQuartos] = useState<any[]>([]);
    const [selectedWeekStart, setSelectedWeekStart] = useState<Date>(new Date());
    const [selectedWeekEnd, setSelectedWeekEnd] = useState<Date>(new Date());
    const [weekDaysList, setWeekDaysList] = useState<any[]>([]);
    const [showNewRoomModal, setShowNewRoomModal] = useState<boolean>(false);
    const [showEditRoomModal, setShowEditRoomModal] = useState<boolean>(false);
    const [showDeactivateModal, setShowDeactivateModal] = useState<boolean>(false);
    const [showFilterModal, setShowFilterModal] = useState<boolean>(false);

    const [filterStatus, setFilterStatus] = useState<string>('');
    const [filterPeriod, setFilterPeriod] = useState<string>('');
    const [filters, setFilters] = useState<{ key: string, value: string | boolean | number }[]>([]);

    const [selectedRoomData, setSelectedRoomData] = useState<any>(null);
    const [selectedRoomForDeactivation, setSelectedRoomForDeactivation] = useState<any>(null);
    const [nome, setNome] = useState<string>('');
    const [capacity, setCapacity] = useState<number>(0);
    const [active, setActive] = useState<boolean>(true);
    const [searchText, setSearchText] = useState<string>('');   

    const [isMobile, setIsMobile] = useState<boolean>(false);

    // Helpers for local-date normalization and formatting
    const formatLocalYMD = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const parseYMDToLocalDate = (ymd: string | undefined): Date | null => {
        if (!ymd) return null;
        const [y, m, d] = ymd.split('-').map(Number);
        const dt = new Date(y, (m || 1) - 1, d || 1);
        dt.setHours(0, 0, 0, 0);
        return dt;
    }

    const normalizeToLocalMidnight = (date: Date): Date => {
        const dt = new Date(date);
        dt.setHours(0, 0, 0, 0);
        return dt;
    }

    const handleWeekChange = (weekStart: Date, weekEnd: Date) => {
        setSelectedWeekStart(normalizeToLocalMidnight(weekStart));
        setSelectedWeekEnd(normalizeToLocalMidnight(weekEnd));
    }

    const toggleActiveRoom = async (id: string) => {
        const result = await queryApi('PUT', `/admin/rooms/toggle-active/${id}`);

        if (result.success) {
            console.log('Quarto toggleado com sucesso');
            fetchRooms();
        } else {
            console.log('Erro ao togglear quarto', result.error);
        }
    }

    const deactivateRoom = async () => {
        if (!selectedRoomForDeactivation) return;

        const result = await queryApi('PUT', `/admin/rooms/toggle-active/${selectedRoomForDeactivation.id}`);

        if (result.success) {
            console.log('Quarto desativado com sucesso');
            fetchRooms();
            setShowDeactivateModal(false);
            setSelectedRoomForDeactivation(null);
        } else {
            console.log('Erro ao desativar quarto', result.error);
        }
    }

    const editar = (room: any) => {
        setNome(room.numero);
        setCapacity(room.capacidade);
        setActive(room.active);
        setSelectedRoomData(room);
        setShowEditRoomModal(true);
    }

    const acoes = (room: any) => {
        return (
            <div className={styles.acoes}>
                {room.active ? (
                    <PowerOff 
                        className={styles.actionButton}
                        size={20} 
                        style={{color: 'var(--color-error)', cursor: 'pointer'}} 
                        onClick={() => {
                            setSelectedRoomForDeactivation(room);
                            setShowDeactivateModal(true);
                        }} 
                    />
                ) : (
                    <Power 
                        className={styles.actionButton}
                        size={20} 
                        style={{cursor: 'pointer'}} 
                        onClick={() => toggleActiveRoom(room.id)} 
                    />
                )}
                <PencilLine className={styles.actionButton} size={20} onClick={() => editar(room)} style={{cursor: 'pointer'}} />
            </div>
        );
    }

    const getWeekDates = () => {
        const weekDates = [];
        const startDate = normalizeToLocalMidnight(new Date(selectedWeekStart));
        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            date.setHours(0, 0, 0, 0);
            weekDates.push(date);
        }
        return weekDates;
    }

    const getWeekListAsTableHeader = () => {
        const weekDaysList = getWeekDates();

        const headerDaysList: any[] = weekDaysList.map((day) => {
            return {
                key: formatLocalYMD(day),
                label: day.toLocaleDateString('pt-BR', { weekday: 'short' }).charAt(0).toUpperCase() +
                        day.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(1) + ' ' +
                        day.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
            }
        })
        setWeekDaysList(headerDaysList);
    }

    const fetchRooms = async () => {
        const roomOccupation = await getRoomOccupation();
        const result = await queryApi('GET', '/admin/rooms/all');
    
        if (result.success) {
            const quartos = result.data.map((room: any) => {
                // Find the occupation data for this room
                const occupation = roomOccupation.find((occ: any) => occ.quarto_id === room.id);
                
                // Get the current week dates
                const weekDates = getWeekDates();
                
                // Create an object with room data plus day-by-day status
                const roomData = {
                    ...room,
                    acao: acoes(room),
                };
    
                // Add each day of the week as a property
                weekDates.forEach((date) => {
                    const dateAtMidnight = normalizeToLocalMidnight(date);
                    const dateString = formatLocalYMD(dateAtMidnight); // Local YYYY-MM-DD

                    const dataChegada = occupation?.ocupacoes[0]?.data_chegada;
                    const dataSaida = occupation?.ocupacoes[0]?.data_saida;
                    
                    // Check if this room is occupied on this date using normalized local dates
                    const chegadaDate = parseYMDToLocalDate(dataChegada);
                    const saidaDate = parseYMDToLocalDate(dataSaida);
                    const isOccupied = !!(chegadaDate && saidaDate &&
                        dateAtMidnight.getTime() >= chegadaDate.getTime() &&
                        dateAtMidnight.getTime() <= saidaDate.getTime());
    
                    // Add the day status to the room data
                    roomData['is_occupied_' + dateString] = isOccupied;

                    roomData[dateString] = 
                        isOccupied ? 
                        <span className={styles.occupied}>
                            <div className={styles.occupiedIcon}/>
                            <span className={styles.occupiedTextBig}>Ocupado</span>
                            <span className={styles.occupiedTextSmall}>Ocu...</span>
                        </span>
                        : 
                        <span className={styles.available}>
                            <div className={styles.availableIcon}/>
                            <span className={styles.availableTextBig}>Disponível</span>
                            <span className={styles.availableTextSmall}>Dis...</span>
                        </span>;
                });
    
                return roomData;
            });

            // Ordenar quartos por nome
            quartos.sort((a: any, b: any) => a.numero.localeCompare(b.numero));
            
            setQuartos(quartos);
        } else {
            console.log('Erro ao buscar quartos', result.error);
        }
    }

    const getRoomOccupation = async () => {
        const result = await queryApi('GET', `/admin/room-occupation`);

        if (result.success) {
            console.log(result.data);
            return result.data;
        } else {
            console.log('Erro ao buscar ocupação de quartos', result.error);
            return []
        }
    }


    const saveNewRoom = async () => {
        const result = await queryApi('POST', '/admin/rooms', {
            numero: nome,
            capacidade: capacity,
            active: active,
        });

        if (result.success) {
            console.log('Quarto salvo com sucesso');
            fetchRooms();
        } else {
            console.log('Erro ao salvar quarto', result.error);
        }
    }

    const saveEditRoom = async () => {

        if (!selectedRoomData) {
            return;
        }

        const result = await queryApi('PUT', `/admin/rooms/${selectedRoomData.id}`, {
            numero: nome,
            capacidade: capacity,
            active: active,
        });

        if (result.success) {
            console.log('Quarto editado com sucesso');
            fetchRooms();
            setShowEditRoomModal(false);
        } else {
            console.log('Erro ao editar quarto', result.error);
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
    }

    const canFilter = () => {
        return filterStatus !== '' && filterPeriod !== '';
    }

    const clearFilters = () => {
        setFilterStatus('');
        setFilterPeriod('');
        setFilters([]);
        setSearchText('');
    }

    const handleOpenFilterModal = () => {
        setShowFilterModal(true);
    }

    const handleFiltrar = () => {
        if (canFilter()) {
            setShowFilterModal(false);

            if (filterPeriod !== '') {
                handleFilterDateChange(filterPeriod);
            }

            const statusValue = filterStatus === 'ocupado' ? true : false;

            setFilters([{ key: "is_occupied_" + filterPeriod, value: statusValue }]);

        } else {
            setFilters([]);
        }
    }

    useEffect(() => {
        getWeekListAsTableHeader();

        const today = new Date();
        const currentWeekStart = getWeekStart(today);

        if (!(selectedWeekEnd < currentWeekStart)) {
            fetchRooms();
        }
    }, [selectedWeekStart, selectedWeekEnd]);

    useEffect(() => {
        if (showNewRoomModal) {
            setNome('');
            setCapacity(0);
            setActive(true);
        }
    }, [showNewRoomModal]);

    useEffect(() => {
        if (showEditRoomModal) {
            setNome(selectedRoomData.numero);
            setCapacity(selectedRoomData.capacidade);
            setActive(selectedRoomData.active);
        }
    }, [showEditRoomModal]);

    useEffect(() => {
        fetchRooms();
    }, []);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
    }, [window.innerWidth]);

    return (
        <>

        {!isMobile ? (
        <div className={styles.container}>
            <Card>
                <CardHeader title="Lista de quartos" breadcrumb={["Início", "Hospedagem", "Quartos"]} />

                <SearchSection
                    searchText={searchText}
                    setSearchText={setSearchText}
                    searchPlaceholder="Pesquise por nome do quarto"
                    dateSection={(
                        <DateSection
                            selectedWeekStart={selectedWeekStart}
                            selectedWeekEnd={selectedWeekEnd}
                            onWeekChange={handleWeekChange}
                        />
                        )}
                    buttons={
                    [
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
                    <Button onClick={() => setShowNewRoomModal(true)} key="new_room" variant="full" iconLeft={<Plus size={20} />}>Novo quarto</Button>
                    ]
                    }
                />

                <Table
                    filters={filters}
                    searchText={searchText}
                    searchKey="numero"
                    headerItems={[
                        { key: "numero", label: "Nome" },
                        ...weekDaysList,
                        { key: "acao", label: "Ação" },
                    ]}
                    rowItems={quartos}
                    itemsPerPage={8}
                />
            </Card>
        </div>

        ) : (

            <div className={styles.mobileContainer}>
                <MobileTitle title="Lista de quartos" />

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
                    searchPlaceholder="Pesquise por nome do quarto"
                    dateSection={false}
                    buttons={[]}
                />

                <Table
                    filters={filters}
                    searchText={searchText}
                    searchKey="numero"
                    headerItems={[
                        { key: "numero", label: "Nome" },
                        ...weekDaysList,
                        { key: "acao", label: "Ação" },
                    ]}
                    rowItems={quartos}
                    itemsPerPage={8}
                />

                <SaveFooterAdmin buttonText="Novo quarto" executeFunction={() => setShowNewRoomModal(true)} />
            </div>
        )}

        <Modal
            title="Cadastrar novo quarto"
            buttons={
                <>
                    <Button variant="soft-red" onClick={() => setShowNewRoomModal(false)}>Cancelar</Button>
                    <Button variant="full" onClick={() => saveNewRoom()}>Cadastrar</Button>
                </>
            }
            onClose={() => setShowNewRoomModal(false)}
            isOpen={showNewRoomModal}
        >
            <div className={styles.newRoomModalContent}>
                <InputText
                    label="*Nome"
                    placeholder="Informe o nome do quarto"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
                <InputText
                    label="*Capacidade"
                    placeholder="Informe o número máximo de hóspedes"
                    numberValue={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    onlyNumber={true}
                />
                <div className={styles.toggleContainer}>
                    <button
                        id="active"
                        className={`${styles.toggle} ${active ? styles.toggleOn : styles.toggleOff}`}
                        onClick={() => setActive(!active)}
                    >
                        <div className={styles.toggleCircle} />
                    </button>
                    <label htmlFor="active" className={styles.toggleText}>
                        
                        {active ? 'ATIVADO' : 'DESATIVADO'}
                    </label>
                    
                </div>
            </div>
        </Modal>

        <Modal
            title="Editar quarto"
            buttons={
                <>
                    <Button variant="soft-red" onClick={() => setShowEditRoomModal(false)}>Cancelar</Button>
                    <Button variant="full" onClick={() => saveEditRoom()}>Salvar</Button>
                </>
            }
            onClose={() => setShowEditRoomModal(false)}
            isOpen={showEditRoomModal}
        >
            <div className={styles.newRoomModalContent}>
                <InputText
                    label="*Nome"
                    placeholder="Informe o nome do quarto"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
                <InputText
                    label="*Capacidade"
                    placeholder="Informe o número máximo de hóspedes"
                    numberValue={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    onlyNumber={true}
                />
                <div className={styles.toggleContainer}>
                    <button
                        id="active"
                        className={`${styles.toggle} ${active ? styles.toggleOn : styles.toggleOff}`}
                        onClick={() => setActive(!active)}
                    >
                        <div className={styles.toggleCircle} />
                    </button>
                    <label htmlFor="active" className={styles.toggleText}>
                        
                        {active ? 'ATIVADO' : 'DESATIVADO'}
                    </label>
                    
                </div>
            </div>
        </Modal>

        <Modal
        title="Tem certeza que deseja inativar o quarto?"
        subtitle="O acesso desse quarto ao sistema ficará suspenso até a reativação. Você pode reverter essa ação a qualquer momento."
        onClose={() => setShowDeactivateModal(false)}
        isOpen={showDeactivateModal}
        buttons={
            <>
            <Button variant="soft-red" onClick={() => setShowDeactivateModal(false)}>Cancelar</Button>
            <Button variant="full" style={{backgroundColor: 'var(--color-error)', border: '1px solid var(--color-error)'}} onClick={deactivateRoom}>Sim, tenho certeza</Button>
            </>
        }
        />


        <Modal
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
                <DropdownInput
                    variant="white"
                    label="Status"
                    value={filterStatus}
                    placeholder="Filtre por status"
                    onChange={(value) => setFilterStatus(value)}
                    options={[
                        { key: "disponivel", value: "Disponível" },
                        { key: "ocupado", value: "Ocupado" }
                    ]}
                />
                <SimpleDateSelect
                    cantBeBeforeToday={true}
                    label="Data ou período"
                    selectedDate={filterPeriod ? new Date(filterPeriod.split('T')[0] + 'T00:00:00') : null}
                    onDateChange={(value) => setFilterPeriod(value?.toISOString().split('T')[0])}
                />
            </div>
        </Modal>
    </>);
}
