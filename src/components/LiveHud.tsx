import React from 'react';
import { Match, BatterScore, BowlerFigure } from '../types/cricket';
import { Radio, Play, Pause, RotateCcw, Zap } from 'lucide-react';

interface LiveHudProps {
  match: Match;
  onSimulateBall: () => void;
  isAutoPlaying: boolean;
  setIsAutoPlaying: (val: boolean | ((prev: boolean) => boolean)) => void;
  lastEventHeadline?: string;
  onResetMatch?: () => void;
}

export const LiveHud: React.FC<LiveHudProps> = ({
  match,
  onSimulateBall,
  isAutoPlaying,
  setIsAutoPlaying,
  lastEventHeadline,
  onResetMatch,
}) => {
  const [batter1, batter2] = match.currentBatters;
  const bowler = match.currentBowler;

  const getDeliveryColor = (code: string) => {
    if (code === 'W') return 'bg-rose-500/20 text-rose-300 border-rose-500/60 font-bold';
    if (code === '6') return 'bg-purple-500/20 text-purple-300 border-purple-500/60 font-bold';
    if (code === '4') return 'bg-blue-500/20 text-blue-300 border-blue-500/60 font-bold';
    if (code === '1' || code === '2' || code === '3') return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40';
    if (code.includes('wd') || code.includes('nb')) return 'bg-amber-500/20 text-amber-300 border-amber-500/50';
    return 'bg-slate-800 text-slate-400 border-slate-700'; // dot
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 lg:p-6 space-y-6">
      {/* Top Banner: Interactive Live Controls & Last Ball Headline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
            <Zap className="w-4 h-4 text-emerald-400" />
            Live Pitch Telemetry
          </span>
          {lastEventHeadline && (
            <span className="hidden md:inline-block text-xs font-medium text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700 truncate max-w-md">
              {lastEventHeadline}
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {match.status === 'LIVE' ? (
            <>
              <button
                onClick={onSimulateBall}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-lg shadow-sm transition-all whitespace-nowrap"
              >
                <Radio className="w-3.5 h-3.5" />
                Simulate Next Ball
              </button>

              <button
                onClick={() => setIsAutoPlaying(prev => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all whitespace-nowrap ${
                  isAutoPlaying
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {isAutoPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-amber-400" />
                    Pause Live
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-slate-400" />
                    Auto Stream
                  </>
                )}
              </button>
            </>
          ) : (
            <span className="text-xs text-slate-500 italic">
              Match concluded · Telemetry recorded
            </span>
          )}

          {onResetMatch && (
            <button
              onClick={onResetMatch}
              title="Reset match data"
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Grid: Batters vs Bowler */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Batters Table (Cols 1-7) */}
        <div className="lg:col-span-7">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
            Batters at Crease
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-xs text-slate-500 font-medium">
                  <th className="pb-2">Batter</th>
                  <th className="pb-2 text-right">R</th>
                  <th className="pb-2 text-right">B</th>
                  <th className="pb-2 text-right">4s</th>
                  <th className="pb-2 text-right">6s</th>
                  <th className="pb-2 text-right">SR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {[batter1, batter2].map((bat: BatterScore, idx: number) => {
                  if (!bat) return null;
                  const isStriker = bat.isOnStrike ?? (idx === 0);
                  return (
                    <tr key={bat.id || idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 pr-2 font-sans">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-semibold ${isStriker ? 'text-emerald-400' : 'text-slate-200'}`}>
                            {bat.name}
                          </span>
                          {isStriker && (
                            <span className="text-emerald-400 font-bold text-xs" title="On Strike">
                              *
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 font-sans block">
                          {bat.role || 'Batter'}
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-bold text-white text-base tabular-nums">
                        {bat.runs}
                      </td>
                      <td className="py-2.5 text-right text-slate-400 tabular-nums">
                        {bat.balls}
                      </td>
                      <td className="py-2.5 text-right text-slate-400 tabular-nums">
                        {bat.fours}
                      </td>
                      <td className="py-2.5 text-right text-slate-400 tabular-nums">
                        {bat.sixes}
                      </td>
                      <td className="py-2.5 text-right text-slate-300 font-medium tabular-nums">
                        {bat.strikeRate.toFixed(1)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bowler Stats (Cols 8-12) */}
        <div className="lg:col-span-5 lg:border-l lg:border-slate-800 lg:pl-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
            Active Bowler
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-xs text-slate-500 font-medium">
                  <th className="pb-2">Bowler</th>
                  <th className="pb-2 text-right">O</th>
                  <th className="pb-2 text-right">M</th>
                  <th className="pb-2 text-right">R</th>
                  <th className="pb-2 text-right">W</th>
                  <th className="pb-2 text-right">ECON</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {bowler && (
                  <tr className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 pr-2 font-sans font-semibold text-slate-200">
                      {bowler.name}
                      <span className="text-[11px] text-slate-500 font-sans block">
                        Dots: {bowler.dots}
                      </span>
                    </td>
                    <td className="py-2.5 text-right text-slate-300 tabular-nums">
                      {bowler.overs}
                    </td>
                    <td className="py-2.5 text-right text-slate-400 tabular-nums">
                      {bowler.maidens}
                    </td>
                    <td className="py-2.5 text-right text-slate-300 tabular-nums">
                      {bowler.runs}
                    </td>
                    <td className="py-2.5 text-right font-bold text-rose-400 text-base tabular-nums">
                      {bowler.wickets}
                    </td>
                    <td className="py-2.5 text-right text-slate-300 font-medium tabular-nums">
                      {bowler.economy.toFixed(2)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Current Over Deliveries Visualizer */}
      <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            This Over:
          </span>
          <div className="flex items-center gap-2">
            {match.currentOverDeliveries.length > 0 ? (
              match.currentOverDeliveries.map((del, i) => (
                <div
                  key={i}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono border transition-all ${getDeliveryColor(
                    del.code
                  )}`}
                  title={`Ball ${del.ball}: ${del.runs} run${del.runs === 1 ? '' : 's'}`}
                >
                  {del.code}
                </div>
              ))
            ) : (
              <span className="text-xs text-slate-500 font-mono italic">
                Over starting...
              </span>
            )}
          </div>
        </div>

        {/* Recent Overs Summary */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono">
          <span className="text-slate-500">Recent:</span>
          {match.recentOversSummary.slice(-3).map((item, idx) => (
            <span key={idx} className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800/80">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
