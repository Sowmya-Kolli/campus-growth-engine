'use client';

import React, { useState, useEffect } from 'react';
import { DashboardStats } from '@/types';
import { CopilotRecommendation, generateGrowthCopilotRecommendations } from '@/lib/copilot';

interface GrowthCopilotProps {
  stats: DashboardStats;
  isDemoMode: boolean;
  onOpenBlitz: () => void;
  onNotify: (msg: string) => void;
}

export default function GrowthCopilot({
  stats,
  isDemoMode,
  onOpenBlitz,
  onNotify,
}: GrowthCopilotProps) {
  const [recommendations, setRecommendations] = useState<CopilotRecommendation[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [plannedActions, setPlannedActions] = useState<Record<string, { plannedAt: string; title: string }>>({});
  const [copied, setCopied] = useState<boolean>(false);

  // Re-generate recommendations whenever dataset or mode updates
  useEffect(() => {
    const recs = generateGrowthCopilotRecommendations(stats, isDemoMode);
    setRecommendations(recs);
    setSelectedIdx(0);
  }, [stats, isDemoMode]);

  // Load planned actions from session storage / localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('campus_growth_copilot_planned_actions');
      if (stored) {
        setPlannedActions(JSON.parse(stored));
      }
    } catch (err) {
      // ignore storage access errors
    }
  }, []);

  const savePlannedActions = (updated: Record<string, { plannedAt: string; title: string }>) => {
    setPlannedActions(updated);
    try {
      localStorage.setItem('campus_growth_copilot_planned_actions', JSON.stringify(updated));
    } catch (err) {
      // ignore
    }
  };

  const currentRec = recommendations[selectedIdx] || recommendations[0];

  if (!currentRec) return null;

  const isPlanned = Boolean(plannedActions[currentRec.id]);
  const plannedMeta = plannedActions[currentRec.id];

  const handleTogglePlan = () => {
    const updated = { ...plannedActions };
    if (isPlanned) {
      delete updated[currentRec.id];
      savePlannedActions(updated);
      onNotify(`Removed "${currentRec.title}" from today's planned actions.`);
    } else {
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      updated[currentRec.id] = {
        plannedAt: nowStr,
        title: currentRec.title,
      };
      savePlannedActions(updated);
      onNotify(`Action marked as Planned for execution (${nowStr}). Status: Planned — message has not been dispatched.`);
    }
  };

  const handleCopyMessage = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://campusgrowth.nxtwave.io';
    const finalMsg = currentRec.outreachMessage.replace('{SHARE_URL}', `${origin}/?ref=COPILOT-OPS`);
    navigator.clipboard.writeText(finalMsg);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
    onNotify('Outreach message copied to clipboard! Ready to paste into WhatsApp or broadcast.');
  };

  const totalPlannedCount = Object.keys(plannedActions).length;

  return (
    <section className="bg-surface-container-lowest rounded-2xl shadow-md border border-surface-container-high/80 overflow-hidden transition-all">
      {/* Top Banner Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-primary via-secondary to-primary-container"></div>

      {/* Copilot Header */}
      <div className="p-space-lg border-b border-surface-container-high/60 flex flex-col md:flex-row md:items-center justify-between gap-space-md bg-gradient-to-r from-surface-container-lowest via-surface-container-low/40 to-surface-container-lowest">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-sm border border-primary/20">
            <span className="material-symbols-outlined text-[26px]">smart_toy</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface tracking-tight">
                Campus Growth Copilot
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-badge-caption text-badge-caption uppercase font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                Next-Best-Action Engine
              </span>
              {isDemoMode ? (
                <span className="px-2 py-0.5 rounded text-badge-caption bg-secondary-container text-on-secondary-container font-bold uppercase">
                  Simulated Baseline
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-badge-caption bg-surface-container-high text-on-surface font-bold uppercase">
                  Genuine Data Logic
                </span>
              )}
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Evaluating current cohort velocity toward <strong>{stats.target || 500} unique registrations</strong> ({stats.regsRemaining || 496} remaining across 5 days)
            </p>
          </div>
        </div>

        {/* Planned Counter & Quick Blitz Button */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3 py-1.5 rounded-lg bg-surface-container-low border border-surface-container-high/60 text-on-surface font-label-sm text-label-sm font-semibold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[18px]">checklist</span>
            <span>
              {totalPlannedCount === 0
                ? '0 Actions Planned'
                : `${totalPlannedCount} Action${totalPlannedCount > 1 ? 's' : ''} Planned`}
            </span>
          </div>

          <button
            onClick={onOpenBlitz}
            className="flex items-center gap-1.5 bg-primary hover:bg-primary-container text-on-primary transition-all shadow-sm px-3.5 py-1.5 rounded-lg font-label-md text-label-md font-semibold cursor-pointer active:scale-95"
            title="Open Campaign Blitz Dispatch Modal"
          >
            <span className="material-symbols-outlined text-[18px]">electric_bolt</span>
            <span>Dispatch Blitz</span>
          </button>
        </div>
      </div>

      {/* Action Selector Pills */}
      <div className="px-space-lg pt-3 pb-2 border-b border-surface-container-high/40 flex items-center gap-2 overflow-x-auto bg-surface-container-low/30">
        <span className="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase tracking-wider shrink-0 mr-1">
          Recommendations:
        </span>
        {recommendations.map((rec, i) => {
          const isSelected = selectedIdx === i;
          const recPlanned = Boolean(plannedActions[rec.id]);
          return (
            <button
              key={rec.id}
              onClick={() => setSelectedIdx(i)}
              className={`px-3.5 py-1.5 rounded-lg font-label-sm text-label-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer border ${
                isSelected
                  ? 'bg-primary text-on-primary border-primary shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border-surface-container-high/60'
              }`}
            >
              <span>{`#${rec.priority} ${rec.category}`}</span>
              {recPlanned && (
                <span
                  className={`w-2 h-2 rounded-full ${
                    isSelected ? 'bg-on-primary' : 'bg-primary'
                  }`}
                  title="Marked as Planned"
                ></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Copilot Card Content (2 Columns) */}
      <div className="p-space-lg grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        {/* Left Column: Problem, Action, Target, Rationale, and Benchmark (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-space-md">
          <div className="space-y-space-sm">
            {/* Title & Category Badge */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-container/60 text-on-secondary-container font-badge-caption text-badge-caption uppercase font-bold">
                {currentRec.badge}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Target Audience: <strong>{currentRec.targetAudience}</strong>
              </span>
            </div>

            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface leading-tight">
              {currentRec.title}
            </h3>

            {/* Observed Problem Callout */}
            <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container-high/60 space-y-1">
              <div className="flex items-center gap-1.5 text-on-surface font-label-sm text-label-sm font-bold">
                <span className="material-symbols-outlined text-amber-700 text-[18px]">troubleshoot</span>
                <span>Observed Problem / Opportunity</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                {currentRec.observedProblem}
              </p>
            </div>

            {/* Recommended Action & Planning Target */}
            <div className="space-y-2">
              <div className="space-y-1">
                <span className="font-label-sm text-label-sm font-bold text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[18px]">task_alt</span>
                  <span>Recommended Action</span>
                </span>
                <p className="font-body-md text-body-md text-on-surface leading-relaxed pl-6">
                  {currentRec.recommendedAction}
                </p>
              </div>

              {/* Planning Target Metric (Explicitly Not a Forecast) */}
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">flag</span>
                  <div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant block">
                      Planning Target (Not a Forecast):
                    </span>
                    <span className="font-label-md text-label-md font-bold text-primary">
                      {currentRec.planningTarget}
                    </span>
                  </div>
                </div>
                <span className="font-badge-caption text-badge-caption text-on-surface-variant italic">
                  Operational Benchmark
                </span>
              </div>
            </div>

            {/* Rationale & Success Benchmark */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-lg bg-surface-container-low/60 border border-surface-container-high/40">
                <span className="font-label-sm text-label-sm font-bold text-on-surface block mb-1">
                  Why This Action?
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-normal">
                  {currentRec.rationale}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-surface-container-low/60 border border-surface-container-high/40">
                <span className="font-label-sm text-label-sm font-bold text-on-surface block mb-1">
                  Success Benchmark
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-normal">
                  {currentRec.successCriterion}
                </p>
              </div>
            </div>

            {/* Missing Data Transparent Disclosure (If in early genuine mode) */}
            {currentRec.missingDataNote && (
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-900 text-body-sm text-[12px] flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-700 text-[16px] shrink-0">info</span>
                <span>
                  <strong>Data Note:</strong> {currentRec.missingDataNote}
                </span>
              </div>
            )}
          </div>

          {/* Planned Status Feedback */}
          {isPlanned && plannedMeta && (
            <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-between text-label-sm font-label-sm text-primary">
              <span className="flex items-center gap-1.5 font-bold">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Status: In Today's Campaign Plan (Marked at {plannedMeta.plannedAt})</span>
              </span>
              <span className="text-[12px] text-on-surface-variant">
                Execution pending outreach
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Pre-Formatted WhatsApp Outreach Copy & Action Buttons (5 Cols) */}
        <div className="lg:col-span-5 bg-surface-container-low p-space-md rounded-xl border border-surface-container-high/60 flex flex-col justify-between space-y-space-md">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">chat</span>
                <span>Ready-to-Copy Outreach Copy</span>
              </span>
              <span className="font-badge-caption text-badge-caption text-on-surface-variant uppercase font-bold">
                WhatsApp / Class Reps
              </span>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Pre-drafted, high-converting copy customized for this specific recommendation:
            </p>

            {/* Copyable Message Box */}
            <div className="p-3.5 rounded-lg bg-surface-container-lowest border border-surface-container-high font-mono text-[12px] text-on-surface leading-relaxed relative select-all overflow-y-auto max-h-56">
              {currentRec.outreachMessage}
            </div>
          </div>

          {/* Interactive Action Buttons */}
          <div className="space-y-2 pt-2 border-t border-surface-container-high/60">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Copy Message Button */}
              <button
                onClick={handleCopyMessage}
                className="w-full py-2.5 px-3 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {copied ? 'check' : 'content_copy'}
                </span>
                <span>{copied ? 'Message Copied!' : 'Copy Message'}</span>
              </button>

              {/* Mark as Planned Interaction Button */}
              <button
                onClick={handleTogglePlan}
                className={`w-full py-2.5 px-3 rounded-lg font-label-md text-label-md font-bold flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer border ${
                  isPlanned
                    ? 'bg-surface-container-lowest text-primary border-primary hover:bg-surface-container'
                    : 'bg-surface-container-lowest text-on-surface border-surface-container-high hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] text-primary">
                  {isPlanned ? 'check_circle' : 'add_task'}
                </span>
                <span>{isPlanned ? 'Planned ✓' : 'Mark as Planned'}</span>
              </button>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant text-center text-[11px]">
              Note: Marking as planned records the action in your agenda without fabricating dispatch or registrations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
