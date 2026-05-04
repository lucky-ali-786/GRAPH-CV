import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, CheckCircle, Lightbulb, Upload, History, Wand2, Clock, Zap, Target, Loader2, FileText, AlertCircle, Trash2, Terminal, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function EnhancerView() {
  const [activeTab, setActiveTab] = useState('enhance'); // 'enhance', 'pending'
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeJobs, setActiveJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (activeTab === 'pending') {
      fetchActiveJobs();
      interval = setInterval(fetchActiveJobs, 1000); // Fast poll for progress
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTab]);

  const fetchActiveJobs = async () => {
    try {
      const response = await fetch('http://localhost:8000/resume/api/v1/active/enhancements', {
        credentials: 'include'
      });
      const result = await response.json();
      if (result.success && result.data) {
        setActiveJobs(result.data);
      }
    } catch (error) {
      console.error("Failed to sync active telemetry:", error);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleEnhance = async () => {
    if (!file) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append('resumeImage', file);

    try {
      const response = await fetch('http://localhost:8000/resume/api/v1/enhance', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      const result = await response.json();
      
      if (response.ok) {
        setActiveTab('pending');
        setFile(null);
      } else {
        alert(result.message || "Enhancement deployment failed.");
      }
    } catch (error) {
      alert("Network error. Ensure backend is active and authorized.");
    } finally {
      setIsUploading(false);
    }
  };

  const renderActiveWorkspace = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 flex flex-col gap-8">
        <div className="glass-panel p-1 border-white/10 rounded-3xl group">
          <div className="bg-surface-lowest rounded-[23px] p-16 flex flex-col items-center justify-center text-center border border-white/5 relative overflow-hidden">
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer z-10" 
              onChange={handleFileChange}
              accept="image/*"
            />
            <div className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
               <Sparkles size={32} className="text-primary" />
            </div>
            <h2 className="text-3xl font-black text-on-surface mb-4 tracking-tight uppercase italic">Semantic Sync</h2>
            <p className="text-on-surface-variant max-w-sm mb-10 font-medium">
               {file ? `Pattern Identified: ${file.name}` : 'Deploy your professional identity map. Our engine will mining metrics and upgrade your phrasing architecture.'}
            </p>
            
            {file ? (
              <button 
                onClick={(e) => { e.stopPropagation(); handleEnhance(); }}
                disabled={isUploading}
                className="z-20 bg-primary text-on-primary font-black px-12 py-5 rounded-2xl flex items-center gap-3 hover:brightness-110 transition-all accent-glow-primary shadow-2xl"
              >
                {isUploading ? <Loader2 size={20} className="animate-spin" /> : <Zap size={20} fill="currentColor" />}
                Execute Enhancement
              </button>
            ) : (
              <button className="bg-surface-high border border-white/10 text-on-surface font-black px-10 py-5 rounded-2xl hover:bg-white/5 transition-all text-xs uppercase tracking-widest">
                Select Narrative Pattern
              </button>
            )}
          </div>
        </div>

        {/* Output Log */}
        <div className="bg-[#0b0f10] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="bg-surface-high/50 px-8 py-5 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Terminal size={14} className="text-primary" />
              <span className="font-mono text-[10px] uppercase font-black tracking-[0.2em] text-on-surface-variant">Enhancement_Protocol.log</span>
            </div>
            <div className="flex gap-1.5 grayscale opacity-30">
               <div className="w-1.5 h-1.5 rounded-full bg-white" />
               <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
          </div>
          <div className="p-10 font-mono text-xs text-on-surface-variant/30 leading-relaxed min-h-[180px]">
             <p className="text-primary/40 italic">&gt; Initializing semantic buffer...</p>
             <p className="mt-2 text-primary/30">&gt; Waiting for pattern injection...</p>
             <p className="mt-4 animate-pulse">_</p>
          </div>
        </div>
      </div>

      <aside className="lg:col-span-4 flex flex-col gap-6">
         <div className="glass-panel p-8 rounded-2xl border border-white/10 flex flex-col gap-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant flex items-center gap-2">
               <ShieldCheck size={14} className="text-primary" />
               Privacy Protocols
            </h3>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h4 className="text-[10px] font-black uppercase text-on-surface-variant/60">Pattern Redaction</h4>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  To ensure maximum privacy, we recommend removing physical contact identifiers from your resume image before synchronization.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="text-[10px] font-black uppercase text-on-surface-variant/60">Secure Buffer</h4>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  Your professional pattern data is processed in a high-security ephemeral environment and encrypted in your personal archive.
                </p>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
               <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Lightbulb size={12} />
                  Synthesis Tip
               </h4>
               <p className="text-[11px] text-on-surface-variant/70 leading-relaxed font-medium">
                  The enhancer focuses on skill-to-metric conversion. Sanitizing contact info will not affect the quality of your resume upgrades.
               </p>
            </div>
         </div>
      </aside>
    </div>
  );

  const renderActiveJobs = () => (
    <div className="flex flex-col gap-6">
      <header className="mb-4 flex flex-col gap-2">
        <h2 className="text-2xl font-black text-on-surface tracking-tight uppercase italic underline decoration-primary/30 decoration-4 underline-offset-8">Active Telemetry</h2>
        <p className="text-on-surface-variant text-sm font-medium">Real-time status tracking for narrative upgrades.</p>
      </header>
      
      {activeJobs.length === 0 ? (
        <div className="glass-panel p-20 rounded-3xl border border-white/5 bg-surface-low/50 flex flex-col items-center justify-center text-center gap-6">
           <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center opacity-10">
              <Clock size={32} />
           </div>
           <p className="text-on-surface-variant font-black uppercase tracking-widest text-xs">No active protocols in memory</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {activeJobs.map((req, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center justify-between group hover:bg-surface-low transition-all">
              <div className="flex items-center gap-6">
                <div className="relative">
                   <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-primary/10 border border-primary/20">
                    <Sparkles className="text-primary" size={24} />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full animate-ping opacity-30" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-black text-on-surface text-sm uppercase tracking-wider">JOB_SYNC: {req.jobId}</h3>
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] uppercase font-black text-primary tracking-widest">{req.state}</span>
                     <div className="h-1 w-1 rounded-full bg-white/20" />
                     <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest">Awaiting result</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-10 px-6">
                <div className="flex flex-col items-end gap-2 text-right">
                   <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{req.progress}% Matrix Stability</span>
                   <div className="w-48 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${req.progress}%` }}
                        className="h-full bg-primary shadow-[0_0_15px_rgba(192,193,255,0.5)]"
                      />
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-12">
      <div className="flex items-center justify-between border-b border-white/5 pb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-black text-on-surface tracking-tighter italic">Enhancer Protocol</h1>
          <p className="text-on-surface-variant text-sm font-medium uppercase tracking-[0.4em]">Narrative_Synthesis suite.v3</p>
        </div>
        <div className="flex items-center gap-4 bg-surface-low p-2 rounded-2xl border border-white/5 shadow-inner">
          <button 
            onClick={() => setActiveTab('enhance')}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all ${
              activeTab === 'enhance' ? 'bg-primary text-on-primary shadow-2xl scale-[1.02]' : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'
            }`}
          >
            <Wand2 size={16} />
            Initialize
          </button>
          <button 
            onClick={() => setActiveTab('pending')}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all ${
              activeTab === 'pending' ? 'bg-primary text-on-primary shadow-2xl scale-[1.02]' : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'
            }`}
          >
            <Clock size={16} />
            Telemetry
          </button>
          <button 
            onClick={() => navigate('/enhancer-history')}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all text-on-surface-variant hover:text-on-surface hover:bg-white/5`}
          >
            <History size={16} />
            Archive
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex-1"
        >
          {activeTab === 'enhance' && renderActiveWorkspace()}
          {activeTab === 'pending' && renderActiveJobs()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
