import { Outlet } from 'react-router-dom';
import { BottomBar } from '../components/layout/BottomBar';

export function Home() {
  return (
    <div className="min-h-screen bg-figmagray">
      <Outlet />
      <BottomBar />
    </div>
  );
}
