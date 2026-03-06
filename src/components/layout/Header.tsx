import { FiUser, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { useAuth } from '../../contexts/AuthContext';
import { ConfirmModal } from '../common/Modal';


interface HeaderProps {
  onTitleClick: () => void;
}

export function Header({ onTitleClick }: HeaderProps) {

  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  }

  const confirmLogout = () => {
    logout();
    navigate('/');
  }

  return (
    <header className="bg-purple-600 rounded-b-3xl shadow-lg">
      <div className="max-w-md mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          <div>
            <button
              onClick={onTitleClick}
              className="text-2xl font-bold text-white hover:opacity-80 transition-opacity cursor-pointer"
            >
              Medicamentos
            </button>
            {user && (
              <p className="text-white/80 text-sm mt-1">
                Olá, {user.name}! 
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center">
              <FiUser className="text-white" size={24} />
            </div>

            {/* Botão de Logout */}
            <button
              onClick={handleLogout}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
              title="Sair"
            >
              <FiLogOut className="text-white" size={20} />
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        title="Deseja Sair?"
        message="Sua sessão será encerrada."
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        confirmText="Sair"
        cancelText="Voltar"
        variant="warning"
      />
    </header>
  );
}
