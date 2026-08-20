import { useEffect, useRef } from 'react';
import { generateDateRange, isSameDay } from '../../../model/utils/dateHelpers';

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dateOptions = generateDateRange(new Date(), 30, 30);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const normalizedSelected = new Date(selectedDate);
  normalizedSelected.setHours(0, 0, 0, 0);
  const diffDays = Math.round(
    (normalizedSelected.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  const showBackToToday = Math.abs(diffDays) > 3;

  useEffect(() => {
    if (scrollRef.current) {
      const activeItem = scrollRef.current.querySelector('[data-active="true"]');
      if (activeItem) {
        activeItem.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      }
    }
  }, [selectedDate]);

  const handleBackToToday = () => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    onDateChange(t);
  };


  return (
    <div className="bg-graybg py-4">
      <div className="max-w-md mx-auto px-4">
        <div
          ref={scrollRef}
          className="flex-1 flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory hide-scrollbar py-4 px-2"
          style={{ scrollbarWidth: 'none' }}
        >
          {dateOptions.map((date, index) => {
            const isSelected = isSameDay(date, selectedDate);

            return (
              <button
                key={index}
                data-active={isSelected}
                onClick={() => onDateChange(date)}
                className="flex flex-col items-center justify-center w-17.5 h-29 shrink-0 font-merriweather"
              >
                {isSelected ? (
                  <div className="w-17.5 h-29 rounded-[50px] bg-darkpurple flex flex-col items-center justify-center gap-2">
                    <span className="text-offwhite text-2xl font-normal">
                      {date.toLocaleDateString('pt-BR', { weekday: 'short' })}
                    </span>
                    <div className="w-15 h-15 rounded-full bg-offwhite flex items-center justify-center">
                      <span className="text-deepplum text-3xl font-bold">{date.getDate()}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="text-inkblack text-2xl font-normal">
                      {date.toLocaleDateString('pt-BR', { weekday: 'short' })}
                    </span>
                    <div className="w-15 h-15 rounded-full bg-offwhite shadow-md flex items-center justify-center">
                      <span className="text-inkblack text-3xl font-bold">{date.getDate()}</span>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {showBackToToday && (
          <div className="flex justify-center mt-2 animate-fade-slide-up">
            <button
              onClick={handleBackToToday}
              className="bg-lightpurple text-darkpurple font-merriweather font-bold text-xl px-6 py-2 rounded-full active:scale-95 transition-transform"
            >
              Voltar para Hoje
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
