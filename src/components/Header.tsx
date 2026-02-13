import { FiUser } from "react-icons/fi";

interface HeaderProps {
  onTitleClick: () => void;
}

export function Header({ onTitleClick }: HeaderProps) {
  return (
    <header className="bg-purple-600 rounded-b-3xl shadow-lg">
      <div className="max-w-md mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          <button 
            onClick={onTitleClick}
            className="text-2xl font-bold text-white hover:opacity-80 transition-opacity cursor-pointer"
          >
            Medicamentos
          </button>
          <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center">
            <FiUser className="text-white" size={24} />
          </div>
        </div>
      </div>
    </header>
  );
}
