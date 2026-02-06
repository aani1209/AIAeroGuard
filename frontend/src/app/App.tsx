import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from '@/app/pages/Landing';
import { Login } from '@/app/pages/Login';
import { Register } from '@/app/pages/Register';
import { Dashboard } from '@/app/pages/Dashboard';
import { LiveDetection } from '@/app/pages/LiveDetection';
import { ThreatLogs } from '@/app/pages/ThreatLogs';
import { AlertsPage } from '@/app/pages/AlertsPage';
import { SystemControl } from '@/app/pages/SystemControl';
import { Settings } from '@/app/pages/Settings';
import { AppLayout } from '@/app/layouts/AppLayout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes - With Dashboard Layout */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/live-detection" element={<LiveDetection />} />
          <Route path="/threat-logs" element={<ThreatLogs />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/system-control" element={<SystemControl />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Catch all - redirect to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
