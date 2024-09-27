import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from "@/routes/Home.tsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home/>,
    },
]);

export function App() {
    return <RouterProvider router={router}/>;
}
