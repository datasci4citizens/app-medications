import { medicationsList } from "@/data/medicationListFake.ts";
import { MedicationTimeGroup } from "@/components/home/MedicationItem.tsx";

export default function Home() {
    return (
        <div className={"inline-block w-full p-8"}>
            <div className="text-black text-2xl font-semibold leading-loose">Medicamentos do dia</div>
            <div className="text-black text-base font-normal leading-normal">Sex, 13 de Setembro</div>
            <div className={"flex flex-col w-full h-screen mt-4 overflow-y-auto"}>
                {medicationsList.map((item, index) => (
                    <MedicationTimeGroup key={index} {...item} />
                ))}
            </div>
        </div>
    );
}

