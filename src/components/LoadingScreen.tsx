import { PointStars } from './PointStars';
import { ShootingStars } from './ShootingStars';
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const times = [
      { p: 0, t: 0 },
      { p: 20, t: 600 },
      { p: 50, t: 1500 },
      { p: 80, t: 2400 },
      { p: 100, t: 3000 }
    ];

    times.forEach(({ p, t }) => {
      setTimeout(() => setProgress(p), t);
    });
  }, []);

  return (
    <div id="auth-screen-container" className="min-h-screen bg-[#060608] flex flex-col justify-center items-center text-slate-100 font-sans p-4 relative overflow-hidden">
      <PointStars />
      <ShootingStars />
      
      {/* Decorative vector background meshes */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-fuchsia-900/30 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-900/30 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-900/20 rounded-full blur-[160px] pointer-events-none -z-10" />
      
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex items-end gap-3">
            <h1 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-violet-500 tracking-widest font-mono uppercase">
              Initializing
            </h1>
            <span className="text-sm font-mono text-fuchsia-400 font-bold mb-0.5 w-10">{progress}%</span>
          </div>
          <div className="h-1.5 w-48 bg-zinc-800 rounded-full overflow-hidden relative">
            <motion.div 
              initial={{ width: '0%' }}
              animate={{ width: ['0%', '20%', '50%', '80%', '100%'] }}
              transition={{ duration: 3, times: [0, 0.2, 0.5, 0.8, 1], ease: "easeInOut" }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
