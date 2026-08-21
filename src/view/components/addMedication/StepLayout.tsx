import { FiArrowLeft, FiCheck, FiChevronRight } from "react-icons/fi";
import { ProgressBar } from "../common/ProgressBar";

interface StepLayoutProps {
   title?: string;
   question: string;
   /** Frase de apoio abaixo da pergunta, quando ela precisa de contexto. */
   hint?: string;
   children: React.ReactNode;
   onBack: () => void;
   onNext: () => void;
   isValid: boolean;
   nextLabel?: string;
   stepKey?: string;
   direction?: 'forward' | 'back';
   stepIndex?: number;
   totalSteps?: number;
   isLastStep?: boolean;
}

export function StepLayout({
   title = 'Novo medicamento',
   question,
   hint,
   children,
   onBack,
   onNext,
   isValid,
   nextLabel,
   stepKey,
   direction = 'forward',
   stepIndex,
   totalSteps,
   isLastStep = false,
}: StepLayoutProps) {
   const animationClass = direction === 'forward' ? 'animate-fade-slide-up' : 'animate-fade-slide-down';
   const showProgress = stepIndex !== undefined && totalSteps !== undefined;
   const label = nextLabel ?? (isLastStep ? 'Salvar' : 'Próximo');

   return (
      <div className="min-h-screen bg-offwhite flex flex-col animate-slide-in-right">

         {/* Cabeçalho claro: o assistente é tarefa focada, não tela de navegação */}
         <div className="flex items-center gap-3 px-4 pt-13 pb-2">
            <button
               onClick={onBack}
               aria-label="Voltar"
               className="w-12 h-12 rounded-full bg-darkpurple text-offwhite flex items-center justify-center shrink-0 shadow-[0_6px_16px_rgba(91,42,120,0.35)] active:scale-90 transition-transform"
            >
               <FiArrowLeft size={22} />
            </button>

            <div className="min-w-0">
               {showProgress && (
                  <p className="font-inter text-[13px] font-bold uppercase tracking-[0.12em] text-[#999]">
                     Passo {stepIndex + 1} de {totalSteps}
                  </p>
               )}
               <h1 className="font-merriweather font-extrabold text-[22px] text-inkblack leading-tight truncate mt-0.5">
                  {title}
               </h1>
            </div>
         </div>

         {showProgress && (
            <div className="pb-2.5">
               <ProgressBar current={stepIndex} total={totalSteps} />
            </div>
         )}

         <div key={stepKey} className={`flex-1 px-6 pt-2 pb-36 overflow-y-auto ${animationClass}`}>
            <h2 className="font-merriweather font-extrabold text-[26px] text-inkblack leading-[1.2] mb-1">
               {question}
            </h2>
            {hint && (
               <p className="font-inter text-[16px] text-[#777] leading-[1.5] mb-4.5">{hint}</p>
            )}
            <div className={hint ? '' : 'mt-3'}>{children}</div>
         </div>

         <div className="fixed bottom-0 left-0 right-0 px-5 pb-7 pt-6 bg-gradient-to-t from-offwhite via-offwhite/95 to-transparent">
            <button
               onClick={onNext}
               disabled={!isValid}
               className={`btn-shine w-full max-w-md mx-auto h-16 rounded-full flex items-center justify-center gap-2.5
                  font-merriweather font-extrabold text-[22px] tracking-[0.02em] text-white
                  transition-transform duration-200
                  ${isLastStep
                     ? 'bg-green-take shadow-[0_12px_28px_rgba(36,189,118,0.40)]'
                     : 'bg-darkpurple shadow-[0_12px_28px_rgba(91,42,120,0.35)]'}
                  ${isValid ? 'active:scale-95' : 'opacity-40 cursor-not-allowed'}`}
            >
               {isLastStep
                  ? <><FiCheck size={22} strokeWidth={3} /> {label}</>
                  : <>{label} <FiChevronRight size={22} strokeWidth={3} /></>}
            </button>
         </div>
      </div>
   );
}
