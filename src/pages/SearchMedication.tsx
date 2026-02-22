import { useState } from "react";
import { searchMedication, type MedicationInfo } from "../data/mockMedicationsDatabase";
import { Input } from "../components/common/Input";
import { Header } from "../components/layout/Header";
import { useNavigate } from "react-router-dom";


export function SearchMedication() {
   const [query, setQuery] = useState('');

   const navigate = useNavigate();

   const [medications, setMedications] = useState<MedicationInfo[]>([]);


   function handleQuery(e: string) {
      // if (query.trim().length == 0) return
      setQuery(e)
      setMedications(searchMedication(e))

   }
   function handleCleanSearch() {
      if (query.trim().length == 0) return
      setQuery('');           // Limpa o texto do input
      setMedications([]);
   }


   return (
      <div>
         <Header onTitleClick={() => handleCleanSearch()} />
         <Input
            value={query}
            onChange={(e) => handleQuery(e.target.value)}
            placeholder="Buscar medicamento..."
         />
         {medications.map((medication) => (
            <div key={medication.id}
               onClick={() => navigate(`/medication/${medication.id}`)}
            >{medication.name}
            </div>
         ))}


      </div>
   );
}
