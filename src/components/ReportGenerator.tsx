import React, { useState } from 'react';
import { ProposedProject } from '../types';
import { FileText, Languages, Send, Sparkles, Printer, Copy, CheckCircle, HelpCircle } from 'lucide-react';

interface ReportGeneratorProps {
  project: ProposedProject | null;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ project }) => {
  const [customFocus, setCustomFocus] = useState('');
  const [language, setLanguage] = useState<'en' | 'ml' | 'hi' | 'ta'>('en');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!project) return;
    setLoading(true);
    setReport(null);

    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project,
          customFocus,
          language,
        }),
      });

      const data = await response.json();
      if (data.report) {
        setReport(data.report);
      } else {
        setReport("Failed to generate report. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setReport("Connection failed. Check development server is online.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!report) return;
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple, highly robust Markdown-to-JSX custom parser that matches bullet points, titles, and separators
  const renderMarkdown = (md: string) => {
    const lines = md.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('# ')) {
        return <h1 key={idx} className="text-base font-extrabold text-cyan-400 font-display mt-4 mb-2 tracking-wide border-b border-slate-800 pb-2 uppercase">{trimmed.substring(2)}</h1>;
      }
      if (trimmed.startsWith('## ')) {
        return <h2 key={idx} className="text-sm font-bold text-cyan-300 font-display mt-4 mb-2 uppercase tracking-wide">{trimmed.substring(3)}</h2>;
      }
      if (trimmed.startsWith('### ')) {
        return <h3 key={idx} className="text-xs font-semibold text-slate-200 font-mono mt-3 mb-1">{trimmed.substring(4)}</h3>;
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return <li key={idx} className="ml-4 list-disc text-xs text-slate-300 font-sans mb-1 leading-relaxed">{trimmed.substring(2)}</li>;
      }
      if (trimmed === '---') {
        return <hr key={idx} className="border-slate-800 my-4" />;
      }
      if (trimmed === '') {
        return <div key={idx} className="h-2" />;
      }
      return <p key={idx} className="text-xs text-slate-300 font-sans mb-2 leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="bg-slate-900/65 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-2xl shadow-cyan-950/10 space-y-5">
      <div className="border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2 text-cyan-400 font-display font-bold uppercase tracking-wide">
          <FileText className="w-5 h-5 text-cyan-400" />
          AI Security & Proposal Desk
        </div>
        <p className="text-xs text-slate-400 font-sans mt-0.5">
          Generate formal administrative requisition papers, itemized cost estimates, and legislative drafts for public work approvals.
        </p>
      </div>

      {project ? (
        <div className="space-y-4">
          {/* Active project header card */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between gap-4 shadow-inner">
            <div>
              <span className="text-[9px] bg-cyan-950/50 text-cyan-400 px-2 py-0.5 border border-cyan-800/40 rounded font-mono uppercase font-bold tracking-wider">
                ACTIVE PIPELINE SELECTION
              </span>
              <h4 className="text-sm font-extrabold text-slate-100 mt-2 font-display tracking-wide">{project.title}</h4>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                Budget Scope: <strong className="text-yellow-500">₹{project.estimatedCost} Lakhs</strong> | Region: <strong className="text-slate-200">{project.ward.toUpperCase()}</strong>
              </p>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-slate-500 block uppercase font-mono">PRIORITY RANK</span>
              <span className="text-lg font-black font-mono text-cyan-400">{project.demandIndex}/100</span>
            </div>
          </div>

          {/* Configuration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Guidelines box */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block font-mono uppercase tracking-wide">
                LEGISLATIVE DIRECTIVES / CUSTOM GUIDELINES
              </label>
              <textarea
                id="report-custom-focus"
                rows={2}
                value={customFocus}
                onChange={(e) => setCustomFocus(e.target.value)}
                placeholder="e.g., Target immediate water security, ensure alignment with District Collector, add state environment safeguards..."
                className="w-full text-xs bg-slate-950/60 border border-slate-800 focus:border-cyan-500/50 rounded-xl p-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
              />
            </div>

            {/* Language Box */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block font-mono uppercase tracking-wide">
                DRAFTING DIALECT
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { code: 'en', label: 'English' },
                  { code: 'ml', label: 'Malayalam' },
                  { code: 'hi', label: 'Hindi' },
                  { code: 'ta', label: 'Tamil' },
                ].map((lang) => (
                  <button
                    key={lang.code}
                    id={`lang-btn-${lang.code}`}
                    onClick={() => setLanguage(lang.code as any)}
                    className={`px-2.5 py-1.5 text-xs rounded-lg border font-bold font-mono uppercase tracking-wide flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      language === lang.code
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-cyan-400 hover:bg-slate-900'
                    }`}
                  >
                    <Languages className="w-3.5 h-3.5 opacity-60" />
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <button
            id="btn-trigger-generation"
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 border border-cyan-500/30 text-white font-display font-bold text-xs py-2.5 px-4 rounded-xl shadow-lg shadow-cyan-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                Drafting administrative clearance files with Gemini AI...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 animate-pulse text-cyan-300" />
                GENERATE RECOMMENDATION DOSSIER
              </>
            )}
          </button>

          {/* Report Viewer */}
          {report && (
            <div className="border border-slate-800 bg-slate-950/80 rounded-2xl overflow-hidden shadow-2xl relative">
              {/* Header bar of the report viewer */}
              <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between gap-4">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block animate-ping"></span>
                  SECURE DRAFT OUTPUT LEDGER
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    id="btn-copy-report"
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-300 transition-all flex items-center gap-1.5 text-[10px] font-mono cursor-pointer"
                    title="Copy Report To Clipboard"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                        COPIED
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        COPY TEXT
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Scrollable Document container */}
              <div className="p-6 max-h-[500px] overflow-y-auto space-y-2 bg-slate-950 text-slate-100 border border-t-0 border-slate-800 rounded-b-2xl">
                {renderMarkdown(report)}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-950/40 border border-dashed border-slate-800 rounded-2xl p-8 text-center">
          <FileText className="w-10 h-10 text-slate-700 mx-auto mb-2.5" />
          <p className="text-sm font-semibold text-slate-300 font-sans">No Project Selected</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-sans leading-relaxed">
            Please choose a project in the **Prioritization Decision Deck** by clicking "Build Proposal" to load telemetry and write administrative request filings.
          </p>
        </div>
      )}
    </div>
  );
};
