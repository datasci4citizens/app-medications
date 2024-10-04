import type { Medication } from "@/components/common/MedicationItem.tsx";

export interface MedicationTime {
    id: string;
    time: string;
    medications: Medication[];
}

export const medicationsList: MedicationTime[] = [
    {
        id: '1',
        time: '11:00',
        medications: [
            {
                id: "1",
                name: "Paracetamol",
                dosageStrength: "500mg",
                adultDosage: "500mg a cada 6 horas",
                pediatric_dosage: "250mg a cada 6 horas"
            },
            {
                id: "2",
                name: "Ibuprofeno",
                dosageStrength: "400mg",
                adultDosage: "400mg a cada 8 horas",
                pediatric_dosage: "200mg a cada 8 horas"
            },
            {
                id: "3",
                name: "Amoxicilina",
                dosageStrength: "500mg",
                adultDosage: "500mg a cada 8 horas",
                pediatric_dosage: "250mg a cada 8 horas"
            },
            {
                id: "4",
                name: "Atenolol",
                dosageStrength: "50mg",
                adultDosage: "50mg uma vez ao dia",
                pediatric_dosage: "Não recomendado"
            },
            {
                id: "5",
                name: "Omeprazol",
                dosageStrength: "20mg",
                adultDosage: "20mg uma vez ao dia",
                pediatric_dosage: "10mg uma vez ao dia"
            },
            {
                id: "6",
                name: "Simvastatina",
                dosageStrength: "40mg",
                adultDosage: "40mg uma vez ao dia",
                pediatric_dosage: "Não recomendado"
            },
        ]
    },
    {
        id: '2',
        time: '16:00',
        medications: [
            {
                id: "7",
                name: "Losartana",
                dosageStrength: "50mg",
                adultDosage: "50mg uma vez ao dia",
                pediatric_dosage: "Não recomendado"
            },
            {
                id: "8",
                name: "Azitromicina",
                dosageStrength: "500mg",
                adultDosage: "500mg uma vez ao dia por 3 dias",
                pediatric_dosage: "250mg uma vez ao dia por 3 dias"
            },
            {
                id: "9",
                name: "Metformina",
                dosageStrength: "850mg",
                adultDosage: "850mg duas vezes ao dia",
                pediatric_dosage: "Não recomendado"
            },
            {
                id: "10",
                name: "Cetirizina",
                dosageStrength: "10mg",
                adultDosage: "10mg uma vez ao dia",
                pediatric_dosage: "5mg uma vez ao dia"
            },
            {
                id: "11",
                name: "Diclofenaco",
                dosageStrength: "50mg",
                adultDosage: "50mg a cada 12 horas",
                pediatric_dosage: "25mg a cada 12 horas"
            },
            {
                id: "12",
                name: "Loratadina",
                dosageStrength: "10mg",
                adultDosage: "10mg uma vez ao dia",
                pediatric_dosage: "5mg uma vez ao dia"
            },
            {
                id: "13",
                name: "Captopril",
                dosageStrength: "25mg",
                adultDosage: "25mg duas vezes ao dia",
                pediatric_dosage: "Não recomendado"
            },
            {
                id: "14",
                name: "Carbamazepina",
                dosageStrength: "200mg",
                adultDosage: "200mg três vezes ao dia",
                pediatric_dosage: "100mg três vezes ao dia"
            },
            {
                id: "15",
                name: "Furosemida",
                dosageStrength: "40mg",
                adultDosage: "40mg uma vez ao dia",
                pediatric_dosage: "20mg uma vez ao dia"
            },
            {
                id: "16",
                name: "Levodopa",
                dosageStrength: "250mg",
                adultDosage: "250mg três vezes ao dia",
                pediatric_dosage: "Não recomendado"
            },
            {
                id: "17",
                name: "Aspirina",
                dosageStrength: "100mg",
                adultDosage: "100mg uma vez ao dia",
                pediatric_dosage: "50mg uma vez ao dia"
            },
            {
                id: "18",
                name: "Diazepam",
                dosageStrength: "5mg",
                adultDosage: "5mg a cada 8 horas",
                pediatric_dosage: "2,5mg a cada 8 horas"
            },
            {
                id: "19",
                name: "Clonazepam",
                dosageStrength: "2mg",
                adultDosage: "2mg duas vezes ao dia",
                pediatric_dosage: "1mg duas vezes ao dia"
            },
            {
                id: "20",
                name: "Prednisona",
                dosageStrength: "20mg",
                adultDosage: "20mg uma vez ao dia",
                pediatric_dosage: "10mg uma vez ao dia"
            },
            {
                id: "21",
                name: "Alprazolam",
                dosageStrength: "1mg",
                adultDosage: "1mg duas vezes ao dia",
                pediatric_dosage: "Não recomendado"
            },
            {
                id: "22",
                name: "Ranitidina",
                dosageStrength: "150mg",
                adultDosage: "150mg duas vezes ao dia",
                pediatric_dosage: "75mg duas vezes ao dia"
            },
            {
                id: "23",
                name: "Propranolol",
                dosageStrength: "40mg",
                adultDosage: "40mg duas vezes ao dia",
                pediatric_dosage: "20mg duas vezes ao dia"
            },
            {
                id: "24",
                name: "Sertralina",
                dosageStrength: "50mg",
                adultDosage: "50mg uma vez ao dia",
                pediatric_dosage: "25mg uma vez ao dia"
            },
            {
                id: "25",
                name: "Escitalopram",
                dosageStrength: "10mg",
                adultDosage: "10mg uma vez ao dia",
                pediatric_dosage: "Não recomendado"
            },
        ]
    },
];