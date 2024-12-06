import { MedicationTimeGroup } from "@/components/home/MedicationTimeGroup.tsx";
import useSWRMutation from "swr/mutation";
import { getRequest } from "@/data/common/HttpExtensions.ts";
import { useEffect, useState } from "react";
import type { ScheduleResponse } from "@/routes/Home/SchuduleMapper.tsx";
import { getMedicationsByWeekday } from "@/routes/Home/SchuduleMapper.tsx";

export default function Home() {
    const [currentDate, setCurrentDate] = useState('');

    const {data, trigger} = useSWRMutation<ScheduleResponse[]>(`${import.meta.env.VITE_SERVER_URL}/schedule/schedule`, getRequest);
    useEffect(() => {
        const today = new Date();
        const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'long' };
        let formattedDate = today.toLocaleDateString('pt-BR', options);
        formattedDate = formattedDate.replace('.', '').replace(/^./, (str) => str.toUpperCase());
        setCurrentDate(formattedDate);

        trigger();
    }, [trigger]);

    const medications = getMedicationsByWeekday(data);
    console.log(medications);

    const handleCheck = (isChecked: Boolean, id: string) => {
        if (isChecked) {
            console.log(`Checked item with id: ${id}`);
        } else {
            console.log(`Unchecked item with id: ${id}`);
        }
    };

    return (
        <div className="flex flex-col h-full w-full px-8">
            <div className="flex w-full justify-center">
                <div className="text-black text-2xl font-semibold leading-loose">Medicamentos do dia</div>
            </div>
            <div className="mt-12 text-black text-base font-normal leading-normal">{currentDate}</div>
            <div className="flex-1 max-h-screen w-full overflow-y-auto mt-4 pb-6">
                {medications.map((item, index) => (
                    <MedicationTimeGroup
                        key={index}
                        time={item.time}
                        medications={item.medications.map((medication) => ({
                            ...medication,
                            onCheck: (isChecked) => handleCheck(isChecked, medication.id), // Provide onCheck here
                        }))}
                    />
                ))}
            </div>
        </div>
    );
}

