import { useNavigate, useParams, Navigate } from "react-router-dom"
import { useEffect, useState } from "react";
import { useMedications } from "../hooks/useMedications";
import { medicationsDatabase } from "../data/mockMedicationsDatabase";
import { getBrandColor } from "../utils/brandColorHelper";
import type { Medication, MedicationInfo } from "../types";
import { FiArrowLeft } from "react-icons/fi";

import { BOX_IMAGE, MEDICATION_TYPE_IMAGES } from "../constants";




export function MedicationDetails() {

   const navigate = useNavigate();
   const { id } = useParams()
   // const location = useLocation();

   const { getMedicationById } = useMedications();
   const [medication, setMedication] = useState<Medication>();
   const [medicationInfo, setMedicationInfo] = useState<MedicationInfo>();
   const [haveUser, setHaveUser] = useState<boolean>(false);


   useEffect(() => {
      const newMed = getMedicationById(String(id))

      if (newMed) {
         setHaveUser(true)
         setMedication(newMed)
         // Se o medicamento do usuário tiver um link para a base global, buscamos as informações extras
         if (newMed.medicationInfoId) {
            const dbMed = medicationsDatabase.find((medicine) => medicine.id === newMed.medicationInfoId)
            setMedicationInfo(dbMed)
         } else {
            // Tenta buscar pelo nome se não tiver ID vinculado (fallback)
            const dbMed = medicationsDatabase.find((medicine) => medicine.name.toLowerCase() === newMed.name.toLowerCase())
            setMedicationInfo(dbMed)
         }
      } else {
         setHaveUser(false)
         const dbMed = medicationsDatabase.find((medicine) => medicine.id === id)
         setMedicationInfo(dbMed)
      }
   }, [id, getMedicationById])

   // Dados a exibir dependendo da fonte
   const displayData = haveUser ? medication : medicationInfo;

   if (!displayData) {
      return (
         <div className="min-h-screen bg-[#eeeef4] px-6 py-8 flex items-center justify-center">
            <button onClick={() => navigate(-1)} className="absolute top-8 left-6 text-gray-600 hover:text-purple-600 transition-colors">
               <FiArrowLeft size={24} />
            </button>
            <p className="text-gray-500 text-center">Medicamento não encontrado</p>
         </div>
      )
   }

   return (
      <div className=" max-w-md mx-auto min-h-screen bg-[#eeeef4] px-6 py-8">

         {/* Botão Voltar */}
         <button onClick={() => navigate(-1)} className="mb-6 text-gray-600 hover:text-purple-600 transition-colors p-2 -ml-2 rounded-full hover:bg-white/50">
            <FiArrowLeft size={24} />
         </button>

         {/* Título */}
         <div className="mb-4">
            <h1 className="text-3xl font-black text-gray-900">
               {displayData?.name}
               <span className="text-lg font-normal text-gray-500 ml-2">
                  {haveUser ? `${medication?.dosage}` : ''}
               </span>
            </h1>
            {medicationInfo && (
               <>
                  <p className="text-lg font-semibold text-gray-800">{medicationInfo?.activeIngredient}</p>
                  <p className="text-sm text-gray-500">Marca: {medicationInfo?.commonBrands?.[0]}</p>
               </>
            )}
         </div>

         {/* Card Imagem */}
         <div
            className="rounded-2xl h-64 relative overflow-hidden mb-6 max-w-10xs"
            style={{ backgroundColor: getBrandColor(medicationInfo?.commonBrands?.[0]) }}
         >
            {/* Caixa - esquerda */}
            <img
               src={BOX_IMAGE}
               className="absolute left-6 bottom-0 h-56 object-contain"
            />

            {/* Tipo do medicamento - direita */}
            {medicationInfo && (<img
               src={MEDICATION_TYPE_IMAGES[medicationInfo.type].image}
               className="absolute right-1  h-75 object-contain"
            />)}

         </div>

         {/* Botão Adicionar */}
         {!haveUser && (
            <button className="w-full bg-purple-600 text-white font-black text-lg py-4 rounded-full mb-6 tracking-widest">
               ADICIONAR
            </button>
         )}

         {/* Grid de Cards */}
         <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-4">
               <p className="text-xs text-gray-400">Tipo:</p>
               <p className="font-semibold text-gray-800">{medicationInfo?.type}</p>
            </div>
            <div className="bg-white rounded-2xl p-4">
               <p className="text-xs text-gray-400">Ver Cuidados</p>
            </div>
         </div>

      </div>
   )
}