import { medicationsList } from "@/data/medicationTimeListFake.ts";
import { MedicationTimeGroup } from "@/components/home/MedicationTimeGroup.tsx";

export default function Home() {
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
            <div className="mt-12 text-black text-base font-normal leading-normal">Sex, 13 de Setembro</div>
            <div className="flex-1 max-h-screen w-full overflow-y-auto mt-4 pb-6">
                {medicationsList.map((item, index) => (
                    <MedicationTimeGroup
                        key={index}
                        id={item.id}
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

