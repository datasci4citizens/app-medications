import { useCatalogMedication } from "./useCatalogMedication";
import { toMedicationInfo } from "../../model/repositories/CatalogRepository";
import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMedications } from "./useMedications";
import type { Medication, WeekDay } from "../../types";

export type AddMedicationStep =
   | 'brand'
   | 'dosage'
   | 'weekDays'
   | 'schedule'
   | 'period'
   | 'stock'
   | 'confirm';

const STEP_ORDER: AddMedicationStep[] = ['brand', 'dosage', 'weekDays', 'schedule', 'period', 'stock', 'confirm'];

export interface AddMedicationFormData {
   brand: string;
   dosage: string;
   weekDays: WeekDay[];
   scheduleType: 'fixed' | 'interval';
   times: string[];
   startTime: string;
   intervalHours: number;
   startDate: string;
   endDate: string | null;
   currentStock: number;
   stockReminderEnabled: boolean;
   stockReminderThreshold: number;
}

const today = () => new Date().toISOString().slice(0, 10);

const initialFormData = (): AddMedicationFormData => ({
   brand: '',
   dosage: '',
   weekDays: [0, 1, 2, 3, 4, 5, 6],
   scheduleType: 'fixed',
   times: ['08:00'],
   startTime: '08:00',
   intervalHours: 8,
   startDate: today(),
   endDate: null,
   currentStock: 0,
   stockReminderEnabled: false,
   stockReminderThreshold: 5,
});

export function useAddMedication() {
   const navigate = useNavigate();
   const location = useLocation();
   const params = useParams();
   const { addMedication, updateMedication, getMedicationById } = useMedications();

   const isEditing = Boolean(params.id);
   const editingMedication = isEditing ? getMedicationById(String(params.id)) : undefined;

   const medicationInfoId =
      (location.state && typeof (location.state as { medicationInfoId?: unknown }).medicationInfoId === 'string'
         ? (location.state as { medicationInfoId: string }).medicationInfoId
         : undefined) ?? editingMedication?.medicationInfoId;

   // Vem do catálogo da API; enquanto carrega, drugInfo fica indefinido e o
   // formulário simplesmente abre sem preenchimento prévio.
   const { medication: catalogMedication } = useCatalogMedication(medicationInfoId);
   const drugInfo = useMemo(
      () => (catalogMedication ? toMedicationInfo(catalogMedication) : undefined),
      [catalogMedication]
   );

   const [stepIndex, setStepIndex] = useState(0);
   const [direction, setDirection] = useState<'forward' | 'back'>('forward');
   const [formData, setFormData] = useState<AddMedicationFormData>(() => {
      if (editingMedication) {
         return {
            brand: editingMedication.brand ?? '',
            dosage: editingMedication.dosage,
            weekDays: editingMedication.weekDays,
            scheduleType: editingMedication.scheduleType,
            times: editingMedication.times ?? ['08:00'],
            startTime: editingMedication.startTime ?? '08:00',
            intervalHours: editingMedication.intervalHours ?? 8,
            startDate: editingMedication.startDate,
            endDate: editingMedication.endDate ?? null,
            currentStock: editingMedication.currentStock ?? 0,
            stockReminderEnabled: editingMedication.stockReminderEnabled ?? false,
            stockReminderThreshold: editingMedication.stockReminderThreshold ?? 5,
         };
      }
      return initialFormData();
   });

   const step = STEP_ORDER[stepIndex];
   const totalSteps = STEP_ORDER.length;
   const isFirstStep = stepIndex === 0;
   const isLastStep = stepIndex === totalSteps - 1;

   const updateField = <K extends keyof AddMedicationFormData>(field: K, value: AddMedicationFormData[K]) => {
      setFormData(prev => ({ ...prev, [field]: value }));
   };

   const isStepValid = (): boolean => {
      switch (step) {
         case 'brand':
            return formData.brand.trim().length > 0;
         case 'dosage':
            return formData.dosage.trim().length > 0;
         case 'weekDays':
            return formData.weekDays.length > 0;
         case 'schedule':
            if (formData.scheduleType === 'fixed') {
               return formData.times.length > 0 && formData.times.every(t => /^\d{2}:\d{2}$/.test(t));
            }
            return /^\d{2}:\d{2}$/.test(formData.startTime) && formData.intervalHours > 0;
         case 'period':
            return formData.startDate.length > 0 && (formData.endDate === null || formData.endDate >= formData.startDate);
         case 'stock':
            return true;
         case 'confirm':
            return true;
      }
   };

   const handleNext = () => {
      if (!isStepValid()) return;
      if (isLastStep) {
         handleSave();
         return;
      }
      setDirection('forward');
      setStepIndex(i => i + 1);
   };

   const handleBack = () => {
      if (isFirstStep) {
         navigate(-1);
         return;
      }
      setDirection('back');
      setStepIndex(i => i - 1);
   };

   const handleSave = () => {
      const payload: Omit<Medication, 'id'> = {
         name: drugInfo?.name ?? 'Medicamento',
         brand: formData.brand,
         dosage: formData.dosage,
         type: mapDrugType(drugInfo?.type),
         medicationInfoId: drugInfo?.id,
         startDate: formData.startDate,
         endDate: formData.endDate ?? undefined,
         scheduleType: formData.scheduleType,
         weekDays: formData.weekDays,
         times: formData.scheduleType === 'fixed' ? formData.times : undefined,
         startTime: formData.scheduleType === 'interval' ? formData.startTime : undefined,
         intervalHours: formData.scheduleType === 'interval' ? formData.intervalHours : undefined,
         doseStatus: editingMedication?.doseStatus ?? {},
         currentStock: formData.currentStock || undefined,
         stockReminderEnabled: formData.stockReminderEnabled || undefined,
         stockReminderThreshold: formData.stockReminderEnabled ? formData.stockReminderThreshold : undefined,
      };

      if (isEditing && params.id) {
         updateMedication(params.id, payload);
      } else {
         addMedication(payload);
      }
      navigate('/home');
   };

   return {
      step,
      stepIndex,
      totalSteps,
      isFirstStep,
      isLastStep,
      direction,
      formData,
      drugInfo,
      isEditing,
      isValid: isStepValid(),
      updateField,
      handleNext,
      handleBack,
   };
}

function mapDrugType(type: string | undefined): Medication['type'] {
   switch (type) {
      case 'Cápsula': return 'capsule';
      case 'Líquido': return 'liquid';
      case 'Injeção':
      case 'Ampola': return 'injection';
      case 'Comprimido':
      default: return 'tablet';
   }
}
