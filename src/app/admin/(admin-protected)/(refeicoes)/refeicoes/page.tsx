'use client'

import React, { useEffect, useState, useCallback } from 'react';
import styles from './page.module.css';
import Card from '@/components/desktop/Card';
import CardHeader from '@/components/desktop/CardHeader';
import Table from '@/components/admin/Table';
import SearchSection from '@/components/admin/SearchSection';
import { Check, Info, PencilLine, Plus, Printer, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { convertBufferToBase64, getCurrentWeekInfo, getDateString, getInitials, queryApi } from '@/lib/utils';
import { generateReportPDFLib } from '@/lib/reportUtils';
import { DateSection } from '@/components/admin/DateSection';
import Modal from '@/components/admin/Modal';
import ReportCheckList from '@/components/refeicoes/ReportCheckList';
import AddGuestAdminModal from '@/components/admin/AddGuestAdminModal';
import AddUserMealModal from '@/components/admin/AddUserMealModal';
import { Loading } from '@/components/ui/Loading';
import { useAuth } from '@/contexts/AuthContext';
import MobileTitle from '@/components/admin/MobileTitle';
import SaveFooterAdmin from '@/components/admin/SaveFooterAdmin';
import { useToast } from '@/contexts/ToastContext';
import Tooltip from '@/components/admin/Tooltip';

export default function ListaDeRefeicoesPage() {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { showToast } = useToast();

    const [refeicoes, setRefeicoes] = useState([]);
    const today = new Date();
    const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
    // Helper to format a Date as YYYY-MM-DD in LOCAL time (avoids UTC shifts)
    const toLocalYMD = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [selectedDate, setSelectedDate] = useState<string>(toLocalYMD(new Date()));
    const [dayInfo, setDayInfo] = useState<any>(null);
    const [selectedWeekStart, setSelectedWeekStart] = useState<Date>(new Date());
    const [selectedWeekEnd, setSelectedWeekEnd] = useState<Date>(new Date());
    const [showReportModal, setShowReportModal] = useState<boolean>(false);
    const [showNewBookingModal, setShowNewBookingModal] = useState<boolean>(false);
    const [showGuestBookingModal, setShowGuestBookingModal] = useState<boolean>(false);
    const [showResidentBookingModal, setShowResidentBookingModal] = useState<boolean>(false);
    const [showHospedeBookingModal, setShowHospedeBookingModal] = useState<boolean>(false);
    const [showGuestBookingEditModal, setShowGuestBookingEditModal] = useState<boolean>(false);
    const [showResidentBookingEditModal, setShowResidentBookingEditModal] = useState<boolean>(false);
    const [showHospedeBookingEditModal, setShowHospedeBookingEditModal] = useState<boolean>(false);
    const [hospedeFormData, setHospedeFormData] = useState<any>(null);
    const [selectedHospedeMealData, setSelectedHospedeMealData] = useState<any>(null);
    const [selectedGuestMealData, setSelectedGuestMealData] = useState<any>(null);
    const [selectedResidentMealData, setSelectedResidentMealData] = useState<any>(null);
    const [guestFormData, setGuestFormData] = useState<any>(null);
    const [residentFormData, setResidentFormData] = useState<any>(null);
    const [searchText, setSearchText] = useState<string>('');
    const [isMobile, setIsMobile] = useState<boolean>(false);
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

        const hasDays = reportDays?.monday || reportDays?.tuesday || reportDays?.wednesday || reportDays?.thursday || reportDays?.friday || reportDays?.saturday || reportDays?.sunday;

        if (!hasDays) {
            return;
        }

        const result = await queryApi('POST', '/admin/report', {
            startDate: selectedWeekStart,
            endDate: selectedWeekEnd,
        });

        if (result.success) {

            const { weekInfo, notesInfo } = result.data;

            const reportAllowedDays = {
                0: reportDays?.monday,
                1: reportDays?.tuesday,
                2: reportDays?.wednesday,
                3: reportDays?.thursday,
                4: reportDays?.friday,
                5: reportDays?.saturday,
                6: reportDays?.sunday,
            }

            // Filter weekInfo.daysInfo array based on reportAllowedDays
            const filteredWeekInfo = {
                ...weekInfo,
                daysInfo: weekInfo.daysInfo.filter((dayInfo: any, index: number) => {
                    return reportAllowedDays[index as keyof typeof reportAllowedDays];
                })
            };

            const notesInfoNoBreaks = notesInfo.map((n: any) => {
                return {
                    name: n.name,
                    note: n.note.replace(/\n/g, ' ').trim()
                }
            })

            generateReportPDFLib('print', filteredWeekInfo, notesInfoNoBreaks);
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
    
        const totalAlmoco = dateMeals.filter((r: any) => r.almoco === 'No Colégio Pio' || r.almoco === 'Para Levar').length;
        const totalAlmocoLevar = dateMeals.filter((r: any) => r.almoco === 'Para Levar').length;
        const totalAlmocoColegio = dateMeals.filter((r: any) => r.almoco === 'No Colégio Pio').length;
        const totalJanta = dateMeals.filter((r: any) => r.jantar === 'No Colégio Pio').length;
    
        return {
            totalAlmoco,
            totalAlmocoLevar,
            totalAlmocoColegio,
            totalJanta,
            totalRefeicoes: totalAlmoco + totalJanta,
        };
    }, [refeicoes, selectedDate]);

    function getAlmocoText(almoco_colegio: boolean, almoco_levar: boolean) {
        if (almoco_colegio) {
            if (almoco_levar) {
                return 'Para Levar';
            } else {
                return 'No Colégio Pio';
            }
        } else {
            return <X className={styles.icon} />
        }
    }

    function getTipoUsuarioText(meal: any) {

        const tipo_pessoa = meal.tipo_pessoa;

        if (tipo_pessoa === 'usuario') {
            return 'Comum';
        } else if (tipo_pessoa === 'hospede') {
            return 'Hóspede';
        } else if (tipo_pessoa === 'convidado') {
            return (
            <div>
                <div className={styles.convidado}>
                    Convidado 
                    <Info size={18} style={{color: 'var(--color-primary)', cursor: 'help'}} className={styles.infoIcon}/>
                    <div className={styles.convidadoInfo}>
                        <span><strong>Anfitrião: </strong>{meal.anfitriao_nome}</span>
                        <span>
                        <strong>Observações sobre a refeição: </strong>
                        {meal.observacoes && meal.observacoes.length > 0
                            ? (meal.observacoes.length > 100
                                ? meal.observacoes.slice(0, 100) + '...'
                                : meal.observacoes)
                            : 'Nenhuma observação'}
                        </span>
                    </div>
                </div>
            </div>
            );
        }
        return 'Comum';
    }

    const fetchRefeicoes = useCallback(async (startDate: Date, endDate: Date) => {
        setIsLoading(true);
        const result = await queryApi('POST', '/admin/meals/data', { startDate, endDate });
    
        if (result.success) {
            const meals = result.data.meals.map((meal: any) => {
                const avatar = meal.avatar_image_data ? convertBufferToBase64(meal.avatar_image_data) : '/user.png';
                return {
                    ...meal,
                    rawData: meal,
                    nome_limpo: meal.nome.toLowerCase(),
                    nome: 
                        <span className={styles.nomeCompleto}>
                            {meal.avatar_image_data !== null ? (
                                <img className={styles.avatar} src={avatar} alt="Avatar" />
                            ) : (
                                <span translate="no" className={styles.avatarInitials}>{getInitials(meal.nome)}</span>
                            )}
                            <span translate="no">{meal.nome}</span>
                        </span>,
                    almoco: getAlmocoText(meal.almoco_colegio, meal.almoco_levar),
                    tipo_usuario: getTipoUsuarioText(meal),
                    jantar: meal.janta_colegio ? 'No Colégio Pio' : <X className={styles.icon} />,
                    data: meal.data.split('T')[0],
                    acao: acoes(meal),
                };
            }).sort((a: any, b: any) => a.nome_limpo.localeCompare(b.nome_limpo));
    
            setRefeicoes(meals);
        } else {
            console.log('Erro ao buscar refeicoes');
        }
        setIsLoading(false);
    }, [getAlmocoText, getTipoUsuarioText]);
    

    // Handle week change from DateSection
    const handleWeekChange = (weekStart: Date, weekEnd: Date) => {
        setSelectedWeekStart(weekStart);
        setSelectedWeekEnd(weekEnd);
        
        const now = new Date();
        const currentWeekStart = getCurrentWeekInfo().monday;
        
        // If it's the current week, select today's date
        if (weekStart.getTime() === currentWeekStart.getTime()) {
            setSelectedDate(toLocalYMD(now));
        } else {
            // For past or future weeks, select Monday (first day)
            setSelectedDate(toLocalYMD(weekStart));
        }
    };

    const currentWeekDaysButtons = () => {
        // Generate dates for the selected week
        const weekDates = getWeekDates();

        const weekDayButtons = weekDates.map((date: Date, index: number) => {
            const dateString = toLocalYMD(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const isPast = toLocalYMD(date) < toLocalYMD(today);

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
                        <span translate="no" className={styles.desktopDaySelectorText}>{date.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase()}</span>
                        <span translate="no" className={styles.desktopDaySelectorText}>{date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</span>

                        <span translate="no" className={styles.mobileDaySelectorText}>{date.toLocaleDateString('pt-BR', { weekday: 'long' }).toUpperCase().split('-')[0]}</span>
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
            setShowGuestBookingEditModal(false);
            await fetchRefeicoes(selectedWeekStart, selectedWeekEnd);
            showToast('Agendamento editado com sucesso', 'success');
        } else {
            console.log('Não foi possível editar a refeição');
            showToast('Ops! Algo deu errado. Tente novamente.', 'error');
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
            await fetchRefeicoes(selectedWeekStart, selectedWeekEnd);
            showToast('Agendamento salvo com sucesso', 'success');

        } else {
            console.log('Erro ao salvar convida');
            setShowGuestBookingModal(false);
            showToast('Ops! Algo deu errado. Tente novamente.', 'error');
        }
    }

    const handleGuestBookingEditDelete = async () => {
        setShowGuestBookingEditModal(false);
        await fetchRefeicoes(selectedWeekStart, selectedWeekEnd);
    }

    const handleHospedeBookingEdit = async () => {

        if (!hospedeFormData) {
            return;
        }

        const result = await queryApi('PUT', `/admin/meals/${selectedHospedeMealData.id}`, {
            almoco_colegio: hospedeFormData.almoco_colegio,
            almoco_levar: hospedeFormData.almoco_levar,
            janta_colegio: hospedeFormData.janta_colegio,
        });

        if (result.success) {
            console.log('Hospede editado com sucesso');
            setShowHospedeBookingEditModal(false);
            await fetchRefeicoes(selectedWeekStart, selectedWeekEnd);
            showToast('Alterações salvas com sucesso', 'success');
        } else {
            console.log('Erro ao editar hospede');
            showToast('Ops! Algo deu errado. Tente novamente.', 'error');
        }
    }

    const editar = (meal: any) => {

        if (meal.tipo_pessoa === 'convidado') {
            setSelectedGuestMealData(meal);
            setShowGuestBookingEditModal(true);
        } else if (meal.tipo_pessoa === 'usuario') {
            setSelectedResidentMealData(meal);
            setShowResidentBookingEditModal(true);
        } else if (meal.tipo_pessoa === 'hospede') {
            setSelectedHospedeMealData(meal);
            setShowHospedeBookingEditModal(true);
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
            await fetchRefeicoes(selectedWeekStart, selectedWeekEnd);
            showToast('Agendamento salvo com sucesso', 'success');
        } else {
            console.log(result.message);
            showToast('Ops! Algo deu errado. Tente novamente.', 'error');
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
            setShowResidentBookingEditModal(false);
            await fetchRefeicoes(selectedWeekStart, selectedWeekEnd);
        } else {
            console.log('Erro ao editar refeicao');
        }
    }

    const acoes = (meal: any) => {
        return (
            <div className={styles.acoes}>
                <Tooltip text="Editar">
                    <PencilLine className={styles.actionButton} size={20} onClick={() => editar(meal)} />
                </Tooltip>
            </div>
        )
    }

    const handleHospedeFormData = useCallback((formData: any) => {
        setHospedeFormData(formData);
    }, []);

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

    const handleShowBookingModal = () => {
        if (selectedDate < toLocalYMD(today)) {
            setShowNewBookingModal(false);
            return;
        }
        if (selectedDate >= toLocalYMD(today)) {
            setShowNewBookingModal(true);
            return;
        }
    }

    // Initialize with current week
    useEffect(() => {
        // setting now date without time
        const now = new Date();
        const currentWeekInfo = getCurrentWeekInfo();
        setSelectedWeekStart(currentWeekInfo.monday);
        setSelectedWeekEnd(currentWeekInfo.sunday);
        setSelectedWeek(now);
        setSelectedDate(toLocalYMD(now));
    }, []);

    // Update dayInfo when refeicoes or selectedDate changes
    useEffect(() => {
        if (refeicoes.length > 0) {
            setDayInfo(getDayInfo());
        }
    }, [getDayInfo]);

    useEffect(() => {
        if (selectedWeekStart && selectedWeekEnd) {
            fetchRefeicoes(selectedWeekStart, selectedWeekEnd);
        }
    }, [selectedWeekStart, selectedWeekEnd]);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
    }, [window.innerWidth]);

        return (
            <>

            {!isMobile ? (

            <div className={styles.container}>
                <Card>
                    <CardHeader title="Lista de agendamento de refeições" breadcrumb={["Início", "Refeições"]} />

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
                                    <span>
                                        <strong className={styles.fullText}>{dayInfo.totalAlmocoColegio} No Colégio PIO</strong>
                                        <span className={styles.shortText}><strong>{dayInfo.totalAlmocoColegio} Colégio</strong></span>
                                    </span>
                                    <span>
                                        <strong className={styles.fullText}>{dayInfo.totalAlmocoLevar}</strong> <span className={styles.fullText}>Para Levar</span>
                                        <span className={styles.shortText}><strong>{dayInfo.totalAlmocoLevar}</strong> Levar</span>
                                    </span>
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

                    <SearchSection
                        searchText={searchText}
                        setSearchText={setSearchText}
                        searchPlaceholder="Pesquise por nome"
                        dateSection={(
                        <DateSection
                            selectedWeekStart={selectedWeekStart}
                            selectedWeekEnd={selectedWeekEnd}
                            onWeekChange={handleWeekChange}
                        />
                        )}
                        buttons={[
                            <Button key="report" variant="full-white" iconLeft={<Printer size={20}/>} onClick={() => setShowReportModal(true)}>Gerar relatório</Button>,
                            <Button available={selectedDate >= toLocalYMD(today)} key="new_booking" variant="full" onClick={() => {handleShowBookingModal()}} iconLeft={<Plus size={20} />}>Novo agendamento</Button> 
                        ]}
                    />

                    <Table
                        searchText={searchText} 
                        searchKey="nome_limpo"
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
                        isLoading={isLoading}
                    />
                </Card>
            </div>




        ) : (




            <div className={styles.mobileContainer}>

                <MobileTitle title={`Lista de agendamento de refeições`} />

                <div className={styles.dateHeader}>
                    {dayInfo && (
                    <div className={styles.dayInfoTotal}>

                        <div className={styles.dayInfo}>
                            <div className={styles.almoco}>
                                <span className={styles.bigNum}>{dayInfo.totalAlmoco}</span>
                                <span>almoços</span>
                            </div>
                            <div className={styles.almocoOpcoes}>
                                <span>
                                    <strong>{dayInfo.totalAlmocoColegio} No Colégio PIO</strong>
                                </span>
                                <span>
                                    <strong>{dayInfo.totalAlmocoLevar}</strong> Para Levar
                                </span>
                            </div>
                            <div className={styles.totalJanta}>
                                <span className={styles.bigNum}>{dayInfo.totalJanta}</span>
                                <span>jantares</span>
                            </div>
                        </div>
                    
                    </div>
                    )}

                    <SearchSection
                        searchText={searchText}
                        setSearchText={setSearchText}
                        searchPlaceholder="Pesquise por nome"
                        dateSection={(
                        <DateSection
                            selectedWeekStart={selectedWeekStart}
                            selectedWeekEnd={selectedWeekEnd}
                            onWeekChange={handleWeekChange}
                        />
                        )}
                        buttons={[]}
                    />

                    <div className={styles.daySelector}>
                        {currentWeekDaysButtons()}
                    </div>
                </div>

                <div className={styles.dateHeader}>
                    <span className={styles.dateText}>
                        {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long'}).toUpperCase()}, {' '}
                        {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </span>
                </div>

                <Table
                    searchText={searchText} 
                    searchKey="nome_limpo"
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
                    isLoading={isLoading}
                />

                <SaveFooterAdmin buttonText="Novo agendamento" executeFunction={() => handleShowBookingModal()} />
            </div>

        )}  

        {/* MODAL DO RELATÓRIO */}
        <Modal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        subtitle={"Relário da semana: " + selectedWeekStart.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit'}) + " a " + selectedWeekEnd.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit'})}
        title="Gerar Relatório"
        buttons={
            <>
                <Button variant="soft-red" onClick={() => setShowReportModal(false)}>Cancelar</Button>
                <Button available={
                    reportDays?.monday || reportDays?.tuesday || reportDays?.wednesday ||
                     reportDays?.thursday || reportDays?.friday || reportDays?.saturday ||
                      reportDays?.sunday}
                 iconLeft={<Printer size={20} />} variant="full" onClick={handleGenerateReport}>Gerar</Button>
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
        comesFromBottomMobile={true}
        isOpen={showGuestBookingModal}
        onClose={() => setShowGuestBookingModal(false)}
        title="Novo agendamento convidado"
        buttons={<>
            <Button variant="soft-red" onClick={() => setShowGuestBookingModal(false)}>Cancelar</Button>
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
        comesFromBottomMobile={true}
        isOpen={showGuestBookingEditModal}
        onClose={() => setShowGuestBookingEditModal(false)}
        title="Editar agendamento convidado"
        buttons={<>
            <Button variant="soft-red" onClick={() => setShowGuestBookingEditModal(false)}>Cancelar</Button>
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
        comesFromBottomMobile={true}
        isOpen={showResidentBookingModal}
        onClose={() => setShowResidentBookingModal(false)}
        title="Novo agendamento morador"
        buttons={
            <>
                <Button variant="soft-red" onClick={() => setShowResidentBookingModal(false)}>Cancelar</Button>
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
        comesFromBottomMobile={true}
        isOpen={showResidentBookingEditModal}
        onClose={() => setShowResidentBookingEditModal(false)}
        title="Editar agendamento morador"
        buttons={<>
            <Button variant="soft-red" onClick={() => setShowResidentBookingEditModal(false)}>Cancelar</Button>
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

    {/* EDITAR REFEICAO HOSPEDE */}
    <Modal
        comesFromBottomMobile={true}
        isOpen={showHospedeBookingEditModal}
        onClose={() => setShowHospedeBookingEditModal(false)}
        title="Editar agendamento hóspede"
        buttons={<>
            <Button variant="soft-red" onClick={() => setShowHospedeBookingEditModal(false)}>Cancelar</Button>
            <Button onClick={() => handleHospedeBookingEdit()} variant="full" iconLeft={<Check size={20} />}>Salvar</Button>
        </>}
    >
        <AddUserMealModal
            hospedeName={selectedHospedeMealData?.nome || ''}
            date={new Date(selectedDate + 'T00:00:00').toISOString()}
            isEdit={true}
            userMealData={selectedHospedeMealData}
            formData={handleHospedeFormData}
        />
    </Modal>
    </>)
}
