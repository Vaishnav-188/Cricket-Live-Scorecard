import React from 'react';
import { Match, Partnership } from '../types/cricket';
import { TrendingUp, Users } from 'lucide-react';

interface AnalyticsViewProps {
  match: Match;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ match }) => {
  const wormData = match.wormData;
  const partnerships = match.partnerships;

  // Calculate SVG bounds for Worm Graph
  const maxOver = Math.max(...wormData.map(d => d.over), 50);
  const maxScore = Math.max(
    ...wormData.map(d => Math.max(d.teamAScore, d.teamBScore || 0)),
    300
  );

  const getX = (over: number) => 50 + (over / maxOver) * 500;
  const getY = (score: number) => 220 - (score / maxScore) * 190;

  // Build SVG path strings
  const teamAPath = wormData
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(d.over)} ${getY(d.teamAScore)}`)
    .join(' ');

  const teamBPoints = wormData.filter(d => d.teamBScore !== undefined);
  const teamBPath = teamBPoints
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(d.over)} ${getY(d.teamBScore!)}`)
    .join(' ');

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 lg:p-6 space-y-8">
      {/* Worm Graph Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Innings Progression (The Worm)
            </h2>
            <p className="text-xs text-slate-400">
              Comparative cumulative run chase and wicket trajectory
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-emerald-400 rounded-full" />
              <span className="text-slate-200">{match.teamA.name} ({match.teamA.currentRuns})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-amber-400 rounded-full" />
              <span className="text-slate-200">{match.teamB.name} ({match.teamB.currentRuns})</span>
            </div>
          </div>
        </div>

        {/* Worm SVG Graph */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto">
          <svg viewBox="0 0 600 250" className="w-full min-w-[500px] h-64 overflow-visible">
            {/* Horizontal Grid lines */}
            {[0, 50, 100, 150, 200, 250, 300].map((score) => {
              if (score > maxScore) return null;
              const y = getY(score);
              return (
                <g key={score}>
                  <line x1="50" y1={y} x2="570" y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                  <text x="40" y={y + 4} textAnchor="end" fill="#64748b" fontSize="10" fontFamily="monospace">
                    {score}
                  </text>
                </g>
              );
            })}

            {/* Over markers along X axis */}
            {[10, 20, 30, 40, 50, 60, 70, 80].map((ov) => {
              if (ov > maxOver) return null;
              const x = getX(ov);
              return (
                <g key={ov}>
                  <line x1={x} y1="20" x2={x} y2="220" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                  <text x={x} y="238" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">
                    Ov {ov}
                  </text>
                </g>
              );
            })}

            {/* Team B Curve (Chased or target) */}
            {teamBPoints.length > 0 && (
              <path
                d={teamBPath}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Team A Curve (Batting now) */}
            <path
              d={teamAPath}
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points & Wickets */}
            {wormData.map((d) => {
              const x = getX(d.over);
              const yA = getY(d.teamAScore);
              const hasWicket = (d.teamAWickets || 0) > 0;
              return (
                <g key={d.over}>
                  <circle cx={x} cy={yA} r={hasWicket ? 5 : 3.5} fill="#10b981" stroke="#064e3b" strokeWidth="1.5" />
                  {hasWicket && (
                    <text x={x} y={yA - 8} textAnchor="middle" fill="#f43f5e" fontSize="9" fontWeight="bold" fontFamily="monospace">
                      W
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Partnerships Section */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            Key Partnerships
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            Current Innings Stand
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {partnerships.map((p, idx) => {
            const b1Pct = Math.round((p.batter1Runs / (p.totalRuns || 1)) * 100);
            const b2Pct = 100 - b1Pct;

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border space-y-3 ${
                  p.isCurrent
                    ? 'bg-slate-950/90 border-emerald-500/60 shadow-md shadow-emerald-950/20'
                    : 'bg-slate-950/50 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-lg font-mono tabular-nums">
                      {p.totalRuns} runs
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      ({p.totalBalls} balls)
                    </span>
                  </div>
                  {p.isCurrent && (
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      CURRENT STAND
                    </span>
                  )}
                </div>

                {/* Contribution bar */}
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden flex">
                  <div className="bg-emerald-500 h-full transition-all" style={{ width: `${b1Pct}%` }} />
                  <div className="bg-blue-500 h-full transition-all" style={{ width: `${b2Pct}%` }} />
                </div>

                {/* Batters breakdown */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="space-y-0.5">
                    <span className="text-slate-300 font-sans font-semibold truncate block">
                      {p.batter1Name}
                    </span>
                    <span className="text-emerald-400 font-bold">
                      {p.batter1Runs} <span className="text-slate-500 font-normal">({p.batter1Balls}b)</span>
                    </span>
                  </div>
                  <div className="text-right space-y-0.5">
                    <span className="text-slate-300 font-sans font-semibold truncate block">
                      {p.batter2Name}
                    </span>
                    <span className="text-blue-400 font-bold">
                      {p.batter2Runs} <span className="text-slate-500 font-normal">({p.batter2Balls}b)</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
