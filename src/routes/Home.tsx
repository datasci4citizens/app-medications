import { medicationsList } from "@/data/medicationListFake.ts";
import { MedicationTimeGroup } from "@/components/home/MedicationItem.tsx";

export default function Home() {
    return (
        <div className="flex flex-col h-full w-full items-center">
            <div className="p-6">
                <div className="text-black text-2xl font-semibold leading-loose">Medicamentos do dia</div>
                <div className="text-black text-base font-normal leading-normal">Sex, 13 de Setembro</div>
            </div>
            <div className="flex-1 max-h-screen w-full overflow-y-auto px-6 pb-6">
                {medicationsList.map((item, index) => (
                    <MedicationTimeGroup key={index} {...item} />
                ))}
            </div>
        </div>
    );
}

