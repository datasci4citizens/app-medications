import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertCircle, FiArrowLeft, FiChevronRight, FiSearch, FiX } from "react-icons/fi";
import { useCatalogSearch } from "../../viewmodel/hooks/useCatalogSearch";
import { activeIngredients, displayName, type CatalogMedication } from "../../model/repositories/CatalogRepository";
import { PillTypeIcon } from "../components/medication/PillTypeIcon";
import { MEDICATION_TYPE_COLORS } from "../../constants";
import type { MedicationInfo } from "../../types";

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
      className="px-2.5 py-0.5 rounded-full font-inter font-bold text-[11px] whitespace-nowrap max-w-45 truncate"
      style={color ? { background: `${color}22`, color } : { background: 'rgba(0,0,0,0.04)', color: '#666' }}
    >
      {children}
    </span>
  );
}

function MedRow({ med, query, onClick, delay = 0 }: { med: CatalogMedication; query: string; onClick: () => void; delay?: number }) {
  const typeColor = (med.formato && MEDICATION_TYPE_COLORS[med.formato]) || '#9254AD';
  const title = displayName(med);
  const ingredients = activeIngredients(med).join(', ');

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3.5 px-4 py-3.5 bg-offwhite rounded-[22px] border border-black/5 text-left shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-transform active:scale-[0.98]"
      style={{ animation: `fadeSlideUp 320ms ease-out ${delay}ms both` }}
    >
      <span
        className="relative w-13.5 h-13.5 rounded-2xl flex items-center justify-center text-white shrink-0 overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${typeColor}, ${typeColor}aa)`, boxShadow: `0 6px 14px ${typeColor}55` }}
      >
        <span className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent to-50%" />
        <PillTypeIcon type={(med.formato ?? '') as MedicationInfo['type']} size={26} />
      </span>

      <div className="flex-1 min-w-0">
        <p className="font-merriweather font-extrabold text-[19px] text-inkblack leading-tight truncate">
          {highlight(title, query)}
        </p>
        {ingredients && (
          <p className="font-inter text-[13px] text-[#666] mt-0.5 truncate">
            {highlight(ingredients, query)}
          </p>
        )}
        <div className="flex gap-1.5 mt-2 flex-wrap">
          {med.formato && <Tag color={typeColor}>{med.formato}</Tag>}
          {med.company && <Tag>{med.company}</Tag>}
        </div>
      </div>

      <FiChevronRight size={18} className="text-darkpurple shrink-0" />
    </button>
  );
}

function RowSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="w-full flex items-center gap-3.5 px-4 py-3.5 bg-offwhite rounded-[22px] border border-black/5"
      style={{ animation: `fadeSlideUp 320ms ease-out ${delay}ms both` }}
    >
      <span className="w-13.5 h-13.5 rounded-2xl bg-black/8 shrink-0 animate-pulse" />
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <span className="h-4 w-2/3 rounded bg-black/8 animate-pulse" />
        <span className="h-3 w-1/2 rounded bg-black/6 animate-pulse" />
      </div>
    </div>
  );
}

function StateMessage({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center text-center py-14 animate-fade-slide-up">
      <div className="w-20 h-20 rounded-full bg-[rgba(91,42,120,0.10)] flex items-center justify-center mb-5 text-darkpurple">
        {icon}
      </div>
      <p className="font-merriweather font-bold text-[22px] text-inkblack mb-2">{title}</p>
      <p className="font-inter text-[15px] text-ghostcolor leading-relaxed">{children}</p>
    </div>
  );
}

export function SearchMedication() {
  const [query, setQuery] = useState('');
  const [isExiting, setIsExiting] = useState(false);
  const navigate = useNavigate();

  const { results, count, isLoading, error } = useCatalogSearch(query);

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
          <h1 className="font-merriweather font-extrabold text-[24px] text-offwhite">Pesquisar</h1>
        </div>

        <div className="relative px-4 pt-3.5">
          <div className={`flex items-center gap-2.5 bg-offwhite rounded-full px-4.5 py-3.5 shadow-[0_10px_24px_rgba(0,0,0,0.18)] border-2 transition-colors duration-200 ${query ? 'border-yellow-alert' : 'border-transparent'}`}>
            <FiSearch size={22} className="text-darkpurple shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nome ou substância"
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

      <div className="px-4 pt-4 pb-5">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {[0, 1, 2, 3, 4].map(i => <RowSkeleton key={i} delay={i * 60} />)}
          </div>
        ) : error ? (
          <StateMessage icon={<FiAlertCircle size={34} />} title="Não deu para buscar">
            {error}
          </StateMessage>
        ) : results.length === 0 ? (
          <StateMessage icon={<FiSearch size={34} />} title="Nenhum resultado">
            {query
              ? <>Não encontramos nada para <b>"{query}"</b>.<br />Tente outro nome ou substância.</>
              : <>O catálogo está vazio no momento.</>}
          </StateMessage>
        ) : (
          <>
            <p className="font-inter text-[13px] font-semibold text-[#888] uppercase tracking-[0.08em] mb-3 px-1">
              {query
                ? `${count} ${count === 1 ? 'resultado' : 'resultados'}`
                : `${count} medicamentos no catálogo`}
            </p>
            <div className="flex flex-col gap-2">
              {results.map((med, i) => (
                <MedRow
                  key={med.medication_id}
                  med={med}
                  query={query.trim()}
                  delay={i * 50}
                  onClick={() => navigate(`/medication/search/${med.medication_id}`)}
                />
              ))}
            </div>
            {count > results.length && (
              <p className="font-inter text-[13px] text-ghostcolor text-center mt-4">
                Mostrando os {results.length} primeiros. Refine a busca para achar o que procura.
              </p>
            )}
          </>
        )}
      </div>

    </div>
  );
}
