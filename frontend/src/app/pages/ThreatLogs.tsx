import { motion } from 'motion/react';
import { useState } from 'react';
import { Search, Filter, ChevronUp, Download, Eye } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

// Mock threat log data
const mockThreatLogs = [
  { 
    id: 1, 
    timestamp: '2026-02-03 14:32:45', 
    threatLevel: 'HIGH', 
    confidence: 94.2, 
    action: 'Email Alert Sent', 
    location: 'Sector A-3',
    droneType: 'DJI Phantom 4'
  },
  { 
    id: 2, 
    timestamp: '2026-02-03 14:28:12', 
    threatLevel: 'MEDIUM', 
    confidence: 87.5, 
    action: 'Logged Only', 
    location: 'Sector B-1',
    droneType: 'Unknown Model'
  },
  { 
    id: 3, 
    timestamp: '2026-02-03 14:15:33', 
    threatLevel: 'LOW', 
    confidence: 72.1, 
    action: 'Auto-dismissed', 
    location: 'Sector C-2',
    droneType: 'Toy Drone'
  },
  { 
    id: 4, 
    timestamp: '2026-02-03 14:02:18', 
    threatLevel: 'HIGH', 
    confidence: 96.8, 
    action: 'Jammer Activated', 
    location: 'Sector A-1',
    droneType: 'DJI Mavic Pro'
  },
  { 
    id: 5, 
    timestamp: '2026-02-03 13:58:47', 
    threatLevel: 'CRITICAL', 
    confidence: 98.5, 
    action: 'Security Alerted', 
    location: 'Sector D-4',
    droneType: 'Military Grade'
  },
  { 
    id: 6, 
    timestamp: '2026-02-03 13:45:22', 
    threatLevel: 'MEDIUM', 
    confidence: 84.3, 
    action: 'Email Alert Sent', 
    location: 'Sector B-3',
    droneType: 'Racing Drone'
  },
  { 
    id: 7, 
    timestamp: '2026-02-03 13:32:10', 
    threatLevel: 'LOW', 
    confidence: 69.7, 
    action: 'Logged Only', 
    location: 'Sector C-1',
    droneType: 'Toy Drone'
  },
  { 
    id: 8, 
    timestamp: '2026-02-03 13:18:55', 
    threatLevel: 'HIGH', 
    confidence: 91.2, 
    action: 'Jammer Activated', 
    location: 'Sector A-2',
    droneType: 'DJI Inspire 2'
  },
];

export function ThreatLogs() {
  const [selectedLog, setSelectedLog] = useState<number | null>(null);
  const [filterLevel, setFilterLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = mockThreatLogs.filter((log) => {
    const matchesFilter = filterLevel === 'all' || log.threatLevel === filterLevel;
    const matchesSearch = 
      log.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.droneType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'HIGH':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'MEDIUM':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'LOW':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Threat Detection Logs</h1>
        <p className="text-gray-400">Complete history of drone detections and security events</p>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#0f1628] border border-cyan-500/30 rounded-lg p-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by location, drone type, or action..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#0a0e1a] border-cyan-500/30 focus:border-cyan-500 text-white placeholder:text-gray-500"
            />
          </div>

          {/* Threat Level Filter */}
          <Select value={filterLevel} onValueChange={setFilterLevel}>
            <SelectTrigger className="w-full md:w-[200px] bg-[#0a0e1a] border-cyan-500/30 text-white">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by level" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f1628] border-cyan-500/30">
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="CRITICAL">Critical</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
            </SelectContent>
          </Select>

          {/* Export Button */}
          <Button
            variant="outline"
            className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </motion.div>

      {/* Threat Logs Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#0f1628] border border-cyan-500/30 rounded-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0a0e1a] border-b border-cyan-500/20">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-400">Timestamp</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-400">Threat Level</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-400">Confidence</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-400">Location</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-400">Action Taken</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-400">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-500/10">
              {filteredLogs.map((log, index) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="hover:bg-cyan-500/5 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-300">{log.timestamp}</td>
                  <td className="px-6 py-4">
                    <Badge className={getThreatColor(log.threatLevel)}>
                      {log.threatLevel}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden max-w-20">
                        <div
                          className={`h-full ${
                            log.confidence >= 90
                              ? 'bg-green-500'
                              : log.confidence >= 80
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${log.confidence}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-300">{log.confidence}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">{log.location}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{log.action}</td>
                  <td className="px-6 py-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedLog(selectedLog === log.id ? null : log.id)}
                      className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                    >
                      {selectedLog === log.id ? (
                        <>
                          <ChevronUp className="w-4 h-4 mr-1" />
                          Hide
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </>
                      )}
                    </Button>
                  </td>
                </motion.tr>
              ))}

              {/* Expanded Details Row */}
              {filteredLogs.map((log) =>
                selectedLog === log.id ? (
                  <motion.tr
                    key={`detail-${log.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-[#0a0e1a]"
                  >
                    <td colSpan={6} className="px-6 py-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-cyan-400 mb-3">Detection Details</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Drone Type:</span>
                              <span className="text-white">{log.droneType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Detection ID:</span>
                              <span className="text-white">DET-{String(log.id).padStart(6, '0')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Camera:</span>
                              <span className="text-white">CAM-{(log.id % 4) + 1}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Altitude:</span>
                              <span className="text-white">{50 + log.id * 10}m</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-cyan-400 mb-3">Response Actions</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full" />
                              <span className="text-gray-300">Detection logged to database</span>
                            </div>
                            {log.action.includes('Email') && (
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full" />
                                <span className="text-gray-300">Alert email sent to admin@aeroguard.ai</span>
                              </div>
                            )}
                            {log.action.includes('Jammer') && (
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                                <span className="text-gray-300">RF jammer activated for 30 seconds</span>
                              </div>
                            )}
                            {log.action.includes('Security') && (
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-400 rounded-full" />
                                <span className="text-gray-300">Security team dispatched to location</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ) : null
              )}
            </tbody>
          </table>
        </div>

        {/* No Results */}
        {filteredLogs.length === 0 && (
          <div className="py-12 text-center text-gray-400">
            No threat logs found matching your criteria
          </div>
        )}
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total Logs', value: mockThreatLogs.length, color: 'cyan' },
          { label: 'Critical Threats', value: mockThreatLogs.filter(l => l.threatLevel === 'CRITICAL').length, color: 'purple' },
          { label: 'High Threats', value: mockThreatLogs.filter(l => l.threatLevel === 'HIGH').length, color: 'red' },
          { label: 'Actions Taken', value: mockThreatLogs.filter(l => l.action !== 'Logged Only').length, color: 'green' },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-[#0f1628] border border-cyan-500/30 rounded-lg p-4"
          >
            <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
            <div className={`text-3xl font-bold text-${stat.color}-400`}>{stat.value}</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
