import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Shield, Target, Zap, Radio, CheckCircle, Eye, Lock, Bell } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useEffect, useState } from 'react';

export function Landing() {
  const [radarRotation, setRadarRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRadarRotation((prev) => (prev + 1) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Grid */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 212, 255, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 212, 255, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        
        {/* Radar sweep */}
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-cyan-500/20"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-cyan-500/10"
            animate={{ scale: [1, 2, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `conic-gradient(from ${radarRotation}deg, transparent, rgba(0, 212, 255, 0.2) 10%, transparent 30%)`,
              borderRadius: '50%',
            }}
          />
        </div>

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-cyan-500/20 bg-[#0a0e1a]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-cyan-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              AeroGuard AI
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10">
                Sign In
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/50">
                Access Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="px-4 py-2 rounded-full border border-cyan-500/50 bg-cyan-500/10 text-cyan-400 text-sm font-medium">
              🚀 Next-Generation Drone Security
            </div>
          </motion.div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent">
              AeroGuard AI
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-cyan-400 font-semibold mb-4">
            Intelligent Drone Threat Detection
          </p>
          
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-12">
            Real-time AI surveillance, threat classification, and automated response. 
            Protect your airspace with cutting-edge machine learning technology.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-lg px-8 py-6 shadow-2xl shadow-cyan-500/50">
                <Eye className="w-5 h-5 mr-2" />
                View Live Detection
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 text-lg px-8 py-6">
                <Lock className="w-5 h-5 mr-2" />
                Secure Access
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Feature Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
        >
          {[
            { label: 'Detection Rate', value: '99.8%', icon: Target },
            { label: 'Response Time', value: '<0.5s', icon: Zap },
            { label: 'Active Cameras', value: '24/7', icon: Eye },
            { label: 'Threats Blocked', value: '10K+', icon: Shield },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              className="bg-[#0f1628]/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 text-center hover:border-cyan-500/50 transition-colors"
            >
              <stat.icon className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Advanced Security Features
            </span>
          </h2>
          <p className="text-center text-gray-400 mb-16">
            Military-grade technology for comprehensive airspace protection
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Target,
                title: 'AI Detection (YOLO)',
                description: 'State-of-the-art object detection using YOLO neural network',
                color: 'cyan',
              },
              {
                icon: Shield,
                title: 'Threat Classification',
                description: 'Real-time threat level assessment with 99.8% accuracy',
                color: 'blue',
              },
              {
                icon: Bell,
                title: 'Automated Alerts',
                description: 'Instant notifications via email, SMS, and dashboard',
                color: 'red',
              },
              {
                icon: Radio,
                title: 'Secure Backend',
                description: 'Enterprise-grade security with encrypted data transmission',
                color: 'cyan',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#0f1628]/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/20"
              >
                <div className={`w-12 h-12 rounded-lg bg-${feature.color}-500/10 flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}-400`} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* System Capabilities */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h2 className="text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Mission-Critical Performance
              </span>
            </h2>
            <p className="text-gray-400 mb-8">
              Built for defense, security, and surveillance operations where failure is not an option.
            </p>
            
            <div className="space-y-4">
              {[
                'Real-time threat detection and tracking',
                'Multi-camera synchronized monitoring',
                'Automated response protocols',
                'Advanced analytics and reporting',
                'Integration with security systems',
                '24/7 monitoring and alerts',
              ].map((capability, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                  <span className="text-gray-300">{capability}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative">
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 20px rgba(6, 182, 212, 0.3)',
                  '0 0 60px rgba(6, 182, 212, 0.5)',
                  '0 0 20px rgba(6, 182, 212, 0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-[#0f1628] border border-cyan-500/30 rounded-lg p-8"
            >
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">System Status</span>
                    <span className="text-xs text-green-400 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      ONLINE
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
                      initial={{ width: 0 }}
                      animate={{ width: '98%' }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#0a0e1a] border border-cyan-500/20 rounded p-4">
                    <div className="text-2xl font-bold text-cyan-400">847</div>
                    <div className="text-xs text-gray-400">Detections Today</div>
                  </div>
                  <div className="bg-[#0a0e1a] border border-cyan-500/20 rounded p-4">
                    <div className="text-2xl font-bold text-green-400">0</div>
                    <div className="text-xs text-gray-400">Active Threats</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">AI Model</span>
                    <span className="text-cyan-400">YOLOv8</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Confidence</span>
                    <span className="text-cyan-400">99.8%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Response Time</span>
                    <span className="text-cyan-400">&lt;0.5s</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-12 text-center"
        >
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Ready to Secure Your Airspace?
            </span>
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join leading security operations worldwide using AeroGuard AI for comprehensive drone threat detection.
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-lg px-12 py-6 shadow-2xl shadow-cyan-500/50">
              Get Started Now
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-cyan-500/20 bg-[#0a0e1a]/80 backdrop-blur-md mt-24">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-cyan-400" />
                <span className="text-xl font-bold text-white">AeroGuard AI</span>
              </div>
              <p className="text-gray-400 text-sm">
                Advanced AI-powered drone detection and security system. Built for hackathons and demonstrations.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Technology</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>YOLO Object Detection</li>
                <li>React + TypeScript</li>
                <li>Real-time Processing</li>
                <li>Cloud Integration</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Live Detection Feed</li>
                <li>Threat Classification</li>
                <li>Automated Alerts</li>
                <li>System Analytics</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-cyan-500/20 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2026 AeroGuard AI. Hackathon Demo Project. Not for production use with sensitive data.
          </div>
        </div>
      </footer>
    </div>
  );
}
