import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useMedications } from "./useMedications";
import { medicationsDatabase } from "../../model/data/mockMedicationsDatabase";
import { getAutomaticStatus, parseOccurrenceId } from "../../model/utils/medicationCalculations";
import type { DoseStatus } from "../../types";


export function useMedicationDetails() {

   const navigate = useNavigate();

   const { pathname, state } = useLocation();

   const context = useMedications();
   const mode = pathname.includes('/user/') ? 'user' : 'search';

   const { id } = useParams();

   const occurrenceId = state && typeof state.occurrenceId == 'string' ? state.occurrenceId : null;


   const safeId = id ?? '';
   const medication = mode === 'user' ? context.getMedicationById(safeId) : null;

   const drugInfo = medicationsDatabase.find((item) => item.id === (mode === 'user' ? medication?.medicationInfoId : safeId));

   const doseRecord = medication && occurrenceId ? medication.doseStatus[occurrenceId] : undefined;

   // Status calculado a partir do horário (antes de qualquer ação do usuário)
   const computedStatus: DoseStatus | null = (() => {
      if (!occurrenceId) return null;
      const parsed = parseOccurrenceId(occurrenceId);
      if (!parsed) return null;
      const [h, m] = parsed.time.split(':').map(Number);
      const doseDate = new Date(`${parsed.date}T00:00:00`);
      doseDate.setHours(h, m, 0, 0);
      return getAutomaticStatus(doseDate, new Date());
   })();

   // Status efetivo: se já foi marcado, usa o registro; senão, o calculado
   const effectiveStatus: DoseStatus | null = doseRecord?.status ?? computedStatus;

   // Constrói ISO timestamp a partir de "HH:MM" + data da ocorrência
   const buildTakenAt = (timeStr: string): string | null => {
      if (!occurrenceId) return null;
      const parsed = parseOccurrenceId(occurrenceId);
      if (!parsed) return null;
      const [h, m] = timeStr.split(':').map(Number);
      const d = new Date(`${parsed.date}T00:00:00`);
      d.setHours(h, m, 0, 0);
      return d.toISOString();
   };

   const handleBack = () => {
      navigate(-1);
   }

   const handleEdit = () => {
      navigate(`/edit/${safeId}`);
   }
   const handleAdd = () => {
      navigate(`/add`, { state: { medicationInfoId: drugInfo?.id } });
   }

   // Marca como tomado considerando o status atual (pending → taken; late → taken_late)
   const handleTake = () => {
      if (!medication || !occurrenceId) return
      const wasLate = computedStatus === 'late' || computedStatus === 'skipped';
      context.markDoseAsTaken(medication.id, occurrenceId, wasLate);
   }

   // Marca como tomado agora, atrasado (usado quando estava skipped)
   const handleTakeNow = () => {
      if (!medication || !occurrenceId) return
      context.markDoseAsTaken(medication.id, occurrenceId, true);
   }

   // Marca como tomado em um horário específico no passado
   const handleTakeAtTime = (timeStr: string) => {
      if (!medication || !occurrenceId) return
      const takenAt = buildTakenAt(timeStr);
      if (!takenAt) return
      context.markDoseAsTaken(medication.id, occurrenceId, true, takenAt);
   }

   // Atualiza o horário de uma dose já tomada
   const handleUpdateTakenAt = (timeStr: string) => {
      if (!medication || !occurrenceId) return
      const takenAt = buildTakenAt(timeStr);
      if (!takenAt) return
      context.updateDoseTakenAt(medication.id, occurrenceId, takenAt);
   }

   const handleSkip = () => {
      if (!medication || !occurrenceId) return
      context.markDoseAsSkipped(medication.id, occurrenceId);
   }

   const handleClear = () => {
      if (!medication || !occurrenceId) return
      context.clearDoseStatus(medication.id, occurrenceId);
   }

   const handleDelete = () => {
      context.deleteMedication(safeId);
      navigate(-1);
   }

   return {
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
      handleSkip,
      handleClear,
   }
}

