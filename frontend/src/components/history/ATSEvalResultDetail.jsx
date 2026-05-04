import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Target, ShieldAlert, FileText, Briefcase, Zap, Terminal, Search, CheckCircle2, ChevronRight, AlertCircle, Image as ImageIcon } from 'lucide-react';

import { useNavigate, useLocation } from 'react-router-dom';

export default function ATSEvalResultDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state?.data;

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-on-surface-variant font-medium text-lg italic">No evaluation data found.</p>
        <button 
          onClick={() => navigate('/ats-match-history')}
          className="text-secondary font-bold hover:underline uppercase tracking-widest text-xs"
        >
          Return to History
        </button>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const hasResult = data.status === 'COMPLETED' && data.result;
  const result = hasResult ? data.result : {};

  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Dynamic Navigation Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-8">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 text-on-surface-variant hover:text-secondary transition-all px-5 py-2.5 rounded-2xl hover:bg-secondary/5 border border-transparent hover:border-secondary/20"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-[0.2em]">Exit to Archive</span>
        </button>

        <div className="flex items-center gap-6">
           <div className="hidden sm:flex flex-col items-end">
             <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] opacity-40">Verification Protocol</span>
             <span className="text-xs font-bold text-secondary uppercase tracking-widest">{data.jobId} // SYNCED</span>
           </div>
           <div className="h-10 w-px bg-white/10" />
           <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
             data.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-error/10 text-error border-error/20'
           }`}>
             {data.status}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        {/* Left: Component Patterns (Images) */}
        <div className="xl:col-span-12 flex flex-col gap-10">
           <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
              {/* Resume Image */}
              <div className="md:col-span-6 flex flex-col gap-4">
                 <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3 text-primary">
                       <FileText size={18} />
                       <h3 className="text-xs font-black uppercase tracking-[0.2em]">Candidate Pattern</h3>
                    </div>
                 </div>
                 <div className="glass-panel p-2 rounded-[2.5rem] border-white/10 bg-black/40 overflow-hidden group shadow-2xl">
                    <div className="relative rounded-[2rem] overflow-hidden border border-white/5 max-h-[60vh] overflow-y-auto custom-scrollbar bg-surface-lowest">
                       <img 
                          src={data.resumeLinkUsed} 
                          alt="Resume Image" 
                          className="w-full h-auto object-contain hover:scale-[1.03] transition-transform duration-700" 
                          referrerPolicy="no-referrer"
                       />
                    </div>
                 </div>
              </div>

              {/* JD Image */}
              <div className="md:col-span-6 flex flex-col gap-4">
                 <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3 text-secondary">
                       <Briefcase size={18} />
                       <h3 className="text-xs font-black uppercase tracking-[0.2em]">Requirement Logic</h3>
                    </div>
                 </div>
                 <div className="glass-panel p-2 rounded-[2.5rem] border-white/10 bg-black/40 overflow-hidden group shadow-2xl">
                    <div className="relative rounded-[2rem] overflow-hidden border border-white/5 max-h-[60vh] overflow-y-auto custom-scrollbar bg-surface-lowest text-on-surface-variant flex items-center justify-center italic text-sm">
                       {data.jd ? (
                         <img 
                            src={data.jd} 
                            alt="JD Image" 
                            className="w-full h-auto object-contain hover:scale-[1.03] transition-transform duration-700" 
                            referrerPolicy="no-referrer"
                         />
                       ) : (
                         "JD Pattern Image Data Unavailable"
                       )}
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Bottom Panel: Evaluation Intelligence */}
        <div className="xl:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-4 pt-12 border-t border-white/5">
           {/* Detailed Scores & Fit */}
           <div className="lg:col-span-4 flex flex-col gap-8">
              <header className="flex flex-col gap-2">
                 <h2 className="text-4xl font-black text-on-surface tracking-tighter uppercase italic leading-none">Match Statistics</h2>
                 <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest leading-relaxed">Algorithmic alignment probability based on dual image logic.</p>
              </header>

              <div className="grid grid-cols-1 gap-6">
                 <div className="p-10 rounded-[3rem] bg-secondary/10 border border-secondary/20 flex flex-col items-center justify-center text-center group shadow-xl">
                    <span className="text-[11px] font-black uppercase text-secondary/60 tracking-[0.3em] mb-4">Alignment Score</span>
                    <span className="text-8xl font-black text-secondary tracking-tighter leading-none group-hover:scale-105 transition-transform duration-500">{result.overall_score || '--'}</span>
                    <div className="mt-8 flex flex-col gap-1">
                       <span className="text-[10px] font-black uppercase text-on-surface/40 tracking-widest">Global Fit Determination:</span>
                       <span className="text-xl font-bold text-on-surface tracking-tight uppercase">{result.final_fit || 'Pending...'}</span>
                    </div>
                 </div>

                 {result.critical_flags && result.critical_flags.length > 0 && (
                   <div className="p-8 rounded-[2rem] bg-error/5 border border-error/10 flex flex-col gap-4">
                      <div className="flex items-center gap-3 text-error">
                         <ShieldAlert size={20} />
                         <span className="text-[10px] font-black uppercase tracking-[0.2em]">Risk Factors Detected</span>
                      </div>
                      <div className="flex flex-col gap-3">
                         {result.critical_flags.map((flag, idx) => (
                           <div key={idx} className="bg-error/10 border border-error/20 p-4 rounded-xl text-xs font-medium text-error flex gap-3 italic">
                              <span className="opacity-40">///</span>
                              {flag}
                           </div>
                         ))}
                      </div>
                   </div>
                 )}
              </div>
           </div>

           {/* Executive Narrative */}
           <div className="lg:col-span-8 flex flex-col gap-8">
              <div className="h-full flex flex-col gap-8">
                 <div className="bg-[#0b0f10] border border-white/10 rounded-[3rem] overflow-hidden flex-1 shadow-2xl flex flex-col">
                    <div className="bg-surface-high border-b border-white/5 px-10 py-6 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <Terminal size={18} className="text-secondary" />
                          <span className="font-mono text-xs font-black uppercase tracking-[0.3em] text-on-surface-variant">AISummary_Protocol.v4</span>
                       </div>
                    </div>
                    <div className="p-12 font-mono text-base leading-[2] text-on-surface/80 flex-1 overflow-y-auto custom-scrollbar selection:bg-secondary selection:text-black">
                       {result.executive_summary ? (
                         <div className="flex flex-col gap-8">
                            <span className="text-secondary opacity-40">$ run --executive-synthesis</span>
                            <p className="whitespace-pre-wrap">{result.executive_summary}</p>
                            <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-2">
                               <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-on-surface/40">
                                  <CheckCircle2 size={12} className="text-secondary" />
                                  Session Identity Hash Secure
                               </div>
                               <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-on-surface/40">
                                  <Search size={12} className="text-secondary" />
                                  Heuristic Comparison Finalized
                               </div>
                            </div>
                         </div>
                       ) : result.error ? (
                         <div className="text-error/80 whitespace-pre-wrap leading-relaxed italic text-sm">
                            FATAL ERROR ENCOUNTERED DURING AI SYNTHESIS:
                            {result.error}
                            <hr className="my-6 border-white/5" />
                            PROTOCOL EXECUTION TERMINATED. RECOMMEND IMMEDIATE RE-SCAN.
                         </div>
                       ) : (
                         <div className="text-on-surface-variant/20 italic animate-pulse py-12 text-center flex flex-col items-center gap-6">
                            <Zap size={40} />
                            AI NARRATIVE PENDING GENERATION...
                         </div>
                       )}
                    </div>
                 </div>

                 <div className="p-8 rounded-[2rem] bg-secondary/5 border border-secondary/10 flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                       <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Matching Intelligence v4.0</span>
                       <span className="text-xs font-bold text-on-surface italic">"Synchronicity across candidate and requirement patterns was achieved."</span>
                    </div>
                    <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-secondary hover:brightness-125 transition-all">
                       Audit Log
                       <ChevronRight size={14} />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
