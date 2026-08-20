

import { useState } from "react";
import { NavBottom } from "../components/layout/NavBottom";

import { InfoTile } from "../components/common/InfoTile";
import { WeekDaySelector } from "../components/common/WeekDaySelector";
import { AccordionSection } from "../components/common/AccordionSection";
import { ToggleSwitch } from "../components/common/ToggleSwitch";
import { NumberInput } from "../components/common/InputBar";
import { ConfirmModal } from "../components/common/Modal";

import { useMedicationDetails } from "../../viewmodel/hooks/useMedicationDetails";
import { DoseActionPanel } from "../components/medication/DoseActionPanel";
import type { MedicationInfo, Medication, DoseRecord, DoseStatus } from '../../types/index'



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
   return (<div className="p-4 flex gap-4 self-stretch flex-col pb-48 animate-slide-in-right">
      <NavBottom OnClick={() => handleBack()} type='back' size={55} />
      <div className="font-merriweather text-[44px] font-bold text-darkpurple text-center border-b-2">
         {/* Medicine Name */}
         <p className="font-merriweather text-2xl font-bold text-gray-400 text-right ">
            {drugInfo?.activeIngredient}
         </p>
         {drugInfo?.name}
      </div>

      {/* InfoCards TileCard*/}
      <div className="bg-lightpurple w-full mx-auto rounded-2xl grid grid-cols-2 gap-2 px-3.5 py-2.5">

         <InfoTile title="Princípio ativo:" subtitle={`${drugInfo?.activeIngredient}`} />
         <InfoTile title="Forma:" subtitle={`${drugInfo?.type}`} />
         <InfoTile title="Marcas:" subtitle={`${drugInfo?.commonBrands?.join(', ') || '-'}`} />
         <InfoTile title="Tem no SUS?" subtitle="Sim" />
      </div>

      {/* Instruction */}
      {drugInfo && (
         <div className="font-merriweather text-2xl mt-4">
            <AccordionSection label="Instruções" hasToggle={true}>
               <div className="grid grid-cols-2 gap-2">
                  <InfoTile title="Quando tomar:" subtitle={drugInfo.whenToTake ?? '-'} />
                  <InfoTile title="Pode partir?" subtitle={drugInfo.canSplit ? 'Sim' : 'Não'} />
               </div>
               {drugInfo.instructions && <div className="mt-4 text-lg font-light">{drugInfo.instructions}</div>}
            </AccordionSection>
         </div>
      )}

      {drugInfo?.sideEffects && (
         <div className="font-merriweather text-2xl">
            <AccordionSection label="Efeitos Colaterais" hasToggle={true}>
               <div className="text-lg font-light">{drugInfo.sideEffects}</div>
            </AccordionSection>
         </div>
      )}

      {drugInfo?.contraindications && (
         <div className="font-merriweather text-2xl">
            <AccordionSection label="Contraindicações" hasToggle={true}>
               <div className="text-lg font-light">{drugInfo.contraindications}</div>
            </AccordionSection>
         </div>
      )}

      {/* Add Button */}
      <button
         onClick={handleAdd}
         className="
            bg-blue-add
            fixed bottom-0 left-0 right-0
            mx-auto w-[calc(100%-2rem)] max-w-md mb-4
            font-merriweather font-bold text-white text-2xl text-center
            border-[3px] border-blue-add rounded-[0.625rem]
            py-2
            transition-colors duration-300
            active:bg-deepplum active:text-offwhite
         "
      >
         Adicionar
      </button>

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
   const [remember, setRemember] = useState<boolean>(false);
   const [stock, setStock] = useState<number>(0);
   const [reminderThreshold, setReminderThreshold] = useState<number>(0);
   const [deleteModalOpen, setDeleteModalOpen] = useState(false);

   return (
      <div className="p-4 flex gap-4 self-stretch flex-col pb-48 animate-slide-in-right">

         <NavBottom OnClick={() => handleBack()} type='back' size={55} />
         <div className="font-merriweather text-[44px] font-bold text-darkpurple text-center border-b-2">
            {/* Medicine Name */}
            <p className="font-merriweather text-2xl font-bold text-gray-400 text-right ">
               {drugInfo?.activeIngredient}
            </p>
            {medication?.name}
         </div>


         {/* InfoCards TileCard*/}
         <div className="bg-lightpurple w-full mx-auto rounded-2xl grid grid-cols-2 gap-2 px-3.5 py-2.5">

            <InfoTile title="Dosage:" subtitle={`${medication?.dosage}`} />
            <InfoTile title="Forma:" subtitle={`${medication?.type}`} />
            <InfoTile title="Marca:" subtitle={`${medication?.brand} `} />
            <InfoTile title="Tem no SUS?" subtitle="Sim" />
         </div>

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

         <div className="flex flex-col gap-4 font-merriweather  text-2xl">
            <h1 className="font-bold ">Frequência do uso:</h1>
            <WeekDaySelector isReadOnly={true} values={medication?.weekDays ?? []} />
            <div className="flex flex-wrap gap-2 justify-center">
               {medication?.times?.map(time => (
                  <span
                     key={time}
                     className="px-4 py-2 rounded-full bg-lightpurple text-darkpurple font-merriweather font-bold text-xl"
                  >
                     {time}
                  </span>
               ))}
            </div>
         </div>

         {/* Duration */}
         <div className="font-merriweather text-2xl">
            <AccordionSection label="Duração do tratamento" hasToggle={true}>
               <div className="grid grid-cols-2 gap-2">
                  <InfoTile title="Início:" subtitle={medication?.startDate ?? '-'} />
                  <InfoTile title="Fim:" subtitle={medication?.endDate ?? 'Contínuo'} />
               </div>
            </AccordionSection>
         </div>

         {/* Instructions */}
         {drugInfo && (
            <div className="font-merriweather text-2xl">
               <AccordionSection label="Instruções" hasToggle={true}>
                  <div className="grid grid-cols-2 gap-2">
                     <InfoTile title="Quando tomar:" subtitle={drugInfo.whenToTake ?? '-'} />
                     <InfoTile title="Pode partir?" subtitle={drugInfo.canSplit ? 'Sim' : 'Não'} />
                  </div>
                  {drugInfo.instructions && <div className="mt-4 text-lg font-light">{drugInfo.instructions}</div>}
               </AccordionSection>
            </div>
         )}

         {/* Stock Reminder */}
         <div className="font-merriweather flex flex-col gap-4">
            <AccordionSection label="Lembre de repor estoque" hasToggle={true}>
               <div className="flex flex-col gap-4">
                  <ToggleSwitch label="Habilitar lembrete" value={remember} onClick={() => setRemember(!remember)} />
                  <div className="text-[1.25rem] font-light">
                     Estoque Atual
                  </div>
                  <NumberInput value={stock} label="unidades" onChange={(val) => setStock(Number(val) || 0)} />
                  <div className="text-[1.25rem] font-light">
                     Lembrete quando chegar à
                  </div>
                  <NumberInput value={reminderThreshold} label="unidades" onChange={(val) => setReminderThreshold(Number(val) || 0)} />
               </div>
            </AccordionSection>
         </div>

         {/* Buttons */}
         <div className="fixed bottom-0 left-0 right-0 mx-auto w-[calc(100%-2rem)] max-w-md mb-4 flex gap-3">
            <button
               onClick={() => setDeleteModalOpen(true)}
               className="
                  flex-1
                  bg-graybg
                  font-merriweather font-bold text-red-500 text-2xl text-center
                  border-[3px] border-red-400 rounded-[0.625rem]
                  py-2
                  transition-colors duration-300
                  active:bg-red-500 active:text-offwhite
               "
            >
               Excluir
            </button>
            <button
               onClick={handleEdit}
               className="
                  flex-[2]
                  bg-graybg
                  font-merriweather font-bold text-darkpurple text-2xl text-center
                  border-[3px] border-darkpurple rounded-[0.625rem]
                  py-2
                  transition-colors duration-300
                  active:bg-darkpurple active:text-offwhite
               "
            >
               Editar
            </button>
         </div>

         <ConfirmModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={handleDelete}
            title="Excluir medicamento?"
            message={`"${medication?.name}" será removido permanentemente do seu tratamento.`}
            confirmText="Excluir"
            cancelText="Cancelar"
            variant="danger"
         />

      </div>
   );

}