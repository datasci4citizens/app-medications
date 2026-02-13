import type { Medication } from "../types";
import { FiClock, FiTrash2, FiEdit, FiCheck, FiX } from "react-icons/fi"

interface MedicationCardProps {
  medication: Medication;
  onTake: (id: string) => void;
  onSkip: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export function MedicationCard({ medication, onTake, onSkip, onDelete, onEdit }: MedicationCardProps) {

  const isTaken = medication.status === 'taken';
  const isSkipped = medication.status === 'skipped'
  const isPending = medication.status === 'pending';

  return (

    <div className={`
    group relative flex w-full rounded-2xl shadow-md overflow-hidden transition-all
    ${isTaken ? 'bg-green-50 opacity-80' : isSkipped ? 'bg-red-50 opacity-80' : 'bg-fuchsia-50 hover:shadow-lg'}
  `}>

      {/* Faixa Lateral */}
      <div className={`
      absolute left-3 top-0 bottom-0 w-4 shadow-sm
      ${isTaken ? 'bg-green-500' :
          isSkipped ? 'bg-red-500' :
            'bg-pink-600'}
    `} />

      {/* Container de Conteudo */}

      <div className="flex flex-1 items-center justify-between p-4 pl-12">
        {/* Info dos Medicamentos */}

        <div className="flex flex-col gap-1">
          <h3 className={`font-bold text-lg leading-tight uppercase
          ${isTaken || isSkipped ? 'line-through text-gray-500' : 'text-black'}
          `}>{medication.name}
          </h3>

          <span className="text-gray-900 font-medium text-base">
            {medication.dosage}
          </span>
          {medication.brand && (
            <span className="text-gray-600 text-sm">
              Marca: {medication.brand}
            </span>
          )}

          {medication.brand && (
            <span className="items-center flex gap-1 text-gray-500 text-sm"> <FiClock size={14}/> {medication.time} </span>
          )}

        </div>

        {/* Botão Principal de Ação */}

        <div className="flex flex-col items-end gap-2">
          {isPending && (
            <button
              onClick={() => onTake(medication.id)}
              className="bg-green-500 text-white px-8 py-2.5 rounded-full font-semibold text-base hover:bg-green-600 active:scale-95 transition-all shadow-sm"
            >
              Tomar
            </button>
          )}

          {/* Feedback Visual de Status Concluído */}
          {isTaken && (
            <span className="text-green-600 font-bold flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full text-sm">
              <FiCheck /> Tomado
            </span>
          )}
          {isSkipped && (
            <span className="text-red-600 font-bold flex items-center gap-1 bg-red-100 px-3 py-1 rounded-full text-sm">
              <FiX /> Esquecido
            </span>
          )}
        </div>
      </div>

      {/* Ações Secundárias (Editar/Excluir/Esqueci) */}

      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {isPending && (
          <button onClick={() => onSkip(medication.id)} className="p-1.5 text-gray-400 hover:text-red-500 bg-white/50 rounded-full" title="Marcar como esquecido">
            <FiX size={14} />
          </button>
        )}
        <button onClick={() => onEdit(medication.id)} className="p-1.5 text-gray-400 hover:text-blue-500 bg-white/50 rounded-full">
          <FiEdit size={14} />
        </button>
        <button onClick={() => onDelete(medication.id)} className="p-1.5 text-gray-400 hover:text-red-500 bg-white/50 rounded-full">
          <FiTrash2 size={14} />
        </button>
      </div>

    </div>);
}
