import { LayoutDashboard, Radio, FileText, Bell, Settings, Sliders } from 'lucide-react';
import { motion } from 'motion/react';
import { NavLink } from 'react-router-dom';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

export function DashboardSidebar() {
  const navItems: NavItem[] = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Radio size={20} />, label: 'Live Detection', path: '/live-detection' },
    { icon: <FileText size={20} />, label: 'Threat Logs', path: '/threat-logs' },
    { icon: <Bell size={20} />, label: 'Alerts', path: '/alerts' },
    { icon: <Sliders size={20} />, label: 'System Control', path: '/system-control' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ];

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-20 h-screen bg-[#0a0e1a] border-r border-[#1e293b] flex flex-col items-center py-8 gap-8"
    >
      {/* Logo */}
      <NavLink to="/" className="w-12 h-12 rounded-lg bg-linear-to-br from-[#00d4ff] to-[#00ffff] flex items-center justify-center">
        <span className="text-[#0a0e1a] text-xl font-bold">A</span>
      </NavLink>

      {/* Navigation */}
      <nav className="flex flex-col gap-6 flex-1">
        {navItems.map((item, index) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) => `
              w-12 h-12 rounded-lg flex items-center justify-center
              transition-all duration-300 relative group
              ${
                isActive
                  ? 'bg-[#1a1f35] text-[#00d4ff] shadow-[0_0_20px_rgba(0,212,255,0.3)]'
                  : 'text-gray-400 hover:text-[#00d4ff] hover:bg-[#1a1f35]'
              }
            `}
          >
            {({ isActive }) => (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex items-center justify-center w-full h-full"
              >
                {item.icon}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 w-1 h-8 bg-[#00d4ff] rounded-r-full shadow-[0_0_10px_rgba(0,212,255,0.8)]"
                  />
                )}
                
                {/* Tooltip */}
                <span className="absolute left-16 bg-[#1a1f35] text-white px-3 py-1.5 rounded-md text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-[#1e293b]">
                  {item.label}
                </span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>
    </motion.div>
  );
}