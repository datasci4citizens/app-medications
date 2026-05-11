import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useMedications } from "./useMedications";
import { medicationsDatabase } from "../../model/data/mockMedicationsDatabase";


export function useMedicationDetails() {

   const navigate = useNavigate();

   const { pathname, state } = useLocation();

   const context = useMedications();
   const mode = pathname.includes('/user/') ? 'user' : 'search';

   const { id } = useParams();

   const occurrenceId = state && typeof state.occurrenceId == 'string' ? state.occurrenceId : null;
   const wasLate = state && typeof state.wasLate == 'boolean' ? state.wasLate : false;


   const medication = mode === 'user' ? context.getMedicationById(String(id)) : null;

   // TODO: add a error screen?
   if (!id) return

   const drugInfo = medicationsDatabase.find((item) => item.id === (mode === 'user' ? medication?.medicationInfoId : id));


   const handleBack = () => {
      navigate(-1);
   }

   const handleEdit = () => {
      navigate(`/edit/${id}`);
   }
   const handleAdd = () => {
      navigate(`/add`, { state: { medicationInfoId: drugInfo?.id } });
   }

   const handleTake = () => {
      if (!medication || !occurrenceId) return
      context.markDoseAsTaken(medication.id, occurrenceId, wasLate);
      navigate(-1);
   }

   return {
      mode,
      medication,
      drugInfo,
      occurrenceId,
      handleBack,
      handleEdit,
      handleAdd,
      handleTake

   }
}

