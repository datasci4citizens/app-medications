import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './routes/Login';
import RegisterPager from './routes/Register'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: < RegisterPager/>
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
