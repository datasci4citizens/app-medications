export function generateDateRange(centerDate: Date, daysBefore: number, daysAfter: number): Date[] {
  const dates: Date[] = [];

  for (let i = -daysBefore; i <= daysAfter; i++) {
    const date = new Date(centerDate);
    date.setDate(date.getDate() + i);
    date.setHours(0, 0, 0, 0); // BUG 3: Normalizar para meia-noite
    dates.push(date);
  }

  return dates;
}

export function formatDateLabel(date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((compareDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoje';
  if (diffDays === -1) return 'Ontem';
  if (diffDays === 1) return 'Amanhã';

  const weekday = date.toLocaleDateString('pt-BR', { weekday: 'short' });
  const day = date.getDate();
  const month = date.toLocaleDateString('pt-BR', { month: 'short' });

  return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${day} de ${month}`;
}

export function formatHeaderDate(date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((compareDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const weekday = date.toLocaleDateString('pt-BR', { weekday: 'short' });
  const day = date.getDate();
  const month = date.toLocaleDateString('pt-BR', { month: 'short' });

  if (diffDays === 0) return `Hoje, ${day} de ${month}`;
  if (diffDays === -1) return `Ontem, ${day} de ${month}`;
  if (diffDays === 1) return `Amanhã, ${day} de ${month}`;

  return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${day} de ${month}`;

}

export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.toDateString() === date2.toDateString();
}

/**
 * Distância até um horário futuro, em linguagem curta: "1h 12min", "12min".
 * Retorna null se o alvo já passou.
 */
export function formatTimeUntil(target: Date, now: Date): string | null {
  const diffMin = Math.round((target.getTime() - now.getTime()) / 60000);
  if (diffMin <= 0) return null;

  const hours = Math.floor(diffMin / 60);
  const minutes = diffMin % 60;

  if (hours === 0) return `${minutes}min`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}min`;
}

/**
 * Constrói a data de uma ocorrência a partir do dia selecionado e do horário "HH:MM".
 */
export function buildDoseDate(day: Date, time: string): Date {
  const [h, m] = time.split(':').map(Number);
  const d = new Date(day);
  d.setHours(h, m, 0, 0);
  return d;
}
