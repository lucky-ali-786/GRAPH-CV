import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles, Download, Share2, Image as ImageIcon, Terminal, Zap, Target, ShieldCheck, ChevronRight, CheckCircle2, History } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function EnhancementResultDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state?.data;

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6">
        <Sparkles className="text-on-surface-variant opacity-10" size={64} />
        <p className="text-on-surface-variant font-bold text-lg">Analysis data missing from ephemeral memory.</p>
        <button 
          onClick={() => navigate('/enhancer-history')}
          className="bg-primary text-on-primary font-black px-8 py-4 rounded-xl hover:brightness-110 transition-all shadow-xl"
        >
          Return to Archive
        </button>
      </div>
    );
  }

  const result = data.result || {};

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const sections = [
    { title: 'Experience Upgrades', data: result.experience_upgrades, color: 'text-primary', borderColor: 'border-primary/20', bgColor: 'bg-primary/5' },
    { title: 'Project Synthetics', data: result.project_upgrades, color: 'text-tertiary', borderColor: 'border-tertiary/20', bgColor: 'bg-tertiary/5' },
    { title: 'Achievement Metrics', data: result.achievement_upgrades, color: 'text-secondary', borderColor: 'border-secondary/20', bgColor: 'bg-secondary/5' }
  ];

  return (
    <div className="flex flex-col gap-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Dynamic Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-10">
        <div className="flex items-center gap-8">
           <button 
             onClick={() => navigate(-1)}
             className="group w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all"
           >
             <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
           </button>
           <div className="flex flex-col gap-1">
              <h1 className="text-4xl font-black text-on-surface tracking-tighter">Enhancement Results</h1>
              <p className="text-on-surface-variant text-xs font-bold uppercase tracking-[0.3em]">Job Pattern Alpha-{data.jobId}</p>
           </div>
        </div>

        <div className="flex items-center gap-3 bg-surface-low border border-white/5 p-2 rounded-2xl">
           <div className="px-5 py-2.5 rounded-xl bg-green-500/10 text-green-400 text-[10px] font-black uppercase tracking-widest border border-green-500/20 flex items-center gap-2">
              <ShieldCheck size={14} />
              Verified Build
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
         {/* Left: Telemetry & Input */}
         <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="glass-panel p-2 rounded-[2.5rem] border border-white/10 bg-black/20 shadow-2xl overflow-hidden relative">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
               <div className="rounded-[2rem] overflow-hidden border border-white/5 bg-[#0b0f10] max-h-[70vh] overflow-y-auto custom-scrollbar">
                  <img 
                    src={data.resumeLinkUsed} 
                    alt="Input Pattern" 
                    className="w-full h-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-700"
                    referrerPolicy="no-referrer"
                  />
               </div>
            </div>

            <div className="flex flex-col gap-4">
               <div className="p-6 rounded-2xl bg-surface-low border border-white/5 flex flex-col gap-4">
                  <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                     <Target size={14} className="text-primary" />
                     Pattern Telemetry
                  </h3>
                  <div className="flex flex-col gap-3">
                     <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-[10px] text-on-surface-variant font-bold uppercase">Sync Date</span>
                        <span className="text-xs font-mono font-bold">{formatDate(data.createdAt)}</span>
                     </div>
                     <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-[10px] text-on-surface-variant font-bold uppercase">Process Type</span>
                        <span className="text-xs font-mono font-bold text-primary">{data.type}</span>
                     </div>
                     <div className="flex justify-between items-center py-2">
                        <span className="text-[10px] text-on-surface-variant font-bold uppercase">Stability</span>
                        <span className="text-xs font-mono font-bold text-green-400">99.8%</span>
                     </div>
                  </div>
               </div>

               <div className="p-6 rounded-2xl bg-tertiary/5 border border-tertiary/10 flex flex-col gap-3 shadow-inner">
                  <h4 className="text-[10px] font-black text-tertiary uppercase tracking-widest flex items-center gap-2">
                     <Zap size={14} />
                     Strategic Context
                  </h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed font-medium italic">
                    "{result.general_ats_advice || 'No strategic advice generated for this pattern.'}"
                  </p>
               </div>
            </div>
         </div>

         {/* Right: Enhancement Payload */}
         <div className="lg:col-span-8 flex flex-col gap-10">
            {sections.map((section, sIdx) => (
              <section key={sIdx} className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                   <div className={`px-4 py-1.5 rounded-full ${section.bgColor} border ${section.borderColor} ${section.color} text-[10px] font-black uppercase tracking-widest`}>
                      {section.title}
                   </div>
                   <div className="flex-1 h-px bg-white/5" />
                </div>

                <div className="grid grid-cols-1 gap-4">
                   {section.data && section.data.map((item, iIdx) => (
                     <motion.div 
                       key={iIdx}
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: (sIdx * 0.2) + (iIdx * 0.1) }}
                       className="p-8 rounded-2xl bg-surface-low border border-white/5 hover:border-white/10 transition-all flex gap-6 group"
                     >
                       <div className={`w-8 h-8 shrink-0 rounded-full ${section.bgColor} border ${section.borderColor} flex items-center justify-center`}>
                          <CheckCircle2 size={14} className={section.color} />
                       </div>
                       <p className="text-[15px] leading-relaxed text-on-surface-variant font-medium group-hover:text-on-surface transition-colors" dangerouslySetInnerHTML={{ __html: item }} />
                     </motion.div>
                   ))}
                </div>
              </section>
            ))}

            <div className="mt-8 p-12 rounded-[3rem] bg-gradient-to-br from-primary/10 via-transparent to-tertiary/10 border border-white/10 flex flex-col items-center text-center gap-6">
               <div className="w-16 h-16 rounded-3xl bg-surface-low border border-white/5 flex items-center justify-center animate-bounce shadow-2xl">
                  <History size={24} className="text-primary" />
               </div>
               <div className="flex flex-col gap-1">
                 <h3 className="text-xl font-black text-on-surface uppercase tracking-tight italic">Synthesis Complete</h3>
                 <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest max-w-xs">
                    These patterns are now optimized for high-performance enterprise parsing.
                 </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
