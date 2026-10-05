import React, { useState } from 'react';
import { CommentaryBall } from '../types/cricket';
import { Gauge, Filter } from 'lucide-react';

interface CommentaryViewProps {
  commentary: CommentaryBall[];
}

export const CommentaryView: React.FC<CommentaryViewProps> = ({ commentary }) => {
  const [filter, setFilter] = useState<'all' | 'wickets' | 'boundaries'>('all');

  const filtered = commentary.filter((item) => {
    if (filter === 'wickets') return item.outcomeType === 'wicket';
    if (filter === 'boundaries') return item.outcomeType === 'four' || item.outcomeType === 'six';
    return true;
  });

  const getBadgeStyle = (outcome: string) => {
    switch (outcome) {
      case 'wicket':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/50';
      case 'six':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/50';
      case 'four':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      case 'single':
      case 'two':
      case 'three':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 lg:p-6 space-y-5">
      {/* Commentary Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Live Ball-by-Ball Commentary
          </h2>
          <p className="text-xs text-slate-400">
            Real-time delivery telecast with ball tracking & field reports
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800/80">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              filter === 'all'
                ? 'bg-slate-800 text-emerald-400 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Balls ({commentary.length})
          </button>
          <button
            onClick={() => setFilter('wickets')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              filter === 'wickets'
                ? 'bg-slate-800 text-rose-400 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Wickets
          </button>
          <button
            onClick={() => setFilter('boundaries')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              filter === 'boundaries'
                ? 'bg-slate-800 text-blue-400 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Boundaries (4s & 6s)
          </button>
        </div>
      </div>

      {/* Commentary Timeline */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border transition-all ${
                item.outcomeType === 'wicket'
                  ? 'bg-rose-950/20 border-rose-800/40'
                  : item.outcomeType === 'four' || item.outcomeType === 'six'
                  ? 'bg-slate-950/60 border-slate-800'
                  : 'bg-slate-950/40 border-slate-800/60'
              }`}
            >
              <div className="flex items-start gap-3.5">
                {/* Over & Outcome Badge */}
                <div className="flex flex-col items-center shrink-0">
                  <span className="font-mono text-sm font-bold text-slate-300">
                    {item.over}
                  </span>
                  <span
                    className={`mt-1 w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs border ${getBadgeStyle(
                      item.outcomeType
                    )}`}
                  >
                    {item.shortText}
                  </span>
                </div>

                {/* Commentary text */}
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-sm text-slate-100">
                      {item.bowlerName && item.batterName ? (
                        <>
                          <span className="text-slate-300">{item.bowlerName}</span> to{' '}
                          <span className="text-slate-200">{item.batterName}</span>,{' '}
                          <span className={item.outcomeType === 'wicket' ? 'text-rose-400' : item.outcomeType === 'four' || item.outcomeType === 'six' ? 'text-emerald-400' : 'text-slate-300'}>
                            {item.headline}
                          </span>
                        </>
                      ) : (
                        item.headline
                      )}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                      {item.speedKmh && (
                        <span className="flex items-center gap-1 text-slate-400">
                          <Gauge className="w-3 h-3 text-slate-500" />
                          {item.speedKmh} km/h
                        </span>
                      )}
                      <span>{item.timestamp}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-slate-500 text-sm italic border border-dashed border-slate-800 rounded-xl">
            No deliveries match the selected filter.
          </div>
        )}
      </div>
    </div>
  );
};
