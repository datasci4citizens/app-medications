import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './routes/Login';
import PatienteRegistration from './routes/PatientRegistration'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/patient-registration',
    element: < PatienteRegistration/>
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
