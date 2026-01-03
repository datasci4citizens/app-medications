import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiPlus, FiUser } from "react-icons/fi";

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

  // SELETOR DE DATA

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const dateOptions = [
    new Date(Date.now() - 86400000), // Ontem
    new Date(), // Hoje
    new Date(Date.now() + 86400000) // Amanha
  ]

 function formatDateButton(date: Date, isSelected: boolean): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  
  const diffDays = Math.floor((compareDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (isSelected) {
    const dayName = diffDays === 0 ? "Hoje" : diffDays === -1 ? "Ontem" : "Amanhã";
    const day = date.getDate();
    const month = date.toLocaleDateString('pt-BR', {month: 'short'});
    return `${dayName}, ${day} de ${month}.`;
  }
  
  // Versão curta pros não selecionados
  if (diffDays === 0) return "Hoje";
  if (diffDays === -1) return "Ontem";
  if (diffDays === 1) return "Amanhã";
  return "";
}

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
    if (!confirm("Tem certeza?")) return;

    setMedications(currentList => {
      const newList = currentList.filter(med => med.id !== id);
      localStorage.setItem("my_medications", JSON.stringify(newList));

      return newList;
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* --- CABEÇALHO --- */}
      <header className="bg-purple-600 rounded-b-3xl shawdow-lg">
        <div className="max-w-md mx-auto px-6 py-6">
          <div className="flex justify-between items-center ">
            <h1 className="text-2xl font-bold text-white"> Medicamentos</h1>
            {/* Título + Avatar */}
            {/* <p className="text-xs text-gray-500">Hoje, {new Date().toLocaleDateString('pt-BR')}</p> */}
            <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center">
              <FiUser className="text-white" size={24} />
              {/* <span className="text-gray-600 text-xl">👤</span> */}
            </div>
          </div>

          {/* <button onClick={handleLogout} className="text-gray-400 hover:text-red-500">
            <FiLogOut size={20} />
          </button> */}
        </div>
      </header>

      {/* Seletor de Datas */}
      <div className="bg-gray-50 py-4">
  <div className="max-w-md mx-auto px-4">
    
    {/* Container com fundo roxo claro */}
    <div className="bg-purple-200 rounded-full p-1 flex items-center justify-between">
      
      {dateOptions.map((date, index) => {
        const isSelected = date.toDateString() === selectedDate.toDateString();
        const label = formatDateButton(date, isSelected);
        
        return (
          <button
            key={index}
            onClick={() => setSelectedDate(date)}
            className={`
              flex-1 text-center py-2.5 rounded-full transition-all duration-200 font-medium
              ${isSelected 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'text-purple-600 hover:text-purple-700'
              }
            `}
          >
            {label}
          </button>
        );
      })}
      
    </div>
  </div>
</div>



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