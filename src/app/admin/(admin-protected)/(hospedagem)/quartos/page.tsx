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

export default function QuartosPage() {

    const [quartos, setQuartos] = useState<any[]>([]);
    const [selectedWeekStart, setSelectedWeekStart] = useState<Date>(new Date());
    const [selectedWeekEnd, setSelectedWeekEnd] = useState<Date>(new Date());
    const [weekDaysList, setWeekDaysList] = useState<any[]>([]);
    const [showNewRoomModal, setShowNewRoomModal] = useState<boolean>(false);
    const [showEditRoomModal, setShowEditRoomModal] = useState<boolean>(false);
    
    const [selectedRoomData, setSelectedRoomData] = useState<any>(null);
    const [nome, setNome] = useState<string>('');
    const [capacity, setCapacity] = useState<number>(0);
    const [active, setActive] = useState<boolean>(true);

    const handleWeekChange = (weekStart: Date, weekEnd: Date) => {
        setSelectedWeekStart(weekStart);
        setSelectedWeekEnd(weekEnd);
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
                {room.active ? <Power size={20} style={{cursor: 'pointer'}} onClick={() => toggleActiveRoom(room.id)} /> : <PowerOff size={20} style={{color: 'var(--color-error)', cursor: 'pointer'}} onClick={() => toggleActiveRoom(room.id)} />}
                <PencilLine size={20} onClick={() => editar(room)} style={{cursor: 'pointer'}} />
            </div>
        );
    }

    const getWeekDates = () => {
        const weekDates = [];
        const startDate = new Date(selectedWeekStart);
        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            weekDates.push(date);
        }
        return weekDates;
    }

    const getWeekListAsTableHeader = () => {
        const weekDaysList = getWeekDates();

        const headerDaysList: any[] = weekDaysList.map((day) => {
            return {
                key: day.toISOString().split('T')[0],
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
                    const dateString = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD

                    const dataChegada = occupation?.ocupacoes[0]?.data_chegada;
                    const dataSaida = occupation?.ocupacoes[0]?.data_saida;
                    
                    // Check if this room is occupied on this date (checking if the date is in between ocupacoes.data_chegada and ocupacoes.data_saida)
                    const isOccupied = dateString >= dataChegada && dateString <= dataSaida;
    
                    // Add the day status to the room data
                    roomData[dateString] = 
                        isOccupied ? 
                        <span className={styles.occupied}><div className={styles.occupiedIcon}/> Ocupado</span>
                        : 
                        <span className={styles.available}><div className={styles.availableIcon}/> Disponível</span>;
                });
    
                return roomData;
            });

            // Ordenar quartos por nome
            quartos.sort((a: any, b: any) => a.numero.localeCompare(b.numero));
            
            setQuartos(quartos);
            console.log(quartos);
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

    useEffect(() => {
        getWeekListAsTableHeader();

        if (!(selectedWeekEnd < new Date())) {
            fetchRooms();
        }
    }, [selectedWeekStart, selectedWeekEnd]);

    useEffect(() => {
        fetchRooms();
    }, []);

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

    return (
        <div className={styles.container}>
            <Card>
                <CardHeader title="Quartos" breadcrumb={["Início", "Hospedagem", "Quartos"]} />

                <SearchSection
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
                    <Button key="filter" variant="full-white" iconLeft={<Filter size={24} />}>Filtrar</Button>,
                    <Button onClick={() => setShowNewRoomModal(true)} key="new_room" variant="full" iconLeft={<Plus size={20} />}>Novo quarto</Button>
                    ]
                    }
                />

                <Table
                    headerItems={[
                        { key: "numero", label: "Nome" },
                        ...weekDaysList,
                        { key: "acao", label: "Ação" },
                    ]}
                    rowItems={quartos}
                    itemsPerPage={8}
                />
            </Card>

            <Modal
                title="Cadastrar novo quarto"
                buttons={
                    <>
                        <Button variant="full-white" style={{color: 'var(--color-error)', borderColor: 'var(--color-error)'}} onClick={() => setShowNewRoomModal(false)}>Cancelar</Button>
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
                        <Button variant="full-white" style={{color: 'var(--color-error)', borderColor: 'var(--color-error)'}} onClick={() => setShowEditRoomModal(false)}>Cancelar</Button>
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
        </div>
    );
}
