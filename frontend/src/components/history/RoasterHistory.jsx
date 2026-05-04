import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Calendar, ChevronRight, FileText, Download, Trash2, Loader2, Eye, X, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RoasterHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/resume/api/v1/history/roasts', {
        credentials: 'include'
      });
      const result = await response.json();
      if (result.success && result.data) {
        setHistory(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch roast history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = (item) => {
    navigate('/roast-result-detail', { state: { data: item } });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <div className="flex flex-col gap-10 relative">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 border border-error/20 bg-error/10 rounded-lg">
            <Flame className="text-error" size={24} />
          </div>
          <h1 className="text-4xl font-bold text-on-surface tracking-tight">Roaster Protocol History</h1>
        </div>
        <p className="text-lg text-on-surface-variant max-w-2xl">
          Review your previous sessions of brutal self-reflection. Track your progress from 
          "Incinerated" to "Critiqued".
        </p>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : history.length === 0 ? (
        <div className="glass-panel p-16 text-center rounded-2xl border border-white/10 bg-surface-low">
          <p className="text-on-surface-variant font-medium text-lg">No history found. Complete a roast to see it here.</p>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-highest/50 border-b border-white/5">
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-mono">Job ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-mono">Date / Time</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-mono">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-mono">Type</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-mono text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => (
                  <motion.tr 
                    key={item._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleOpenDetail(item)}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-5 font-mono text-xs text-primary/60">#{item.jobId}</td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm text-on-surface font-medium">{formatDate(item.createdAt)}</span>
                        <span className="text-[10px] text-on-surface-variant font-mono">{formatTime(item.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full ${
                        item.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400' : 'bg-surface-highest text-on-surface-variant'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{item.type}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 group-hover:gap-4 transition-all duration-300">
                         <span className="text-[10px] uppercase font-black tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">View Details</span>
                         <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                           <Eye size={18} />
                         </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

