import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Scale, Search, CheckCircle2, AlertTriangle, Briefcase, ExternalLink, Loader2, Target, Zap } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

export default function ATSMatchHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/resume/api/v1/history/evaluations', {
        credentials: 'include'
      });
      const result = await response.json();
      if (result.success && result.data) {
        setHistory(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch evaluation history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = (item) => {
    navigate('/atseval-result-detail', { state: { data: item } });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 border border-secondary/20 bg-secondary/10 rounded-lg">
            <Scale className="text-secondary" size={24} />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight italic uppercase">ATS Alignment History</h1>
        </div>
        <p className="text-lg text-on-surface-variant max-w-2xl font-medium">
          Track your algorithmic compatibility across various enterprise standards. 
          Identify which company cultures best match your current experience profile.
        </p>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-secondary" size={40} />
        </div>
      ) : history.length === 0 ? (
        <div className="glass-panel p-16 text-center rounded-2xl border border-white/10 bg-surface-low">
          <p className="text-on-surface-variant font-medium text-lg">No history found. Complete an ATS match to see it here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {history.map((item, index) => {
            const hasResult = item.status === 'COMPLETED' && item.result;
            const score = hasResult ? item.result.overall_score : 0;
            const fit = hasResult ? item.result.final_fit : 'N/A';
            
            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleOpenDetail(item)}
                className="glass-panel p-8 rounded-3xl border border-white/5 hover:border-secondary/30 transition-all group flex flex-col sm:flex-row items-center gap-10 cursor-pointer bg-surface-lowest/40"
              >
                <div className="flex flex-col items-center justify-center p-6 rounded-[2rem] bg-surface-highest min-w-[100px] border border-white/5 group-hover:scale-105 transition-transform duration-500">
                   <span className={`text-4xl font-bold tracking-tighter ${
                     score > 80 ? 'text-secondary' : score > 60 ? 'text-primary' : item.status === 'FAILED' ? 'text-error' : 'text-on-surface-variant'
                   }`}>
                     {item.status === 'FAILED' ? 'ERR' : score || '--'}
                   </span>
                   <span className="text-[10px] uppercase tracking-widest font-black text-on-surface-variant/60 mt-1">Match %</span>
                </div>

                <div className="flex-1 flex flex-col gap-2 text-center sm:text-left">
                   <div className="flex items-center justify-center sm:justify-start gap-4">
                     <Target size={18} className="text-secondary" />
                     <h3 className="font-black text-white text-xl tracking-tight uppercase">Audit Session #{item.jobId}</h3>
                   </div>
                   <div className="flex items-center justify-center sm:justify-start gap-3 text-xs font-mono tracking-wider text-on-surface-variant uppercase">
                      <span className="text-white/40">{formatDate(item.createdAt)}</span>
                      <span className="text-on-surface-variant/20">|</span>
                      <span>{item.type}</span>
                      <span className="text-on-surface-variant/20">|</span>
                      <span className={item.status === 'COMPLETED' ? 'text-green-500/80' : 'text-error/80'}>{item.status}</span>
                   </div>
                </div>

                <div className="flex flex-col items-center sm:items-end gap-4">
                   <div className={`px-6 py-2 rounded-full text-[10px] font-black tracking-[0.2em] uppercase flex items-center gap-3 ${
                     fit === 'Strong' || fit === 'Perfect' ? 'bg-secondary/10 text-secondary border border-secondary/20' : 'bg-surface-highest text-on-surface-variant border border-white/5'
                   }`}>
                     {fit === 'Strong' || fit === 'Perfect' ? <CheckCircle2 size={12} /> : <Zap size={12} />}
                     Alignment: {fit}
                   </div>
                   <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant hover:text-secondary transition-all group/btn">
                     Initialize Insight Page
                     <ExternalLink size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                   </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
