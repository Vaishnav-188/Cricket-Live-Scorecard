import React, { useState } from 'react';
import { Match, ShotZone, PitchLengthDelivery } from '../types/cricket';
import { Target, Compass } from 'lucide-react';

interface WagonWheelViewProps {
  match: Match;
}

export const WagonWheelView: React.FC<WagonWheelViewProps> = ({ match }) => {
  const [selectedSector, setSelectedSector] = useState<ShotZone | null>(null);

  const zones = match.wagonWheel;
  const pitchLengths = match.pitchLengths;

  // Off side vs Leg side calculations (for right-hander standard perspective)
  const offSideRuns = zones
    .filter(z => ['Cover', 'Point', 'Third Man', 'Long Off'].includes(z.sector))
    .reduce((acc, z) => acc + z.runs, 0);

  const legSideRuns = zones
    .filter(z => ['Mid Wicket', 'Square Leg', 'Fine Leg', 'Long On'].includes(z.sector))
    .reduce((acc, z) => acc + z.runs, 0);

  const totalRuns = offSideRuns + legSideRuns || 1;
  const offSidePct = Math.round((offSideRuns / totalRuns) * 100);
  const legSidePct = 100 - offSidePct;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-400" />
            Shot Analytics & Wagon Wheel
          </h2>
          <p className="text-xs text-slate-400">
            Field directional dispersion, boundary zones, and pitch delivery lengths
          </p>
        </div>

        {/* Off-side vs Leg-side split */}
        <div className="flex items-center gap-3 p-2 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-slate-400">Off-Side:</span>
            <span className="font-bold text-white">{offSidePct}% ({offSideRuns})</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-400">Leg-Side:</span>
            <span className="font-bold text-white">{legSidePct}% ({legSideRuns})</span>
          </div>
        </div>
      </div>

      {/* Main Grid: SVG Wagon Wheel (Cols 1-7) & Sector Stats (Cols 8-12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Wagon Wheel SVG Illustration */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-4 bg-slate-950 rounded-2xl border border-slate-800 relative">
          <svg
            viewBox="0 0 400 400"
            className="w-full max-w-[340px] sm:max-w-[380px] aspect-square overflow-visible select-none"
          >
            {/* Outfield boundary */}
            <circle cx="200" cy="200" r="180" fill="#064e3b" fillOpacity="0.25" stroke="#10b981" strokeWidth="2" strokeDasharray="4 2" />
            
            {/* 30-yard inner circle */}
            <circle cx="200" cy="200" r="105" fill="#064e3b" fillOpacity="0.15" stroke="#10b981" strokeWidth="1" strokeOpacity="0.4" />

            {/* Pitch rectangle */}
            <rect x="194" y="172" width="12" height="56" rx="2" fill="#d97706" fillOpacity="0.8" stroke="#f59e0b" strokeWidth="1" />
            
            {/* Stumps line */}
            <line x1="192" y1="180" x2="208" y2="180" stroke="#fef3c7" strokeWidth="2" />
            <line x1="192" y1="220" x2="208" y2="220" stroke="#fef3c7" strokeWidth="2" />

            {/* 8 Sector Rays & Labels */}
            {/* 1. Long Off (Top Left) */}
            <line x1="200" y1="200" x2="110" y2="35" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="1.5" />
            {/* 2. Long On (Top Right) */}
            <line x1="200" y1="200" x2="290" y2="35" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1.5" />
            {/* 3. Cover (Far Left) */}
            <line x1="200" y1="200" x2="25" y2="150" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="2" />
            {/* 4. Mid Wicket (Far Right) */}
            <line x1="200" y1="200" x2="375" y2="150" stroke="rgba(16, 185, 129, 0.6)" strokeWidth="2" />
            {/* 5. Point (Bottom Left) */}
            <line x1="200" y1="200" x2="40" y2="270" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="1.5" />
            {/* 6. Square Leg (Bottom Right) */}
            <line x1="200" y1="200" x2="360" y2="270" stroke="rgba(16, 185, 129, 0.5)" strokeWidth="1.5" />
            {/* 7. Third Man (Bottom Left-Center) */}
            <line x1="200" y1="200" x2="110" y2="365" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="1.5" />
            {/* 8. Fine Leg (Bottom Right-Center) */}
            <line x1="200" y1="200" x2="290" y2="365" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1.5" />

            {/* Simulated Dynamic Shot Dots (fours and sixes) */}
            <circle cx="95" cy="115" r="5" fill="#3b82f6"><title>Cover: 4</title></circle>
            <circle cx="65" cy="140" r="7" fill="#8b5cf6"><title>Cover: 6</title></circle>
            <circle cx="80" cy="170" r="5" fill="#3b82f6"><title>Cover: 4</title></circle>
            <circle cx="310" cy="115" r="5" fill="#10b981"><title>Mid-Wicket: 4</title></circle>
            <circle cx="340" cy="145" r="7" fill="#8b5cf6"><title>Mid-Wicket: 6</title></circle>
            <circle cx="330" cy="175" r="7" fill="#8b5cf6"><title>Mid-Wicket: 6</title></circle>
            <circle cx="315" cy="275" r="5" fill="#10b981"><title>Square Leg: 4</title></circle>
            <circle cx="75" cy="265" r="5" fill="#3b82f6"><title>Point: 4</title></circle>
            <circle cx="120" cy="340" r="5" fill="#3b82f6"><title>Third Man: 4</title></circle>
            <circle cx="270" cy="340" r="5" fill="#10b981"><title>Fine Leg: 4</title></circle>

            {/* Boundary sector badges in SVG */}
            <text x="200" y="24" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">STRAIGHT</text>
            <text x="35" y="145" textAnchor="middle" fill="#60a5fa" fontSize="11" fontWeight="bold">Cover</text>
            <text x="365" y="145" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="bold">Mid-Wkt</text>
            <text x="45" y="290" textAnchor="middle" fill="#60a5fa" fontSize="11" fontWeight="bold">Point</text>
            <text x="355" y="290" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="bold">Sq-Leg</text>
            <text x="105" y="388" textAnchor="middle" fill="#60a5fa" fontSize="10">Third Man</text>
            <text x="295" y="388" textAnchor="middle" fill="#34d399" fontSize="10">Fine Leg</text>
          </svg>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-2 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              Four (4)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              Six (6)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Runs (1-3)
            </span>
          </div>
        </div>

        {/* Sectors Breakdown List (Cols 8-12) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider pb-2 border-b border-slate-800">
            <span>Field Sector</span>
            <span>Runs (%)</span>
          </div>

          <div className="space-y-2">
            {zones.map((zone) => (
              <div
                key={zone.sector}
                onMouseEnter={() => setSelectedSector(zone)}
                onMouseLeave={() => setSelectedSector(null)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  selectedSector?.sector === zone.sector
                    ? 'bg-slate-800 border-emerald-500/80 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-200">
                    {zone.sector}
                  </span>
                  <span className="font-mono font-bold text-white tabular-nums">
                    {zone.runs} runs ({zone.percentage}%)
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      ['Cover', 'Point', 'Third Man', 'Long Off'].includes(zone.sector)
                        ? 'bg-blue-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${zone.percentage * 2}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mt-1">
                  <span>{zone.shotsCount} shots</span>
                  <span>{zone.fours} fours · {zone.sixes} sixes</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pitch Length Delivery Heatmap */}
      {pitchLengths && pitchLengths.length > 0 && (
        <div className="pt-6 border-t border-slate-800 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            Bowling Lengths & Pitch Zones (Opponent Bowlers)
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-mono">
            {pitchLengths.map((pl) => (
              <div
                key={pl.zone}
                className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs font-sans font-semibold text-slate-300">
                  <span>{pl.zone}</span>
                  <span className="text-rose-400 font-mono">{pl.wickets} W</span>
                </div>
                <div className="text-xl font-bold text-white tabular-nums">
                  {pl.deliveries} <span className="text-xs text-slate-500 font-sans font-normal">balls</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/80">
                  <span>Runs: {pl.runsConceded}</span>
                  <span className="text-emerald-400">Econ: {pl.economy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
