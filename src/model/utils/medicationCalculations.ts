import type { Medication, WeekDay, DoseStatus } from '../../types';

export interface DailyDose {
  medication: Medication;
  occurrenceId: string;
  time: string;
  status: DoseStatus;
  takenAt?: string;
}

/**
 * Calcula o status de uma dose com base no horário atual e na janela de tolerância.
 * Regras:
 * - 1h antes até o horário: pending
 * - Do horário até 1h depois: late
 * - Mais de 1h depois: skipped (calculado on-the-fly)
 */
export function getAutomaticStatus(doseDate: Date, now: Date): DoseStatus {
  const diffMs = now.getTime() - doseDate.getTime();
  const oneHourMs = 3600000;

  // Se a dose é no futuro (mais de 1h de distância)
  if (diffMs < -oneHourMs) return 'upcoming';
  
  // Se está dentro da janela de 1h antes do horário
  if (diffMs < 0) return 'pending'; 
  
  // Se passou do horário mas está dentro da janela de 1h depois (Atrasado)
  if (diffMs <= oneHourMs) return 'late'; 
  
  // Se já passou mais de 1h do horário
  return 'skipped';
}

/**
 * Calcula todas as doses de um medicamento para um dia específico.
 */
export function calculateDosesForDay(medication: Medication, selectedDate: Date): DailyDose[] {
  const doses: DailyDose[] = [];
  const now = new Date();

  // 1. Normalizar datas para comparação (YYYY-MM-DD)
  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
  const day = String(selectedDate.getDate()).padStart(2, '0');
  const targetDateStr = `${year}-${month}-${day}`;

  const startStr = medication.startDate;
  const endStr = medication.endDate;

  // 2. Verificar se está dentro do período de tratamento
  if (targetDateStr < startStr) return [];
  if (endStr && targetDateStr > endStr) return [];

  // 3. Verificar se o dia da semana está configurado
  const dayOfWeek = selectedDate.getDay() as WeekDay;
  if (!medication.weekDays.includes(dayOfWeek)) return [];

  // Função auxiliar para processar cada dose (fixa ou intervalo)
  const processDose = (time: string): DailyDose => {
    const occurrenceId = `${medication.id}-${targetDateStr}-${time}`;
    const savedRecord = medication.doseStatus[occurrenceId];

    // Se já existe um registro salvo (tomado ou pulado manualmente), usamos ele
    if (savedRecord) {
      return {
        medication,
        occurrenceId,
        time,
        status: savedRecord.status,
        takenAt: savedRecord.takenAt
      };
    }

    // Se não tem registro, calculamos o status baseado no horário
    const [hours, minutes] = time.split(':').map(Number);
    const doseDate = new Date(selectedDate);
    doseDate.setHours(hours, minutes, 0, 0);

    return {
      medication,
      occurrenceId,
      time,
      status: getAutomaticStatus(doseDate, now),
    };
  };

  // 4. Gerar doses conforme o tipo de agendamento
  if (medication.scheduleType === 'fixed' && medication.times) {
    for (const time of medication.times) {
      doses.push(processDose(time));
    }
  } else if (
    medication.scheduleType === 'interval' && 
    medication.startTime && 
    medication.intervalHours
  ) {
    // Início absoluto do tratamento
    const startAnchor = new Date(`${medication.startDate}T${medication.startTime}:00`);
    const msPerInterval = medication.intervalHours * 3600000;

    const dayStart = new Date(selectedDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(selectedDate);
    dayEnd.setHours(23, 59, 59, 999);

    if (startAnchor <= dayEnd) {
      let current = new Date(startAnchor.getTime());
      
      // Salto otimizado para o dia selecionado
      if (current < dayStart) {
        const diffMs = dayStart.getTime() - current.getTime();
        const intervalsToSkip = Math.floor(diffMs / msPerInterval);
        current = new Date(current.getTime() + (intervalsToSkip * msPerInterval));
      }

      while (current <= dayEnd) {
        if (current >= dayStart) {
          const timeStr = current.toTimeString().slice(0, 5);
          const curYear = current.getFullYear();
          const curMonth = String(current.getMonth() + 1).padStart(2, '0');
          const curDay = String(current.getDate()).padStart(2, '0');
          const curDateStr = `${curYear}-${curMonth}-${curDay}`;

          if (curDateStr === targetDateStr) {
            doses.push(processDose(timeStr));
          }
        }
        current = new Date(current.getTime() + msPerInterval);
      }
    }
  }

  // Retornar doses ordenadas por horário
  return doses.sort((a, b) => a.time.localeCompare(b.time));
}

/**
 * Extrai data e horário do occurrenceId.
 * Formato: `${medId}-${YYYY-MM-DD}-${HH:MM}`
 */
export function parseOccurrenceId(occurrenceId: string): { date: string; time: string } | null {
  const parts = occurrenceId.split('-');
  if (parts.length < 5) return null;
  const time = parts[parts.length - 1];
  const day = parts[parts.length - 2];
  const month = parts[parts.length - 3];
  const year = parts[parts.length - 4];
  if (!/^\d{4}$/.test(year) || !/^\d{2}$/.test(month) || !/^\d{2}$/.test(day) || !/^\d{2}:\d{2}$/.test(time)) {
    return null;
  }
  return { date: `${year}-${month}-${day}`, time };
}
