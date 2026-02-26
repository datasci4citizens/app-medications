import { useNavigate, useParams, Navigate } from "react-router-dom"
import { useEffect, useState } from "react";
import { useMedications } from "../hooks/useMedications";
import { medicationsDatabase } from "../data/mockMedicationsDatabase";
import { getBrandColor } from "../utils/brandColorHelper";
import type { Medication, MedicationInfo } from "../types";
import { FiArrowLeft, FiCheck, FiX, FiEdit, FiTrash2, FiLayers, FiClock, FiScissors, FiActivity } from "react-icons/fi";

import { BOX_IMAGE, MEDICATION_TYPE_IMAGES } from "../constants";
import { ConfirmModal } from "../components/common/Modal";




export function MedicationDetails() {

   const navigate = useNavigate();
   const { id } = useParams()
   // const location = useLocation();

   const { getMedicationById, markAsTaken, markAsSkipped, deleteMedication } = useMedications();
   const [medication, setMedication] = useState<Medication>();
   const [medicationInfo, setMedicationInfo] = useState<MedicationInfo>();
   const [haveUser, setHaveUser] = useState<boolean>(false);
   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);


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

   const handleTake = () => {
      if (medication) {
         markAsTaken(medication.id);
         // Atualiza o estado local para refletir a mudança imediatamente
         setMedication({ ...medication, status: 'taken' });
      }
   };

   const handleSkip = () => {
      if (medication) {
         markAsSkipped(medication.id);
         // Atualiza o estado local para refletir a mudança imediatamente
         setMedication({ ...medication, status: 'skipped' });
      }
   };

   const handleDelete = () => {
      if (medication) {
         deleteMedication(medication.id);
         navigate('/home');
      }
   };

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

   const isTaken = medication?.status === 'taken';
   const isSkipped = medication?.status === 'skipped';
   const isPending = medication?.status === 'pending';

   return (
      <div className=" max-w-md mx-auto min-h-screen bg-[#eeeef4] px-6 py-8 pb-32">

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

         {/* Botões de Ação */}
         {!haveUser ? (
            <button className="w-full bg-purple-600 text-white font-black text-lg py-4 rounded-full mb-6 tracking-widest hover:bg-purple-700 transition-colors shadow-lg">
               ADICIONAR
            </button>
         ) : (
            <div className="flex flex-col gap-3 mb-6">
               {isPending && (
                  <div className="flex gap-3">
                     <button
                        onClick={handleTake}
                        className="flex-1 bg-green-500 text-white font-black text-lg py-4 rounded-full tracking-widest hover:bg-green-600 transition-colors shadow-md flex items-center justify-center gap-2"
                     >
                        <FiCheck size={20} /> TOMAR
                     </button>
                     <button
                        onClick={handleSkip}
                        className="bg-white text-red-500 border-2 border-red-500 font-black text-lg p-4 rounded-full hover:bg-red-50 transition-colors shadow-sm flex items-center justify-center"
                        title="Esquecer"
                     >
                        <FiX size={24} />
                     </button>
                  </div>
               )}

               {isTaken && (
                  <button className="w-full bg-gray-400 text-white font-black text-lg py-4 rounded-full tracking-widest cursor-default flex items-center justify-center gap-2 shadow-sm">
                     <FiCheck size={20} /> TOMADO
                  </button>
               )}

               {isSkipped && (
                  <button className="w-full bg-red-500 text-white font-black text-lg py-4 rounded-full tracking-widest cursor-default flex items-center justify-center gap-2 shadow-sm">
                     <FiX size={20} /> ESQUECIDO
                  </button>
               )}
            </div>
         )}

         {/* Grid de Cards */}
         <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-1">
               <div className="flex items-center gap-2 text-gray-400">
                  <FiLayers size={14} />
                  <p className="text-xs uppercase font-bold">Tipo:</p>
               </div>
               <p className="font-semibold text-gray-800">{medicationInfo?.type || 'Não informado'}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-1">
               <div className="flex items-center gap-2 text-gray-400">
                  <FiClock size={14} />
                  <p className="text-xs uppercase font-bold">Pos/Antes Refeição:</p>
               </div>
               <p className="font-semibold text-gray-800">{medicationInfo?.whenToTake || 'Livre'}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-1">
               <div className="flex items-center gap-2 text-gray-400">
                  <FiScissors size={14} />
                  <p className="text-xs uppercase font-bold">Pode partir:</p>
               </div>
               <p className="font-semibold text-gray-800">{medicationInfo?.canSplit ? 'Sim' : 'Não'}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-1">
               <div className="flex items-center gap-2 text-gray-400">
                  <FiActivity size={14} />
                  <p className="text-xs uppercase font-bold">Substância:</p>
               </div>
               <p className="font-semibold text-gray-800 truncate" title={medicationInfo?.activeIngredient}>
                  {medicationInfo?.activeIngredient || 'Genérico'}
               </p>
            </div>
         </div>

         {/* Barra de Ações Secundárias (Fixo no rodapé) */}
         {haveUser && (
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 flex gap-4 max-w-md mx-auto shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
               <button
                  onClick={() => navigate(`/edit/${medication?.id}`)}
                  className="flex-1 bg-amber-400/70 text-white font-bold py-3 rounded-4xl flex items-center justify-center gap-2 hover:bg-amber-500 transition-colors"
               >
                  <FiEdit /> Editar
               </button>
               <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="flex-1 bg-red-500/75 text-white font-bold py-3 rounded-4xl flex items-center justify-center gap-2 hover:bg-red-600 transition-colors"
               >
                  <FiTrash2 /> Deletar
               </button>
            </div>
         )}

         <ConfirmModal
            isOpen={isDeleteModalOpen}
            title="Deseja realmente excluir este medicamento?"
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDelete}
         />

      </div>
   )
}