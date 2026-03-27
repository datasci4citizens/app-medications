import { useEffect, useRef } from 'react';
import { generateDateRange, isSameDay } from '../../../model/utils/dateHelpers';

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dateOptions = generateDateRange(new Date(), 30, 30);

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
      </div>
    </div>
  );
}
