import { useState, useEffect } from 'react';
import { FiArrowLeft, FiChevronRight, FiCheck, FiClock, FiFileText } from 'react-icons/fi';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useMedications } from '../hooks/useMedications';
import { medicationsDatabase } from '../data/mockMedicationsDatabase';
import { ConfirmModal } from '../components/common/Modal';

export function AddMedication() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // BUG 7: Pegar ID para edição
  const { addMedication, updateMedication, getMedicationById } = useMedications();
  
  const isEditing = Boolean(id);

  // Estados do Formulário
  const [step, setStep] = useState(0);
  const [startDate, setStartDate] = useState({ day: '', month: '', year: '2026' });
  const [endDate, setEndDate] = useState({ day: '', month: '', year: '2026' });
  const [time, setTime] = useState('08:00');
  const [dosage, setDosage] = useState(''); // BUG 8: Estado para dosagem
  
  // Estados Auxiliares
  const [showSelector, setShowSelector] = useState(false);
  const [selectorType, setSelectorType] = useState<'day' | 'month' | 'year'>('day');
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // BUG 9: Dados vindo do DB ou do Medicamento existente
  const medicationInfoId = location.state?.medicationInfoId;
  const [dbMed, setDbMed] = useState(medicationsDatabase.find(m => m.id === medicationInfoId));

  // BUG 7: Carregar dados para edição
  useEffect(() => {
    if (isEditing && id) {
      const existing = getMedicationById(id);
      if (existing) {
        setDosage(existing.dosage);
        setTime(existing.time);
        
        const start = new Date(existing.scheduledDate + 'T00:00:00');
        setStartDate({
          day: String(start.getDate()).padStart(2, '0'),
          month: months[start.getMonth()],
          year: String(start.getFullYear())
        });

        if (existing.endDate) {
          const end = new Date(existing.endDate + 'T00:00:00');
          setEndDate({
            day: String(end.getDate()).padStart(2, '0'),
            month: months[end.getMonth()],
            year: String(end.getFullYear())
          });
        }

        // Se estiver editando, busca o dbMed pelo link salvo
        if (existing.medicationInfoId) {
          setDbMed(medicationsDatabase.find(m => m.id === existing.medicationInfoId));
        }
      }
    }
  }, [id, isEditing, getMedicationById]);

  // BUG 9: Feedback se dbMed for nulo e não estivermos editando (evita formulário fantasma)
  useEffect(() => {
    if (!dbMed && !isEditing) {
      setErrorMessage('Informações do medicamento não encontradas. Por favor, pesquise novamente.');
      setErrorModalOpen(true);
    }
  }, [dbMed, isEditing]);

  const currentData = step === 0 ? startDate : endDate;
  const setCurrentData = step === 0 ? setStartDate : setEndDate;

  const handleSelectValue = (value: string) => {
    if (selectorType === 'day') {
      setCurrentData(prev => ({ ...prev, day: value }));
      setSelectorType('month');
    } else if (selectorType === 'month') {
      setCurrentData(prev => ({ ...prev, month: value }));
      setSelectorType('year');
    } else {
      setCurrentData(prev => ({ ...prev, year: value }));
      setShowSelector(false);
    }
  };

  const validateDates = () => {
    const monthIndexStart = months.indexOf(startDate.month);
    const monthIndexEnd = months.indexOf(endDate.month);
    const start = new Date(parseInt(startDate.year), monthIndexStart, parseInt(startDate.day));
    const end = new Date(parseInt(endDate.year), monthIndexEnd, parseInt(endDate.day));

    if (end < start) {
      setErrorMessage('A data final não pode ser anterior à data de início.');
      setErrorModalOpen(true);
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (step === 0) {
      setStep(1);
    } else if (step === 1) {
      if (validateDates()) setStep(2);
    } else if (step === 2) {
      setStep(3); // BUG 8: Novo passo para dosagem
    } else {
      handleSave();
    }
  };

  const handleSave = () => {
    // BUG 9: Proteção contra dbMed nulo
    if (!dbMed && !isEditing) {
      navigate('/search');
      return;
    }

    const monthIndexStart = months.indexOf(startDate.month);
    const monthIndexEnd = months.indexOf(endDate.month);
    const isoStart = `${startDate.year}-${String(monthIndexStart + 1).padStart(2, '0')}-${startDate.day}`;
    const isoEnd = `${endDate.year}-${String(monthIndexEnd + 1).padStart(2, '0')}-${endDate.day}`;

    const medicationData = {
      name: dbMed?.name || 'Medicamento',
      dosage: dosage || '1 dose',
      time: time,
      scheduledDate: isoStart,
      endDate: isoEnd,
      brand: dbMed?.commonBrands?.[0],
      type: (dbMed?.type.toLowerCase() === 'cápsula' ? 'capsule' : 'tablet') as any,
      taken: false,
      medicationInfoId: dbMed?.id,
      dosageInterval: dbMed?.dosageInterval || 24,
    };

    if (isEditing && id) {
      updateMedication(id, medicationData);
    } else {
      addMedication(medicationData);
    }

    navigate('/home');
  };

  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  const years = ['2025', '2026', '2027', '2028'];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="px-6 py-6 flex items-center gap-4">
        <button
          onClick={() => step > 0 ? setStep(step - 1) : navigate(-1)}
          className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white shadow-lg active:scale-95 transition-all"
        >
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-black text-gray-900">
          {isEditing ? 'Editar Medicamento' : 'Adicionar Medicamento'}
        </h1>
      </header>

      <div className="h-[1px] bg-gray-100 w-full" />

      <main key={step} className="flex-1 px-8 py-10 flex flex-col animate-fade-slide-up">
        
        {(step === 0 || step === 1) && (
          <div className="space-y-12 flex-1 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-gray-800 leading-tight text-center">
              {step === 0 ? 'Data do Início do Tratamento' : 'Data de final do tratamento'}
            </h2>

            <div 
              onClick={() => {
                setSelectorType('day');
                setShowSelector(true);
              }}
              className="flex items-baseline justify-center gap-3 text-4xl md:text-5xl font-black cursor-pointer group py-4"
            >
              <div className="flex flex-col items-center">
                <span className={currentData.day ? 'text-purple-600' : 'text-gray-200'}>
                  {currentData.day || '___'}
                </span>
                <span className="text-[10px] uppercase text-gray-400 font-bold mt-1">Dia</span>
              </div>
              <span className="text-gray-300 pb-6">,</span>
              <div className="flex flex-col items-center">
                <span className={currentData.month ? 'text-purple-600' : 'text-gray-200'}>
                  {currentData.month || '_____' }
                </span>
                <span className="text-[10px] uppercase text-gray-400 font-bold mt-1">Mês</span>
              </div>
              <span className="text-gray-300 pb-6">,</span>
              <div className="flex flex-col items-center">
                <span className="text-purple-600">{currentData.year}</span>
                <span className="text-[10px] uppercase text-gray-400 font-bold mt-1">Ano</span>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-12 flex-1 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-gray-800 leading-tight text-center">
              Horário da primeira dose
            </h2>
            <div className="flex justify-center">
              <div className="relative flex items-center bg-gray-50 rounded-3xl p-6 shadow-inner border border-gray-100">
                <FiClock className="absolute left-6 text-purple-600" size={32} />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="bg-transparent text-5xl font-black text-gray-800 outline-none pl-12 w-full text-center"
                />
              </div>
            </div>
          </div>
        )}

        {/* BUG 8: Step de Dosagem */}
        {step === 3 && (
          <div className="space-y-12 flex-1 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-gray-800 leading-tight text-center">
              Qual a dosagem?
            </h2>
            <div className="flex justify-center">
              <div className="relative flex items-center bg-gray-50 rounded-3xl p-6 shadow-inner border border-gray-100 w-full max-w-sm">
                <FiFileText className="absolute left-6 text-purple-600" size={28} />
                <input
                  type="text"
                  placeholder="Ex: 500mg, 1 cp..."
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  className="bg-transparent text-3xl font-black text-gray-800 outline-none pl-12 w-full text-center placeholder:text-gray-200"
                  autoFocus
                />
              </div>
            </div>
          </div>
        )}

        {showSelector && (step === 0 || step === 1) && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-end justify-center">
            <div className="bg-white w-full max-w-md rounded-t-[40px] p-8 animate-in slide-in-from-bottom duration-300 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-gray-900">
                  {selectorType === 'day' ? 'Qual o dia?' : selectorType === 'month' ? 'Qual o mês?' : 'Qual o ano?'}
                </h3>
                <button onClick={() => setShowSelector(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold hover:bg-gray-200">✕</button>
              </div>
              <div className="grid grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto hide-scrollbar pb-6">
                {selectorType === 'day' && days.map(d => (
                  <button key={d} onClick={() => handleSelectValue(d)} className={`py-5 rounded-2xl font-bold text-xl transition-all ${currentData.day === d ? 'bg-purple-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-purple-100'}`}>{d}</button>
                ))}
                {selectorType === 'month' && months.map(m => (
                  <button key={m} onClick={() => handleSelectValue(m)} className={`py-5 rounded-2xl font-bold text-lg transition-all col-span-3 px-6 text-left flex justify-between items-center ${currentData.month === m ? 'bg-purple-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-purple-100'}`}>{m}{currentData.month === m && <FiChevronRight />}</button>
                ))}
                {selectorType === 'year' && years.map(y => (
                  <button key={y} onClick={() => handleSelectValue(y)} className={`py-5 rounded-2xl font-bold text-xl transition-all col-span-3 ${currentData.year === y ? 'bg-purple-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-purple-100'}`}>{y}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="p-8 animate-fade-slide-up" style={{ animationDelay: '0.2s' }}>
        <button
          onClick={nextStep}
          disabled={(step < 2 && (!currentData.day || !currentData.month)) || (step === 3 && !dosage)}
          className={`w-full text-white font-black text-xl py-5 rounded-[32px] shadow-xl disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
            step === 3 ? 'bg-green-500 hover:bg-green-600' : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {step === 3 ? (<>FINALIZAR <FiCheck size={24} /></>) : (<>PRÓXIMO <FiChevronRight size={24} /></>)}
        </button>
      </footer>

      <ConfirmModal 
        isOpen={errorModalOpen}
        onClose={() => {
          setErrorModalOpen(false);
          if (!dbMed && !isEditing) navigate('/search');
        }}
        onConfirm={() => {
          setErrorModalOpen(false);
          if (!dbMed && !isEditing) navigate('/search');
        }}
        title="Atenção"
        message={errorMessage}
        confirmText="Entendi"
        cancelText="Voltar"
        variant={(!dbMed && !isEditing) ? "danger" : "warning"}
      />
    </div>
  );
}
