import { useState } from "react";
import { searchMedication } from "../data/mockMedicationsDatabase";
import { useNavigate } from "react-router-dom";
import type { MedicationInfo } from "../types";
import { FiChevronRight, FiX, FiSearch } from "react-icons/fi";


export function SearchMedication() {
   const [query, setQuery] = useState('');
   const navigate = useNavigate();
   const [medications, setMedications] = useState<MedicationInfo[]>([]);

   function handleQuery(e: string) {
      setQuery(e);
      if (e.trim().length > 0) {
         setMedications(searchMedication(e));
      } else {
         setMedications([]);
      }
   }

   return (
      <div className="min-h-screen bg-white px-6 py-8">
         {/* Cabeçalho */}
         <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
               Buscar<br />Medicamento
            </h1>
            <button
               onClick={() => navigate(-1)}
               className="p-3 bg-gray-100 rounded-full text-gray-600 hover:bg-purple-100 hover:text-purple-600 transition-all duration-300 shadow-sm"
            >
               <FiX size={24} />
            </button>
         </div>

         {/* Barra de Busca */}
         <div className="relative mb-4">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
               <FiSearch className="text-gray-400" size={20} />
            </div>
            <input
               type="text"
               value={query}
               onChange={(e) => handleQuery(e.target.value)}
               placeholder="Buscar"
               className="w-full bg-gray-100 border-none rounded-[10px] py-4 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 transition-all outline-none"
            />
         </div>

         {/* Texto Explicativo / Resultados */}
         {query.length === 0 ? (
            <div className="mt-8 px-2">
               <p className="text-gray-500 text-lg leading-relaxed font-medium">
                  Digite o nome do remédio ou de seu princípio ativo que você deseja encontrar
               </p>
            </div>
         ) : (
            <div className="mt-6 flex flex-col gap-3">
               {medications.length > 0 ? (
                  medications.map((medication) => (
                     <button
                        key={medication.id}
                        onClick={() => navigate(`/medication/search/${medication.id}`)}
                        className="flex items-center justify-between w-full p-4 bg-white border border-gray-100 rounded-[10px] shadow-sm hover:shadow-md hover:border-purple-100 transition-all group"
                     >
                        <div className="flex flex-col items-start text-left">
                           <span className="text-gray-900 font-bold text-lg leading-tight group-hover:text-purple-600 transition-colors">
                              {medication.name}
                           </span>
                           <span className="text-gray-500 text-sm">
                              {medication.activeIngredient}
                           </span>
                        </div>
                        <FiChevronRight className="text-gray-300 group-hover:text-purple-500 transition-colors" size={20} />
                     </button>
                  ))
               ) : (
                  <p className="text-center text-gray-400 mt-10">Nenhum medicamento encontrado.</p>
               )}
            </div>
         )}
      </div>
   );
}
