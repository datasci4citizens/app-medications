import MedicationItem from "@/components/common/MedicationItem.tsx";
import type { MedicationByTime } from "@/routes/Home/SchuduleMapper.tsx";

export function MedicationTimeGroup({time, medications}: MedicationByTime) {
    return (
        <div className={"mb-8 w-full"}>
            <div className="text-black text-xl font-semibold mb-4 columns-1">{time}</div>
            {medications.map((med, index) => (
                <MedicationItem key={index} {...med} />
            ))}
        </div>
    );
}