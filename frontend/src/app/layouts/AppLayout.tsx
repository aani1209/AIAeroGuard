import { Outlet } from 'react-router-dom';
import { DashboardSidebar } from '@/app/components/DashboardSidebar';
import { DashboardHeader } from '@/app/components/DashboardHeader';

export function AppLayout() {
  return (
    <div className="dark min-h-screen bg-[#0a0e1a] flex">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <DashboardHeader />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-[1800px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Animated background grid effect */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 212, 255, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}
