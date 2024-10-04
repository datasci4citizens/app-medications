import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './routes/Login';
import PatientRegistration from './routes/PatientRegistration';
import CaregiverRegistration from './routes/CaregiverRegistration';
import EmergencyContactRegistration from './routes/EmergencyContactRegistration';

const router = createBrowserRouter([
	{
		path: '/',
		element: <LoginPage />,
	},
	{
		path: '/registro-paciente',
		element: <PatientRegistration />,
	},
	{
		path: '/registro-cuidador',
		element: <CaregiverRegistration />,
	},
	{
		path: '/registro-contato-de-emergencia',
		element: <EmergencyContactRegistration />,
	},
]);

export function App() {
	return <RouterProvider router={router} />;
}
