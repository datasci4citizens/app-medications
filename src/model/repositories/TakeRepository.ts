import { apiDelete, apiGet, apiPatch, apiPost, type Paginated } from '../services/api';
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
   medication: number;
   medication_name: string | null;
   medication_brand: string | null;
   quantity: string | null;
   records: (TakeRecordPayload & { take_at: string })[];
}

/** Dez anos à frente é como gravamos "sem data de fim"; ver resolveEnd. */
const CONTINUOUS_YEARS = 10;

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

/**
 * Converte um tratamento do servidor para o formato do app.
 *
 * Dosagem, marca escolhida e histórico de doses não existem do lado de lá:
 * um tratamento vindo só do servidor chega sem eles.
 */
export function fromTakeResponse(take: TakeResponse): Medication {
   const first = take.records[0];
   const isInterval = first?.cycle_type === 'interval';

   const weekDays = (first?.days ?? '')
      .split(',')
      .map(code => DAY_CODES.indexOf(code.trim()))
      .filter(index => index >= 0) as Medication['weekDays'];

   // "08:00:00" no servidor, "08:00" no app
   const times = take.records
      .filter(record => record.cycle_type === 'daily')
      .map(record => record.take_at.slice(0, 5));

   return {
      id: `srv-${take.taken_id}`,
      remoteId: take.taken_id,
      name: take.medication_name ?? take.medication_brand ?? 'Medicamento',
      brand: take.medication_brand ?? undefined,
      dosage: '',
      type: 'tablet',
      medicationInfoId: String(take.medication),
      startDate: first?.begin ?? new Date().toISOString().slice(0, 10),
      endDate: isContinuous(first?.begin, first?.end) ? undefined : first?.end,
      scheduleType: isInterval ? 'interval' : 'fixed',
      weekDays,
      times: isInterval ? undefined : times,
      startTime: isInterval ? first?.take_at.slice(0, 5) : undefined,
      intervalHours: isInterval ? first?.take_cycle : undefined,
      doseStatus: {},
      currentStock: take.quantity ? Number(take.quantity) : undefined,
   };
}

/** Reconhece a data distante que usamos no lugar de "sem término". */
function isContinuous(begin: string | undefined, end: string | undefined): boolean {
   if (!begin || !end) return true;
   const years = (new Date(end).getFullYear() - new Date(begin).getFullYear());
   return years >= CONTINUOUS_YEARS;
}

export const takeRepository = {
   list: () => apiGet<Paginated<TakeResponse>>('/api/takes/'),
   update: (takenId: number, payload: TakePayload) =>
      apiPatch<TakeResponse>(`/api/takes/${takenId}/`, payload),
   create: (payload: TakePayload) => apiPost<TakeResponse>('/api/takes/', payload),
   remove: (takenId: number) => apiDelete(`/api/takes/${takenId}/`),
};
