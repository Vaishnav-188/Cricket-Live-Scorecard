import React, { useState } from 'react';
import { Match, InningsScorecard } from '../types/cricket';

interface FullScorecardViewProps {
  match: Match;
}

export const FullScorecardView: React.FC<FullScorecardViewProps> = ({ match }) => {
  const [selectedInningsIndex, setSelectedInningsIndex] = useState<number>(() => {
    // Default to currently active or last completed innings
    const currentIdx = match.innings.findIndex((inn) => inn.isCurrent);
    return currentIdx !== -1 ? currentIdx : Math.max(0, match.innings.length - 1);
  });

  const activeInnings: InningsScorecard | undefined = match.innings[selectedInningsIndex];

  if (!activeInnings) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
        Scorecard not yet available for this fixture.
      </div>
    );
  }

  const runRate = activeInnings.overs > 0 ? (activeInnings.runs / (Math.floor(activeInnings.overs) + (activeInnings.overs % 1) * (10 / 6))).toFixed(2) : '0.00';

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 lg:p-6 space-y-6">
      {/* Innings Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-slate-800">
        {match.innings.map((inn, idx) => {
          const isSelected = selectedInningsIndex === idx;
          return (
            <button
              key={idx}
              onClick={() => setSelectedInningsIndex(idx)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                isSelected
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {inn.teamName} ({inn.runs}/{inn.wickets})
            </button>
          );
        })}
      </div>

      {/* Innings Summary Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white">
            {activeInnings.teamName}
          </h3>
          <p className="text-xs text-slate-400">
            {activeInnings.declared ? 'Innings Declared' : activeInnings.isCurrent ? 'Current Innings' : 'Innings Complete'}
          </p>
        </div>

        <div className="flex items-baseline gap-4 font-mono">
          <div className="text-right">
            <span className="text-xs text-slate-500 block uppercase">Total Score</span>
            <span className="text-2xl font-extrabold text-emerald-400 tabular-nums">
              {activeInnings.runs}/{activeInnings.wickets}
            </span>
          </div>
          <div className="text-right border-l border-slate-800 pl-4">
            <span className="text-xs text-slate-500 block uppercase">Overs</span>
            <span className="text-lg font-bold text-slate-200 tabular-nums">
              {activeInnings.overs} ov
            </span>
          </div>
          <div className="text-right border-l border-slate-800 pl-4">
            <span className="text-xs text-slate-500 block uppercase">Run Rate</span>
            <span className="text-lg font-bold text-slate-200 tabular-nums">
              {runRate}
            </span>
          </div>
        </div>
      </div>

      {/* Batting Scorecard Table */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Batting
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs text-slate-400 font-semibold bg-slate-950/40">
                <th className="py-2.5 px-3">Batter</th>
                <th className="py-2.5 px-2">Dismissal</th>
                <th className="py-2.5 px-2 text-right">R</th>
                <th className="py-2.5 px-2 text-right">B</th>
                <th className="py-2.5 px-2 text-right">4s</th>
                <th className="py-2.5 px-2 text-right">6s</th>
                <th className="py-2.5 px-3 text-right">SR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {activeInnings.batting.map((batter) => {
                const isNotOut = !batter.isOut;
                return (
                  <tr key={batter.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-sans font-semibold text-white">
                      <div className="flex items-center gap-1.5">
                        <span className={isNotOut ? 'text-emerald-400' : 'text-slate-200'}>
                          {batter.name}
                        </span>
                        {isNotOut && <span className="text-emerald-400">*</span>}
                      </div>
                    </td>
                    <td className="py-3 px-2 font-sans text-xs text-slate-400 max-w-xs truncate">
                      {batter.dismissal}
                    </td>
                    <td className="py-3 px-2 text-right font-bold text-white text-base tabular-nums">
                      {batter.runs}
                    </td>
                    <td className="py-3 px-2 text-right text-slate-400 tabular-nums">
                      {batter.balls}
                    </td>
                    <td className="py-3 px-2 text-right text-slate-400 tabular-nums">
                      {batter.fours}
                    </td>
                    <td className="py-3 px-2 text-right text-slate-400 tabular-nums">
                      {batter.sixes}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-300 font-medium tabular-nums">
                      {batter.strikeRate.toFixed(1)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Extras & Did Not Bat */}
        <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 space-y-2">
          <div className="flex items-center justify-between">
            <span>
              <strong className="text-slate-300 font-sans">Extras:</strong>{' '}
              <span className="font-mono text-slate-200">{activeInnings.extras.total}</span>{' '}
              (b {activeInnings.extras.byes}, lb {activeInnings.extras.legByes}, w {activeInnings.extras.wides}, nb {activeInnings.extras.noBalls})
            </span>
            <span className="font-mono text-sm text-white font-bold">
              TOTAL: {activeInnings.runs}/{activeInnings.wickets} ({activeInnings.overs} Ov)
            </span>
          </div>

          {activeInnings.didNotBat && activeInnings.didNotBat.length > 0 && (
            <div className="pt-2 border-t border-slate-800/60">
              <strong className="text-slate-300">Did not bat:</strong>{' '}
              <span className="text-slate-400">
                {activeInnings.didNotBat.join(', ')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Fall of Wickets Timeline */}
      {activeInnings.fallOfWickets.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Fall of Wickets
          </h4>
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            {activeInnings.fallOfWickets.map((fow) => (
              <div
                key={fow.wicketNumber}
                className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-2"
              >
                <span className="font-bold text-rose-400">{fow.score}-{fow.wicketNumber}</span>
                <span className="text-slate-300 font-sans">{fow.batterName}</span>
                <span className="text-slate-500">({fow.over} ov)</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bowling Analysis Table */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Bowling Figures
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs text-slate-400 font-semibold bg-slate-950/40">
                <th className="py-2.5 px-3">Bowler</th>
                <th className="py-2.5 px-2 text-right">O</th>
                <th className="py-2.5 px-2 text-right">M</th>
                <th className="py-2.5 px-2 text-right">R</th>
                <th className="py-2.5 px-2 text-right">W</th>
                <th className="py-2.5 px-2 text-right">ECON</th>
                <th className="py-2.5 px-2 text-right">Dots</th>
                <th className="py-2.5 px-3 text-right">WD / NB</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {activeInnings.bowling.map((bowler) => (
                <tr key={bowler.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-sans font-semibold text-slate-200">
                    {bowler.name}
                  </td>
                  <td className="py-2.5 px-2 text-right text-slate-300 tabular-nums">
                    {bowler.overs}
                  </td>
                  <td className="py-2.5 px-2 text-right text-slate-400 tabular-nums">
                    {bowler.maidens}
                  </td>
                  <td className="py-2.5 px-2 text-right text-slate-300 tabular-nums">
                    {bowler.runs}
                  </td>
                  <td className="py-2.5 px-2 text-right font-bold text-rose-400 text-base tabular-nums">
                    {bowler.wickets}
                  </td>
                  <td className="py-2.5 px-2 text-right text-slate-300 font-medium tabular-nums">
                    {bowler.economy.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-2 text-right text-slate-400 tabular-nums">
                    {bowler.dots}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-500 tabular-nums text-xs">
                    {bowler.wides} / {bowler.noBalls}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
