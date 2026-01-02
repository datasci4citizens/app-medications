import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSave, FiArrowLeft } from "react-icons/fi";

export function AddMedication() {
   const navigate = useNavigate();

   const [name, setName] = useState("");
   const [dosage, setDosage] = useState("");
   const [time, setTime] = useState("");

   function handleSave(e: React.FormEvent) {
      e.preventDefault();

      console.log("Saving ", { name, dosage, time });

      const newMedication = {
         id: Date.now().toString(), 
         name: name,
         dosage: dosage,
         time: time,
         type: 'tablet',
         taken: false
      }

      const savedData = localStorage.getItem("my_medications");

      const currentList = savedData ? JSON.parse(savedData) : [];

      const updatedList = [...currentList, newMedication];

      localStorage.setItem("my_medications", JSON.stringify(updatedList));

      alert("Medicamento salvo com sucesso!");

      navigate("/home")
   }

   return (
      <div className="min-h-screen bg-gray-50">
         <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-4">
               <button onClick={() => navigate("/home")}
                  className="text-gray-600 hover:text-blue-600 p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
                  <FiArrowLeft size={24} />
               </button>
               <h1 className="text-xl font-bold text-gray-800"> Novo Medicamento</h1>
            </div>
         </header>

         <main className="max-w-md mx-auto px-4 py-6">
            <form onSubmit={handleSave} className="flex flex-col gap-6">
               <div className="flex flex-col gap-4">
                  <label htmlFor="name" className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                     Nome do Remedio
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
                  <label htmlFor="dosage" className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
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
                  <label htmlFor="name" className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                     Horário
                  </label>
                  <input
                     id="time"
                     type="time"
                     placeholder="Ex: Dipirona"
                     value={time}
                     onChange={(e) => setTime(e.target.value)}
                     className="p-4 rounded-lg border border-gray-300 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
                     required
                  />
               </div>
               <button
                  type="submit"
                  className="mt-4 bg-blue-600 text-white font-bold text-lg p-4 rounded-xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
               >
                  <FiSave size={20} />
                  Salvar Medicamento
               </button>
            </form>
         </main>
      </div>


   );
}