import React from 'react';
import { Match } from '../types/cricket';
import { MapPin, CloudSun, Award, HelpCircle } from 'lucide-react';

interface MatchHeaderProps {
  match: Match;
}

export const MatchHeader: React.FC<MatchHeaderProps> = ({ match }) => {
  const prob = match.currentSituation?.winProbability;
  const teamAWin = prob?.teamA ?? 50;
  const teamBWin = prob?.teamB ?? 50;
  const drawProb = prob?.draw ?? 0;

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-5">
        {/* Editorial kicker & breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-3">
          <span className="font-semibold text-emerald-400 uppercase tracking-wider">
            {match.series}
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>{match.matchTitle}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="flex items-center gap-1 text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            {match.venue}, {match.city}
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="flex items-center gap-1 text-slate-400">
            <CloudSun className="w-3.5 h-3.5 text-amber-400" />
            {match.weather.condition}, {match.weather.tempC}°C
          </span>
        </div>

        {/* Main Scoreboard Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Teams and Scores (Cols 1-8) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Team A Card */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  match.teamA.isBatting
                    ? 'bg-slate-950/80 border-slate-700 ring-1 ring-emerald-500/20 shadow-sm'
                    : 'bg-slate-950/40 border-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full ring-2 ring-slate-800"
                      style={{ backgroundColor: match.teamA.primaryColor }}
                    />
                    <span className="font-bold text-base text-white tracking-wide">
                      {match.teamA.name}
                    </span>
                    {match.teamA.isBatting && (
                      <span className="text-[11px] font-semibold text-emerald-400 font-mono tracking-wider">
                        BATTING
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-slate-400 uppercase">
                    {match.teamA.shortCode}
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-100 tabular-nums">
                    {match.teamA.score}
                  </span>
                  {match.teamA.currentOvers > 0 && (
                    <span className="text-xs font-mono text-slate-400">
                      {match.teamA.currentOvers} overs
                    </span>
                  )}
                </div>
              </div>

              {/* Team B Card */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  match.teamB.isBatting
                    ? 'bg-slate-950/80 border-slate-700 ring-1 ring-emerald-500/20 shadow-sm'
                    : 'bg-slate-950/40 border-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full ring-2 ring-slate-800"
                      style={{ backgroundColor: match.teamB.primaryColor }}
                    />
                    <span className="font-bold text-base text-white tracking-wide">
                      {match.teamB.name}
                    </span>
                    {match.teamB.isBatting && (
                      <span className="text-[11px] font-semibold text-emerald-400 font-mono tracking-wider">
                        BATTING
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-slate-400 uppercase">
                    {match.teamB.shortCode}
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-100 tabular-nums">
                    {match.teamB.score}
                  </span>
                  {match.teamB.currentOvers > 0 && (
                    <span className="text-xs font-mono text-slate-400">
                      {match.teamB.currentOvers} overs
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Live Match Situation Text */}
            <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-lg flex items-center justify-between gap-3 text-xs sm:text-sm">
              <span className="font-medium text-emerald-300">
                {match.statusText}
              </span>
              {match.currentSituation?.requiredRunRate !== undefined && (
                <div className="flex items-center gap-3 text-xs font-mono text-slate-300 shrink-0">
                  <span>CRR: <strong className="text-white">{match.currentSituation.currentRunRate}</strong></span>
                  <span className="text-slate-600">·</span>
                  <span>RRR: <strong className="text-emerald-400">{match.currentSituation.requiredRunRate}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Win Probability & Telemetry (Cols 9-12) */}
          <div className="lg:col-span-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-slate-300">
                Live Win Predictor
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Model: Ball-by-ball DLS
              </span>
            </div>

            {/* Visual Probability Bar */}
            <div className="h-3 rounded-full bg-slate-800 overflow-hidden flex shadow-inner">
              <div
                className="bg-emerald-500 transition-all duration-500 h-full"
                style={{ width: `${teamAWin}%` }}
                title={`${match.teamA.name}: ${teamAWin}%`}
              />
              {drawProb > 0 && (
                <div
                  className="bg-slate-500 transition-all duration-500 h-full"
                  style={{ width: `${drawProb}%` }}
                  title={`Draw: ${drawProb}%`}
                />
              )}
              <div
                className="bg-amber-500 transition-all duration-500 h-full"
                style={{ width: `${teamBWin}%` }}
                title={`${match.teamB.name}: ${teamBWin}%`}
              />
            </div>

            {/* Probability percentages breakdown */}
            <div className="flex items-center justify-between text-xs font-mono pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-slate-300">{match.teamA.shortCode}</span>
                <span className="font-bold text-white tabular-nums">{teamAWin}%</span>
              </div>
              {drawProb > 0 && (
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-slate-500" />
                  <span>Draw</span>
                  <span className="font-bold text-slate-300 tabular-nums">{drawProb}%</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-slate-300">{match.teamB.shortCode}</span>
                <span className="font-bold text-white tabular-nums">{teamBWin}%</span>
              </div>
            </div>

            {/* Pitch & Toss Quick Note */}
            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
              <p className="truncate">
                <strong className="text-slate-300">Toss:</strong> {match.toss}
              </p>
              <p className="truncate">
                <strong className="text-slate-300">Surface:</strong> {match.pitchReport}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
