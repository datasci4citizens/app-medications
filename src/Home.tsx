import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiPlus } from "react-icons/fi";

import { MedicationCard } from "./components/MedicationCard";
import type { Medication } from "./types";
import { mockMedication } from "./data/mockMedication";
export function Home() {
  const navigate = useNavigate();

  // const [medications, setMedications] = useState<Medication[]>(mockMedication);
  const [medications, setMedications] = useState<Medication[]>(() => {
    const savedData = localStorage.getItem("my_medications");
    if (savedData) {
      return JSON.parse(savedData);
    }
    return mockMedication;
  });



  function handleLogout() {
    localStorage.removeItem("my_medications");
    navigate('/');
  }

  const toggleMedication = (id: string) => {
    setMedications(currentList => {
      // Cria a nova lista com a alteração
      const newList = currentList.map(med => {
        if (med.id === id) {
          return { ...med, taken: !med.taken };
        }
        return med;
      });

      // Salva no cofre para não perder se der F5
      localStorage.setItem("my_medications", JSON.stringify(newList));

      return newList;
    });
  }

  const editMedication = (id: string) => {
    navigate(`/edit/${id}`)
  }

  const deleteMedication = (id: string) => {
    if(!confirm("Tem certeza?")) return;

    setMedications(currentList => {
      const newList = currentList.filter(med => med.id !== id);
      localStorage.setItem("my_medications", JSON.stringify(newList));
      
      return newList;
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* --- CABEÇALHO --- */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-blue-600">Meus Medicamentos</h1>
            <p className="text-xs text-gray-500">Hoje, {new Date().toLocaleDateString('pt-BR')}</p>
          </div>

          <button onClick={handleLogout} className="text-gray-400 hover:text-red-500">
            <FiLogOut size={20} />
          </button>
        </div>
      </header>

      {/* --- LISTA DE MEDICAMENTOS --- */}
      <main className="max-w-md mx-auto px-4 py-6">

        {/* Aqui fazemos o Loop (Map) */}
        <div className="flex flex-col">
          {medications.map((med) => (
            <MedicationCard
              key={med.id}
              medication={med}
              onToggle={toggleMedication}              
              onDelete={deleteMedication}
              onEdit={editMedication}

            />
          ))}
        </div>

        {/* Estado vazio (caso a lista estivesse vazia) */}
        {medications.length === 0 && (
          <p className="text-center text-gray-500 mt-10">Nenhum medicamento para hoje.</p>
        )}

      </main>

      <div className="fixed bottom-6 right-6">
        <button onClick={() => navigate("/add")}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors cursor-pointer">
          <FiPlus size={24} />
        </button>
      </div>

    </div>
  )
}