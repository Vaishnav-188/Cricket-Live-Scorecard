import React from 'react';
import { Match, PlayerProfile } from '../types/cricket';
import { Shield, Award, Swords } from 'lucide-react';

interface SquadsViewProps {
  match: Match;
}

export const SquadsView: React.FC<SquadsViewProps> = ({ match }) => {
  const { teamA, teamB } = match.squads;
  const h2h = match.headToHead;

  const renderPlayerRow = (player: PlayerProfile) => (
    <div
      key={player.id}
      className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm"
          style={{ backgroundColor: player.avatarColor }}
        >
          {player.name.charAt(0)}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm text-slate-100">
              {player.name}
            </span>
            {player.isCaptain && (
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-1.5 py-0.2 rounded border border-amber-500/30">
                C
              </span>
            )}
            {player.isKeeper && (
              <span className="text-[10px] bg-blue-500/20 text-blue-300 font-mono px-1.5 py-0.2 rounded border border-blue-500/30">
                WK
              </span>
            )}
          </div>
          <span className="text-xs text-slate-400 block">
            {player.role}
          </span>
        </div>
      </div>

      {player.recentForm && player.recentForm.length > 0 && (
        <div className="text-right hidden sm:block">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 block">
            Recent Scores
          </span>
          <div className="flex items-center gap-1 font-mono text-xs text-slate-300">
            {player.recentForm.map((rf, i) => (
              <span key={i} className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                {rf}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 lg:p-6 space-y-8">
      {/* Head to Head Showdown Banner */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Swords className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-sm font-bold text-white">
              Head-to-Head Record ({match.format})
            </h3>
            <p className="text-xs text-slate-400">
              Historical match clashes in international cricket
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 font-mono text-xs">
          <div className="text-center">
            <span className="text-slate-400 block">{match.teamA.shortCode} Wins</span>
            <span className="text-lg font-bold text-emerald-400 tabular-nums">
              {h2h.teamAWins}
            </span>
          </div>
          <div className="text-center border-x border-slate-800 px-4">
            <span className="text-slate-400 block">Ties / Draws</span>
            <span className="text-lg font-bold text-slate-300 tabular-nums">
              {h2h.drawsOrTies}
            </span>
          </div>
          <div className="text-center">
            <span className="text-slate-400 block">{match.teamB.shortCode} Wins</span>
            <span className="text-lg font-bold text-amber-400 tabular-nums">
              {h2h.teamBWins}
            </span>
          </div>
        </div>
      </div>

      {/* Playing XIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Team A XI */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: match.teamA.primaryColor }}
              />
              <h4 className="font-bold text-white text-sm">
                {match.teamA.name} Playing XI
              </h4>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {teamA.length} Players
            </span>
          </div>

          <div className="space-y-2">
            {teamA.map(renderPlayerRow)}
          </div>
        </div>

        {/* Team B XI */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: match.teamB.primaryColor }}
              />
              <h4 className="font-bold text-white text-sm">
                {match.teamB.name} Playing XI
              </h4>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {teamB.length} Players
            </span>
          </div>

          <div className="space-y-2">
            {teamB.map(renderPlayerRow)}
          </div>
        </div>
      </div>
    </div>
  );
};
