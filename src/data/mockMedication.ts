import type { Medication } from "../types";

export const mockMedication: Medication[] = [
   {
      id: "1",
      name: "Losartana",
      dosage: "50mg",
      time: "08:00",
      type: "tablet",
      taken: true, 
   },
   {
      id: "2",
      name: "Dipirona",
      dosage: "1g",
      time: "14:00",
      type: "liquid",
      taken: false, 
   },
   {
      id: "3",
      name: "Vitamina D",
      dosage: "2000UI",
      time: "20:00",
      type: "capsule",
      taken: false,
   }
]