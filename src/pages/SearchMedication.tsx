import { useState } from "react";
import { searchMedication } from "../data/mockMedicationsDatabase";
import { useNavigate } from "react-router-dom";
import type { MedicationInfo } from "../types";
import { FiChevronRight, FiX, FiSearch } from "react-icons/fi";


export function SearchMedication() {
   const [query, setQuery] = useState('');
   const navigate = useNavigate();
   const [medications, setMedications] = useState<MedicationInfo[]>([]);
   const [isExiting, setIsExiting] = useState(false);

   function handleQuery(e: string) {
      setQuery(e);
      if (e.trim().length > 0) {
         setMedications(searchMedication(e));
      } else {
         setMedications([]);
      }
   }

   function handleBack() {
      setIsExiting(true);
      setTimeout(() => {
         navigate(-1);
      }, 250); // Tempo um pouco menor que a animação (300ms) para suavidade
   }

   return (
      <div className={`min-h-screen bg-[#ffffff] px-6 py-8 ${isExiting ? 'page-exit-right' : 'page-transition-right'}`}>
         {/* Cabeçalho */}
         <div className="flex  gap-4 items-center mb-8">
            <button
               onClick={handleBack}
               className="p-3 bg-darkpurple rounded-full text-offwhite hover:bg-purple-100 hover:text-purple-600 transition-all duration-300 shadow-sm"
            >
               <FiX size={32} />
            </button>
            <h1 className="text-2xl font-merriweather font-bold text-darkpurple tracking-tight">
               Buscar Medicamento
            </h1>
         </div>

         {/* Barra de Busca */}
         <div className="relative mb-4">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
               <FiSearch className="text-offwhite font-black" size={24} />
            </div>
            <input
               type="text"
               value={query}
               onChange={(e) => handleQuery(e.target.value)}
               placeholder="Buscar"
               className="w-full bg-[#CEC7DD] border-none rounded-xl py-4 pl-12 pr-4 text-white font-bold placeholder-white focus:ring-2 ring-purple-500 transition-all outline-none"
            />
         </div>

         {/* Texto Explicativo / Resultados */}
         {query.length === 0 ? (
            <div className="mt-8 px-8">
               <p className="text-inkblack text-2xl leading-relaxed font-medium">
                  Digite o nome do remédio ou de seu princípio ativo que você deseja encontrar
               </p>
            </div>
         ) : (
            <div className="mt-6 bg-lightpurple flex flex-col gap-2 p-3 rounded-xl">
               {medications.length > 0 ? (
                  medications.map((medication) => (
                     <button
                        key={medication.id}
                        onClick={() => navigate(`/medication/search/${medication.id}`)}
                        className="flex items-center justify-between w-full p-4 bg-white border border-gray-100 rounded-[10px] shadow-sm hover:shadow-md hover:border-purple-100 transition-all group"
                     >
                        <div className="flex flex-col items-start text-left font-merriweather ">
                           <span className="text-gray-900 font-bold text-2xl leading-tight group-hover:text-purple-600 transition-colors">
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
                  <p className="text-center font-bold merriweatherfont-merriweather text-2xl text-black mt-10 py-2">Nenhum medicamento encontrado.</p>
               )}
            </div>
         )}
      </div>
   );
}
