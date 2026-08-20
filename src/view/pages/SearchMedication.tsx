import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronRight, FiX, FiSearch } from "react-icons/fi";
import { getPopularMedications, searchMedication } from "../../model/utils/medicationUtils";
import type { MedicationInfo } from "../../types";

const TYPE_FILTERS = [
  { id: 'all',       label: 'Todos'       },
  { id: 'Comprimido', label: 'Comprimido' },
  { id: 'Cápsula',   label: 'Cápsula'    },
  { id: 'Líquido',   label: 'Líquido'    },
  { id: 'Injeção',   label: 'Injeção'    },
];


function highlight(text: string, query: string) {
  if (!query) return text;
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark style={{ background: 'rgba(255,194,73,0.45)', color: 'inherit', padding: '0 2px', borderRadius: 3 }}>
        {text.slice(i, i + query.length)}
      </mark>
      {text.slice(i + query.length)}
    </>
  );
}

function MedRow({ med, query, onClick }: { med: MedicationInfo; query?: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 bg-white rounded-[22px] border border-[rgba(0,0,0,0.05)] text-left active:scale-[0.98] transition-transform"
      style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.07)', animationFillMode: 'both' }}
    >
      {/* Textos */}
      <div className="flex-1 min-w-0">
        <div className="font-merriweather font-bold text-[19px] text-inkblack leading-tight truncate">
          {highlight(med.name, query ?? '')}
        </div>
        <div className="font-inter text-sm text-gray-500 mt-0.5 truncate">
          {highlight(med.activeIngredient, query ?? '')}
        </div>
        <div className="flex gap-1.5 mt-2 flex-wrap">
          <span className="text-[11px] font-bold font-inter px-2 py-0.5 rounded-full bg-[rgba(91,42,120,0.10)] text-darkpurple">
            {med.type}
          </span>
          {med.commonBrands?.[0] && (
            <span className="text-[11px] font-bold font-inter px-2 py-0.5 rounded-full bg-[rgba(0,0,0,0.04)] text-gray-500">
              {med.commonBrands[0]}
            </span>
          )}
        </div>
      </div>

      <FiChevronRight size={20} className="text-darkpurple shrink-0" />
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="font-merriweather font-bold text-[18px] text-inkblack tracking-tight mb-3 px-1">
        {title}
      </h3>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center text-center py-14 animate-fade-slide-up">
      <div className="w-20 h-20 rounded-full bg-[rgba(91,42,120,0.10)] flex items-center justify-center mb-5 text-darkpurple">
        <FiSearch size={34} />
      </div>
      <p className="font-merriweather font-bold text-[22px] text-inkblack mb-2">Nenhum resultado</p>
      <p className="font-inter text-sm text-gray-500 leading-relaxed">
        Não encontramos nada para <b>"{query}"</b>.<br />Tente outro nome ou substância.
      </p>
    </div>
  );
}


export function SearchMedication() {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isExiting, setIsExiting] = useState(false);
  const navigate = useNavigate();

  const queryLower = query.trim().toLowerCase();

  const results = useMemo(() => searchMedication(queryLower, typeFilter), [queryLower, typeFilter]);

  const popular = useMemo(() => getPopularMedications(), []);

  const showSections = !queryLower && typeFilter === 'all';

  function handleBack() {
    setIsExiting(true);
    setTimeout(() => navigate(-1), 250);
  }

  function goToMed(med: MedicationInfo) {
    navigate(`/medication/search/${med.id}`);
  }

  return (
    <div className={`min-h-screen bg-[#ffffff] px-6 py-8 ${isExiting ? 'page-exit-right' : 'page-transition-right'}`}>

      {/* Cabeçalho — mantido original */}
      <div className="flex gap-4 items-center mb-8">
        <button
          onClick={handleBack}
          className="p-3 bg-darkpurple rounded-full text-offwhite transition-all duration-300 shadow-sm active:scale-90"
        >
          <FiX size={32} />
        </button>
        <h1 className="text-2xl font-merriweather font-bold text-darkpurple tracking-tight">
          Buscar Medicamento
        </h1>
      </div>

      {/* Barra de Busca */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <FiSearch className="text-offwhite font-black" size={24} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nome, marca ou substância"
          autoFocus
          className="w-full bg-[#CEC7DD] border-none rounded-xl py-4 pl-12 pr-10 text-white font-bold placeholder-white focus:ring-2 ring-purple-500 transition-all outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-3 flex items-center text-white opacity-70 active:opacity-100"
          >
            <FiX size={18} />
          </button>
        )}
      </div>

      {/* Filter chips */}
      <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1 mb-5">
        {TYPE_FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setTypeFilter(f.id)}
            className="shrink-0 px-4 py-2 rounded-full font-inter font-bold text-[13px] transition-all duration-150 active:scale-95"
            style={{
              background: typeFilter === f.id ? 'var(--color-darkpurple)' : '#fff',
              color: typeFilter === f.id ? '#fff' : 'var(--color-darkpurple)',
              border: typeFilter === f.id ? 'none' : '1px solid rgba(91,42,120,0.20)',
              boxShadow: typeFilter === f.id ? '0 4px 12px rgba(91,42,120,0.30)' : '0 1px 4px rgba(0,0,0,0.06)',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Body */}
      <div>
        {showSections ? (
          <Section title="Mais comuns">
            {popular.map(m => (
              <MedRow key={m.id} med={m} onClick={() => goToMed(m)} />
            ))}
          </Section>
        ) : results.length > 0 ? (
          <>
            <p className="font-inter text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 px-1">
              {results.length} {results.length === 1 ? 'resultado' : 'resultados'}
            </p>
            <div className="flex flex-col gap-2">
              {results.map(m => (
                <MedRow key={m.id} med={m} query={queryLower} onClick={() => goToMed(m)} />
              ))}
            </div>
          </>
        ) : (
          <EmptyState query={query} />
        )}
      </div>

    </div>
  );
}
