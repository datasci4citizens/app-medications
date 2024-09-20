import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './routes/Login';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
