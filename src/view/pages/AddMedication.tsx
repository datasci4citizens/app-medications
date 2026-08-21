import { useState } from "react";
import { useAddMedication } from "../../viewmodel/hooks/useAddMedication";
import { StepLayout } from "../components/addMedication/StepLayout";
import { ConfirmModal } from "../components/common/Modal";
import { BrandStep } from "../components/addMedication/steps/BrandStep";
import { DosageStep } from "../components/addMedication/steps/DosageStep";
import { WeekDaysStep } from "../components/addMedication/steps/WeekDaysStep";
import { ScheduleStep } from "../components/addMedication/steps/ScheduleStep";
import { PeriodStep } from "../components/addMedication/steps/PeriodStep";
import { StockStep } from "../components/addMedication/steps/StockStep";
import { ConfirmStep } from "../components/addMedication/steps/ConfirmStep";

export function AddMedication() {
   const {
      step,
      stepIndex,
      totalSteps,
      isLastStep,
      formData,
      drugInfo,
      isEditing,
      isFirstStep,
      isValid,
      direction,
      updateField,
      handleNext,
      handleBack,
   } = useAddMedication();

   const [discardModalOpen, setDiscardModalOpen] = useState(false);

   const onBackClick = () => {
      if (isEditing && isFirstStep) {
         setDiscardModalOpen(true);
      } else {
         handleBack();
      }
   };

   const title = isEditing ? 'Editar medicamento' : 'Adicionar medicamento';

   switch (step) {
      case 'brand':
         return (
            <>
            <StepLayout
               title={title}
               question="Qual a marca?"
               hint={drugInfo?.name ? `Você está adicionando ${drugInfo.name}.` : undefined}
               onBack={onBackClick}
               onNext={handleNext}
               isValid={isValid}
               stepKey={step}
               direction={direction}
               stepIndex={stepIndex}
               totalSteps={totalSteps}
               isLastStep={isLastStep}
            >
               <BrandStep
                  value={formData.brand}
                  suggestions={drugInfo?.commonBrands ?? []}
                  onChange={(brand) => updateField('brand', brand)}
               />
            </StepLayout>
            <ConfirmModal
               isOpen={discardModalOpen}
               onClose={() => setDiscardModalOpen(false)}
               onConfirm={handleBack}
               title="Descartar alterações?"
               message="As alterações feitas nesse medicamento não serão salvas."
               confirmText="Descartar"
               cancelText="Continuar editando"
               variant="question"
            />
            </>
         );

      case 'dosage':
         return (
            <StepLayout
               title={title}
               question="Qual a dosagem?"
               onBack={onBackClick}
               onNext={handleNext}
               isValid={isValid}
               stepKey={step}
               direction={direction}
               stepIndex={stepIndex}
               totalSteps={totalSteps}
               isLastStep={isLastStep}
            >
               <DosageStep
                  value={formData.dosage}
                  typeHint={drugInfo?.type}
                  onChange={(dosage) => updateField('dosage', dosage)}
               />
            </StepLayout>
         );

      case 'weekDays':
         return (
            <StepLayout
               title={title}
               question="Em quais dias?"
               onBack={onBackClick}
               onNext={handleNext}
               isValid={isValid}
               stepKey={step}
               direction={direction}
               stepIndex={stepIndex}
               totalSteps={totalSteps}
               isLastStep={isLastStep}
            >
               <WeekDaysStep
                  value={formData.weekDays}
                  onChange={(days) => updateField('weekDays', days)}
               />
            </StepLayout>
         );

      case 'schedule':
         return (
            <StepLayout
               title={title}
               question="Em quais horários?"
               onBack={onBackClick}
               onNext={handleNext}
               isValid={isValid}
               stepKey={step}
               direction={direction}
               stepIndex={stepIndex}
               totalSteps={totalSteps}
               isLastStep={isLastStep}
            >
               <ScheduleStep
                  scheduleType={formData.scheduleType}
                  times={formData.times}
                  startTime={formData.startTime}
                  intervalHours={formData.intervalHours}
                  onChangeScheduleType={(t) => updateField('scheduleType', t)}
                  onChangeTimes={(t) => updateField('times', t)}
                  onChangeStartTime={(t) => updateField('startTime', t)}
                  onChangeIntervalHours={(h) => updateField('intervalHours', h)}
               />
            </StepLayout>
         );

      case 'period':
         return (
            <StepLayout
               title={title}
               question="Por quanto tempo?"
               onBack={onBackClick}
               onNext={handleNext}
               isValid={isValid}
               stepKey={step}
               direction={direction}
               stepIndex={stepIndex}
               totalSteps={totalSteps}
               isLastStep={isLastStep}
            >
               <PeriodStep
                  startDate={formData.startDate}
                  endDate={formData.endDate}
                  onChangeStartDate={(d) => updateField('startDate', d)}
                  onChangeEndDate={(d) => updateField('endDate', d)}
               />
            </StepLayout>
         );

      case 'stock':
         return (
            <StepLayout
               title={title}
               question="Quantas unidades você tem?"
               onBack={onBackClick}
               onNext={handleNext}
               isValid={isValid}
               stepKey={step}
               direction={direction}
               stepIndex={stepIndex}
               totalSteps={totalSteps}
               isLastStep={isLastStep}
            >
               <StockStep
                  currentStock={formData.currentStock}
                  reminderEnabled={formData.stockReminderEnabled}
                  reminderThreshold={formData.stockReminderThreshold}
                  onChangeCurrentStock={(v) => updateField('currentStock', v)}
                  onChangeReminderEnabled={(v) => updateField('stockReminderEnabled', v)}
                  onChangeReminderThreshold={(v) => updateField('stockReminderThreshold', v)}
               />
            </StepLayout>
         );

      case 'confirm':
         return (
            <StepLayout
               title={title}
               question="Revisar"
               onBack={onBackClick}
               onNext={handleNext}
               isValid={isValid}
               nextLabel={isEditing ? 'Salvar' : 'Adicionar'}
               stepKey={step}
               direction={direction}
               stepIndex={stepIndex}
               totalSteps={totalSteps}
               isLastStep={isLastStep}
            >
               <ConfirmStep
                  formData={formData}
                  medicationName={drugInfo?.name ?? 'Medicamento'}
               />
            </StepLayout>
         );
   }
}
