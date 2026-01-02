import type { Medication } from "../types";
import { FiCheckCircle, FiCircle, FiClock, FiTrash2, FiEdit} from "react-icons/fi";


interface MedicationCardProps {
   medication: Medication,
   onToggle: (id: string) => void;
   onDelete: (id: string) => void;
   onEdit: (id: string) => void;
}

export function MedicationCard({ medication, onToggle, onDelete, onEdit }: MedicationCardProps) {
  return (
    <div 
      onClick={() => onToggle(medication.id)}
      className={`
        relative flex items-center justify-between p-4 rounded-xl shadow-sm border mb-3 cursor-pointer transition-all group
        ${medication.taken 
          ? "bg-green-50 border-green-200" 
          : "bg-white border-gray-100 hover:border-blue-200"
        }
      `}
    >
      {/* ... Lado Esquerdo (Igual) ... */}
      <div className="flex flex-col gap-1">
        <h3 className={`font-bold text-lg ${medication.taken ? "text-green-800 line-through opacity-70" : "text-gray-800"}`}>
          {medication.name}
        </h3>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-medium">
            {medication.dosage}
          </span>
          <span className="flex items-center gap-1">
            <FiClock size={14} />
            {medication.time}
          </span>
        </div>
      </div>

      {/* Lado Direito: Ações */}
      <div className="flex items-center gap-3">
        
        {/* Botão EDITAR (Novo) */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onEdit(medication.id);
          }}
          className="text-gray-400 hover:text-blue-500 p-2 rounded-full hover:bg-blue-50 transition-colors"
          title="Editar"
        >
          <FiEdit size={18} />
        </button>

        {/* Botão EXCLUIR */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(medication.id);
          }}
          className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
          title="Excluir"
        >
          <FiTrash2 size={18} />
        </button>

        {/* Checkbox */}
        <div className={`text-2xl ${medication.taken ? "text-green-600" : "text-gray-300"}`}>
          {medication.taken ? <FiCheckCircle /> : <FiCircle />}
        </div>
      </div>
    </div>
  );
}