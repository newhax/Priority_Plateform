import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050505] border-t border-zinc-800/60 py-10 px-6 mt-auto text-xs text-slate-500 font-sans relative z-10 w-full">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
        
        <div className="flex flex-col items-center md:items-start space-y-3">
          <p className="font-bold text-slate-300">© 2026 Team NEXUS. All rights reserved.</p>
          <p className="max-w-xs text-center md:text-left leading-relaxed text-slate-500">
            Empowering citizens through AI-driven legislative technology. All datasets secured by advanced clearance protocols.
          </p>
          <div className="flex items-center gap-4 pt-2 font-medium">
            <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
            <span className="w-1 h-1 rounded-full bg-zinc-700" />
            <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
            <span className="w-1 h-1 rounded-full bg-zinc-700" />
            <a href="#" className="hover:text-cyan-400 transition-colors">Cookie Policy</a>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end text-center md:text-right space-y-1.5">
          <p className="text-slate-400">Made with <span className="text-rose-500 animate-pulse inline-block">❤</span></p>
          <p className="text-slate-400 font-mono tracking-tight">In Greater Noida</p>
          <p className="text-slate-300 font-bold tracking-widest uppercase text-[10px] mt-1 text-cyan-400/90">By team NEXUS</p>
        </div>

      </div>
    </footer>
  );
};
