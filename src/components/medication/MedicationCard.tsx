import { FiCheck, FiClock, FiEdit, FiTrash2, FiAlertCircle, FiChevronRight } from 'react-icons/fi';
import type { Medication } from '../../types/';
import { getBrandColor } from '../../utils/brandColorHelper';

interface MedicationCardProps {
  medication: Medication;
  onTake: () => void; // BUG 11: Padronizado
  onSkip: () => void; // BUG 11: Padronizado
  onDelete: () => void;
  onEdit: () => void;
  onClick: () => void;
}

export function MedicationCard({
  medication,
  onTake,
  onSkip,
  onDelete,
  onEdit,
  onClick,
}: MedicationCardProps) {
  const isTaken = medication.status === 'taken';
  const isSkipped = medication.status === 'skipped';
  const isPending = medication.status === 'pending';

  const brandColor = getBrandColor(medication.brand);

  return (
    <div
      onClick={onClick}
      className={`
    group relative flex w-full rounded-2xl shadow-md overflow-hidden transition-all cursor-pointer
    ${isTaken ? 'bg-green-50 opacity-80' : isSkipped ? 'bg-red-50 opacity-80' : 'bg-fuchsia-50 hover:shadow-lg'}
  `}
    >
      {/* Faixa Lateral */}
      <div
        style={{ backgroundColor: brandColor }}
        className="absolute left-3 top-0 bottom-0 w-4 shadow-sm"
      />

      {/* Container de Conteudo */}
      <div className="flex flex-1 items-center justify-between p-4 pl-12">
        {/* Info dos Medicamentos */}
        <div className="flex flex-col gap-1">
          <h3
            className={`font-bold text-lg leading-tight uppercase
          ${isTaken || isSkipped ? 'line-through text-gray-500' : 'text-black'}
          `}
          >
            {medication.name}
          </h3>

          <span className="text-gray-900 font-medium text-base">{medication.dosage}</span>
          {medication.brand && (
            <span className="text-gray-600 text-sm">Marca: {medication.brand}</span>
          )}

          {/* BUG 5: Mostra o horário sempre que houver, independente da marca */}
          {medication.time && (
            <span className="items-center flex gap-1 text-gray-500 text-sm">
              <FiClock size={14} /> {medication.time}
            </span>
          )}
        </div>

        {/* Botão Principal de Ação e Chevron */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end gap-2">
            {isPending && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTake();
                  }}
                  className="bg-green-500 text-white px-8 py-2.5 rounded-full font-semibold text-base hover:bg-green-600 active:scale-95 transition-all shadow-sm"
                >
                  Tomar
                </button>
                {/* BUG 17: Ação de Esqueci clara e visível */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSkip();
                  }}
                  className="text-red-500 text-xs font-bold flex items-center gap-1 hover:underline self-center"
                >
                  <FiAlertCircle size={12} /> Esqueci
                </button>
              </div>
            )}

            {/* Feedback Visual de Status Concluído */}
            {isTaken && (
              <span className="text-green-600 font-bold flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full text-sm">
                <FiCheck /> Tomado
              </span>
            )}
            {isSkipped && (
              <span className="text-red-600 font-bold flex items-center gap-1 bg-red-100 px-3 py-1 rounded-full text-sm">
                <FiAlertCircle /> Esquecido
              </span>
            )}
          </div>
          
          <FiChevronRight className="text-gray-300 group-hover:text-purple-500 transition-colors" size={20} />
        </div>
      </div>

      {/* Ações Secundárias (Editar/Excluir) - BUG 17: Removido Esqueci daqui */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-1.5 text-gray-400 hover:text-blue-500 bg-white/50 rounded-full"
        >
          <FiEdit size={14} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1.5 text-gray-400 hover:text-red-500 bg-white/50 rounded-full"
        >
          <FiTrash2 size={14} />
        </button>
      </div>
    </div>
  );
}
