import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import AIAssistant from './AIAssistant';

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <AIAssistant />
    </div>
  );
}
