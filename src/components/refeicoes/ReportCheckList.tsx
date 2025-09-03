'use client'
import { useEffect, useState } from 'react';
import styles from './styles/ReportCheckList.module.css';

type ReportCheckListProps = {
    onChange?: (days: {
      monday: boolean;
      tuesday: boolean;
      wednesday: boolean;
      thursday: boolean;
      friday: boolean;
      saturday: boolean;
      sunday: boolean;
    }) => void;
  };

export default function ReportCheckList({ onChange }: ReportCheckListProps) {

    const [allWeek, setAllWeek] = useState(true);

    const [monday, setMonday] = useState(true);
    const [tuesday, setTuesday] = useState(true);
    const [wednesday, setWednesday] = useState(true);
    const [thursday, setThursday] = useState(true);
    const [friday, setFriday] = useState(true);
    const [saturday, setSaturday] = useState(true);
    const [sunday, setSunday] = useState(true);

    useEffect(() => {
        onChange?.({
            monday,
            tuesday,
            wednesday,
            thursday,
            friday,
            saturday,
            sunday,
        })
    }, [monday, tuesday, wednesday, thursday, friday, saturday, sunday])

    const handleAllWeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (allWeek) {
            setMonday(false);
            setTuesday(false);
            setWednesday(false);
            setThursday(false);
            setFriday(false);
            setSaturday(false);
            setSunday(false);
            setAllWeek(false);
        } else {
            setMonday(true);
            setTuesday(true);
            setWednesday(true);
            setThursday(true);
            setFriday(true);
            setSaturday(true);
            setSunday(true);
            setAllWeek(true);
        }
    }

    useEffect(() => {
        if (monday && tuesday && wednesday && thursday && friday && saturday && sunday) {
            setAllWeek(true);
        } else {
            setAllWeek(false);
        }
    }, [allWeek, monday, tuesday, wednesday, thursday, friday, saturday, sunday]);

    return (
        <>
            <div className={styles.allWeekContainer}>
                <input onChange={handleAllWeekChange} checked={allWeek} type="checkbox" id="allweek"/>
                <label htmlFor="allweek">Semana toda</label>
            </div>
            <div className={styles.weekDays}>

                <div className={styles.weekDay}>
                    <input onChange={() => setMonday(!monday)} checked={monday} type="checkbox" id="seg"/>
                    <label htmlFor="seg">Segunda-feira</label>
                </div>

                <div className={styles.weekDay}>
                    <input onChange={() => setTuesday(!tuesday)} checked={tuesday} type="checkbox" id="ter"/>
                    <label htmlFor="ter">Terça-feira</label>
                </div>

                <div className={styles.weekDay}>
                    <input onChange={() => setWednesday(!wednesday)} checked={wednesday} type="checkbox" id="qua"/>
                    <label htmlFor="qua">Quarta-feira</label>
                </div>

                <div className={styles.weekDay}>
                    <input onChange={() => setThursday(!thursday)} checked={thursday} type="checkbox" id="qui"/>
                    <label htmlFor="qui">Quinta-feira</label>
                </div>

                <div className={styles.weekDay}>
                    <input onChange={() => setFriday(!friday)} checked={friday} type="checkbox" id="sex"/>
                    <label htmlFor="sex">Sexta-feira</label>
                </div>

                <div className={styles.weekDay}>
                    <input onChange={() => setSaturday(!saturday)} checked={saturday} type="checkbox" id="sab"/>
                    <label htmlFor="sab">Sábado</label>
                </div>

                <div className={styles.weekDay}>
                    <input onChange={() => setSunday(!sunday)} checked={sunday} type="checkbox" id="dom"/>
                    <label htmlFor="dom">Domingo</label>
                </div>

            </div>
        </>
    )
}