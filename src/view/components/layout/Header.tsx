import { formatHeaderDate } from "../../../model/utils/dateHelpers"
import type { DailyDose } from "../../../model/utils/medicationCalculations"

interface HeaderProps {
  selectedDate: Date;
  doses?: DailyDose[];
}

function dotColor(dose: DailyDose, isNext: boolean): string {
  if (dose.status === 'taken' || dose.status === 'taken_late') return 'var(--color-green-take)';
  if (dose.status === 'skipped') return 'var(--color-red-skip)';
  if (isNext) return 'var(--color-yellow-alert)';
  return 'rgba(255,255,255,0.28)';
}

export function Header({ selectedDate, doses = [] }: HeaderProps) {

  const takenCount = doses.filter(d => d.status === 'taken' || d.status === 'taken_late').length;
  const completion = doses.length > 0 ? Math.round((takenCount / doses.length) * 100) : 0;

  // Primeira dose ainda em aberto — destacada em âmbar entre os dots
  const nextIndex = doses.findIndex(d => d.status === 'late' || d.status === 'pending');

  return (
    <header className="bg-darkpurple rounded-b-[60px] shadow-lg relative overflow-hidden">
      {/* Brilho ambiente */}
      <div
        className="absolute -top-8 -right-8 w-40 h-40 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(206,199,221,0.35), transparent 70%)' }}
      />

      <div className="max-w-md mx-auto pt-10 pb-4 relative">
        <div className="flex flex-col items-center gap-2 px-4">
          <h1 className="text-[40px] font-merriweather font-bold text-white text-center leading-tight">
            {formatHeaderDate(selectedDate)}
          </h1>

          {doses.length > 0 && (
            <>
              {/* Um traço por dose — alonga e fica verde quando tomada */}
              <div className="flex justify-center gap-1.5 flex-wrap">
                {doses.map((dose, index) => (
                  <span
                    key={dose.occurrenceId}
                    className="h-1.5 rounded-full"
                    style={{
                      width: dose.status === 'taken' || dose.status === 'taken_late' ? 22 : 10,
                      background: dotColor(dose, index === nextIndex),
                      transition: 'all 400ms cubic-bezier(.4,0,.2,1)',
                    }}
                  />
                ))}
              </div>

              <p className="font-inter font-semibold text-[14px] text-offwhite/90">
                {completion}% do dia concluído · {takenCount} de {doses.length}
              </p>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
