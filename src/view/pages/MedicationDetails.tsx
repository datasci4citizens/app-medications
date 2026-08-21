

import { useEffect, useRef, useState, type ReactNode } from "react";
import { FiArrowLeft, FiClock, FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";

import { InfoTile } from "../components/common/InfoTile";
import { WeekDaySelector } from "../components/common/WeekDaySelector";
import { AccordionSection } from "../components/common/AccordionSection";
import { ConfirmModal } from "../components/common/Modal";

import { useMedicationDetails } from "../../viewmodel/hooks/useMedicationDetails";
import { DoseActionPanel } from "../components/medication/DoseActionPanel";
import { calculateAdherence, parseOccurrenceId } from "../../model/utils/medicationCalculations";
import { getBrandColor } from "../../model/utils/brandColorHelper";
import { MEAL_LABELS, MEDICATION_TYPE_IMAGES, MEDICATION_TYPE_LABELS } from "../../constants";
import type { MedicationInfo, Medication, DoseRecord, DoseStatus } from '../../types/index'

/** Tempo que o usuário tem para desfazer a exclusão antes dela valer. */
const UNDO_WINDOW_MS = 6000;



export function MedicationDetails() {


   const {
      mode,
      medication,
      drugInfo,
      occurrenceId,
      doseRecord,
      effectiveStatus,
      handleBack,
      handleEdit,
      handleAdd,
      handleDelete,
      handleTake,
      handleTakeNow,
      handleTakeAtTime,
      handleUpdateTakenAt,
      handleClear,
   } = useMedicationDetails();

   return (<div>
      {mode === 'search'
         ? <SearchView drugInfo={drugInfo} handleAdd={handleAdd} handleBack={handleBack} />
         : <UserView
              drugInfo={drugInfo}
              handleBack={handleBack}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              medication={medication ?? undefined}
              occurrenceId={occurrenceId}
              doseRecord={doseRecord}
              effectiveStatus={effectiveStatus}
              onTake={handleTake}
              onTakeNow={handleTakeNow}
              onTakeAtTime={handleTakeAtTime}
              onUpdateTakenAt={handleUpdateTakenAt}
              onClear={handleClear}
           />}
   </div>);

}


function SearchView({ drugInfo, handleBack, handleAdd }: { drugInfo: MedicationInfo | undefined, handleBack: () => void, handleAdd: () => void }) {

   const productImage = drugInfo ? MEDICATION_TYPE_IMAGES[drugInfo.type]?.image : undefined;
   const mealLabel = drugInfo?.whenToTake ? MEAL_LABELS[drugInfo.whenToTake] : undefined;

   return (
      <div className="min-h-screen bg-graybg pb-32 animate-slide-in-right">

         {/* Capa roxa: item do catálogo, ainda não é um medicamento seu */}
         <div className="relative overflow-hidden rounded-b-[36px] pt-13 bg-gradient-to-br from-darkpurple to-deepplum shadow-[0_10px_28px_rgba(0,0,0,0.18)]">
            <div className="absolute -right-12 -top-8 w-55 h-55 rounded-full bg-white/10" />
            <div className="absolute right-8 -bottom-12 w-35 h-35 rounded-full bg-black/8" />

            <button
               onClick={handleBack}
               aria-label="Voltar"
               className="absolute top-14 left-4 w-11 h-11 rounded-full bg-white/25 backdrop-blur-md text-white flex items-center justify-center z-2 active:scale-90 transition-transform"
            >
               <FiArrowLeft size={22} />
            </button>

            <div className="relative z-1 pl-19 pr-5 pt-4 pb-6 text-white">
               <p className="font-inter text-[12px] font-bold uppercase tracking-[0.14em] opacity-80">
                  {drugInfo?.activeIngredient}
               </p>
               <h1 className="font-merriweather font-extrabold text-[32px] uppercase leading-[1.05] mt-1">
                  {drugInfo?.name}
               </h1>
               <p className="font-merriweather font-semibold text-[20px] mt-1.5 opacity-90">
                  {drugInfo?.type}
               </p>
            </div>

            {productImage && (
               <img
                  src={productImage}
                  alt=""
                  className="absolute right-5 top-20 w-28 z-1 drop-shadow-[0_8px_22px_rgba(0,0,0,0.25)]"
               />
            )}
         </div>

         <div className="max-w-md mx-auto px-4 flex flex-col gap-6 pt-5">

            {/* Resumo */}
            <div className="grid grid-cols-2 gap-2.5">
               <InfoTile title="Substância" subtitle={drugInfo?.activeIngredient ?? '—'} />
               <InfoTile title="Forma" subtitle={drugInfo?.type ?? '—'} />
               <InfoTile title="Refeição" subtitle={mealLabel ?? 'Livre'} />
               <InfoTile title="Pode partir?" subtitle={drugInfo?.canSplit ? 'Sim' : 'Não'} />
            </div>

            {/* Marcas */}
            {drugInfo?.commonBrands && drugInfo.commonBrands.length > 0 && (
               <section className="flex flex-col gap-3">
                  <h2 className="font-merriweather font-extrabold text-[20px] text-inkblack">Marcas comuns</h2>
                  <div className="flex flex-wrap gap-2">
                     {drugInfo.commonBrands.map(brand => (
                        <span
                           key={brand}
                           className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-offwhite border border-card-border font-inter font-bold text-[16px] text-inkblack"
                        >
                           <span className="w-3 h-3 rounded-full" style={{ backgroundColor: getBrandColor(brand) }} />
                           {brand}
                        </span>
                     ))}
                  </div>
               </section>
            )}

            {/* Como usar */}
            {drugInfo?.instructions && (
               <section className="flex flex-col gap-3">
                  <h2 className="font-merriweather font-extrabold text-[20px] text-inkblack">Como usar</h2>
                  <div className="bg-offwhite rounded-[22px] border border-black/5 px-4.5 py-4">
                     <p className="font-inter font-medium text-[17px] leading-[1.55] text-inkblack">
                        {drugInfo.instructions}
                     </p>
                  </div>
               </section>
            )}

            {drugInfo?.sideEffects && (
               <AccordionSection label="Efeitos colaterais" hasToggle={true}>
                  {drugInfo.sideEffects}
               </AccordionSection>
            )}

            {drugInfo?.contraindications && (
               <AccordionSection label="Contraindicações" hasToggle={true}>
                  {drugInfo.contraindications}
               </AccordionSection>
            )}

         </div>

         {/* Ação principal */}
         <div className="fixed bottom-0 left-0 right-0 px-4 pb-4 pt-6 bg-gradient-to-t from-graybg via-graybg/95 to-transparent">
            <button
               onClick={handleAdd}
               className="w-full max-w-md mx-auto h-15 rounded-[20px] bg-darkpurple text-offwhite font-merriweather font-extrabold text-[20px] flex items-center justify-center gap-2 shadow-[0_10px_24px_rgba(91,42,120,0.45)] transition-transform active:scale-95"
            >
               <FiPlus size={22} /> Adicionar aos meus
            </button>
         </div>

      </div>
   )
}

// USER SCREEN

function UserView({ medication, drugInfo, occurrenceId, doseRecord, effectiveStatus, handleBack, handleEdit, handleDelete, onTake, onTakeNow, onTakeAtTime, onUpdateTakenAt, onClear }: {
   medication: Medication | undefined,
   drugInfo: MedicationInfo | undefined,
   occurrenceId: string | null,
   doseRecord: DoseRecord | undefined,
   effectiveStatus: DoseStatus | null,
   handleBack: () => void,
   handleEdit: () => void,
   handleDelete: () => void,
   onTake: () => void,
   onTakeNow: () => void,
   onTakeAtTime: (time: string) => void,
   onUpdateTakenAt: (time: string) => void,
   onClear: () => void,
}) {
   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
   const [pendingDelete, setPendingDelete] = useState(false);
   const deleteTimer = useRef<number | undefined>(undefined);

   useEffect(() => () => clearTimeout(deleteTimer.current), []);

   // A exclusão só acontece depois da janela de desfazer
   const startDelete = () => {
      setDeleteModalOpen(false);
      setPendingDelete(true);
      clearTimeout(deleteTimer.current);
      deleteTimer.current = setTimeout(() => handleDelete(), UNDO_WINDOW_MS);
   };
   const cancelDelete = () => {
      clearTimeout(deleteTimer.current);
      setPendingDelete(false);
   };

   const brandColor = getBrandColor(medication?.brand);
   const typeLabel = medication ? MEDICATION_TYPE_LABELS[medication.type] ?? '—' : '—';
   const productImage = MEDICATION_TYPE_IMAGES[typeLabel]?.image;

   const doseTime = occurrenceId ? parseOccurrenceId(occurrenceId)?.time : undefined;
   const mealLabel = drugInfo?.whenToTake ? MEAL_LABELS[drugInfo.whenToTake] : undefined;
   const adherence = medication ? calculateAdherence(medication) : null;

   const stockLeft = medication?.currentStock;
   const stockThreshold = medication?.stockReminderThreshold ?? 5;
   const isLowStock = stockLeft !== undefined && stockLeft <= stockThreshold;

   return (
      <div className="min-h-screen bg-graybg pb-40 animate-slide-in-right">

         {/* Capa com a cor da marca */}
         <div
            className="relative overflow-hidden rounded-b-[36px] pt-13 shadow-[0_10px_28px_rgba(0,0,0,0.18)]"
            style={{ background: `linear-gradient(160deg, ${brandColor}, ${brandColor}cc)` }}
         >
            <div className="absolute -right-12 -top-8 w-55 h-55 rounded-full bg-white/10" />
            <div className="absolute right-8 -bottom-12 w-35 h-35 rounded-full bg-black/8" />

            <button
               onClick={handleBack}
               aria-label="Voltar"
               className="absolute top-14 left-4 w-11 h-11 rounded-full bg-white/25 backdrop-blur-md text-white flex items-center justify-center z-2 active:scale-90 transition-transform"
            >
               <FiArrowLeft size={22} />
            </button>

            <div className="relative z-1 pl-19 pr-5 pt-4 pb-6 text-white">
               <p className="font-inter text-[12px] font-bold uppercase tracking-[0.14em] opacity-80">
                  {medication?.brand || 'Genérico'}
               </p>
               <h1 className="font-merriweather font-extrabold text-[32px] uppercase leading-[1.05] mt-1">
                  {medication?.name}
               </h1>
               <p className="font-merriweather font-semibold text-[20px] mt-1.5 opacity-90">
                  {medication?.dosage} · {typeLabel}
               </p>
            </div>

            {productImage && (
               <img
                  src={productImage}
                  alt=""
                  className="absolute right-5 top-20 w-28 z-1 drop-shadow-[0_8px_22px_rgba(0,0,0,0.25)]"
               />
            )}
         </div>

         <div className="max-w-md mx-auto px-4 flex flex-col gap-6 pt-5">

            {occurrenceId && (
               <DoseActionPanel
                  effectiveStatus={effectiveStatus}
                  doseRecord={doseRecord}
                  onTake={onTake}
                  onTakeNow={onTakeNow}
                  onTakeAtTime={onTakeAtTime}
                  onUpdateTakenAt={onUpdateTakenAt}
                  onClear={onClear}
               />
            )}

            {/* Resumo */}
            <div className="grid grid-cols-2 gap-2.5">
               <InfoTile title="Horário" subtitle={doseTime ?? medication?.times?.[0] ?? '—'} icon={<FiClock size={14} />} />
               <InfoTile title="Tipo" subtitle={typeLabel} />
               <InfoTile title="Refeição" subtitle={mealLabel ?? 'Livre'} />
               <InfoTile title="Substância" subtitle={drugInfo?.activeIngredient ?? '—'} />
            </div>

            {/* Como usar */}
            {drugInfo?.instructions && (
               <section className="flex flex-col gap-3">
                  <h2 className="font-merriweather font-extrabold text-[20px] text-inkblack">Como usar</h2>
                  <div className="bg-offwhite rounded-[22px] border border-black/5 px-4.5 py-4">
                     <p className="font-inter font-medium text-[17px] leading-[1.55] text-inkblack">
                        {drugInfo.instructions}
                     </p>
                     {drugInfo.canSplit !== undefined && (
                        <span className="inline-flex items-center mt-3 px-3.5 py-2 rounded-full bg-yellow-alert/25 font-inter font-bold text-[15px] text-[#7a5000]">
                           {drugInfo.canSplit ? 'Pode partir o comprimido' : 'Não parta nem mastigue'}
                        </span>
                     )}
                  </div>
               </section>
            )}

            {/* Frequência */}
            <section className="flex flex-col gap-3">
               <h2 className="font-merriweather font-extrabold text-[20px] text-inkblack">Frequência do uso</h2>
               <div className="bg-offwhite rounded-[22px] border border-black/5 px-4.5 py-4 flex flex-col gap-4">
                  <WeekDaySelector isReadOnly={true} values={medication?.weekDays ?? []} />

                  <div className="h-px bg-black/6" />

                  <div className="flex flex-wrap gap-2">
                     {medication?.times?.map(time => (
                        <span
                           key={time}
                           className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[rgba(91,42,120,0.08)] text-darkpurple font-inter font-bold text-[16px]"
                        >
                           <FiClock size={15} />
                           {time}
                        </span>
                     ))}
                  </div>
               </div>
            </section>

            {/* Estoque */}
            <section className="flex flex-col gap-3">
               <h2 className="font-merriweather font-extrabold text-[20px] text-inkblack">Estoque</h2>
               {stockLeft === undefined ? (
                  <div className="bg-offwhite rounded-[22px] border border-black/5 px-4.5 py-4">
                     <p className="font-merriweather font-bold text-[18px] text-ghost-gray">Sem informação de estoque</p>
                     <p className="font-inter text-[15px] text-ghostcolor mt-0.5">
                        Informe quantas unidades você tem para ser avisado antes de acabar.
                     </p>
                  </div>
               ) : (
                  <div className={`bg-offwhite rounded-[22px] px-4.5 py-4 flex items-center gap-4 ${isLowStock ? 'border-2 border-yellow-alert' : 'border border-black/5'}`}>
                     <span className={`font-merriweather font-black text-[44px] leading-none ${isLowStock ? 'text-red-skip' : 'text-darkpurple'}`}>
                        {stockLeft}
                     </span>
                     <div>
                        <p className="font-merriweather font-bold text-[18px] text-inkblack">unidades restantes</p>
                        <p className="font-inter text-[15px] text-ghostcolor mt-0.5">
                           {isLowStock ? 'Está acabando — peça na farmácia' : 'Avisaremos quando estiver acabando'}
                        </p>
                     </div>
                  </div>
               )}
            </section>

            {/* Tratamento */}
            <section className="flex flex-col gap-3">
               <h2 className="font-merriweather font-extrabold text-[20px] text-inkblack">Tratamento</h2>
               <div className="bg-offwhite rounded-[22px] border border-black/5 px-4.5 py-4 flex flex-col gap-3.5">
                  <TreatmentRow label="Início" value={medication?.startDate ?? '—'} />
                  <div className="h-px bg-black/6" />
                  <TreatmentRow label="Fim" value={medication?.endDate ?? 'Sem término'} />
                  <div className="h-px bg-black/6" />
                  <TreatmentRow
                     label="Aderência"
                     value={
                        adherence === null
                           ? <span className="text-ghostcolor font-normal">sem histórico ainda</span>
                           : <span className="flex items-center gap-1.5">
                                <span className="text-green-take font-extrabold">{adherence}%</span>
                                <span className="text-[11px] text-ghostcolor font-normal">últimos 30 dias</span>
                             </span>
                     }
                  />
               </div>
            </section>

            {/* Detalhes do catálogo que já existem hoje */}
            {drugInfo?.sideEffects && (
               <AccordionSection label="Efeitos colaterais" hasToggle={true}>
                  {drugInfo.sideEffects}
               </AccordionSection>
            )}

            {drugInfo?.contraindications && (
               <AccordionSection label="Contraindicações" hasToggle={true}>
                  {drugInfo.contraindications}
               </AccordionSection>
            )}

            {/* Ações */}
            <div className="flex gap-3 mt-2">
               <button
                  onClick={handleEdit}
                  className="flex-1 h-13.5 rounded-[20px] bg-yellow-alert text-deepplum font-merriweather font-extrabold text-[17px] flex items-center justify-center gap-2 shadow-[0_8px_18px_rgba(255,194,73,0.35)] transition-transform active:scale-95"
               >
                  <FiEdit2 size={18} /> Editar
               </button>
               <button
                  onClick={() => setDeleteModalOpen(true)}
                  className="flex-1 h-13.5 rounded-[20px] bg-red-skip text-white font-merriweather font-extrabold text-[17px] flex items-center justify-center gap-2 shadow-[0_8px_18px_rgba(211,34,49,0.35)] transition-transform active:scale-95"
               >
                  <FiTrash2 size={18} /> Excluir
               </button>
            </div>

         </div>

         <ConfirmModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={startDelete}
            title="Excluir este medicamento?"
            message={`Você terá alguns segundos para desfazer depois. O histórico de doses de ${medication?.name} será removido.`}
            confirmText="Excluir"
            cancelText="Cancelar"
            variant="danger"
         />

         {pendingDelete && (
            <div className="fixed left-3 right-3 bottom-6 z-120 max-w-md mx-auto bg-deepplum text-white rounded-[26px] px-4.5 pt-4.5 pb-5 overflow-hidden border-2 border-white/20 shadow-[0_18px_44px_rgba(0,0,0,0.4)] animate-fade-slide-up">
               <div className="flex items-center gap-3.5">
                  <span className="w-13 h-13 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                     <FiTrash2 size={24} />
                  </span>
                  <div className="flex-1 min-w-0">
                     <p className="font-merriweather font-extrabold text-[21px] leading-tight">{medication?.name} excluído</p>
                     <p className="font-inter text-[16px] opacity-90 mt-0.5">Toque em desfazer se foi sem querer</p>
                  </div>
               </div>
               <button
                  onClick={cancelDelete}
                  className="w-full h-13.5 mt-3.5 rounded-full bg-white/20 border-2 border-white/35 font-merriweather font-extrabold text-[19px] active:scale-95 transition-transform"
               >
                  Desfazer
               </button>
               <div
                  className="absolute left-0 bottom-0 h-1.5 bg-white/55"
                  style={{ animation: `toastShrink ${UNDO_WINDOW_MS}ms linear forwards` }}
               />
            </div>
         )}

      </div>
   );

}

function TreatmentRow({ label, value }: { label: string, value: ReactNode }) {
   return (
      <div className="flex justify-between items-center font-inter">
         <span className="text-[15px] text-ghostcolor">{label}</span>
         <span className="text-[16px] font-bold text-inkblack">{value}</span>
      </div>
   );
}