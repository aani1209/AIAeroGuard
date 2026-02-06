import { motion } from 'motion/react';
import { User, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';

export function DashboardHeader() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-20 bg-[#0a0e1a] border-b border-[#1e293b] flex items-center justify-between px-8"
    >
      {/* Left: Brand */}
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#00d4ff] to-[#00ffff] bg-clip-text text-transparent">
          AeroGuard AI
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">Drone Detection & Security System</p>
      </div>

      {/* Right: Status and Time */}
      <div className="flex items-center gap-8">
        {/* System Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.8, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-2 h-2 rounded-full bg-[#00ff88] shadow-[0_0_10px_rgba(0,255,136,0.8)]"
            />
            <span className="text-sm text-[#00ff88] font-semibold tracking-wide">ONLINE</span>
          </div>
        </div>

        {/* Time Display */}
        <div className="text-right">
          <div className="text-sm font-mono text-[#00d4ff]">{formatTime(currentTime)}</div>
          <div className="text-xs text-gray-400">{formatDate(currentTime)}</div>
        </div>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-[#1a1f35] border-2 border-[#00d4ff] flex items-center justify-center hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-shadow"
            >
              <User size={18} className="text-[#00d4ff]" />
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#0f1628] border-cyan-500/30 text-white" align="end">
            <DropdownMenuLabel className="text-cyan-400">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-cyan-500/20" />
            <DropdownMenuItem 
              className="hover:bg-cyan-500/10 cursor-pointer"
              onClick={() => navigate('/settings')}
            >
              <SettingsIcon className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="hover:bg-red-500/10 cursor-pointer text-red-400"
              onClick={() => navigate('/')}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
}