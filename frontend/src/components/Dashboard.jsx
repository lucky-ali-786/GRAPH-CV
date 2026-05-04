import React from 'react';
import { motion } from 'motion/react';
import { Flame, Sparkles, Scale, ArrowRight, Zap, Target, Code2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const tools = [
    {
      id: 'roaster',
      path: '/roaster',
      name: 'Resume Roast',
      tagline: 'Identity Audit',
      description: 'Advanced analysis that exposes weak professional phrasing with brutal efficiency.',
      icon: Flame,
      color: 'text-error',
      bgColor: 'bg-error/10',
      accentColor: 'group-hover:border-error/30'
    },
    {
      id: 'enhancer',
      path: '/enhancer',
      name: 'Smart Enhancer',
      tagline: 'Semantic Lift',
      description: 'Driven phrasing refinement that upgrades your narrative impact through high-performance vocabulary.',
      icon: Sparkles,
      color: 'text-tertiary',
      bgColor: 'bg-tertiary/10',
      accentColor: 'group-hover:border-tertiary/30'
    },
    {
      id: 'ats-match',
      path: '/ats-match',
      name: 'ATS Alignment',
      tagline: 'Pattern Sync',
      description: 'Algorithmic compatibility scoring that syncs your profile with enterprise job description logic.',
      icon: Scale,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      accentColor: 'group-hover:border-secondary/30'
    },
    {
      id: 'resume-builder',
      path: '/resume-builder',
      name: 'LaTeX Builder',
      tagline: 'Pattern Architect',
      description: 'Direct document synthesis using industry-standard LaTeX protocols for high-fidelity professional patterns.',
      icon: Code2,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      accentColor: 'group-hover:border-primary/30'
    }
  ];

  return (
    <div className="flex flex-col gap-24 overflow-hidden">
      {/* minimalist Hero Section */}
      <section className="relative pt-12 pb-16 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-10"
        >
          <Zap size={12} fill="currentColor" />
          Industry Grade Professional Intelligence
        </motion.div>

        <motion.h1 
          className="text-6xl md:text-8xl font-black text-on-surface mb-8 tracking-tighter leading-[0.85] text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Your Professional <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary">Final Form.</span>
        </motion.h1>

        <motion.p 
          className="text-lg md:text-xl text-on-surface-variant max-w-xl mx-auto mb-12 leading-relaxed font-medium text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          We engineer high-performance data patterns to ensure your career data 
          outperforms standard enterprise heuristics.
        </motion.p>

        {!user && (
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link 
              to="/login"
              className="bg-primary text-on-primary font-bold px-10 py-5 rounded-xl hover:brightness-110 transition-all accent-glow-primary shadow-xl"
            >
              Get Started Free
            </Link>
          </motion.div>
        )}
      </section>

      {/* Modern Feature Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            onClick={() => navigate(tool.path)}
            className={`group relative p-10 rounded-2xl bg-surface-lowest border border-white/5 transition-all duration-500 hover:bg-surface-low cursor-pointer overflow-hidden ${tool.accentColor}`}
          >
            <div className={`w-14 h-14 rounded-2xl ${tool.bgColor} flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500`}>
              <tool.icon className={tool.color} size={28} />
            </div>

            <div className="flex flex-col gap-1 mb-4">
              <span className={`text-[10px] font-black uppercase tracking-widest ${tool.color} opacity-60`}>{tool.tagline}</span>
              <h3 className="text-2xl font-black text-on-surface">{tool.name}</h3>
            </div>

            <p className="text-on-surface-variant text-sm leading-7 mb-10 font-medium">
              {tool.description}
            </p>

            <div className="flex items-center gap-2 text-xs font-bold text-on-surface group-hover:text-primary transition-colors">
              {user ? 'Initialize Analysis' : 'Login to Access'}
              <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </div>
          </motion.div>
        ))}
      </section>


      {/* Proof/Telemetry Mockup (Cleaner) */}
      <section className="mt-12 p-1 border border-white/5 bg-surface-low rounded-3xl">
        <div className="bg-surface-lowest border border-white/10 rounded-[calc(1.5rem-1px)] p-12 flex flex-col md:flex-row items-center gap-16 overflow-hidden relative">
          <div className="flex-1 flex flex-col gap-6 relative z-10">
            <h2 className="text-4xl font-black text-on-surface tracking-tighter leading-none">
              High-Performance <br /> Career Metrics.
            </h2>
            <p className="text-on-surface-variant leading-relaxed font-medium text-sm">
              Our optimization engine processes your data against 4,000+ top-tier job 
              architectures to provide a true enterprise-readiness score.
            </p>
            <div className="flex gap-12 mt-4">
              <div className="flex flex-col">
                <span className="text-xl font-black text-primary">99.8%</span>
                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Accuracy</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-secondary">40ms</span>
                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Latency</span>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full bg-[#0b0f10] border border-white/10 rounded-2xl p-8 font-mono text-xs text-on-surface-variant/40 leading-relaxed shadow-2xl">
            <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-4">
               <Target size={14} className="text-primary" />
               <span className="tracking-widest uppercase font-bold text-[10px]">Realtime Telemetry</span>
            </div>
            <p className="text-primary/70">$ systemctl start optimization-engine</p>
            <p className="mt-2">&gt; Scanning semantic nodes...</p>
            <p className="text-error mt-1">[WARN] Profile density insufficient</p>
            <p className="text-green-400 mt-1">[OK] Pattern match found: "Lead Developer"</p>
            <p className="mt-6 flex items-center gap-2">
              <span className="w-1 h-1 bg-primary rounded-full animate-ping" />
              <span>Engine Status: Active</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
