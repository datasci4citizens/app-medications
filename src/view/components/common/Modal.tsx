import { FiAlertTriangle, FiInfo, FiAlertCircle } from 'react-icons/fi';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger'
}: ConfirmModalProps) {
  
  if (!isOpen) return null;

  const theme = {
    danger: {
      icon: <FiAlertTriangle size={40} className="text-red-600" />,
      buttonBg: 'bg-red-600 hover:bg-red-700',
      iconBg: 'bg-red-100 border-2 border-red-500' 
    },
    warning: {
      icon: <FiAlertCircle size={40} className="text-yellow-600" />,
      buttonBg: 'bg-yellow-500 hover:bg-yellow-600',
      iconBg: 'bg-yellow-100 border-2 border-yellow-500'
    },
    info: {
      icon: <FiInfo size={40} className="text-blue-600" />,
      buttonBg: 'bg-blue-600 hover:bg-blue-700',
      iconBg: 'bg-blue-100 border-2 border-blue-500'
    }
  };

  const currentTheme = theme[variant];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-4xl shadow-xl p-8 w-full max-w-sm flex flex-col items-center text-center">
        
        {/* Círculo do Ícone */}
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${currentTheme.iconBg}`}>
          {currentTheme.icon}
        </div>

        {/* Título (com o sublinhado azul do seu design) */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 underline decoration-blue-500 decoration-2 underline-offset-4">
          {title}
        </h3>
        
        {/* Mensagem Opcional */}
        {message && <p className="text-gray-500 mt-2 mb-4">{message}</p>}

        {/* Botões */}
        <div className="flex w-full gap-4 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-white border border-black rounded-full text-black font-semibold hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 px-4 text-white rounded-full font-semibold transition-colors ${currentTheme.buttonBg}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}