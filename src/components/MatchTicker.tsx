import React from 'react';
import { Match, MatchFormat } from '../types/cricket';
import { Flame, Clock, CheckCircle2 } from 'lucide-react';

interface MatchTickerProps {
  matches: Match[];
  selectedMatchId: string;
  onSelectMatch: (matchId: string) => void;
  formatFilter: string;
  setFormatFilter: (filter: string) => void;
}

export const MatchTicker: React.FC<MatchTickerProps> = ({
  matches,
  selectedMatchId,
  onSelectMatch,
  formatFilter,
  setFormatFilter,
}) => {
  const filterTabs = [
    { id: 'ALL', label: 'All Matches' },
    { id: 'LIVE', label: 'Live Now' },
    { id: 'Test', label: 'Test' },
    { id: 'T20', label: 'T20 & Leagues' },
    { id: 'ODI', label: 'ODI' },
  ];

  const filteredMatches = matches.filter((m) => {
    if (formatFilter === 'LIVE') return m.status === 'LIVE';
    if (formatFilter === 'Test') return m.format === 'Test';
    if (formatFilter === 'T20') return m.format === 'T20';
    if (formatFilter === 'ODI') return m.format === 'ODI';
    return true;
  });

  return (
    <div className="bg-slate-900/90 border-b border-slate-800">
      {/* Sub-bar with format selectors & live counts */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-2 flex items-center justify-between gap-4 overflow-x-auto">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2 hidden sm:inline">
            Matches
          </span>
          {filterTabs.map((tab) => {
            const isSelected = formatFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFormatFilter(tab.id)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'bg-slate-800 text-emerald-400 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center gap-3 text-xs text-slate-400 shrink-0">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            3 Matches in Play
          </span>
          <span className="text-slate-600">·</span>
          <span>SCG · Kensington Oval · Chepauk · MCG</span>
        </div>
      </div>

      {/* Horizontal Matches Carousel */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3">
        <div className="flex gap-3 overflow-x-auto pb-1 scroll-smooth">
          {filteredMatches.map((m) => {
            const isSelected = m.id === selectedMatchId;
            const isLive = m.status === 'LIVE';
            const isCompleted = m.status === 'COMPLETED';

            return (
              <button
                key={m.id}
                onClick={() => onSelectMatch(m.id)}
                className={`w-[290px] sm:w-[320px] shrink-0 text-left p-3.5 rounded-xl border transition-all text-xs focus:outline-none ${
                  isSelected
                    ? 'bg-slate-800/90 border-emerald-500/80 shadow-md shadow-emerald-950/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                {/* Card Header metadata */}
                <div className="flex items-center justify-between gap-2 mb-2 text-[11px] text-slate-400">
                  <span className="truncate font-medium text-slate-300">
                    {m.matchTitle.split('·')[0]}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isLive && (
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold uppercase tracking-wider text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        LIVE
                      </span>
                    )}
                    {isCompleted && (
                      <span className="text-slate-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500/80" />
                        FT
                      </span>
                    )}
                    {m.status === 'UPCOMING' && (
                      <span className="text-amber-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        14:00
                      </span>
                    )}
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400 uppercase font-mono">{m.format}</span>
                  </div>
                </div>

                {/* Team A row */}
                <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: m.teamA.primaryColor }}
                    />
                    <span className={`font-semibold ${m.teamA.isBatting ? 'text-white' : 'text-slate-300'}`}>
                      {m.teamA.name}
                    </span>
                    {m.teamA.isBatting && (
                      <span className="text-[10px] text-emerald-400 font-mono">*</span>
                    )}
                  </div>
                  <span className="font-mono font-bold text-slate-100 tabular-nums">
                    {m.teamA.score}
                  </span>
                </div>

                {/* Team B row */}
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: m.teamB.primaryColor }}
                    />
                    <span className={`font-semibold ${m.teamB.isBatting ? 'text-white' : 'text-slate-300'}`}>
                      {m.teamB.name}
                    </span>
                    {m.teamB.isBatting && (
                      <span className="text-[10px] text-emerald-400 font-mono">*</span>
                    )}
                  </div>
                  <span className="font-mono font-bold text-slate-100 tabular-nums">
                    {m.teamB.score}
                  </span>
                </div>

                {/* Live context summary note */}
                <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between gap-1 text-[11px]">
                  <p className="text-emerald-400 font-medium truncate">
                    {m.statusText}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
