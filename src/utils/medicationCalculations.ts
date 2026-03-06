import type { Medication } from '../types';

export interface DailyDose {
  medication: Medication;
  occurrenceId: string; // "medId-YYYY-MM-DD-HH:mm"
  time: string; // "HH:mm"
  status: 'pending' | 'taken' | 'skipped';
}

/**
 * Calcula todas as doses de um medicamento para um dia específico
 */
export function calculateDosesForDay(medication: Medication, selectedDate: Date): DailyDose[] {
  // BUG 12: Validação de medication.time
  const [startHour, startMin] = medication.time?.split(':').map(Number) ?? [NaN, NaN];
  if (isNaN(startHour) || isNaN(startMin)) return [];

  const targetDateStr = selectedDate.toISOString().split('T')[0];

  // BUG 1: Corrigido occurrenceId para medicamentos sem intervalo
  if (!medication.scheduledDate || !medication.dosageInterval) {
    const doseStatus = medication.doseStatus?.[`${medication.id}-${targetDateStr}-${medication.time}`] || medication.status || 'pending';
    
    // BUG 13: Lógica de auto-skip (read-only)
    const doseDateTime = new Date(selectedDate);
    doseDateTime.setHours(startHour, startMin, 0, 0);
    const now = new Date();
    const effectiveStatus = (doseStatus === 'pending' && doseDateTime < now) ? 'skipped' : doseStatus;

    return [{
      medication,
      occurrenceId: `${medication.id}-${targetDateStr}-${medication.time}`,
      time: medication.time,
      status: effectiveStatus as 'pending' | 'taken' | 'skipped'
    }];
  }

  const start = new Date(medication.scheduledDate + 'T00:00:00');
  const end = medication.endDate ? new Date(medication.endDate + 'T23:59:59') : null;
  
  // Verifica se o dia selecionado está no intervalo
  if (selectedDate < start || (end && selectedDate > end)) {
    return [];
  }

  const doses: DailyDose[] = [];
  const interval = medication.dosageInterval; // horas
  
  // Criar data de referência da primeira dose absoluta
  const firstDoseDateTime = new Date(start);
  firstDoseDateTime.setHours(startHour, startMin, 0, 0);

  // Percorrer desde a primeira dose até o fim do dia alvo
  const currentDose = new Date(firstDoseDateTime);
  const endOfTargetDay = new Date(selectedDate);
  endOfTargetDay.setHours(23, 59, 59, 999);

  // BUG 4: Otimização de skip corrigida para não overshoot
  if (currentDose < selectedDate) {
    const diffMs = selectedDate.getTime() - currentDose.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const skipSteps = Math.max(0, Math.floor(diffHours / interval) - 1);
    currentDose.setHours(currentDose.getHours() + (skipSteps * interval));
  }

  // Garantir que não voltamos para antes do início
  if (currentDose < firstDoseDateTime) {
    currentDose.setTime(firstDoseDateTime.getTime());
  }

  const now = new Date();

  // Coletar doses que caem no dia selecionado
  while (currentDose <= endOfTargetDay) {
    if (currentDose.toDateString() === selectedDate.toDateString()) {
      // BUG 2: Formato de hora determinístico
      const h = String(currentDose.getHours()).padStart(2, '0');
      const m = String(currentDose.getMinutes()).padStart(2, '0');
      const timeStr = `${h}:${m}`;
      const occurrenceId = `${medication.id}-${targetDateStr}-${timeStr}`;
      
      const savedStatus = medication.doseStatus?.[occurrenceId] || 'pending';
      
      // BUG 13: Lógica de auto-skip (read-only)
      const effectiveStatus = (savedStatus === 'pending' && currentDose < now) ? 'skipped' : savedStatus;

      doses.push({
        medication,
        occurrenceId,
        time: timeStr,
        status: effectiveStatus as 'pending' | 'taken' | 'skipped'
      });
    }
    
    currentDose.setHours(currentDose.getHours() + interval);
    
    // Se passamos do dia selecionado ou da data de término absoluta, paramos
    if (currentDose > endOfTargetDay || (end && currentDose > end)) break;
  }

  return doses;
}
