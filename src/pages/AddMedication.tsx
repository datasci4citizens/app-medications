import { useEffect, useState } from 'react';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import type { Medication } from './types';

export function AddMedication() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('');
  const [brand, setBrand] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');

  useEffect(() => {
    if (id) {
      const savedData = localStorage.getItem('my_medications');
      if (savedData) {
        const list: Medication[] = JSON.parse(savedData);
        const found = list.find((item) => item.id === id);
        if (found) {
          setName(found.name);
          setDosage(found.dosage);
          setTime(found.time);
        }
      }
    }
  }, [id]);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !dosage || !time) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const savedData = localStorage.getItem('my_medications');
    const currentList: Medication[] = savedData ? JSON.parse(savedData) : [];

    let updatedList: Medication[];

    if (isEditing) {
      updatedList = currentList.map((item) =>
        item.id === id ? { ...item, name, dosage, time } : item,
      );
    } else {
      const newMedication: Medication = {
        id: Date.now().toString(),
        name,
        dosage,
        brand,
        time,
        scheduledDate,
        type: 'tablet',
        taken: false,
        status: 'pending',
      };
      updatedList = [...currentList, newMedication];
    }

    localStorage.setItem('my_medications', JSON.stringify(updatedList));
    alert(`Medicamento ${isEditing ? 'atualizado' : 'salvo'} com sucesso!`);
    navigate('/home');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/home')}
            className="text-gray-600 hover:text-blue-600 p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FiArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-800">
            {isEditing ? 'Editar Medicamento' : 'Novo Medicamento'}
          </h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <label
              htmlFor="name"
              className="text-sm font-semibold text-gray-700 uppercase tracking-wide"
            >
              Nome do Remédio
            </label>
            <input
              id="name"
              type="text"
              placeholder="Ex: Dipirona"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-4 rounded-lg border border-gray-300 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="dosage"
              className="text-sm font-semibold text-gray-700 uppercase tracking-wide"
            >
              Dosagem
            </label>
            <input
              id="dosage"
              type="text"
              placeholder="Ex: 50mg, 1 comprimido..."
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              className="p-4 rounded-lg border border-gray-300 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="time"
              className="text-sm font-semibold text-gray-700 uppercase tracking-wide"
            >
              Horário
            </label>
            <input
              id="time"
              type="time"
              placeholder="Ex: 08:00"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="p-4 rounded-lg border border-gray-300 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="brand"
              className="text-sm font-semibold text-gray-700 uppercase tracking-wide"
            >
              Marca
            </label>
            <input
              id="brand"
              type="text"
              value={brand}
              placeholder="Ex: EMS, Medley, Ache..."
              onChange={(e) => setBrand(e.target.value)}
              className="p-4 rounded-lg border border-gray-300 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="scheduledDate"
              className="text-sm font-semibold text-gray-700 uppercase tracking-wide"
            >
              Data
            </label>
            <input
              id="scheduledDate"
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="p-4 rounded-lg border border-gray-300 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white font-bold text-lg p-4 rounded-xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <FiSave size={20} />
            {isEditing ? 'Atualizar Medicamento' : 'Salvar Medicamento'}
          </button>
        </form>
      </main>
    </div>
  );
}
