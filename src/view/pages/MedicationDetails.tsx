import { useNavigate, useParams, useLocation } from "react-router-dom"
import { useEffect, useState, useMemo } from "react";
import { useMedications } from "../../viewmodel/hooks/useMedications";
import { medicationsDatabase } from "../../model/data/mockMedicationsDatabase";
import { getBrandColor } from "../../model/utils/brandColorHelper";
import type { Medication, MedicationInfo } from "../../types";
import { FiArrowLeft, FiCheck, FiAlertCircle, FiEdit, FiTrash2, FiLayers, FiClock, FiScissors, FiActivity } from "react-icons/fi";

import { BOX_IMAGE, MEDICATION_TYPE_IMAGES } from "../../constants";
import { ConfirmModal } from "../components/common/Modal";
import { calculateDosesForDay } from "../../model/utils/medicationCalculations";




export function MedicationDetails() {

   const navigate = useNavigate();
   const { id } = useParams()
   const location = useLocation();

   const { medications, getMedicationById, markDoseAsTaken, markDoseAsSkipped, deleteMedication } = useMedications();
   const [medication, setMedication] = useState<Medication>();
   const [medicationInfo, setMedicationInfo] = useState<MedicationInfo>();
   const [haveUser, setHaveUser] = useState<boolean>(false);
   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
   const [isExiting, setIsExiting] = useState(false);
   const [isFutureModalOpen, setIsFutureModalOpen] = useState(false);


   useEffect(() => {
      const isUserRoute = location.pathname.includes('/user/');

      if (isUserRoute) {
         const userMed = getMedicationById(String(id))
         if (userMed) {
            setHaveUser(true)
            setMedication(userMed)
            const dbMed = medicationsDatabase.find((m) => m.id === userMed.medicationInfoId) || 
                          medicationsDatabase.find((m) => m.name.toLowerCase() === userMed.name.toLowerCase());
            setMedicationInfo(dbMed)
         }
      } else {
         const dbMed = medicationsDatabase.find((m) => m.id === id)
         setMedicationInfo(dbMed)
         const userMed = medications.find(m => m.medicationInfoId === id);
         
         if (userMed) {
            setHaveUser(true)
            setMedication(userMed)
         } else {
            setHaveUser(false)
            setMedication(undefined)
         }
      }
   }, [id, getMedicationById, location.pathname, medications])

   // BUG 6: Calcular a dose atual/próxima para permitir interagir pelos botões
   const currentDoseInfo = useMemo(() => {
      if (!medication) return null;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const doses = calculateDosesForDay(medication, today);
      
      // Busca a primeira dose que pode ser interagida (pendente ou atrasada)
      return doses.find(d => d.status === 'pending' || d.status === 'late') || doses[doses.length - 1];
   }, [medication]);

   const displayData = haveUser ? medication : medicationInfo;

   function handleBack() {
      setIsExiting(true);
      setTimeout(() => {
         navigate(-1);
      }, 250);
   }

   // BUG 14: Guard de data futura
   const checkFutureGuard = () => {
      if (!medication) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startDate = new Date(medication.startDate + 'T00:00:00');
      if (startDate > today) {
         setIsFutureModalOpen(true);
         return true;
      }
      return false;
   };

   const handleTake = () => {
      if (checkFutureGuard()) return;
      if (medication && currentDoseInfo) {
         const wasLate = currentDoseInfo.status == 'late';
         markDoseAsTaken(medication.id, currentDoseInfo.occurrenceId, wasLate);
      }
   };

   const handleSkip = () => {
      if (checkFutureGuard()) return;
      if (medication && currentDoseInfo) {
         markDoseAsSkipped(medication.id, currentDoseInfo.occurrenceId);
      }
   };

   const handleDelete = () => {
      if (medication) {
         deleteMedication(medication.id);
         setIsExiting(true);
         setTimeout(() => {
            navigate('/home');
         }, 250);
      }
   };

   if (!displayData) {
      return (
         <div className={`min-h-screen bg-[#eeeef4] px-6 py-8 flex items-center justify-center ${isExiting ? 'page-exit-right' : 'page-transition-right'}`}>
            <button onClick={handleBack} className="absolute top-8 left-6 text-gray-600 hover:text-purple-600 transition-colors">
               <FiArrowLeft size={24} />
            </button>
            <p className="text-gray-500 text-center">Medicamento não encontrado</p>
         </div>
      )
   }

   const doseStatus = currentDoseInfo?.status || 'pending';
   const isTaken = doseStatus === 'taken';
   const isSkipped = doseStatus === 'skipped';
   const isInteractable = doseStatus === 'pending' || doseStatus === 'late';

   return (
      <div className={`max-w-md mx-auto min-h-screen bg-[#eeeef4] px-6 py-8 pb-32 ${isExiting ? 'page-exit-right' : 'page-transition-right'}`}>

         <button onClick={handleBack} className="mb-6 text-gray-600 hover:text-purple-600 transition-colors p-2 -ml-2 rounded-full hover:bg-white/50">
            <FiArrowLeft size={24} />
         </button>

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

         <div
            className="rounded-2xl h-64 relative overflow-hidden mb-6 max-w-10xs"
            style={{ backgroundColor: getBrandColor(medicationInfo?.commonBrands?.[0]) }}
         >
            <img
               src={BOX_IMAGE}
               className="absolute left-6 bottom-0 h-56 object-contain"
            />
            {medicationInfo && (<img
               src={MEDICATION_TYPE_IMAGES[medicationInfo.type].image}
               className="absolute right-1  h-75 object-contain"
            />)}
         </div>

         {!haveUser ? (
            <button 
               onClick={() => navigate('/add', { state: { medicationInfoId: medicationInfo?.id } })}
               className="w-full bg-purple-600 text-white font-black text-lg py-4 rounded-full mb-6 tracking-widest hover:bg-purple-700 transition-colors shadow-lg cursor-pointer"
            >
               ADICIONAR
            </button>
         ) : (
            <div className="flex flex-col gap-3 mb-6">
               {isInteractable && (
                  <div className="flex flex-col gap-3">
                     <button
                        onClick={handleTake}
                        className="w-full bg-green-500 text-white font-black text-lg py-4 rounded-full tracking-widest hover:bg-green-600 transition-colors shadow-md flex items-center justify-center gap-2"
                     >
                        <FiCheck size={20} /> TOMAR AGORA
                     </button>
                     {/* BUG 17: Label claro para Esqueci */}
                     <button
                        onClick={handleSkip}
                        className="w-full bg-white text-red-500 border-2 border-red-500 font-bold py-3 rounded-full hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                     >
                        <FiAlertCircle size={18} /> NÃO TOMEI / ESQUECI
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
                     <FiAlertCircle size={20} /> ESQUECIDO
                  </button>
               )}
            </div>
         )}

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

         <ConfirmModal
            isOpen={isFutureModalOpen}
            title="Tratamento não iniciado"
            message="Este tratamento está agendado para o futuro. Você só poderá registrar doses a partir da data de início."
            onClose={() => setIsFutureModalOpen(false)}
            onConfirm={() => setIsFutureModalOpen(false)}
            confirmText="Entendi"
            cancelText="Voltar"
            variant="info"
         />

      </div>
   )
}
