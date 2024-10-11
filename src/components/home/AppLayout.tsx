import React from 'react'
import BottomNavigation from "@/components/bottomNavigation/BottomNavigationBar.tsx";

interface AppLayoutProps {
    children: React.ReactNode
    showBottomNav: boolean
}

export default function AppLayout({children, showBottomNav}: AppLayoutProps) {
    return (
        <div className="flex flex-col h-screen">
            <div className="bg-sky-900 h-24 fixed top-0 left-0 right-0 z-10"/>

            <div className={`mt-16 pt-8 flex-1 overflow-y-auto bg-white rounded-t-[40px] z-20`}>
                {children}
            </div>

            {showBottomNav && (
                <div className="bottom-0 left-0 right-0 z-30">
                    <BottomNavigation/>
                </div>
            )}
        </div>
    );
}