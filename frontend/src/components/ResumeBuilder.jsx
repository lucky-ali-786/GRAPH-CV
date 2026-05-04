import React, { useState, useEffect, useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Download, Loader2, Zap, Terminal, Split, Eye, Code2, Save, Sparkles, ChevronRight, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DEFAULT_LATEX = `% GraphCV - Professional Resume Template
\\documentclass[10pt, letterpaper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\geometry{a4paper, margin=0.75in}
\\usepackage{hyperref}
\\usepackage{enumitem}

\\begin{document}
\\begin{center}
    {\\Huge \\textbf{Lucky Ali}} \\\\
    \\vspace{2pt}
    \\href{mailto:luckyali@example.com}{luckyali@example.com} | (+91) 123-456-7890 | \\href{https://linkedin.com/in/luckyali}{linkedin.com/in/luckyali}
\\end{center}

\\section*{Summary}
Dynamic Software Engineer with a passion for building scalable web applications and intuitive user interfaces. Experienced in React, Node.js, and high-performance system design.

\\section*{Experience}
\\textbf{Senior Developer} | TechInnovate Solutions \\hfill Jan 2023 -- Present
\\begin{itemize}
    \\item Engineered a microservices architecture that scaled to 2M+ users.
    \\item Refactored legacy UI components into a modern design system using Tailwind and Framer Motion.
    \\item Optimized build times by 40% through specialized CI/CD tuning.
\\end{itemize}

\\textbf{Software Engineer} | FutureScope Corp \\hfill June 2021 -- Dec 2022
\\begin{itemize}
    \\item Developed 15+ high-performance React features for enterprise clients.
    \\item Implemented real-time data sync protocols reducing latency by 150ms.
\\end{itemize}

\\section*{Education}
\\textbf{Bachelor of Technology in Computer Science} \\hfill 2017 -- 2021 \\\\
Institute of Technology, New Delhi

\\section*{Skills}
\\textbf{Languages:} JavaScript, TypeScript, Python, Python, C++, SQL. \\\\
\\textbf{Frameworks:} React, Next.js, Express, Tailwind CSS, shadcn/ui. \\\\
\\textbf{Tools:} Git, Docker, Kubernetes, AWS, Google Cloud, Figma.

\\end{document}`;

export default function ResumeBuilder() {
  const [texCode, setTexCode] = useState(DEFAULT_LATEX);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isCompiling, setIsCompiling] = useState(true);
  const [error, setError] = useState(null);
  const [activePane, setActivePane] = useState('both'); // 'editor', 'preview', 'both'
  
  const workerRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize worker
    try {
      const workerUrl = new URL('/latexWorker.js', window.location.origin);
      workerRef.current = new Worker(workerUrl);
      console.log("LaTeX Worker initialized at:", workerUrl.href);
    } catch (err) {
      console.error("Worker initialization failed:", err);
      setError("Failed to initialize system worker.");
      return;
    }
    
    workerRef.current.onmessage = (event) => {
      console.log("Worker message received:", event.data.type);
      if (event.data.type === 'SUCCESS') {
        if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        const newUrl = URL.createObjectURL(event.data.pdfBlob);
        setPdfUrl(newUrl);
        setIsCompiling(false);
        setError(null);
      } else if (event.data.type === 'ERROR') {
        console.error("Compilation Error:", event.data.message);
        setError(event.data.message);
        setIsCompiling(false);
      }
    };

    // Initial compile
    workerRef.current.postMessage({ code: texCode });

    return () => {
      workerRef.current.terminate();
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, []);

  const handleEditorChange = useCallback((value) => {
    setTexCode(value);
  }, []);

  const handleCompile = () => {
    if (!workerRef.current) return;
    setIsCompiling(true);
    setError(null);
    workerRef.current.postMessage({ code: texCode });
  };

  const downloadPdf = () => {
    if (!pdfUrl) return;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'GraphCV_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6">
      {/* Integrated Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
               <Code2 size={20} className="text-primary" />
             </div>
             <h1 className="text-3xl font-black text-on-surface tracking-tighter">LaTeX Build Suite</h1>
          </div>
          <p className="text-on-surface-variant text-xs font-medium uppercase tracking-widest">Enterprise Pattern Architect v1.0</p>
        </div>

        <div className="flex items-center gap-4">
           {/* Generate Button */}
           <button 
             onClick={handleCompile}
             disabled={isCompiling}
             className={`flex items-center gap-3 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all bg-secondary text-on-surface hover:brightness-110 shadow-lg border border-white/10 ${
               isCompiling ? 'opacity-50 cursor-not-allowed' : ''
             }`}
           >
              <Sparkles size={14} className={isCompiling ? 'animate-spin' : ''} />
              Generate Result
           </button>

           <div className="h-8 w-px bg-white/10" />

           {/* Compilation Status */}
           <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-surface-low border border-white/5">
              {isCompiling ? (
                <>
                  <Loader2 size={14} className="animate-spin text-primary" />
                  <span className="text-[10px] font-black uppercase text-on-surface-variant tracking-widest animate-pulse">Synthesizing...</span>
                </>
              ) : error ? (
                <>
                  <Terminal size={14} className="text-error" />
                  <span className="text-[10px] font-black uppercase text-error tracking-widest">Logic Conflict Detected</span>
                </>
              ) : (
                <>
                  <Zap size={14} className="text-green-400" />
                  <span className="text-[10px] font-black uppercase text-green-400 tracking-widest">Pattern Stable</span>
                </>
              )}
           </div>

           <div className="h-8 w-px bg-white/10" />

           <button 
             onClick={downloadPdf}
             disabled={!pdfUrl || isCompiling}
             className={`flex items-center gap-3 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
               !pdfUrl || isCompiling 
               ? 'bg-surface-highest text-on-surface-variant opacity-50 cursor-not-allowed' 
               : 'bg-primary text-on-primary hover:brightness-110 accent-glow-primary'
             }`}
           >
              <Download size={14} />
              Export PDF
           </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden rounded-3xl border border-white/10 bg-[#0b0f10] shadow-2xl relative">
        {/* Editor Container */}
        <div className={`flex-1 flex flex-col border-r border-white/5 transition-all duration-500 overflow-hidden ${
          activePane === 'preview' ? 'hidden' : 'flex'
        }`}>
          <div className="bg-surface-high border-b border-white/5 px-6 py-3 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <Terminal size={14} className="text-primary" />
               <span className="text-[10px] font-bold font-mono tracking-widest text-on-surface-variant">SOURCE: main.tex</span>
             </div>
             <div className="flex gap-1.5 grayscale opacity-30">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
             </div>
          </div>
          <div className="flex-1">
             <Editor
                height="100%"
                defaultLanguage="latex"
                theme="vs-dark"
                value={texCode}
                onChange={handleEditorChange}
                options={{ 
                  wordWrap: "on", 
                  minimap: { enabled: false },
                  fontSize: 14,
                  padding: { top: 20 },
                  backgroundColor: '#0b0f10',
                  lineNumbers: 'on',
                  roundedSelection: true,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  scrollbar: {
                    vertical: 'hidden',
                    horizontal: 'hidden'
                  }
                }}
             />
          </div>
        </div>

        {/* Floating View Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 rounded-2xl bg-surface-low border border-white/10 shadow-2xl backdrop-blur-xl z-20">
           <button 
             onClick={() => setActivePane('editor')}
             className={`p-2.5 rounded-xl transition-all ${activePane === 'editor' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
           >
             <Code2 size={18} />
           </button>
           <button 
             onClick={() => setActivePane('both')}
             className={`p-2.5 rounded-xl transition-all ${activePane === 'both' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
           >
             <Split size={18} />
           </button>
           <button 
             onClick={() => setActivePane('preview')}
             className={`p-2.5 rounded-xl transition-all ${activePane === 'preview' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
           >
             <Eye size={18} />
           </button>
        </div>

        {/* Preview Container */}
        <div className={`flex-1 flex flex-col bg-surface-lowest relative transition-all duration-500 ${
          activePane === 'editor' ? 'hidden' : 'flex'
        }`}>
          {isCompiling && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-6 animate-in fade-in duration-300">
               <div className="relative">
                  <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <Sparkles size={16} className="text-primary animate-pulse" />
                  </div>
               </div>
               <div className="flex flex-col items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-white">Rendering Document</span>
                  <span className="text-[10px] text-on-surface-variant font-mono animate-pulse">Syncing semantic patterns...</span>
               </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 bg-error/5 z-10 flex flex-col items-center justify-center p-12 text-center gap-6 animate-in fade-in zoom-in duration-500">
               <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center border border-error/20">
                  <ShieldAlert size={32} className="text-error" />
               </div>
               <div className="flex flex-col gap-3">
                  <h3 className="text-xl font-black text-on-surface tracking-tight uppercase italic">Compilation Failed</h3>
                  <p className="text-xs text-on-surface-variant font-mono max-w-md leading-relaxed p-4 bg-black/40 rounded-xl border border-error/10">
                    {error}
                  </p>
                  <button 
                    onClick={() => handleEditorChange(texCode)}
                    className="text-[10px] font-black uppercase text-error tracking-widest hover:underline mt-4"
                  >
                    Force Re-Synthesize
                  </button>
               </div>
            </div>
          )}
          
          {pdfUrl ? (
            <iframe 
              src={pdfUrl + "#toolbar=0&navpanes=0"} 
              className="w-full h-full border-none bg-white" 
              title="GraphCV Output" 
            />
          ) : !isCompiling && (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center gap-8">
              <div className="w-24 h-24 rounded-[3rem] bg-surface-high border border-white/5 flex items-center justify-center group">
                 <Zap size={32} className="text-on-surface-variant group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-black text-on-surface tracking-tighter uppercase italic">Ready to Manifest</h3>
                <p className="text-sm text-on-surface-variant max-w-sm font-medium">
                  Modify the source pattern on the left. The high-fidelity PDF output will materialize here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

