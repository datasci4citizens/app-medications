export function generateDateRange(centerDate: Date, daysBefore: number, daysAfter: number): Date[] {
  const dates: Date[] = [];

  for (let i = -daysBefore; i <= daysAfter; i++) {
    const date = new Date(centerDate);
    date.setDate(date.getDate() + i);
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

export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.toDateString() === date2.toDateString();
}
