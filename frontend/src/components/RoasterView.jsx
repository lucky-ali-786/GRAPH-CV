import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Flame, AlertCircle, Terminal, History, Clock, FileText, Zap, Loader2, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RoasterView() {
  const [activeTab, setActiveTab] = useState('analyze'); // 'analyze', 'pending'
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loadingPending, setLoadingPending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (activeTab === 'pending') {
      fetchActiveRoasts();
      interval = setInterval(fetchActiveRoasts, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTab]);

  const fetchActiveRoasts = async () => {
    try {
      const response = await fetch('http://localhost:8000/resume/api/v1/active/roasts', {
        credentials: 'include'
      });
      const result = await response.json();
      if (result.success && result.data) {
        setPendingRequests(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch active roasts:', error);
    } finally {
      setLoadingPending(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await fetch('http://localhost:8000/resume/api/v1/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      const result = await response.json();
      if (response.ok) {
        setActiveTab('pending');
        setFile(null);
      } else {
        alert(result.message || 'Upload failed');
      }
    } catch (error) {
      alert('Error uploading file. Make sure backend is running.');
    } finally {
      setIsUploading(false);
    }
  };

  const renderActiveWorkspace = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Main Tool Area */}
      <div className="lg:col-span-8 flex flex-col gap-8">
        <div className="glass-panel p-1 border-white/10 rounded-3xl">
          <div className="bg-surface-lowest rounded-[23px] p-12 flex flex-col items-center justify-center text-center border border-white/5 group relative overflow-hidden">
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer z-10" 
              onChange={handleFileChange}
              accept="image/*,.pdf,.doc,.docx"
            />
            <div className="w-20 h-20 rounded-2xl bg-error/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
              <Upload className="text-error" size={32} />
            </div>
            <h2 className="text-3xl font-black text-on-surface mb-4">Roast Protocol</h2>
            <p className="text-on-surface-variant max-w-sm mb-10 font-medium">
              {file ? `Selected: ${file.name}` : 'Initialize a high-fidelity audit. Upload your professional data pattern for unsparing critique.'}
            </p>
            {file ? (
              <button 
                onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                disabled={isUploading}
                className="z-20 bg-error text-white font-bold px-10 py-4 rounded-xl hover:brightness-110 transition-all text-sm uppercase tracking-widest flex items-center gap-2"
              >
                {isUploading ? <Loader2 className="animate-spin" size={18} /> : 'Process Roast'}
              </button>
            ) : (
              <button className="bg-surface-high border border-white/10 text-on-surface font-bold px-10 py-4 rounded-xl hover:bg-white/5 transition-all text-sm uppercase tracking-widest">
                Upload Document
              </button>
            )}
          </div>
        </div>

        {/* Mockup Output/Terminal */}
        <div className="bg-[#0b0f10] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-surface-high px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-error" />
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Roast_Engine_Output.log</span>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-white/10" />
              <div className="w-2 h-2 rounded-full bg-white/10" />
            </div>
          </div>
          <div className="p-8 font-mono text-xs text-on-surface-variant/40 leading-relaxed min-h-[200px]">
             <p className="text-error/60">&gt; Waiting for input stream...</p>
             <p className="mt-2 animate-pulse">_</p>
          </div>
        </div>
      </div>

      {/* Sidebar with Privacy Rules */}
      <aside className="lg:col-span-4 flex flex-col gap-6">
        <div className="glass-panel p-8 rounded-2xl border border-white/10">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-on-surface-variant mb-8 flex items-center gap-2">
            <ShieldCheck size={14} className="text-primary" />
            Privacy Protocols
          </h3>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h4 className="text-[10px] font-black uppercase text-on-surface-variant/60">Data Sanitization</h4>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                If you prefer to maintain anonymity, we recommend manually redacting your phone number and physical address from the image before processing.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-[10px] font-black uppercase text-on-surface-variant/60">Ephemeral Memory</h4>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Our synthesis engine operates on a stateless buffer. Historical records are stored in your private vault and are never indexed for public search.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-[10px] font-black uppercase text-on-surface-variant/60">PII Sync</h4>
              <p className="text-[11px] text-on-surface-variant leading-relaxed italic">
                *Sensitive pattern matching is localized to your session logic.
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-2xl bg-error/5 border border-error/10">
          <h4 className="text-xs font-black text-error uppercase tracking-widest mb-4 flex items-center gap-2">
            <AlertCircle size={14} />
            System Warning
          </h4>
          <p className="text-[11px] text-error/80 leading-relaxed">
            The Audit engine does not respect feelings. Proceed only if you require objective professional evolution.
          </p>
        </div>
      </aside>
    </div>
  );

  const renderPendingRequests = () => (
    <div className="flex flex-col gap-6">
      <header className="mb-4">
        <h2 className="text-2xl font-black text-on-surface tracking-tight">Active Queue</h2>
        <p className="text-on-surface-variant text-sm">Real-time status of your ongoing roast protocols.</p>
      </header>
      
      {pendingRequests.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border border-white/10 bg-surface-low">
          <p className="text-on-surface-variant font-medium">No active roasts in queue.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {pendingRequests.map((req) => (
            <div key={req.jobId} className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center justify-between group hover:bg-surface-low transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10">
                  <FileText className="text-primary" size={20} />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-bold text-on-surface">Job ID: {req.jobId}</h3>
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest flex items-center gap-2">
                    <Clock size={12} />
                    Processing...
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-8 px-8">
                <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-primary/20 text-primary animate-pulse">
                  {req.state}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-12">
      {/* 3-State Navigation (as requested with 2 extra buttons) */}
      <div className="flex items-center justify-between border-b border-white/5 pb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-black text-on-surface tracking-tighter">Resume Roast</h1>
          <p className="text-on-surface-variant text-sm font-medium">Professional Identity Audit Protocol v2.4</p>
        </div>
        <div className="flex items-center gap-4 bg-surface-low p-1.5 rounded-2xl border border-white/5 shadow-inner">
          <button 
            onClick={() => setActiveTab('analyze')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'analyze' ? 'bg-primary text-on-primary shadow-xl scale-[1.02]' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Flame size={16} />
            Analyze
          </button>
          <button 
            onClick={() => setActiveTab('pending')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'pending' ? 'bg-primary text-on-primary shadow-xl scale-[1.02]' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Clock size={16} />
            Pending
          </button>
          <button 
            onClick={() => navigate('/roaster-history')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all text-on-surface-variant hover:text-on-surface`}
          >
            <History size={16} />
            History
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'analyze' && renderActiveWorkspace()}
          {activeTab === 'pending' && renderPendingRequests()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

