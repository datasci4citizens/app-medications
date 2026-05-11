import { NavBottom } from "../layout/NavBottom";

interface StepLayoutProps {
   title?: string;
   question: string;
   children: React.ReactNode;
   onBack: () => void;
   onNext: () => void;
   isValid: boolean;
   nextLabel?: string;
}

export function StepLayout({
   title = 'Adicionar medicamento',
   question,
   children,
   onBack,
   onNext,
   isValid,
   nextLabel = 'Próximo',
}: StepLayoutProps) {
   return (
      <div className="min-h-screen bg-graybg flex flex-col">
         <div className="p-4 flex flex-col gap-4">
            <div className="flex items-center gap-3">
               <NavBottom OnClick={onBack} type="back" size={55} />
               <h1 className="font-merriweather text-2xl font-bold text-darkpurple">{title}</h1>
            </div>
            <div className="border-b border-darkpurple" />
            <h2 className="font-merriweather text-2xl font-bold text-inkblack">{question}</h2>
         </div>

         <div className="flex-1 px-4 pb-32 overflow-y-auto">
            {children}
         </div>

         <button
            onClick={onNext}
            disabled={!isValid}
            className={`
               fixed bottom-0 left-0 right-0
               mx-auto w-[calc(100%-2rem)] max-w-md mb-4
               font-merriweather font-bold text-2xl text-center
               rounded-[0.625rem]
               py-3
               transition-all duration-300
               ${isValid
                  ? 'bg-darkpurple text-offwhite active:scale-95'
                  : 'bg-ghost-gray text-offwhite cursor-not-allowed opacity-60'}
            `}
         >
            {nextLabel}
         </button>
      </div>
   );
}
