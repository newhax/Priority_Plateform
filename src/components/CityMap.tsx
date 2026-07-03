import React, { useState } from 'react';
import { WardData } from '../types';

interface CityMapProps {
  wards: WardData[];
  selectedWardId: string | null;
  onSelectWard: (wardId: string | null) => void;
  submissionCounts: Record<string, number>;
  cityName: string;
}

type HeatmapMetric = 'submissions' | 'schools' | 'clinics' | 'water';

export const CityMap: React.FC<CityMapProps> = ({
  wards,
  selectedWardId,
  onSelectWard,
  submissionCounts,
  cityName,
}) => {
  const [metric, setMetric] = useState<HeatmapMetric>('submissions');

  // SVG parameters for 8 sectors arranged organically (Wards of Thiruvananthapuram)
  // We'll define paths or polygons representing our 8 wards.
  const wardPositions: Record<string, { d: string; labelX: number; labelY: number }> = {
    kazhakkoottam: {
      d: "M 80 40 L 180 30 L 210 90 L 110 100 Z",
      labelX: 145,
      labelY: 65,
    },
    ulloor: {
      d: "M 110 100 L 210 90 L 240 140 L 140 150 Z",
      labelX: 175,
      labelY: 120,
    },
    medical_college: {
      d: "M 140 150 L 240 140 L 260 190 L 160 200 Z",
      labelX: 200,
      labelY: 175,
    },
    vattiyoorkavu: {
      d: "M 210 90 L 320 80 L 330 150 L 240 140 Z",
      labelX: 275,
      labelY: 115,
    },
    vazhuthacaud: {
      d: "M 160 200 L 260 190 L 280 250 L 180 260 Z",
      labelX: 220,
      labelY: 225,
    },
    nemom: {
      d: "M 260 190 L 350 180 L 360 270 L 280 250 Z",
      labelX: 310,
      labelY: 230,
    },
    kovalam: {
      d: "M 90 260 L 180 260 L 160 340 L 70 340 Z",
      labelX: 125,
      labelY: 300,
    },
    vizhinjam: {
      d: "M 180 260 L 280 250 L 240 340 L 160 340 Z",
      labelX: 215,
      labelY: 300,
    },
  };

  // Helper to determine heat color
  const getColor = (wardId: string) => {
    const ward = wards.find(w => w.id === wardId);
    if (!ward) return 'fill-slate-950 stroke-slate-800';

    let value = 0;
    let max = 1;

    switch (metric) {
      case 'submissions':
        value = submissionCounts[wardId] || 0;
        max = Math.max(...(Object.values(submissionCounts) as number[]), 1);
        break;
      case 'schools':
        value = ward.infrastructureGaps.schools;
        max = 10;
        break;
      case 'clinics':
        value = ward.infrastructureGaps.clinics;
        max = 10;
        break;
      case 'water':
        value = ward.infrastructureGaps.waterAccess;
        max = 40;
        break;
    }

    const ratio = value / max;

    // Tactical Cyber Heat Glow levels matching the Kerala Police HackP dashboard
    if (ratio < 0.3) {
      return 'fill-cyan-950/40 hover:fill-cyan-900/50 stroke-cyan-500/40';
    } else if (ratio < 0.65) {
      return 'fill-[#3d2109]/35 hover:fill-[#4a2b10]/45 stroke-amber-500/40';
    } else {
      return 'fill-[#4c0519]/35 hover:fill-[#5c0920]/45 stroke-rose-500/40';
    }
  };

  const getMetricValueString = (ward: WardData) => {
    switch (metric) {
      case 'submissions':
        return `${submissionCounts[ward.id] || 0} Registered Suggestion(s)`;
      case 'schools':
        return `Education Deficit Score: ${ward.infrastructureGaps.schools}/10`;
      case 'clinics':
        return `Clinic Infrastructure Deficit: ${ward.infrastructureGaps.clinics}/10`;
      case 'water':
        return `Unpiped Water Deficit: ${ward.infrastructureGaps.waterAccess}% of region`;
    }
  };

  return (
    <div className="bg-slate-900/65 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-2xl shadow-cyan-950/10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 font-display tracking-wide uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            Spatial Control Analysis Grid
          </h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            {cityName} divisions. Tap sector to isolate local tactical matrix & demand quotients.
          </p>
        </div>
        
        {/* Heatmap Metric Selector */}
        <div className="flex flex-wrap gap-1 bg-slate-950/80 p-1 border border-slate-800 rounded-lg self-start">
          {(['submissions', 'schools', 'clinics', 'water'] as HeatmapMetric[]).map((m) => (
            <button
              key={m}
              id={`map-btn-${m}`}
              onClick={() => setMetric(m)}
              className={`px-3 py-1 text-[10px] font-bold font-mono rounded-md transition-all cursor-pointer ${
                metric === m
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-cyan-400 hover:bg-slate-900/80'
              }`}
            >
              {m === 'submissions' && 'SUBMISSIONS'}
              {m === 'schools' && 'EDUCATION'}
              {m === 'clinics' && 'HEALTH PHC'}
              {m === 'water' && 'WATER SUPPLY'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* SVG Map Render */}
        <div className="md:col-span-7 flex justify-center bg-slate-950/80 p-4 border border-slate-800/60 rounded-xl relative overflow-hidden cyber-grid">
          {/* Futuristic radar-like scanner effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/0 via-cyan-500/2 to-cyan-500/0 pointer-events-none h-full w-full animate-pulse" />
          
          <svg
            viewBox="0 0 400 380"
            className="w-full max-w-[340px] h-auto drop-shadow-[0_0_20px_rgba(6,182,212,0.05)]"
          >
            {/* Coastline visual embellishment */}
            <path
              d="M 40 10 Q 50 180 30 370"
              fill="none"
              stroke="rgba(6, 182, 212, 0.2)"
              strokeWidth="3"
              strokeDasharray="5 5"
            />
            <text x="15" y="190" fill="rgba(6, 182, 212, 0.3)" className="text-[9px] font-mono select-none uppercase tracking-widest font-bold" transform="rotate(-90 15 190)">
              Laccadive Coastline
            </text>

            <g strokeWidth="1.5" className="cursor-pointer transition-all duration-300">
              {wards.map((ward, index) => {
                const keys = Object.keys(wardPositions);
                const posKey = keys[index % keys.length];
                const pos = wardPositions[posKey];
                if (!pos) return null;
                const isSelected = selectedWardId === ward.id;

                return (
                  <g key={ward.id} onClick={() => onSelectWard(isSelected ? null : ward.id)}>
                    <path
                      id={`ward-path-${ward.id}`}
                      d={pos.d}
                      className={`transition-all duration-300 ${getColor(ward.id)} ${
                        isSelected
                          ? 'stroke-cyan-400 stroke-[3px] filter drop-shadow-[0_0_12px_rgba(6,182,212,0.6)] scale-[1.01] origin-center z-10'
                          : 'stroke-slate-950 hover:stroke-slate-700'
                      }`}
                    />
                    {/* Ward label overlay */}
                    <text
                      x={pos.labelX}
                      y={pos.labelY}
                      className="text-[9px] font-bold font-mono tracking-wider pointer-events-none select-none text-center"
                      textAnchor="middle"
                      fill={isSelected ? '#22d3ee' : '#94a3b8'}
                    >
                      {ward.name.split(' ')[0].toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Interactive Map Reset overlay if filtered */}
          {selectedWardId && (
            <button
              id="clear-map-filter"
              onClick={() => onSelectWard(null)}
              className="absolute bottom-2 right-2 px-2.5 py-1 text-[10px] bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 hover:border-slate-700 rounded-md shadow-lg font-mono cursor-pointer transition-all"
            >
              RESET FILTER [X]
            </button>
          )}
        </div>

        {/* Legend & Quick Statistics */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800 text-xs space-y-2.5">
            <h4 className="font-bold text-slate-400 font-mono uppercase tracking-widest text-[9px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              Spectrum Ledger
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-2 text-slate-300 font-mono">
                  <span className="w-3.5 h-3.5 rounded bg-cyan-950/40 border border-cyan-500/40 block"></span>
                  Optimal Needs Met (Low Gap)
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-2 text-slate-300 font-mono">
                  <span className="w-3.5 h-3.5 rounded bg-[#3d2109]/35 border border-amber-500/40 block"></span>
                  Moderate Demands Identified
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-2 text-slate-300 font-mono">
                  <span className="w-3.5 h-3.5 rounded bg-[#4c0519]/35 border border-rose-500/40 block"></span>
                  Critical Shortage (Urgent Grid)
                </span>
              </div>
            </div>
          </div>

          {/* Ward Quick Card if Hovered or Clicked */}
          {selectedWardId ? (
            (() => {
              const activeWard = wards.find(w => w.id === selectedWardId);
              if (!activeWard) return null;
              return (
                <div className="bg-gradient-to-b from-[#09152b] to-[#040815] border border-cyan-500/30 rounded-xl p-4 space-y-3 shadow-lg shadow-cyan-500/5 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <span className="font-display font-extrabold text-cyan-400 text-sm tracking-wide">
                      {activeWard.name.toUpperCase()}
                    </span>
                    <span className="text-[9px] bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                      SELECTED
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div>
                      <p className="text-slate-400 font-mono">POPULATION MATRIX:</p>
                      <p className="text-slate-100 font-bold text-xs mt-0.5">{activeWard.population.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-mono">AVERAGE INCOME:</p>
                      <p className="text-slate-100 font-bold text-xs mt-0.5">{activeWard.avgIncome}</p>
                    </div>
                  </div>
                  <div className="border-t border-slate-800/80 pt-2">
                    <p className="text-[9px] text-slate-400 font-mono uppercase tracking-wider mb-1">
                      ACTIVE GAP METRIC VALUE:
                    </p>
                    <p className="text-cyan-300 font-mono font-bold text-xs tracking-wide">
                      {getMetricValueString(activeWard)}
                    </p>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="bg-slate-950/40 border border-dashed border-slate-800 rounded-xl p-4 text-center">
              <p className="text-[11px] text-slate-400 font-sans italic leading-relaxed">
                Click any sector on the spatial grid to inspect real-time civic demands, demographic quotients, and local infrastructure gaps.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
