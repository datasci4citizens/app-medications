import { useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiChevronRight, FiSearch, FiX } from "react-icons/fi";
import { getPopularMedications, searchMedication } from "../../model/utils/medicationUtils";
import { PillTypeIcon } from "../components/medication/PillTypeIcon";
import { MEDICATION_TYPE_COLORS } from "../../constants";
import type { MedicationInfo } from "../../types";

const TYPE_FILTERS: { id: string; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'Comprimido', label: 'Comprimido' },
  { id: 'Cápsula', label: 'Cápsula' },
  { id: 'Líquido', label: 'Líquido' },
  { id: 'Injeção', label: 'Injeção' },
];

function highlight(text: string, query: string) {
  if (!query) return text;
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-yellow-alert/45 text-inherit px-0.5 rounded-[3px]">
        {text.slice(i, i + query.length)}
      </mark>
      {text.slice(i + query.length)}
    </>
  );
}

function Tag({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <span
      className="px-2.5 py-0.5 rounded-full font-inter font-bold text-[11px] whitespace-nowrap"
      style={color
        ? { background: `${color}22`, color }
        : { background: 'rgba(0,0,0,0.04)', color: '#666' }}
    >
      {children}
    </span>
  );
}

function MedRow({ med, query, onClick, delay = 0 }: { med: MedicationInfo; query?: string; onClick: () => void; delay?: number }) {
  const typeColor = MEDICATION_TYPE_COLORS[med.type] ?? '#9254AD';

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3.5 px-4 py-3.5 bg-offwhite rounded-[22px] border border-black/5 text-left shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-transform active:scale-[0.98]"
      style={{ animation: `fadeSlideUp 320ms ease-out ${delay}ms both` }}
    >
      {/* Medalhão da forma farmacêutica */}
      <span
        className="relative w-13.5 h-13.5 rounded-2xl flex items-center justify-center text-white shrink-0 overflow-hidden"
        style={{
          background: `linear-gradient(160deg, ${typeColor}, ${typeColor}aa)`,
          boxShadow: `0 6px 14px ${typeColor}55`,
        }}
      >
        <span className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent to-50%" />
        <PillTypeIcon type={med.type} size={26} />
      </span>

      <div className="flex-1 min-w-0">
        <p className="font-merriweather font-extrabold text-[19px] text-inkblack leading-tight truncate">
          {highlight(med.name, query ?? '')}
        </p>
        <p className="font-inter text-[13px] text-[#666] mt-0.5 truncate">
          {highlight(med.activeIngredient, query ?? '')}
        </p>
        <div className="flex gap-1.5 mt-2 flex-wrap">
          <Tag color={typeColor}>{med.type}</Tag>
          {med.commonBrands?.[0] && <Tag>{med.commonBrands[0]}</Tag>}
        </div>
      </div>

      <FiChevronRight size={18} className="text-darkpurple shrink-0" />
    </button>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-5.5">
      <h2 className="font-merriweather font-extrabold text-[18px] text-inkblack mb-3 px-1">
        {title}
      </h2>
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
      <p className="font-inter text-[15px] text-ghostcolor leading-relaxed">
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

  return (
    <div className={`min-h-screen bg-graybg pb-10 ${isExiting ? 'page-exit-right' : 'page-transition-right'}`}>

      {/* Cabeçalho roxo, com a busca dentro dele */}
      <div className="relative overflow-hidden bg-darkpurple rounded-b-[36px] pt-13 pb-5.5 shadow-[0_8px_20px_rgba(91,42,120,0.25)]">
        <div
          className="absolute -top-8 -right-8 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(206,199,221,0.30), transparent 70%)' }}
        />

        <div className="relative flex items-center gap-2.5 px-4">
          <button
            onClick={handleBack}
            aria-label="Voltar"
            className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center shrink-0 active:scale-90 transition-transform"
          >
            <FiArrowLeft size={22} />
          </button>
          <h1 className="font-merriweather font-extrabold text-[24px] text-offwhite">
            Pesquisar
          </h1>
        </div>

        {/* Campo apoiado sobre a emenda do cabeçalho */}
        <div className="relative px-4 pt-3.5">
          <div
            className={`flex items-center gap-2.5 bg-offwhite rounded-full px-4.5 py-3.5 shadow-[0_10px_24px_rgba(0,0,0,0.18)] border-2 transition-colors duration-200 ${query ? 'border-yellow-alert' : 'border-transparent'}`}
          >
            <FiSearch size={22} className="text-darkpurple shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nome, marca ou substância"
              autoFocus
              className="flex-1 min-w-0 bg-transparent border-none outline-none font-merriweather font-semibold text-[17px] text-inkblack placeholder:text-ghost-gray"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Limpar busca"
                className="w-7 h-7 rounded-full bg-black/8 text-[#666] flex items-center justify-center shrink-0 animate-scale-in"
              >
                <FiX size={14} strokeWidth={3} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filtros por forma */}
      <div className="hide-scrollbar flex gap-2 overflow-x-auto px-4 pt-3.5 pb-1.5">
        {TYPE_FILTERS.map(filter => {
          const isActive = typeFilter === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => setTypeFilter(filter.id)}
              className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full font-inter font-bold text-[13px] whitespace-nowrap transition-colors duration-150 active:scale-95
                ${isActive
                  ? 'bg-darkpurple text-offwhite border border-darkpurple'
                  : 'bg-offwhite text-darkpurple border border-black/6'}`}
            >
              {filter.id !== 'all' && (
                <PillTypeIcon type={filter.id as MedicationInfo['type']} size={15} />
              )}
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="px-4 pt-2 pb-5">
        {showSections ? (
          <Section title="Mais comuns">
            {popular.map((med, i) => (
              <MedRow key={med.id} med={med} delay={i * 60} onClick={() => navigate(`/medication/search/${med.id}`)} />
            ))}
          </Section>
        ) : results.length > 0 ? (
          <>
            <p className="font-inter text-[13px] font-semibold text-[#888] uppercase tracking-[0.08em] mb-3 px-1">
              {results.length} {results.length === 1 ? 'resultado' : 'resultados'}
            </p>
            <div className="flex flex-col gap-2">
              {results.map((med, i) => (
                <MedRow key={med.id} med={med} query={queryLower} delay={i * 50} onClick={() => navigate(`/medication/search/${med.id}`)} />
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
