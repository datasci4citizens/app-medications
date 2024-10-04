import type { MedicationTime } from "@/data/medicationTimeListFake.ts";
import MedicationItem from "@/components/common/MedicationItem.tsx";

export function MedicationTimeGroup({time, medications}: MedicationTime) {
    return (
        <div className={"mb-16 w-full"}>
            <div className="text-black text-xl font-semibold mb-8 columns-1">{time}</div>
            {medications.map((med, index) => (
                <MedicationItem key={index} {...med} />
            ))}
        </div>
    );
}