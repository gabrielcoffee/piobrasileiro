'use client'

import React, { useEffect, useState, useCallback } from 'react';
import styles from './page.module.css';
import Card from '@/components/desktop/Card';
import CardHeader from '@/components/desktop/CardHeader';
import Table from '@/components/admin/Table';
import SearchSection from '@/components/admin/SearchSection';
import { Check, PencilLine, Plus, Printer, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { convertBufferToBase64, getCurrentWeekInfo, getDateString, queryApi } from '@/lib/utils';
import { generateReportPDFLib } from '@/lib/reportUtils';
import { DateSection } from '@/components/admin/DateSection';
import Modal from '@/components/admin/Modal';
import ReportCheckList from '@/components/refeicoes/ReportCheckList';
import AddGuestAdminModal from '@/components/admin/AddGuestAdminModal';
import AddUserMealModal from '@/components/admin/AddUserMealModal';
import { Loading } from '@/components/ui/Loading';
import { useAuth } from '@/contexts/AuthContext';

export default function ListaDeRefeicoesPage() {

    const { isLoading, setIsLoading } = useAuth();

    const [refeicoes, setRefeicoes] = useState([]);
    const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [dayInfo, setDayInfo] = useState<any>(null);
    const [selectedWeekStart, setSelectedWeekStart] = useState<Date>(new Date());
    const [selectedWeekEnd, setSelectedWeekEnd] = useState<Date>(new Date());
    const [showReportModal, setShowReportModal] = useState<boolean>(false);
    const [showNewBookingModal, setShowNewBookingModal] = useState<boolean>(false);
    const [showGuestBookingModal, setShowGuestBookingModal] = useState<boolean>(false);
    const [showResidentBookingModal, setShowResidentBookingModal] = useState<boolean>(false);
    const [showGuestBookingEditModal, setShowGuestBookingEditModal] = useState<boolean>(false);
    const [showResidentBookingEditModal, setShowResidentBookingEditModal] = useState<boolean>(false);
    const [selectedGuestMealData, setSelectedGuestMealData] = useState<any>(null);
    const [selectedResidentMealData, setSelectedResidentMealData] = useState<any>(null);
    const [guestFormData, setGuestFormData] = useState<any>(null);
    const [residentFormData, setResidentFormData] = useState<any>(null);
    const [reportDays, setReportDays] = useState<{
        monday: boolean;
        tuesday: boolean;
        wednesday: boolean;
        thursday: boolean;
        friday: boolean;
        saturday: boolean;
        sunday: boolean;
    } | null>(null);


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


    const handleGenerateReport = async () => {

        if (refeicoes.length === 0) {
            return;
        }

        const result = await queryApi('POST', '/admin/report', {
            startDate: selectedWeekStart,
            endDate: selectedWeekEnd,
        });

        if (result.success) {
            const { weekInfo, notesInfo } = result.data;
            console.log(weekInfo);
            generateReportPDFLib('print', weekInfo, notesInfo);
        } else {
            console.error('Erro ao buscar dados:', result.error);
        }
    }

    const handleDaysChange = (days: {
        monday: boolean;
        tuesday: boolean;
        wednesday: boolean;
        thursday: boolean;
        friday: boolean;
        saturday: boolean;
        sunday: boolean;
    }) => {
        setReportDays(days);
    }

    const getDayInfo = useCallback((date?: string) => {
        const selectedDay = date || selectedDate;
        const dateMeals = refeicoes.filter((refeicao: any) => refeicao.data === selectedDay);

        const totalAlmoco = dateMeals.filter((refeicao: any) => refeicao.almoco === 'No Colégio Pio' || refeicao.almoco === 'Para Levar').length || 0 ;
        const totalAlmocoLevar = dateMeals.filter((refeicao: any) => refeicao.almoco === 'Para Levar').length || 0 ;
        const totalAlmocoColegio = dateMeals.filter((refeicao: any) => refeicao.almoco === 'No Colégio Pio').length || 0 ;
        const totalJanta = dateMeals.filter((refeicao: any) => refeicao.jantar === 'No Colégio Pio').length || 0 ;

        return {
            totalAlmoco : totalAlmoco,
            totalAlmocoLevar : totalAlmocoLevar,
            totalAlmocoColegio : totalAlmocoColegio,
            totalJanta : totalJanta,
            totalRefeicoes: totalAlmoco + totalJanta,
        }
    }, [refeicoes, selectedDate])

    // Update dayInfo when refeicoes or selectedDate changes
    useEffect(() => {
        setDayInfo(getDayInfo());
    }, [getDayInfo]);

    useEffect(() => {
        if (selectedWeekStart && selectedWeekEnd) {
            fetchRefeicoes(selectedWeekStart, selectedWeekEnd);
        }
    }, [selectedWeekStart, selectedWeekEnd]);

    // Initialize with current week
    useEffect(() => {
        const now = new Date();
        const currentWeekInfo = getCurrentWeekInfo();
        setSelectedWeekStart(currentWeekInfo.monday);
        setSelectedWeekEnd(currentWeekInfo.sunday);
        setSelectedWeek(now);
        setSelectedDate(now.toISOString().split('T')[0]);
        fetchRefeicoes(currentWeekInfo.monday, currentWeekInfo.sunday);
    }, []);

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

    const fetchRefeicoes = async (startDate: Date, endDate: Date) => {
        const result = await queryApi('POST', '/admin/meals/data', {
            startDate: startDate,
            endDate: endDate,
        });

        if (result.success) {

            // Map the meals to be shown on the table
            const meals = result.data.meals.map((meal: any) => {
                const avatar = meal.avatar_image_data ? convertBufferToBase64(meal.avatar_image_data) : '/user.png';

                return {
                    ...meal,
                    rawData: meal,
                    nome: <span className={styles.nomeCompleto}><img src={avatar} alt="Avatar" className={styles.avatar} />{meal.nome} </span>,
                    almoco: getAlmocoText(meal.almoco_colegio, meal.almoco_levar),
                    tipo_usuario: getTipoUsuarioText(meal.tipo_pessoa),
                    jantar: meal.janta_colegio ? 'No Colégio Pio' : <X style={{color: 'var(--color-error)'}} />,
                    data: meal.data.split('T')[0],
                    acao: acoes(meal),
                }
          
            });

            setRefeicoes(meals);
        } else {
            console.log('Erro ao buscar refeicoes');
        }
    }

    // Handle week change from DateSection
    const handleWeekChange = (weekStart: Date, weekEnd: Date) => {
        setSelectedWeekStart(weekStart);
        setSelectedWeekEnd(weekEnd);
        
        const now = new Date();
        const currentWeekStart = getCurrentWeekInfo().monday;
        
        // If it's the current week, select today's date
        if (weekStart.getTime() === currentWeekStart.getTime()) {
            setSelectedDate(now.toISOString().split('T')[0]);
        } else {
            // For past or future weeks, select Monday (first day)
            setSelectedDate(weekStart.toISOString().split('T')[0]);
        }
    };

    const currentWeekDaysButtons = () => {
        // Generate dates for the selected week
        const weekDates = getWeekDates();

        const weekDayButtons = weekDates.map((date: Date, index: number) => {
            const dateString = date.toISOString().split('T')[0];
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const isPast = date < today;

            const isSelected = dateString === selectedDate;
            
            return (
                <div 
                    key={index} 
                    className={`${styles.daySelector} ${isPast ? styles.passed : ""} ${isSelected ? styles.selected : ""}`}
                    onClick={() => {setSelectedDate(dateString); setDayInfo(getDayInfo(dateString));}}
                >
                    <button 
                        className={styles.dayButton}
                    >
                        <span>{date.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase()}</span>
                        <span>{date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</span>
                    </button>
                </div>
            )
        })

        return weekDayButtons;
    }

    const handleGuestBooking = () => {
        setShowNewBookingModal(false);
        setShowGuestBookingModal(true);
    }

    const handleResidentBooking = () => {
        setShowNewBookingModal(false);
        setShowResidentBookingModal(true);
    }

    const handleGuestBookingEdit =  async () => {

        if (!guestFormData) {
            console.log('Não há dados para editar');
            return;
        }
        if (!guestFormData.nome || !guestFormData.funcao || !guestFormData.origem || !guestFormData.data) {
            console.log('Não há dados para editar 2');
            return;
        }

        const result = await queryApi('PUT', `/admin/guestmeals/${selectedGuestMealData.id}`, {
            anfitriao_id: guestFormData.anfitriao_id,
            data: guestFormData.data,
            almoco_colegio: guestFormData.almoco_colegio,
            almoco_levar: guestFormData.almoco_levar,
            janta_colegio: guestFormData.janta_colegio,
            observacoes: guestFormData.observacoes,
        });

        if (result.success) {
            console.log('Refeicao editada com sucesso');
            fetchRefeicoes(selectedWeekStart, selectedWeekEnd);
            setShowGuestBookingEditModal(false);
        } else {
            console.log('Não foi possível editar a refeição');
        }
    }

    const handleGuestBookingSave = async () => {

        if (!guestFormData) {
            return;
        }
        if (!guestFormData.nome || !guestFormData.funcao || !guestFormData.origem || !guestFormData.data) {
            return;
        }

        setShowGuestBookingModal(false);

        const result = await queryApi('POST', '/admin/guestmeals', {
            anfitriao_id: guestFormData.anfitriao_id,
            data: guestFormData.data,
            nome: guestFormData.nome,
            funcao: guestFormData.funcao,
            origem: guestFormData.origem,
            almoco_colegio: guestFormData.almoco_colegio,
            almoco_levar: guestFormData.almoco_levar,
            janta_colegio: guestFormData.janta_colegio,
            observacoes: guestFormData.observacoes,
        });

        if (result.success) {
            setShowGuestBookingModal(false);
            console.log('Convidados salvo com sucesso');
            fetchRefeicoes(selectedWeekStart, selectedWeekEnd);

        } else {
            console.log('Erro ao salvar convida');
            setShowGuestBookingModal(false);
        }
    }

    const handleGuestBookingEditDelete = () => {
        setShowGuestBookingEditModal(false);
        fetchRefeicoes(selectedWeekStart, selectedWeekEnd);
    }

    const editar = (meal: any) => {

        if (meal.tipo_pessoa === 'convidado') {
            setSelectedGuestMealData(meal);
            setShowGuestBookingEditModal(true);
        } else if (meal.tipo_pessoa === 'usuario') {
            setSelectedResidentMealData(meal);
            setShowResidentBookingEditModal(true);
        }
    }

    const handleResidentBookingSave = async () => {

        if (!checkResidentAvaliability()) {
            console.log('Não há disponibilidade para salvar');
            return;
        }

        if (!residentFormData) {
            console.log('Não há dados para salvar');
            return;
        }
        if (!residentFormData.usuario_id || !residentFormData.data || !(residentFormData.almoco_colegio || residentFormData.janta_colegio)) {
            console.log('Não há dados para salvar 2');
            return;
        }

        const result = await queryApi('POST', `/admin/meals/${residentFormData.usuario_id}`, {
            usuario_id: residentFormData.usuario_id,
            data: residentFormData.data.split('T')[0],
            almoco_colegio: residentFormData.almoco_colegio,
            almoco_levar: residentFormData.almoco_levar,
            janta_colegio: residentFormData.janta_colegio,
        });

        if (result.success) {
            console.log('Refeicao salva com sucesso');
            setShowResidentBookingModal(false);
            fetchRefeicoes(selectedWeekStart, selectedWeekEnd);
        } else {
            console.log(result.message);
        }
    }

    const handleResidentBookingEdit = async () => {

        console.log(residentFormData);

        if (!residentFormData) {
            console.log('Não há dados para editar');
            return;
        }
        if (!(residentFormData.almoco_colegio || residentFormData.janta_colegio)) {
            console.log('Não se pode salvar sem almoço ou jantar');
            return;
        }

        const result = await queryApi('PUT', `/admin/meals/${selectedResidentMealData.id}`, {
            almoco_colegio: residentFormData.almoco_colegio,
            almoco_levar: residentFormData.almoco_levar,
            janta_colegio: residentFormData.janta_colegio,
        });

        if (result.success) {
            console.log('Refeicao editada com sucesso');
            fetchRefeicoes(selectedWeekStart, selectedWeekEnd);
            setShowResidentBookingEditModal(false);
        } else {
            console.log('Erro ao editar refeicao');
        }
    }

    const acoes = (meal: any) => {
        if (meal.tipo_pessoa === 'hospede') {
            return (
                <div className={styles.acoes}>
                    <PencilLine size={20} style={{color: 'var(--color-slate-300)', cursor: 'not-allowed'}} />
                </div>
            )
        }
        return (
            <div className={styles.acoes}>
                <PencilLine size={20} onClick={() => editar(meal)} style={{color: 'var(--color-primary)', cursor: 'pointer'}} />
            </div>
        )
    }

    const handleGuestFormData = useCallback((formData: any) => {
        setGuestFormData(formData);
    }, []);

    const handleResidentFormData = useCallback((formData: any) => {
        setResidentFormData(formData);
    }, []);

    const checkResidentAvaliability = () => {
        return residentFormData?.usuario_id && residentFormData?.data && (residentFormData?.almoco_colegio || residentFormData?.janta_colegio) 
        && !refeicoes.some((refeicao: any) => {
            return refeicao.data === residentFormData.data.split('T')[0] && refeicao.usuario_id === residentFormData.usuario_id
        });
    }

    return (
        <div className={styles.container}>
            <Card>
                <CardHeader title="Lista de usuários" breadcrumb={["Início", "Refeições"]} />

                <SearchSection
                    searchPlaceholder="Pesquise por nome"
                    dateSection={(
                    <DateSection
                        selectedWeekStart={selectedWeekStart}
                        selectedWeekEnd={selectedWeekEnd}
                        onWeekChange={handleWeekChange}
                    />
                    )}
                    buttons={[
                        <Button key="report" variant="full-white" iconLeft={<Printer size={20}/>} onClick={() => setShowReportModal(true)}>Gerar Relatório</Button>,
                        <Button key="new_booking" variant="full" onClick={() => setShowNewBookingModal(true)} iconLeft={<Plus size={20} />}>Novo agendamento</Button>
                    ]}
                />
                
                <div className={styles.dateHeader}>
                    {dayInfo && (
                    <div className={styles.dayInfoTotal}>
                        <div className={styles.curDate}>
                            <span className={styles.curDateText}>
                                Nº de refeições: <strong>{new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long'}).charAt(0).toUpperCase() 
                                    + new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long'}).slice(1)}

                                , {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                </strong>
                            </span>
                        </div>

                        <div className={styles.dayInfo}>
                            <div className={styles.almoco}>
                                <span className={styles.bigNum}>{dayInfo.totalAlmoco}</span>
                                <span>almoços</span>
                            </div>
                            <div className={styles.almocoOpcoes}>
                                <span><strong>{dayInfo.totalAlmocoColegio}</strong> No Colégio PIO</span>
                                <span><strong>{dayInfo.totalAlmocoLevar}</strong> Para Levar</span>
                            </div>
                            <div className={styles.totalJanta}>
                                <span className={styles.bigNum}>{dayInfo.totalJanta}</span>
                                <span>jantares</span>
                            </div>
                        </div>
                       
                    </div>
                    )}

                    <div className={styles.daySelector}>
                        {currentWeekDaysButtons()}
                    </div>
                </div>

                {isLoading ? <Loading /> : (
                <>

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
                    rowItems={
                        refeicoes.filter((refeicao: any) => {
                        return refeicao.data === selectedDate;
                    }).map((refeicao: any) => {
                        return {
                            ...refeicao,
                            data: getDateString(refeicao.data),
                        }
                    })
                    }
                    itemsPerPage={7}
                    hasSelector={true}
                />

                <Modal
                    isOpen={showReportModal}
                    onClose={() => setShowReportModal(false)}
                    subtitle={"Relário da semana: " + selectedWeekStart.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit'}) + " a " + selectedWeekEnd.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit'})}
                    title="Gerar Relatório"
                    buttons={
                        <>
                            <Button variant="full-white" style={{color: 'var(--color-error)', borderColor: 'var(--color-error)'}} onClick={() => setShowReportModal(false)}>Cancelar</Button>
                            <Button iconLeft={<Printer size={20} />} variant="full" onClick={handleGenerateReport}>Gerar</Button>
                        </>
                    }
                >
                    <div className={styles.reportModalContent}>
                        <ReportCheckList onChange={handleDaysChange}/>
                    </div>
                </Modal>

                <Modal
                    isOpen={showNewBookingModal}
                    onClose={() => setShowNewBookingModal(false)}
                    title="Novo agendamento"
                    subtitle="Selecione o tipo de agendamento que deseja"
                    buttons={
                        <>
                            <Button variant="full" onClick={() => handleGuestBooking()}>Convidado</Button>
                            <Button variant="full-white" onClick={() => handleResidentBooking()}>Morador</Button>
                        </>
                    }
                />


                {/* ADICIONAR NOVO CONVIDADO */}
                <Modal
                    isOpen={showGuestBookingModal}
                    onClose={() => setShowGuestBookingModal(false)}
                    title="Novo agendamento convidado"
                    buttons={<>
                        <Button variant="full-white" style={{color: 'var(--color-error)', borderColor: 'var(--color-error)'}} onClick={() => setShowGuestBookingModal(false)}>Cancelar</Button>
                        <Button available={guestFormData?.nome && guestFormData?.funcao && guestFormData?.origem && guestFormData?.data && (guestFormData?.almoco_colegio || guestFormData?.janta_colegio) ? true : false} variant="full" iconLeft={<Check size={20} />} onClick={() => handleGuestBookingSave()}>Salvar</Button>
                    </>}
                >
                    <AddGuestAdminModal 
                        date={selectedDate}
                        formData={handleGuestFormData}
                    />
                </Modal>

                {/* EDITAR CONVIDADO */}
                <Modal
                    isOpen={showGuestBookingEditModal}
                    onClose={() => setShowGuestBookingEditModal(false)}
                    title="Editar agendamento convidado"
                    buttons={<>
                        <Button variant="full-white" style={{color: 'var(--color-error)', borderColor: 'var(--color-error)'}} onClick={() => setShowGuestBookingEditModal(false)}>Cancelar</Button>
                        <Button onClick={() => handleGuestBookingEdit()} available={guestFormData?.nome && guestFormData?.funcao && guestFormData?.origem && guestFormData?.data ? true : false} variant="full" iconLeft={<Check size={20} />}>Salvar</Button>
                    </>}
                >
                    <AddGuestAdminModal 
                        onDeleteGuest={() => handleGuestBookingEditDelete()}
                        date={selectedDate}
                        guestMealData={selectedGuestMealData}
                        formData={handleGuestFormData}
                        isEdit={true}
                    />
                </Modal>

                {/* NOVA REFEICAO MORADOR */}
                <Modal
                    isOpen={showResidentBookingModal}
                    onClose={() => setShowResidentBookingModal(false)}
                    title="Novo agendamento morador"
                    buttons={
                        <>
                            <Button variant="full-white" style={{color: 'var(--color-error)', borderColor: 'var(--color-error)'}} onClick={() => setShowResidentBookingModal(false)}>Cancelar</Button>
                            <Button available={checkResidentAvaliability()} variant="full" iconLeft={<Check size={20} />} onClick={() => handleResidentBookingSave()}>Salvar</Button>
                        </>
                    }
                >
                    <AddUserMealModal
                        date={new Date(selectedDate + 'T00:00:00').toISOString()}
                        formData={handleResidentFormData}
                    />
                </Modal>

                {/* EDITAR REFEICAO MORADOR */}
                <Modal
                    isOpen={showResidentBookingEditModal}
                    onClose={() => setShowResidentBookingEditModal(false)}
                    title="Editar agendamento morador"
                    buttons={<>
                        <Button variant="full-white" style={{color: 'var(--color-error)', borderColor: 'var(--color-error)'}} onClick={() => setShowResidentBookingEditModal(false)}>Cancelar</Button>
                        <Button onClick={() => handleResidentBookingEdit()} available={residentFormData?.almoco_colegio || residentFormData?.janta_colegio ? true : false} variant="full" iconLeft={<Check size={20} />}>Salvar</Button>
                    </>}
                >
                    <AddUserMealModal
                        date={new Date(selectedDate + 'T00:00:00').toISOString()}
                        isEdit={true}
                        userMealData={selectedResidentMealData}
                        formData={handleResidentFormData}
                    />
                </Modal>
                </>)}
            </Card>
        </div>
    );
}
