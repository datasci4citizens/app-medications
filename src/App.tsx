import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from "@/routes/Home.tsx";
import SearchMedication from "@/routes/SearchMedication.tsx";
import AddMedication from "@/routes/AddMedication.tsx";
import Profile from "@/routes/Profile.tsx";
import AppLayout from "@/components/home/AppLayout.tsx";

export const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <AppLayout showBottomNav={true}>
                <Home/>
            </AppLayout>
        )
    },
    {
        path: '/search',
        element: (
            <AppLayout showBottomNav={true}>
                <SearchMedication/>
            </AppLayout>
        )
    },
    {
        path: '/add',
        element: (
            <AppLayout showBottomNav={true}>
                <AddMedication/>
            </AppLayout>
        )
    },
    {
        path: '/profile',
        element: (
            <AppLayout showBottomNav={true}>
                <Profile/>
            </AppLayout>
        )
    },


]);

export function App() {
    return <RouterProvider router={router}/>;
}
