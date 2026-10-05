import React, { useState } from 'react';
import { STANDINGS_DATA } from '../data/cricketData';
import { Trophy } from 'lucide-react';

export const StandingsView: React.FC = () => {
  const [activeTournament, setActiveTournament] = useState<'wtc' | 't20wc' | 'ipl'>('wtc');

  const tournaments = [
    { id: 'wtc', label: 'ICC World Test Championship' },
    { id: 't20wc', label: 'T20 World Cup Super 8' },
    { id: 'ipl', label: 'Indian Premier League' },
  ];

  const currentTable = STANDINGS_DATA[activeTournament] || [];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 lg:p-6 space-y-6">
      {/* Header and Tournament Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Trophy className="w-4 h-4 text-emerald-400" />
            Tournament Standings & Series Table
          </h2>
          <p className="text-xs text-slate-400">
            Global championship qualification races, net run rates, and recent form
          </p>
        </div>

        {/* Tournament selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
          {tournaments.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTournament(t.id as 'wtc' | 't20wc' | 'ipl')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTournament === t.id
                  ? 'bg-slate-800 text-emerald-400 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-xs text-slate-400 font-semibold bg-slate-950/40">
              <th className="py-2.5 px-3">#</th>
              <th className="py-2.5 px-3">Team</th>
              <th className="py-2.5 px-2 text-right">P</th>
              <th className="py-2.5 px-2 text-right">W</th>
              <th className="py-2.5 px-2 text-right">L</th>
              <th className="py-2.5 px-2 text-right">T/D</th>
              <th className="py-2.5 px-3 text-right">NRR / PCT</th>
              <th className="py-2.5 px-3 text-right">PTS</th>
              <th className="py-2.5 px-3 text-center">Form</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {currentTable.map((team) => (
              <tr key={team.rank} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-3 text-slate-500 font-semibold">
                  {team.rank}
                </td>
                <td className="py-3 px-3 font-sans font-semibold text-white">
                  <div className="flex items-center gap-2">
                    <span>{team.teamName}</span>
                    <span className="text-xs text-slate-500 font-mono">
                      {team.shortCode}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-2 text-right text-slate-300 tabular-nums">
                  {team.played}
                </td>
                <td className="py-3 px-2 text-right text-emerald-400 font-semibold tabular-nums">
                  {team.won}
                </td>
                <td className="py-3 px-2 text-right text-rose-400 tabular-nums">
                  {team.lost}
                </td>
                <td className="py-3 px-2 text-right text-slate-400 tabular-nums">
                  {team.tied}
                </td>
                <td className="py-3 px-3 text-right text-slate-200 font-medium tabular-nums">
                  {team.pointsPercentage || team.netRunRate}
                </td>
                <td className="py-3 px-3 text-right font-bold text-white text-base tabular-nums">
                  {team.points}
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center justify-center gap-1">
                    {team.form.map((res, i) => (
                      <span
                        key={i}
                        className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
                          res === 'W'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : res === 'L'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {res}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pt-2 text-xs text-slate-500">
        Top 2 teams qualify for the Grand Final / Knockout Stage. Points and NRR updated in real time upon official match sign-off.
      </div>
    </div>
  );
};
