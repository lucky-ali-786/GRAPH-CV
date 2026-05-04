import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Flame, Sparkles, Scale, LogOut, ChevronDown, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Layout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const historyOptions = [
    { id: 'roaster-history', path: '/roaster-history', label: 'Roast History', icon: Flame, color: 'text-error' },
    { id: 'enhancer-history', path: '/enhancer-history', label: 'Enhancement History', icon: Sparkles, color: 'text-tertiary' },
    { id: 'ats-match-history', path: '/ats-match-history', label: 'Alignment History', icon: Scale, color: 'text-secondary' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const navItems = [
    { path: '/roaster', label: 'Resume Roast' },
    { path: '/enhancer', label: 'Enhancer' },
    { path: '/ats-match', label: 'ATS Alignment' },
    { path: '/resume-builder', label: 'Resume Builder' },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-surface text-on-surface antialiased">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-10 blur-[120px] bg-primary" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full opacity-10 blur-[150px] bg-primary" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface/70 border-b border-white/10 shadow-lg backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link 
              to="/"
              className="text-xl font-bold tracking-tighter text-on-surface uppercase hover:opacity-80 transition-opacity"
            >
              GraphCV
            </Link>
            <nav className="hidden lg:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-2 py-1 text-sm font-medium transition-colors ${
                    location.pathname === item.path ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {item.label}
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary"
                    />
                  )}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-3 pr-1 rounded-full border border-white/10 hover:border-white/20 transition-all bg-surface-high hover:bg-surface-highest"
                >
                  <div className="text-xs font-bold text-on-surface hidden sm:block">{user.name}</div>
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-primary to-slate-800 flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <ChevronDown size={14} className={`text-on-surface-variant transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 mt-2 w-64 glass-panel bg-surface-high/95 backdrop-blur-3xl rounded-xl shadow-2xl py-2 z-20 border border-white/10"
                      >
                        <div className="px-4 py-3 border-b border-white/5 mb-2">
                          <p className="text-[10px] font-black text-primary tracking-widest uppercase">Member Portal</p>
                        </div>
                        
                        {historyOptions.map((opt) => (
                          <Link
                            key={opt.id}
                            to={opt.path}
                            onClick={() => setIsMenuOpen(false)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-on-surface-variant hover:text-white hover:bg-white/5 transition-colors group"
                          >
                            <opt.icon size={16} className={`${opt.color} opacity-70 group-hover:opacity-100`} />
                            <span>{opt.label}</span>
                          </Link>
                        ))}

                        <div className="h-px bg-white/5 my-2" />
                        
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut size={16} />
                          <span>Sign Out</span>
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <LogIn size={16} />
                  Login
                </Link>
                <Link 
                  to="/signup"
                  className="flex items-center gap-2 px-6 py-2 text-sm font-bold bg-primary text-on-primary rounded-full hover:brightness-110 transition-all shadow-lg"
                >
                  <UserPlus size={16} />
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10 w-full max-w-7xl mx-auto px-6 py-8 md:py-12">
        {children}
      </main>

      <footer className="py-12 border-t border-white/5 bg-surface-lowest relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-xl font-black tracking-tighter text-on-surface uppercase">GraphCV</span>
            <p className="text-xs text-on-surface-variant/70 font-mono tracking-tight text-center md:text-left">
              Advanced Career Optimization Protocols.
            </p>
          </div>
          <div className="flex gap-8 text-[10px] text-on-surface-variant/60 uppercase tracking-[0.2em] font-black">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <a href="#" className="hover:text-primary transition-colors">Status</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
