import { apiDelete, apiPost } from '../services/api';
import type { Medication } from '../../types';

/** Dias da semana como o backend espera: 0 = domingo, igual ao Date.getDay(). */
const DAY_CODES = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

/** Uma linha da agenda. O backend guarda um horário por registro. */
interface TakeRecordPayload {
   cycle_type: 'daily' | 'interval';
   begin: string;
   end: string;
   days: string;
   take_at: string;
   take_cycle?: number;
}

interface TakePayload {
   medication: number;
   quantity: string;
   priority: number;
   records: TakeRecordPayload[];
}

export interface TakeResponse {
   taken_id: number;
}

/**
 * O campo `end` do backend não aceita nulo, mas tratamento contínuo não tem
 * data de fim. Enquanto o modelo não permitir, mandamos uma data distante.
 */
function resolveEnd(medication: Medication): string {
   if (medication.endDate) return medication.endDate;
   const far = new Date(medication.startDate);
   far.setFullYear(far.getFullYear() + 10);
   return far.toISOString().slice(0, 10);
}

function buildRecords(medication: Medication): TakeRecordPayload[] {
   const base = {
      begin: medication.startDate,
      end: resolveEnd(medication),
      days: medication.weekDays.map(d => DAY_CODES[d]).join(','),
   };

   if (medication.scheduleType === 'interval') {
      return [{
         ...base,
         cycle_type: 'interval',
         take_at: medication.startTime ?? '08:00',
         take_cycle: medication.intervalHours ?? 8,
      }];
   }

   // Horário fixo: um registro por horário, porque `take_at` é único por linha.
   return (medication.times ?? []).map(take_at => ({
      ...base,
      cycle_type: 'daily' as const,
      take_at,
   }));
}

export function toTakePayload(medication: Medication): TakePayload | null {
   // Sem vínculo com o catálogo não há o que mandar: `medication` é uma
   // chave estrangeira obrigatória do lado do servidor.
   const catalogId = Number(medication.medicationInfoId);
   if (!medication.medicationInfoId || Number.isNaN(catalogId)) return null;

   return {
      medication: catalogId,
      quantity: String(medication.currentStock ?? 0),
      priority: 1,
      records: buildRecords(medication),
   };
}

export const takeRepository = {
   create: (payload: TakePayload) => apiPost<TakeResponse>('/api/takes/', payload),
   remove: (takenId: number) => apiDelete(`/api/takes/${takenId}/`),
};
