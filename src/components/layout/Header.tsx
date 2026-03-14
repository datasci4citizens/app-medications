
import { formatHeaderDate } from "../../utils/dateHelpers";

interface HeaderProps {
  selectedDate: Date;
}

export function Header({ selectedDate }: HeaderProps) {


  return (
    <header className="bg-darkpurple rounded-b-[60px] shadow-lg">
      <div className="max-w-md mx-auto pt-10 pb-2" >
        <div className="flex items-center justify-center">
          <div>
            <h1
            // Tarefa: Arrumar o tamanho da fonte com Design System
              className="text-[40px]  font-merriweather  font-bold text-white hover:opacity-80 transition-opacity cursor-pointer"
            >
              {formatHeaderDate(selectedDate)}
            </h1>

          </div>
        </div>
      </div>

    </header>
  );
}
