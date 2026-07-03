import React, { useState, useEffect } from 'react';
import { ProposedProject, PrioritizationWeights } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Sliders, Layers, ArrowUp, ArrowDown, FileText, CheckCircle } from 'lucide-react';

interface PrioritySandboxProps {
  projects: ProposedProject[];
  onSelectProjectForReport: (project: ProposedProject) => void;
  selectedProject: ProposedProject | null;
}

export const PrioritySandbox: React.FC<PrioritySandboxProps> = ({
  projects,
  onSelectProjectForReport,
  selectedProject,
}) => {
  const [weights, setWeights] = useState<PrioritizationWeights>({
    citizenDemand: 0.4,
    infrastructureGap: 0.3,
    demographicNeed: 0.2,
    costEfficiency: 0.1,
  });

  const [sortedProjects, setSortedProjects] = useState<(ProposedProject & { score: number; rankChange: number })[]>([]);

  // Keep track of original ranks (sorted by demandIndex desc as baseline)
  const baselineIds = [...projects]
    .sort((a, b) => b.demandIndex - a.demandIndex)
    .map(p => p.id);

  useEffect(() => {
    // Recalculate scores based on weights
    const calculated = projects.map(proj => {
      // cost factor: lower cost is better efficiency. Normalized out of 100 (range 40 - 120 Lakhs)
      const costFactor = Math.max(0, 100 - ((proj.estimatedCost - 40) / 80) * 100);

      const score = Math.round(
        weights.citizenDemand * proj.demandIndex * 100 +
        weights.infrastructureGap * proj.infrastructureBenefitScore * 100 +
        weights.demographicNeed * proj.demographicNeedScore * 100 +
        weights.costEfficiency * costFactor * 100
      ) / 100;

      return {
        ...proj,
        score,
      };
    });

    // Sort by calculated score desc
    const sorted = calculated.sort((a, b) => b.score - a.score);

    // Calculate rank differences from baseline
    const finalSorted = sorted.map((proj, idx) => {
      const baselineIdx = baselineIds.indexOf(proj.id);
      const currentIdx = idx;
      const rankChange = baselineIdx - currentIdx; // positive is rank improved, negative is rank dropped

      return {
        ...proj,
        rankChange,
      };
    });

    setSortedProjects(finalSorted);
  }, [weights, projects]);

  const handleWeightChange = (key: keyof PrioritizationWeights, value: number) => {
    // Normalize weights so they sum up to 1 approximately, or just update the raw ratio and normalize on fly
    setWeights(prev => {
      const next = { ...prev, [key]: value };
      // Keep it simple: let them slide, and we'll normalize them to sum to 1 before calculating
      const total = next.citizenDemand + next.infrastructureGap + next.demographicNeed + next.costEfficiency;
      if (total === 0) return prev;
      
      return {
        citizenDemand: next.citizenDemand / total,
        infrastructureGap: next.infrastructureGap / total,
        demographicNeed: next.demographicNeed / total,
        costEfficiency: next.costEfficiency / total,
      };
    });
  };

  return (
    <div className="bg-slate-900/65 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-2xl shadow-cyan-950/10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-display font-bold uppercase tracking-wide">
            <Sliders className="w-5 h-5 text-cyan-400" />
            Prioritization Decision Deck
          </div>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Adjust strategic weights below to compute real-time priority scores and re-rank development proposals in real-time.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-3 py-1 rounded-full self-start font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
          DECISION CORE ACTIVE
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-slate-950/60 p-4 border border-slate-800 rounded-xl">
        {/* Slider 1 */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 font-mono uppercase tracking-wide">
            <span>Citizen Density</span>
            <span className="font-mono text-cyan-400 font-bold">{Math.round(weights.citizenDemand * 100)}%</span>
          </div>
          <input
            id="slider-demand"
            type="range"
            min="0"
            max="100"
            value={weights.citizenDemand * 100}
            onChange={(e) => handleWeightChange('citizenDemand', Number(e.target.value) / 100)}
            className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <p className="text-[10px] text-slate-500 font-sans">Citizen submission frequency & urgency</p>
        </div>

        {/* Slider 2 */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 font-mono uppercase tracking-wide">
            <span>Infrastructure Deficit</span>
            <span className="font-mono text-cyan-400 font-bold">{Math.round(weights.infrastructureGap * 100)}%</span>
          </div>
          <input
            id="slider-gap"
            type="range"
            min="0"
            max="100"
            value={weights.infrastructureGap * 100}
            onChange={(e) => handleWeightChange('infrastructureGap', Number(e.target.value) / 100)}
            className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <p className="text-[10px] text-slate-500 font-sans">Physical school, clinic, or utility shortfalls</p>
        </div>

        {/* Slider 3 */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 font-mono uppercase tracking-wide">
            <span>Demographic Need</span>
            <span className="font-mono text-cyan-400 font-bold">{Math.round(weights.demographicNeed * 100)}%</span>
          </div>
          <input
            id="slider-demo"
            type="range"
            min="0"
            max="100"
            value={weights.demographicNeed * 100}
            onChange={(e) => handleWeightChange('demographicNeed', Number(e.target.value) / 100)}
            className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <p className="text-[10px] text-slate-500 font-sans">Emphasis on students, elderly & low-income layers</p>
        </div>

        {/* Slider 4 */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 font-mono uppercase tracking-wide">
            <span>Cost Efficiency</span>
            <span className="font-mono text-cyan-400 font-bold">{Math.round(weights.costEfficiency * 100)}%</span>
          </div>
          <input
            id="slider-cost"
            type="range"
            min="0"
            max="100"
            value={weights.costEfficiency * 100}
            onChange={(e) => handleWeightChange('costEfficiency', Number(e.target.value) / 100)}
            className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <p className="text-[10px] text-slate-500 font-sans">Prioritizes high public benefit per budget Lakh</p>
        </div>
      </div>

      {/* Ranked Proposals List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          RANKED DEVELOPMENT ALLOCATIONS ({sortedProjects.length})
        </h4>

        <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
          <AnimatePresence mode="popLayout">
            {sortedProjects.map((proj, idx) => {
              const isSelected = selectedProject?.id === proj.id;
              
              return (
                <motion.div
                  key={proj.id}
                  id={`project-card-${proj.id}`}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className={`border rounded-xl p-4 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-950/20 to-blue-950/20 border-cyan-500/40 shadow-lg shadow-cyan-500/5'
                      : 'bg-slate-950/40 hover:bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {/* Rank Badge & Project Info */}
                  <div className="flex items-start gap-3.5 flex-1">
                    {/* Rank Circle */}
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-sm font-black text-cyan-400 font-mono shadow-inner">
                        #{idx + 1}
                      </div>
                      
                      {/* Rank shift indicator */}
                      {proj.rankChange > 0 && (
                        <span className="text-[9px] text-cyan-400 font-bold flex items-center mt-1 font-mono">
                          <ArrowUp className="w-2.5 h-2.5 mr-0.5" /> +{proj.rankChange}
                        </span>
                      )}
                      {proj.rankChange < 0 && (
                        <span className="text-[9px] text-rose-500 font-bold flex items-center mt-1 font-mono">
                          <ArrowDown className="w-2.5 h-2.5 mr-0.5" /> {proj.rankChange}
                        </span>
                      )}
                      {proj.rankChange === 0 && (
                        <span className="text-[8px] text-slate-500 font-semibold mt-1 font-mono">
                          STABLE
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-slate-100 font-display tracking-wide">
                          {proj.title}
                        </span>
                        <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                          {proj.ward.toUpperCase()}
                        </span>
                        <span className="text-[9px] bg-cyan-950/50 text-cyan-400 px-2 py-0.5 border border-cyan-800/40 rounded font-mono uppercase font-bold">
                          {proj.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-sans leading-relaxed line-clamp-2">
                        {proj.description}
                      </p>
                      
                      {/* Core Metrics Summary row */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1.5 text-[10px] text-slate-500 font-mono">
                        <span>CITIZEN FEEDBACKS: <strong className="text-slate-300">{proj.citizenSubmissionsCount}</strong></span>
                        <span>DEMAND RANK: <strong className="text-cyan-400 font-bold">{proj.demandIndex}/100</strong></span>
                        <span>GAP REDUCTION BENEFIT: <strong className="text-slate-300">{proj.infrastructureBenefitScore}/100</strong></span>
                        <span>ESTIMATED COST: <strong className="text-yellow-500 font-bold">₹{proj.estimatedCost} LAKHS</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Priority score & action btn */}
                  <div className="flex md:flex-col items-center justify-between md:items-end gap-3 md:justify-center pl-10 md:pl-0 border-t md:border-t-0 md:border-l border-slate-800/80 md:pl-4 pt-3 md:pt-0">
                    <div className="text-left md:text-right">
                      <span className="text-[9px] text-slate-500 uppercase tracking-wider font-mono">Priority Index</span>
                      <p className="text-2xl font-black font-mono text-cyan-400 leading-none">
                        {proj.score.toFixed(1)}
                      </p>
                    </div>

                    <button
                      id={`btn-action-report-${proj.id}`}
                      onClick={() => onSelectProjectForReport(proj)}
                      className={`px-3 py-1.5 text-[11px] font-sans font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/10'
                          : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-cyan-300" />
                          Selected
                        </>
                      ) : (
                        <>
                          <FileText className="w-3.5 h-3.5" />
                          Build Proposal
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
