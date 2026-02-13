import { useRef, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { generateDateRange, formatDateLabel, isSameDay } from "../utils/dateHelpers";

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
          block: 'nearest'
        });
      }
    }
  }, [selectedDate]);

  function navigateDate(direction: 'prev' | 'next') {
    const currentIndex = dateOptions.findIndex(d => isSameDay(d, selectedDate));
    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex >= 0 && newIndex < dateOptions.length) {
      onDateChange(dateOptions[newIndex]);
    }
  }

  return (
    <div className="bg-gray-50 py-4">
      <div className="max-w-md mx-auto px-4 flex items-center gap-2">
        
        <button 
          onClick={() => navigateDate('prev')}
          className="text-purple-600 hover:bg-purple-100 p-2 rounded-full shrink-0"
        >
          <FiChevronLeft size={20} />
        </button>
        
        <div
          ref={scrollRef}
          className="flex-1 flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory hide-scrollbar py-4 px-2"
          style={{ scrollbarWidth: 'none' }}
        >
          {dateOptions.map((date, index) => {
            const isSelected = isSameDay(date, selectedDate);
            const label = formatDateLabel(date);

            return (
              <button
                key={index}
                data-active={isSelected}
                onClick={() => onDateChange(date)}
                className={`
                  shrink-0 snap-center px-6 py-2 rounded-full font-medium
                  transition-all duration-300 ease-out whitespace-nowrap
                  ${isSelected
                    ? 'bg-purple-600 text-white shadow-xl scale-110 ring-4 ring-purple-200'
                    : 'bg-white text-gray-500 hover:bg-purple-50 border border-gray-100'
                  }
                `}
              >
                {label}
              </button>
            );
          })}
        </div>

        <button 
          onClick={() => navigateDate('next')}
          className="text-purple-600 hover:bg-purple-100 p-2 rounded-full shrink-0"
        >
          <FiChevronRight size={20} />
        </button>
        
      </div>
    </div>
  );
}
