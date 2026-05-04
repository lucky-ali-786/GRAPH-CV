import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Flame, Download, Share2, Image as ImageIcon, Terminal, Zap, Target, ShieldCheck } from 'lucide-react';

import { useNavigate, useLocation } from 'react-router-dom';

export default function RoastResultDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state?.data;

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-on-surface-variant font-medium">No audit data found.</p>
        <button 
          onClick={() => navigate('/roaster-history')}
          className="text-primary font-bold hover:underline"
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

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-all px-4 py-2 rounded-xl hover:bg-white/5"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Back</span>
        </button>

        <div className="flex items-center gap-4">
           <div className="flex flex-col items-end">
             <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Audit Status</span>
             <span className="text-xs font-bold text-green-400 uppercase">Finalized</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
        {/* Left: Resume Pattern Visualization */}
        <div className="xl:col-span-5 flex flex-col gap-6 sticky top-24">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface-lowest border border-white/10 flex items-center justify-center">
                <ImageIcon size={18} className="text-on-surface-variant" />
              </div>
              <div>
                <h3 className="text-lg font-black text-on-surface tracking-tight uppercase">Input Pattern</h3>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Job ID: {data.jobId}</p>
              </div>
            </div>
          </div>

          <div className="group relative glass-panel p-2 rounded-[2rem] border-white/10 shadow-2xl overflow-hidden bg-black/40">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none" />
            <div className="relative rounded-[1.5rem] overflow-hidden border border-white/5 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <img 
                src={data.resumeLinkUsed} 
                alt="Resume Analysis" 
                className="w-full h-auto object-contain hover:scale-[1.02] transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Overlay Pattern UI */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-2 pointer-events-none">
               <div className="bg-surface-low/90 backdrop-blur border border-white/10 p-3 rounded-xl flex items-center gap-3 animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-[10px] font-bold text-on-surface uppercase tracking-widest">Scanning Nodes...</span>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-surface-low border border-white/5 p-4 rounded-2xl flex flex-col gap-1">
                <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Session Logic</span>
                <span className="text-xs font-bold text-on-surface">{data.type}</span>
             </div>
             <div className="bg-surface-low border border-white/5 p-4 rounded-2xl flex flex-col gap-1">
                <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Analyzed on</span>
                <span className="text-xs font-bold text-on-surface">{formatDate(data.createdAt)}</span>
             </div>
          </div>
        </div>

        {/* Right: Detailed Analysis Output */}
        <div className="xl:col-span-7 flex flex-col gap-8">
           <header className="flex flex-col gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-error/10 border border-error/20 text-error text-[10px] font-black uppercase tracking-widest w-fit">
                <Zap size={10} fill="currentColor" />
                Aggressive Critique Active
              </div>
              <h2 className="text-5xl font-black text-on-surface tracking-tighter leading-none">
                Audit Execution <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-error via-error-container to-slate-400">Final Results.</span>
              </h2>
           </header>

           {/* Results Terminal */}
           <div className="flex flex-col gap-4">
              <div className="bg-[#0b0f10] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                 <div className="bg-surface-high/50 border-b border-white/5 px-8 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <Terminal size={16} className="text-error" />
                       <span className="font-mono text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant">Roast_Synthesis_Protocol.v2</span>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-40">
                       <div className="h-1.5 w-1.5 rounded-full bg-white" />
                       <div className="h-1.5 w-1.5 rounded-full bg-white" />
                       <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    </div>
                 </div>
                 <div className="p-10 md:p-12 font-mono text-base leading-[1.85] text-on-surface/90">
                    <div className="flex flex-col gap-8">
                       {/* Line by line display effect for "Industry Grade" feel */}
                       <div className="text-primary/70 mb-4">$ cat audit_report.txt</div>
                       <div className="whitespace-pre-wrap selection:bg-error selection:text-white">
                          {data.result.roast}
                       </div>
                    </div>
                 </div>
              </div>
              
              <div className="p-8 rounded-2xl bg-surface-low border border-white/5 flex flex-col gap-4">
                 <h4 className="text-xs font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                    <Zap size={14} className="text-primary" />
                    AI Recommendation
                 </h4>
                 <p className="text-sm text-on-surface-variant leading-relaxed font-medium italic">
                    "The professional narrative exhibits significant semantic overlap with standard mediocrity. RECOMMENDATION: Initialize pattern transformation via Smart Enhancer suite immediately."
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
