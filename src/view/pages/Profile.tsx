import { useState } from "react";
import { useAuth } from "../../viewmodel/contexts/AuthContext";
import { useMedications } from "../../viewmodel/hooks/useMedications";
import { medicationStorage } from "../../model/repositories/MedicationRepository";
import { ConfirmModal } from "../components/common/Modal";

export function Profile() {
  const { user, logout } = useAuth();
  const { medications } = useMedications();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [clearModalOpen, setClearModalOpen] = useState(false);

  const initials = (user?.name || 'U')
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleClearData = () => {
    medicationStorage.clear();
    setClearModalOpen(false);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-graybg pb-40">

      {/* Header roxo com avatar e nome */}
      <header className="bg-darkpurple rounded-b-[60px] shadow-lg pt-12 pb-10 flex flex-col items-center gap-3">
        <div className="w-24 h-24 rounded-full bg-offwhite flex items-center justify-center shadow-md">
          <span className="font-merriweather font-bold text-4xl text-darkpurple">
            {initials}
          </span>
        </div>
        <h1 className="font-merriweather font-bold text-3xl text-offwhite text-center px-4">
          {user?.name || 'Usuário'}
        </h1>
        <p className="font-merriweather text-base text-lightpurple">
          {user?.email}
        </p>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 flex flex-col gap-4">

        {/* Estatísticas */}
        <section className="flex flex-col gap-3">
          <h2 className="font-merriweather font-bold text-xl text-darkpurple">
            Estatísticas
          </h2>
          <div className="bg-offwhite rounded-2xl px-5 py-4 shadow-sm border border-card-border flex justify-between items-center">
            <span className="font-merriweather text-lg text-inkblack">
              Medicamentos cadastrados
            </span>
            <span className="font-merriweather font-bold text-3xl text-darkpurple">
              {medications.length}
            </span>
          </div>
        </section>

        {/* Conta */}
        <section className="flex flex-col gap-3 mt-4">
          <h2 className="font-merriweather font-bold text-xl text-darkpurple">
            Conta
          </h2>

          <button
            onClick={() => setClearModalOpen(true)}
            className="bg-offwhite rounded-2xl px-5 py-4 shadow-sm border border-card-border flex justify-between items-center active:scale-95 transition-transform"
          >
            <div className="flex flex-col text-left">
              <span className="font-merriweather text-lg text-inkblack">
                Limpar dados de medicamentos
              </span>
              <span className="font-merriweather text-sm text-ghostcolor">
                Remove todos os medicamentos salvos no aparelho
              </span>
            </div>
          </button>

          <button
            onClick={() => setLogoutModalOpen(true)}
            className="bg-offwhite rounded-2xl px-5 py-4 shadow-sm border border-card-border flex justify-between items-center active:scale-95 transition-transform"
          >
            <span className="font-merriweather text-lg text-red-skip font-bold">
              Sair da conta
            </span>
          </button>
        </section>

        {/* Sobre */}
        <section className="flex flex-col gap-3 mt-4">
          <h2 className="font-merriweather font-bold text-xl text-darkpurple">
            Sobre
          </h2>
          <div className="bg-offwhite rounded-2xl px-5 py-4 shadow-sm border border-card-border">
            <p className="font-merriweather text-base text-inkblack">
              <span className="font-bold">Lembramed</span> — versão 0.1
            </p>
            <p className="font-merriweather text-sm text-ghostcolor mt-1">
              Aplicativo para acompanhar e lembrar dos seus medicamentos.
            </p>
          </div>
        </section>

      </main>

      <ConfirmModal
        isOpen={logoutModalOpen}
        title="Sair da conta?"
        message="Você precisará fazer login novamente."
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={() => {
          setLogoutModalOpen(false);
          logout();
        }}
        confirmText="Sair"
        cancelText="Cancelar"
        variant="warning"
      />

      <ConfirmModal
        isOpen={clearModalOpen}
        title="Limpar dados?"
        message="Todos os seus medicamentos serão removidos do aparelho. Essa ação não pode ser desfeita."
        onClose={() => setClearModalOpen(false)}
        onConfirm={handleClearData}
        confirmText="Sim, limpar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}
