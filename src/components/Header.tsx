import React from 'react';
import { Volume2, VolumeX, Play, Pause, Radio } from 'lucide-react';
import { isSoundMuted, setSoundMuted } from '../utils/audioFeedback';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAutoPlaying: boolean;
  setIsAutoPlaying: (val: boolean | ((prev: boolean) => boolean)) => void;
  onSimulateBall: () => void;
  isLiveMatch: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isAutoPlaying,
  setIsAutoPlaying,
  onSimulateBall,
  isLiveMatch,
}) => {
  const [muted, setMutedState] = React.useState(isSoundMuted());

  const toggleSound = () => {
    const next = !muted;
    setSoundMuted(next);
    setMutedState(next);
  };

  const navLinks = [
    { id: 'live', label: 'Live Center' },
    { id: 'scorecard', label: 'Full Scorecard' },
    { id: 'wagon', label: 'Shot Analytics' },
    { id: 'analytics', label: 'Worm & Manhattan' },
    { id: 'squads', label: 'Playing XIs' },
    { id: 'standings', label: 'Standings' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('live')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-lg lg:text-xl font-extrabold tracking-tight text-white group-hover:text-emerald-400 transition-colors uppercase">
              Pavilion<span className="text-emerald-400">Live</span>
            </span>
          </button>
          <span className="hidden sm:inline-block text-xs font-mono text-slate-500 border-l border-slate-800 pl-3">
            Global Cricket Hub
          </span>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 lg:gap-3 shrink-0">
          {/* Audio toggle */}
          <button
            onClick={toggleSound}
            title={muted ? 'Unmute pitch audio' : 'Mute pitch audio'}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors"
            aria-label="Toggle audio effects"
          >
            {muted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Auto-Play stream toggle */}
          {isLiveMatch && (
            <button
              onClick={() => setIsAutoPlaying(prev => !prev)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all whitespace-nowrap ${
                isAutoPlaying
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-600'
              }`}
            >
              {isAutoPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400 animate-pulse" />
                  <span className="hidden sm:inline">Auto-Live Stream</span>
                  <span className="sm:hidden">Auto</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-slate-400 fill-slate-400" />
                  <span className="hidden sm:inline">Auto Stream</span>
                  <span className="sm:hidden">Play</span>
                </>
              )}
            </button>
          )}

          {/* Single-ball simulation quick action */}
          {isLiveMatch && (
            <button
              onClick={onSimulateBall}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-lg shadow-sm shadow-emerald-950 transition-all whitespace-nowrap"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Simulate Ball</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile navigation tab row */}
      <div className="flex md:hidden overflow-x-auto gap-2 pt-2.5 mt-2 border-t border-slate-800/60 no-scrollbar">
        {navLinks.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors rounded ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
