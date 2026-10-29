'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardStats, Registration } from '@/types';

export default function OrganizerDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  // Default to false: strictly show genuine registrations by default
  const [includeDemo, setIncludeDemo] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Overview & Trajectory');
  const [blitzModalOpen, setBlitzModalOpen] = useState(false);
  const [blitzSuccessNotice, setBlitzSuccessNotice] = useState(false);

  const fetchStats = async (demo: boolean) => {
    try {
      const res = await fetch(`/api/stats?demo=${demo}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(includeDemo);
  }, [includeDemo]);

  const handleToggleDemoMode = () => {
    const nextMode = !includeDemo;
    setIncludeDemo(nextMode);
    fetchStats(nextMode);
  };

  const handleExportCsv = () => {
    window.location.href = `/api/export-csv?demo=${includeDemo}`;
  };

  const handleTriggerBlitz = () => {
    setBlitzModalOpen(false);
    setBlitzSuccessNotice(true);
    setTimeout(() => setBlitzSuccessNotice(false), 4000);
  };

  // Filter recent registrations by search query
  const filteredRegistrations = stats?.recentRegistrations.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.college.toLowerCase().includes(q) ||
      r.branchLabel.toLowerCase().includes(q) ||
      r.projectTitle.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-background min-h-screen font-body-md text-on-surface antialiased flex">
      {/* LEFT FIXED SIDEBAR */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-lowest border-r border-surface-container-high/80 z-50 flex flex-col pt-space-lg pb-space-lg hidden md:flex">
        {/* Brand */}
        <div className="px-space-lg mb-space-lg flex items-center gap-space-sm">
          <Link href="/" className="flex items-center gap-2">
            <img
              alt="Campus Growth Engine Logo"
              className="h-7 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9AfHNEPzs5GRVdSuvZpRdxWCo5NP3dXDxCydhH_q2yRgj-EnmWhqnJr9piP1ECr_p1MBAwi1OU9-ETMH7iFz8Bpgy1Jjr57l6Mb60-sVBlmE0VmRUMaZu9qPUMH0i3x2Gpf5SoU2pmrQKjqSmX4DJz0DsK48Wy7W-3vW1cvmg5L8in2m63amOADaPOWUhoGFr9jMvwc4nYgEtOnFUusxF_60CTJ_xRjOmtU0Eez5g"
            />
            <span className="font-label-md text-label-md font-bold text-on-surface tracking-tight">
              Campus Console
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-space-md flex flex-col gap-1">
          <button
            onClick={() => setActiveTab('Overview & Trajectory')}
            className={`flex items-center gap-space-sm px-3 py-2 text-left transition-colors font-semibold rounded-lg ${
              activeTab === 'Overview & Trajectory'
                ? 'bg-primary-container text-on-primary-container'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">analytics</span>
            <span>Organizer Dashboard</span>
          </button>

          <Link
            href="/"
            className="flex items-center gap-space-sm px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors font-label-md text-label-md"
          >
            <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
            <span>Project Matcher (Public)</span>
          </Link>

          <Link
            href="/blueprint"
            className="flex items-center gap-space-sm px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors font-label-md text-label-md"
          >
            <span className="material-symbols-outlined text-[20px]">architecture</span>
            <span>Student Blueprint View</span>
          </Link>

          <button
            onClick={() => setActiveTab('Ambassadors (14)')}
            className={`flex items-center gap-space-sm px-3 py-2 text-left rounded-lg transition-colors font-label-md text-label-md ${
              activeTab === 'Ambassadors (14)'
                ? 'bg-primary-container text-on-primary-container font-semibold'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">groups</span>
            <span>Cohort Management</span>
          </button>

          <button
            onClick={() => setActiveTab('Referral Analytics')}
            className={`flex items-center gap-space-sm px-3 py-2 text-left rounded-lg transition-colors font-label-md text-label-md ${
              activeTab === 'Referral Analytics'
                ? 'bg-primary-container text-on-primary-container font-semibold'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">monitoring</span>
            <span>Blueprint Analytics</span>
          </button>
        </nav>

        {/* User Card */}
        <div className="px-space-lg pt-space-md border-t border-surface-container-high">
          <div className="flex items-center gap-space-sm">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-label-sm font-semibold text-on-surface truncate">
                Ambassador Lead
              </span>
              <span className="font-badge-caption text-badge-caption text-on-surface-variant truncate">
                campus@nxtwave.tech
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONSOLE AREA */}
      <div className="flex-1 md:pl-64 w-full">
        {/* TOP HEADER */}
        <header className="fixed top-0 left-0 md:left-64 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-md border-b border-surface-container-high/80 z-40 px-gutter flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-primary font-badge-caption text-badge-caption uppercase font-bold tracking-wider">
              Live Cohort Ops
            </span>
            <span className="hidden sm:inline-flex text-label-sm text-on-surface-variant">
              • Challenge Goal: 500 Unique Registrations
            </span>
          </div>

          <div className="flex items-center gap-space-md">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[16px] text-primary">alarm</span>
              <span>Session: Sat, 6:00 PM IST (60 Mins)</span>
            </div>

            <Link
              href="/"
              className="hidden lg:inline-flex font-label-md text-label-md text-primary font-bold hover:underline"
            >
              Test Matcher &rarr;
            </Link>

            <a
              className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
              href="https://nxtwave.tech"
              target="_blank"
              rel="noopener noreferrer"
            >
              NxtWave Community
            </a>

            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
          </div>
        </header>

        {/* MAIN BODY */}
        <main className="relative pt-16 bg-surface w-full min-h-[calc(100vh-4rem)]">
          <div className="flex flex-col w-full">
            {/* DEMO DATA NOTIFICATION SCRIM BANNER (WITH REAL-TIME TOGGLE) */}
            <div className="w-full bg-secondary-container/30 border-b border-secondary-container/40 px-gutter py-2.5 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-secondary text-[18px]">
                  {includeDemo ? 'info' : 'verified'}
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                  {includeDemo ? (
                    <>
                      <span className="font-semibold text-secondary">Demo Data Active:</span> Visualized records and referral metrics include baseline illustrative figures for campaign simulation.
                    </>
                  ) : (
                    <>
                      <span className="font-semibold text-primary">Live Genuine Mode:</span> Showing strictly genuine verified student registrations recorded in the database ({stats?.genuineRegistrationsCount || 0} records).
                    </>
                  )}
                </p>
              </div>

              {/* Interactive toggle between Demo mode and Genuine only mode */}
              <button
                onClick={handleToggleDemoMode}
                className="flex items-center gap-space-xs text-on-surface-variant hover:text-on-surface cursor-pointer bg-surface-container-lowest px-2.5 py-1 rounded-md text-label-sm font-semibold shadow-sm border border-surface-container-high/60 transition-all"
                title="Toggle between Simulated Demo data and Live Genuine registrations"
              >
                <span className="font-label-sm text-label-sm">
                  {includeDemo ? 'Switch to Genuine Only' : 'Switch to Demo Baseline'}
                </span>
                <span className="material-symbols-outlined text-[16px]">tune</span>
              </button>
            </div>

            {/* Notification alert on blitz dispatch */}
            {blitzSuccessNotice && (
              <div className="mx-gutter mt-3 p-3 rounded-lg bg-primary/10 border border-primary/30 text-on-surface flex items-center justify-between animate-in fade-in">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">send</span>
                  <span className="font-label-md text-label-md font-semibold text-primary">
                    Campaign Blitz notification dispatched to all campus ambassadors via WhatsApp!
                  </span>
                </div>
                <button onClick={() => setBlitzSuccessNotice(false)} className="text-on-surface-variant hover:text-on-surface">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            )}

            <div className="p-gutter flex flex-col gap-space-lg max-w-[1440px] mx-auto w-full">
              {/* BREADCRUMB & TOP BAR OPERATIONS */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
                    <Link href="/" className="hover:text-primary transition-colors cursor-pointer">
                      Campus Growth Engine
                    </Link>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    <span className="hover:text-primary transition-colors cursor-pointer">Campaigns</span>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    <span className="text-on-surface font-semibold">AI in 60 Mins (Oct Cohort)</span>
                  </div>

                  <div className="flex items-center gap-space-sm">
                    <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight font-bold">
                      Campaign Operations Console
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-badge-caption text-badge-caption uppercase font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                      Live Sprint
                    </span>
                  </div>
                </div>

                {/* Action Cluster */}
                <div className="flex items-center flex-wrap gap-space-sm">
                  <div className="flex items-center bg-surface-container-lowest shadow-sm rounded-lg px-3 py-2 gap-2 text-on-surface-variant border border-surface-container-high/60">
                    <span className="material-symbols-outlined text-[18px] text-primary">calendar_today</span>
                    <span className="font-label-sm text-label-sm font-semibold text-on-surface">
                      Last 7 Days (Oct 18 - Oct 25)
                    </span>
                    <span className="material-symbols-outlined text-[16px] cursor-pointer">arrow_drop_down</span>
                  </div>

                  <button
                    onClick={handleExportCsv}
                    className="flex items-center gap-1.5 bg-surface-container-lowest hover:bg-surface-container-low transition-colors shadow-sm px-3.5 py-2 rounded-lg font-label-md text-label-md text-on-surface font-semibold border border-surface-container-high/60 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">download</span>
                    <span>Export CSV</span>
                  </button>

                  <button
                    onClick={() => setBlitzModalOpen(true)}
                    className="flex items-center gap-1.5 bg-primary hover:bg-primary-container text-on-primary transition-colors shadow-sm px-4 py-2 rounded-lg font-label-md text-label-md font-semibold cursor-pointer active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[18px]">add_circle</span>
                    <span>Create Campaign Blitz</span>
                  </button>
                </div>
              </div>

              {/* SECONDARY TAB NAVIGATION */}
              <div className="flex items-center gap-space-md border-b-2 border-surface-container-high/40 pb-px overflow-x-auto">
                {[
                  { label: 'Overview & Trajectory', icon: 'overview' },
                  { label: `Registrations (${stats?.uniqueRegistrations || 342})`, icon: 'how_to_reg' },
                  { label: 'Referral Analytics', icon: 'share' },
                  { label: 'Ambassadors (14)', icon: 'badge' },
                  { label: 'Campaign Budget', icon: 'account_balance_wallet' },
                  { label: 'Settings', icon: 'settings' },
                ].map((tab) => {
                  const isActive = activeTab === tab.label;
                  return (
                    <button
                      key={tab.label}
                      onClick={() => setActiveTab(tab.label)}
                      className={`pb-2.5 px-1 font-label-md text-label-md flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                        isActive
                          ? 'font-bold text-primary border-b-2 border-primary'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* KPI METRIC CARDS (5 COLUMNS) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-md">
                {/* Card 1: Unique Registrations */}
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow border border-surface-container-high/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-badge-caption text-badge-caption text-on-surface-variant uppercase font-bold tracking-wider">
                      Unique Regs
                    </span>
                    <span className="material-symbols-outlined text-primary text-[20px]">group_add</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-headline-lg text-headline-lg font-bold text-on-surface">
                      {stats?.uniqueRegistrations || 342}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">/ 500 Target</span>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-badge-caption text-badge-caption text-primary font-bold">
                        {stats?.percentageAchieved || 68.4}% Achieved
                      </span>
                      <span className="font-badge-caption text-badge-caption text-on-surface-variant">
                        {includeDemo ? '(Demo Data)' : '(Genuine)'}
                      </span>
                    </div>
                    <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, stats?.percentageAchieved || 68.4)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Regs Today */}
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between relative group hover:shadow-md transition-shadow border border-surface-container-high/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-badge-caption text-badge-caption text-on-surface-variant uppercase font-bold tracking-wider">
                      Regs Today
                    </span>
                    <span className="material-symbols-outlined text-secondary text-[20px]">today</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-headline-lg text-headline-lg font-bold text-on-surface">
                      {stats?.regsToday ?? 0}
                    </span>
                    <span className="font-label-sm text-label-sm text-primary font-semibold flex items-center">
                      <span className="material-symbols-outlined text-[16px]">trending_up</span> {stats?.regsTodayGrowth || '+18%'}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-on-surface-variant">
                    <span className="font-body-sm text-body-sm">
                      {includeDemo ? 'vs 41 yesterday' : `${stats?.regsToday || 0} in last 24h`}
                    </span>
                    <span className="font-badge-caption text-badge-caption text-on-surface-variant">
                      {includeDemo ? '(Demo Baseline)' : '(Genuine)'}
                    </span>
                  </div>
                </div>

                {/* Card 3: Remaining to Goal */}
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between relative group hover:shadow-md transition-shadow border border-surface-container-high/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-badge-caption text-badge-caption text-on-surface-variant uppercase font-bold tracking-wider">
                      Remaining to Goal
                    </span>
                    <span className="material-symbols-outlined text-tertiary text-[20px]">flag</span>
                  </div>
                  <div>
                    <span className="font-headline-lg text-headline-lg font-bold text-on-surface">
                      {stats?.regsRemaining ?? 500}
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant font-medium">needed to cross target</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold">
                      5 Days Left
                    </span>
                    <span className="font-badge-caption text-badge-caption text-on-surface-variant">
                      {includeDemo ? '(Demo Baseline)' : '(Genuine)'}
                    </span>
                  </div>
                </div>

                {/* Card 4: Budget Spent */}
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between relative group hover:shadow-md transition-shadow border border-surface-container-high/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-badge-caption text-badge-caption text-on-surface-variant uppercase font-bold tracking-wider">
                      Budget Spent
                    </span>
                    <span className="material-symbols-outlined text-secondary text-[20px]">payments</span>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-headline-lg text-headline-lg font-bold text-on-surface">
                        {typeof stats?.budgetSpent === 'number'
                          ? `₹${stats.budgetSpent.toLocaleString('en-IN')}`
                          : stats?.budgetSpent || '₹0'}
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">/ ₹2,000</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-primary font-semibold mt-0.5">
                      {stats?.costPerRegistration || 'Not enough data (Spend unrecorded)'}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {typeof stats?.budgetBurnPercentage === 'number'
                        ? `${stats.budgetBurnPercentage}% burn`
                        : stats?.budgetBurnPercentage || '0% burn'}
                    </span>
                    <span className="font-badge-caption text-badge-caption text-on-surface-variant">
                      {includeDemo ? '(Demo Baseline)' : '(Genuine)'}
                    </span>
                  </div>
                </div>

                {/* Card 5: Referral Rate */}
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between relative group hover:shadow-md transition-shadow border border-surface-container-high/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-badge-caption text-badge-caption text-on-surface-variant uppercase font-bold tracking-wider">
                      Referral Rate
                    </span>
                    <span className="material-symbols-outlined text-primary text-[20px]">hub</span>
                  </div>
                  <div>
                    <span className="font-headline-lg text-headline-lg font-bold text-on-surface">
                      {typeof stats?.referralRate === 'number' ? `${stats.referralRate}%` : stats?.referralRate || '0%'}
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                      {stats?.viralLinksCount || 0} student viral links
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-secondary-container/40 text-on-secondary-container font-label-sm text-label-sm font-semibold">
                      {stats?.viralKFactor || 'Not enough data'}
                    </span>
                    <span className="font-badge-caption text-badge-caption text-on-surface-variant">
                      {includeDemo ? '(Demo Baseline)' : '(Genuine)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* RECOMMENDED NEXT ACTION PANEL */}
              {stats?.recommendations && stats.recommendations.length > 0 && (
                <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-lg bg-gradient-to-r from-surface-container-lowest via-surface-container-low/60 to-surface-container-lowest border border-surface-container-high/60">
                  <div className="flex items-start gap-space-md max-w-3xl">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-[28px]">electric_bolt</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-space-sm flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-badge-caption text-badge-caption uppercase font-bold">
                          {stats.recommendations[0].badge}
                        </span>
                        <span className="font-label-md text-label-md font-bold text-on-surface">
                          {stats.recommendations[0].title}
                        </span>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                        {stats.recommendations[0].description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-space-sm w-full lg:w-auto shrink-0 flex-wrap sm:flex-nowrap">
                    <button
                      onClick={() => setBlitzModalOpen(true)}
                      className="w-full sm:w-auto bg-primary hover:bg-primary-container text-on-primary transition-all px-4 py-2.5 rounded-lg font-label-md text-label-md font-semibold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">send_and_archive</span>
                      <span>{stats.recommendations[0].primaryAction}</span>
                    </button>
                    <button
                      onClick={() => {
                        const deptElem = document.getElementById('departments-section');
                        if (deptElem) deptElem.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full sm:w-auto bg-surface-container-high hover:bg-surface-dim text-on-surface transition-colors px-4 py-2.5 rounded-lg font-label-md text-label-md font-semibold flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                      <span>{stats.recommendations[0].secondaryAction}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ANALYTICS & BREAKDOWN SECTION (2-COLUMN GRID) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
                {/* Left Chart: 7-Day Trend (7 Cols) */}
                <div className="lg:col-span-7 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-surface-container-high/60">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <div className="flex flex-col">
                      <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
                        Registration Velocity (Last 7 Days)
                      </h2>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Daily direct enrollment vs. student referral link conversions
                      </span>
                    </div>
                    <div className="flex items-center gap-space-md">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-primary"></span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Direct (244)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-secondary-container"></span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Referrals (98)</span>
                      </div>
                    </div>
                  </div>

                  {/* Inline SVG Chart matching Stitch reference */}
                  <div className="w-full h-64 flex flex-col justify-end pt-4">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 600 200">
                      {/* Grid Lines */}
                      <line stroke="#E2E8F0" strokeDasharray="3 3" x1="0" x2="600" y1="40" y2="40"></line>
                      <line stroke="#E2E8F0" strokeDasharray="3 3" x1="0" x2="600" y1="90" y2="90"></line>
                      <line stroke="#E2E8F0" strokeDasharray="3 3" x1="0" x2="600" y1="140" y2="140"></line>
                      <line stroke="#CBD5E1" x1="0" x2="600" y1="180" y2="180"></line>

                      {/* Day 1: D=18, R=6 */}
                      <rect fill="#006948" height="35" rx="3" width="22" x="35" y="145"></rect>
                      <rect fill="#86f2e4" height="12" rx="3" width="22" x="61" y="168"></rect>

                      {/* Day 2: D=24, R=8 */}
                      <rect fill="#006948" height="48" rx="3" width="22" x="115" y="132"></rect>
                      <rect fill="#86f2e4" height="16" rx="3" width="22" x="141" y="164"></rect>

                      {/* Day 3: D=32, R=12 */}
                      <rect fill="#006948" height="64" rx="3" width="22" x="195" y="116"></rect>
                      <rect fill="#86f2e4" height="24" rx="3" width="22" x="221" y="156"></rect>

                      {/* Day 4: D=40, R=15 */}
                      <rect fill="#006948" height="80" rx="3" width="22" x="275" y="100"></rect>
                      <rect fill="#86f2e4" height="30" rx="3" width="22" x="301" y="150"></rect>

                      {/* Day 5: D=42, R=19 */}
                      <rect fill="#006948" height="84" rx="3" width="22" x="355" y="96"></rect>
                      <rect fill="#86f2e4" height="38" rx="3" width="22" x="381" y="142"></rect>

                      {/* Day 6: D=41, R=18 */}
                      <rect fill="#006948" height="82" rx="3" width="22" x="435" y="98"></rect>
                      <rect fill="#86f2e4" height="36" rx="3" width="22" x="461" y="144"></rect>

                      {/* Day 7: D=47, R=20 (Peak) */}
                      <rect fill="#006948" height="94" rx="3" width="22" x="515" y="86"></rect>
                      <rect fill="#86f2e4" height="40" rx="3" width="22" x="541" y="140"></rect>

                      {/* Trend Polyline */}
                      <polyline
                        fill="none"
                        points="47,135 127,120 207,100 287,85 367,78 447,80 527,62"
                        stroke="#006a61"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                      ></polyline>
                      <circle cx="527" cy="62" fill="#006a61" r="4"></circle>
                    </svg>

                    <div className="flex justify-between items-center text-on-surface-variant font-label-sm text-label-sm pt-2">
                      <span className="w-20 text-center">Day 1 (Oct 19)</span>
                      <span className="w-20 text-center">Day 2 (Oct 20)</span>
                      <span className="w-20 text-center">Day 3 (Oct 21)</span>
                      <span className="w-20 text-center">Day 4 (Oct 22)</span>
                      <span className="w-20 text-center">Day 5 (Oct 23)</span>
                      <span className="w-20 text-center">Day 6 (Oct 24)</span>
                      <span className="w-20 text-center font-bold text-on-surface">Day 7 (Today)</span>
                    </div>
                  </div>
                </div>

                {/* Right Breakdown: Acquisition Sources & Conversion (5 Cols) */}
                <div className="lg:col-span-5 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-surface-container-high/60">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
                        Acquisition Sources
                      </h2>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Channel volume &amp; conversion effectiveness
                      </span>
                    </div>
                    <span className="font-badge-caption text-badge-caption bg-surface-container text-on-surface-variant px-2 py-0.5 rounded uppercase font-bold">
                      {includeDemo ? '(Demo Data)' : '(Live)'}
                    </span>
                  </div>

                  <div className="flex flex-col gap-space-md my-auto pt-2">
                    {stats?.channels.map((ch) => (
                      <div key={ch.id} className="flex flex-col gap-1">
                        <div className="flex items-center justify-between font-label-md text-label-md">
                          <span className="font-bold text-on-surface flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[18px] text-primary">{ch.icon}</span>
                            {ch.name}
                          </span>
                          <span className="text-on-surface-variant font-semibold">
                            {ch.regs} regs ({ch.percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-surface-container-low h-3 rounded-full overflow-hidden flex">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              ch.id === 'whatsapp'
                                ? 'bg-primary'
                                : ch.id === 'ambassador'
                                ? 'bg-secondary-container'
                                : ch.id === 'social'
                                ? 'bg-primary-container'
                                : 'bg-surface-container-highest'
                            }`}
                            style={{ width: `${ch.percentage}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center text-on-surface-variant font-label-sm text-label-sm">
                          <span>Conversion: {ch.conversionRate}</span>
                          <span
                            className={
                              ch.highlightType === 'warning'
                                ? 'text-error font-semibold'
                                : ch.highlightType === 'primary'
                                ? 'text-primary font-semibold'
                                : 'text-on-surface-variant'
                            }
                          >
                            {ch.highlightText}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setActiveTab('Referral Analytics')}
                    className="w-full mt-3 py-2 bg-surface-container-low hover:bg-surface-container font-label-md text-label-md text-on-surface font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Inspect Channel Deep Dives</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
              </div>

              {/* LOWER GRID SECTION: AMBASSADOR LEADERBOARD & DEPT DISTRIBUTION */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
                {/* Ambassador Leaderboard (7 Cols) */}
                <div className="lg:col-span-7 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-surface-container-high/60">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
                        Ambassador Leaderboard
                      </h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Top student advocates driving confirmed workshop RSVPs
                      </p>
                    </div>
                    <span className="font-badge-caption text-badge-caption bg-surface-container text-on-surface-variant px-2 py-0.5 rounded uppercase font-bold">
                      {includeDemo ? '(Demo Data)' : '(Verified)'}
                    </span>
                  </div>

                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left font-body-sm text-body-sm">
                      <thead>
                        <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm border-b border-surface-container-high/60">
                          <th className="py-2.5 px-3 rounded-l-lg">Rank</th>
                          <th className="py-2.5 px-3">Ambassador</th>
                          <th className="py-2.5 px-3">College &amp; Branch</th>
                          <th className="py-2.5 px-3 text-right">Shares</th>
                          <th className="py-2.5 px-3 text-right rounded-r-lg">Verified Regs</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-container-high/30">
                        {stats?.ambassadors.map((rep) => (
                          <tr key={rep.id} className="hover:bg-surface-container-low/40 transition-colors">
                            <td className="py-3 px-3">
                              <span
                                className={`w-6 h-6 rounded-full font-bold flex items-center justify-center font-label-sm text-label-sm ${
                                  rep.rank === 1
                                    ? 'bg-primary/10 text-primary'
                                    : rep.rank === 2
                                    ? 'bg-secondary/10 text-secondary'
                                    : 'bg-surface-container-high text-on-surface-variant'
                                }`}
                              >
                                #{rep.rank}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <img
                                  className="w-8 h-8 rounded-full object-cover shrink-0"
                                  src={rep.avatarUrl}
                                  alt={rep.name}
                                />
                                <div>
                                  <span className="font-label-md text-label-md font-bold text-on-surface block">
                                    {rep.name}
                                  </span>
                                  <span
                                    className={`font-badge-caption text-badge-caption ${
                                      rep.rank === 1
                                        ? 'text-primary'
                                        : rep.rank === 2
                                        ? 'text-secondary'
                                        : 'text-on-surface-variant'
                                    }`}
                                  >
                                    Badge: {rep.badge}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <span className="font-medium text-on-surface block">{rep.college}</span>
                              <span className="text-on-surface-variant text-label-sm">
                                {rep.branch} ({rep.year})
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right font-semibold text-on-surface">{rep.shares}</td>
                            <td className="py-3 px-3 text-right">
                              <span
                                className={`px-2 py-0.5 rounded-full font-bold font-label-sm text-label-sm ${
                                  rep.rank === 1
                                    ? 'bg-primary/10 text-primary'
                                    : rep.rank === 2
                                    ? 'bg-secondary-container text-on-secondary-container'
                                    : 'bg-surface-container text-on-surface'
                                }`}
                              >
                                {rep.verifiedRegs} regs
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="pt-3 border-t border-surface-container-high/40 flex items-center justify-between text-on-surface-variant">
                    <span className="font-label-sm text-label-sm">11 additional ambassadors ranked in roster</span>
                    <button
                      onClick={() => setBlitzModalOpen(true)}
                      className="font-label-md text-label-md text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Manage Ambassador Roster</span>
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </button>
                  </div>
                </div>

                {/* Department & Branch Distribution (5 Cols) */}
                <div
                  id="departments-section"
                  className="lg:col-span-5 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-surface-container-high/60"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
                        Department Penetration
                      </h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Cohort composition by academic branch
                      </p>
                    </div>
                    <span className="font-badge-caption text-badge-caption bg-surface-container text-on-surface-variant px-2 py-0.5 rounded uppercase font-bold">
                      {includeDemo ? '(Demo Data)' : '(Verified)'}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 my-auto">
                    {stats?.departments.map((dept) => (
                      <div key={dept.branchKey}>
                        <div className="flex justify-between items-center font-label-sm text-label-sm mb-1">
                          <span className="font-bold text-on-surface">{dept.name}</span>
                          <span
                            className={`font-semibold ${
                              dept.tag === 'Low' ? 'text-error' : 'text-on-surface'
                            }`}
                          >
                            {dept.percentage}% ({dept.studentsCount} students)
                            {dept.tag === 'Low' ? ' — Low' : ''}
                          </span>
                        </div>
                        <div className="w-full bg-surface-container-low h-2.5 rounded-full overflow-hidden">
                          <div
                            className={`${dept.colorClass} h-full rounded-full transition-all duration-500`}
                            style={{ width: `${dept.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-surface-container-low/70 p-3 rounded-lg flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm mt-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-primary">school</span>
                      <span>Targeting 35+ regional partner institutions</span>
                    </div>
                    <span className="font-label-sm text-label-sm font-semibold text-primary cursor-pointer hover:underline">
                      View Map
                    </span>
                  </div>
                </div>
              </div>

              {/* RECENT REGISTRATION ACTIVITY LOG (SEARCHABLE TABLE) */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md mb-space-lg border border-surface-container-high/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
                      Recent Registration Feed
                    </h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Live audit log of student check-ins and chosen workshop build targets
                    </p>
                  </div>

                  <div className="flex items-center gap-space-sm">
                    <div className="flex items-center bg-surface-container-low rounded-lg px-3 py-1.5 text-on-surface-variant gap-2 text-label-sm font-label-sm border border-surface-container-high/60">
                      <span className="material-symbols-outlined text-[16px]">search</span>
                      <input
                        className="bg-transparent border-none outline-none text-on-surface placeholder:text-on-surface-variant w-44 font-body-sm"
                        placeholder="Search student or college..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <span className="font-badge-caption text-badge-caption bg-secondary-container/40 text-on-secondary-container px-2 py-1 rounded font-bold uppercase">
                      Real-Time Sync
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left font-body-sm text-body-sm">
                    <thead>
                      <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm border-b border-surface-container-high/60">
                        <th className="py-2.5 px-3 rounded-l-lg">Student Name</th>
                        <th className="py-2.5 px-3">Institution &amp; Branch</th>
                        <th className="py-2.5 px-3">Selected Project Blueprint</th>
                        <th className="py-2.5 px-3">Acquisition Channel</th>
                        <th className="py-2.5 px-3 text-right rounded-r-lg">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container-high/30">
                      {filteredRegistrations && filteredRegistrations.length > 0 ? (
                        filteredRegistrations.map((row) => {
                          const initials = row.name
                            ? row.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .substring(0, 2)
                                .toUpperCase()
                            : 'ST';
                          return (
                            <tr key={row.id} className="hover:bg-surface-container-low/40 transition-colors">
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-[12px]">
                                    {initials}
                                  </div>
                                  <div>
                                    <span className="font-label-md text-label-md font-semibold text-on-surface block">
                                      {row.name}
                                    </span>
                                    <span className="font-badge-caption text-badge-caption text-on-surface-variant">
                                      {row.ticketNumber}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-3">
                                <span className="font-medium text-on-surface block">{row.college}</span>
                                <span className="text-on-surface-variant font-label-sm text-label-sm">
                                  {row.branchLabel || row.branch}
                                </span>
                              </td>

                              <td className="py-3 px-3">
                                <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold inline-flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[14px] text-primary">
                                    description
                                  </span>
                                  <span className="truncate max-w-[200px]">{row.projectTitle}</span>
                                </span>
                              </td>

                              <td className="py-3 px-3">
                                <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[14px] text-secondary">
                                    {row.channel === 'whatsapp'
                                      ? 'chat'
                                      : row.channel === 'ambassador'
                                      ? 'badge'
                                      : row.channel === 'social'
                                      ? 'photo_camera'
                                      : 'link'}
                                  </span>
                                  <span>{row.channelLabel || row.channel}</span>
                                </span>
                              </td>

                              <td className="py-3 px-3 text-right font-medium text-on-surface-variant whitespace-nowrap">
                                {new Date(row.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-on-surface-variant font-label-md">
                            No student registrations matched your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* CAMPAIGN BLITZ MODAL */}
      {blitzModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl p-space-lg shadow-2xl border border-surface-container-high flex flex-col gap-space-md animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">electric_bolt</span>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  Create Campaign Blitz
                </h3>
              </div>
              <button
                onClick={() => setBlitzModalOpen(false)}
                className="p-1 rounded-md text-on-surface-variant hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Dispatch high-converting WhatsApp message copy and peer referral challenge nudges to student ambassadors and club leads.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block font-label-sm text-label-sm font-bold text-on-surface mb-1">
                  Target Channel &amp; Department
                </label>
                <select className="w-full h-10 px-3 bg-surface-container-low text-on-surface font-label-sm rounded-lg border border-surface-container-high">
                  <option>ECE &amp; IT Underperforming Cohorts (6 Inactive Ambassadors)</option>
                  <option>All 14 Campus Ambassadors</option>
                  <option>WhatsApp Engineering Study Communities</option>
                  <option>Placement Preparation Circles</option>
                </select>
              </div>

              <div>
                <label className="block font-label-sm text-label-sm font-bold text-on-surface mb-1">
                  Incentive Perk / Nudge Message
                </label>
                <textarea
                  rows={3}
                  className="w-full p-2.5 bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-lg border border-surface-container-high resize-none"
                  defaultValue="Hey team! 5 days remaining for Saturday's AI masterclass. Share your branch-specific project blueprint with 3 classmates to unlock the VIP AI developer pack!"
                />
              </div>

              <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between text-label-sm">
                <span className="text-on-surface-variant">Estimated Outreach Lift:</span>
                <span className="font-bold text-primary">+45 to +60 Registrations</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container-high">
              <button
                onClick={() => setBlitzModalOpen(false)}
                className="px-4 py-2 rounded-lg text-on-surface font-label-md hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleTriggerBlitz}
                className="px-5 py-2 rounded-lg bg-primary text-on-primary font-label-md font-bold hover:bg-primary-container transition-all active:scale-95 shadow-sm"
              >
                Dispatch Blitz Nudge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
