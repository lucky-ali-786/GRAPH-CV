import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scale, FileText, Briefcase, Search, CheckCircle2, AlertTriangle, Upload, History, Image as ImageIcon, Clock, Zap, Target, Loader2, X, Terminal } from 'lucide-react';
import ATSMatchHistory from './history/ATSMatchHistory';

import { useNavigate } from 'react-router-dom';

export default function ATSMatcherView() {
  const [activeTab, setActiveTab] = useState('match'); // 'match', 'pending'
  const [resumeImg, setResumeImg] = useState(null);
  const [jdImg, setJdImg] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingEvaluations, setPendingEvaluations] = useState([]);
  const [loadingPending, setLoadingPending] = useState(false);
  const navigate = useNavigate();

  const metrics = [
    { label: 'Semantic Similarity', value: '0.00', icon: Search },
    { label: 'Keyword Density', value: '0.00', icon: Target },
    { label: 'Format Compliance', value: 'Pending', icon: CheckCircle2 },
  ];

  useEffect(() => {
    let interval;
    if (activeTab === 'pending') {
      fetchActiveEvaluations();
      interval = setInterval(fetchActiveEvaluations, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTab]);

  const fetchActiveEvaluations = async () => {
    try {
      const response = await fetch('http://localhost:8000/resume/api/v1/active/evaluations', {
        credentials: 'include'
      });
      const result = await response.json();
      if (result.success && result.data) {
        setPendingEvaluations(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch active evaluations:', error);
    } finally {
      setLoadingPending(false);
    }
  };

  const handleFileUpload = (e, target) => {
    if (e.target.files && e.target.files[0]) {
      if (target === 'resume') setResumeImg(e.target.files[0]);
      if (target === 'jd') setJdImg(e.target.files[0]);
    }
  };

  const handleInitializeMatch = async () => {
    if (!resumeImg || !jdImg) {
      alert('Please select both a Resume image and a Job Description image.');
      return;
    }
    setIsUploading(true);

    const formData = new FormData();
    formData.append('resumeImage', resumeImg);
    formData.append('jdImage', jdImg);

    try {
      const response = await fetch('http://localhost:8000/resume/api/v1/evaluate', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      if (response.ok) {
        setActiveTab('pending');
        setResumeImg(null);
        setJdImg(null);
      } else {
        const result = await response.json();
        alert(result.message || 'Evaluation initiation failed');
      }
    } catch (error) {
      alert('Network error. Check backend connection.');
    } finally {
      setIsUploading(false);
    }
  };

  const renderActiveWorkspace = () => (
    <div className="flex flex-col gap-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Dual Upload Zone */}
        <div className="glass-panel p-1 border-white/10 rounded-3xl overflow-hidden group relative">
          <input 
            type="file" 
            className="absolute inset-0 opacity-0 cursor-pointer z-10" 
            onChange={(e) => handleFileUpload(e, 'resume')}
            accept="image/*"
          />
          <div className={`bg-surface-lowest rounded-[23px] p-12 transition-all ${resumeImg ? 'bg-primary/5' : 'group-hover:bg-surface-low'} border border-white/5 flex flex-col items-center text-center h-full`}>
             <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8">
                {resumeImg ? <FileText size={28} className="text-primary" /> : <ImageIcon size={28} className="text-primary" />}
             </div>
             <h3 className="text-xl font-black text-on-surface mb-2 tracking-tight uppercase">Resume Image Pattern</h3>
             <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-8">
               {resumeImg ? `Selected: ${resumeImg.name}` : 'Verification Required'}
             </p>
             <div className="w-full flex flex-col gap-4">
                <button className={`w-full ${resumeImg ? 'bg-primary text-on-primary' : 'bg-surface-high border-white/10 text-on-surface'} border font-bold py-4 rounded-xl text-[10px] uppercase tracking-[0.2em] transition-all`}>
                   {resumeImg ? 'Pattern Locked' : 'Deploy Document Image'}
                </button>
             </div>
          </div>
        </div>

        <div className="glass-panel p-1 border-white/10 rounded-3xl overflow-hidden group relative">
          <input 
            type="file" 
            className="absolute inset-0 opacity-0 cursor-pointer z-10" 
            onChange={(e) => handleFileUpload(e, 'jd')}
            accept="image/*"
          />
          <div className={`bg-surface-lowest rounded-[23px] p-12 transition-all ${jdImg ? 'bg-secondary/5' : 'group-hover:bg-surface-low'} border border-white/5 flex flex-col items-center text-center h-full`}>
             <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-8">
                {jdImg ? <Target size={28} className="text-secondary" /> : <Briefcase size={28} className="text-secondary" />}
             </div>
             <h3 className="text-xl font-black text-on-surface mb-2 tracking-tight uppercase">Job Description Logic</h3>
             <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-8">
               {jdImg ? `Selected: ${jdImg.name}` : 'Target Alignment Protocol'}
             </p>
             <div className="w-full flex flex-col gap-4">
                <button className={`w-full ${jdImg ? 'bg-secondary text-surface' : 'bg-surface-high border-white/10 text-on-surface'} border font-bold py-4 rounded-xl text-[10px] uppercase tracking-[0.2em] transition-all`}>
                   {jdImg ? 'Constraint Confirmed' : 'Deploy Contextual Scan'}
                </button>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {metrics.map(metric => (
           <div key={metric.label} className="p-8 rounded-2xl bg-surface-low border border-white/5 flex items-center gap-6 group hover:border-primary/20 transition-all">
              <div className="w-12 h-12 rounded-xl bg-surface-highest flex items-center justify-center group-hover:scale-110 transition-transform">
                 <metric.icon size={20} className="text-on-surface-variant group-hover:text-primary transition-colors" />
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase text-on-surface-variant tracking-widest mb-1">{metric.label}</span>
                 <span className="text-xl font-black text-on-surface tracking-tighter">{metric.value}</span>
              </div>
           </div>
         ))}
      </div>

      <button 
        onClick={handleInitializeMatch}
        disabled={isUploading}
        className="w-full bg-secondary text-surface font-black py-6 rounded-2xl text-sm uppercase tracking-[0.3em] hover:brightness-110 transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50"
      >
         {isUploading ? <Loader2 className="animate-spin" size={20} /> : 'Initialize Match Evaluation'}
      </button>
    </div>
  );

  const renderPendingMatches = () => (
    <div className="flex flex-col gap-6">
      <header className="mb-4">
        <h2 className="text-2xl font-black text-on-surface tracking-tight">Alignment Queue</h2>
        <p className="text-on-surface-variant text-sm">Monitoring synchronicity between patterns.</p>
      </header>

      {pendingEvaluations.length === 0 ? (
        <div className="glass-panel p-16 text-center rounded-2xl border border-white/10 bg-surface-low">
          <p className="text-on-surface-variant font-medium text-lg">No active evaluations in queue.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {pendingEvaluations.map((req) => (
            <div key={req.jobId} className="glass-panel p-8 rounded-2xl border border-white/10 flex items-center justify-between group">
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-secondary/10 group-hover:scale-105 transition-transform`}>
                  <Target className="text-secondary" size={24} />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-black text-on-surface tracking-tight uppercase">Job Evaluation ID: {req.jobId}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase font-black text-secondary tracking-widest flex items-center gap-2">
                       <Clock size={12} />
                       {req.state}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-12 px-8">
                 <span className="text-[10px] font-black text-on-surface pb-1 border-b-2 border-secondary animate-pulse uppercase">Scanning Patterns</span>
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
          <h1 className="text-4xl font-black text-on-surface tracking-tighter">ATS Alignment</h1>
          <p className="text-on-surface-variant text-sm font-medium">Match Engine v4.0 (Image Logic Only)</p>
        </div>
        <div className="flex items-center gap-4 bg-surface-low p-1.5 rounded-2xl border border-white/5 shadow-inner">
          <button 
            onClick={() => setActiveTab('match')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'match' ? 'bg-primary text-on-primary shadow-xl scale-[1.02]' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Scale size={16} />
            Eval
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
            onClick={() => navigate('/ats-match-history')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all text-on-surface-variant hover:text-on-surface shadow-inner`}
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
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'match' && renderActiveWorkspace()}
          {activeTab === 'pending' && renderPendingMatches()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
