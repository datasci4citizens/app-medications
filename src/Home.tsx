import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";

import { Header } from "./components/Header";
import { DateSelector } from "./components/DateSelector";
import { MedicationCard } from "./components/MedicationCard";
import type { Medication } from "./types";
import { mockMedication } from "./data/mockMedication";

export function Home() {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [medications, setMedications] = useState<Medication[]>(() => {
    const savedData = localStorage.getItem("my_medications");
    return savedData ? JSON.parse(savedData) : mockMedication;
  });

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

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      <Header onTitleClick={goToToday} />
      
      <DateSelector 
        selectedDate={selectedDate} 
        onDateChange={setSelectedDate} 
      />

      <main className="max-w-md mx-auto px-4 py-6">
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

        {medications.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            Nenhum medicamento para hoje.
          </p>
        )}
      </main>

      <button 
        onClick={() => navigate("/add")}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <FiPlus size={24} />
      </button>

    </div>
  )}