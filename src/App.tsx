import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './routes/Login';
import ProfileSelection from './routes/Registration/ProfileSelection';
import PatientRegistrationType from './routes/Registration/PatientRegistrationType';
import PatientRegistration from './routes/Registration/PatientRegistration';
import CaregiverRegistration from './routes/Registration/CaregiverRegistration';
import EmergencyContactRegistration from './routes/Registration/EmergencyContactRegistration';
import Home from '@/routes/Home.tsx';
import SearchMedication from '@/routes/SearchMedication.tsx';
import AddMedication from '@/routes/AddMedication.tsx';
import Profile from '@/routes/Profile.tsx';
import AppLayout from '@/components/home/AppLayout.tsx';
import AddPatient from './routes/Registration/AddPatient';
import AuthGuard from './guards/auth';
import { SWRConfig } from 'swr';
import { AuthProvider } from '@/lib/hooks/auth-context.tsx';

export const router = createBrowserRouter([
	{
		path: '/login',
		element: <LoginPage />,
	},
	{
		path: '/',
		element: (
			<AuthGuard /> 
		),
		children: [
			{
				path: "/",
				element: (
					<AppLayout showBottomNav={true}>
						<Home />
					</AppLayout>
				)
			}, 
			{
				path: '/cadastro-paciente-tipo',
				element: (
					<AppLayout showBottomNav={false}>
						<PatientRegistrationType />
					</AppLayout>
				),
			},
			{
				path: '/cadastro-perfil',
				element: (
					<AppLayout showBottomNav={false}>
						<ProfileSelection />
					</AppLayout>
				),
			},
			{
				path: '/registro-paciente',
				element: (
					<AppLayout showBottomNav={false}>
						<PatientRegistration />
					</AppLayout>
				),
			},
			{
				path: '/adicionar-paciente',
				element: (
					<AppLayout showBottomNav={false}>
						<AddPatient />
					</AppLayout>
				),
			},
			{
				path: '/registro-cuidador',
				element: (
					<AppLayout showBottomNav={false}>
						<CaregiverRegistration />
					</AppLayout>
				),
			},
			{
				path: '/registro-contato-de-emergencia',
				element: (
					<AppLayout showBottomNav={false}>
						<EmergencyContactRegistration />
					</AppLayout>
				),
			},
			{
				path: '/search',
				element: (
					<AppLayout showBottomNav={true}>
						<SearchMedication />
					</AppLayout>
				),
			},
			{
				path: '/add',
				element: (
					<AppLayout showBottomNav={true}>
						<AddMedication />
					</AppLayout>
				),
			},
			{
				path: '/profile',
				element: (
					<AppLayout showBottomNav={true}>
						<Profile />
					</AppLayout>
				),
			},
		]
	},
]);

export function App() {
	return (
		<AuthProvider>
			<SWRConfig
				value={{
					fetcher: (url, args) => fetch(`${import.meta.env.VITE_SERVER_URL}${url}`, { credentials: 'include', ...args }).then(res => res.json())
				}}
			>
				<RouterProvider router={router} />
			</SWRConfig>
		</AuthProvider>
	);
}
