import { getDay } from 'date-fns';
import type { Presentation } from "@/data/common/Mapper.ts";
import type { Medication } from "@/components/common/MedicationItem.tsx";

interface DrugUse {
    id: number;
    start_date: string;
    end_date: string;
    observation: string;
    quantity: number;
    comercial_name: ComercialName;
    presentation: Presentation;
    status: string;
}

interface ComercialName {
    id: number;
    comercial_name: string;
    active_principles: ActivePrinciple[]
}

interface ActivePrinciple {
    id: number,
    code: string,
    active_ingredient: string
}

interface Schedule {
    id: number;
    type: string;
    value: number;
}

export interface ScheduleResponse {
    drug_use: DrugUse;
    schedules: Schedule[];
}

export interface MedicationByTime {
    time: number;
    medications: Medication[];
}

export function getMedicationsByWeekday(schedules: ScheduleResponse[] = []): MedicationByTime[] {

    console.log("SCHEDULES", schedules);
    const today = getDay(new Date());

    const medicationsByTime: MedicationByTime[] = [];

    schedules.forEach((schedule) => {
        console.log("schedule", schedule);
        const dailySchedules = schedule.schedules.filter((s) => s.type === 'D' && s.value === today);
        console.log("dailySchedules", dailySchedules);
        dailySchedules.forEach((dailySchedule) => {
            const hourlySchedules = schedule.schedules.filter((s) => s.type === 'H');
            hourlySchedules.forEach((hourlySchedule) => {
                console.log("hourlySchedule", hourlySchedule);
                const medication: Medication = {
                    id: hourlySchedule.id.toString(),
                    comercialNameId: schedule.drug_use.comercial_name.id,
                    presentationId: schedule.drug_use.presentation.id,
                    name: schedule.drug_use.comercial_name.comercial_name,
                    dosageStrength: schedule.drug_use.presentation.concentration,
                    hourSchedule: hourlySchedule.value,
                };

                console.log("MEDICATION", medication);

                const existingMedicationIndex = medicationsByTime.findIndex((item) => item.time === hourlySchedule.value);
                if (medicationsByTime[existingMedicationIndex]) {
                    medicationsByTime[existingMedicationIndex].medications.push(medication);
                } else {
                    medicationsByTime.push({
                        time: hourlySchedule.value,
                        medications: [medication],
                    });
                }
            });
        });
    });

    return medicationsByTime.sort((a, b) => a.time - b.time);

}