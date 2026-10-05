/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_MATCHES } from './data/cricketData';
import { Match } from './types/cricket';
import { simulateBall } from './utils/cricketSimulator';
import { Header } from './components/Header';
import { MatchTicker } from './components/MatchTicker';
import { MatchHeader } from './components/MatchHeader';
import { LiveHud } from './components/LiveHud';
import { CommentaryView } from './components/CommentaryView';
import { FullScorecardView } from './components/FullScorecardView';
import { WagonWheelView } from './components/WagonWheelView';
import { AnalyticsView } from './components/AnalyticsView';
import { SquadsView } from './components/SquadsView';
import { StandingsView } from './components/StandingsView';
import { Bell, Radio, CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [matches, setMatches] = useState<Match[]>(() => INITIAL_MATCHES);
  const [selectedMatchId, setSelectedMatchId] = useState<string>('ind-aus-test-scg');
  const [activeTab, setActiveTab] = useState<string>('live');
  const [formatFilter, setFormatFilter] = useState<string>('ALL');
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [lastEventHeadline, setLastEventHeadline] = useState<string | undefined>(
    'Session 3 live · Cummins steaming in to Jadeja'
  );
  const [toastNotification, setToastNotification] = useState<{
    id: string;
    text: string;
    type: 'four' | 'six' | 'wicket' | 'normal';
  } | null>(null);

  const selectedMatch = matches.find((m) => m.id === selectedMatchId) || matches[0];
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger ball simulation
  const handleSimulateBall = () => {
    if (!selectedMatch || selectedMatch.status !== 'LIVE') return;

    const result = simulateBall(selectedMatch);
    setMatches((prev) =>
      prev.map((m) => (m.id === selectedMatch.id ? result.updatedMatch : m))
    );
    setLastEventHeadline(result.eventHeadline);

    // Toast notification for exciting events
    if (result.eventType === 'four' || result.eventType === 'six' || result.eventType === 'wicket') {
      const type = result.eventType;
      setToastNotification({
        id: String(Date.now()),
        text: result.eventHeadline,
        type,
      });

      setTimeout(() => {
        setToastNotification(null);
      }, 4000);
    }
  };

  // Auto-play live stream runner
  useEffect(() => {
    if (isAutoPlaying && selectedMatch.status === 'LIVE') {
      autoPlayTimerRef.current = setInterval(() => {
        handleSimulateBall();
      }, 3500);
    } else {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    }

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [isAutoPlaying, selectedMatchId, selectedMatch]);

  // Reset match to initial state
  const handleResetMatch = () => {
    const original = INITIAL_MATCHES.find((m) => m.id === selectedMatchId);
    if (original) {
      setMatches((prev) =>
        prev.map((m) => (m.id === selectedMatchId ? JSON.parse(JSON.stringify(original)) : m))
      );
      setLastEventHeadline('Match reset to initial session state');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* 3-zone Header Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAutoPlaying={isAutoPlaying}
        setIsAutoPlaying={setIsAutoPlaying}
        onSimulateBall={handleSimulateBall}
        isLiveMatch={selectedMatch.status === 'LIVE'}
      />

      {/* Global Matches Carousel & Format Switcher */}
      <MatchTicker
        matches={matches}
        selectedMatchId={selectedMatchId}
        onSelectMatch={(id) => {
          setSelectedMatchId(id);
          setIsAutoPlaying(false);
        }}
        formatFilter={formatFilter}
        setFormatFilter={setFormatFilter}
      />

      {/* Notification Toast for Fours / Sixes / Wickets */}
      {toastNotification && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce transition-all">
          <div
            className={`px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-3 text-xs sm:text-sm font-semibold max-w-md ${
              toastNotification.type === 'wicket'
                ? 'bg-rose-950 text-rose-200 border-rose-500/60 shadow-rose-950/60'
                : toastNotification.type === 'six'
                ? 'bg-purple-950 text-purple-200 border-purple-500/60 shadow-purple-950/60'
                : 'bg-blue-950 text-blue-200 border-blue-500/60 shadow-blue-950/60'
            }`}
          >
            <Radio className="w-4 h-4 animate-ping shrink-0" />
            <span className="truncate">{toastNotification.text}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* Match Header with Live Scoreboard, Run Rates & Win Probability */}
        <MatchHeader match={selectedMatch} />

        {/* View Container */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-6">
          {/* Tab 1: Live Center (HUD + Commentary) */}
          {activeTab === 'live' && (
            <div className="space-y-6">
              <LiveHud
                match={selectedMatch}
                onSimulateBall={handleSimulateBall}
                isAutoPlaying={isAutoPlaying}
                setIsAutoPlaying={setIsAutoPlaying}
                lastEventHeadline={lastEventHeadline}
                onResetMatch={handleResetMatch}
              />
              <CommentaryView commentary={selectedMatch.commentary} />
            </div>
          )}

          {/* Tab 2: Full Scorecard */}
          {activeTab === 'scorecard' && (
            <FullScorecardView match={selectedMatch} />
          )}

          {/* Tab 3: Shot Analytics & Wagon Wheel */}
          {activeTab === 'wagon' && (
            <WagonWheelView match={selectedMatch} />
          )}

          {/* Tab 4: Worm & Partnerships */}
          {activeTab === 'analytics' && (
            <AnalyticsView match={selectedMatch} />
          )}

          {/* Tab 5: Playing XIs & Head to Head */}
          {activeTab === 'squads' && (
            <SquadsView match={selectedMatch} />
          )}

          {/* Tab 6: Standings & Series Table */}
          {activeTab === 'standings' && (
            <StandingsView />
          )}
        </div>
      </main>

      {/* Clean Editorial Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400 uppercase tracking-wider">
              Pavilion Live
            </span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span>Real-time global cricket scorecard service</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
            <span>ICC WTC 2025-27</span>
            <span>·</span>
            <span>T20 World Cup</span>
            <span>·</span>
            <span>IPL 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
