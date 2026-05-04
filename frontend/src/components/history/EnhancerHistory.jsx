import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Calendar, FileCheck, ArrowUpRight, History, MoreVertical, Loader2, Search, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function EnhancerHistory() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('http://localhost:8000/resume/api/v1/history/enhancements', {
          credentials: 'include'
        });
        const result = await response.json();
        
        if (response.ok && result.data) {
          setHistory(result.data);
        } else {
          setError(result.message || "Failed to load enhancement archive.");
        }
      } catch (err) {
        setError("Network error. Verify system sync.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleViewDetail = (item) => {
    navigate('/enhancement-result-detail', { state: { data: item } });
  };

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 border border-tertiary/20 bg-tertiary/10 rounded-lg">
            <Sparkles className="text-tertiary" size={24} />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter italic">Enhancement Archive</h1>
        </div>
        <p className="text-lg text-on-surface-variant max-w-2xl font-medium">
          Access every refined version of your professional identity. Track the evolution of 
          your impact metrics and phrasing quality.
        </p>
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6">
           <Loader2 size={40} className="text-primary animate-spin" />
           <p className="text-xs font-black uppercase tracking-[0.3em] text-on-surface-variant animate-pulse">Syncing Archive Data...</p>
        </div>
      ) : error ? (
        <div className="glass-panel p-12 rounded-2xl border border-error/20 bg-error/5 flex flex-col items-center gap-4 text-center">
           <h3 className="text-error font-black uppercase tracking-widest italic">Sync Error Detected</h3>
           <p className="text-sm text-on-surface-variant max-w-xs">{error}</p>
        </div>
      ) : history.length === 0 ? (
        <div className="glass-panel p-20 rounded-3xl border border-white/5 flex flex-col items-center gap-6 text-center">
           <Search size={48} className="text-on-surface-variant opacity-10" />
           <p className="text-on-surface-variant font-bold max-w-xs">No enhancement records found in your historical pattern storage.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {history.map((log, index) => (
            <motion.div
              key={log._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-tertiary/30 transition-all group flex flex-col gap-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary/5 blur-[40px] -mr-16 -mt-16 rounded-full" />
              
              <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-surface-highest">
                    <History className="text-tertiary" size={16} />
                  </div>
                  <span className="text-[10px] font-black font-mono text-tertiary/60 tracking-wider">JOB_REF #{log.jobId}</span>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  log.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-surface-high text-on-surface-variant'
                }`}>
                  {log.status}
                </div>
              </div>

              <div className="flex flex-col gap-4 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="flex-1 p-3 rounded-lg bg-surface-highest/30 border border-white/5 max-w-[12rem]">
                     <p className="text-[9px] uppercase font-black text-on-surface-variant/50 mb-1 tracking-widest">Source Pattern</p>
                     <p className="text-[11px] truncate text-on-surface-variant font-mono uppercase">image_sync.png</p>
                  </div>
                  <ArrowUpRight size={16} className="text-tertiary/50 shrink-0" />
                  <div className="flex-1 p-3 rounded-lg bg-tertiary/5 border border-tertiary/20">
                     <p className="text-[9px] uppercase font-black text-tertiary/50 mb-1 tracking-widest">Enhanced Result</p>
                     <p className="text-[11px] truncate text-white font-bold uppercase italic">Competency_v1.md</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase font-black text-on-surface-variant/40 tracking-tighter">Analyzed</span>
                    <span className="text-xs font-mono font-bold text-on-surface">{formatDate(log.createdAt)}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                     <span className="text-[9px] uppercase font-black text-on-surface-variant/40 tracking-tighter">Points</span>
                     <span className="text-xs font-mono font-bold text-on-surface">15+ Dynamic</span>
                  </div>
                  <div className="flex flex-col gap-1 text-right">
                     <span className="text-[9px] uppercase font-black text-tertiary/40 tracking-tighter">Reliability</span>
                     <span className="text-xs font-black text-tertiary">HIGH_MATCH</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleViewDetail(log)}
                className="w-full py-2.5 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] font-black text-white bg-white/5 rounded-xl group-hover:bg-tertiary group-hover:text-black transition-all relative z-10"
              >
                <ExternalLink size={12} />
                Analyze Detail
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

