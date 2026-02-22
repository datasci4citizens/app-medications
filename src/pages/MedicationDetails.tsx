import { useParams } from "react-router-dom"


export function MedicationDetails() {

   const { id } = useParams();

   alert('ss')

   return(<>
      <h1> medicamento é: 
         {id}
      </h1>
   </>)
}